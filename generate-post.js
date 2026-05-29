const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// 60 unique topic templates — each used ONCE then never repeated
const TOPICS = [
  "Best high-yield savings accounts for {STATE} residents",
  "How to save for a house down payment in {STATE}",
  "Top budgeting strategies for families in {STATE}",
  "Credit card rewards strategies every {STATE} resident should know",
  "Emergency fund guide for {STATE} workers",
  "How to pay off student loan debt faster",
  "Best no-annual-fee credit cards for everyday spending",
  "How to improve your credit score in 90 days",
  "Smart money moves for millennials in {STATE}",
  "Best side hustles for extra income in {STATE}",
  "How to start investing with just $100",
  "Understanding FDIC insurance and bank safety",
  "Debt snowball vs debt avalanche: Which method wins",
  "How to negotiate lower interest rates on credit cards",
  "Best budgeting apps and tools for Americans",
  "How to build credit as a new immigrant in the US",
  "Tax-saving strategies for freelancers in {STATE}",
  "How to save money on groceries in {STATE}",
  "Best travel credit cards with no foreign transaction fees",
  "How to create a zero-based budget that actually works",
  "Roth IRA vs Traditional IRA: Complete comparison",
  "How to save for retirement in your 30s",
  "Best cash back credit cards for gas and groceries",
  "How to avoid overdraft fees at any bank",
  "Understanding APR vs APY and why it matters",
  "How to save for college with a 529 plan",
  "Best free checking accounts with no minimum balance",
  "How to manage money as a couple in {STATE}",
  "Financial planning checklist for new parents",
  "How to save money on car insurance in {STATE}",
  "Best personal loans for debt consolidation",
  "How to build an investment portfolio from scratch",
  "Understanding health savings accounts HSAs",
  "How to save money on utilities in {STATE}",
  "Best secured credit cards for building credit",
  "How to create multiple streams of income",
  "Financial mistakes to avoid in your 20s",
  "How to save for a wedding without going into debt",
  "Best money market accounts for Americans",
  "How to protect yourself from financial fraud",
  "Understanding balance transfer credit cards",
  "How to save money while paying off debt",
  "Best bank bonuses and sign-up offers",
  "How to teach kids about money and saving",
  "Understanding your W-2 and tax withholdings",
  "How to save money on healthcare costs",
  "Best credit cards for small business owners",
  "How to prepare financially for a recession",
  "Understanding certificate of deposit CD rates and terms",
  "How to save money on holiday shopping",
  "Best rewards credit cards for dining out",
  "How to build wealth on a modest income",
  "Understanding auto loan rates and getting the best deal",
  "How to save money on rent in {STATE}",
  "Best apps for saving money automatically",
  "How to create a debt payoff plan that works",
  "Understanding mortgage rates and when to refinance",
  "How to save for a vacation without credit card debt",
  "Financial planning for gig economy workers",
  "How to choose the right bank for your needs",
  "The complete guide to 401k employer matching",
  "How inflation affects your savings and what to do about it",
  "Take-home pay explained: Understanding your paycheck",
  "Best strategies for paying off credit card debt fast",
  "How to calculate your net worth and why it matters",
  "Guide to first-time homebuyer programs in {STATE}",
  "How to financially prepare for having a baby",
  "Understanding compound interest: The key to wealth building",
  "Best high-yield CDs vs savings accounts compared",
  "How to set financial goals you will actually achieve",
  "Money saving tips for single-income families in {STATE}",
  "How to recover financially after job loss",
  "Complete guide to refinancing student loans",
  "How to maximize your employer benefits package",
  "Understanding your credit report and fixing errors",
  "Best strategies for saving on back-to-school expenses",
  "How to plan for early retirement in your 40s",
  "Smart ways to use your tax refund",
  "How to avoid lifestyle inflation as your income grows",
  "Complete guide to balance transfers and saving on interest"
];

