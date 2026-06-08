import os
import requests
from datetime import datetime

def main():
    print("=== Master AI Guardian Started ===")

    api_key = os.environ.get("CLAUDE_API_KEY")
    if not api_key:
        print("ERROR: No API key found!")
        return

    # Read context.md
    context = ""
    try:
        with open("context.md", "r", encoding="utf-8") as f:
            context = f.read()
    except Exception as e:
        print(f"Warning: Could not read context.md - {e}")

    # Read feedback.md
    feedback = ""
    try:
        with open("feedback.md", "r", encoding="utf-8") as f:
            feedback = f.read()
    except Exception as e:
        print(f"Warning: Could not read feedback.md - {e}")

    user_command = os.environ.get("GUARDIAN_COMMAND", "")
    user_command_lower = user_command.lower()

    # Improved SEO Detection
    technical_seo_keywords = ["technical seo", "schema", "sitemap", "core web vitals", "mobile", "crawl", "indexing", "structured data", "robots.txt", "page speed"]
    regular_seo_keywords = ["keyword", "content gap", "competitor", "backlink", "title tag", "meta description", "on-page seo", "content optimization"]

    is_technical_seo = any(word in user_command_lower for word in technical_seo_keywords)
    is_regular_seo = any(word in user_command_lower for word in regular_seo_keywords)
    is_general_seo = "seo" in user_command_lower

    use_moz = is_technical_seo or is_regular_seo or is_general_seo

    # Moz credentials
    moz_access_id = os.environ.get("MOZ_ACCESS_ID")
    moz_secret_key = os.environ.get("MOZ_SECRET_KEY")

    moz_data = ""
    if use_moz and moz_access_id and moz_secret_key:
        print("SEO command detected. Fetching data from Moz API...")
        try:
            auth = (moz_access_id, moz_secret_key)
            payload = {"targets": ["https://savingsclub.com"]}
            response = requests.post(
                "https://lsapi.seomoz.com/v2/url_metrics",
                auth=auth,
                json=payload,
                timeout=15
            )
            if response.status_code == 200:
                moz_data = f"\n\n--- Moz SEO Data ---\n{response.text}\n"
                print("Moz data fetched successfully.")
            else:
                print(f"Moz API Error: {response.status_code}")
        except Exception as e:
            print(f"Could not fetch Moz data: {e}")
    elif use_moz:
        print("Moz credentials not configured. Skipping Moz API.")

    # Determine SEO focus type for the prompt
    seo_focus = ""
    if is_technical_seo:
        seo_focus = "\nFocus Area: Technical SEO (schema, speed, crawlability, structured data, etc.)"
    elif is_regular_seo:
        seo_focus = "\nFocus Area: Content & Keyword SEO (keywords, content gaps, competitors, backlinks, etc.)"
    elif is_general_seo:
        seo_focus = "\nFocus Area: General SEO improvements"

    system_prompt = f"""You are the Master AI Guardian for SavingsClub.com.

You have access to two important files:

1. context.md (Permanent information about the website):
{context}

2. feedback.md (Ongoing feedback and learnings):
{feedback}

{moz_data}
{seo_focus}

Your priorities:
1. Compliance & Risk Management (Highest)
2. Cybersecurity
3. SEO & Content Strategy

Report Rules (Very Important):
- Keep reports **clear, short, and actionable**.
- Use simple headings and bullet points.
- Start with the most important findings first.
- Limit suggestions to the **top priorities** (maximum 8–10 points when possible).
- End every report with a short section called **"Recommended Next Steps"** with clear actions.
- Use **simple and plain language** — avoid technical jargon.
- Do not repeat the same suggestions unnecessarily.
- Be conservative and practical. Never suggest risky ideas.

When Moz data is available, use it to give data-backed SEO recommendations.
Always follow the rules in context.md and feedback.md."""

    user_message = user_command if user_command else \
        "Run a full audit for SavingsClub.com including Compliance, Cybersecurity, SEO, and Content. Provide clear and actionable recommendations."

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 5000,
        "messages": [
            {"role": "user", "content": system_prompt + "\n\n" + user_message}
        ]
    }

    print("Calling Claude API...")
    response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)

    if response.status_code != 200:
        print("API Error:", response.text)
        return

    report = response.json()["content"][0]["text"]

    print("\n" + "="*80)
    print("MASTER AI GUARDIAN REPORT")
    print("="*80 + "\n")
    print(report)
    print("\n" + "="*80)
    print("END OF REPORT")
    print("="*80)

if __name__ == "__main__":
    main()
