from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from typing import Optional  # Added this import


app = FastAPI()

# Define the data structure we expect to receive
class DataInput(BaseModel):
    message: str
    timestamp: Optional[str] = None

@app.post("/api/data")
async def handle_data(data: DataInput):
    return {
        "received_message": data.message,
        "received_timestamp": data.timestamp,
        "server_timestamp": datetime.now().isoformat(),
        "status": "success"
    }
# load_dotenv()
# client = OpenAI()

# completion = client.chat.completions.create(
#     model="gpt-4o-mini",
#     messages=[
#         {"role": "system", "content": "You are an assistant that helps users with poker-related questions and provides accurate information about possible boards. Be brief."},
#         {"role": "user", "content": "Button opens for 3bb, I call on bb. What would be a typical range for me and button? Output the range in comma-separated format using standard notation (e.g., 'AA,KK,AKs')"}
#     ]
# )

# print(completion.choices[0].message.content)