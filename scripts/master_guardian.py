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

Your priorities:
1. Compliance & Risk (Highest)
2. Cybersecurity
3. SEO & Content Strategy

Rules:
- Be honest, conservative, and practical.
- Structure every report with clear headings and bullet points.
- Make suggestions specific and actionable.
- Use simple language.
- End with a short "Next Steps" section with clear recommendations.
- Do not repeat the same suggestions unnecessarily."""

    user_message = os.environ.get("GUARDIAN_COMMAND", 
        "Run a full audit for SavingsClub.com. Include Compliance, Cybersecurity, SEO, and Content. Make suggestions clear and actionable.")

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 5000,
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
