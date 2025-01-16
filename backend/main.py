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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ranges = {
    "inPosition": [],
    "outOfPosition": []
}
class Ranges(BaseModel):
    inPosition: List[str]
    outOfPosition: List[str]

@app.post("/api/ranges")
async def handle_ranges(data: Ranges):
    ranges["inPosition"] = data.inPosition
    ranges["outOfPosition"] = data.outOfPosition
    return {
        "received_ranges": {
            "inPosition": data.inPosition,
            "outOfPosition": data.outOfPosition
        },
        "status": "success"
    }

@app.post("/api/chat")
async def handle_chat(data: dict):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an assistant that helps users with poker-related questions and provides accurate information about possible boards. Be brief."},
            {"role": "user", "content": data["message"]}
        ]
    )
    return {
        "response": completion.choices[0].message.content
    }


# completion = client.chat.completions.create(
#     model="gpt-4o-mini",
#     messages=[
#         {"role": "system", "content": "You are an assistant that helps users with poker-related questions and provides accurate information about possible boards. Be brief."},
#         {"role": "user", "content": "Button opens for 3bb, I call on bb. What would be a typical range for me and button? Output the range in comma-separated format using standard notation (e.g., 'AA,KK,AKs')"}
#     ]
# )

# print(completion.choices[0].message.content)