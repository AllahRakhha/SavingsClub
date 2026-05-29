/* SavingsClub - Daily 3-Tip Banner - Safe Links Only */
(function(){
  var tips=[
    {t:"Paying an extra $50/month on your mortgage saves $27,000 in interest",l:"/mortgage-calculator/"},
    {t:"High-yield savings accounts earn 4%+ APY vs 0.01% at big banks",l:"/banking/"},
    {t:"The 50/30/20 budget rule makes managing money simple",l:"/budget-planner/"},
    {t:"Your 401(k) employer match is free money. Never leave it",l:"/401k-calculator/"},
    {t:"$500/month at 7% return grows to over $520,000 in 20 years",l:"/compound-interest-calculator/"},
    {t:"Keep credit utilization below 30% to protect your score",l:"/credit-card-payoff-calculator/"},
    {t:"15-year mortgage saves $100,000+ vs a 30-year term",l:"/mortgage-calculator/"},
    {t:"Roth IRA grows tax-free. $7,000/year for 30 years equals $661,000",l:"/roth-ira-calculator/"},
    {t:"Emergency fund of 3-6 months expenses is your safety net",l:"/emergency-fund-calculator/"},
    {t:"Debt avalanche method (highest rate first) saves the most money",l:"/debt-payoff-calculator/"},
    {t:"Track your net worth quarterly. It equals assets minus debts",l:"/net-worth-calculator/"},
    {t:"2% cash back cards earn $480/year on $2k/month spending",l:"/credit-cards/"},
    {t:"Switch to free checking and save $1,000+/year in bank fees",l:"/banking/"},
    {t:"$10,000 in a CD at 4.5% APY earns $450/year risk-free",l:"/cd-calculator/"},
    {t:"Starting investing at 25 vs 35 means $500,000 more at retirement",l:"/investment-calculator/"},
    {t:"Inflation at 3% cuts your purchasing power in half every 24 years",l:"/inflation-calculator/"},
    {t:"Review subscriptions quarterly. Average American wastes $240/year",l:"/budget-planner/"},
    {t:"3-year auto loan saves thousands in interest vs 6-year term",l:"/auto-loan-calculator/"},
    {t:"529 plans grow tax-free for college education expenses",l:"/compound-interest-calculator/"},
    {t:"Your employer benefits could be worth $5,000-15,000/year",l:"/paycheck-calculator/"},
    {t:"20% down payment avoids PMI and saves hundreds per month",l:"/mortgage-calculator/"},
    {t:"0% APR balance transfer saves $800+ on $5,000 debt",l:"/credit-card-payoff-calculator/"},
    {t:"First $1,000 in savings prevents most debt spirals",l:"/emergency-fund-calculator/"},
    {t:"Maxing 401(k) at $23,500/year cuts your tax bill significantly",l:"/401k-calculator/"},
    {t:"Compound interest doubles $1,000 in 10 years at 7%",l:"/compound-interest-calculator/"},
    {t:"Negotiate lower credit card rates with one phone call",l:"/credit-card-payoff-calculator/"},
    {t:"750+ credit score gets you the lowest rates on everything",l:"/financial-health-score/"},
    {t:"Automate your savings. Remove willpower from the equation",l:"/savings-calculator/"},
    {t:"Take-home pay on $65,000 is roughly $50,000 after taxes",l:"/paycheck-calculator/"},
    {t:"I Bonds are inflation-protected and backed by the US government",l:"/inflation-calculator/"},
    {t:"Term life insurance for a 30-year-old costs just $25-40/month",l:"/budget-planner/"},
    {t:"HSA contributions are triple tax-advantaged. Max them out",l:"/paycheck-calculator/"},
    {t:"Pay yourself first: save before spending, not after",l:"/savings-calculator/"},
    {t:"Refinancing from 7% to 5.5% on $300,000 saves $320/month",l:"/mortgage-calculator/"},
    {t:"Index funds historically return about 10% annually",l:"/investment-calculator/"},
    {t:"Never invest money you will need within the next 5 years",l:"/investment-calculator/"},
    {t:"Dollar-cost averaging reduces risk with regular investments",l:"/investment-calculator/"},
    {t:"Always pay credit cards in full. 22% APR wipes out rewards",l:"/credit-card-payoff-calculator/"},
    {t:"FDIC insurance protects deposits up to $250,000 per bank",l:"/banking/"},
    {t:"Rule of 72: divide 72 by return rate to find doubling time",l:"/compound-interest-calculator/"},
    {t:"Set specific financial goals with deadlines not vague wishes",l:"/budget-planner/"},
    {t:"Big tax refund means you overpaid. Adjust your W-4",l:"/paycheck-calculator/"},
    {t:"Check your credit report free every year. Fix errors fast",l:"/financial-health-score/"},
    {t:"$500/month side income invested at 7% equals $260,000 in 15 years",l:"/investment-calculator/"},
    {t:"Home costs beyond mortgage: taxes, insurance, maintenance",l:"/mortgage-calculator/"},
    {t:"Negotiate every major bill: insurance, cable, phone, medical",l:"/budget-planner/"},
    {t:"Build credit with a secured card. No credit history needed",l:"/credit-card-quiz/"},
    {t:"Time in market beats timing the market. Stay invested",l:"/retirement-calculator/"},
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
  style.textContent="@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.sc-marquee-wrap{position:fixed;top:0;left:0;right:0;z-index:10000;background:linear-gradient(135deg,#059669,#10B981);overflow:hidden;height:36px;display:flex;align-items:center}.sc-marquee-inner{display:flex;white-space:nowrap;animation:marquee 40s linear infinite}.sc-marquee-inner:hover{animation-play-state:paused}.sc-marquee-inner a:hover{text-decoration:underline!important;color:#fff!important}#mainNav{top:36px!important}.hero{padding-top:176px!important}";
  document.head.appendChild(style);
  var wrap=document.createElement("div");
  wrap.className="sc-marquee-wrap";
  var inner=document.createElement("div");
  inner.className="sc-marquee-inner";
  inner.innerHTML="<span style='padding:0 20px;display:inline-block'>"+double+"</span>";
  wrap.appendChild(inner);
  document.body.insertBefore(wrap,document.body.firstChild);
})();
