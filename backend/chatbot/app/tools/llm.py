import requests
from typing import List, Dict
from app.tools.config import DEEPSEEK_API_URL, DEEPSEEK_API_KEY

def generate_response(query: str, contexts: List[Dict] = None):
    """Generate response using DeepSeek API"""
    try:
        context_text = ""
        if contexts and len(contexts) > 0:
            context_text = "Based on previous similar queries:\n"
            for i, ctx in enumerate(contexts):
                context_text += f"{i+1}. Query: {ctx.get('metadata', {}).get('query', 'Unknown')}\n"
                context_text += f"   Response: {ctx.get('metadata', {}).get('document', 'No response')}\n\n"

        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"{context_text}\nUser query: {query}\nPlease provide a helpful response."}
            ],
            "temperature": 0.7
        }

        response = requests.post(
            f"{DEEPSEEK_API_URL}/v1/chat/completions",
            headers=headers,
            json=payload
        )

        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            print(f"Error from DeepSeek API: {response.text}")
            return "I'm sorry, I couldn't generate a response at this time."
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I'm sorry, I encountered an error while generating a response."