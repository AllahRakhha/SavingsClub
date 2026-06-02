/* SavingsClub - Calculator Guides v6
   All 10 mortgage states now clickable: TX, CA, FL, NY, PA, IL, OH, GA, NC, MI */
(function(){

  var path=window.location.pathname.toLowerCase();

  var STATE_GRIDS={
    'mortgage-calculator':{
      heading:'Mortgage Calculator by State',
      sub:'See state-specific mortgage rates, property tax, and median home prices.',
      basePath:'/mortgage-calculator/',
      activeStates:['texas','california','florida','new-york','pennsylvania','illinois','ohio','georgia','north-carolina','michigan'],
      comingSoonMsg:'More states coming soon — we are launching all 50 state-specific mortgage calculators in 2026.'
    },
    '401k-calculator':{
      heading:'401(k) Calculator by State',
      sub:'See state income tax impact on your 401(k) take-home (state tax-free states save thousands).',
      basePath:'/401k-calculator/',
      activeStates:[],
      comingSoonMsg:'State-specific 401(k) calculators coming soon — including tax-free states like Texas, Florida, Nevada, and Washington.'
    }
  };

  var ALL_STATES=[
    {name:'Alabama',slug:'alabama'},{name:'Alaska',slug:'alaska'},
    {name:'Arizona',slug:'arizona'},{name:'Arkansas',slug:'arkansas'},
    {name:'California',slug:'california'},{name:'Colorado',slug:'colorado'},
    {name:'Connecticut',slug:'connecticut'},{name:'Delaware',slug:'delaware'},
    {name:'Florida',slug:'florida'},{name:'Georgia',slug:'georgia'},
    {name:'Hawaii',slug:'hawaii'},{name:'Idaho',slug:'idaho'},
    {name:'Illinois',slug:'illinois'},{name:'Indiana',slug:'indiana'},
    {name:'Iowa',slug:'iowa'},{name:'Kansas',slug:'kansas'},
    {name:'Kentucky',slug:'kentucky'},{name:'Louisiana',slug:'louisiana'},
    {name:'Maine',slug:'maine'},{name:'Maryland',slug:'maryland'},
    {name:'Massachusetts',slug:'massachusetts'},{name:'Michigan',slug:'michigan'},
    {name:'Minnesota',slug:'minnesota'},{name:'Mississippi',slug:'mississippi'},
    {name:'Missouri',slug:'missouri'},{name:'Montana',slug:'montana'},
    {name:'Nebraska',slug:'nebraska'},{name:'Nevada',slug:'nevada'},
    {name:'New Hampshire',slug:'new-hampshire'},{name:'New Jersey',slug:'new-jersey'},
    {name:'New Mexico',slug:'new-mexico'},{name:'New York',slug:'new-york'},
    {name:'North Carolina',slug:'north-carolina'},{name:'North Dakota',slug:'north-dakota'},
    {name:'Ohio',slug:'ohio'},{name:'Oklahoma',slug:'oklahoma'},
    {name:'Oregon',slug:'oregon'},{name:'Pennsylvania',slug:'pennsylvania'},
    {name:'Rhode Island',slug:'rhode-island'},{name:'South Carolina',slug:'south-carolina'},
    {name:'South Dakota',slug:'south-dakota'},{name:'Tennessee',slug:'tennessee'},
    {name:'Texas',slug:'texas'},{name:'Utah',slug:'utah'},
    {name:'Vermont',slug:'vermont'},{name:'Virginia',slug:'virginia'},
    {name:'Washington',slug:'washington'},{name:'West Virginia',slug:'west-virginia'},
    {name:'Wisconsin',slug:'wisconsin'},{name:'Wyoming',slug:'wyoming'}
  ];

  var stateGridStyles=document.createElement('style');
  stateGridStyles.textContent=
    '.sc-state-section{max-width:1100px;margin:40px auto;padding:36px 28px;background:linear-gradient(135deg,#fff 0%,#F8FAFC 100%);border-radius:24px;border:1px solid #E2E8F0;box-shadow:0 4px 20px rgba(10,22,40,.04)}'+
    '.sc-state-heading{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:1.6rem;font-weight:800;color:#0A1628;margin:0 0 8px;letter-spacing:-.02em}'+
    '.sc-state-sub{font-size:1rem;color:#64748B;line-height:1.6;margin:0 0 24px}'+
    '.sc-state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin:24px 0}'+
    '.sc-state-card{background:#fff;border:1.5px solid #E2E8F0;border-radius:14px;padding:14px 18px;text-decoration:none;display:flex;align-items:center;justify-content:space-between;gap:8px;transition:all .25s;font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:600;color:#0F172A;font-size:.95rem}'+
    '.sc-state-card.active:hover{border-color:#10B981;background:linear-gradient(135deg,#F0FDF4,#fff);transform:translateY(-2px);box-shadow:0 6px 16px rgba(16,185,129,.15);color:#059669}'+
    '.sc-state-card.active .sc-state-arrow{color:#10B981}'+
    '.sc-state-card.disabled{background:#F8FAFC;color:#94A3B8;cursor:not-allowed;border-style:dashed}'+
    '.sc-state-card.disabled .sc-state-arrow{display:none}'+
    '.sc-state-arrow{color:#CBD5E1;font-size:1.1rem;font-weight:bold;transition:color .2s}'+
    '.sc-state-soon-banner{background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(16,185,129,.02));border:1px dashed rgba(16,185,129,.3);border-radius:14px;padding:18px 22px;margin-top:20px;display:flex;align-items:flex-start;gap:14px;font-family:var(--font-body,"DM Sans",sans-serif)}'+
    '.sc-state-soon-banner-icon{font-size:1.6rem;flex-shrink:0;line-height:1}'+
    '.sc-state-soon-banner-text{font-size:.92rem;color:#475569;line-height:1.6;margin:0}'+
    '@media(max-width:768px){'+
      '.sc-state-section{margin:24px 12px;padding:24px 18px;border-radius:18px}'+
      '.sc-state-heading{font-size:1.3rem}'+
      '.sc-state-grid{grid-template-columns:repeat(2,1fr);gap:10px}'+
      '.sc-state-card{padding:12px 14px;font-size:.88rem}'+
    '}';
  document.head.appendChild(stateGridStyles);

  function renderStateGrid(config){
    var html='<section class="sc-state-section" id="sc-state-section">';
    html+='<h2 class="sc-state-heading">'+config.heading+'</h2>';
    html+='<p class="sc-state-sub">'+config.sub+'</p>';

    if(config.activeStates && config.activeStates.length>0){
      html+='<div class="sc-state-grid">';
      for(var i=0;i<ALL_STATES.length;i++){
        var st=ALL_STATES[i];
        var isActive=config.activeStates.indexOf(st.slug)>-1;
        if(isActive){
          html+='<a href="'+config.basePath+st.slug+'/" class="sc-state-card active">'+
            '<span>'+st.name+'</span>'+
            '<span class="sc-state-arrow">→</span>'+
          '</a>';
        }
      }
      html+='</div>';
      html+='<div class="sc-state-soon-banner">'+
        '<span class="sc-state-soon-banner-icon">🇺🇸</span>'+
        '<p class="sc-state-soon-banner-text">'+config.comingSoonMsg+'</p>'+
      '</div>';
    }else{
      html+='<div class="sc-state-soon-banner" style="margin-top:0">'+
        '<span class="sc-state-soon-banner-icon">🇺🇸</span>'+
        '<p class="sc-state-soon-banner-text">'+config.comingSoonMsg+'</p>'+
      '</div>';
    }

    html+='</section>';
    return html;
  }

  function injectStateGrid(){
    var configKey=null;
    for(var key in STATE_GRIDS){
      if(path==='/'+key+'/' || path==='/'+key){
        configKey=key;break;
      }
    }
    if(!configKey)return;
    if(document.getElementById('sc-state-section'))return;

    var config=STATE_GRIDS[configKey];
    var wrapper=document.createElement('div');
    wrapper.innerHTML=renderStateGrid(config);
    var gridEl=wrapper.firstChild;

    var footer=document.querySelector('footer');
    if(footer && footer.parentNode){footer.parentNode.insertBefore(gridEl,footer);}
    else{document.body.appendChild(gridEl);}
  }

  /* 401K GUIDE DATA */
  var GUIDES={
    '401k-calculator':{
      title:'Complete Guide to the 401(k) Calculator',
      intro:'Your 401(k) is one of the most powerful retirement-building tools available to American workers. Understanding how to use this calculator — and the strategy behind your contributions — can mean the difference between retiring comfortably and working into your 70s. This guide walks through every input field, the real pros and cons of 401(k) plans, and answers the questions most people ask before they contribute.',
      howToUse:{
        heading:'How to Use This 401(k) Calculator',
        intro:'Each input below affects your projected balance at retirement. Be realistic with your numbers — overestimating returns or contributions is the most common mistake people make when projecting retirement wealth.',
        fields:[
          {label:'Annual Salary ($)',desc:'Enter your gross annual income before taxes and deductions. This is your base salary from your primary employer. Do not include bonuses, side income, spousal income, or investment income — this calculator focuses on income that flows through your 401(k)-eligible paycheck.'},
          {label:'Your Contribution (%)',desc:'The percentage of your gross salary you contribute to your 401(k) each pay period. For 2026, the IRS limits you to $23,500 per year if you are under 50, or $31,000 if you are 50 or older. A common starting point is whatever percentage triggers your full employer match — often 4% to 6%.'},
          {label:'Employer Match (%)',desc:'The percentage of your contributions your employer adds, up to a salary cap they set. A "100% match up to 4% of salary" means your employer contributes one dollar for every dollar you contribute, until you have contributed 4% of your salary. This is free money — failing to contribute enough to capture the full match is one of the costliest mistakes in personal finance.'},
          {label:'Current 401k Balance ($)',desc:'The total dollar amount currently in your 401(k) account, including any old 401(k) balances you have rolled in from previous employers. If you are just starting your career or this is your first 401(k), enter $0.'},
          {label:'Expected Return (%)',desc:'The average annual investment return you expect your 401(k) to earn. The historical long-term average for a diversified stock-heavy portfolio is roughly 7%-10% before inflation, and 5%-7% after inflation. A realistic default is 6%-7%.'},
          {label:'Years Until Retirement',desc:'How many years until you plan to stop working and start withdrawing from your 401(k). Most Americans target ages 62 to 67. If you are 35 and plan to retire at 65, enter 30.'}
        ]
      },
      pros:[
        {title:'Free Money from Employer Matching',desc:'Most employers match a portion of your contributions, typically 50% to 100% of the first 3% to 6% of your salary. This is an instant 50%-100% return on your money.'},
        {title:'Significant Tax Savings Today',desc:'Traditional 401(k) contributions reduce your taxable income for the year. If you contribute $10,000 and you are in the 24% federal tax bracket, you save roughly $2,400 in federal taxes this year.'},
        {title:'Tax-Deferred Compound Growth',desc:'Your money grows without being taxed on dividends, interest, or capital gains each year. Over 30+ years, this tax deferral can add hundreds of thousands of dollars to your final balance.'},
        {title:'Automatic, Effortless Saving',desc:'Contributions come directly out of your paycheck before you ever see the money. This "pay yourself first" automation is the single most effective habit for building long-term wealth.'},
        {title:'High Contribution Limits',desc:'You can contribute up to $23,500 per year in 2026 ($31,000 if 50+), which is roughly 4.7 times the IRA contribution limit.'},
        {title:'Strong Creditor Protection',desc:'401(k) assets are protected from most creditors and lawsuits under federal ERISA law.'},
        {title:'Loan Option in Emergencies',desc:'Most plans let you borrow up to 50% of your vested balance (max $50,000) and pay yourself back with interest.'},
        {title:'Portability Between Jobs',desc:'When you leave an employer, you can roll your 401(k) into your new employer plan or into an IRA without paying taxes.'},
        {title:'Forced Long-Term Discipline',desc:'Early withdrawal penalties (10% plus income tax) discourage you from touching the money before retirement.'},
        {title:'Roth 401(k) Option Available',desc:'Many employers now offer a Roth 401(k) alongside the traditional version, giving you tax diversification in retirement.'}
      ],
      cons:[
        {title:'Limited Investment Choices',desc:'Most plans offer only 10 to 30 mutual funds chosen by your employer.'},
        {title:'High Fees in Many Plans',desc:'Small and mid-size employer plans often charge expense ratios of 0.50% to 1.50% per year. Over a 30-year career, a 1% higher fee can reduce your final balance by 25% or more.'},
        {title:'10% Early Withdrawal Penalty',desc:'If you withdraw before age 59½, you pay a 10% penalty on top of regular income taxes.'},
        {title:'Required Minimum Distributions (RMDs)',desc:'Starting at age 73, you must withdraw a calculated minimum amount each year whether you need it or not.'},
        {title:'Future Tax Rate Uncertainty',desc:'You defer taxes now and pay them later in retirement. If federal tax rates rise, you may end up paying more in taxes than you saved.'},
        {title:'Employer Match Vesting Schedules',desc:'Many employers require you to work 3 to 6 years before you fully own their matching contributions.'},
        {title:'No Tax Benefit on Capital Gains',desc:'Withdrawals are taxed as ordinary income, not at the lower long-term capital gains rate.'},
        {title:'Plan Loan Risks',desc:'If you borrow from your 401(k) and leave your job, the loan typically must be repaid within 60 to 90 days.'},
        {title:'No Help With Pre-Retirement Goals',desc:'401(k) money is locked away — it cannot help you buy a home or weather a job loss.'},
        {title:'Concentration Risk if Employer Stock Heavy',desc:'Some plans default new contributions into employer stock. If your job AND your retirement savings depend on the same company, a single business failure can destroy both.'},
        {title:'Required Employer Sponsorship',desc:'You can only contribute to a 401(k) if your employer offers one.'},
        {title:'Limited Tax Planning Flexibility',desc:'Once money goes into a traditional 401(k), you cannot easily convert it to Roth without triggering taxes.'}
      ],
      faq:[
        {q:'How much should I contribute to my 401(k)?',a:'At minimum, contribute enough to capture your full employer match. Beyond the match, financial planners commonly recommend saving 15% of gross income for retirement.'},
        {q:'What is the 2026 401(k) contribution limit?',a:'For 2026, you can contribute up to $23,500 of your own money if under 50. If 50+, add $7,500 catch-up for $31,000 total.'},
        {q:'Is a 401(k) better than an IRA?',a:'Both have advantages. The 401(k) offers higher contribution limits and employer matching. The IRA offers more investment choices and lower fees. Common recommendation: 401(k) to match, then max Roth IRA, then return to 401(k).'},
        {q:'Should I choose a traditional or Roth 401(k)?',a:'Traditional reduces taxes today — good if you expect lower income in retirement. Roth is taxed now but tax-free later — good if you expect higher taxes in retirement.'},
        {q:'What happens to my 401(k) when I change jobs?',a:'Four options: leave with old employer, roll into new employer plan, roll into an IRA (usually best for flexibility), or cash out (almost always a mistake).'},
        {q:'What is a good 401(k) balance by age?',a:'Fidelity benchmarks: 1x salary by 30, 3x by 40, 6x by 50, 8x by 60, 10x by 67.'},
        {q:'Can I withdraw money early from my 401(k)?',a:'Yes but expensive. Before age 59½ triggers 10% IRS penalty plus regular income taxes. A 401(k) loan is often a better option — you borrow up to 50% (max $50,000) and repay yourself with interest.'},
        {q:'What investment returns are realistic to expect?',a:'The S&P 500 has averaged roughly 10% nominal returns, 7% after inflation. Conservative projections use 6%-7%.'},
        {q:'Are 401(k) contributions tax-deductible?',a:'Traditional 401(k) contributions reduce your taxable income. Roth 401(k) contributions are NOT tax-deductible.'},
        {q:'What is vesting and how does it affect my 401(k)?',a:'Vesting determines when you fully own the matching contributions. Your own contributions are always 100% yours. Employer matches may follow graded vesting (e.g., 20% per year) or cliff vesting.'}
      ],
      related:[
        {title:'Retirement Calculator',desc:'See if your total retirement savings will support your lifestyle.',url:'/retirement-calculator/',icon:'🏠'},
        {title:'Roth IRA Calculator',desc:'Compare tax-free Roth growth against your 401(k) projection.',url:'/roth-ira-calculator/',icon:'📋'},
        {title:'Compound Interest Calculator',desc:'Visualize how compound growth multiplies your retirement contributions.',url:'/compound-interest-calculator/',icon:'📈'},
        {title:'Paycheck Calculator',desc:'See how 401(k) contributions affect your take-home pay.',url:'/paycheck-calculator/',icon:'💵'}
      ]
    }
  };

  function hideEmptyContainers(){
    var candidates=document.querySelectorAll('main div, main section, main article, .container > div, .container > section');
    for(var i=0;i<candidates.length;i++){
      var el=candidates[i];
      if(el.classList && (el.classList.contains('sc-guide') || el.classList.contains('sc-cta-box') || el.classList.contains('sc-state-section') || el.closest('.sc-guide') || el.closest('.sc-state-section')))continue;
      if(el.querySelector('input,canvas,svg,img[src],button,form,h1,h2,h3,h4,p,a,ul,ol,table'))continue;
      var txt=(el.textContent||'').trim();
      try{
        var cs=getComputedStyle(el);
        var bg=cs.backgroundColor||'';
        var border=cs.border||cs.borderTop||'';
        var hasBorder=border && border.indexOf('0px')===-1 && border!=='none';
        var rect=el.getBoundingClientRect();
        if(txt.length<5 && rect.height>10 && rect.height<200 && rect.width>200 && (hasBorder||(bg && bg.indexOf('rgba(0, 0, 0, 0)')===-1 && bg!=='transparent'))){
          el.style.display='none';
        }
      }catch(e){}
    }
  }

  if(document.readyState==='complete'){hideEmptyContainers();}
  else{window.addEventListener('load',function(){setTimeout(hideEmptyContainers,300);});}
  setTimeout(hideEmptyContainers,1500);

  if(document.readyState==='complete'){
    setTimeout(injectStateGrid,100);
  }else{
    window.addEventListener('load',function(){setTimeout(injectStateGrid,100);});
  }

  var currentCalc=null;
  for(var key in GUIDES){
    if(path.indexOf('/'+key+'/')>-1 || path.indexOf('/'+key)>-1){
      currentCalc=key;break;
    }
  }
  if(!currentCalc){return;}

  var data=GUIDES[currentCalc];
  if(!data)return;

  function hideOldContent(){
    var oldHeadings=['how does a 401','understanding employer match','how much should i contribute','401(k) vs','what happens when i change','frequently asked questions','related guides'];
    var allHeads=document.querySelectorAll('h2, h3');
    for(var i=0;i<allHeads.length;i++){
      var h=allHeads[i];
      if(h.closest && h.closest('.sc-guide'))continue;
      if(h.closest && h.closest('footer'))continue;
      var t=h.textContent.trim().toLowerCase();
      for(var j=0;j<oldHeadings.length;j++){
        if(t.indexOf(oldHeadings[j])>-1){
          h.style.display='none';
          var sib=h.nextElementSibling;
          while(sib){
            if(sib.tagName==='H2')break;
            sib.style.display='none';
            sib=sib.nextElementSibling;
          }
          break;
        }
      }
    }
  }

  var s=document.createElement('style');
  s.textContent=
    '.sc-cta-box{display:block;max-width:1100px;margin:30px auto;padding:32px 24px;background:linear-gradient(135deg,#059669 0%,#10B981 100%);border-radius:20px;color:#fff;text-align:center;box-shadow:0 8px 24px rgba(16,185,129,.25)}'+
    '.sc-cta-box h3{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:1.5rem;font-weight:800;margin:0 0 8px;color:#fff}'+
    '.sc-cta-box p{font-size:1rem;color:rgba(255,255,255,.92);margin:0 0 20px;line-height:1.6}'+
    '.sc-cta-btn{display:inline-block;background:#fff;color:#059669;padding:12px 28px;border-radius:50px;font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:700;text-decoration:none;font-size:.95rem}'+
    '.sc-guide{display:block!important;visibility:visible!important;opacity:1!important;position:relative;z-index:5;max-width:1100px;margin:40px auto;padding:40px 24px;font-family:var(--font-body,"DM Sans",sans-serif);color:#0F172A;background:#fff;border-radius:24px;box-shadow:0 4px 20px rgba(10,22,40,.06)}'+
    '.sc-guide h2{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:1.85rem;font-weight:800;color:#0A1628;margin:50px 0 16px;letter-spacing:-.02em;line-height:1.2}'+
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
    '.sc-procons-col{background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:24px}'+
    '.sc-procons-col.pros{border-top:4px solid #10B981}'+
    '.sc-procons-col.cons{border-top:4px solid #EF4444}'+
    '.sc-procons-heading{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:1.25rem;font-weight:800;margin:0 0 4px}'+
    '.sc-procons-heading.pros{color:#059669}'+
    '.sc-procons-heading.cons{color:#DC2626}'+
    '.sc-procons-sub{font-size:.85rem;color:#94A3B8;margin:0 0 18px}'+
    '.sc-pc-item{padding:14px 0;border-bottom:1px solid #F1F5F9}'+
    '.sc-pc-item:last-child{border-bottom:none}'+
    '.sc-pc-title{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:700;color:#0F172A;font-size:.98rem;margin:0 0 4px;display:flex;align-items:flex-start;gap:8px}'+
    '.sc-procons-col.pros .sc-pc-title::before{content:"\u2713";color:#10B981;font-weight:900;font-size:1.1rem;flex-shrink:0;margin-top:2px}'+
    '.sc-procons-col.cons .sc-pc-title::before{content:"\u2715";color:#EF4444;font-weight:900;font-size:1.05rem;flex-shrink:0;margin-top:2px}'+
    '.sc-pc-desc{font-size:.9rem;color:#64748B;line-height:1.65;margin:0;padding-left:20px}'+
    '.sc-faq-item{background:#fff;border:1px solid #E2E8F0;border-radius:14px;margin-bottom:10px;overflow:hidden}'+
    '.sc-faq-q{padding:18px 22px;font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:700;color:#0F172A;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:1rem;line-height:1.4;user-select:none}'+
    '.sc-faq-icon{width:24px;height:24px;flex-shrink:0;border-radius:50%;background:#F0FDF4;color:#059669;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;transition:transform .25s}'+
    '.sc-faq-item.open .sc-faq-icon{transform:rotate(45deg);background:#10B981;color:#fff}'+
    '.sc-faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:0 22px;color:#475569;font-size:.97rem;line-height:1.75}'+
    '.sc-faq-item.open .sc-faq-a{max-height:600px;padding:0 22px 20px}'+
    '.sc-related{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:24px 0}'+
    '.sc-related-card{background:#fff;border:1px solid #E2E8F0;border-radius:18px;padding:22px;text-decoration:none;color:#0F172A;display:block}'+
    '.sc-related-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(10,22,40,.08);border-color:#10B981}'+
    '.sc-rc-icon{font-size:2rem;margin-bottom:10px;display:block}'+
    '.sc-rc-title{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:800;color:#0A1628;font-size:1.05rem;margin:0 0 6px}'+
    '.sc-rc-desc{font-size:.86rem;color:#64748B;line-height:1.6;margin:0}'+
    '@media(max-width:768px){'+
      '.sc-guide{margin:24px 12px;padding:24px 16px;border-radius:18px}'+
      '.sc-guide h2{font-size:1.4rem}'+
      '.sc-cta-box{margin:24px 12px;padding:24px 18px}'+
      '.sc-howto{padding:20px}'+
      '.sc-procons{grid-template-columns:1fr;gap:16px}'+
      '.sc-procons-col{padding:20px}'+
      '.sc-faq-q{padding:16px 18px;font-size:.95rem}'+
      '.sc-faq-item.open .sc-faq-a{padding:0 18px 16px}'+
    '}';
  document.head.appendChild(s);

  function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function buildCTABox(){
    return '<div class="sc-cta-box" id="sc-cta-box">'+
      '<h3>Explore More Free Financial Calculators</h3>'+
      '<p>Make smarter decisions about retirement, debt, savings, and more — all 17 calculators free, no signup required.</p>'+
      '<a href="/" class="sc-cta-btn">See All Calculators →</a>'+
      '</div>';
  }

  function buildGuide(){
    var html='<section class="sc-guide" id="sc-guide-block">';
    html+='<h2>'+esc(data.title)+'</h2>';
    html+='<p class="sc-intro">'+esc(data.intro)+'</p>';
    html+='<h2>'+esc(data.howToUse.heading)+'</h2>';
    html+='<div class="sc-howto">';
    html+='<p class="sc-howto-intro">'+esc(data.howToUse.intro)+'</p>';
    for(var i=0;i<data.howToUse.fields.length;i++){
      var f=data.howToUse.fields[i];
      html+='<div class="sc-field"><span class="sc-field-label">'+esc(f.label)+'</span><p class="sc-field-desc">'+esc(f.desc)+'</p></div>';
    }
    html+='</div>';
    html+='<h2>Pros and Cons of a 401(k) Plan</h2>';
    html+='<div class="sc-procons">';
    html+='<div class="sc-procons-col pros"><h3 class="sc-procons-heading pros">Pros</h3><p class="sc-procons-sub">Why a 401(k) is the foundation of most retirement plans</p>';
    for(var i=0;i<data.pros.length;i++){
      html+='<div class="sc-pc-item"><div class="sc-pc-title">'+esc(data.pros[i].title)+'</div><p class="sc-pc-desc">'+esc(data.pros[i].desc)+'</p></div>';
    }
    html+='</div>';
    html+='<div class="sc-procons-col cons"><h3 class="sc-procons-heading cons">Cons</h3><p class="sc-procons-sub">Trade-offs to understand before contributing</p>';
    for(var i=0;i<data.cons.length;i++){
      html+='<div class="sc-pc-item"><div class="sc-pc-title">'+esc(data.cons[i].title)+'</div><p class="sc-pc-desc">'+esc(data.cons[i].desc)+'</p></div>';
    }
    html+='</div></div>';
    html+='<h2>Frequently Asked Questions</h2>';
    for(var i=0;i<data.faq.length;i++){
      html+='<div class="sc-faq-item" data-idx="'+i+'">'+
        '<div class="sc-faq-q" onclick="this.parentNode.classList.toggle(\'open\')">'+esc(data.faq[i].q)+'<span class="sc-faq-icon">+</span></div>'+
        '<div class="sc-faq-a">'+esc(data.faq[i].a)+'</div>'+
      '</div>';
    }
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
    html+='</div></section>';
    return html;
  }

  function injectGuide(){
    if(document.getElementById('sc-guide-block'))return;
    var anchor=document.querySelector('.calculator-section')||document.querySelector('.calculator-card')||document.querySelector('.calc-wrapper')||document.querySelector('main .container:first-of-type')||document.querySelector('main')||document.querySelector('.container');
    if(!document.getElementById('sc-cta-box')){
      var ctaWrap=document.createElement('div');
      ctaWrap.innerHTML=buildCTABox();
      var ctaEl=ctaWrap.firstChild;
      if(anchor && anchor.parentNode){
        if(anchor.nextSibling){anchor.parentNode.insertBefore(ctaEl,anchor.nextSibling);}
        else{anchor.parentNode.appendChild(ctaEl);}
      }
    }
    var guideWrap=document.createElement('div');
    guideWrap.innerHTML=buildGuide();
    var guideEl=guideWrap.firstChild;
    var insertAfter=document.getElementById('sc-cta-box')||anchor;
    if(insertAfter && insertAfter.parentNode){
      if(insertAfter.nextSibling){insertAfter.parentNode.insertBefore(guideEl,insertAfter.nextSibling);}
      else{insertAfter.parentNode.appendChild(guideEl);}
    }else{
      var footer=document.querySelector('footer');
      if(footer && footer.parentNode){footer.parentNode.insertBefore(guideEl,footer);}
      else{document.body.appendChild(guideEl);}
    }
    var faqSchema={"@context":"https://schema.org","@type":"FAQPage","mainEntity":data.faq.map(function(item){return {"@type":"Question","name":item.q,"acceptedAnswer":{"@type":"Answer","text":item.a}};})};
    var schemaScript=document.createElement('script');
    schemaScript.type='application/ld+json';
    schemaScript.textContent=JSON.stringify(faqSchema);
    document.head.appendChild(schemaScript);
  }

  if(document.readyState==='complete'){
    hideOldContent();injectGuide();
  }else{
    window.addEventListener('load',function(){
      setTimeout(function(){hideOldContent();injectGuide();},200);
    });
  }

})();
