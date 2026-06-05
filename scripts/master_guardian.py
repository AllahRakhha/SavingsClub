import os
import requests
from datetime import datetime

def main():
    print("Starting Master AI Guardian...")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: Claude API key not found!")
        return

    # Read the system prompt
    try:
        with open("prompts/SavingsClub_Master_AI_Guardian_Prompt.md", "r", encoding="utf-8") as f:
            system_prompt = f.read()
    except FileNotFoundError:
        print("ERROR: Prompt file not found!")
        return

    # Simple message for weekly audit
    user_message = """You are running in WEEKLY AUDIT mode for SavingsClub.com.
Please analyze the website for compliance risks, SEO issues, and content opportunities.
Create a clear report and always ask for permission before suggesting any changes."""

    # Call Claude
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 4000,
        "messages": [
            {"role": "user", "content": system_prompt + "\n\n" + user_message}
        ]
    }

    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
    report = response.json()["content"][0]["text"]

    # Save report
    filename = f"weekly_guardian_report_{datetime.now().strftime('%Y-%m-%d')}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(report)

    print("Report generated successfully!")

if __name__ == "__main__":
    main()
