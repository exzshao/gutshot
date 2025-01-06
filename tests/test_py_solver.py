from postflop_solver_python import PostFlopSolver

def test_solver():
    try:
        # Initialize solver with the same parameters from your example
        solver = PostFlopSolver(
            oop_range="66+,A8s+,A5s-A4s,AJo+,K9s+,KQo,QTs+,JTs,96s+,85s+,75s+,65s,54s",
            ip_range="QQ-22,AQs-A2s,ATo+,K5s+,KJo+,Q8s+,J8s+,T7s+,96s+,86s+,75s+,64s+,53s+",
            flop="Td9d6h",
            starting_pot=200,
            effective_stack=900,
            turn="Qc"
        )
        print("✅ Solver initialized successfully")

        # Test getting available actions
        actions = solver.get_available_actions()
        print(f"Available actions: {actions}")

        # Test solving
        print("Solving... (this might take a few seconds)")
        exploitability = solver.solve(max_iterations=100, target_exploitability=1.0)
        print(f"Exploitability: {exploitability}")

        # Test getting private cards
        oop_cards = solver.get_private_cards(player=0)
        print(f"First 5 OOP hands: {oop_cards[:5]}")

        # Test playing actions
        solver.play(0)  # Play first available action
        new_actions = solver.get_available_actions()
        print(f"New available actions after playing: {new_actions}")

        # Test going back to root
        solver.back_to_root()
        root_actions = solver.get_available_actions()
        print(f"Actions at root: {root_actions}")

        print("\n🎉 All tests passed!")

    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_solver()