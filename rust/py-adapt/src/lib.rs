use pyo3::prelude::*;
use postflop_solver::*;

#[pyclass]
struct PostFlopSolver {
    game: PostFlopGame,
}

#[pymethods]
impl PostFlopSolver {
    #[new]
    #[pyo3(signature = (oop_range, ip_range, flop, starting_pot, effective_stack, turn=None, river=None))]
    fn new(
        oop_range: &str,
        ip_range: &str,
        flop: &str,
        starting_pot: i32,
        effective_stack: i32,
        turn: Option<&str>,
        river: Option<&str>,
    ) -> PyResult<Self> {
        // Parse ranges
        let oop_range = oop_range.parse()
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Invalid OOP range: {}", e)))?;
        let ip_range = ip_range.parse()
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Invalid IP range: {}", e)))?;

        // Parse flop
        let flop = flop_from_str(flop)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Invalid flop: {}", e)))?;

        // Parse turn
        let turn = if let Some(turn_str) = turn {
            card_from_str(turn_str)
                .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Invalid turn: {}", e)))?
        } else {
            NOT_DEALT
        };

        // Parse river
        let river = if let Some(river_str) = river {
            card_from_str(river_str)
                .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Invalid river: {}", e)))?
        } else {
            NOT_DEALT
        };

        let card_config = CardConfig {
            range: [oop_range, ip_range],
            flop,
            turn,
            river,
        };

        let bet_sizes = BetSizeOptions::try_from(("60%, e, a", "2.5x"))
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("{}", e)))?;

        let initial_state = if river != NOT_DEALT {
            BoardState::River
        } else if turn != NOT_DEALT {
            BoardState::Turn
        } else {
            BoardState::Flop
        };

        let tree_config = TreeConfig {
            initial_state,
            starting_pot,
            effective_stack,
            rake_rate: 0.0,
            rake_cap: 0.0,
            flop_bet_sizes: [bet_sizes.clone(), bet_sizes.clone()],
            turn_bet_sizes: [bet_sizes.clone(), bet_sizes.clone()],
            river_bet_sizes: [bet_sizes.clone(), bet_sizes],
            turn_donk_sizes: None,
            river_donk_sizes: None,
            add_allin_threshold: 1.5,
            force_allin_threshold: 0.15,
            merging_threshold: 0.1,
        };

        let action_tree = ActionTree::new(tree_config)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("{}", e)))?;

        let game = PostFlopGame::with_config(card_config, action_tree)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("{}", e)))?;

        Ok(PostFlopSolver { game })
    }

    fn solve(&mut self, max_iterations: u32, target_exploitability: f32) -> PyResult<f32> {
        self.game.allocate_memory(false);
        Ok(solve(&mut self.game, max_iterations, target_exploitability, true))
    }

    fn get_private_cards(&self, player: usize) -> PyResult<Vec<String>> {
        let cards = self.game.private_cards(player);
        holes_to_strings(&cards)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyValueError, _>(format!("Failed to convert cards: {}", e)))
    }

    fn get_equity(&mut self, player: usize) -> PyResult<Vec<f32>> {
        self.game.cache_normalized_weights();
        Ok(self.game.equity(player).to_vec())
    }

    fn get_strategy(&self) -> PyResult<Vec<f32>> {
        Ok(self.game.strategy().to_vec())
    }

    fn get_available_actions(&self) -> PyResult<Vec<String>> {
        Ok(self.game.available_actions()
            .iter()
            .map(|action| format!("{:?}", action))
            .collect())
    }

    fn play(&mut self, action_index: usize) -> PyResult<()> {
        self.game.play(action_index);
        Ok(())
    }

    fn back_to_root(&mut self) -> PyResult<()> {
        self.game.back_to_root();
        Ok(())
    }
}

#[pymodule]
fn postflop_solver_python(_py: Python<'_>, m: &PyModule) -> PyResult<()> {
    m.add_class::<PostFlopSolver>()?;
    Ok(())
}