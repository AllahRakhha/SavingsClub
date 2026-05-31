/* SavingsClub - Calculator Guides v1 (401k only - first batch for review) */
(function(){

  /* Only run on calculator pages */
  var path=window.location.pathname.toLowerCase();

  /* ============================================================
     CALCULATOR DATA - one entry per calculator
     Add more calculators by adding entries to this object
     ============================================================ */
  var GUIDES={

    '401k-calculator':{
      title:'Complete Guide to the 401(k) Calculator',
      intro:'Your 401(k) is one of the most powerful retirement-building tools available to American workers. Understanding how to use this calculator — and the strategy behind your contributions — can mean the difference between retiring comfortably and working into your 70s. This guide walks through every input field, the real pros and cons of 401(k) plans, and answers the questions most people ask before they contribute.',

      howToUse:{
        heading:'How to Use This 401(k) Calculator',
        intro:'Each input below affects your projected balance at retirement. Be realistic with your numbers — overestimating returns or contributions is the most common mistake people make when projecting retirement wealth.',
        fields:[
          {label:'Annual Salary ($)',desc:'Enter your gross annual income before taxes and deductions. This is your base salary from your primary employer. Do not include bonuses, side income, spousal income, or investment income — this calculator focuses on income that flows through your 401(k)-eligible paycheck. If you receive an annual raise, the calculator assumes consistent salary, so you may want to recalculate every 1-2 years to stay accurate.'},
          {label:'Your Contribution (%)',desc:'The percentage of your gross salary you contribute to your 401(k) each pay period. For 2026, the IRS limits you to $23,500 per year if you are under 50, or $31,000 if you are 50 or older (the extra $7,500 is the "catch-up" contribution). A common starting point is whatever percentage triggers your full employer match — often 4% to 6%.'},
          {label:'Employer Match (%)',desc:'The percentage of your contributions your employer adds to your account, up to a salary cap they set. A "100% match up to 4% of salary" means your employer contributes one dollar for every dollar you contribute, until you have contributed 4% of your salary. This is free money — failing to contribute enough to capture the full match is one of the costliest mistakes in personal finance.'},
          {label:'Current 401k Balance ($)',desc:'The total dollar amount currently in your 401(k) account, including any old 401(k) balances you have rolled in from previous employers. If you are just starting your career or this is your first 401(k), enter $0. Check your most recent statement or log into your plan provider (Fidelity, Vanguard, Empower, etc.) for the exact figure.'},
          {label:'Expected Return (%)',desc:'The average annual investment return you expect your 401(k) to earn. The historical long-term average for a diversified stock-heavy portfolio is roughly 7%-10% before inflation, and 5%-7% after inflation. Conservative portfolios (more bonds) earn less. A realistic default is 6%-7%. Avoid using 10% or higher in your projections — that is wishful thinking, not planning.'},
          {label:'Years Until Retirement',desc:'How many years until you plan to stop working and start withdrawing from your 401(k). Most Americans target ages 62 to 67. If you are 35 and plan to retire at 65, enter 30. The longer your time horizon, the more compound growth works in your favor — every extra year of contributions in your 30s is worth far more than the same contribution in your 60s.'}
        ]
      },

      pros:[
        {title:'Free Money from Employer Matching',desc:'Most employers match a portion of your contributions, typically 50% to 100% of the first 3% to 6% of your salary. This is an instant 50%-100% return on your money — better than any investment you can find elsewhere.'},
        {title:'Significant Tax Savings Today',desc:'Traditional 401(k) contributions reduce your taxable income for the year. If you contribute $10,000 and you are in the 24% federal tax bracket, you save roughly $2,400 in federal taxes this year (plus state tax savings in most states).'},
        {title:'Tax-Deferred Compound Growth',desc:'Your money grows without being taxed on dividends, interest, or capital gains each year. Over 30+ years, this tax deferral can add hundreds of thousands of dollars to your final balance compared to a regular taxable brokerage account.'},
        {title:'Automatic, Effortless Saving',desc:'Contributions come directly out of your paycheck before you ever see the money. This "pay yourself first" automation removes the temptation to spend and is the single most effective habit for building long-term wealth.'},
        {title:'High Contribution Limits',desc:'You can contribute up to $23,500 per year in 2026 ($31,000 if 50+), which is roughly 4.7 times the IRA contribution limit. For high earners, the 401(k) is the only practical way to shelter significant amounts of pre-tax income.'},
        {title:'Strong Creditor Protection',desc:'401(k) assets are protected from most creditors and lawsuits under federal ERISA law. If you face bankruptcy, your 401(k) balance is generally untouchable — providing financial security that other assets cannot match.'},
        {title:'Loan Option in Emergencies',desc:'Most plans let you borrow up to 50% of your vested balance (max $50,000) and pay yourself back with interest. While not ideal, this option provides a safety net most retirement accounts do not offer.'},
        {title:'Portability Between Jobs',desc:'When you leave an employer, you can roll your 401(k) into your new employer plan or into an IRA without paying taxes. Your retirement savings follow you throughout your career.'},
        {title:'Forced Long-Term Discipline',desc:'Early withdrawal penalties (10% plus income tax) discourage you from touching the money before retirement. This barrier helps protect your future self from short-term temptation.'},
        {title:'Roth 401(k) Option Available',desc:'Many employers now offer a Roth 401(k) alongside the traditional version. Roth contributions are made with after-tax dollars but grow and are withdrawn tax-free, giving you tax diversification in retirement.'}
      ],

      cons:[
        {title:'Limited Investment Choices',desc:'Most plans offer only 10 to 30 mutual funds chosen by your employer. You cannot buy individual stocks, ETFs from other companies, or alternative investments. Your options may not include the lowest-fee or highest-quality funds available in the broader market.'},
        {title:'High Fees in Many Plans',desc:'Small and mid-size employer plans often charge expense ratios of 0.50% to 1.50% per year, plus administrative fees. Over a 30-year career, a 1% higher fee can reduce your final balance by 25% or more. Always check your plan fee disclosure.'},
        {title:'10% Early Withdrawal Penalty',desc:'If you withdraw before age 59½, you pay a 10% penalty on top of regular income taxes. This makes 401(k) funds effectively locked away for decades — bad for emergencies or career changes.'},
        {title:'Required Minimum Distributions (RMDs)',desc:'Starting at age 73 (rising to 75 in coming years), you must withdraw a calculated minimum amount each year whether you need it or not. RMDs are taxable income and can push you into a higher tax bracket in retirement.'},
        {title:'Future Tax Rate Uncertainty',desc:'You defer taxes now and pay them later in retirement. If federal tax rates rise over the coming decades (a real possibility given national debt levels), you may end up paying more in taxes than you saved.'},
        {title:'Employer Match Vesting Schedules',desc:'Many employers require you to work 3 to 6 years before you fully own their matching contributions. Leave too early and you forfeit some or all of the employer match — a costly surprise for job-hoppers.'},
        {title:'No Tax Benefit on Capital Gains',desc:'Withdrawals are taxed as ordinary income, not at the lower long-term capital gains rate. A taxable brokerage account holding the same investments would receive better tax treatment on growth.'},
        {title:'Plan Loan Risks',desc:'If you borrow from your 401(k) and leave your job, the loan typically must be repaid within 60 to 90 days or it becomes a taxable distribution plus the 10% penalty. Job loss timing can be financially devastating.'},
        {title:'No Help With Pre-Retirement Goals',desc:'401(k) money is locked away — it cannot help you buy a home, fund a child education, or weather a job loss. You still need separate emergency savings and taxable investments for shorter-term goals.'},
        {title:'Concentration Risk if Employer Stock Heavy',desc:'Some plans default new contributions into employer stock. If your job AND your retirement savings depend on the same company, a single business failure can destroy both your income and your retirement at once (Enron is the textbook example).'},
        {title:'Required Employer Sponsorship',desc:'You can only contribute to a 401(k) if your employer offers one. Self-employed workers, contractors, and employees of small businesses without 401(k) plans must use alternatives like SEP-IRAs or Solo 401(k)s.'},
        {title:'Limited Roth Income Tax Planning Flexibility',desc:'Unlike a Roth IRA, the Roth 401(k) still has Required Minimum Distributions (until 2024 rule changes — verify with your plan). This reduces some of the tax-planning advantages compared to a Roth IRA.'}
      ],

      faq:[
        {q:'How much should I contribute to my 401(k)?',a:'At absolute minimum, contribute enough to capture your full employer match — this is a guaranteed 50%-100% return on your money. Beyond the match, financial planners commonly recommend saving 15% of gross income for retirement including employer contributions. If you started saving late (40s or 50s), you may need 20%-25% to catch up. Use this calculator to test different percentages and see how each one affects your projected retirement balance.'},
        {q:'What is the 2026 401(k) contribution limit?',a:'For 2026, you can contribute up to $23,500 of your own money if you are under 50. If you are 50 or older, you can add a $7,500 catch-up contribution for a total of $31,000. There is also a higher catch-up of $11,250 for workers ages 60 to 63 under SECURE 2.0 rules. These limits apply only to your contributions — employer matching does not count against these caps, but there is a separate combined limit of $70,000 ($77,500 if 50+).'},
        {q:'Is a 401(k) better than an IRA?',a:'Both have advantages. The 401(k) offers higher contribution limits, employer matching, and stronger creditor protection. The IRA offers far more investment choices, typically lower fees, and more flexibility. The common recommendation is to contribute to your 401(k) up to the employer match, then max a Roth IRA ($7,000 in 2026, or $8,000 if 50+), then return to the 401(k) for additional contributions.'},
        {q:'Should I choose a traditional or Roth 401(k)?',a:'It depends on whether you expect your tax rate to be higher now or in retirement. Traditional 401(k) reduces taxes today and you pay later — good if you expect lower income in retirement. Roth 401(k) is taxed now but tax-free later — good if you expect higher taxes in retirement or you are early in your career and currently in a low bracket. Many financial planners suggest splitting contributions between both to hedge against future tax uncertainty.'},
        {q:'What happens to my 401(k) when I change jobs?',a:'You have four options: (1) Leave it with your old employer (allowed if balance is above $7,000). (2) Roll it into your new employer 401(k) plan. (3) Roll it into an IRA — usually the best choice for investment flexibility and lower fees. (4) Cash it out, which triggers income taxes plus a 10% early withdrawal penalty if you are under 59½. Option 4 is almost always a mistake. Direct rollovers (trustee-to-trustee transfers) avoid taxes and penalties.'},
        {q:'What is a good 401(k) balance by age?',a:'Common benchmarks from Fidelity Investments: 1x your annual salary by age 30, 3x by 40, 6x by 50, 8x by 60, and 10x by 67. These are rough guidelines — your actual target depends on your retirement lifestyle, Social Security expectations, other assets, and where you plan to live. Use the calculator above with your actual numbers for a more personalized projection.'},
        {q:'Can I withdraw money early from my 401(k)?',a:'Yes, but it is expensive. Withdrawals before age 59½ trigger a 10% IRS penalty plus regular federal and state income taxes. Hardship withdrawals are allowed for specific qualifying events (medical bills, foreclosure, college costs) but still owe regular taxes. A 401(k) loan is often a better option — you borrow up to 50% of your balance (max $50,000) and repay yourself with interest, avoiding taxes and penalties as long as the loan is repaid on schedule.'},
        {q:'What investment returns are realistic to expect?',a:'The S&P 500 has averaged roughly 10% annual returns nominally and 7% after inflation over the past 50 years. A balanced 60/40 stock/bond portfolio has averaged 7%-8% nominal, 4%-5% real. Many financial planners use 6%-7% as a conservative projection. Avoid using 10% or higher in your calculator — that assumes 100% stocks with no inflation adjustment, which underestimates the impact of bear markets and rising prices.'},
        {q:'Are 401(k) contributions tax-deductible?',a:'Traditional 401(k) contributions reduce your taxable income for the year, which lowers your federal income tax bill. Most states also exempt 401(k) contributions from state income tax (exceptions include Pennsylvania, which taxes contributions but not withdrawals). Roth 401(k) contributions are NOT tax-deductible — you pay tax now in exchange for tax-free withdrawals later.'},
        {q:'What is vesting and how does it affect my 401(k)?',a:'Vesting determines when you fully own the matching contributions your employer makes. Your own contributions are always 100% yours immediately. Employer matches may follow a graded vesting schedule (e.g., 20% per year over 5 years) or cliff vesting (e.g., 0% for 2 years, then 100%). If you leave before fully vesting, you forfeit the unvested portion. Always check your plan summary description before quitting a job — staying an extra few months can sometimes secure thousands in employer contributions.'}
      ],

      related:[
        {title:'Retirement Calculator',desc:'See if your total retirement savings (401k + IRA + pension + Social Security) will support your lifestyle.',url:'/retirement-calculator/',icon:'🏠'},
        {title:'Roth IRA Calculator',desc:'Compare tax-free Roth growth against your 401(k) projection.',url:'/roth-ira-calculator/',icon:'📋'},
        {title:'Compound Interest Calculator',desc:'Visualize how compound growth multiplies your retirement contributions.',url:'/compound-interest-calculator/',icon:'📈'},
        {title:'Paycheck Calculator',desc:'See how 401(k) contributions affect your take-home pay each pay period.',url:'/paycheck-calculator/',icon:'💵'}
      ]
    }

    /* Future calculators added here: 'mortgage-calculator':{...}, 'retirement-calculator':{...}, etc. */
  };

  /* ============================================================
     DETECT WHICH CALCULATOR PAGE WE ARE ON
     ============================================================ */
  var currentCalc=null;
  for(var key in GUIDES){
    if(path.indexOf('/'+key+'/')>-1 || path.indexOf('/'+key)>-1){
      currentCalc=key;break;
    }
  }
  if(!currentCalc)return;  /* Not on a guided calculator page, exit silently */

  var data=GUIDES[currentCalc];
  if(!data)return;

  /* ============================================================
     REMOVE EXISTING HARDCODED CONTENT (replace mode)
     Targets H2/H3 headings by text content, removes them + siblings until next H2
     ============================================================ */
  function removeSection(headingText){
    var headings=document.querySelectorAll('h2, h3');
    for(var i=0;i<headings.length;i++){
      var h=headings[i];
      var txt=h.textContent.trim().toLowerCase();
      if(txt.indexOf(headingText.toLowerCase())>-1){
        /* Remove this heading and all following siblings until next h2 (or end) */
        var node=h;
        var toRemove=[node];
        var next=node.nextElementSibling;
        while(next){
          if(next.tagName==='H2')break;  /* Stop at next H2 - that's a different section */
          toRemove.push(next);
          next=next.nextElementSibling;
        }
        for(var j=0;j<toRemove.length;j++){
          if(toRemove[j].parentNode)toRemove[j].parentNode.removeChild(toRemove[j]);
        }
        return true;
      }
    }
    return false;
  }

  /* Remove old hardcoded sections */
  removeSection('how does a 401');
  removeSection('frequently asked questions');
  removeSection('related guides');
  /* Also remove standalone H3s left behind */
  var h3s=document.querySelectorAll('h3');
  for(var i=h3s.length-1;i>=0;i--){
    var t=h3s[i].textContent.trim().toLowerCase();
    if(t.indexOf('understanding employer')>-1 || t.indexOf('how much should')>-1 || t.indexOf('401(k) vs')>-1 || t.indexOf('what happens when')>-1){
      var node=h3s[i];
      var next=node.nextElementSibling;
      var toRm=[node];
      while(next && next.tagName!=='H2' && next.tagName!=='H3'){
        toRm.push(next);next=next.nextElementSibling;
      }
      for(var j=0;j<toRm.length;j++){if(toRm[j].parentNode)toRm[j].parentNode.removeChild(toRm[j]);}
    }
  }

  /* ============================================================
     INJECT GUIDE STYLES
     ============================================================ */
  var s=document.createElement('style');
  s.textContent=
    '.sc-guide{max-width:1100px;margin:60px auto 40px;padding:0 20px;font-family:var(--font-body,"DM Sans",sans-serif);color:#0F172A}'+
    '.sc-guide h2{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:1.85rem;font-weight:800;color:#0A1628;margin:50px 0 16px;letter-spacing:-.02em}'+
    '.sc-guide h2:first-child{margin-top:0}'+
    '.sc-guide h3{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:1.15rem;font-weight:700;color:#0A1628;margin:24px 0 8px}'+
    '.sc-guide p,.sc-guide li{font-size:1rem;line-height:1.75;color:#334155}'+
    '.sc-guide .sc-intro{font-size:1.08rem;line-height:1.8;color:#475569;border-left:4px solid #10B981;padding:6px 0 6px 20px;margin:20px 0 40px;background:linear-gradient(to right,rgba(16,185,129,.04),transparent)}'+
    '.sc-howto{background:#F8FAFC;border-radius:20px;padding:32px;margin:24px 0}'+
    '.sc-howto-intro{font-size:.98rem;color:#475569;margin-bottom:24px;line-height:1.7}'+
    '.sc-field{padding:18px 0;border-bottom:1px solid #E2E8F0}'+
    '.sc-field:last-child{border-bottom:none}'+
    '.sc-field-label{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:700;color:#059669;font-size:1.02rem;margin-bottom:6px;display:block}'+
    '.sc-field-desc{font-size:.95rem;color:#475569;line-height:1.7;margin:0}'+
    '.sc-procons{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0}'+
    '.sc-procons-col{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:24px;box-shadow:0 1px 3px rgba(10,22,40,.04)}'+
    '.sc-procons-col.pros{border-top:4px solid #10B981}'+
    '.sc-procons-col.cons{border-top:4px solid #EF4444}'+
    '.sc-procons-heading{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:1.25rem;font-weight:800;margin:0 0 4px;display:flex;align-items:center;gap:8px}'+
    '.sc-procons-heading.pros{color:#059669}'+
    '.sc-procons-heading.cons{color:#DC2626}'+
    '.sc-procons-sub{font-size:.85rem;color:#94A3B8;margin:0 0 18px}'+
    '.sc-pc-item{padding:14px 0;border-bottom:1px solid #F1F5F9}'+
    '.sc-pc-item:last-child{border-bottom:none}'+
    '.sc-pc-title{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:700;color:#0F172A;font-size:.98rem;margin:0 0 4px;display:flex;align-items:flex-start;gap:8px}'+
    '.sc-pc-title::before{flex-shrink:0;margin-top:2px}'+
    '.sc-procons-col.pros .sc-pc-title::before{content:"✓";color:#10B981;font-weight:900;font-size:1.1rem;line-height:1}'+
    '.sc-procons-col.cons .sc-pc-title::before{content:"✕";color:#EF4444;font-weight:900;font-size:1.05rem;line-height:1}'+
    '.sc-pc-desc{font-size:.9rem;color:#64748B;line-height:1.65;margin:0;padding-left:20px}'+
    '.sc-faq-item{background:#fff;border:1px solid #E2E8F0;border-radius:14px;margin-bottom:10px;overflow:hidden;transition:border-color .2s}'+
    '.sc-faq-item:hover{border-color:#10B981}'+
    '.sc-faq-q{padding:18px 22px;font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:700;color:#0F172A;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:1rem;line-height:1.4;user-select:none}'+
    '.sc-faq-icon{width:24px;height:24px;flex-shrink:0;border-radius:50%;background:#F0FDF4;color:#059669;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;transition:transform .25s,background .25s}'+
    '.sc-faq-item.open .sc-faq-icon{transform:rotate(45deg);background:#10B981;color:#fff}'+
    '.sc-faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:0 22px;color:#475569;font-size:.97rem;line-height:1.75}'+
    '.sc-faq-item.open .sc-faq-a{max-height:600px;padding:0 22px 20px}'+
    '.sc-related{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:24px 0}'+
    '.sc-related-card{background:#fff;border:1px solid #E2E8F0;border-radius:18px;padding:22px;text-decoration:none;color:#0F172A;transition:transform .25s,box-shadow .25s,border-color .25s;display:block}'+
    '.sc-related-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(10,22,40,.08);border-color:#10B981}'+
    '.sc-rc-icon{font-size:2rem;margin-bottom:10px;display:block}'+
    '.sc-rc-title{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:800;color:#0A1628;font-size:1.05rem;margin:0 0 6px}'+
    '.sc-rc-desc{font-size:.86rem;color:#64748B;line-height:1.6;margin:0}'+
    '@media(max-width:768px){'+
      '.sc-guide{margin:40px auto 30px;padding:0 14px}'+
      '.sc-guide h2{font-size:1.5rem;margin:36px 0 12px}'+
      '.sc-howto{padding:20px}'+
      '.sc-procons{grid-template-columns:1fr;gap:16px}'+
      '.sc-procons-col{padding:20px}'+
      '.sc-faq-q{padding:16px 18px;font-size:.95rem}'+
      '.sc-faq-item.open .sc-faq-a{padding:0 18px 16px}'+
    '}';
  document.head.appendChild(s);

  /* ============================================================
     BUILD GUIDE HTML
     ============================================================ */
  function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  var html='<section class="sc-guide">';
  html+='<h2>'+esc(data.title)+'</h2>';
  html+='<p class="sc-intro">'+esc(data.intro)+'</p>';

  /* How to Use */
  html+='<h2>'+esc(data.howToUse.heading)+'</h2>';
  html+='<div class="sc-howto">';
  html+='<p class="sc-howto-intro">'+esc(data.howToUse.intro)+'</p>';
  for(var i=0;i<data.howToUse.fields.length;i++){
    var f=data.howToUse.fields[i];
    html+='<div class="sc-field"><span class="sc-field-label">'+esc(f.label)+'</span><p class="sc-field-desc">'+esc(f.desc)+'</p></div>';
  }
  html+='</div>';

  /* Pros and Cons */
  html+='<h2>Pros and Cons of a 401(k) Plan</h2>';
  html+='<div class="sc-procons">';
  html+='<div class="sc-procons-col pros"><h3 class="sc-procons-heading pros">Pros</h3><p class="sc-procons-sub">Why a 401(k) is the foundation of most retirement plans</p>';
  for(var i=0;i<data.pros.length;i++){
    html+='<div class="sc-pc-item"><div class="sc-pc-title">'+esc(data.pros[i].title)+'</div><p class="sc-pc-desc">'+esc(data.pros[i].desc)+'</p></div>';
  }
  html+='</div>';
  html+='<div class="sc-procons-col cons"><h3 class="sc-procons-heading cons">Cons</h3><p class="sc-procons-sub">Trade-offs and limitations to understand before contributing</p>';
  for(var i=0;i<data.cons.length;i++){
    html+='<div class="sc-pc-item"><div class="sc-pc-title">'+esc(data.cons[i].title)+'</div><p class="sc-pc-desc">'+esc(data.cons[i].desc)+'</p></div>';
  }
  html+='</div>';
  html+='</div>';

  /* FAQ */
  html+='<h2>Frequently Asked Questions</h2>';
  for(var i=0;i<data.faq.length;i++){
    html+='<div class="sc-faq-item" data-idx="'+i+'">'+
      '<div class="sc-faq-q" onclick="this.parentNode.classList.toggle(\'open\')">'+esc(data.faq[i].q)+'<span class="sc-faq-icon">+</span></div>'+
      '<div class="sc-faq-a">'+esc(data.faq[i].a)+'</div>'+
    '</div>';
  }

  /* Related Calculators */
  html+='<h2>Related Calculators</h2>';
  html+='<div class="sc-related">';
  for(var i=0;i<data.related.length;i++){
    var r=data.related[i];
    html+='<a href="'+esc(r.url)+'" class="sc-related-card">'+
      '<span class="sc-rc-icon">'+esc(r.icon)+'</span>'+
      '<div class="sc-rc-title">'+esc(r.title)+'</div>'+
      '<p class="sc-rc-desc">'+esc(r.desc)+'</p>'+
    '</a>';
  }
  html+='</div>';

  html+='</section>';

  /* ============================================================
     INSERT GUIDE INTO PAGE
     Place it after the main calculator area, before footer
     ============================================================ */
  var wrapper=document.createElement('div');
  wrapper.innerHTML=html;
  var guideEl=wrapper.firstChild;

  /* Try to insert before footer, fall back to body append */
  var footer=document.querySelector('footer');
  if(footer && footer.parentNode){
    footer.parentNode.insertBefore(guideEl,footer);
  }else{
    document.body.appendChild(guideEl);
  }

  /* Add FAQ schema for SEO */
  var faqSchema={
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity":data.faq.map(function(item){
      return {
        "@type":"Question",
        "name":item.q,
        "acceptedAnswer":{"@type":"Answer","text":item.a}
      };
    })
  };
  var schemaScript=document.createElement('script');
  schemaScript.type='application/ld+json';
  schemaScript.textContent=JSON.stringify(faqSchema);
  document.head.appendChild(schemaScript);

})();
