const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// 79 unique topic templates, each used ONCE then never repeated
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
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas",
  "Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York",
  "North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming"
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

/**
 * STRIP AI-TELL PATTERNS FROM GENERATED CONTENT.
 *
 * AI-detection tools (GPTZero, Originality.ai, Copyleaks) and Google's helpful
 * content algorithm flag patterns that AI overuses. This function removes them
 * as a safety net AFTER the AI generates content, even if the system prompt
 * instructions slip.
 *
 * Removes:
 * - Em-dashes and en-dashes, the #1 AI-detection signal
 * - HTML entity versions (&mdash; &ndash;)
 * - Formal transitions ("Moreover," "Furthermore," "Additionally,")
 * - Filler phrases ("It's worth noting that," "Keep in mind that")
 * - "Whether you're X" sentence openers
 *
 * Headings (h1-h6) get em-dashes converted to colons (better for titles).
 * Body text gets em-dashes converted to commas (natural sentence flow).
 * Number ranges ($1,500-$2,000) get converted to "X to Y" format.
 */
function removeAITells(htmlContent) {
  if (!htmlContent) return '';
  let cleaned = htmlContent;

  // Count tells before cleanup (for GitHub Actions log)
  var emDashCount = (cleaned.match(/[\u2014\u2013]/g) || []).length;
  var entityCount = (cleaned.match(/&mdash;|&ndash;|&#8212;|&#8211;|&#x2014;|&#x2013;/gi) || []).length;
  var transitionCount = (cleaned.match(/(?:Moreover|Furthermore|Additionally),/g) || []).length;
  var fillerCount = (cleaned.match(/It['\u2019]s worth noting that|It is worth noting that|It['\u2019]s important to (?:remember|note) that|Keep in mind that|Bear in mind that/gi) || []).length;
  var whetherCount = (cleaned.match(/[Ww]hether you['\u2019]re/g) || []).length;

  // === STEP 1: Normalize HTML entities to Unicode ===
  cleaned = cleaned.replace(/&mdash;|&#8212;|&#x2014;/gi, '\u2014');
  cleaned = cleaned.replace(/&ndash;|&#8211;|&#x2013;/gi, '\u2013');

  // === STEP 2: Em-dashes inside HEADINGS (h1-h6) become colons ===
  cleaned = cleaned.replace(/<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/g, function(match, tag, attrs, inner) {
    var replaced = inner.replace(/\s*[\u2014\u2013]\s*/g, ': ');
    return '<' + tag + attrs + '>' + replaced + '</' + tag + '>';
  });

  // === STEP 3: Number ranges ($1,500-$2,000) become "from X to Y" ===
  cleaned = cleaned.replace(/(\$?[\d,.]+)\s*[\u2014\u2013]\s*(\$?[\d,.]+)/g, '$1 to $2');

  // === STEP 4: Spaced em-dash sentence breaks become commas ===
  cleaned = cleaned.replace(/\s+[\u2014\u2013]\s+/g, ', ');

  // === STEP 5: Any remaining em/en dashes become commas ===
  cleaned = cleaned.replace(/[\u2014\u2013]/g, ',');

  // === STEP 6: Remove AI transitions (Moreover, Furthermore, Additionally) ===
  cleaned = cleaned.replace(/(<p[^>]*>\s*)Moreover,\s+/g, '$1Also, ');
  cleaned = cleaned.replace(/(<p[^>]*>\s*)Furthermore,\s+/g, '$1Plus, ');
  cleaned = cleaned.replace(/(<p[^>]*>\s*)Additionally,\s+/g, '$1Also, ');
  cleaned = cleaned.replace(/(<li[^>]*>\s*)Moreover,\s+/g, '$1Also, ');
  cleaned = cleaned.replace(/(<li[^>]*>\s*)Furthermore,\s+/g, '$1Plus, ');
  cleaned = cleaned.replace(/(<li[^>]*>\s*)Additionally,\s+/g, '$1Also, ');
  cleaned = cleaned.replace(/(\.\s+)Moreover,\s+/g, '$1Also, ');
  cleaned = cleaned.replace(/(\.\s+)Furthermore,\s+/g, '$1Plus, ');
  cleaned = cleaned.replace(/(\.\s+)Additionally,\s+/g, '$1Also, ');

  // === STEP 7: Remove AI filler phrases ===
  cleaned = cleaned.replace(/It['\u2019]s worth noting that\s+/gi, '');
  cleaned = cleaned.replace(/It is worth noting that\s+/gi, '');
  cleaned = cleaned.replace(/It['\u2019]s important to (?:remember|note) that\s+/gi, '');
  cleaned = cleaned.replace(/It is important to (?:remember|note) that\s+/gi, '');
  cleaned = cleaned.replace(/Keep in mind that\s+/gi, '');
  cleaned = cleaned.replace(/Bear in mind that\s+/gi, '');

  // === STEP 8: "Whether you're" becomes "If you're" ===
  cleaned = cleaned.replace(/\bWhether you['\u2019]re\b/g, "If you're");
  cleaned = cleaned.replace(/\bwhether you['\u2019]re\b/g, "if you're");
  cleaned = cleaned.replace(/\bWhether you are\b/g, "If you are");
  cleaned = cleaned.replace(/\bwhether you are\b/g, "if you are");

  // === STEP 9: Cleanup artifacts from replacements ===
  cleaned = cleaned.replace(/,\s*,/g, ',');               // double commas
  cleaned = cleaned.replace(/,([a-zA-Z])/g, ', $1');      // comma+letter becomes comma+space+letter (preserves "1,000")
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');           // collapse multiple spaces
  cleaned = cleaned.replace(/,\s*\./g, '.');              // comma before period
  cleaned = cleaned.replace(/\.\s*,/g, '.');              // period before comma

  // Capitalize letter after period+space (filler removal may have broken caps)
  cleaned = cleaned.replace(/(\.\s+)([a-z])/g, function(_, prefix, letter) {
    return prefix + letter.toUpperCase();
  });

  // Capitalize letter at start of paragraph (after <p> tag opening)
  cleaned = cleaned.replace(/(<p[^>]*>\s*)([a-z])/g, function(_, prefixWithTag, letter) {
    return prefixWithTag + letter.toUpperCase();
  });

  var totalRemoved = emDashCount + entityCount + transitionCount + fillerCount + whetherCount;
  console.log('AI tells removed: ' + (emDashCount + entityCount) + ' dashes, ' + transitionCount + ' transitions, ' + fillerCount + ' filler phrases, ' + whetherCount + ' whether-you-are, total: ' + totalRemoved);

  return cleaned;
}

/**
 * STRONG, TOPIC-SPECIFIC Unsplash search queries.
 */
function getImageQuery(topic, category) {
  const t = topic.toLowerCase();

  if (t.includes('teach kids') || t.includes('kids about money') || t.includes('teaching kids')) return 'child piggy bank coins learning';
  if (t.includes('new parents') || t.includes('having a baby') || t.includes('financially prepare') && t.includes('baby')) return 'baby crib nursery family';
  if (t.includes('couple') && (t.includes('manage') || t.includes('money'))) return 'couple kitchen finances laptop';
  if (t.includes('single-income family') || t.includes('single income')) return 'parent child home kitchen';
  if (t.includes('millennial')) return 'young professional laptop coffee shop';
  if (t.includes('in your 20s')) return 'young woman laptop apartment work';
  if (t.includes('in your 30s')) return 'professional woman office desk';
  if (t.includes('in your 40s') || t.includes('early retirement')) return 'middle aged couple beach hammock';
  if (t.includes('immigrant')) return 'passport visa documents america flag';
  if (t.includes('back-to-school') || t.includes('back to school')) return 'school supplies backpack notebooks pencils';
  if (t.includes('wedding')) return 'wedding rings bouquet ceremony';
  if (t.includes('vacation') || (t.includes('travel') && !t.includes('credit card'))) return 'beach vacation suitcase passport';
  if (t.includes('holiday shopping') || t.includes('holiday')) return 'christmas gifts shopping bags wrapping';
  if (t.includes('job loss') || t.includes('recession') || t.includes('layoff')) return 'cardboard box office desk empty';
  if (t.includes('small business')) return 'small business owner laptop cafe';
  if (t.includes('gig economy') || t.includes('freelance')) return 'delivery driver phone app gig';

  if (t.includes('high-yield savings') || t.includes('high yield savings')) return 'piggy bank pink coins jar';
  if (t.includes('emergency fund')) return 'glass jar coins emergency cash';
  if (t.includes('savings account') && t.includes('checking')) return 'bank atm debit card hand';
  if (t.includes('high-yield cds') || t.includes('cds vs savings')) return 'bank vault safe deposit gold';
  if (t.includes('save money on rent')) return 'apartment keys door city';
  if (t.includes('save money on groceries') || t.includes('save on groceries')) return 'grocery shopping bags vegetables fruits';
  if (t.includes('save money on utilities')) return 'thermostat dial energy electricity';
  if (t.includes('save money on car insurance')) return 'car keys insurance document policy';
  if (t.includes('save money on healthcare')) return 'stethoscope medical bill receipt';
  if (t.includes('save money on holiday')) return 'christmas gifts ribbon shopping';
  if (t.includes('save for a wedding')) return 'wedding rings flowers bouquet';
  if (t.includes('save for a vacation') || t.includes('save for vacation')) return 'beach palm trees suitcase travel';
  if (t.includes('save for a house') || t.includes('down payment')) return 'house keys front door home';
  if (t.includes('save for college') || t.includes('529 plan')) return 'graduation cap diploma books campus';
  if (t.includes('save for retirement')) return 'older couple beach sunset walking';
  if (t.includes('save money while paying off debt')) return 'piggy bank bills calculator desk';
  if (t.includes('saving money automatically') || (t.includes('app') && t.includes('saving'))) return 'phone screen savings app banking';
  if (t.includes('money saving tips') || t.includes('save money')) return 'piggy bank coins counting money';

  if (t.includes('start investing') || t.includes('invest with') || t.includes('investing with')) return 'phone stock chart growth screen';
  if (t.includes('investment portfolio') || t.includes('build an investment')) return 'laptop stock charts trading desk';
  if (t.includes('compound interest')) return 'growing plant coins green growth';
  if (t.includes('roth ira') || t.includes('traditional ira') || t.includes('ira vs')) return 'retirement document calculator paperwork';
  if (t.includes('401k') || t.includes('401(k)') || t.includes('employer matching')) return 'retirement planning paperwork desk';

  if (t.includes('early retirement')) return 'beach hammock palm trees retirement';
  if (t.includes('retirement') && t.includes('30s')) return 'young professional laptop planning';
  if (t.includes('retirement') && t.includes('40s')) return 'middle aged couple planning kitchen';
  if (t.includes('retirement')) return 'older couple beach sunset retirement';

  if (t.includes('travel credit card') || t.includes('foreign transaction')) return 'passport airplane boarding suitcase';
  if (t.includes('cash back') && (t.includes('gas') || t.includes('groceries'))) return 'gas pump grocery store receipt';
  if (t.includes('cash back credit card') || t.includes('cash back')) return 'credit card cash dollars wallet';
  if (t.includes('rewards credit card') && t.includes('dining')) return 'restaurant table dinner couple dining';
  if (t.includes('credit card rewards')) return 'credit card wallet leather travel';
  if (t.includes('no-annual-fee') || t.includes('no annual fee')) return 'credit card wallet payment store';
  if (t.includes('secured credit card')) return 'credit card young person building';
  if (t.includes('balance transfer')) return 'credit cards stack multiple wallet';
  if (t.includes('credit card payoff') || (t.includes('credit card') && t.includes('debt'))) return 'scissors cutting credit card debt';
  if (t.includes('lower interest rates') || (t.includes('negotiate') && t.includes('credit card'))) return 'phone call paperwork credit card';
  if (t.includes('credit card')) return 'credit cards payment wallet store';

  if (t.includes('credit score')) return 'credit score 750 screen excellent';
  if (t.includes('credit report')) return 'credit report document checking review';
  if (t.includes('build credit') || t.includes('building credit')) return 'young person credit card building';

  if (t.includes('refinancing student loans') || t.includes('student loan')) return 'graduation cap diploma student debt';
  if (t.includes('debt snowball') || t.includes('debt avalanche')) return 'bills paperwork calculator debt desk';
  if (t.includes('pay off') && t.includes('debt')) return 'scissors cutting credit card freedom';
  if (t.includes('debt payoff') || t.includes('debt consolidation')) return 'bills calculator paperwork desk debt';
  if (t.includes('personal loan')) return 'loan paperwork pen signature contract';

  if (t.includes('checking account') || t.includes('free checking')) return 'bank atm debit card hand';
  if (t.includes('money market')) return 'bank documents savings paperwork desk';
  if (t.includes('overdraft')) return 'empty wallet zero balance worry';
  if (t.includes('cd ') || t.includes('certificate of deposit')) return 'bank vault safe deposit gold';
  if (t.includes('bank bonus') || t.includes('sign-up offer')) return 'cash dollars bank deposit hundred';
  if (t.includes('fdic')) return 'bank vault security door safe';
  if (t.includes('choose the right bank') || t.includes('right bank')) return 'bank building entrance corporate';

  if (t.includes('zero-based budget') || t.includes('zero based budget')) return 'budget spreadsheet notebook pen calculator';
  if (t.includes('budget') && t.includes('app')) return 'phone budgeting app screen finance';
  if (t.includes('budget') && (t.includes('parent') || t.includes('families') || t.includes('family'))) return 'family kitchen table budget planning';
  if (t.includes('budget')) return 'budget planner notebook calculator desk';

  if (t.includes('take-home pay') || t.includes('paycheck')) return 'paycheck cash dollars envelope';
  if (t.includes('w-2') || t.includes('w2')) return 'w-2 tax form paperwork desk';
  if (t.includes('side hustle')) return 'laptop home office work side hustle';
  if (t.includes('multiple streams') || t.includes('build wealth') || t.includes('wealth')) return 'success laptop dollars investment';
  if (t.includes('lifestyle inflation') || t.includes('income grows')) return 'business success climbing career';
  if (t.includes('net worth')) return 'spreadsheet calculator finance laptop';

  if (t.includes('tax refund')) return 'tax refund check envelope mail';
  if (t.includes('tax-saving') || t.includes('tax saving')) return 'tax forms calculator paperwork desk';
  if (t.includes('tax')) return 'tax documents 1040 paperwork desk';

  if (t.includes('hsa') || t.includes('health savings account')) return 'stethoscope medical bill calculator';
  if (t.includes('car insurance')) return 'car insurance document keys policy';
  if (t.includes('healthcare cost') || t.includes('healthcare')) return 'medical bills hospital paperwork stethoscope';

  if (t.includes('first-time homebuyer') || t.includes('first time home')) return 'new house keys couple home';
  if (t.includes('mortgage refinance') || t.includes('refinance') && t.includes('mortgage')) return 'mortgage document signature pen house';
  if (t.includes('mortgage') || t.includes('home loan')) return 'house keys mortgage document home';

  if (t.includes('auto loan') || t.includes('car loan')) return 'car keys dealership document new car';

  if (t.includes('inflation')) return 'grocery prices shopping cart receipt';
  if (t.includes('apr') || t.includes('apy')) return 'calculator interest rate paperwork bank';
  if (t.includes('fraud') || t.includes('scam') || t.includes('protect')) return 'cybersecurity padlock laptop security';
  if (t.includes('financial goal') || (t.includes('goal') && t.includes('achieve'))) return 'target dart goal achievement success';
  if (t.includes('employer benefit') || t.includes('benefits package')) return 'office employee handshake benefits';
  if (t.includes('financial mistake')) return 'stressed young adult bills laptop';
  if (t.includes('financial planning checklist') || t.includes('financial planning')) return 'checklist clipboard planning desk pen';

  const catMap = {
    'Savings': 'piggy bank pink coins savings',
    'Budgeting': 'budget planner notebook calculator pen',
    'Credit Cards': 'credit cards wallet payment',
    'Debt': 'bills paperwork calculator debt',
    'Investing': 'stock chart laptop growth investment',
    'Banking': 'bank atm debit card',
    'Credit': 'credit score report document',
    'Insurance': 'umbrella family protection shield',
    'Retirement': 'older couple beach retirement',
    'Housing': 'house keys home front door',
    'Taxes': 'tax forms 1040 calculator paperwork',
    'Income': 'cash dollars hundred envelope',
    'Money Tips': 'coins jar piggy bank savings'
  };

  return catMap[category] || 'coins savings jar money';
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
  const shuffled = [...TOPICS].sort(() => Math.random() - 0.5);

  for (const template of shuffled) {
    const topic = template.replace('{STATE}', state);
    const topicLower = topic.toLowerCase();
    const coreWords = template.replace('{STATE}', '').toLowerCase().replace(/[^a-z ]/g, '').trim().split(' ').filter(w => w.length > 3);
    const isUsed = usedTitles.some(used => {
      const matchCount = coreWords.filter(w => used.includes(w)).length;
      return matchCount >= Math.min(4, coreWords.length);
    });
    if (!isUsed) return { topic, state };
  }

  const fallbackState = pickRandom(STATES);
  const fallbackTopic = pickRandom(TOPICS).replace('{STATE}', fallbackState);
  return { topic: fallbackTopic + ' (' + new Date().getFullYear() + ' update)', state: fallbackState };
}

/**
 * Generate RSS 2.0 feed from generated-posts.json.
 */
function generateRSS() {
  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8'));
  } catch (e) {
    console.log('Could not read generated-posts.json for RSS: ' + e.message);
    return;
  }

  const recentPosts = posts.slice(0, 50);

  function escapeXml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function absoluteImageUrl(img) {
    if (!img) return 'https://savingsclub.com/img/savings-jar.jpg';
    if (img.indexOf('http://') === 0 || img.indexOf('https://') === 0) return img;
    if (img.indexOf('/') === 0) return 'https://savingsclub.com' + img;
    return 'https://savingsclub.com/' + img;
  }

  function toRFC822(post) {
    try {
      if (post.pubDate) return post.pubDate;
      if (post.isoDate) {
        const d = new Date(post.isoDate);
        if (!isNaN(d.getTime())) return d.toUTCString();
      }
      if (post.date) {
        const d = new Date(post.date);
        if (!isNaN(d.getTime())) return d.toUTCString();
      }
    } catch (e) {}
    return new Date().toUTCString();
  }

  const items = recentPosts.map(p => {
    const url = 'https://savingsclub.com/blog/' + p.slug + '/';
    const escapedUrl = escapeXml(url);
    const pubDate = toRFC822(p);
    const imgUrl = absoluteImageUrl(p.image);
    const escapedImgUrl = escapeXml(imgUrl);
    const title = escapeXml(p.title);
    const description = escapeXml(p.excerpt || p.title);
    const category = escapeXml(p.category || 'Money Tips');

    return '  <item>\n' +
      '    <title>' + title + '</title>\n' +
      '    <link>' + escapedUrl + '</link>\n' +
      '    <guid isPermaLink="true">' + escapedUrl + '</guid>\n' +
      '    <pubDate>' + pubDate + '</pubDate>\n' +
      '    <category>' + category + '</category>\n' +
      '    <description><![CDATA[' + (p.excerpt || p.title) + ']]></description>\n' +
      '    <enclosure url="' + escapedImgUrl + '" type="image/jpeg" />\n' +
      '    <media:content url="' + escapedImgUrl + '" medium="image" />\n' +
      '  </item>';
  }).join('\n');

  const now = new Date().toUTCString();
  const rss = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '<channel>\n' +
    '<title>SavingsClub Blog</title>\n' +
    '<link>https://savingsclub.com/blog/</link>\n' +
    '<atom:link href="https://savingsclub.com/rss.xml" rel="self" type="application/rss+xml" />\n' +
    '<description>Free personal finance education, calculators, and money guides for Americans in every state.</description>\n' +
    '<language>en-us</language>\n' +
    '<lastBuildDate>' + now + '</lastBuildDate>\n' +
    '<image>\n' +
    '<url>https://savingsclub.com/img/sc-logo-full.png</url>\n' +
    '<title>SavingsClub Blog</title>\n' +
    '<link>https://savingsclub.com/blog/</link>\n' +
    '</image>\n' +
    items + '\n' +
    '</channel>\n' +
    '</rss>\n';

  fs.writeFileSync('rss.xml', rss);
  console.log('RSS feed updated: rss.xml (' + recentPosts.length + ' items)');
}

/**
 * Extract the first real content paragraph from blog HTML.
 */
function extractExcerpt(htmlContent) {
  const paragraphs = htmlContent.match(/<p[^>]*>[\s\S]*?<\/p>/g) || [];

  let excerpt = '';
  for (const p of paragraphs) {
    let text = p.replace(/<[^>]*>/g, '').trim();

    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ');

    if (text.toLowerCase().includes('educational financial content only') ||
        text.toLowerCase().includes('does not offer financial, legal') ||
        text.toLowerCase().includes('ai research tools')) {
      continue;
    }

    if (text.length < 60) continue;

    excerpt = text;
    break;
  }

  if (!excerpt) return '';

  if (excerpt.length > 220) {
    const truncated = excerpt.substring(0, 220);
    const lastPeriod = truncated.lastIndexOf('.');

    if (lastPeriod > 120) {
      excerpt = truncated.substring(0, lastPeriod + 1);
    } else {
      excerpt = truncated.replace(/\s+\S*$/, '') + '...';
    }
  }

  return excerpt;
}

/**
 * Generate a markdown image report at blog-image-report.md.
 */
function generateImageReport() {
  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8'));
  } catch (e) {
    console.log('Could not read generated-posts.json for image report: ' + e.message);
    return;
  }

  const recentPosts = posts.slice(0, 50);

  const today = new Date().toISOString().split('T')[0];
  const lines = [
    '# Blog Image Report',
    '',
    '_Last updated: ' + today + '_',
    '',
    'Quick review, scroll through the thumbnails below. If an image does NOT match its blog topic, follow the "Replace this image" steps under that post.',
    '',
    '## How to replace a wrong image',
    '',
    '1. Open [Unsplash.com](https://unsplash.com) in a new tab',
    '2. Search for what you want (e.g., `piggy bank coins`)',
    '3. Click an image you like, then click the **"..."** menu, then **Copy image link**',
    '4. Come back here, click the **Edit image** link below the wrong post',
    '5. In the GitHub editor, use **Ctrl+F** to find `<img src="`',
    '6. Replace the URL with the one you copied from Unsplash',
    '7. Scroll to bottom, then **Commit changes**',
    '',
    '---',
    ''
  ];

  recentPosts.forEach((p, i) => {
    const editUrl = 'https://github.com/AllahRakhha/SavingsClub/edit/main/blog/' + p.slug + '/index.html';
    const liveUrl = 'https://savingsclub.com/blog/' + p.slug + '/';
    let imageUrl = p.image || 'https://savingsclub.com/img/savings-jar.jpg';
    if (imageUrl.indexOf('/') === 0) imageUrl = 'https://savingsclub.com' + imageUrl;
    const query = p.searchQuery || '_(not tracked, older post)_';

    lines.push('### ' + (i + 1) + '. ' + p.title);
    lines.push('');
    lines.push('<img src="' + imageUrl + '" width="500" alt="Image for blog post" />');
    lines.push('');
    lines.push('- **Search query used:** `' + query + '`');
    lines.push('- **Live post:** ' + liveUrl);
    lines.push('- **[Edit image on GitHub](' + editUrl + ')**');
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  fs.writeFileSync('blog-image-report.md', lines.join('\n'));
  console.log('Image report updated: blog-image-report.md (' + recentPosts.length + ' posts)');
}

async function generatePost() {
  const client = new Anthropic();
  const usedTitles = getUsedTopics();
  const { topic, state } = pickUnusedTopic(usedTitles);

  console.log('Topic: ' + topic);
  console.log('Used posts so far: ' + usedTitles.length);

  const shuffledCalcs = [...CALCULATOR_LINKS].sort(() => Math.random() - 0.5);
  const requiredLinks = shuffledCalcs.slice(0, 5);
  const linkInstructions = requiredLinks.map(c => `  <a href="${c.url}">${c.name}</a>`).join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: `You are a skilled personal finance writer creating educational content for SavingsClub.com on behalf of the SavingsClub Research Team. Write with confidence and depth like a knowledgeable teacher explaining a topic clearly but never claim to be a licensed financial advisor, expert, or professional. Frame all content as educational information that helps readers understand topics and do their own research, NOT as personal advice or expert recommendations. Use first-person plural ("we," "our," "SavingsClub") to refer to the publication. Write in clear, simple English with short sentences (under 15 words when possible) so non-native English speakers can easily understand. Avoid generic fluff phrases like "In today's fast-paced economic world." Use highly scannable Markdown formatting with clear H2 and H3 subheadings, bold key financial terms, and bulleted lists for complex data. Naturally mention SavingsClub's free interactive calculators and tools at least twice per article once near the introduction and once near the conclusion explaining why we built these tools (to help Americans bypass confusing bank jargon and instantly see their true monthly costs). Subtly weave in that all content is for educational and informational purposes only. Produce SEO-rich content by naturally incorporating target keywords such as "best home loan rates," "personal loan comparison," "credit card rewards," "low interest loans," "savings calculators," and "debt payoff strategies."

LANGUAGE RULES, NEVER claim expertise or give personal advice:
- NEVER write: "As a financial expert...", "In my professional experience...", "I recommend...", "As your advisor...", "Trust me...", "I personally suggest...", "Our experts say...", "Our financial advisors recommend..."
- INSTEAD write: "Many financial educators suggest...", "A common approach is...", "One way to think about this is...", "Educational best practice is...", "Consider this strategy...", "Some Americans choose to...", "The general principle is..."
- The blog is EDUCATIONAL content, not advice. Frame every recommendation as information for the reader to evaluate, not as a directive.

HUMAN-VOICE RULES, CRITICAL TO AVOID AI-DETECTION PENALTIES:
The goal is for your writing to sound like a real American wrote it, not like AI. Follow these rules strictly:

PUNCTUATION:
- NEVER use em-dashes anywhere. This is the number-one AI-detection signal. Replace with commas, periods, or parentheses. Wrong example: "Pay off debt then it saves money" with an em-dash between. Right example: "Pay off debt. It saves money."
- NEVER use en-dashes for number ranges. Write "from $1,500 to $2,000" using the word "to" between numbers. Never use a dash between numbers.
- For section headings (h2/h3), use a colon (:) not a dash. Right example: "Strategy 1: Make Biweekly Payments". Never use a dash in a heading.

FORBIDDEN AI PHRASES (do not use these in any form):
- "Moreover," "Furthermore," "Additionally," at the start of sentences. Use "Also," "Plus," "And," or no transition word at all.
- "It's worth noting that," "Keep in mind that," "Bear in mind that," "It's important to remember that," "It's important to note that." Just say the thing directly without the filler.
- "Whether you're X or Y" sentence openers. Use "If you're X" or just describe the situation directly.
- "Not only X but also Y" construction. Say "X. Plus, Y" or just "X and Y."
- "In today's fast-paced world," "In conclusion," "All in all," "At the end of the day," "When all is said and done."
- "Delve into," "Navigate the complexities," "Embark on," "Leverage," "Robust," "Tapestry," "Realm," "Landscape" (corporate AI buzzwords).

SOUND LIKE A REAL PERSON WROTE THIS:
- Use contractions naturally (don't, won't, can't, you're, it's, that's). AI tends to write "do not" and "you are." Real people use contractions.
- Vary sentence length. Mix short punchy sentences (under 10 words) with longer explanatory ones.
- It's OK to start sentences with "And," "But," "So," "Plus." Real American writers do this constantly.
- Mix list lengths. Don't always do three items. Sometimes two, sometimes four. Sometimes use prose instead of lists.
- Use specific dollar amounts and percentages (real humans love concrete examples).
- Use occasional informal phrasing like "Here's the thing," "The truth is," "Honestly," "Frankly" where it fits naturally.

EXPLAIN THE "WHY", CRITICAL FOR SEO AND READER VALUE:
Google's helpful content system specifically rewards content that explains causation and reasoning (the "why" behind information), not just lists of "what to do." Every major point must explain WHY it matters, not just WHAT to do.

Examples of WHAT vs WHY framing:
- WEAK (just "what"): "Pay off high-interest debt first."
- STRONG (with "why"): "Pay off high-interest debt first because $5,000 at 24% APR costs about $1,200 per year in interest alone. That's money leaving your pocket every month with nothing to show for it."

- WEAK (just "what"): "Use a high-yield savings account."
- STRONG (with "why"): "Use a high-yield savings account because the gap between a 0.40% APY traditional bank and a 4.40% APY online savings account on $10,000 is roughly $400 per year. Same money, same FDIC protection, just different banks."

- WEAK (just "what"): "Build an emergency fund."
- STRONG (with "why"): "Build an emergency fund because the average car repair costs $500 to $1,000 and unexpected medical bills can exceed $2,000. Without savings, these expenses force you onto credit cards at 24% APR, costing you 5 to 10 times the original amount over time."

Use "because," "since," "the reason is," or "this works because" naturally throughout the article. Aim for 6 to 8 uses where they fit naturally. Do not force them, but always explain reasoning.

CRITICAL REQUIREMENTS:
- Write 1,900 to 2,300 words minimum. This is non-negotiable.
- Use HTML formatting: h2/h3 for sections, p for paragraphs, ul/li for lists where appropriate
- Do NOT include h1 (the template adds it)
- Start with: <p><em>SavingsClub provides educational financial content only and does not offer financial, legal, tax, or investment advice. This content was produced with the help of AI research tools and reviewed by our team before publication. Rates, terms, and product details may change. Always verify current information directly with the provider before making financial decisions.</em></p>
- Use at least 6 subheadings (h2 or h3) spread throughout, one every 200 to 300 words
- Include real-world examples with specific dollar amounts (e.g., "On a $50,000 salary..." or "If you save $300/month...")
- Reference specific US states naturally (not just ${state})
- Use 2026 as the current year
- Do NOT fabricate specific statistics, rates, or study results
- When referencing data, cite general sources (Federal Reserve, BLS, FDIC, Consumer Financial Protection Bureau)
- Be practical, actionable, and specific, not generic filler
- EXPLICIT "WHY" STATEMENT: In the first 150 words of the article, you must output a sentence explaining the exact purpose of the page using this exact template format: "Our SavingsClub Research Team built our interactive [Insert Tool Name Here] calculator above to help everyday Americans break down complex [Insert Topic Here] numbers without confusing bank jargon."
- Do not output the raw bracket placeholders. You must dynamically replace "[Insert Tool Name Here]" and "[Insert Topic Here]" with the specific financial tool name and topic of the article you are currently writing.

INTERNAL LINKS, You MUST include at least 4 of these links naturally within the article:
${linkInstructions}
  <a href="/blog/">Read more guides on SavingsClub</a>

Place links where they naturally fit the content. Example: "Use our <a href="/budget-planner/">Budget Planner</a> to see your 50/30/20 breakdown."

STRUCTURE:
1. Opening paragraph that hooks the reader with a relatable scenario or surprising fact
2. 4 to 6 main sections with h2/h3 headings covering different aspects of the topic
3. Practical tips or step-by-step educational guidance in each section
4. Closing section with a clear call-to-action linking to a SavingsClub calculator

Write unique, original content. Explain the WHY behind every recommendation. Be specific to the topic, no generic filler. Remember: NO em-dashes, NO "Moreover," NO "It's worth noting," NO "Whether you're." Sound like a real person wrote this.`,
    messages: [{ role: 'user', content: 'Write a comprehensive personal finance blog post about: ' + topic }]
  });

  const content = message.content[0].text;
  const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
  let title = titleMatch ? titleMatch[1] : topic;

  // Apply AI-tell cleanup to title (em-dash in title becomes colon, not comma)
  title = title.replace(/&mdash;|&#8212;|&#x2014;/gi, '\u2014');
  title = title.replace(/&ndash;|&#8211;|&#x2013;/gi, '\u2013');
  title = title.replace(/\s*[\u2014\u2013]\s*/g, ': ');

  // Extract content, remove h1, then run full AI-tell cleanup
  let cleanContent = content.replace(/<h1>.*?<\/h1>/, '');
  cleanContent = removeAITells(cleanContent);

  const category = categorize(title);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isoDate = new Date().toISOString().split('T')[0];
  const slug = makeSlug(title);
  const wordCount = cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const searchQuery = getImageQuery(title, category);
  let blogImage = '/img/savings-jar.jpg';
  let photoCredit = '';
  try {
    console.log('Unsplash query: "' + searchQuery + '" (for topic: ' + title + ')');
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
      const https = require('https');
      const unsplashData = await new Promise((resolve, reject) => {
        const url = 'https://api.unsplash.com/photos/random?query=' + encodeURIComponent(searchQuery) + '&orientation=landscape&content_filter=high&client_id=' + unsplashKey;
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); }
            catch (e) { reject(e); }
          });
        }).on('error', reject);
      });
      if (unsplashData && unsplashData.urls && unsplashData.urls.raw) {
        blogImage = unsplashData.urls.raw + '&w=1200&q=75&auto=format';
        const photographer = unsplashData.user ? unsplashData.user.name : 'Unsplash';
        const profileUrl = unsplashData.user && unsplashData.user.links ? unsplashData.user.links.html : 'https://unsplash.com';
        photoCredit = '<p style="font-size:.75rem;color:var(--text-lighter);margin-top:8px;text-align:center">Photo by <a href="' + profileUrl + '?utm_source=savingsclub&utm_medium=referral" style="color:var(--text-lighter)">' + photographer + '</a> on <a href="https://unsplash.com?utm_source=savingsclub&utm_medium=referral" style="color:var(--text-lighter)">Unsplash</a></p>';
        console.log('Unsplash image: ' + unsplashData.urls.regular + ' by ' + photographer);
      } else {
        console.log('Unsplash returned no usable result; using default. Response: ' + JSON.stringify(unsplashData).substring(0, 200));
      }
    } else {
      console.log('UNSPLASH_ACCESS_KEY not set; using default image');
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
    isoDate: isoDate,
    pubDate: new Date().toUTCString(),
    author: 'SavingsClub Research Team',
    excerpt: extractExcerpt(cleanContent) || title,
    image: blogImage,
    searchQuery: searchQuery
  };

  const postDir = path.join('blog', slug);
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  const escapedTitle = title.replace(/"/g, '&quot;');

  const postHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | SavingsClub</title>
<meta name="description" content="${title}. Personal finance guide from SavingsClub.">
<link rel="canonical" href="https://savingsclub.com/blog/${slug}/">
<meta property="og:title" content="${escapedTitle}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://savingsclub.com/blog/${slug}/">
<meta property="og:site_name" content="SavingsClub">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${escapedTitle}","author":{"@type":"Organization","name":"SavingsClub"},"publisher":{"@type":"Organization","name":"SavingsClub","url":"https://savingsclub.com"},"datePublished":"${isoDate}","description":"${escapedTitle}. Educational personal finance guide."}</script>
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
<div style="color:var(--text-light);margin-bottom:32px;font-size:.95rem">By SavingsClub Research Team · ${date} · ${readTime} min read</div>
<img src="${blogImage}" alt="${title}" style="width:100%;height:300px;object-fit:cover;border-radius:0;margin:0 -24px 32px;width:calc(100% + 48px);max-width:none;box-shadow:none" loading="lazy">
${photoCredit}
<div class="blog-content">${cleanContent}</div>
<div style="margin-top:40px;padding:32px;background:linear-gradient(135deg,#F0FDF4,#F8FAFC);border-radius:16px;border:1px solid rgba(5,150,105,.1);text-align:center"><p style="font-size:1.1rem;font-weight:600;color:#059669;margin-bottom:8px">Thank you for reading!</p><p style="color:var(--text-light);font-size:.95rem;margin-bottom:16px">If this guide helped you, explore our free calculators to put these ideas into action.</p><a href="../../savings-calculator/" style="background:linear-gradient(135deg,#059669,#10B981);color:#fff;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:600;font-size:.95rem;box-shadow:0 4px 15px rgba(5,150,105,.3)">Try Our Free Calculators →</a></div>
</div></section>

<footer>
<div class="container">
<div class="footer-grid">
<div><div class="footer-brand"><div class="logo-mark" style="width:30px;height:30px;border-radius:9px"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="width:16px;height:16px"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>SavingsClub</div><p style="font-size:.9rem;max-width:280px;line-height:1.6">Free financial calculators and educational guides for Americans in every state.</p></div>
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

  let posts = [];
  try { posts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8')); } catch (e) { posts = []; }
  posts.unshift(post);
  fs.writeFileSync('generated-posts.json', JSON.stringify(posts, null, 2));

  try {
    let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
    const newUrl = '  <url><loc>https://savingsclub.com/blog/' + slug + '/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>';
    if (!sitemap.includes('/blog/' + slug + '/')) {
      sitemap = sitemap.replace('</urlset>', newUrl + '\n</urlset>');
      fs.writeFileSync('sitemap.xml', sitemap);
      console.log('Added to sitemap');
    }
  } catch (e) { console.log('Could not update sitemap: ' + e.message); }

  generateRSS();
  generateImageReport();

  console.log('Published: ' + title + ' [' + category + ']');
  console.log('Word count estimate: ' + cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).length);
}

generatePost().catch(err => {
  console.error('ERROR:', err.message || err);
  process.exit(1);
});
