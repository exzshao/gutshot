# wasm-postflop engine adapted to python

**Creating solver**: 

```py
solver = PostFlopSolver(
    oop_range="...",
    ip_range="...",
    flop="...",
    starting_pot=200,
    effective_stack=900,
    turn="...",  # optional
    river="...",  # optional
    bet_sizes="...",  # optional
    raise_sizes="..."  # optional
)
```

**Available methods**:

```py
solver.solve(max_iterations, target_exploitability)
solver.get_private_cards(player)
solver.get_equity(player)
solver.get_strategy()
solver.get_available_actions()
solver.play(action_index)
solver.back_to_root()
```