const STATES = [
  "California","Texas","Florida","New York","Illinois","Pennsylvania","Ohio","Georgia",
  "North Carolina","Michigan","New Jersey","Virginia","Washington","Arizona","Massachusetts",
  "Tennessee","Indiana","Missouri","Maryland","Wisconsin","Colorado","Minnesota",
  "South Carolina","Alabama","Louisiana","Kentucky","Oregon","Oklahoma","Connecticut","Utah",
  "Iowa","Nevada","Arkansas","Mississippi","Kansas"
];

const CALCULATOR_LINKS = [
  { name: 'Savings Calculator', url: '/savings-calculator/' },
  { name: 'Budget Planner', url: '/budget-planner/' },
  { name: 'Debt Payoff Calculator', url: '/debt-payoff-calculator/' },
  { name: 'Mortgage Calculator', url: '/mortgage-calculator/' },
  { name: 'Compound Interest Calculator', url: '/compound-interest-calculator/' },
  { name: 'Retirement Calculator', url: '/retirement-calculator/' },
  { name: 'Investment Calculator', url: '/investment-calculator/' },
  { name: 'Credit Card Payoff Calculator', url: '/credit-card-payoff-calculator/' },
  { name: '401(k) Calculator', url: '/401k-calculator/' },
  { name: 'Roth IRA Calculator', url: '/roth-ira-calculator/' },
  { name: 'Inflation Calculator', url: '/inflation-calculator/' },
  { name: 'Loan Payoff Calculator', url: '/loan-payoff-calculator/' },
  { name: 'Paycheck Calculator', url: '/paycheck-calculator/' },
  { name: 'CD Calculator', url: '/cd-calculator/' },
  { name: 'Auto Loan Calculator', url: '/auto-loan-calculator/' },
  { name: 'Emergency Fund Calculator', url: '/emergency-fund-calculator/' },
  { name: 'Net Worth Calculator', url: '/net-worth-calculator/' },
  { name: 'Credit Card Quiz', url: '/credit-card-quiz/' },
  { name: 'Financial Health Score', url: '/financial-health-score/' },
  { name: 'Banking Comparisons', url: '/banking/' },
  { name: 'Credit Card Comparisons', url: '/credit-cards/' }
];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function categorize(title) {
  const t = title.toLowerCase();
  if (t.includes('savings') || t.includes('save') || t.includes('high-yield') || t.includes('emergency fund')) return 'Savings';
  if (t.includes('budget')) return 'Budgeting';
  if (t.includes('credit card') || t.includes('rewards') || t.includes('cash back') || t.includes('balance transfer')) return 'Credit Cards';
  if (t.includes('debt') || t.includes('payoff') || t.includes('pay off') || t.includes('student loan')) return 'Debt';
  if (t.includes('invest') || t.includes('portfolio') || t.includes('ira') || t.includes('401k') || t.includes('compound')) return 'Investing';
  if (t.includes('bank') || t.includes('checking') || t.includes('fdic') || t.includes('cd ') || t.includes('certificate')) return 'Banking';
  if (t.includes('credit score') || t.includes('build credit') || t.includes('credit report')) return 'Credit';
  if (t.includes('insurance') || t.includes('hsa') || t.includes('healthcare')) return 'Insurance';
  if (t.includes('retire') || t.includes('retirement') || t.includes('pension')) return 'Retirement';
  if (t.includes('mortgage') || t.includes('house') || t.includes('home') || t.includes('rent')) return 'Housing';
  if (t.includes('tax') || t.includes('w-2') || t.includes('withhold')) return 'Taxes';
  if (t.includes('paycheck') || t.includes('take-home') || t.includes('income')) return 'Income';
  return 'Money Tips';
}

function makeSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function getUsedTopics() {
  try {
    const posts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8'));
    return posts.map(p => p.title.toLowerCase());
  } catch (e) {
    return [];
  }
}

