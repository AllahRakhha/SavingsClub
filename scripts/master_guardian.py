import os
import requests
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key found!")
        return

    system_prompt = """You are the Master AI Guardian for SavingsClub.com.

Your role:
- Act as a helpful, honest, and conservative AI assistant for a personal finance website.
- Prioritize Compliance & Risk first.
- Then focus on SEO and Content opportunities.
- Always be clear, structured, and actionable.
- Never make up information. If unsure, say so.
- Format your responses with clear headings and bullet points."""

    user_message = os.environ.get("GUARDIAN_COMMAND", 
        "Run a general weekly audit for SavingsClub.com. Focus on compliance, SEO, and content opportunities. Give clear and actionable suggestions.")

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 4500,
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

    print("\n" + "="*80)
    print("MASTER AI GUARDIAN REPORT")
    print("="*80 + "\n")
    print(report)
    print("\n" + "="*80)
    print("END OF REPORT")
    print("="*80)

if __name__ == "__main__":
    main()
