from openai import OpenAI

client = OpenAI(
    api_key="97f2d1ee038a47a1bdee596a4cb17c8b",
    base_url="https://api.aimlapi.com",
)

# Initial conversation with the AI assistant
initial_prompt = [
    {
        "role": "system",
        "content": "You are a medical AI assistant who can recommend specialists based on symptoms."
    },
    {
        "role": "assistant",
        "content": "Please describe your symptoms so that I can recommend a specialist."
    }
]

# Simulating a user input of symptoms
user_input = "I have a persistent cough and shortness of breath."

# Adding the user's symptoms to the conversation
conversation = initial_prompt + [
    {
        "role": "user",
        "content": user_input
    }
]

# Sending the conversation to the model
response = client.chat.completions.create(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    messages=conversation
)

# Extracting the AI's response which would contain the specialist recommendation
message = response.choices[0].message.content
print(f"Assistant: {message}")
