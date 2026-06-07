import os
import requests
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key found!")
        return

    system_prompt = "You are the Master AI Guardian for SavingsClub.com. Your highest priority is compliance and risk. Always explain clearly and ask for permission before suggesting changes."

    user_message = os.environ.get("GUARDIAN_COMMAND", 
        "Run a general weekly audit for SavingsClub.com. Focus on compliance, SEO, and content opportunities.")

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 4000,
        "messages": [
            {"role": "user", "content": system_prompt + "\n\n" + user_message}
        ]
    }

    print("Calling Claude API...")
    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)

    if response.status_code != 200:
        print("API Error:", response.text)
        return

    report = response.json()["content"][0]["text"]

    print("\n" + "="*70)
    print("MASTER AI GUARDIAN REPORT")
    print("="*70 + "\n")
    print(report)
    print("\n" + "="*70)
    print("END OF REPORT")
    print("="*70)

if __name__ == "__main__":
    main()
