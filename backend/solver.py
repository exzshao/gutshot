from postflop_solver_python import PostFlopSolver

def run_solver(oop_range, ip_range, flop, turn, river, bet_sizes, raise_sizes):
    solver = PostFlopSolver(
        oop_range=oop_range,
        ip_range=ip_range,
        flop=flop,
        turn=turn,
        river=river,
        bet_sizes=bet_sizes,
        raise_sizes=raise_sizes
    )
    actions = solver.get_available_actions()
    exploitability = solver.solve(max_iterations=100, target_exploitability=1.0)
