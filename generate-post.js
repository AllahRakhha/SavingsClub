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

/**
 * PRIORITY TOPIC QUEUE (July 2026, from Semrush export: informational intent,
 * KD 40 or under, volume 150+, no calculator-intent terms).
 * Consumed IN ORDER before any random template. Each entry carries its own
 * keyword data so the SEO targeting block in the prompt is always populated.
 */
const PRIORITY_TOPICS = [
  { topic: "Checking account vs savings account: Which one do you actually need",
    keywords: [
      { kw: "checking account vs savings account", vol: 5400 },
      { kw: "difference between savings and checking account", vol: 1600 },
      { kw: "checking or savings account", vol: 1900 },
      { kw: "what account fees should you avoid with savings accounts", vol: 1300 }
    ] },
  { topic: "529 plan rules: What the money can and cannot be used for",
    keywords: [
      { kw: "529 plan rules", vol: 1900 },
      { kw: "what can a 529 plan be used for", vol: 1000 },
      { kw: "what can 529 money be used for", vol: 880 }
    ] },
  { topic: "Short term financial goals: Examples that actually work",
    keywords: [
      { kw: "short term financial goals", vol: 1600 }
    ] },
  { topic: "Debt payoff spreadsheet: How to build one in 20 minutes",
    keywords: [
      { kw: "debt payoff spreadsheet", vol: 1300 }
    ] },
  { topic: "Is a recession coming: Warning signs to watch in 2026",
    keywords: [
      { kw: "recession coming", vol: 1300 }
    ] },
  { topic: "What is the average 401k balance at age 65",
    keywords: [
      { kw: "what is the average 401k balance at age 65", vol: 1000 },
      { kw: "annual 401k contribution in 2026 if you are 70", vol: 880 }
    ] },
  { topic: "Which credit report is most accurate",
    keywords: [
      { kw: "which credit report is most accurate", vol: 880 }
    ] },
  { topic: "Illinois state income tax rate: What you actually pay in 2026",
    keywords: [
      { kw: "illinois state income tax rate", vol: 3600 }
    ] },
  { topic: "Michigan property tax: How it works and what you will pay",
    keywords: [
      { kw: "michigan property tax", vol: 1900 },
      { kw: "detroit property tax", vol: 1000 }
    ] },
  { topic: "529 plans California: Rules, tax benefits, and how to start",
    keywords: [
      { kw: "529 plans california", vol: 1300 }
    ] }
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

/**
 * REAL keyword data from Moz Keyword Explorer + Keyword Gap Analysis (June 2026).
 * Each key is a substring match against the topic title (after {STATE} replacement).
 * Each value is an array of 1 to 3 target keywords with verified monthly U.S. search volumes.
 *
 * The post generator picks the LONGEST matching key, then passes those keywords to the
 * writer prompt. The writer uses the FIRST keyword as primary (in H1, first 100 words,
 * one H2) and the rest as secondary (mentioned 1-2 times naturally in the body).
 *
 * Do NOT pass these numbers into the article text. They are targeting data for the writer.
 */
const TOPIC_KEYWORDS = {
  // Calculator-heavy topics (massive search volume)
  "auto loan rates": [
    { kw: "auto loan calculator", vol: 331226 },
    { kw: "car payment calculator", vol: 331125 },
    { kw: "car loan calculator", vol: 293241 }
  ],
  "compound interest": [
    { kw: "compound interest calculator", vol: 332576 }
  ],
  "mortgage rates": [
    { kw: "mortgage rates", vol: 337171 },
    { kw: "current mortgage rates", vol: 208148 },
    { kw: "30 year mortgage rates", vol: 108363 }
  ],
  "first-time homebuyer": [
    { kw: "first time home buyer", vol: 60000 },
    { kw: "mortgage calculator", vol: 1266192 }
  ],
  "house down payment": [
    { kw: "down payment", vol: 50000 },
    { kw: "mortgage calculator", vol: 1266192 }
  ],
  "inflation affects your savings": [
    { kw: "inflation calculator", vol: 305601 }
  ],
  "investment portfolio from scratch": [
    { kw: "investment calculator", vol: 255882 }
  ],
  "start investing with just": [
    { kw: "investment calculator", vol: 255882 },
    { kw: "how to invest", vol: 50000 }
  ],
  "save for retirement in your 30s": [
    { kw: "retirement calculator", vol: 151324 }
  ],
  "plan for early retirement in your 40s": [
    { kw: "early retirement", vol: 50000 },
    { kw: "retirement calculator", vol: 151324 }
  ],
  "401k employer matching": [
    { kw: "401k calculator", vol: 60000 },
    { kw: "401k match", vol: 30000 }
  ],
  "roth ira vs traditional ira": [
    { kw: "roth ira", vol: 183997 },
    { kw: "ira", vol: 86126 }
  ],
  "high-yield savings accounts": [
    { kw: "high yield savings account", vol: 115104 }
  ],
  "high-yield cds vs savings": [
    { kw: "high yield savings account", vol: 115104 },
    { kw: "cd rates", vol: 101264 }
  ],
  "certificate of deposit": [
    { kw: "cd rates", vol: 101264 }
  ],
  "personal loans for debt consolidation": [
    { kw: "personal loans", vol: 253585 },
    { kw: "debt consolidation loan", vol: 40000 }
  ],
  "calculate your net worth": [
    { kw: "net worth calculator", vol: 50000 }
  ],
  "improve your credit score": [
    { kw: "credit score", vol: 100000 },
    { kw: "free credit report", vol: 87839 }
  ],
  "credit report and fixing errors": [
    { kw: "free credit report", vol: 87839 },
    { kw: "annual credit report", vol: 86629 }
  ],
  "secured credit cards": [
    { kw: "secured credit card", vol: 50000 }
  ],
  "cash back credit cards": [
    { kw: "cash back credit card", vol: 50000 }
  ],
  "rewards credit cards": [
    { kw: "rewards credit card", vol: 50000 }
  ],
  "travel credit cards": [
    { kw: "travel credit card", vol: 50000 }
  ],
  "no-annual-fee credit cards": [
    { kw: "no annual fee credit card", vol: 30000 }
  ],
  "balance transfer": [
    { kw: "balance transfer credit card", vol: 50000 }
  ],
  "credit card rewards strategies": [
    { kw: "credit card rewards", vol: 50000 }
  ],
  "credit cards for small business": [
    { kw: "business credit card", vol: 50000 }
  ],
  "tax refund": [
    { kw: "tax refund", vol: 60000 },
    { kw: "tax brackets", vol: 95752 }
  ],
  "w-2": [
    { kw: "w2 form", vol: 30000 },
    { kw: "tax brackets", vol: 95752 }
  ],
  "tax-saving strategies for freelancers": [
    { kw: "freelance taxes", vol: 30000 },
    { kw: "tax brackets", vol: 95752 }
  ],
  "save money on car insurance": [
    { kw: "car insurance quotes", vol: 339229 },
    { kw: "cheap car insurance", vol: 184742 }
  ],
  "529 plan": [
    { kw: "529 plan", vol: 50000 },
    { kw: "college savings", vol: 30000 }
  ],
  "health savings accounts": [
    { kw: "fsa", vol: 150500 },
    { kw: "health savings account", vol: 50000 }
  ],
  "pay off student loan debt": [
    { kw: "pay off student loans", vol: 40000 },
    { kw: "student loans", vol: 60000 }
  ],
  "refinancing student loans": [
    { kw: "refinance student loans", vol: 30000 }
  ],
  "money market accounts": [
    { kw: "money market account", vol: 50000 }
  ],
  "free checking accounts": [
    { kw: "free checking account", vol: 30000 }
  ],
  "avoid overdraft fees": [
    { kw: "overdraft fee", vol: 30000 }
  ],
  "apr vs apy": [
    { kw: "apr vs apy", vol: 30000 }
  ],
  "fdic insurance": [
    { kw: "fdic insurance", vol: 30000 }
  ],
  "debt snowball vs debt avalanche": [
    { kw: "debt snowball", vol: 30000 },
    { kw: "debt avalanche", vol: 25000 }
  ],
  "debt payoff plan": [
    { kw: "debt payoff", vol: 30000 }
  ],
  "paying off credit card debt": [
    { kw: "credit card payoff calculator", vol: 30000 },
    { kw: "pay off credit card debt", vol: 30000 }
  ],
  "save money while paying off debt": [
    { kw: "debt payoff", vol: 30000 }
  ],
  "take-home pay explained": [
    { kw: "paycheck calculator", vol: 50000 },
    { kw: "take home pay", vol: 30000 }
  ],
  "negotiate lower interest rates": [
    { kw: "credit card interest rate", vol: 30000 }
  ],
  "side hustles for extra income": [
    { kw: "side hustle ideas", vol: 50000 }
  ],
  "multiple streams of income": [
    { kw: "passive income", vol: 50000 }
  ],
  "build credit as a new immigrant": [
    { kw: "build credit", vol: 30000 },
    { kw: "credit score", vol: 100000 }
  ],
  "build wealth on a modest income": [
    { kw: "build wealth", vol: 30000 }
  ],
  "emergency fund guide": [
    { kw: "emergency fund", vol: 50000 }
  ],
  "zero-based budget": [
    { kw: "zero based budget", vol: 30000 }
  ],
  "budgeting strategies for families": [
    { kw: "family budget", vol: 30000 },
    { kw: "how to budget", vol: 30000 }
  ],
  "budgeting apps and tools": [
    { kw: "budgeting apps", vol: 50000 }
  ],
  "save for a wedding": [
    { kw: "wedding budget", vol: 30000 }
  ],
  "save for a vacation": [
    { kw: "vacation budget", vol: 30000 }
  ],
  "save money on groceries": [
    { kw: "save money on groceries", vol: 30000 }
  ],
  "save money on utilities": [
    { kw: "lower utility bills", vol: 25000 }
  ],
  "save money on rent": [
    { kw: "lower rent", vol: 25000 }
  ],
  "save money on healthcare": [
    { kw: "save on healthcare costs", vol: 25000 }
  ],
  "save money on holiday shopping": [
    { kw: "save on holiday shopping", vol: 25000 }
  ],
  "back-to-school expenses": [
    { kw: "back to school budget", vol: 25000 }
  ],
  "financially prepare for having a baby": [
    { kw: "baby budget", vol: 30000 }
  ],
  "financial planning checklist for new parents": [
    { kw: "financial planning for new parents", vol: 25000 }
  ],
  "money moves for millennials": [
    { kw: "personal finance for millennials", vol: 30000 }
  ],
  "financial mistakes to avoid in your 20s": [
    { kw: "money mistakes in your 20s", vol: 25000 }
  ],
  "prepare financially for a recession": [
    { kw: "prepare for recession", vol: 30000 },
    { kw: "recession proof", vol: 30000 }
  ],
  "recover financially after job loss": [
    { kw: "financial recovery after job loss", vol: 25000 }
  ],
  "avoid lifestyle inflation": [
    { kw: "lifestyle creep", vol: 30000 }
  ],
  "set financial goals": [
    { kw: "financial goals", vol: 30000 }
  ],
  "protect yourself from financial fraud": [
    { kw: "identity theft", vol: 50000 }
  ],
  "best bank bonuses": [
    { kw: "bank sign up bonus", vol: 30000 }
  ],
  "manage money as a couple": [
    { kw: "couples finance", vol: 25000 }
  ],
  "single-income families": [
    { kw: "single income family budget", vol: 25000 }
  ],
  "gig economy workers": [
    { kw: "gig economy taxes", vol: 25000 }
  ],
  "teach kids about money": [
    { kw: "teaching kids about money", vol: 25000 }
  ],
  "choose the right bank": [
    { kw: "best banks", vol: 30000 }
  ],
  "maximize your employer benefits": [
    { kw: "employee benefits", vol: 30000 }
  ],
  "apps for saving money automatically": [
    { kw: "savings apps", vol: 30000 }
  ],
  "mortgage rates and when to refinance": [
    { kw: "refinance mortgage", vol: 50000 },
    { kw: "current mortgage rates", vol: 208148 }
  ]
};

/**
 * Find the BEST matching keyword set for a topic by longest-substring match.
 * Returns an array of { kw, vol } or [] if no match.
 */
function getKeywordsForTopic(topic) {
  const lowerTopic = topic.toLowerCase();
  let bestMatch = [];
  let longestKey = 0;
  for (const key in TOPIC_KEYWORDS) {
    if (lowerTopic.indexOf(key) !== -1 && key.length > longestKey) {
      bestMatch = TOPIC_KEYWORDS[key];
      longestKey = key.length;
    }
  }
  return bestMatch;
}

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
  // 1) Priority queue first, in order. Each topic used once, then skipped forever.
  for (const entry of PRIORITY_TOPICS) {
    const coreWords = entry.topic.toLowerCase().replace(/[^a-z ]/g, '').trim().split(' ').filter(w => w.length > 3);
    const isUsed = usedTitles.some(used => {
      const matchCount = coreWords.filter(w => used.includes(w)).length;
      return matchCount >= Math.min(4, coreWords.length);
    });
    if (!isUsed) return { topic: entry.topic, state: pickRandom(STATES), priorityKeywords: entry.keywords };
  }

  // 2) Fall back to the random template pool.
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
    if (!isUsed) return { topic, state, priorityKeywords: null };
  }

  const fallbackState = pickRandom(STATES);
  const fallbackTopic = pickRandom(TOPICS).replace('{STATE}', fallbackState);
  return { topic: fallbackTopic + ' (' + new Date().getFullYear() + ' update)', state: fallbackState, priorityKeywords: null };
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

