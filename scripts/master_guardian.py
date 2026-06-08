import os
import requests
from github import Github, Auth
from datetime import datetime
import re

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    github_token = os.environ.get("AGENT_GITHUB_TOKEN")

    if not api_key:
        print("ERROR: No Claude API key found!")
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

    # SEO Detection
    technical_keywords = ["technical seo", "schema", "sitemap", "core web vitals", "mobile", "crawl", "structured data"]
    regular_keywords = ["keyword", "content gap", "competitor", "backlink", "title tag", "meta description", "on-page"]

    is_technical = any(kw in user_command_lower for kw in technical_keywords)
    is_regular = any(kw in user_command_lower for kw in regular_keywords)
    use_moz = is_technical or is_regular or "seo" in user_command_lower

    # Moz API
    moz_data = ""
    if use_moz and os.environ.get("MOZ_ACCESS_ID") and os.environ.get("MOZ_SECRET_KEY"):
        print("Fetching Moz data...")
        try:
            auth = (os.environ.get("MOZ_ACCESS_ID"), os.environ.get("MOZ_SECRET_KEY"))
            response = requests.post(
                "https://lsapi.seomoz.com/v2/url_metrics",
                auth=auth,
                json={"targets": ["https://savingsclub.com"]},
                timeout=15
            )
            if response.status_code == 200:
                moz_data = f"\n\n--- Moz Data ---\n{response.text}\n"
        except Exception as e:
            print(f"Moz error: {e}")

    # Generate Report
    seo_focus = ""
    if is_technical:
        seo_focus = "\nFocus: Technical SEO"
    elif is_regular:
        seo_focus = "\nFocus: Content & Keyword SEO"

    system_prompt = f"""You are the Master AI Guardian for SavingsClub.com.

Context:
{context}

Feedback:
{feedback}
{moz_data}
{seo_focus}

Rules:
- Keep reports clear, short, and actionable.
- Use simple language.
- Be conservative and practical."""

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 4500,
        "messages": [{"role": "user", "content": system_prompt + "\n\n" + user_command}]
    }

    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
    report = response.json()["content"][0]["text"] if response.status_code == 200 else "Error generating report."

    print("\n" + "="*80)
    print("MASTER AI GUARDIAN REPORT")
    print("="*80 + "\n")
    print(report)
    print("\n" + "="*80)

    # === Phase 3 Features ===
    if not github_token:
        print("GitHub token not found. Skipping Issue/PR creation.")
        return

    auth = Auth.Token(github_token)
    g = Github(auth=auth)
    repo = g.get_repo("AllahRakhha/SavingsClub")

    # 1. Create Issue
    if any(kw in user_command_lower for kw in ["create issue", "make issue"]):
        print("Creating GitHub Issue...")
        try:
            issue = repo.create_issue(
                title=f"AI Guardian Suggestions - {datetime.now().strftime('%Y-%m-%d')}",
                body=report
            )
            print(f"✅ Issue created: {issue.html_url}")
        except Exception as e:
            print(f"❌ Error creating Issue: {e}")
        return

    # 2. Approve Issue and Create PR
    if "approve issue" in user_command_lower and "create pr" in user_command_lower:
        print("Creating Pull Request from approved Issue...")
        try:
            match = re.search(r"#(\d+)", user_command)
            if not match:
                print("Please use format: Approve issue #5 and create PR")
                return

            issue_number = int(match.group(1))
            issue = repo.get_issue(issue_number)

            base = repo.get_branch("main")
            branch_name = f"ai-guardian-pr-{datetime.now().strftime('%Y%m%d%H%M')}"
            repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=base.commit.sha)

            file_name = f"ai-improvement-{datetime.now().strftime('%Y%m%d%H%M')}.md"
            file_path = f".github/{file_name}"

            repo.create_file(
                path=file_path,
                message=f"AI Guardian: Approved suggestions from Issue #{issue_number}",
                content=report,
                branch=branch_name
            )

            pr = repo.create_pull(
                title=f"AI Guardian Suggestions from Issue #{issue_number}",
                body=f"**Approved suggestions from Issue #{issue_number}**",
                head=branch_name,
                base="main"
            )
            print(f"✅ Pull Request created: {pr.html_url}")

        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
