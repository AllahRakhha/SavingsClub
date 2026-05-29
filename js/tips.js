/* SavingsClub - Daily Financial Tip with Animation */
(function(){
  var tips=[
    {t:"Paying an extra $50/month on your mortgage could save you $27,000 in interest.",l:"/mortgage-calculator/",n:"Mortgage Calculator"},
    {t:"Keep credit utilization below 30% to protect your score. Below 10% is ideal.",l:"/credit-card-payoff-calculator/",n:"CC Payoff Calculator"},
    {t:"A $500/month investment at 7% return grows to over $520,000 in 20 years.",l:"/compound-interest-calculator/",n:"Compound Interest Calculator"},
    {t:"The 50/30/20 rule: 50% needs, 30% wants, 20% savings. Simple and effective.",l:"/budget-planner/",n:"Budget Planner"},
    {t:"High-yield savings accounts earn 4%+ APY vs 0.01% at big banks.",l:"/savings-calculator/",n:"Savings Calculator"},
    {t:"Contributing enough to get your full 401(k) employer match is free money.",l:"/401k-calculator/",n:"401(k) Calculator"},
    {t:"$10,000 earning 4.5% APY in a CD generates $450/year with zero risk.",l:"/cd-calculator/",n:"CD Calculator"},
    {t:"Refinancing a 7% mortgage to 5.5% on $300,000 saves $320/month.",l:"/mortgage-calculator/",n:"Mortgage Calculator"},
    {t:"An emergency fund of 3-6 months expenses is your financial safety net.",l:"/emergency-fund-calculator/",n:"Emergency Fund Calculator"},
    {t:"Roth IRA grows tax-free. $7,000/year for 30 years at 7% equals $661,000.",l:"/roth-ira-calculator/",n:"Roth IRA Calculator"},
    {t:"Inflation at 3% means $100 today is worth only $55 in 20 years.",l:"/inflation-calculator/",n:"Inflation Calculator"},
    {t:"Paying $100 extra/month on a $25,000 loan saves $1,800+ in interest.",l:"/loan-payoff-calculator/",n:"Loan Payoff Calculator"},
    {t:"Your take-home pay on $65,000 is roughly $50,000 after taxes.",l:"/paycheck-calculator/",n:"Paycheck Calculator"},
    {t:"Net worth equals what you own minus what you owe. Track it quarterly.",l:"/net-worth-calculator/",n:"Net Worth Calculator"},
    {t:"A 3-year auto loan costs more monthly but saves thousands vs 6 years.",l:"/auto-loan-calculator/",n:"Auto Loan Calculator"},
    {t:"Debt avalanche method (highest rate first) saves the most money.",l:"/debt-payoff-calculator/",n:"Debt Payoff Calculator"},
    {t:"$200/month invested from age 25 to 65 at 7% return equals $525,000+.",l:"/investment-calculator/",n:"Investment Calculator"},
    {t:"A 750+ credit score gets you the lowest mortgage and loan rates.",l:"/financial-health-score/",n:"Financial Health Score"},
    {t:"2% cash back cards earn $480/year on $2,000/month spending. No fee.",l:"/credit-cards/",n:"Compare Credit Cards"},
    {t:"Americans pay $1,000+/year in unnecessary bank fees. Switch to free.",l:"/banking/",n:"Best Banking Options"},
    {t:"Automating savings removes willpower from the equation. Set and forget.",l:"/savings-calculator/",n:"Savings Calculator"},
    {t:"0% APR balance transfer for 15 months can save $800+ on $5,000 debt.",l:"/credit-card-payoff-calculator/",n:"CC Payoff Calculator"},
    {t:"529 plans grow tax-free for education. 18 years of compounding.",l:"/compound-interest-calculator/",n:"Compound Interest Calculator"},
    {t:"First $1,000 in emergency savings prevents most debt spirals.",l:"/emergency-fund-calculator/",n:"Emergency Fund Calculator"},
    {t:"Maxing 401(k) at $23,500/year reduces your taxable income significantly.",l:"/401k-calculator/",n:"401(k) Calculator"},
    {t:"15-year mortgage saves $100,000+ in interest vs 30-year term.",l:"/mortgage-calculator/",n:"Mortgage Calculator"},
    {t:"Review subscriptions quarterly. Average American wastes $240/year.",l:"/budget-planner/",n:"Budget Planner"},
    {t:"I Bonds are inflation-protected and backed by the US government.",l:"/inflation-calculator/",n:"Inflation Calculator"},
    {t:"Employer benefits (HSA, FSA, 401k match) worth $5,000-15,000/year.",l:"/paycheck-calculator/",n:"Paycheck Calculator"},
    {t:"$1,000 at 7% doubles to $2,000 in 10 years. Time is your ally.",l:"/compound-interest-calculator/",n:"Compound Interest Calculator"}
  ];
  var day=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(1000*60*60*24));
  var tip=tips[day%tips.length];
  var style=document.createElement("style");
  style.textContent="@keyframes tipIn{0%{transform:translateX(-100%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes tipGlow{0%,100%{box-shadow:0 1px 8px rgba(52,211,153,.1)}50%{box-shadow:0 1px 16px rgba(52,211,153,.2)}}";
  document.head.appendChild(style);
  var bar=document.createElement("div");
  bar.style.cssText="background:linear-gradient(135deg,#0A1628,#132D52);padding:14px 24px;display:block;text-align:center;font-size:.9rem;color:rgba(255,255,255,.85);border-bottom:1px solid rgba(52,211,153,.15);animation:tipIn .8s ease-out,tipGlow 4s ease-in-out infinite;overflow:visible;width:100%;box-sizing:border-box;line-height:1.6";
  bar.innerHTML="\uD83D\uDCA1 <strong>Tip of the Day:</strong> "+tip.t+" <a href='"+tip.l+"' style='color:#34D399;font-weight:600;text-decoration:none;margin-left:4px'>Try our "+tip.n+" \u2192</a>";
  document.body.insertBefore(bar,document.body.firstChild);
})();
