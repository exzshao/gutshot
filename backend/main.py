from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List  # Added this import

load_dotenv()
client = OpenAI()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend URL
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Ranges(BaseModel):
    ip_range: List[str]
    oop_range: List[str]

class SolverInferData(BaseModel): # TODO: this should actually just contain -> player specific hand, flop, turn, river, actions
    flop: str
    turn: Optional[str] = None
    river: Optional[str] = None
    player_hand: Optional[str] = None
    # bet_sizes: Optional[str] = None # TODO remove bet sizes and raise sizes from this and add as separate UI cuz LLM gets confused.
    # raise_sizes: Optional[str] = None
    actions: Optional[List[str]] = None
    other_notes: Optional[str] = None

class BetAndRaiseSizes(BaseModel):
    bet_sizes: List[int]
    raise_sizes: List[int]

ranges = {
    "ip_range": [],
    "oop_range": []
}

@app.post("/api/ranges")
async def handle_ranges(data: Ranges):
    ranges["ip_range"] = data.ip_range
    ranges["oop_range"] = data.oop_range
    return {
        "received_ranges": {
            "ip_range": data.ip_range,
            "oop_range": data.oop_range
        },
        "status": "success"
    }

@app.post("/api/chat")
async def handle_chat(data: dict):
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"""
                Extract structured poker solver data from user messages. 
                Return the data in JSON format matching this schema:
                {{
                    "flop": "<Flop cards> or null if not provided",
                    "turn": "<Turn card> or null if not provided",
                    "river": "<River card> or null if not provided",
                    "player_hand": "<Player hand> or null if not provided",
                    "actions": ["<action1>", "<action2>", ...],
                    "other_notes": "<Other notes> or null if not provided"
                }}

                IMPORTANT:
                1. All card values must be standardized to abbreviated format. For example, output "Qd" for "queen of diamonds", "10h" for "10 of hearts", "5s" for "5 of spades", etc. Even if the user writes full names (e.g., "queen of dimonds, 10 of hearts, 5 of spades"), output the cards as "Qd", "10h", "5s".
                2. If a card's suit is not specified (e.g., just "queen"), choose a random valid suit (c, d, h, or s) and output in abbreviated format.
                3. All actions should be standardized. Use lower-case action names and a consistent format. For example, output actions as "check", "fold", "call", "bet(<amount>)", "raise(<amount>)", "allin(<amount>)".
                4. Any parts of the message that are not relevant to the structured data should go in other notes.
             """},
            {"role": "user", "content": data["message"]}
        ],
        response_format=SolverInferData,
    )
    # TODO: Also need to extract ACTIONS from user message and play these actions in solver.
    solver_data = completion.choices[0].message.parsed
    return {
        "response": completion.choices[0].message.content,
        "solver_data": solver_data.dict(),
        "current_range": ranges
    }


# completion = client.chat.completions.create(
#     model="gpt-4o-mini",
#     messages=[
#         {"role": "system", "content": "You are an assistant that helps users with poker-related questions and provides accurate information about possible boards. Be brief."},
#         {"role": "user", "content": "Button opens for 3bb, I call on bb. What would be a typical range for me and button? Output the range in comma-separated format using standard notation (e.g., 'AA,KK,AKs')"}
#     ]
# )

# print(completion.choices[0].message.content)