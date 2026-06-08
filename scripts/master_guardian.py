import os
import requests
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key found!")
        return

    # Read context.md
    context = ""
    try:
        with open("context.md", "r", encoding="utf-8") as f:
            context = f.read()
    except Exception as e:
        print(f"Warning: Could not read context.md - {e}")

    # Read feedback.md
    feedback = ""
    try:
        with open("feedback.md", "r", encoding="utf-8") as f:
            feedback = f.read()
    except Exception as e:
        print(f"Warning: Could not read feedback.md - {e}")

    system_prompt = f"""You are the Master AI Guardian for SavingsClub.com.

You have access to two important files:

1. context.md (Permanent information about the website):
{context}

2. feedback.md (Ongoing feedback and learnings):
{feedback}

Your priorities:
1. Compliance & Risk Management (Highest)
2. Cybersecurity
3. SEO & Content Strategy

Report Rules (Very Important):
- Keep reports **clear, short, and actionable**.
- Use simple headings and bullet points.
- Start with the most important findings first.
- Limit suggestions to the **top priorities** (maximum 8–10 points when possible).
- End every report with a short section called **"Recommended Next Steps"** with clear actions.
- Use **simple and plain language** — avoid technical jargon.
- Do not repeat the same suggestions unnecessarily.
- Be conservative and practical. Never suggest risky ideas.

Always follow the rules in context.md and feedback.md."""

    user_message = os.environ.get("GUARDIAN_COMMAND", 
        "Run a full audit for SavingsClub.com including Compliance, Cybersecurity, SEO, and Content. Provide clear and actionable recommendations.")

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