function pickUnusedTopic(usedTitles) {
  const state = pickRandom(STATES);
  // Shuffle topics randomly
  const shuffled = [...TOPICS].sort(() => Math.random() - 0.5);

  for (const template of shuffled) {
    const topic = template.replace('{STATE}', state);
    const topicLower = topic.toLowerCase();
    // Check if any existing post title contains the core topic (without state)
    const coreWords = template.replace('{STATE}', '').toLowerCase().replace(/[^a-z ]/g, '').trim().split(' ').filter(w => w.length > 3);
    const isUsed = usedTitles.some(used => {
      const matchCount = coreWords.filter(w => used.includes(w)).length;
      return matchCount >= Math.min(4, coreWords.length);
    });
    if (!isUsed) return { topic, state };
  }

  // Fallback: pick random with different state
  const fallbackState = pickRandom(STATES);
  const fallbackTopic = pickRandom(TOPICS).replace('{STATE}', fallbackState);
  return { topic: fallbackTopic + ' — ' + new Date().getFullYear() + ' update', state: fallbackState };
}

async function generatePost() {
  const client = new Anthropic();
  const usedTitles = getUsedTopics();
  const { topic, state } = pickUnusedTopic(usedTitles);

  console.log('Topic: ' + topic);
  console.log('Used posts so far: ' + usedTitles.length);

  // Pick 4-6 relevant calculator links to require in the post
  const shuffledCalcs = [...CALCULATOR_LINKS].sort(() => Math.random() - 0.5);
  const requiredLinks = shuffledCalcs.slice(0, 5);
  const linkInstructions = requiredLinks.map(c => `  <a href="${c.url}">${c.name}</a>`).join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: `You are an expert personal finance writer for SavingsClub (savingsclub.com). Write comprehensive, SEO-optimized blog articles targeting Americans.

CRITICAL REQUIREMENTS:
- Write 1,800-2,200 words minimum. This is non-negotiable.
- Use HTML formatting: h2/h3 for sections, p for paragraphs, ul/li for lists where appropriate
- Do NOT include h1 (the template adds it)
- Start with: <p><em>Financial information reflects conditions as of 2026. Always verify current details with providers.</em></p>
- Use at least 6 subheadings (h2 or h3) spread throughout — one every 200-300 words
- Include real-world examples with specific dollar amounts (e.g., "On a $50,000 salary..." or "If you save $300/month...")
- Reference specific US states naturally (not just ${state})
- Use 2026 as the current year
- Do NOT fabricate specific statistics, rates, or study results
- When referencing data, cite general sources (Federal Reserve, BLS, FDIC)
- Be practical, actionable, and specific — not generic filler

INTERNAL LINKS — You MUST include at least 4 of these links naturally within the article:
${linkInstructions}
  <a href="/blog/">Read more guides on SavingsClub</a>

Place links where they naturally fit the content. Example: "Use our <a href="/budget-planner/">Budget Planner</a> to see your 50/30/20 breakdown."

STRUCTURE:
1. Opening paragraph that hooks the reader with a relatable scenario or surprising fact
2. 4-6 main sections with h2/h3 headings covering different aspects of the topic
3. Practical tips or step-by-step advice in each section
4. Closing section with a clear call-to-action linking to a SavingsClub calculator

Write unique, original content. Do not repeat advice generically — be specific to the topic.`,
    messages: [{ role: 'user', content: 'Write a comprehensive personal finance blog post about: ' + topic }]
  });

  const content = message.content[0].text;
  const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1] : topic;
  const cleanContent = content.replace(/<h1>.*?<\/h1>/, '');
  const category = categorize(title);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isoDate = new Date().toISOString().split('T')[0];
  const slug = makeSlug(title);
  const wordCount = cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  // Fetch unique image from Unsplash
  let blogImage = '../../img/savings-jar.jpg';
  let photoCredit = '';
  try {
    const searchTerms = {
      'Savings': 'saving money piggy bank',
      'Budgeting': 'budget planning notebook',
      'Credit Cards': 'credit card payment',
      'Debt': 'financial stress bills',
      'Investing': 'stock market investing growth',
      'Banking': 'bank building finance',
      'Credit': 'credit score report',
      'Insurance': 'insurance protection family',
      'Retirement': 'retirement planning senior',
      'Housing': 'house keys mortgage',
      'Taxes': 'tax documents filing',
      'Income': 'money income salary',
      'Money Tips': 'personal finance money'
    };
    const searchQuery = searchTerms[category] || 'personal finance money';
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
      const https = require('https');
      const unsplashData = await new Promise((resolve, reject) => {
        const url = 'https://api.unsplash.com/photos/random?query=' + encodeURIComponent(searchQuery) + '&orientation=landscape&client_id=' + unsplashKey;
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
      if (unsplashData && unsplashData.urls) {
        blogImage = unsplashData.urls.regular;
        const photographer = unsplashData.user ? unsplashData.user.name : 'Unsplash';
        const profileUrl = unsplashData.user ? unsplashData.user.links.html : 'https://unsplash.com';
        photoCredit = '<p style="font-size:.75rem;color:var(--text-lighter);margin-top:8px;text-align:center">Photo by <a href="' + profileUrl + '?utm_source=savingsclub&utm_medium=referral" style="color:var(--text-lighter)">' + photographer + '</a> on <a href="https://unsplash.com?utm_source=savingsclub&utm_medium=referral" style="color:var(--text-lighter)">Unsplash</a></p>';
        console.log('Unsplash image: ' + unsplashData.urls.regular);
      }
    }
  } catch (e) {
    console.log('Unsplash failed, using default image: ' + e.message);
  }

  const post = {
    id: 'gen_' + Date.now(),
    title: title,
    slug: slug,
    category: category,
    date: date,
    author: 'Editorial Team',
    excerpt: title
  };

  // Create blog post HTML file
  const postDir = path.join('blog', slug);
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  const escapedTitle = title.replace(/"/g, '&quot;');

  const postHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | SavingsClub</title>
<meta name="description" content="${title}. Expert personal finance guide from SavingsClub.">
<link rel="canonical" href="https://savingsclub.com/blog/${slug}/">
<meta property="og:title" content="${escapedTitle}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://savingsclub.com/blog/${slug}/">
<meta property="og:site_name" content="SavingsClub">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${escapedTitle}","author":{"@type":"Organization","name":"SavingsClub"},"publisher":{"@type":"Organization","name":"SavingsClub","url":"https://savingsclub.com"},"datePublished":"${isoDate}","description":"${escapedTitle}. Expert personal finance guide."}</script>
<link rel="icon" type="image/svg+xml" href="../../img/favicon.svg">
<link rel="stylesheet" href="../../css/style.css">
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" as="style">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"></noscript>
</head>
<body>
<nav id="mainNav">
<div class="nav-inner">
<div class="logo" onclick="location.href='../../'">
<div class="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
SavingsClub
</div>
<div class="nav-links" id="navLinks">
<a href="../../">Home</a>
<a href="../../savings-calculator/">Calculators</a>
<a href="../../credit-cards/">Credit Cards</a>
<a href="../" class="active">Blog</a>
<a href="../../banking/">Banking</a>
<a href="../../about/">About</a>
<a href="../../faq/">FAQ</a>
</div>
<div class="hamburger" onclick="toggleMobile()"><span></span><span></span><span></span></div>
</div>
</nav>
<div class="mobile-menu" id="mobileMenu">
<a href="../../">Home</a>
<a href="../../savings-calculator/">Calculators</a>
<a href="../../budget-planner/">Budget</a>
<a href="../../mortgage-calculator/">Mortgage</a>
<a href="../../credit-cards/">Credit Cards</a>
<a href="../">Blog</a>
<a href="../../banking/">Banking</a>
<a href="../../about/">About</a>
<a href="../../faq/">FAQ</a>
</div>

<section style="padding:100px 0 60px"><div class="container" style="max-width:800px">
<a href="../" style="display:inline-flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--text-light);font-weight:500">← Back to Blog</a>
<h1 style="font-size:2rem;margin-bottom:16px;line-height:1.3">${title}</h1>
<div style="color:var(--text-light);margin-bottom:32px;font-size:.95rem">By Editorial Team · ${date} · ${readTime} min read</div>
<img src="${blogImage}" alt="${title}" style="width:100%;height:300px;object-fit:cover;border-radius:0;margin:0 -24px 32px;width:calc(100% + 48px);max-width:none;box-shadow:none" loading="lazy">
${photoCredit}
<div class="blog-content">${cleanContent}</div>
<div style="margin-top:40px;padding:32px;background:linear-gradient(135deg,#F0FDF4,#F8FAFC);border-radius:16px;border:1px solid rgba(5,150,105,.1);text-align:center"><p style="font-size:1.1rem;font-weight:600;color:#059669;margin-bottom:8px">Thank you for reading!</p><p style="color:var(--text-light);font-size:.95rem;margin-bottom:16px">If this guide helped you, explore our free calculators to put these ideas into action.</p><a href="../../savings-calculator/" style="background:linear-gradient(135deg,#059669,#10B981);color:#fff;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:600;font-size:.95rem;box-shadow:0 4px 15px rgba(5,150,105,.3)">Try Our Free Calculators →</a></div>
</div></section>

<footer>
<div class="container">
<div class="footer-grid">
<div><div class="footer-brand"><div class="logo-mark" style="width:30px;height:30px;border-radius:9px"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="width:16px;height:16px"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>SavingsClub</div><p style="font-size:.9rem;max-width:280px;line-height:1.6">Free financial calculators and expert money guides for Americans in every state.</p></div>
<div><h4>Calculators</h4><a href="../../savings-calculator/">Savings</a><a href="../../budget-planner/">Budget</a><a href="../../mortgage-calculator/">Mortgage</a><a href="../../401k-calculator/">401(k)</a><a href="../../paycheck-calculator/">Take-Home Pay</a></div>
<div><h4>Resources</h4><a href="../">Blog</a><a href="../../credit-cards/">Credit Cards</a><a href="../../banking/">Banking</a><a href="../../faq/">FAQ</a><a href="../../contact/">Contact</a></div>
<div><h4>Legal</h4><a href="../../privacy-policy/">Privacy Policy</a><a href="../../terms-of-service/">Terms</a><a href="../../cookie-policy/">Cookies</a><a href="../../disclaimer/">Disclaimer</a></div>
</div>
<div class="footer-bottom"><p>&copy; 2026 SavingsClub. All rights reserved.</p><p>Affiliate Disclosure: SavingsClub may earn commissions from products featured on this site. <a href="../../disclaimer/" style="color:rgba(255,255,255,.4)">Learn more</a></p></div>
</div>
</footer>
<script>
window.addEventListener('scroll',function(){var n=document.querySelector('nav');if(n)n.classList.toggle('scrolled',window.scrollY>20);});
function toggleMobile(){var m=document.getElementById('mobileMenu');if(m)m.classList.toggle('open');}
</script>
<script src="../../js/logo-fix.js"></script></body>
</html>`;

  fs.writeFileSync(path.join(postDir, 'index.html'), postHtml);
  console.log('Created: blog/' + slug + '/index.html');

  // Update generated-posts.json
  let posts = [];
  try { posts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8')); } catch (e) { posts = []; }
  posts.unshift(post);
  fs.writeFileSync('generated-posts.json', JSON.stringify(posts, null, 2));

  // Add to sitemap
  try {
    let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
    const newUrl = '  <url><loc>https://savingsclub.com/blog/' + slug + '/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>';
    if (!sitemap.includes('/blog/' + slug + '/')) {
      sitemap = sitemap.replace('</urlset>', newUrl + '\n</urlset>');
      fs.writeFileSync('sitemap.xml', sitemap);
      console.log('Added to sitemap');
    }
  } catch (e) { console.log('Could not update sitemap: ' + e.message); }

  console.log('Published: ' + title + ' [' + category + ']');
  console.log('Word count estimate: ' + cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).length);
}

generatePost().catch(err => {
  console.error('ERROR:', err.message || err);
  process.exit(1);
});
