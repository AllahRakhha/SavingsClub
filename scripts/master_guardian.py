import os
import requests
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key found!")
        return

    # Read prompt
    try:
        with open("prompts/SavingsClub_Master_AI_Guardian_Prompt.md", "r", encoding="utf-8") as f:
            system_prompt = f.read()
        print("Prompt file loaded successfully.")
    except Exception as e:
        print(f"ERROR loading prompt: {e}")
        return

    user_message = "Run a weekly audit for SavingsClub.com. Focus on compliance risks first, then SEO and content. Create a clear report."

    # Call Claude
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 3000,
        "messages": [{"role": "user", "content": system_prompt + "\n\n" + user_message}]
    }

    print("Calling Claude API...")
    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
    
    if response.status_code != 200:
        print(f"API Error: {response.text}")
        return

    report = response.json()["content"][0]["text"]
    print("Report received from Claude.")

    # Save report
    filename = f"weekly_guardian_report_{datetime.now().strftime('%Y-%m-%d')}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"Report saved as: {filename}")
    print("=== Master AI Guardian Finished Successfully ===")

if __name__ == "__main__":
    main()
