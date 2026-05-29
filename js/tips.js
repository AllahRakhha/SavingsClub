/* SavingsClub - Scrolling Tip Banner - 50 Tips */
(function(){
  var tips=[
    "\uD83D\uDCA1 Paying an extra $50/month on your mortgage could save you $27,000 in interest",
    "\u2B50 High-yield savings accounts earn 4%+ APY vs 0.01% at big banks",
    "\uD83D\uDCB0 The 50/30/20 rule: 50% needs, 30% wants, 20% savings",
    "\uD83D\uDD12 Your 401(k) employer match is free money. Never leave it on the table",
    "\uD83D\uDCC8 $500/month at 7% grows to over $520,000 in 20 years",
    "\u2705 Keep credit utilization below 30% to protect your credit score",
    "\uD83C\uDFE0 15-year mortgage saves $100,000+ vs a 30-year term",
    "\uD83D\uDCB5 Roth IRA grows tax-free. $7,000/year for 30 years equals $661,000",
    "\uD83D\uDEE1 An emergency fund of 3-6 months expenses is your safety net",
    "\uD83C\uDFAF Debt avalanche method (highest rate first) saves the most money",
    "\uD83D\uDCCA Your net worth equals what you own minus what you owe",
    "\uD83D\uDCB3 No-annual-fee cards with 2% cash back earn $480/year on $2k/month spending",
    "\uD83C\uDFE6 Americans waste $1,000+/year on unnecessary bank fees",
    "\uD83D\uDCB2 $10,000 in a CD at 4.5% APY earns $450/year risk-free",
    "\u23F0 Starting investing at 25 vs 35 could mean $500,000 more at retirement",
    "\uD83D\uDCC9 Inflation at 3% cuts your purchasing power in half every 24 years",
    "\uD83D\uDCDD Review all subscriptions quarterly. Average American wastes $240/year",
    "\uD83D\uDE97 3-year auto loan costs more monthly but saves thousands vs 6 years",
    "\uD83C\uDF93 529 plans grow tax-free for education expenses",
    "\uD83D\uDCBC Your employer benefits package could be worth $5,000-15,000/year",
    "\uD83C\uDFE1 20% down payment avoids PMI and saves hundreds per month",
    "\uD83D\uDCB1 Balance transfer at 0% APR for 15 months saves $800+ on $5,000 debt",
    "\uD83D\uDD11 First $1,000 in emergency savings prevents most debt spirals",
    "\uD83D\uDCC5 Maxing 401(k) at $23,500/year reduces taxable income significantly",
    "\u2696 Compound interest turns $1,000 into $2,000 in 10 years at 7%",
    "\uD83D\uDCDE Call your credit card company to negotiate a lower interest rate",
    "\uD83C\uDF1F A 750+ credit score gets you the lowest rates on everything",
    "\uD83D\uDCE6 Automating savings removes willpower from the equation",
    "\uD83D\uDCCA Take-home pay on $65,000 is roughly $50,000 after all taxes",
    "\uD83C\uDF0E I Bonds are inflation-protected and backed by the US government",
    "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67 Life insurance for a 30-year-old costs just $25-40/month for $500,000 coverage",
    "\uD83C\uDFEB HSA contributions are triple tax-advantaged: deductible, grow tax-free, withdraw tax-free",
    "\uD83D\uDCB0 Paying yourself first means saving before spending, not after",
    "\uD83C\uDFE0 Refinancing from 7% to 5.5% on $300,000 saves $320 per month",
    "\uD83D\uDCCA Diversified index funds historically return about 10% annually",
    "\u26A0 Never invest money you need within the next 5 years",
    "\uD83D\uDD04 Dollar-cost averaging reduces risk by investing fixed amounts regularly",
    "\uD83D\uDCB3 Always pay credit cards in full. 22% APR wipes out any rewards earned",
    "\uD83C\uDFE6 FDIC insurance protects your deposits up to $250,000 per bank",
    "\uD83D\uDCCA The Rule of 72: divide 72 by your return rate to see how fast money doubles",
    "\uD83C\uDFAF Set specific financial goals with deadlines, not vague wishes",
    "\uD83D\uDCB5 Tax refunds mean you overpaid the IRS. Adjust your W-4 to keep more per paycheck",
    "\uD83D\uDD10 Check your credit report free at AnnualCreditReport.com every year",
    "\uD83D\uDCCA Side income of just $500/month invested at 7% grows to $260,000 in 15 years",
    "\uD83C\uDFE1 Property taxes, insurance, and maintenance add 1-2% of home value per year",
    "\uD83D\uDCB2 Negotiate every major bill: insurance, cable, phone, medical",
    "\u2705 Build credit as a new immigrant with a secured credit card",
    "\uD83D\uDCC8 Time in the market beats timing the market. Stay invested through downturns",
    "\uD83D\uDCBC Freelancers should save 25-30% of income for taxes",
    "\uD83C\uDF1F Financial independence means your investments cover your living expenses"
  ];
  var text=tips.join("  \u00A0\u00A0\u00A0\u2022\u00A0\u00A0\u00A0  ");
  var double=text+"  \u00A0\u00A0\u00A0\u2022\u00A0\u00A0\u00A0  "+text;
  var style=document.createElement("style");
  style.textContent="@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.sc-marquee-wrap{position:fixed;top:0;left:0;right:0;z-index:10000;background:linear-gradient(135deg,#059669,#10B981);overflow:hidden;height:36px;display:flex;align-items:center}.sc-marquee-inner{display:flex;white-space:nowrap;animation:marquee 120s linear infinite}.sc-marquee-inner:hover{animation-play-state:paused}.sc-marquee-text{color:#fff;font-size:.82rem;font-weight:600;letter-spacing:.02em;padding:0 20px}";
  document.head.appendChild(style);
  var wrap=document.createElement("div");
  wrap.className="sc-marquee-wrap";
  var inner=document.createElement("div");
  inner.className="sc-marquee-inner";
  inner.innerHTML="<span class='sc-marquee-text'>"+double+"</span>";
  wrap.appendChild(inner);
  document.body.insertBefore(wrap,document.body.firstChild);
  var navEl=document.querySelector("nav");
  if(navEl){navEl.style.top="36px"}
  var hero=document.querySelector(".hero");
  if(hero){hero.style.paddingTop="176px"}
})();
