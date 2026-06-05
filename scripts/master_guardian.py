import os
import requests
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key found in secrets!")
        return

    SYSTEM_PROMPT = "You are the Master AI Guardian for SavingsClub.com. Your highest priority is compliance and risk. Always explain clearly and ask for permission before suggesting changes."

    user_message = "Run a weekly audit for SavingsClub.com. Focus on compliance risks first, then SEO and content opportunities."

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 3000,
        "messages": [
            {"role": "user", "content": SYSTEM_PROMPT + "\n\n" + user_message}
        ]
    }

    print("Calling Claude API...")
    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)

    print(f"API Status Code: {response.status_code}")

    if response.status_code != 200:
        print("=== API ERROR ===")
        print(response.text)
        print("=================")
        return

    try:
        result = response.json()
        report = result["content"][0]["text"]

        print("\n" + "="*50)
        print("MASTER AI GUARDIAN REPORT")
        print("="*50 + "\n")
        print(report)
        print("\n" + "="*50)

    except Exception as e:
        print(f"Error parsing response: {e}")
        print("Full response:", response.text)

if __name__ == "__main__":
    main()
