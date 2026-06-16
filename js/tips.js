/* SavingsClub - Daily 3-Tip Banner - 200 Tips Pool, Daily Rotation
   v10: z-index lowered to 9990 (fixes mobile search overlay being covered) */
(function(){
  var tips=[
    /* ====== MORTGAGE (25) ====== */
    {t:"Paying an extra $50/month on your mortgage saves $27,000 in interest",l:"/mortgage-calculator/"},
    {t:"15-year mortgage saves $100,000+ vs a 30-year term",l:"/mortgage-calculator/"},
    {t:"20% down payment avoids PMI and saves hundreds per month",l:"/mortgage-calculator/"},
    {t:"Refinancing from 7% to 5.5% on $300,000 saves $320/month",l:"/mortgage-calculator/"},
    {t:"Home costs beyond mortgage: taxes, insurance, maintenance, repairs",l:"/mortgage-calculator/"},
    {t:"Get pre-approval quotes from 3+ lenders within 14 days",l:"/mortgage-calculator/"},
    {t:"Multiple mortgage credit pulls in 14 days count as ONE inquiry",l:"/mortgage-calculator/"},
    {t:"A 0.25% rate difference on $350,000 is $18,000 over 30 years",l:"/mortgage-calculator/"},
    {t:"Property tax rates vary 4x between US counties",l:"/mortgage-calculator/california/"},
    {t:"California Prop 13 caps annual property tax increases at 2%",l:"/mortgage-calculator/california/"},
    {t:"Texas has no state income tax but property tax is 1.58%",l:"/mortgage-calculator/texas/"},
    {t:"Florida Homestead Exemption saves $50,000 off taxable value",l:"/mortgage-calculator/florida/"},
    {t:"Michigan Headlee Amendment caps annual tax increases at 5%",l:"/mortgage-calculator/michigan/"},
    {t:"Ohio has 330+ cities with their own income tax",l:"/mortgage-calculator/ohio/"},
    {t:"Pennsylvania does not tax 401(k) withdrawals in retirement",l:"/mortgage-calculator/pennsylvania/"},
    {t:"Pittsburgh property tax (1.95%) is double Philadelphia's (0.95%)",l:"/mortgage-calculator/pennsylvania/"},
    {t:"New York mansion tax kicks in at $1 million purchase price",l:"/mortgage-calculator/new-york/"},
    {t:"Illinois property tax is the second highest in America (2.08%)",l:"/mortgage-calculator/illinois/"},
    {t:"Compare APR not interest rate - APR includes lender fees",l:"/mortgage-calculator/"},
    {t:"Discount points only make sense if you hold the loan 5+ years",l:"/mortgage-calculator/"},
    {t:"HOA fees on a $400K condo can add $300-700/month",l:"/mortgage-calculator/"},
    {t:"Your Loan Estimate (3 days after applying) locks in most fees",l:"/mortgage-calculator/"},
    {t:"Local credit unions often beat national lender rates by 0.10-0.25%",l:"/mortgage-calculator/"},
    {t:"PMI typically costs 0.5-1% of loan amount annually",l:"/mortgage-calculator/"},
    {t:"PMI is removed once you reach 20% equity",l:"/mortgage-calculator/"},

    /* ====== SAVINGS (20) ====== */
    {t:"High-yield savings accounts earn 4%+ APY vs 0.01% at big banks",l:"/banking/"},
    {t:"Automate your savings - remove willpower from the equation",l:"/savings-calculator/"},
    {t:"Pay yourself first: save before spending, not after",l:"/savings-calculator/"},
    {t:"First $1,000 in savings prevents most debt spirals",l:"/emergency-fund-calculator/"},
    {t:"Save your tax refund instead of spending it",l:"/savings-calculator/"},
    {t:"Round up purchases and save the difference automatically",l:"/savings-calculator/"},
    {t:"Save raises before lifestyle inflation eats them",l:"/savings-calculator/"},
    {t:"Saving 1% more of your income compounds to thousands",l:"/savings-calculator/"},
    {t:"Set specific savings goals with deadlines not vague wishes",l:"/savings-calculator/"},
    {t:"Separate savings accounts for separate goals reduces temptation",l:"/savings-calculator/"},
    {t:"Money market accounts often beat savings APY with check access",l:"/banking/"},
    {t:"Treasury Direct savings bonds match inflation tax-deferred",l:"/savings-calculator/"},
    {t:"Saving for a 20% down payment beats paying PMI long-term",l:"/savings-calculator/"},
    {t:"$500/month saved at 4.5% APY hits $30,000 in 5 years",l:"/savings-calculator/"},
    {t:"$200/month for 30 years at 7% return equals $244,000",l:"/savings-calculator/"},
    {t:"Sinking funds prevent debt from predictable expenses",l:"/savings-calculator/"},
    {t:"Save 90 days of expenses before chasing high returns",l:"/emergency-fund-calculator/"},
    {t:"Check savings APY quarterly - banks lower rates without notice",l:"/banking/"},
    {t:"Online banks pay 8x more interest than brick-and-mortar",l:"/banking/"},
    {t:"Direct deposit splits let you save before you see the money",l:"/savings-calculator/"},

    /* ====== 401K / RETIREMENT (25) ====== */
    {t:"Your 401(k) employer match is free money - never leave it",l:"/401k-calculator/"},
    {t:"Maxing 401(k) at $23,500/year cuts your tax bill significantly",l:"/401k-calculator/"},
    {t:"401(k) loans hurt retirement growth - avoid if possible",l:"/401k-calculator/"},
    {t:"Rollover old 401(k)s to an IRA for more investment choices",l:"/401k-calculator/"},
    {t:"Catch-up contributions add $7,500 if you're 50 or older",l:"/401k-calculator/"},
    {t:"Time in market beats timing the market - stay invested",l:"/retirement-calculator/"},
    {t:"Starting at 25 vs 35 means $500,000 more at retirement",l:"/investment-calculator/"},
    {t:"Retirement target: 25x your annual expenses (4% rule)",l:"/retirement-calculator/"},
    {t:"Social Security replaces only ~40% of pre-retirement income",l:"/retirement-calculator/"},
    {t:"Delay Social Security to age 70 for 32% larger checks",l:"/retirement-calculator/"},
    {t:"Withdraw Social Security at 62 = permanent 30% reduction",l:"/retirement-calculator/"},
    {t:"Healthcare costs in retirement average $315,000 per couple",l:"/retirement-calculator/"},
    {t:"Index funds in 401(k) usually beat actively managed ones",l:"/401k-calculator/"},
    {t:"Check your 401(k) expense ratios - aim under 0.20%",l:"/401k-calculator/"},
    {t:"Vesting schedules mean you may forfeit match if you leave early",l:"/401k-calculator/"},
    {t:"Required Minimum Distributions start at age 73",l:"/retirement-calculator/"},
    {t:"Roth 401(k) grows tax-free if you expect higher taxes later",l:"/401k-calculator/"},
    {t:"Traditional 401(k) reduces taxable income now",l:"/401k-calculator/"},
    {t:"Target-date funds auto-adjust risk as you near retirement",l:"/401k-calculator/"},
    {t:"3-fund portfolio beats most actively managed retirement accounts",l:"/investment-calculator/"},
    {t:"Increase 401(k) contribution 1% every year for painless growth",l:"/401k-calculator/"},
    {t:"After-tax 401(k) contributions can mega-backdoor into Roth",l:"/401k-calculator/"},
    {t:"Self-employed? SEP-IRA lets you save up to $70,000/year",l:"/retirement-calculator/"},
    {t:"Solo 401(k) allows both employee and employer contributions",l:"/401k-calculator/"},
    {t:"HSA after age 65 works like a Traditional IRA penalty-free",l:"/retirement-calculator/"},

    /* ====== CREDIT CARDS (20) ====== */
    {t:"Keep credit utilization below 30% to protect your score",l:"/credit-card-payoff-calculator/"},
    {t:"2% cash back cards earn $480/year on $2k/month spending",l:"/credit-cards/"},
    {t:"0% APR balance transfer saves $800+ on $5,000 debt",l:"/credit-card-payoff-calculator/"},
    {t:"Always pay credit cards in full - 22% APR wipes out rewards",l:"/credit-card-payoff-calculator/"},
    {t:"Negotiate lower credit card rates with one phone call",l:"/credit-card-payoff-calculator/"},
    {t:"Build credit with a secured card - no credit history needed",l:"/credit-card-quiz/"},
    {t:"Credit utilization below 10% gives the best score boost",l:"/credit-card-payoff-calculator/"},
    {t:"Closing old credit cards can lower your score - keep them open",l:"/credit-card-payoff-calculator/"},
    {t:"Pay credit cards twice a month to keep utilization low",l:"/credit-card-payoff-calculator/"},
    {t:"Authorized user status can boost a young credit file fast",l:"/credit-card-quiz/"},
    {t:"Annual fee cards only pay off if you use the benefits",l:"/credit-cards/"},
    {t:"Travel cards earn 2-5x points on travel and dining",l:"/credit-cards/"},
    {t:"Cash back is simpler - travel points are higher value if used",l:"/credit-cards/"},
    {t:"Balance transfer fees (3-5%) still beat 22% interest",l:"/credit-card-payoff-calculator/"},
    {t:"Sign-up bonuses average $200-1,000 for a few months of spending",l:"/credit-cards/"},
    {t:"Use credit cards for fraud protection - not debit cards",l:"/credit-cards/"},
    {t:"Cash advances charge fees AND start interest immediately",l:"/credit-card-payoff-calculator/"},
    {t:"Late payments stay on your credit report for 7 years",l:"/credit-card-payoff-calculator/"},
    {t:"Set autopay for at least the minimum to avoid late fees",l:"/credit-card-payoff-calculator/"},
    {t:"Dispute incorrect charges within 60 days of statement",l:"/credit-cards/"},

    /* ====== INVESTING (25) ====== */
    {t:"$500/month at 7% return grows to over $520,000 in 30 years",l:"/compound-interest-calculator/"},
    {t:"Index funds historically return about 10% annually",l:"/investment-calculator/"},
    {t:"Never invest money you will need within the next 5 years",l:"/investment-calculator/"},
    {t:"Dollar-cost averaging reduces risk with regular investments",l:"/investment-calculator/"},
    {t:"Rule of 72: divide 72 by return rate to find doubling time",l:"/compound-interest-calculator/"},
    {t:"Compound interest doubles $1,000 in 10 years at 7%",l:"/compound-interest-calculator/"},
    {t:"VTI/VTSAX gives you exposure to the entire US stock market",l:"/investment-calculator/"},
    {t:"Diversify across US, international, and bonds for stability",l:"/investment-calculator/"},
    {t:"Rebalance portfolio annually to maintain target allocation",l:"/investment-calculator/"},
    {t:"Stocks beat bonds long-term - bonds reduce short-term swings",l:"/investment-calculator/"},
    {t:"Stay invested during crashes - timing the market costs returns",l:"/investment-calculator/"},
    {t:"Missing the 10 best days drops your 20-year return by 50%",l:"/investment-calculator/"},
    {t:"Fees over 1% can cost you years of retirement income",l:"/investment-calculator/"},
    {t:"Low-cost broker (Fidelity, Schwab, Vanguard) - avoid load fees",l:"/investment-calculator/"},
    {t:"Tax-loss harvesting offsets gains and up to $3,000 income",l:"/investment-calculator/"},
    {t:"Hold investments 1+ year for lower long-term capital gains tax",l:"/investment-calculator/"},
    {t:"Treasury bonds backed by US government - safest income",l:"/investment-calculator/"},
    {t:"REITs invest in real estate without buying property",l:"/investment-calculator/"},
    {t:"Sector ETFs are higher risk than total-market ETFs",l:"/investment-calculator/"},
    {t:"Bond ladders create predictable income across years",l:"/investment-calculator/"},
    {t:"International stocks add diversification beyond US market",l:"/investment-calculator/"},
    {t:"Dividend stocks provide income but slower growth",l:"/investment-calculator/"},
    {t:"Don't chase last year's top-performing funds - they regress",l:"/investment-calculator/"},
    {t:"$500/month side income invested at 7% equals $260,000 in 15 years",l:"/investment-calculator/"},
    {t:"529 plans grow tax-free for college education expenses",l:"/compound-interest-calculator/"},

    /* ====== BUDGETING (15) ====== */
    {t:"The 50/30/20 budget rule makes managing money simple",l:"/budget-planner/"},
    {t:"Review subscriptions quarterly - average American wastes $240/year",l:"/budget-planner/"},
    {t:"Negotiate every major bill: insurance, cable, phone, medical",l:"/budget-planner/"},
    {t:"Track spending for 30 days before making a budget",l:"/budget-planner/"},
    {t:"Pay yourself first - automate savings before discretionary spending",l:"/budget-planner/"},
    {t:"Set specific financial goals with deadlines not vague wishes",l:"/budget-planner/"},
    {t:"Use cash for categories you tend to overspend",l:"/budget-planner/"},
    {t:"Plan for irregular expenses with monthly sinking funds",l:"/budget-planner/"},
    {t:"Wait 24 hours before any non-essential purchase over $100",l:"/budget-planner/"},
    {t:"Cook 5 nights a week saves $300+/month vs takeout",l:"/budget-planner/"},
    {t:"Grocery list and meal plan cuts food spending 20-30%",l:"/budget-planner/"},
    {t:"Annual financial review - check insurance, will, beneficiaries",l:"/budget-planner/"},
    {t:"Track net worth quarterly - more useful than monthly budgeting",l:"/net-worth-calculator/"},
    {t:"Zero-based budgeting assigns every dollar a job",l:"/budget-planner/"},
    {t:"Budget for fun - restriction leads to budget burnout",l:"/budget-planner/"},

    /* ====== DEBT (15) ====== */
    {t:"Debt avalanche method (highest rate first) saves the most money",l:"/debt-payoff-calculator/"},
    {t:"Debt snowball method (smallest first) builds motivation faster",l:"/debt-payoff-calculator/"},
    {t:"Consolidating debt only works if you stop adding new debt",l:"/debt-payoff-calculator/"},
    {t:"Personal loans often beat credit card APR for debt consolidation",l:"/debt-payoff-calculator/"},
    {t:"Pay more than minimum - minimums take 20+ years to clear cards",l:"/credit-card-payoff-calculator/"},
    {t:"22% APR doubles your debt every ~3 years if unpaid",l:"/credit-card-payoff-calculator/"},
    {t:"Negotiate medical bills - hospitals often discount 30-50%",l:"/debt-payoff-calculator/"},
    {t:"Student loan refinancing only beneficial if rates dropped 1%+",l:"/debt-payoff-calculator/"},
    {t:"Federal student loans offer income-driven repayment options",l:"/debt-payoff-calculator/"},
    {t:"Don't refinance federal student loans to private - lose protections",l:"/debt-payoff-calculator/"},
    {t:"Tackle one debt at a time for psychological wins",l:"/debt-payoff-calculator/"},
    {t:"List all debts with balance, rate, and minimum to start a plan",l:"/debt-payoff-calculator/"},
    {t:"401(k) match still beats paying off low-rate debt early",l:"/401k-calculator/"},
    {t:"BNPL (Klarna, Afterpay) hurts your credit if you miss payments",l:"/debt-payoff-calculator/"},
    {t:"Avoid payday loans - typical APR is 400%+",l:"/debt-payoff-calculator/"},

    /* ====== BANKING (12) ====== */
    {t:"Switch to free checking and save $1,000+/year in bank fees",l:"/banking/"},
    {t:"FDIC insurance protects deposits up to $250,000 per bank",l:"/banking/"},
    {t:"$10,000 in a CD at 4.5% APY earns $450/year risk-free",l:"/cd-calculator/"},
    {t:"CD laddering balances liquidity and higher rates",l:"/cd-calculator/"},
    {t:"Avoid overdraft fees with low-balance alerts",l:"/banking/"},
    {t:"Out-of-network ATM fees average $4.73 per transaction",l:"/banking/"},
    {t:"Money market accounts often pay savings APY with check access",l:"/banking/"},
    {t:"Online-only banks pay 8-10x more interest than big banks",l:"/banking/"},
    {t:"Joint accounts have credit and divorce implications",l:"/banking/"},
    {t:"Credit unions are non-profit and often have lower fees",l:"/banking/"},
    {t:"I Bonds match inflation tax-deferred for up to 30 years",l:"/inflation-calculator/"},
    {t:"Treasury bills mature in 4-52 weeks - safer than CDs",l:"/cd-calculator/"},

    /* ====== EMERGENCY FUND (10) ====== */
    {t:"Emergency fund of 3-6 months expenses is your safety net",l:"/emergency-fund-calculator/"},
    {t:"Build emergency fund BEFORE investing beyond 401(k) match",l:"/emergency-fund-calculator/"},
    {t:"Keep emergency fund in high-yield savings, not investments",l:"/emergency-fund-calculator/"},
    {t:"$1,000 starter emergency fund prevents most debt cycles",l:"/emergency-fund-calculator/"},
    {t:"Job loss is the most common reason to tap emergency fund",l:"/emergency-fund-calculator/"},
    {t:"Self-employed need 6-12 months expenses vs 3 for W-2 workers",l:"/emergency-fund-calculator/"},
    {t:"Don't keep emergency fund at the same bank as your checking",l:"/emergency-fund-calculator/"},
    {t:"Replenish emergency fund FIRST after using it",l:"/emergency-fund-calculator/"},
    {t:"HSA can double as healthcare emergency fund tax-free",l:"/emergency-fund-calculator/"},
    {t:"Calculate emergency fund based on essential expenses only",l:"/emergency-fund-calculator/"},

    /* ====== ROTH IRA (8) ====== */
    {t:"Roth IRA grows tax-free - $7,000/year for 30 years equals $661,000",l:"/roth-ira-calculator/"},
    {t:"Roth IRA contributions can be withdrawn penalty-free anytime",l:"/roth-ira-calculator/"},
    {t:"Backdoor Roth lets high earners bypass income limits",l:"/roth-ira-calculator/"},
    {t:"Roth IRA has no Required Minimum Distributions in retirement",l:"/roth-ira-calculator/"},
    {t:"Max Roth IRA before maxing 401(k) beyond employer match",l:"/roth-ira-calculator/"},
    {t:"Spousal IRA lets non-working spouses still contribute",l:"/roth-ira-calculator/"},
    {t:"5-year rule: Roth earnings must wait 5 years to withdraw",l:"/roth-ira-calculator/"},
    {t:"Roth IRA can be used for first-time home purchase ($10K)",l:"/roth-ira-calculator/"},

    /* ====== INFLATION (7) ====== */
    {t:"Inflation at 3% cuts your purchasing power in half every 24 years",l:"/inflation-calculator/"},
    {t:"$100 in 2000 has the buying power of just $55 today",l:"/inflation-calculator/"},
    {t:"Stocks historically beat inflation - cash loses to it",l:"/inflation-calculator/"},
    {t:"TIPS bonds adjust principal upward with inflation",l:"/inflation-calculator/"},
    {t:"I Bonds are inflation-protected and backed by the US government",l:"/inflation-calculator/"},
    {t:"Real estate has historically kept pace with inflation",l:"/inflation-calculator/"},
    {t:"Negotiate annual raises that beat inflation - 3% is the floor",l:"/paycheck-calculator/"},

    /* ====== AUTO LOAN (7) ====== */
    {t:"3-year auto loan saves thousands in interest vs 6-year term",l:"/auto-loan-calculator/"},
    {t:"Cars depreciate 20% in year one - buy 2-3 year old used",l:"/auto-loan-calculator/"},
    {t:"Total car cost should be under 10% of take-home pay",l:"/auto-loan-calculator/"},
    {t:"Get pre-approved at your bank before visiting the dealer",l:"/auto-loan-calculator/"},
    {t:"7-year auto loans are a warning sign you bought too much car",l:"/auto-loan-calculator/"},
    {t:"Lease only if you drive under 12,000 miles/year",l:"/auto-loan-calculator/"},
    {t:"Cash buyers can negotiate hard - dealers want financing kickbacks",l:"/auto-loan-calculator/"},

    /* ====== MISC / TAX / INSURANCE (11) ====== */
    {t:"HSA contributions are triple tax-advantaged - max them out",l:"/paycheck-calculator/"},
    {t:"Take-home pay on $65,000 is roughly $50,000 after taxes",l:"/paycheck-calculator/"},
    {t:"Big tax refund means you overpaid - adjust your W-4",l:"/paycheck-calculator/"},
    {t:"Check your credit report free every year at annualcreditreport.com",l:"/financial-health-score/"},
    {t:"750+ credit score gets you the lowest rates on everything",l:"/financial-health-score/"},
    {t:"Term life insurance for a 30-year-old costs just $25-40/month",l:"/budget-planner/"},
    {t:"Your employer benefits could be worth $5,000-15,000/year",l:"/paycheck-calculator/"},
    {t:"Umbrella insurance covers liability above your home and auto policies",l:"/budget-planner/"},
    {t:"Disability insurance is more likely to be used than life insurance",l:"/budget-planner/"},
    {t:"Use our free calculators to plan every financial decision",l:"/savings-calculator/"},
    {t:"Read our expert money guides published 3 times per week",l:"/blog/"}
  ];

  var day=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(1000*60*60*24));
  var start=(day*3)%tips.length;
  var today=[tips[start%tips.length],tips[(start+1)%tips.length],tips[(start+2)%tips.length]];
  var parts=[];
  for(var i=0;i<today.length;i++){
    parts.push("<a href='"+today[i].l+"' style='color:#fff;text-decoration:none;font-weight:600;letter-spacing:.02em'>\u2022 "+today[i].t+" \u2192</a>");
  }
  var text=parts.join("  \u00A0\u00A0\u00A0\u00A0\u00A0  ");
  var double=text+"  \u00A0\u00A0\u00A0\u00A0\u00A0  "+text;
  var style=document.createElement("style");
  style.textContent="@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.sc-marquee-wrap{position:fixed;top:0;left:0;right:0;z-index:9990;background:linear-gradient(135deg,#059669,#10B981);overflow:hidden;height:36px;display:flex;align-items:center}.sc-marquee-inner{display:flex;white-space:nowrap;animation:marquee 40s linear infinite}.sc-marquee-inner:hover{animation-play-state:paused}.sc-marquee-inner a:hover{text-decoration:underline!important;color:#fff!important}#mainNav{top:36px!important}.hero{padding-top:176px!important}";
  document.head.appendChild(style);
  var wrap=document.createElement("div");
  wrap.className="sc-marquee-wrap";
  var inner=document.createElement("div");
  inner.className="sc-marquee-inner";
  inner.innerHTML="<span style='padding:0 20px;display:inline-block'>"+double+"</span>";
  wrap.appendChild(inner);
  document.body.insertBefore(wrap,document.body.firstChild);
})();
