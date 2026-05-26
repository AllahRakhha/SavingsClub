# SavingsClub v4.0 — Setup & Deployment Guide

## What's In This Package

- 17 calculator pages (each with own URL, SEO content, FAQ schema)
- 2 quiz pages (Financial Health Score, Credit Card Quiz)
- 20 pre-loaded blog posts as individual HTML files
- Banking comparison page (checking, savings, bonuses)
- Credit card comparison page
- Full legal pages (Privacy, Terms, Cookies, Disclaimer)
- Detailed About page
- Contact page
- Blog listing page with auto-loading from generated-posts.json
- Auto blog generator (GitHub Actions, Mon/Wed/Fri at 9 AM ET)
- Security headers (_headers file)
- SVG favicon

## Deployment (Netlify Drop — Easiest)

1. Go to app.netlify.com/drop
2. Drag the entire site folder onto the page
3. Wait 10 seconds — your site is live
4. Go to Domain management → add savingsclub.com

## For Auto Blog Posts (Requires GitHub)

1. Push all files to GitHub repo
2. Add ANTHROPIC_API_KEY secret (Settings → Secrets → Actions)
3. Go to Actions → Run "Generate Blog Post" workflow
4. Blog posts publish Mon/Wed/Fri automatically

## Replace Affiliate Links

Search for `[AFFILIATE LINK PLACEHOLDER]` across all files and replace with real links from Impact.com or CJ.com Financial Services advertisers.
