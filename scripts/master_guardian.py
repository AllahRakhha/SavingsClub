import os
import requests
from github import Github
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    github_token = os.environ.get("AGENT_GITHUB_TOKEN")

    if not api_key:
        print("ERROR: No Claude API key found!")
        return

    # Read context and feedback
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

    user_command = os.environ.get("GUARDIAN_COMMAND", "")
    user_command_lower = user_command.lower()

    # === Detect if user wants to create PR ===
    create_pr_keywords = ["create pr", "create pull request", "approve and create pr", "make pr"]
    should_create_pr = any(keyword in user_command_lower for keyword in create_pr_keywords)

    if should_create_pr and github_token:
        print("Creating Pull Request for approved suggestions...")
        try:
            g = Github(github_token)
            repo = g.get_repo("AllahRakhha/SavingsClub")  # Change if needed

            # Get the latest open issue created by the agent
            issues = repo.get_issues(state="open", creator="AllahRakhha")  # Change username if needed
            latest_issue = None
            for issue in issues:
                if "AI Guardian" in issue.title:
                    latest_issue = issue
                    break

            if latest_issue:
                # Create a new branch
                base = repo.get_branch("main")
                branch_name = f"ai-guardian-suggestions-{datetime.now().strftime('%Y%m%d-%H%M')}"
                repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=base.commit.sha)

                # Create Pull Request
                pr_title = f"AI Guardian Suggestions - {datetime.now().strftime('%Y-%m-%d')}"
                pr_body = f"**This Pull Request contains suggestions from the Master AI Guardian.**\n\n" \
                          f"**Original Issue:** #{latest_issue.number}\n\n" \
                          f"**Suggestions:**\n\n{latest_issue.body}"

                pr = repo.create_pull(title=pr_title, body=pr_body, head=branch_name, base="main")
                print(f"Pull Request created successfully: {pr.html_url}")
            else:
                print("No recent AI Guardian Issue found to create PR from.")
        except Exception as e:
            print(f"Failed to create Pull Request: {e}")
        return

    # === Normal Audit Flow ===
    # (Your existing SEO detection + Moz + Claude logic stays here)
    # For now, I'll keep it short. You can paste your full current logic here.

    print("Running normal audit...")

if __name__ == "__main__":
    main()
