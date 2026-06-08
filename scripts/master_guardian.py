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
        print("ERROR: Missing required API keys!")
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

    # === Phase 3: Create or Update Markdown File + Pull Request ===
    if any(kw in user_command_lower for kw in ["create file", "update file", "improve file", "create pr"]):
        print("Creating/Updating file and Pull Request...")
        try:
            auth = Auth.Token(github_token)
            g = Github(auth=auth)
            repo = g.get_repo("AllahRakhha/SavingsClub")  # Change if needed

            # Simple example: Create a new markdown file in .github/
            file_name = f"ai-improvement-{datetime.now().strftime('%Y%m%d%H%M')}.md"
            file_path = f".github/{file_name}"

            file_content = f"""# AI Guardian Improvement Suggestion
**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}

**Command:** {user_command}

**Suggestion:**
This file was created by the Master AI Guardian based on your request.

You can replace this content with actual suggestions or improvements.
"""

            # Create the file on a new branch
            base = repo.get_branch("main")
            branch_name = f"ai-guardian-{datetime.now().strftime('%Y%m%d%H%M')}"
            repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=base.commit.sha)

            # Create file
            repo.create_file(
                path=file_path,
                message=f"AI Guardian: {user_command}",
                content=file_content,
                branch=branch_name
            )

            # Create Pull Request
            pr = repo.create_pull(
                title=f"AI Guardian: {user_command}",
                body=f"**This PR was created by Master AI Guardian**\n\nCommand: {user_command}",
                head=branch_name,
                base="main"
            )

            print(f"✅ Pull Request created: {pr.html_url}")

        except Exception as e:
            print(f"❌ Error: {e}")
        return

    # Normal flow (you can expand this later)
    print("Running normal audit flow...")

if __name__ == "__main__":
    main()