/**
 * Auto-regenerate /blog/index.html from generated-posts.json.
 *
 * THIS IS THE PERMANENT FIX for the Google AdSense JavaScript rendering issue.
 * After every new blog post publishes, this rebuilds the blog listing page as
 * fully static HTML, so Google's crawler can read every post title, excerpt,
 * and link directly from the source. No JavaScript fetching, no "Please enable
 * JavaScript" fallback message.
 *
 * Template MATCHES the deployed /blog/index.html:
 *   - Standard <nav id="mainNav"> + mobile menu drawer
 *   - Navy + emerald gradient hero
 *   - "Keep More of What You Earn" slogan
 *   - Filter bar (NON-sticky, so it does not collide with nav)
 *   - Standard footer with 4 columns + "Educational content only" disclaimer
 *   - Cookie banner script
 *   - Image fallback: if any Unsplash URL fails, shows branded category placeholder
 *
 * IMPORTANT: This OVERWRITES /blog/index.html every time the script runs.
 * Do not manually edit /blog/index.html, your changes will be lost on the
 * next blog publish.
 */
function generateBlogIndex() {
  let posts = [];
  try {
    posts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8'));
  } catch (e) {
    console.log('Could not read generated-posts.json for blog index: ' + e.message);
    return;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
  }

  function getImageUrl(post) {
    const img = post.image || '';
    // Swap broken local fallback URLs with a working Unsplash placeholder.
    // The browser-side onerror handler will still show the category badge if
    // even this URL fails.
    if (!img || img.indexOf('savings-jar.jpg') !== -1) {
      return 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.1.0&w=1200&q=75&auto=format';
    }
    return img;
  }

  // Build a card for each post
  const cards = posts.map(p => {
    const slug = escapeAttr(p.slug || '');
    const titleAttr = escapeAttr(p.title || '');
    const titleHtml = escapeHtml(p.title || '');
    const categoryHtml = escapeHtml(p.category || 'Money Tips');
    const categoryAttr = escapeAttr(p.category || 'Money Tips');
    const dateHtml = escapeHtml(p.date || '');
    const excerptHtml = escapeHtml(p.excerpt || p.title || '');
    const image = getImageUrl(p);

    return '    <a href="/blog/' + slug + '/" class="bi-card" data-cat="' + categoryAttr + '">\n' +
      '      <div class="bi-image-wrap">\n' +
      '        <img class="bi-image" src="' + image + '" alt="' + titleAttr + '" loading="lazy" onerror="this.parentNode.classList.add(\'bi-img-error\')">\n' +
      '        <div class="bi-fallback">' + categoryHtml + '</div>\n' +
      '      </div>\n' +
      '      <div class="bi-content">\n' +
      '        <div class="bi-meta">\n' +
      '          <span class="bi-category">' + categoryHtml + '</span>\n' +
      '          <span class="bi-date">' + dateHtml + '</span>\n' +
      '        </div>\n' +
      '        <h2>' + titleHtml + '</h2>\n' +
      '        <p class="bi-excerpt">' + excerptHtml + '</p>\n' +
      '        <span class="bi-readmore">Read article</span>\n' +
      '      </div>\n' +
      '    </a>';
  }).join('\n\n');

  // Build dynamic filter chips. Only show chips for categories that have posts.
  const categoriesInUse = [...new Set(posts.map(p => p.category || 'Money Tips'))];
  const chipOrder = ['Savings', 'Credit', 'Debt', 'Credit Cards', 'Budgeting', 'Retirement', 'Money Tips', 'Housing', 'Income', 'Investing', 'Banking', 'Insurance', 'Taxes'];
  const orderedCategories = chipOrder.filter(c => categoriesInUse.includes(c));
  categoriesInUse.forEach(c => {
    if (!orderedCategories.includes(c)) orderedCategories.push(c);
  });

  const chipsHtml = orderedCategories.map(c =>
    '    <button class="bi-chip" data-cat="' + escapeAttr(c) + '">' + escapeHtml(c) + '</button>'
  ).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Personal Finance Blog | SavingsClub</title>
<meta name="description" content="Practical money guides on budgeting, saving, credit, debt, retirement, and investing. Built to help you keep more of what you earn.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="https://savingsclub.com/blog/">
<link rel="icon" type="image/png" href="/img/sc-favicon.png">

<meta property="og:type" content="website">
<meta property="og:url" content="https://savingsclub.com/blog/">
<meta property="og:title" content="Personal Finance Blog | SavingsClub">
<meta property="og:description" content="Practical money guides on budgeting, saving, credit, debt, retirement, and investing.">
<meta property="og:image" content="https://savingsclub.com/img/sc-logo-full.png">
<meta property="og:site_name" content="SavingsClub">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Personal Finance Blog | SavingsClub">
<meta name="twitter:description" content="Practical money guides on budgeting, saving, credit, debt, retirement, and investing.">
<meta name="twitter:image" content="https://savingsclub.com/img/sc-logo-full.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/css/style.css">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "SavingsClub Blog",
  "url": "https://savingsclub.com/blog/",
  "description": "Practical money guides on budgeting, saving, credit, debt, retirement, and investing.",
  "publisher": {
    "@type": "Organization",
    "name": "SavingsClub",
    "url": "https://savingsclub.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://savingsclub.com/img/sc-logo-full.png"
    }
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Home","item":"https://savingsclub.com/"},
    {"@type":"ListItem","position":2,"name":"Blog","item":"https://savingsclub.com/blog/"}
  ]
}
</script>

