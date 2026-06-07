import os
import requests
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key found!")
        return

    # Read the context file
    context = ""
    try:
        with open("context.md", "r", encoding="utf-8") as f:
            context = f.read()
    except Exception as e:
        print(f"Warning: Could not read context.md - {e}")

    system_prompt = f"""You are the Master AI Guardian for SavingsClub.com.

You have access to the following permanent context about the website:

{context}

Your priorities:
1. Compliance & Risk Management (Highest)
2. Cybersecurity
3. SEO & Content Strategy

Rules:
- Always follow the strict rules mentioned in the context file.
- Use simple, plain language.
- Verify information multiple times before giving recommendations.
- Be conservative and never suggest risky products.
- Structure reports clearly with headings and bullet points.
- Ask for user approval before suggesting any changes."""

    user_message = os.environ.get("GUARDIAN_COMMAND", 
        "Run a full audit for SavingsClub.com including Compliance, Cybersecurity, SEO, and Content. Provide clear and actionable recommendations.")

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 5500,
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
