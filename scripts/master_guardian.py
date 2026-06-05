import os
import requests
from datetime import datetime

SYSTEM_PROMPT = """You are the Master AI Guardian for SavingsClub.com. Your top priority is Compliance & Risk. Always check for legal, regulatory, or trust issues first. You also help with SEO, content strategy, and limited technical/design advice. Rules: 1. Always explain findings clearly. 2. Always ask for permission before suggesting changes. 3. Be specific. 4. If unsure about regulations, say so."""

def main():
    print("=== Master AI Guardian Started ===")
    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key")
        return

    user_message = "Run a weekly audit for SavingsClub.com. Focus first on compliance and risk, then SEO and content. Create a clear report."

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 4000,
        "messages": [{"role": "user", "content": SYSTEM_PROMPT + "\n\n" + user_message}]
    }

    print("Calling Claude...")
    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
    report = response.json()["content"][0]["text"]

    print("\n" + "="*50)
    print("MASTER AI GUARDIAN REPORT")
    print("="*50)
    print(report)
    print("="*50)

if __name__ == "__main__":
    main()
