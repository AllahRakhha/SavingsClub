import os
import requests
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key!")
        return

    # Read prompt
    with open("prompts/SavingsClub_Master_AI_Guardian_Prompt.md", "r", encoding="utf-8") as f:
        system_prompt = f.read()

    user_message = "You are running a weekly audit for SavingsClub.com. Focus on compliance and risk first. Then give SEO and content suggestions. Always ask for permission before recommending changes."

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 4000,
        "messages": [{"role": "user", "content": system_prompt + "\n\n" + user_message}]
    }

    print("Calling Claude...")
    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
    report = response.json()["content"][0]["text"]

    print("\n" + "="*50)
    print("MASTER AI GUARDIAN REPORT")
    print("="*50 + "\n")
    print(report)
    print("\n" + "="*50)
    print("END OF REPORT")
    print("="*50)

    # Also try to save file
    filename = f"weekly_guardian_report_{datetime.now().strftime('%Y-%m-%d')}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"\nReport also saved as file: {filename}")

if __name__ == "__main__":
    main()
