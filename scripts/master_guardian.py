import os
import requests
from datetime import datetime

CLAUDE_API_KEY = os.environ.get("CLAUDE_API_KEY")

def call_claude(system_prompt, user_message):
    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 6000,
        "system": system_prompt,
        "messages": [
            {"role": "user", "content": user_message}
        ]
    }
    
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers=headers,
        json=data
    )
    return response.json()["content"][0]["text"]

# Load the Master Guardian System Prompt
with open("prompts/Master_AI_Guardian_System_Prompt.md", "r", encoding="utf-8") as f:
    SYSTEM_PROMPT = f.read()

def run_weekly_audit():
    print("Running Master AI Guardian Weekly Audit...")
    
    user_message = f"""You are now in WEEKLY AUDIT mode.

Perform a comprehensive audit of SavingsClub.com covering:
1. Compliance & Risk (highest priority)
2. SEO issues
3. Content opportunities
4. Any technical or design observations (limited)

Key pages to focus on:
- https://savingsclub.com/
- https://savingsclub.com/high-yield-savings-accounts/
- https://savingsclub.com/emergency-fund/
- https://savingsclub.com/retirement-calculator/
- https://savingsclub.com/credit-card-payoff-calculator/

Generate a clear, prioritized report with explanations and recommendations.
Always end with specific questions asking for permission on next actions.
"""
    
    report = call_claude(SYSTEM_PROMPT, user_message)
    
    filename = f"weekly_guardian_report_{datetime.now().strftime('%Y-%m-%d')}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(report)
    
    print(f"✅ Weekly audit report saved to {filename}")
    return report

if __name__ == "__main__":
    run_weekly_audit()
