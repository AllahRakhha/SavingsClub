/* SavingsClub - Global Site Enhancements v4 (wordmark-only nav) */
(function(){

  /* 1. REMOVE OLD LOGO ICON — wordmark-only branding */
  var marks=document.querySelectorAll('.logo-mark');
  for(var i=0;i<marks.length;i++){
    var parent=marks[i].parentNode;
    marks[i].remove();
    /* Safety fallback: if parent has no text after removal, inject wordmark */
    if(parent && parent.textContent.trim()===''){
      var span=document.createElement('span');
      span.textContent='SavingsClub';
      span.style.cssText='font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-weight:800;font-size:1.4rem;color:#10B981;letter-spacing:-.01em;line-height:1';
      parent.appendChild(span);
    }
  }

  /* 2. REMOVE ABOUT & FAQ FROM TOP NAV */
  var navLinks=document.querySelectorAll('.nav-links a, #navLinks a');
  for(var i=navLinks.length-1;i>=0;i--){
    var txt=navLinks[i].textContent.trim();
    if(txt==='About'||txt==='FAQ'){navLinks[i].remove();}
  }

  /* 3. ADD SEARCH — desktop only, skip if exists */
  if(!document.getElementById('scSearch')){
    var navInner=document.querySelector('.nav-links');
    if(navInner){
      var searchWrap=document.createElement('div');
      searchWrap.style.cssText='position:relative;margin-left:8px';
      searchWrap.innerHTML='<input type="text" id="scSearch" placeholder="Search..." style="width:140px;padding:7px 12px 7px 32px;border:1.5px solid #E2E8F0;border-radius:50px;font-size:.82rem;font-family:inherit;outline:none;transition:all .3s;background:#F8FAFC url(\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394A3B8%22 stroke-width=%222.5%22 stroke-linecap=%22round%22><circle cx=%2211%22 cy=%2211%22 r=%228%22/><line x1=%2221%22 y1=%2221%22 x2=%2216.65%22 y2=%2216.65%22/></svg>\') no-repeat 10px center"><div id="scResults" style="display:none;position:absolute;top:42px;right:0;width:320px;max-height:400px;overflow-y:auto;background:#fff;border:1px solid #E2E8F0;border-radius:12px;box-shadow:0 8px 30px rgba(10,22,40,.12);z-index:99999;padding:8px"></div>';
      navInner.appendChild(searchWrap);
      var pages=[
        {t:"Savings Calculator",u:"/savings-calculator/",k:"savings interest apy"},
        {t:"Budget Planner",u:"/budget-planner/",k:"budget 50 30 20 spending"},
        {t:"Debt Payoff Calculator",u:"/debt-payoff-calculator/",k:"debt payoff snowball"},
        {t:"Mortgage Calculator",u:"/mortgage-calculator/",k:"mortgage home loan"},
        {t:"Compound Interest",u:"/compound-interest-calculator/",k:"compound interest"},
        {t:"Retirement Calculator",u:"/retirement-calculator/",k:"retirement pension"},
        {t:"Investment Calculator",u:"/investment-calculator/",k:"investment stocks"},
        {t:"Credit Card Payoff",u:"/credit-card-payoff-calculator/",k:"credit card payoff"},
        {t:"401(k) Calculator",u:"/401k-calculator/",k:"401k employer match"},
        {t:"Roth IRA Calculator",u:"/roth-ira-calculator/",k:"roth ira tax free"},
        {t:"Inflation Calculator",u:"/inflation-calculator/",k:"inflation purchasing"},
        {t:"Loan Payoff",u:"/loan-payoff-calculator/",k:"loan payoff personal"},
        {t:"Paycheck Calculator",u:"/paycheck-calculator/",k:"paycheck take home"},
        {t:"CD Calculator",u:"/cd-calculator/",k:"cd certificate deposit"},
        {t:"Auto Loan Calculator",u:"/auto-loan-calculator/",k:"auto car loan"},
        {t:"Emergency Fund",u:"/emergency-fund-calculator/",k:"emergency fund"},
        {t:"Net Worth Calculator",u:"/net-worth-calculator/",k:"net worth assets"},
        {t:"Credit Card Quiz",u:"/credit-card-quiz/",k:"credit card best"},
        {t:"Financial Health",u:"/financial-health-score/",k:"financial health"},
        {t:"Banking",u:"/banking/",k:"bank checking savings"},
        {t:"Credit Cards",u:"/credit-cards/",k:"credit card compare"},
        {t:"Blog",u:"/blog/",k:"blog articles guides"},
        {t:"About",u:"/about/",k:"about mission"},
        {t:"Contact",u:"/contact/",k:"contact email"},
        {t:"FAQ",u:"/faq/",k:"faq questions"}
      ];
      var input=document.getElementById('scSearch');
      var results=document.getElementById('scResults');
      input.addEventListener('focus',function(){this.style.width='200px';this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,.1)';});
      input.addEventListener('blur',function(){var s=this;setTimeout(function(){s.style.width='140px';s.style.borderColor='#E2E8F0';s.style.boxShadow='none';results.style.display='none';},200);});
      input.addEventListener('input',function(){
        var q=this.value.toLowerCase().trim();
        if(q.length<2){results.style.display='none';return;}
        var m=pages.filter(function(p){return p.t.toLowerCase().indexOf(q)>-1||p.k.indexOf(q)>-1;});
        if(m.length===0){results.innerHTML='<div style="padding:16px;text-align:center;color:#94A3B8;font-size:.85rem">No results found</div>';}
        else{var h='';for(var j=0;j<Math.min(m.length,8);j++){h+='<a href="'+m[j].u+'" style="display:block;padding:10px 14px;color:#0F172A;text-decoration:none;border-radius:8px;font-size:.88rem;font-weight:500;transition:background .2s" onmouseover="this.style.background=\'#F0FDF4\'" onmouseout="this.style.background=\'transparent\'">'+m[j].t+'</a>';}results.innerHTML=h;}
        results.style.display='block';
      });
    }
  }

  /* 4. LANGUAGE TOGGLE — skip if exists */
  if(!document.getElementById('scLangBtn')){
    var nav=document.querySelector('nav .nav-inner');
    if(nav){
      var langBtn=document.createElement('div');
      langBtn.style.cssText='margin-left:8px;position:relative';
      langBtn.innerHTML='<button id="scLangBtn" style="background:transparent;border:1.5px solid #E2E8F0;border-radius:50px;padding:6px 14px;font-size:.8rem;font-weight:600;color:#475569;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;transition:all .3s" onclick="var m=document.getElementById(\'scLangMenu\');m.style.display=m.style.display===\'block\'?\'none\':\'block\';">\uD83C\uDF10 EN</button><div id="scLangMenu" style="display:none;position:absolute;top:40px;right:0;background:#fff;border:1px solid #E2E8F0;border-radius:12px;box-shadow:0 8px 24px rgba(10,22,40,.1);z-index:99999;overflow:hidden;min-width:160px"><a href="#" onclick="doTranslate(\'en\');return false;" class="scLO">\uD83C\uDDFA\uD83C\uDDF8 English</a><a href="#" onclick="doTranslate(\'es\');return false;" class="scLO">\uD83C\uDDEA\uD83C\uDDF8 Espa\u00F1ol</a><a href="#" onclick="doTranslate(\'fr\');return false;" class="scLO">\uD83C\uDDEB\uD83C\uDDF7 Fran\u00E7ais</a><a href="#" onclick="doTranslate(\'ar\');return false;" class="scLO">\uD83C\uDDF8\uD83C\uDDE6 \u0627\u0644\u0639\u0631\u0628\u064A\u0629</a><a href="#" onclick="doTranslate(\'zh-CN\');return false;" class="scLO">\uD83C\uDDE8\uD83C\uDDF3 \u4E2D\u6587</a><a href="#" onclick="doTranslate(\'hi\');return false;" class="scLO">\uD83C\uDDEE\uD83C\uDDF3 \u0939\u093F\u0928\u094D\u0926\u0940</a><a href="#" onclick="doTranslate(\'pt\');return false;" class="scLO">\uD83C\uDDE7\uD83C\uDDF7 Portugu\u00EAs</a><a href="#" onclick="doTranslate(\'ko\');return false;" class="scLO">\uD83C\uDDF0\uD83C\uDDF7 \uD55C\uAD6D\uC5B4</a><a href="#" onclick="doTranslate(\'ur\');return false;" class="scLO">\uD83C\uDDF5\uD83C\uDDF0 \u0627\u0631\u062F\u0648</a></div>';
      nav.appendChild(langBtn);
    }
  }
  window.doTranslate=function(lang){
    document.getElementById('scLangMenu').style.display='none';
    var btn=document.getElementById('scLangBtn');
    var labels={'en':'EN','es':'ES','fr':'FR','ar':'AR','zh-CN':'ZH','hi':'HI','pt':'PT','ko':'KO','ur':'UR'};
    if(lang==='en'){
      document.cookie='googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie='googtrans=;path=/;domain=.savingsclub.com;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      btn.innerHTML='\uD83C\uDF10 EN';location.reload();
    }else{
      document.cookie='googtrans=/en/'+lang+';path=/';
      document.cookie='googtrans=/en/'+lang+';path=/;domain=.savingsclub.com';
      btn.innerHTML='\uD83C\uDF10 '+(labels[lang]||lang.toUpperCase());
      if(!document.getElementById('gtScript')){
        var s=document.createElement('script');s.id='gtScript';
        s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
        document.body.appendChild(s);
        window.googleTranslateInit=function(){new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'gTransDiv');};
        var d=document.createElement('div');d.id='gTransDiv';d.style.display='none';document.body.appendChild(d);
      }else{location.reload();}
    }
  };

  /* 5. REBUILD MOBILE MENU — NerdWallet style, wordmark only */
  var oldMenu=document.getElementById('mobileMenu');
  if(oldMenu){
    var menuItems=[
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',text:'Home',link:'/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',text:'Calculators',link:'/savings-calculator/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',text:'Credit Cards',link:'/credit-cards/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>',text:'Blog',link:'/blog/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',text:'Banking',link:'/banking/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>',text:'Savings',link:'/savings-calculator/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',text:'Mortgage',link:'/mortgage-calculator/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',text:'Retirement',link:'/retirement-calculator/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',text:'Investing',link:'/investment-calculator/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',text:'Budget',link:'/budget-planner/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',text:'About Us',link:'/about/'},
      {icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',text:'Contact',link:'/contact/'}
    ];

    oldMenu.innerHTML='';
    oldMenu.style.cssText='display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:#fff;z-index:9998;overflow-y:auto;-webkit-overflow-scrolling:touch';

    /* Header — wordmark only, no icon */
    var header=document.createElement('div');
    header.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #E2E8F0';
    header.innerHTML='<span style="font-family:var(--font-head,\'Plus Jakarta Sans\',sans-serif);font-weight:800;font-size:1.3rem;color:#10B981;letter-spacing:-.01em">SavingsClub</span><button onclick="closeMobileMenu()" style="background:none;border:none;font-size:24px;color:#475569;cursor:pointer;padding:8px;line-height:1">&times;</button>';
    oldMenu.appendChild(header);

    /* Search */
    var searchDiv=document.createElement('div');
    searchDiv.style.cssText='padding:16px 24px';
    searchDiv.innerHTML='<input type="text" placeholder="Search calculators, guides..." style="width:100%;padding:12px 16px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:.95rem;font-family:inherit;outline:none;background:#F8FAFC;transition:border-color .3s" onfocus="this.style.borderColor=\'#059669\'" onblur="this.style.borderColor=\'#E2E8F0\'">';
    oldMenu.appendChild(searchDiv);

    /* Menu items */
    for(var i=0;i<menuItems.length;i++){
      var item=document.createElement('a');
      item.href=menuItems[i].link;
      item.style.cssText='display:flex;align-items:center;gap:16px;padding:18px 24px;color:#0F172A;text-decoration:none;font-family:var(--font-head);font-weight:600;font-size:1.05rem;border-bottom:1px solid #F1F5F9;transition:background .15s';
      item.innerHTML='<span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:#F0FDF4;border-radius:10px;flex-shrink:0">'+menuItems[i].icon+'</span>'+menuItems[i].text+'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="2" style="margin-left:auto"><polyline points="9 18 15 12 9 6"/></svg>';
      item.addEventListener('click',function(){closeMobileMenu();});
      item.onmouseover=function(){this.style.background='#F8FAFC';};
      item.onmouseout=function(){this.style.background='transparent';};
      oldMenu.appendChild(item);
    }

    /* Disclaimer at bottom */
    var discDiv=document.createElement('div');
    discDiv.style.cssText='padding:20px 24px;background:#F8FAFC;margin-top:8px';
    discDiv.innerHTML='<p style="font-size:.72rem;color:#94A3B8;line-height:1.6">SavingsClub provides educational content only. We are not licensed financial advisors, tax professionals, or legal professionals. <a href="/disclaimer/" style="color:#059669;font-weight:600">Read disclaimer</a></p>';
    oldMenu.appendChild(discDiv);
  }

  /* Override toggle functions */
  window.toggleMobile=function(){
    var m=document.getElementById('mobileMenu');
    if(!m)return;
    if(m.style.display==='block'){closeMobileMenu();}
    else{m.style.display='block';document.body.style.overflow='hidden';}
  };
  window.closeMobileMenu=function(){
    var m=document.getElementById('mobileMenu');
    if(!m)return;
    m.style.display='none';
    document.body.style.overflow='';
  };

  /* 6. DISCLAIMER IN FOOTER */
  var footerBottom=document.querySelector('.footer-bottom');
  if(footerBottom&&!document.getElementById('scFooterDisclaimer')){
    var disc=document.createElement('div');
    disc.id='scFooterDisclaimer';
    disc.style.cssText='border-top:1px solid rgba(255,255,255,.08);padding-top:20px;margin-bottom:20px';
    disc.innerHTML='<p style="font-size:.78rem;color:rgba(255,255,255,.35);line-height:1.7;max-width:900px"><strong style="color:rgba(255,255,255,.5)">Important Disclaimer:</strong> SavingsClub provides free financial calculators and educational content for informational purposes only. We are not licensed financial advisors, tax professionals, investment advisors, or legal professionals. The information on this website should not be considered as professional financial advice. All financial decisions should be made after consulting with qualified licensed professionals. Calculator results are estimates. Past performance does not guarantee future results. <a href="/disclaimer/" style="color:rgba(255,255,255,.45)">Read full disclaimer</a></p>';
    footerBottom.parentNode.insertBefore(disc,footerBottom);
  }

  /* 7. REMOVE TOP DISCLAIMER */
  var topDisc=document.getElementById('scDisclaimer');
  if(topDisc)topDisc.remove();

  /* 8. GLOBAL STYLES */
  var style=document.createElement('style');
  style.textContent='.goog-te-banner-frame{display:none!important}.skiptranslate{display:none!important}body{top:0!important}#scSearch:focus{width:200px!important;border-color:#059669!important}.scLO{display:block;padding:10px 16px;color:#0F172A;text-decoration:none;font-size:.85rem;font-weight:500;border-bottom:1px solid #F1F5F9;transition:background .15s}.scLO:hover{background:#F0FDF4!important}.scLO:last-child{border-bottom:none}@media(max-width:768px){#scSearch{display:none!important}#scLangBtn{padding:5px 10px!important;font-size:.75rem!important}}';
  document.head.appendChild(style);

})();