<style>
.bi-page *{box-sizing:border-box}
.bi-page{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:#F8FAFC;color:#0A1628;line-height:1.6;-webkit-font-smoothing:antialiased}
.bi-page h1,.bi-page h2,.bi-page h3{font-family:'Plus Jakarta Sans',sans-serif;color:#0A1628;line-height:1.2;margin:0}

.bi-hero{background:linear-gradient(135deg,#0A1628 0%,#0F2540 50%,#059669 100%);color:#fff;padding:100px 24px 100px;text-align:center;position:relative;overflow:hidden}
.bi-hero::before{content:'';position:absolute;top:-40%;right:-15%;width:60%;height:180%;background:radial-gradient(circle,rgba(16,185,129,0.22) 0%,transparent 60%);pointer-events:none}
.bi-hero::after{content:'';position:absolute;bottom:-40%;left:-15%;width:50%;height:160%;background:radial-gradient(circle,rgba(52,211,153,0.14) 0%,transparent 60%);pointer-events:none}
.bi-hero-inner{max-width:900px;margin:0 auto;position:relative;z-index:1}
.bi-badge{display:inline-block;background:rgba(16,185,129,0.18);color:#34D399;padding:8px 20px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:24px;border:1px solid rgba(16,185,129,0.35)}
.bi-hero h1{font-size:clamp(38px,5.5vw,58px);color:#fff;font-weight:800;margin-bottom:20px;letter-spacing:-0.02em;line-height:1.1}
.bi-hero h1 .bi-accent{color:#34D399}
.bi-hero p{font-size:clamp(16px,2vw,19px);color:rgba(255,255,255,0.82);max-width:680px;margin:0 auto;line-height:1.6}

.bi-filter-section{background:#fff;border-bottom:1px solid #E2E8F0;padding:24px 24px 24px;box-shadow:0 2px 12px rgba(10,22,40,0.04)}
.bi-filter-bar{max-width:1200px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.bi-chip{background:#F1F5F9;border:1px solid transparent;color:#475569;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s ease;font-family:'DM Sans',sans-serif;white-space:nowrap}
.bi-chip:hover{background:#fff;border-color:#10B981;color:#059669;transform:translateY(-1px);box-shadow:0 4px 14px rgba(16,185,129,0.15)}
.bi-chip.active{background:linear-gradient(135deg,#10B981,#059669);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(16,185,129,0.35)}

.bi-posts-section{max-width:1200px;margin:0 auto;padding:56px 24px 90px}
.bi-posts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:28px;align-items:start}
.bi-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(10,22,40,0.06);transition:transform 0.3s ease,box-shadow 0.3s ease,border-color 0.3s ease;display:flex;flex-direction:column;text-decoration:none;color:inherit;border:1px solid #F1F5F9;position:relative}
.bi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#10B981,#34D399);opacity:0;transition:opacity 0.3s;z-index:2}
.bi-card:hover{transform:translateY(-6px);box-shadow:0 14px 36px rgba(10,22,40,0.14);border-color:#D1FAE5}
.bi-card:hover::before{opacity:1}
.bi-image-wrap{position:relative;width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,#0A1628 0%,#1E293B 100%);overflow:hidden}
.bi-image{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s ease}
.bi-card:hover .bi-image{transform:scale(1.04)}
.bi-fallback{position:absolute;inset:0;display:none;align-items:center;justify-content:center;color:#34D399;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:22px;letter-spacing:1.5px;text-transform:uppercase;background:linear-gradient(135deg,#0A1628,#1E293B)}
.bi-fallback::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,rgba(16,185,129,0.22),transparent 60%);pointer-events:none}
.bi-image-wrap.bi-img-error .bi-image{display:none}
.bi-image-wrap.bi-img-error .bi-fallback{display:flex}
.bi-content{padding:22px 22px 26px;flex:1;display:flex;flex-direction:column}
.bi-meta{display:flex;gap:12px;align-items:center;margin-bottom:14px;flex-wrap:wrap}
.bi-category{background:rgba(16,185,129,0.1);color:#059669;padding:5px 12px;border-radius:999px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;font-size:11px}
.bi-date{color:#94A3B8;font-weight:500;font-size:12px}
.bi-card h2{font-size:20px;font-weight:700;line-height:1.3;margin-bottom:12px;color:#0A1628;font-family:'Plus Jakarta Sans',sans-serif}
.bi-excerpt{font-size:15px;color:#475569;line-height:1.6;margin-bottom:18px;flex:1;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.bi-readmore{display:inline-flex;align-items:center;gap:6px;color:#059669;font-weight:700;font-size:14px;margin-top:auto;letter-spacing:0.2px}
.bi-readmore::after{content:'→';transition:transform 0.2s ease;display:inline-block}
.bi-card:hover .bi-readmore::after{transform:translateX(5px)}
.bi-card.bi-hidden{display:none}

.bi-empty{grid-column:1/-1;text-align:center;padding:60px 20px;color:#64748B}
.bi-empty h3{font-size:20px;color:#0A1628;margin-bottom:8px}

.bi-cta{background:linear-gradient(135deg,#0A1628 0%,#0F2540 50%,#059669 100%);color:#fff;text-align:center;padding:70px 24px;position:relative;overflow:hidden}
.bi-cta::before{content:'';position:absolute;top:-30%;right:-10%;width:50%;height:160%;background:radial-gradient(circle,rgba(16,185,129,0.18) 0%,transparent 60%);pointer-events:none}
.bi-cta-inner{max-width:720px;margin:0 auto;position:relative;z-index:1}
.bi-cta h2{color:#fff;font-size:clamp(26px,3.5vw,36px);margin-bottom:14px;font-weight:800}
.bi-cta p{color:rgba(255,255,255,0.78);font-size:17px;margin-bottom:30px;line-height:1.6}
.bi-cta-buttons{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.bi-cta-btn{display:inline-block;padding:14px 30px;border-radius:999px;font-weight:700;text-decoration:none;font-size:15px;transition:all 0.2s ease;font-family:'Plus Jakarta Sans',sans-serif}
.bi-cta-btn-primary{background:linear-gradient(135deg,#10B981,#059669);color:#fff;box-shadow:0 6px 20px rgba(16,185,129,0.35)}
.bi-cta-btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(16,185,129,0.45)}
.bi-cta-btn-secondary{background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.22)}
.bi-cta-btn-secondary:hover{background:rgba(255,255,255,0.16);transform:translateY(-2px)}

@media (max-width:900px){
  .bi-hero{padding:70px 20px 70px}
  .bi-posts-section{padding:40px 20px 60px}
  .bi-posts-grid{grid-template-columns:1fr;gap:22px}
  .bi-filter-section{padding:16px 20px}
  .bi-chip{padding:9px 16px;font-size:13px}
  .bi-cta{padding:54px 20px}
}
</style>
</head>
<body class="bi-page">

<nav id="mainNav">
<div class="nav-inner">
<div class="logo" onclick="location.href='/'">
<div class="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
SavingsClub
</div>
<div class="nav-links" id="navLinks">
<a href="/">Home</a>
<a href="/savings-calculator/">Calculators</a>
<a href="/credit-cards/">Credit Cards</a>
<a href="/blog/" class="active">Blog</a>
<a href="/banking/">Banking</a>
<a href="/about/">About</a>
<a href="/faq/">FAQ</a>
</div>
<div class="hamburger" onclick="toggleMobile()"><span></span><span></span><span></span></div>
</div>
</nav>

<div class="mobile-menu" id="mobileMenu">
<a href="/">Home</a>
<a href="/savings-calculator/">Savings</a>
<a href="/budget-planner/">Budget</a>
<a href="/mortgage-calculator/">Mortgage</a>
<a href="/debt-payoff-calculator/">Debt Payoff</a>
<a href="/credit-cards/">Credit Cards</a>
<a href="/blog/">Blog</a>
<a href="/banking/">Banking</a>
<a href="/about/">About</a>
<a href="/contact/">Contact</a>
</div>

<header class="bi-hero">
  <div class="bi-hero-inner">
    <span class="bi-badge">SavingsClub Blog</span>
    <h1>Keep More of <span class="bi-accent">What You Earn.</span></h1>
    <p>Practical money guides on budgeting, saving, credit, debt, and retirement. Built for real life, not finance class.</p>
  </div>
</header>

<div class="bi-filter-section">
  <div class="bi-filter-bar" role="group" aria-label="Filter blog posts by category">
    <button class="bi-chip active" data-cat="all">All Posts</button>
${chipsHtml}
  </div>
</div>

<main class="bi-posts-section">
  <div class="bi-posts-grid" id="biPostsGrid">

${cards}

  </div>
</main>

<section class="bi-cta">
  <div class="bi-cta-inner">
    <h2>Run the Numbers Yourself</h2>
    <p>Reading is one thing. Knowing exactly what to do with your money is another. Use our free calculators to plug in your real numbers and see what works for you.</p>
    <div class="bi-cta-buttons">
      <a href="/" class="bi-cta-btn bi-cta-btn-primary">Browse Calculators</a>
      <a href="/about/" class="bi-cta-btn bi-cta-btn-secondary">About SavingsClub</a>
    </div>
  </div>
</section>

<footer>
<div class="container">
<div class="footer-grid">
<div>
<div class="footer-brand"><div class="logo-mark" style="width:30px;height:30px;border-radius:9px"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="width:16px;height:16px"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>SavingsClub</div>
<p style="font-size:.9rem;max-width:280px;line-height:1.6">Free financial tools and educational guides for Americans in every state. Making money decisions simpler since 2026.</p>
</div>
<div>
<h4>Calculators</h4>
<a href="/savings-calculator/">Savings Calculator</a>
<a href="/budget-planner/">Budget Planner</a>
<a href="/mortgage-calculator/">Mortgage Calculator</a>
<a href="/debt-payoff-calculator/">Debt Payoff</a>
<a href="/auto-loan-calculator/">Auto Loan</a>
<a href="/net-worth-calculator/">Net Worth</a>
</div>
<div>
<h4>Resources</h4>
<a href="/blog/">Blog</a>
<a href="/credit-cards/">Credit Cards</a>
<a href="/banking/">Banking</a>
<a href="/contact/">Contact Us</a>
</div>
<div>
<h4>Legal</h4>
<a href="/privacy-policy/">Privacy Policy</a>
<a href="/terms-of-service/">Terms of Service</a>
<a href="/cookie-policy/">Cookie Policy</a>
<a href="/disclaimer/">Disclaimer</a>
</div>
</div>
<div class="footer-bottom">
<p>&copy; 2026 SavingsClub. All rights reserved. <a href="mailto:info@savingsclub.com" style="color:rgba(255,255,255,.4)">info@savingsclub.com</a></p>
<p>Educational content only, not financial advice. SavingsClub is not a licensed financial advisor. Affiliate Disclosure: SavingsClub may earn commissions from products featured on this site. <a href="/disclaimer/" style="color:rgba(255,255,255,.4)">Learn more</a></p>
</div>
</div>
</footer>

<script>
(function(){
  var chips=document.querySelectorAll('.bi-chip');
  var cards=document.querySelectorAll('.bi-card');
  var grid=document.getElementById('biPostsGrid');
  chips.forEach(function(chip){
    chip.addEventListener('click',function(){
      chips.forEach(function(c){c.classList.remove('active')});
      chip.classList.add('active');
      var cat=chip.getAttribute('data-cat');
      var visible=0;
      cards.forEach(function(card){
        if(cat==='all'||card.getAttribute('data-cat')===cat){
          card.classList.remove('bi-hidden');
          visible++;
        } else {
          card.classList.add('bi-hidden');
        }
      });
      var existingEmpty=grid.querySelector('.bi-empty');
      if(existingEmpty)existingEmpty.remove();
      if(visible===0){
        var empty=document.createElement('div');
        empty.className='bi-empty';
        empty.innerHTML='<h3>No posts in this category yet</h3><p>Check back soon for new articles.</p>';
        grid.appendChild(empty);
      }
    });
  });
})();
</script>

<script>
window.addEventListener('scroll',function(){var n=document.querySelector('nav#mainNav');if(n)n.classList.toggle('scrolled',window.scrollY>20);});
function toggleMobile(){var m=document.getElementById('mobileMenu');if(m)m.classList.toggle('open');}
function closeMobile(){var m=document.getElementById('mobileMenu');if(m)m.classList.remove('open');}
</script>

<script>
(function(){
if(localStorage.getItem('sc_cookies'))return;
var b=document.createElement('div');
b.id='cookieBanner';
b.style.cssText='position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#050D1A,#0A1628);color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;z-index:9999;font-size:.9rem;border-top:2px solid;border-image:linear-gradient(90deg,#059669,#10B981,#34D399) 1;backdrop-filter:blur(20px)';
var acceptBtn=document.createElement('button');
acceptBtn.textContent='Accept';
acceptBtn.style.cssText='background:linear-gradient(135deg,#059669,#10B981);color:#fff;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:600';
acceptBtn.onclick=function(){localStorage.setItem('sc_cookies','accept');b.remove();};
var declineBtn=document.createElement('button');
declineBtn.textContent='Decline';
declineBtn.style.cssText='background:transparent;color:#fff;border:1px solid rgba(255,255,255,.3);padding:8px 20px;border-radius:8px;cursor:pointer';
declineBtn.onclick=function(){
localStorage.setItem('sc_cookies','decline');
b.innerHTML='';
var msg=document.createElement('span');
msg.style.cssText='padding:12px 0;color:#10B981';
msg.textContent='Preference saved.';
b.appendChild(msg);
setTimeout(function(){b.remove();},2000);
};
var txt=document.createElement('span');
txt.innerHTML='We use basic analytics cookies to understand site traffic. <a href="/cookie-policy/" style="color:#10B981">Cookie Policy</a>';
var btnWrap=document.createElement('div');
btnWrap.style.cssText='display:flex;gap:8px';
btnWrap.appendChild(acceptBtn);
btnWrap.appendChild(declineBtn);
b.appendChild(txt);
b.appendChild(btnWrap);
document.body.appendChild(b);
})();
</script>

</body>
</html>
`;

  fs.writeFileSync(path.join('blog', 'index.html'), html);
  console.log('Blog index regenerated: blog/index.html (' + posts.length + ' posts)');
}

/**
 * ONE POST PER WEEK, ON A RANDOM DAY.
 *
 * The workflow can run every day (cron: 0 12 * * * in weekly-blog.yml), but this
 * gate self-limits actual publishing to roughly once every 7 days, and randomizes
 * WHICH day it lands on so the pattern is not a fixed Mon/Wed/Fri footprint.
 *
 * Logic:
 *   - If fewer than MIN_DAYS_BETWEEN_POSTS days have passed since the last post,
 *     do nothing today.
 *   - Once eligible, roll a dice each run (DAILY_PUBLISH_CHANCE) so the exact
 *     publish day varies week to week.
 *   - Safety valve: if it has been HARD_MAX_DAYS or more, publish for sure so the
 *     blog never stalls out completely.
 */
var MIN_DAYS_BETWEEN_POSTS = 6;    // never post more often than about once a week
var DAILY_PUBLISH_CHANCE = 0.35;   // once eligible, ~1-in-3 chance per daily run
var HARD_MAX_DAYS = 10;            // if it has been this long, publish no matter what

function daysSinceLastPost() {
  try {
    var posts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8'));
    if (!posts || !posts.length) return 9999;
    var newest = posts[0]; // posts.unshift() keeps newest first
    var d = new Date(newest.isoDate || newest.pubDate || newest.date);
    if (isNaN(d.getTime())) return 9999;
    return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  } catch (e) {
    return 9999; // no file yet, or unreadable: treat as "due"
  }
}

function shouldPublishToday() {
  var gap = daysSinceLastPost();
  if (gap < MIN_DAYS_BETWEEN_POSTS) {
    console.log('Skip: only ' + gap.toFixed(1) + ' days since last post (min ' + MIN_DAYS_BETWEEN_POSTS + '). No post today.');
    return false;
  }
  if (gap >= HARD_MAX_DAYS) {
    console.log('It has been ' + gap.toFixed(1) + ' days (>= ' + HARD_MAX_DAYS + '). Publishing to keep the blog active.');
    return true;
  }
  var roll = Math.random();
  if (roll > DAILY_PUBLISH_CHANCE) {
    console.log('Eligible (' + gap.toFixed(1) + ' days) but rolled ' + roll.toFixed(2) + ' > ' + DAILY_PUBLISH_CHANCE + '. Randomly skipping today.');
    return false;
  }
  console.log('Eligible (' + gap.toFixed(1) + ' days) and rolled ' + roll.toFixed(2) + ' <= ' + DAILY_PUBLISH_CHANCE + '. Publishing today.');
  return true;
}

async function generatePost() {
  // Random-day, once-a-week gate. Exit cleanly (green build) on skip days.
  if (!shouldPublishToday()) {
    console.log('No post generated today. Exiting cleanly.');
    return;
  }

  const client = new Anthropic();
  const usedTitles = getUsedTopics();
  const { topic, state, priorityKeywords } = pickUnusedTopic(usedTitles);

  console.log('Topic: ' + topic);
  console.log('Used posts so far: ' + usedTitles.length);

  const shuffledCalcs = [...CALCULATOR_LINKS].sort(() => Math.random() - 0.5);
  const requiredLinks = shuffledCalcs.slice(0, 5);
  const linkInstructions = requiredLinks.map(c => `  <a href="${c.url}">${c.name}</a>`).join('\n');

  // Look up real Moz keyword data for this topic. Used for SEO targeting in the prompt.
  const matchedKeywords = (priorityKeywords && priorityKeywords.length) ? priorityKeywords : getKeywordsForTopic(topic);
  let primaryKeyword = '';
  let secondaryKeywords = [];
  let keywordInstructions = '';
  if (matchedKeywords.length > 0) {
    primaryKeyword = matchedKeywords[0].kw;
    secondaryKeywords = matchedKeywords.slice(1).map(k => k.kw);
    const kwLines = matchedKeywords.map((k, i) =>
      '  ' + (i === 0 ? 'PRIMARY' : 'SECONDARY') + ': "' + k.kw + '" (about ' + k.vol.toLocaleString() + ' U.S. monthly searches)'
    ).join('\n');
    keywordInstructions = '\n\nTARGET SEARCH KEYWORDS for this post (real Moz data, June 2026):\n' + kwLines +
      '\n\nUse the PRIMARY keyword exactly as written in: the H1 (article title), the first 100 words, and at least one H2 subheading. Use SECONDARY keywords naturally 1 to 2 times each in the body. Do NOT stuff. Do NOT mention search volumes or quote the numbers above in the article. These are internal targeting data only.';
    console.log('Primary keyword: "' + primaryKeyword + '" + ' + secondaryKeywords.length + ' secondary');
  } else {
    console.log('No keyword match for topic (will rely on writer judgment)');
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: `You are a skilled personal finance writer AND a senior SEO content strategist creating educational content for SavingsClub.com on behalf of the SavingsClub Research Team. You understand how everyday Americans actually search Google for financial information. You write to match real search intent, not generic textbook prose. Every article you produce is built to rank for specific high-volume queries.${keywordInstructions}

Write with confidence and depth like a knowledgeable teacher explaining a topic clearly but never claim to be a licensed financial advisor, expert, or professional. Frame all content as educational information that helps readers understand topics and do their own research, NOT as personal advice or expert recommendations. Use first-person plural ("we," "our," "SavingsClub") to refer to the publication. Write in clear, simple English with short sentences (under 15 words when possible) so non-native English speakers can easily understand. Avoid generic fluff phrases like "In today's fast-paced economic world." Use highly scannable HTML formatting with clear H2 and H3 subheadings, bold key financial terms, and bulleted lists for complex data. Naturally mention SavingsClub's free interactive calculators and tools at least twice per article, once near the introduction and once near the conclusion, explaining why we built these tools (to help Americans bypass confusing bank jargon and instantly see their true monthly costs). Subtly weave in that all content is for educational and informational purposes only.

LANGUAGE RULES, NEVER claim expertise or give personal advice:
- NEVER write: "As a financial expert...", "In my professional experience...", "I recommend...", "As your advisor...", "Trust me...", "I personally suggest...", "Our experts say...", "Our financial advisors recommend..."
- INSTEAD write: "Many financial educators suggest...", "A common approach is...", "One way to think about this is...", "Educational best practice is...", "Consider this strategy...", "Some Americans choose to...", "The general principle is..."
- The blog is EDUCATIONAL content, not advice. Frame every recommendation as information for the reader to evaluate, not as a directive.

FABRICATION RULES, ABSOLUTE, ZERO EXCEPTIONS:
- NEVER invent named people. No "Sarah, a teacher from Phoenix" or "Marcus Thompson, a software engineer in Austin". Not one named individual, ever, in any article.
- NEVER attribute specific earnings, savings, balances, or results to a specific person, named or implied. Invented case studies are fabricated social proof and are prohibited on this site.
- Scenarios must be openly hypothetical, written in second person or generic terms: "Imagine a teacher earning $52,000 a year...", "Suppose you save $300 a month...", "A freelancer charging $75 per hour would...".
- NEVER invent quotes, testimonials, expert statements, survey results, or named organizations' findings.
- Specific dollar examples are encouraged. Attaching them to invented humans is banned.

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
- Write 2,300 to 2,500 words minimum. This is non-negotiable.
- Use HTML formatting: h2/h3 for sections, p for paragraphs, ul/li for lists where appropriate
- THE VERY FIRST LINE of your entire output must be exactly one HTML comment: <!--META: your meta description here--> where the description is 140 to 155 characters of plain text that summarizes the article, contains the primary keyword, and is written to earn the click. No quotation marks inside it. Then continue with the article.
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

SEO STRUCTURE RULES (CRITICAL FOR RANKING):
You write to match how Americans search Google. Every article must include the following SEO elements:

1. PRIMARY KEYWORD PLACEMENT: The primary keyword from the TARGET SEARCH KEYWORDS section (if provided above) MUST appear:
   - Exactly as written in the H1 (article title)
   - Exactly as written in the first 100 words of the article body
   - In at least one H2 subheading

2. QUESTION-FORMAT H2 SECTION: Include AT LEAST ONE H2 subheading written as a question that matches how people actually type into Google search. Match the topic naturally. Examples by topic type:
   - For "how to" topics: "How much do I really need to start?", "How long will this take to work?"
   - For "best of" topics: "Which option is best for most Americans?", "What should you look for first?"
   - For comparison topics: "Is X actually better than Y in 2026?", "Which one wins for most people?"
   - For "understanding" topics: "What does this mean for your money?", "How is this different from X?"

3. LONG-TAIL VARIATIONS: Use natural long-tail variations of the primary keyword 2 to 4 times in the body. For example, if the primary keyword is "mortgage calculator", natural variations are "free mortgage calculator", "mortgage payment calculator with taxes", "how to use a mortgage calculator". Do not invent forced phrases. Only use variations that read naturally.

4. PEOPLE OFTEN ASK SECTION: End every article with a section titled exactly "<h2>People Often Ask</h2>" (no period). Under it, include 3 to 4 H3 subheadings, each formatted as a real search-style question, followed by a short direct answer (2 to 3 sentences). Use the exact phrasing real people type into Google. Examples:
   - "<h3>Is a Roth IRA worth it in 2026?</h3>" then a direct answer
   - "<h3>How much should I have saved by age 40?</h3>" then a direct answer
   - "<h3>What credit score do I need for a car loan?</h3>" then a direct answer

5. MATCH SEARCH INTENT:
   - Informational queries (how/what/why) want explanation. Lead with the answer, then the why.
   - Commercial queries (best/top/vs) want comparison. Lead with clear winner conditions for different reader types.
   - Transactional queries (apply/open/get) want action steps. Lead with the simplest path.

6. OUTBOUND .GOV CITATIONS: When you cite specific government data, link the source phrase to the actual government site:
   - Federal Reserve data: link to "https://www.federalreserve.gov"
   - BLS data: link to "https://www.bls.gov"
   - FDIC data: link to "https://www.fdic.gov"
   - Consumer Financial Protection Bureau: link to "https://www.consumerfinance.gov"
   - IRS data: link to "https://www.irs.gov"
   - Healthcare.gov: link to "https://www.healthcare.gov"
   - Department of Labor / FMLA: link to "https://www.dol.gov"
   Use the format: <a href="https://www.bls.gov" rel="noopener" target="_blank">Bureau of Labor Statistics</a>. Include 1 to 3 such outbound links if the topic naturally references government data. Do not force links where the topic does not call for them.

STRUCTURE:
1. Opening paragraph that hooks the reader with a relatable scenario or surprising fact
2. 4 to 6 main sections with h2/h3 headings covering different aspects of the topic
3. Practical tips or step-by-step educational guidance in each section
4. Closing section with a clear call-to-action linking to a SavingsClub calculator

Write unique, original content. Explain the WHY behind every recommendation. Be specific to the topic, no generic filler. Remember: NO em-dashes, NO "Moreover," NO "It's worth noting," NO "Whether you're." Sound like a real person wrote this.`,
    messages: [{ role: 'user', content: 'Write a comprehensive personal finance blog post about: ' + topic }]
  });

  let content = message.content[0].text;

  // Custom meta description from the model (first-line HTML comment), sanitized, with fallback later
  let metaDesc = '';
  const metaMatch = content.match(/<!--\s*META:\s*([\s\S]*?)-->/i);
  if (metaMatch) {
    metaDesc = metaMatch[1].replace(/\s+/g, ' ').trim();
    metaDesc = metaDesc.replace(/&mdash;|&#8212;|&#x2014;/gi, '\u2014').replace(/&ndash;|&#8211;|&#x2013;/gi, '\u2013');
    metaDesc = metaDesc.replace(/(\$?[\d,.]+)\s*[\u2014\u2013]\s*(\$?[\d,.]+)/g, '$1 to $2');
    metaDesc = metaDesc.replace(/\s*[\u2014\u2013]\s*/g, ', ');
    metaDesc = metaDesc.replace(/"/g, "'");
    // Honest-language rule: never claim expertise in the meta description.
    metaDesc = metaDesc.replace(/\bexperts?\b/gi, '').replace(/\s{2,}/g, ' ').replace(/\s+([,.])/g, '$1').trim();
    if (metaDesc.length > 160) metaDesc = metaDesc.slice(0, 157).replace(/\s+\S*$/, '') + '...';
    content = content.replace(metaMatch[0], '');
  }

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
  if (!metaDesc) metaDesc = title + '. Personal finance guide from SavingsClub.';
  const escapedMeta = metaDesc.replace(/"/g, '&quot;');
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

  // Related Guides block: 2-3 existing posts (same category first, newest first).
  // Every new post now feeds internal links to older posts (fixes the one-inlink problem).
  let relatedBlock = '';
  try {
    const allPosts = JSON.parse(fs.readFileSync('generated-posts.json', 'utf8'));
    const pool = allPosts.filter(p => p && p.slug && p.slug !== slug && p.title);
    const same = pool.filter(p => p.category === category).reverse();
    const rest = pool.filter(p => p.category !== category).reverse();
    const picks = same.concat(rest).slice(0, 3);
    if (picks.length >= 2) {
      relatedBlock = '<div style="margin-top:36px;padding:24px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:16px">'
        + '<p style="font-weight:700;color:#0A1628;margin:0 0 12px;font-size:1.05rem">Related Guides</p>'
        + picks.map(p => '<a href="/blog/' + p.slug + '/" style="display:block;color:#047857;font-weight:600;text-decoration:none;padding:8px 0;border-bottom:1px solid #F1F5F9">' + String(p.title).replace(/</g, '&lt;') + ' &rarr;</a>').join('')
        + '</div>';
    }
  } catch (e) { /* first post ever: no related block */ }

  const postDir = path.join('blog', slug);
  if (!fs.existsSync(postDir)) fs.mkdirSync(postDir, { recursive: true });

  const escapedTitle = title.replace(/"/g, '&quot;');

  const postHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | SavingsClub</title>
<meta name="description" content="${escapedMeta}">
<link rel="canonical" href="https://savingsclub.com/blog/${slug}/">
<meta property="og:title" content="${escapedTitle}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://savingsclub.com/blog/${slug}/">
<meta property="og:site_name" content="SavingsClub">
<meta property="og:description" content="${escapedMeta}">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${escapedTitle}","author":{"@type":"Organization","name":"SavingsClub"},"publisher":{"@type":"Organization","name":"SavingsClub","url":"https://savingsclub.com"},"datePublished":"${isoDate}","description":"${escapedMeta}"}</script>
<link rel="icon" type="image/png" sizes="32x32" href="/img/sc-favicon.png?v=2">
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
<div class="blog-content">${cleanContent}</div>\n${relatedBlock}
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
</body>
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

  try {
    generateRSS();
    generateImageReport();
    generateBlogIndex();
  } catch (e) {
    console.warn('Non-critical post-processing error (workflow will still succeed):', e.message);
  }

  console.log('Published: ' + title + ' [' + category + ']');
  console.log('Word count estimate: ' + cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).length);
}

generatePost().catch(err => {
  console.error('ERROR:', err.message || err);
  process.exit(1);
});
