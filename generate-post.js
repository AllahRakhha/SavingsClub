const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const TOPICS = [
  "Best high-yield savings accounts for {STATE} residents in 2026",
  "How to save for a house down payment in {STATE}",
  "Top budgeting strategies for families in {STATE}",
  "Credit card rewards strategies every {STATE} resident should know",
  "Emergency fund guide for {STATE} workers",
  "How to pay off student loan debt faster in 2026",
  "Best no-annual-fee credit cards for everyday spending",
  "How to improve your credit score in 90 days",
  "Smart money moves for millennials in {STATE}",
  "Best side hustles for extra income in {STATE}",
  "How to start investing with just $100",
  "Understanding FDIC insurance: Is your money safe?",
  "Debt snowball vs debt avalanche: Which is better?",
  "How to negotiate lower interest rates on credit cards",
  "Best budgeting apps and tools for 2026",
  "How to build credit as a new immigrant in the US",
  "Tax-saving strategies for freelancers in {STATE}",
  "How to save money on groceries in {STATE}",
  "Best travel credit cards with no foreign transaction fees",
  "Roth IRA vs Traditional IRA: Which is right for you?",
  "How to save for retirement in your 30s",
  "Best cash back credit cards for gas and groceries",
  "How to avoid overdraft fees at any bank",
  "Understanding APR vs APY: What you need to know",
  "How to manage money as a couple in {STATE}",
  "Financial planning checklist for new parents",
  "Best personal loans for debt consolidation in 2026",
  "How to build an investment portfolio from scratch",
  "Understanding health savings accounts (HSAs)",
  "Best secured credit cards for building credit"
];

const STATES = [
  "California","Texas","Florida","New York","Illinois","Pennsylvania","Ohio","Georgia",
  "North Carolina","Michigan","New Jersey","Virginia","Washington","Arizona","Massachusetts",
  "Tennessee","Indiana","Missouri","Maryland","Wisconsin","Colorado","Minnesota",
  "South Carolina","Alabama","Louisiana","Kentucky","Oregon","Oklahoma","Connecticut","Utah"
];

function pickRandom(arr){return arr[Math.floor(Math.random()*arr.length)];}

function categorize(title){
  const t=title.toLowerCase();
  if(t.includes('savings')||t.includes('save')||t.includes('high-yield'))return 'Savings';
  if(t.includes('budget'))return 'Budgeting';
  if(t.includes('credit card')||t.includes('rewards card')||t.includes('cash back card'))return 'Credit Cards';
  if(t.includes('debt')||t.includes('payoff')||t.includes('pay off'))return 'Debt';
  if(t.includes('invest')||t.includes('portfolio')||t.includes('ira')||t.includes('401k'))return 'Investing';
  if(t.includes('bank')||t.includes('checking')||t.includes('fdic'))return 'Banking';
  if(t.includes('credit score')||t.includes('build credit'))return 'Credit';
  if(t.includes('insurance')||t.includes('hsa'))return 'Insurance';
  if(t.includes('retire'))return 'Retirement';
  return 'Money Tips';
}

