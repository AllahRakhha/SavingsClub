import os
import requests
from datetime import datetime

SYSTEM_PROMPT = """You are the Master AI Guardian for SavingsClub.com.

Your top priority is Compliance & Risk. Always check for legal, regulatory, or trust issues first.

You also help with SEO, content strategy, and limited technical/design advice.

Rules:
1. Always explain your findings clearly.
2. Always ask for permission before suggesting any changes.
3. Be specific and actionable.
4. If you're unsure about regulations, say so clearly."""

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key found")
        return

    user_message = "Run a weekly audit for SavingsClub.com. Focus first on compliance and risk, then SEO and content opportunities. Create a clear report and ask for permission before any recommendations."

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 4000,
        "messages": [
            {"role": "user", "content": SYSTEM_PROMPT + "\n\n" + user_message}
        ]
    }

    print("Calling Claude API...")
    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
    report = response.json()["content"][0]["text"]

    print("\n" + "="*60)
    print("MASTER AI GUARDIAN REPORT")
    print("="*60 + "\n")
    print(report)
    print("\n" + "="*60)
    print("END OF REPORT")
    print("="*60)

if __name__ == "__main__":
    main()
