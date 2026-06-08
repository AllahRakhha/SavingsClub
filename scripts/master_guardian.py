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

    # === Create Pull Request from Issue ===
    if "create pr for issue" in user_command_lower:
        print("Creating Pull Request...")
        try:
            # Extract issue number
            match = re.search(r"#(\d+)", user_command)
            if not match:
                print("Please use format: Create PR for issue #1")
                return

            issue_number = int(match.group(1))

            # Use modern authentication
            auth = Auth.Token(github_token)
            g = Github(auth=auth)
            repo = g.get_repo("AllahRakhha/SavingsClub")   # ← Change this if needed

            issue = repo.get_issue(issue_number)

            # Create new branch
            base = repo.get_branch("main")
            branch_name = f"ai-guardian-pr-{datetime.now().strftime('%Y%m%d%H%M')}"
            repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=base.commit.sha)

            # Create Pull Request
            pr_title = f"AI Guardian Suggestions from Issue #{issue_number}"
            pr_body = f"**Suggestions from Issue #{issue_number}**\n\n{issue.body}"

            pr = repo.create_pull(title=pr_title, body=pr_body, head=branch_name, base="main")
            print(f"✅ Pull Request created successfully: {pr.html_url}")

        except Exception as e:
            print(f"❌ Failed to create Pull Request: {e}")
        return

    print("No matching command found. Running normal flow...")

if __name__ == "__main__":
    main()
