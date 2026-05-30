/* SavingsClub - Global Site Enhancements */
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
  for(var i=0;i<navLinks.length;i++){
    var txt=navLinks[i].textContent.trim();
    if(txt==='About'||txt==='FAQ'){
      navLinks[i].remove();
    }
  }
  /* Also remove from mobile menu */
  var mobileLinks=document.querySelectorAll('.mobile-menu a, #mobileMenu a');
  for(var i=0;i<mobileLinks.length;i++){
    var txt=mobileLinks[i].textContent.trim();
    if(txt==='About'||txt==='FAQ'){
      mobileLinks[i].remove();
    }
  }

  /* 3. ADD SEARCH BAR TO NAV */
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
      {t:"Compound Interest Calculator",u:"/compound-interest-calculator/",k:"compound interest growth investment"},
      {t:"Retirement Calculator",u:"/retirement-calculator/",k:"retirement 401k pension social security"},
      {t:"Investment Calculator",u:"/investment-calculator/",k:"investment stocks bonds portfolio"},
      {t:"Credit Card Payoff",u:"/credit-card-payoff-calculator/",k:"credit card payoff balance minimum"},
      {t:"401(k) Calculator",u:"/401k-calculator/",k:"401k employer match contribution retirement"},
      {t:"Roth IRA Calculator",u:"/roth-ira-calculator/",k:"roth ira traditional tax free"},
      {t:"Inflation Calculator",u:"/inflation-calculator/",k:"inflation purchasing power cpi"},
      {t:"Loan Payoff Calculator",u:"/loan-payoff-calculator/",k:"loan payoff personal student auto"},
      {t:"Paycheck Calculator",u:"/paycheck-calculator/",k:"paycheck take home salary tax withholding"},
      {t:"CD Calculator",u:"/cd-calculator/",k:"cd certificate deposit apy term"},
      {t:"Auto Loan Calculator",u:"/auto-loan-calculator/",k:"auto car loan payment rate"},
      {t:"Emergency Fund Calculator",u:"/emergency-fund-calculator/",k:"emergency fund savings months expenses"},
      {t:"Net Worth Calculator",u:"/net-worth-calculator/",k:"net worth assets liabilities wealth"},
      {t:"Credit Card Quiz",u:"/credit-card-quiz/",k:"credit card best rewards cash back"},
      {t:"Financial Health Score",u:"/financial-health-score/",k:"financial health score checkup wellness"},
      {t:"Banking Comparisons",u:"/banking/",k:"bank checking savings account compare"},
      {t:"Credit Card Comparisons",u:"/credit-cards/",k:"credit card compare rewards cash back travel"},
      {t:"Blog",u:"/blog/",k:"blog articles guides tips money"},
      {t:"About SavingsClub",u:"/about/",k:"about us mission team"},
      {t:"Contact Us",u:"/contact/",k:"contact email support help"},
      {t:"FAQ",u:"/faq/",k:"faq questions answers help"},
      {t:"Privacy Policy",u:"/privacy-policy/",k:"privacy policy data"},
      {t:"Terms of Service",u:"/terms-of-service/",k:"terms service conditions"},
      {t:"Disclaimer",u:"/disclaimer/",k:"disclaimer affiliate disclosure"}
    ];

    var input=document.getElementById('scSearch');
    var results=document.getElementById('scResults');
    input.addEventListener('focus',function(){this.style.width='200px';this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,.1)';});
    input.addEventListener('blur',function(){var self=this;setTimeout(function(){self.style.width='140px';self.style.borderColor='#E2E8F0';self.style.boxShadow='none';results.style.display='none';},200);});
    input.addEventListener('input',function(){
      var q=this.value.toLowerCase().trim();
      if(q.length<2){results.style.display='none';return;}
      var matches=pages.filter(function(p){return p.t.toLowerCase().indexOf(q)>-1||p.k.indexOf(q)>-1;});
      if(matches.length===0){
        results.innerHTML='<div style="padding:16px;text-align:center;color:#94A3B8;font-size:.85rem">No results found</div>';
      }else{
        var html='';
        for(var j=0;j<Math.min(matches.length,8);j++){
          html+='<a href="'+matches[j].u+'" style="display:block;padding:10px 14px;color:#0F172A;text-decoration:none;border-radius:8px;font-size:.88rem;font-weight:500;transition:background .2s" onmouseover="this.style.background=\'#F0FDF4\'" onmouseout="this.style.background=\'transparent\'">'+matches[j].t+'</a>';
        }
        results.innerHTML=html;
      }
      results.style.display='block';
    });
  }

  /* 4. ADD GOOGLE TRANSLATE WIDGET */
  var nav=document.querySelector('nav .nav-inner');
  if(nav){
    var langBtn=document.createElement('div');
    langBtn.style.cssText='margin-left:8px;position:relative';
    langBtn.innerHTML='<button id="scLangBtn" style="background:transparent;border:1.5px solid #E2E8F0;border-radius:50px;padding:6px 14px;font-size:.8rem;font-weight:600;color:#475569;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;transition:all .3s" onclick="document.getElementById(\'scLangMenu\').style.display=document.getElementById(\'scLangMenu\').style.display===\'block\'?\'none\':\'block\';">\uD83C\uDF10 EN</button><div id="scLangMenu" style="display:none;position:absolute;top:40px;right:0;background:#fff;border:1px solid #E2E8F0;border-radius:10px;box-shadow:0 8px 24px rgba(10,22,40,.1);z-index:99999;overflow:hidden;min-width:140px"><a href="#" onclick="doTranslate(\'en\');return false;" style="display:block;padding:10px 16px;color:#0F172A;text-decoration:none;font-size:.85rem;font-weight:500;border-bottom:1px solid #F1F5F9" onmouseover="this.style.background=\'#F0FDF4\'" onmouseout="this.style.background=\'transparent\'">\uD83C\uDDFA\uD83C\uDDF8 English</a><a href="#" onclick="doTranslate(\'es\');return false;" style="display:block;padding:10px 16px;color:#0F172A;text-decoration:none;font-size:.85rem;font-weight:500" onmouseover="this.style.background=\'#F0FDF4\'" onmouseout="this.style.background=\'transparent\'">\uD83C\uDDEA\uD83C\uDDF8 Espa\u00F1ol</a></div>';
    nav.appendChild(langBtn);
  }

  /* Google Translate init */
  window.doTranslate=function(lang){
    document.getElementById('scLangMenu').style.display='none';
    var btn=document.getElementById('scLangBtn');
    if(lang==='en'){
      /* Remove translation */
      var frame=document.querySelector('.goog-te-banner-frame');
      if(frame)frame.remove();
      document.body.style.top='';
      document.cookie='googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie='googtrans=;path=/;domain=.savingsclub.com;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      btn.innerHTML='\uD83C\uDF10 EN';
      location.reload();
    }else{
      document.cookie='googtrans=/en/'+lang+';path=/';
      document.cookie='googtrans=/en/'+lang+';path=/;domain=.savingsclub.com';
      btn.innerHTML='\uD83C\uDF10 ES';
      if(!document.getElementById('gtScript')){
        var s=document.createElement('script');
        s.id='gtScript';
        s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
        document.body.appendChild(s);
        window.googleTranslateInit=function(){
          new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'gTransDiv');
        };
        var d=document.createElement('div');
        d.id='gTransDiv';
        d.style.display='none';
        document.body.appendChild(d);
      }else{
        location.reload();
      }
    }
  };

  /* 5. ADD DISCLAIMER TO FOOTER ON EVERY PAGE */
  var footerBottom=document.querySelector('.footer-bottom');
  if(footerBottom && !document.getElementById('scFooterDisclaimer')){
    var disc=document.createElement('div');
    disc.id='scFooterDisclaimer';
    disc.style.cssText='border-top:1px solid rgba(255,255,255,.08);padding-top:20px;margin-bottom:20px';
    disc.innerHTML='<p style="font-size:.78rem;color:rgba(255,255,255,.35);line-height:1.7;max-width:900px"><strong style="color:rgba(255,255,255,.5)">Important Disclaimer:</strong> SavingsClub provides free financial calculators and educational content for informational purposes only. We are not licensed financial advisors, tax professionals, investment advisors, or legal professionals. The information on this website should not be considered as professional financial advice, tax advice, investment advice, or legal advice. All financial decisions should be made after consulting with qualified licensed professionals. Calculator results are estimates and may not reflect actual outcomes. SavingsClub does not guarantee the accuracy, completeness, or reliability of any information provided. By using this website, you acknowledge that you are making financial decisions at your own risk. Past performance of investments does not guarantee future results. <a href="/disclaimer/" style="color:rgba(255,255,255,.45)">Read full disclaimer</a></p>';
    footerBottom.parentNode.insertBefore(disc,footerBottom);
  }

  /* 6. REMOVE ANY TOP DISCLAIMER BANNER */
  var topDisc=document.getElementById('scDisclaimer');
  if(topDisc)topDisc.remove();

  /* 7. HIDE GOOGLE TRANSLATE BAR */
  var style=document.createElement('style');
  style.textContent='.goog-te-banner-frame{display:none!important}.skiptranslate{display:none!important}body{top:0!important}#scSearch:focus{width:200px!important;border-color:#059669!important}@media(max-width:768px){#scSearch{display:none!important}#scLangBtn{padding:5px 10px!important;font-size:.75rem!important}}';
  document.head.appendChild(style);

})();
