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

Your priorities (in order):
1. Compliance & Risk Management (Highest)
2. Cybersecurity (for static Netlify sites)
3. SEO & Content Strategy

Important Rules:
- Work with publicly available information only unless the user explicitly gives you access.
- For Cybersecurity: Focus on what can be checked publicly + general best practices for Netlify static sites.
- Do NOT repeatedly ask for repo access, Netlify dashboard access, or private information.
- Be practical and actionable.
- Structure reports with clear headings and bullet points.
- Always ask for approval before suggesting changes."""

    user_message = os.environ.get("GUARDIAN_COMMAND", 
        "Run a full audit for SavingsClub.com including Compliance, Cybersecurity, SEO, and Content. Focus on what can be checked publicly and give practical recommendations.")

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
    print("MASTER AI GUARDIAN REPORT (Phase 2 - Cybersecurity Enabled)")
    print("="*80 + "\n")
    print(report)
    print("\n" + "="*80)
    print("END OF REPORT")
    print("="*80)

if __name__ == "__main__":
    main()
