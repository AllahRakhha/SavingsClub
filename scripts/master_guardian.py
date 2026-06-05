import os
import requests
from datetime import datetime

CLAUDE_API_KEY = os.environ.get("CLAUDE_API_KEY")

def call_claude(prompt):
    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 5000,
        "messages": [{"role": "user", "content": prompt}]
    }
    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
    return response.json()["content"][0]["text"]

def main():
    print("Running Master AI Guardian...")
    
    if not CLAUDE_API_KEY:
        print("ERROR: API key not found")
        return

    # Read the prompt file you already created
    with open("prompts/SavingsClub_Master_AI_Guardian_Prompt.md", "r", encoding="utf-8") as f:
        system_prompt = f.read()

    user_message = "You are now running in WEEKLY AUDIT mode. Please analyze SavingsClub.com and create a clear report with compliance, SEO, and content recommendations. Always ask for permission before suggesting any changes."

    report = call_claude(system_prompt + "\n\n" + user_message)

    filename = f"weekly_guardian_report_{datetime.now().strftime('%Y-%m-%d')}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(report)

    print("Report generated successfully!")

if __name__ == "__main__":
    main()
