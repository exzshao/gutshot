from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()
client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "i have 5h 5d. board comes with 3 diamonds. whats a possible board here?"}
    ]
)



print(completion.choices[0].message.content)