/* SavingsClub - Global Site Enhancements v2 */
(function(){

  /* 1. REPLACE OLD SVG LOGO WITH NEW SC ICON */
  var marks=document.querySelectorAll('.logo-mark');
  for(var i=0;i<marks.length;i++){
    var img=document.createElement('img');
    var path=window.location.pathname;
    var depth=path.split('/').filter(function(x){return x.length>0}).length;
    var prefix='';
    if(depth===1)prefix='../';
    if(depth===2)prefix='../../';
    if(depth>=3)prefix='../../../';
    if(path==='/'||path==='/index.html')prefix='';
    img.src=prefix+'img/sc-icon.png';
    img.alt='SavingsClub';
    img.style.cssText='height:34px;width:34px;vertical-align:middle;background:transparent;border:none;mix-blend-mode:multiply';
    marks[i].parentNode.replaceChild(img,marks[i]);
  }

  /* 2. REMOVE ABOUT & FAQ FROM TOP NAV */
  var navLinks=document.querySelectorAll('.nav-links a, #navLinks a');
  for(var i=navLinks.length-1;i>=0;i--){
    var txt=navLinks[i].textContent.trim();
    if(txt==='About'||txt==='FAQ'){navLinks[i].remove();}
  }
  var mobileLinks=document.querySelectorAll('.mobile-menu a, #mobileMenu a');
  for(var i=mobileLinks.length-1;i>=0;i--){
    var txt=mobileLinks[i].textContent.trim();
    if(txt==='About'||txt==='FAQ'){mobileLinks[i].remove();}
  }

  /* 3. ADD SEARCH BAR — only if not already present */
  if(!document.getElementById('scSearch')){
    var navInner=document.querySelector('.nav-links');
    if(navInner){
      var searchWrap=document.createElement('div');
      searchWrap.style.cssText='position:relative;margin-left:8px';
      searchWrap.innerHTML='<input type="text" id="scSearch" placeholder="Search..." style="width:140px;padding:7px 12px 7px 32px;border:1.5px solid #E2E8F0;border-radius:50px;font-size:.82rem;font-family:inherit;outline:none;transition:all .3s;background:#F8FAFC url(\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394A3B8%22 stroke-width=%222.5%22 stroke-linecap=%22round%22><circle cx=%2211%22 cy=%2211%22 r=%228%22/><line x1=%2221%22 y1=%2221%22 x2=%2216.65%22 y2=%2216.65%22/></svg>\') no-repeat 10px center"><div id="scResults" style="display:none;position:absolute;top:42px;right:0;width:320px;max-height:400px;overflow-y:auto;background:#fff;border:1px solid #E2E8F0;border-radius:12px;box-shadow:0 8px 30px rgba(10,22,40,.12);z-index:99999;padding:8px"></div>';
      navInner.appendChild(searchWrap);

      var pages=[
        {t:"Savings Calculator",u:"/savings-calculator/",k:"savings interest apy compound"},
        {t:"Budget Planner",u:"/budget-planner/",k:"budget 50 30 20 spending income"},
        {t:"Debt Payoff Calculator",u:"/debt-payoff-calculator/",k:"debt payoff snowball avalanche"},
        {t:"Mortgage Calculator",u:"/mortgage-calculator/",k:"mortgage home loan payment house"},
        {t:"Compound Interest",u:"/compound-interest-calculator/",k:"compound interest growth"},
        {t:"Retirement Calculator",u:"/retirement-calculator/",k:"retirement pension social security"},
        {t:"Investment Calculator",u:"/investment-calculator/",k:"investment stocks bonds portfolio"},
        {t:"Credit Card Payoff",u:"/credit-card-payoff-calculator/",k:"credit card payoff balance"},
        {t:"401(k) Calculator",u:"/401k-calculator/",k:"401k employer match contribution"},
        {t:"Roth IRA Calculator",u:"/roth-ira-calculator/",k:"roth ira traditional tax free"},
        {t:"Inflation Calculator",u:"/inflation-calculator/",k:"inflation purchasing power cpi"},
        {t:"Loan Payoff Calculator",u:"/loan-payoff-calculator/",k:"loan payoff personal student"},
        {t:"Paycheck Calculator",u:"/paycheck-calculator/",k:"paycheck take home salary tax"},
        {t:"CD Calculator",u:"/cd-calculator/",k:"cd certificate deposit apy term"},
        {t:"Auto Loan Calculator",u:"/auto-loan-calculator/",k:"auto car loan payment rate"},
        {t:"Emergency Fund",u:"/emergency-fund-calculator/",k:"emergency fund savings months"},
        {t:"Net Worth Calculator",u:"/net-worth-calculator/",k:"net worth assets liabilities"},
        {t:"Credit Card Quiz",u:"/credit-card-quiz/",k:"credit card best rewards cash back"},
        {t:"Financial Health Score",u:"/financial-health-score/",k:"financial health score checkup"},
        {t:"Banking Options",u:"/banking/",k:"bank checking savings account"},
        {t:"Credit Cards",u:"/credit-cards/",k:"credit card compare rewards"},
        {t:"Blog",u:"/blog/",k:"blog articles guides tips money"},
        {t:"About Us",u:"/about/",k:"about mission team"},
        {t:"Contact",u:"/contact/",k:"contact email support"},
        {t:"FAQ",u:"/faq/",k:"faq questions answers"},
        {t:"Disclaimer",u:"/disclaimer/",k:"disclaimer affiliate"}
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

  /* 4. ADD LANGUAGE TOGGLE — only if not already present */
  if(!document.getElementById('scLangBtn')){
    var nav=document.querySelector('nav .nav-inner');
    if(nav){
      var langBtn=document.createElement('div');
      langBtn.style.cssText='margin-left:8px;position:relative';
      langBtn.innerHTML='<button id="scLangBtn" style="background:transparent;border:1.5px solid #E2E8F0;border-radius:50px;padding:6px 14px;font-size:.8rem;font-weight:600;color:#475569;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;transition:all .3s" onclick="var m=document.getElementById(\'scLangMenu\');m.style.display=m.style.display===\'block\'?\'none\':\'block\';">\uD83C\uDF10 EN</button><div id="scLangMenu" style="display:none;position:absolute;top:40px;right:0;background:#fff;border:1px solid #E2E8F0;border-radius:12px;box-shadow:0 8px 24px rgba(10,22,40,.1);z-index:99999;overflow:hidden;min-width:160px"><a href="#" onclick="doTranslate(\'en\');return false;" class="scLangOpt" style="border-bottom:1px solid #F1F5F9">\uD83C\uDDFA\uD83C\uDDF8 English</a><a href="#" onclick="doTranslate(\'es\');return false;" class="scLangOpt" style="border-bottom:1px solid #F1F5F9">\uD83C\uDDEA\uD83C\uDDF8 Espa\u00F1ol</a><a href="#" onclick="doTranslate(\'fr\');return false;" class="scLangOpt" style="border-bottom:1px solid #F1F5F9">\uD83C\uDDEB\uD83C\uDDF7 Fran\u00E7ais</a><a href="#" onclick="doTranslate(\'ar\');return false;" class="scLangOpt" style="border-bottom:1px solid #F1F5F9">\uD83C\uDDF8\uD83C\uDDE6 \u0627\u0644\u0639\u0631\u0628\u064A\u0629</a><a href="#" onclick="doTranslate(\'zh-CN\');return false;" class="scLangOpt" style="border-bottom:1px solid #F1F5F9">\uD83C\uDDE8\uD83C\uDDF3 \u4E2D\u6587</a><a href="#" onclick="doTranslate(\'hi\');return false;" class="scLangOpt" style="border-bottom:1px solid #F1F5F9">\uD83C\uDDEE\uD83C\uDDF3 \u0939\u093F\u0928\u094D\u0926\u0940</a><a href="#" onclick="doTranslate(\'pt\');return false;" class="scLangOpt" style="border-bottom:1px solid #F1F5F9">\uD83C\uDDE7\uD83C\uDDF7 Portugu\u00EAs</a><a href="#" onclick="doTranslate(\'ko\');return false;" class="scLangOpt" style="border-bottom:1px solid #F1F5F9">\uD83C\uDDF0\uD83C\uDDF7 \uD55C\uAD6D\uC5B4</a><a href="#" onclick="doTranslate(\'ur\');return false;" class="scLangOpt">\uD83C\uDDF5\uD83C\uDDF0 \u0627\u0631\u062F\u0648</a></div>';
      nav.appendChild(langBtn);
    }
  }

  /* Google Translate */
  window.doTranslate=function(lang){
    document.getElementById('scLangMenu').style.display='none';
    var btn=document.getElementById('scLangBtn');
    var labels={'en':'EN','es':'ES','fr':'FR','ar':'AR','zh-CN':'ZH','hi':'HI','pt':'PT','ko':'KO','ur':'UR'};
    if(lang==='en'){
      document.cookie='googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie='googtrans=;path=/;domain=.savingsclub.com;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      btn.innerHTML='\uD83C\uDF10 EN';
      location.reload();
    }else{
      document.cookie='googtrans=/en/'+lang+';path=/';
      document.cookie='googtrans=/en/'+lang+';path=/;domain=.savingsclub.com';
      btn.innerHTML='\uD83C\uDF10 '+(labels[lang]||lang.toUpperCase());
      if(!document.getElementById('gtScript')){
        var s=document.createElement('script');
        s.id='gtScript';
        s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
        document.body.appendChild(s);
        window.googleTranslateInit=function(){new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'gTransDiv');};
        var d=document.createElement('div');d.id='gTransDiv';d.style.display='none';document.body.appendChild(d);
      }else{location.reload();}
    }
  };

  /* 5. UPGRADE MOBILE MENU */
  var oldMenu=document.getElementById('mobileMenu');
  if(oldMenu){
    oldMenu.style.cssText='display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,22,40,.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);z-index:9998;padding:100px 32px 40px;flex-direction:column;gap:8px;overflow-y:auto;transition:opacity .3s,transform .3s;opacity:0;transform:translateX(100%)';
    oldMenu.className='mobile-menu';
    /* Style each link */
    var mLinks=oldMenu.querySelectorAll('a');
    for(var i=0;i<mLinks.length;i++){
      mLinks[i].style.cssText='display:block;padding:18px 20px;color:#fff;font-family:var(--font-head);font-weight:600;font-size:1.15rem;border-radius:12px;text-decoration:none;transition:all .2s;border-left:3px solid transparent';
    }
    /* Add close button */
    if(!oldMenu.querySelector('.sc-close')){
      var closeBtn=document.createElement('div');
      closeBtn.className='sc-close';
      closeBtn.innerHTML='<span style="font-size:28px;color:#fff;cursor:pointer;position:absolute;top:28px;right:28px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,.1);transition:background .2s" onclick="closeMobileMenu()" onmouseover="this.style.background=\'rgba(255,255,255,.2)\'" onmouseout="this.style.background=\'rgba(255,255,255,.1)\'">&times;</span>';
      oldMenu.insertBefore(closeBtn,oldMenu.firstChild);
    }
    /* Add search to mobile menu */
    if(!oldMenu.querySelector('#scMobileSearch')){
      var mSearch=document.createElement('div');
      mSearch.style.cssText='margin-bottom:16px';
      mSearch.innerHTML='<input type="text" id="scMobileSearch" placeholder="Search calculators, guides..." style="width:100%;padding:14px 18px;border:1.5px solid rgba(255,255,255,.15);border-radius:12px;font-size:1rem;font-family:inherit;outline:none;background:rgba(255,255,255,.05);color:#fff;transition:border-color .3s" onfocus="this.style.borderColor=\'#34D399\'" onblur="this.style.borderColor=\'rgba(255,255,255,.15)\'">';
      oldMenu.insertBefore(mSearch,oldMenu.children[1]);
    }
    /* Add brand to mobile menu */
    if(!oldMenu.querySelector('.sc-mobile-brand')){
      var brand=document.createElement('div');
      brand.className='sc-mobile-brand';
      brand.style.cssText='margin-bottom:24px;font-family:var(--font-head);font-weight:800;font-size:1.3rem;color:#fff;display:flex;align-items:center;gap:10px';
      brand.innerHTML='<img src="/img/sc-icon.png" alt="SC" style="height:32px;width:32px;mix-blend-mode:screen"> SavingsClub';
      oldMenu.insertBefore(brand,oldMenu.children[1]);
    }
  }

  /* Override toggleMobile function */
  window.toggleMobile=function(){
    var m=document.getElementById('mobileMenu');
    if(!m)return;
    if(m.style.display==='flex'){
      closeMobileMenu();
    }else{
      m.style.display='flex';
      setTimeout(function(){m.style.opacity='1';m.style.transform='translateX(0)';},10);
      document.body.style.overflow='hidden';
    }
  };
  window.closeMobileMenu=function(){
    var m=document.getElementById('mobileMenu');
    if(!m)return;
    m.style.opacity='0';
    m.style.transform='translateX(100%)';
    setTimeout(function(){m.style.display='none';},300);
    document.body.style.overflow='';
  };
  /* Close menu when clicking a link */
  if(oldMenu){
    var allLinks=oldMenu.querySelectorAll('a');
    for(var i=0;i<allLinks.length;i++){
      allLinks[i].addEventListener('click',function(){closeMobileMenu();});
    }
  }

  /* 6. ADD DISCLAIMER TO FOOTER — only if not already present */
  var footerBottom=document.querySelector('.footer-bottom');
  if(footerBottom && !document.getElementById('scFooterDisclaimer')){
    var disc=document.createElement('div');
    disc.id='scFooterDisclaimer';
    disc.style.cssText='border-top:1px solid rgba(255,255,255,.08);padding-top:20px;margin-bottom:20px';
    disc.innerHTML='<p style="font-size:.78rem;color:rgba(255,255,255,.35);line-height:1.7;max-width:900px"><strong style="color:rgba(255,255,255,.5)">Important Disclaimer:</strong> SavingsClub provides free financial calculators and educational content for informational purposes only. We are not licensed financial advisors, tax professionals, investment advisors, or legal professionals. The information on this website should not be considered as professional financial advice, tax advice, investment advice, or legal advice. All financial decisions should be made after consulting with qualified licensed professionals. Calculator results are estimates and may not reflect actual outcomes. Past performance does not guarantee future results. <a href="/disclaimer/" style="color:rgba(255,255,255,.45)">Read full disclaimer</a></p>';
    footerBottom.parentNode.insertBefore(disc,footerBottom);
  }

  /* 7. REMOVE TOP DISCLAIMER IF EXISTS */
  var topDisc=document.getElementById('scDisclaimer');
  if(topDisc)topDisc.remove();

  /* 8. GLOBAL STYLES */
  var style=document.createElement('style');
  style.textContent='.goog-te-banner-frame{display:none!important}.skiptranslate{display:none!important}body{top:0!important}#scSearch:focus{width:200px!important;border-color:#059669!important}.scLangOpt{display:block;padding:10px 16px;color:#0F172A;text-decoration:none;font-size:.85rem;font-weight:500;transition:background .15s}.scLangOpt:hover{background:#F0FDF4!important}@media(max-width:768px){#scSearch{display:none!important}#scLangBtn{padding:5px 10px!important;font-size:.75rem!important}.mobile-menu.open{display:flex!important;opacity:1!important;transform:translateX(0)!important}.mobile-menu a:hover{background:rgba(255,255,255,.08)!important;border-left-color:#34D399!important}}';
  document.head.appendChild(style);

})();
