import os
import requests
from github import Github, Auth
from datetime import datetime
import re

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    github_token = os.environ.get("AGENT_GITHUB_TOKEN")

    if not api_key or not github_token:
        print("ERROR: Missing API keys!")
        return

    user_command = os.environ.get("GUARDIAN_COMMAND", "")
    user_command_lower = user_command.lower()

    # Read context.md and feedback.md
    context = ""
    try:
        with open("context.md", "r", encoding="utf-8") as f:
            context = f.read()
    except:
        pass

    feedback = ""
    try:
        with open("feedback.md", "r", encoding="utf-8") as f:
            feedback = f.read()
    except:
        pass

    # === Phase 3: Create Markdown File + Pull Request with Real Content ===
    if any(kw in user_command_lower for kw in ["create file", "update file", "improve file", "create pr"]):
        print("Generating real suggestions and creating file + PR...")

        # Step 1: Ask Claude to generate useful content based on the command
        system_prompt = f"""You are the Master AI Guardian for SavingsClub.com.

Your task is to provide clear, practical, and actionable suggestions based on the user's request.

Context about the website:
{context}

Previous feedback:
{feedback}

User Command: {user_command}

Write a well-structured markdown response with real suggestions. Keep it professional, concise, and useful."""

        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }

        data = {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 4000,
            "messages": [{"role": "user", "content": system_prompt}]
        }

        response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
        suggestions = response.json()["content"][0]["text"] if response.status_code == 200 else "Error generating suggestions."

        # Step 2: Create file and Pull Request
        try:
            auth = Auth.Token(github_token)
            g = Github(auth=auth)
            repo = g.get_repo("AllahRakhha/SavingsClub")  # Change if needed

            file_name = f"ai-improvement-{datetime.now().strftime('%Y%m%d%H%M')}.md"
            file_path = f".github/{file_name}"

            # Create branch
            base = repo.get_branch("main")
            branch_name = f"ai-guardian-{datetime.now().strftime('%Y%m%d%H%M')}"
            repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=base.commit.sha)

            # Create file with real suggestions
            repo.create_file(
                path=file_path,
                message=f"AI Guardian: {user_command}",
                content=suggestions,
                branch=branch_name
            )

            # Create Pull Request
            pr = repo.create_pull(
                title=f"AI Guardian: {user_command}",
                body=f"**This PR was created by Master AI Guardian**\n\n**Command:** {user_command}\n\n**File created:** `{file_path}`",
                head=branch_name,
                base="main"
            )

            print(f"✅ Pull Request created successfully: {pr.html_url}")

        except Exception as e:
            print(f"❌ Error: {e}")
        return

    print("No matching command found.")

if __name__ == "__main__":
    main()