function makeSlug(title){
  return title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

async function generatePost(){
  const client=new Anthropic();
  const state=pickRandom(STATES);
  let topic=pickRandom(TOPICS).replace('{STATE}',state);

  console.log('Generating: '+topic);

  const message=await client.messages.create({
    model:'claude-sonnet-4-20250514',
    max_tokens:6000,
    system:`You are an expert personal finance writer for SavingsClub (savingsclub.com). Write SEO-optimized blog articles targeting Americans.

REQUIREMENTS:
- Write 1400-1800 words
- Use HTML formatting: h2/h3 for sections, p for paragraphs, ul/li for lists
- Do NOT include h1 (will be added by the template)
- Start with: <p><em>Rates and financial information reflect conditions as of early 2026. Always verify current information with providers.</em></p>
- Reference specific US states naturally throughout
- Use internal links to SavingsClub tools:
  <a href="/savings-calculator/">Savings Calculator</a>
  <a href="/budget-planner/">Budget Planner</a>
  <a href="/debt-payoff-calculator/">Debt Payoff Calculator</a>
  <a href="/mortgage-calculator/">Mortgage Calculator</a>
  <a href="/compound-interest-calculator/">Compound Interest Calculator</a>
  <a href="/retirement-calculator/">Retirement Calculator</a>
  <a href="/investment-calculator/">Investment Calculator</a>
  <a href="/credit-card-payoff-calculator/">Credit Card Payoff Calculator</a>
  <a href="/credit-cards/">Credit Card Comparisons</a>
  <a href="/401k-calculator/">401(k) Calculator</a>
  <a href="/roth-ira-calculator/">Roth IRA Calculator</a>
  <a href="/inflation-calculator/">Inflation Calculator</a>
  <a href="/loan-payoff-calculator/">Loan Payoff Calculator</a>
  <a href="/paycheck-calculator/">Paycheck Calculator</a>
  <a href="/cd-calculator/">CD Calculator</a>
  <a href="/banking/">Banking Comparisons</a>
- Use 2026 as the current year
- Do NOT fabricate specific statistics or rates
- Be practical and actionable
- Include at least 3 internal links to SavingsClub calculators or pages
- Use subheadings (h2/h3) every 200-300 words for readability
- Include real-world examples with dollar amounts`,
    messages:[{role:'user',content:'Write a personal finance blog post about: '+topic}]
  });

  const content=message.content[0].text;
  const titleMatch=content.match(/<h1>(.*?)<\/h1>/);
  const title=titleMatch?titleMatch[1]:topic;
  const cleanContent=content.replace(/<h1>.*?<\/h1>/,'');
  const category=categorize(title);
  const date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const slug=makeSlug(title);

  const post={
    id:'gen_'+Date.now(),
    title:title,
    slug:slug,
    category:category,
    date:date,
    author:'Editorial Team',
    excerpt:title
  };

  // Create individual blog post HTML file
  const postDir=path.join('blog',slug);
  if(!fs.existsSync(postDir))fs.mkdirSync(postDir,{recursive:true});

  const postHtml=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | SavingsClub</title>
<meta name="description" content="${title}. Expert personal finance guide from SavingsClub.">
<link rel="canonical" href="https://savingsclub.com/blog/${slug}/">
<meta property="og:title" content="${title}">
<meta property="og:type" content="article">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../css/style.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${title.replace(/"/g,'\\"')}","author":{"@type":"Organization","name":"SavingsClub"},"publisher":{"@type":"Organization","name":"SavingsClub","url":"https://savingsclub.com"},"datePublished":"${new Date().toISOString().split('T')[0]}","description":"${title.replace(/"/g,'\\"')}. Expert personal finance guide."}</script>
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
<a href="../../savings-calculator/">Tools</a>
<a href="../../credit-cards/">Credit Cards</a>
<a href="../" class="active">Blog</a>
<a href="../../best-accounts/">Best Accounts</a>
<a href="../../about/">About</a>
</div>
<div class="hamburger" onclick="toggleMobile()"><span></span><span></span><span></span></div>
</div>
</nav>
<div class="mobile-menu" id="mobileMenu">
<a href="../../">Home</a>
<a href="../../savings-calculator/">Savings</a>
<a href="../../budget-planner/">Budget</a>
<a href="../../mortgage-calculator/">Mortgage</a>
<a href="../../credit-cards/">Credit Cards</a>
<a href="../">Blog</a>
<a href="../../about/">About</a>
</div>

<section style="padding:100px 0 60px"><div class="container" style="max-width:800px">
<a href="../" style="display:inline-flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--text-light);font-weight:500">← Back to Blog</a>
<h1 style="font-size:2rem;margin-bottom:16px;line-height:1.3">${title}</h1>
<div style="color:var(--text-light);margin-bottom:32px;font-size:.95rem">By Editorial Team · ${date}</div>
<div class="blog-content">${cleanContent}</div>
</div></section>

<footer>
<div class="container">
<div class="footer-grid">
<div><div class="footer-brand"><div class="logo-mark" style="width:30px;height:30px;border-radius:9px"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="width:16px;height:16px"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>SavingsClub</div><p style="font-size:.9rem;max-width:280px;line-height:1.6">Free financial tools and expert guides for every American.</p></div>
<div><h4>Calculators</h4><a href="../../savings-calculator/">Savings</a><a href="../../budget-planner/">Budget</a><a href="../../mortgage-calculator/">Mortgage</a><a href="../../debt-payoff-calculator/">Debt Payoff</a></div>
<div><h4>Resources</h4><a href="../">Blog</a><a href="../../credit-cards/">Credit Cards</a><a href="../../best-accounts/">Best Accounts</a></div>
<div><h4>Legal</h4><a href="../../privacy-policy/">Privacy</a><a href="../../terms-of-service/">Terms</a><a href="../../cookie-policy/">Cookies</a><a href="../../disclaimer/">Disclaimer</a></div>
</div>
<div class="footer-bottom"><p>&copy; 2026 SavingsClub. All rights reserved.</p><p>Affiliate Disclosure: SavingsClub may earn commissions. <a href="../../disclaimer/" style="color:rgba(255,255,255,.4)">Learn more</a></p></div>
</div>
</footer>

<script>
window.addEventListener('scroll',function(){var n=document.querySelector('nav');if(n)n.classList.toggle('scrolled',window.scrollY>20);});
function toggleMobile(){var m=document.getElementById('mobileMenu');if(m)m.classList.toggle('open');}
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(postDir,'index.html'),postHtml);
  console.log('Created: blog/'+slug+'/index.html');

  // Update generated-posts.json
  let posts=[];
  try{posts=JSON.parse(fs.readFileSync('generated-posts.json','utf8'));}catch(e){posts=[];}
  posts.unshift(post);
  fs.writeFileSync('generated-posts.json',JSON.stringify(posts,null,2));

  // Add to sitemap
  try{
    let sitemap=fs.readFileSync('sitemap.xml','utf8');
    const newUrl='  <url><loc>https://savingsclub.com/blog/'+slug+'/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>';
    if(!sitemap.includes('/blog/'+slug+'/')){
      sitemap=sitemap.replace('</urlset>',newUrl+'\n</urlset>');
      fs.writeFileSync('sitemap.xml',sitemap);
      console.log('Added to sitemap');
    }
  }catch(e){console.log('Could not update sitemap:',e.message);}

  console.log('Published: '+title+' ['+category+']');
}

generatePost().catch(err=>{
  console.error('ERROR:',err.message||err);
  process.exit(1);
});
