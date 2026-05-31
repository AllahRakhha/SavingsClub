/* SavingsClub - Social Share Buttons v1
   - Desktop: floating left sidebar (>=1200px viewport)
   - Mobile: horizontal row at bottom of content
   - Pages: calculator pages + blog posts (skips homepage, legal, contact, etc.) */
(function(){

  var path=window.location.pathname.toLowerCase();

  /* ============================================================
     PAGE ELIGIBILITY — only show on calculators and blog posts
     ============================================================ */
  var allowedPaths=[
    'savings-calculator','budget-planner','debt-payoff-calculator',
    'compound-interest-calculator','retirement-calculator','investment-calculator',
    'mortgage-calculator','auto-loan-calculator','net-worth-calculator',
    'emergency-fund-calculator','credit-card-payoff-calculator','401k-calculator',
    'roth-ira-calculator','inflation-calculator','loan-payoff-calculator',
    'paycheck-calculator','cd-calculator','financial-health-score','credit-card-quiz'
  ];
  var blockedPaths=[
    '/about','/contact','/faq','/privacy','/terms','/cookie','/disclaimer','/banking','/credit-cards'
  ];

  /* Check if page is allowed */
  var isAllowed=false;
  /* Allow calculator/quiz pages */
  for(var i=0;i<allowedPaths.length;i++){
    if(path.indexOf('/'+allowedPaths[i])>-1){isAllowed=true;break;}
  }
  /* Allow blog posts (any /blog/something/ but NOT just /blog/) */
  if(!isAllowed && path.indexOf('/blog/')>-1 && path!=='/blog/' && path!=='/blog'){
    isAllowed=true;
  }
  /* Block certain paths */
  for(var i=0;i<blockedPaths.length;i++){
    if(path.indexOf(blockedPaths[i])===0){isAllowed=false;break;}
  }
  /* Block homepage */
  if(path==='/' || path==='/index.html')isAllowed=false;

  if(!isAllowed)return;

  /* ============================================================
     PLATFORM CONFIG
     ============================================================ */
  var pageUrl=encodeURIComponent(window.location.href);
  var pageTitle=encodeURIComponent(document.title||'SavingsClub');
  var pageText=encodeURIComponent('Check out this free financial tool from SavingsClub:');

  var platforms=[
    {
      name:'Facebook',
      color:'#1877F2',
      url:'https://www.facebook.com/sharer/sharer.php?u='+pageUrl,
      svg:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    },
    {
      name:'X (Twitter)',
      color:'#000000',
      url:'https://twitter.com/intent/tweet?url='+pageUrl+'&text='+pageTitle,
      svg:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
    },
    {
      name:'Pinterest',
      color:'#E60023',
      url:'https://pinterest.com/pin/create/button/?url='+pageUrl+'&description='+pageTitle,
      svg:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/></svg>'
    },
    {
      name:'LinkedIn',
      color:'#0A66C2',
      url:'https://www.linkedin.com/sharing/share-offsite/?url='+pageUrl,
      svg:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
    },
    {
      name:'WhatsApp',
      color:'#25D366',
      url:'https://api.whatsapp.com/send?text='+pageText+'%20'+pageUrl,
      svg:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
    },
    {
      name:'Email',
      color:'#475569',
      url:'mailto:?subject='+pageTitle+'&body='+pageText+'%20'+pageUrl,
      svg:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
    },
    {
      name:'Copy Link',
      color:'#10B981',
      url:'#',
      isCopy:true,
      svg:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
    }
  ];

  /* ============================================================
     STYLES
     ============================================================ */
  var s=document.createElement('style');
  s.textContent=
    /* Floating desktop sidebar */
    '#sc-share-desktop{position:fixed;left:18px;top:50%;transform:translateY(-50%);z-index:9990;display:flex;flex-direction:column;gap:10px;padding:14px 8px;background:#fff;border-radius:50px;box-shadow:0 8px 24px rgba(10,22,40,.1),0 0 0 1px rgba(10,22,40,.04)}'+
    '#sc-share-desktop .sc-share-label{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:.62rem;font-weight:800;color:#94A3B8;letter-spacing:.1em;text-transform:uppercase;writing-mode:vertical-rl;transform:rotate(180deg);text-align:center;padding:4px 0;margin-bottom:2px}'+
    '.sc-share-btn{width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;transition:transform .2s,box-shadow .2s;text-decoration:none;padding:0;font-family:inherit}'+
    '.sc-share-btn:hover{transform:scale(1.12);box-shadow:0 4px 12px rgba(0,0,0,.2)}'+
    '.sc-share-btn:active{transform:scale(.95)}'+
    /* Mobile bottom row */
    '#sc-share-mobile{display:none;max-width:1100px;margin:30px auto;padding:24px 18px;background:#fff;border-radius:20px;border:1px solid #E2E8F0;text-align:center}'+
    '#sc-share-mobile .sc-share-mobile-label{font-family:var(--font-head,"Plus Jakarta Sans",sans-serif);font-size:.85rem;font-weight:700;color:#0F172A;margin:0 0 14px}'+
    '#sc-share-mobile .sc-share-row{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}'+
    '#sc-share-mobile .sc-share-btn{width:46px;height:46px}'+
    /* Copy-link tooltip */
    '.sc-copy-toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#0F172A;color:#fff;padding:12px 22px;border-radius:50px;font-family:var(--font-body,"DM Sans",sans-serif);font-size:.9rem;font-weight:600;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,.2);opacity:0;transition:opacity .25s,transform .25s;pointer-events:none}'+
    '.sc-copy-toast.show{opacity:1;transform:translateX(-50%) translateY(-4px)}'+
    /* Show desktop floating bar only on wide screens */
    '@media(max-width:1199px){#sc-share-desktop{display:none!important}#sc-share-mobile{display:block!important}}'+
    '@media(max-width:768px){#sc-share-mobile{margin:24px 14px;padding:20px 16px}#sc-share-mobile .sc-share-row{gap:8px}#sc-share-mobile .sc-share-btn{width:44px;height:44px}}';
  document.head.appendChild(s);

  /* ============================================================
     BUILD HTML
     ============================================================ */
  function btnHTML(p,opts){
    opts=opts||{};
    var styleExtra=opts.styleExtra||'';
    var aria=' aria-label="Share on '+p.name+'" title="'+p.name+'"';
    if(p.isCopy){
      return '<button class="sc-share-btn sc-copy-btn" style="background:'+p.color+';'+styleExtra+'"'+aria+'>'+p.svg+'</button>';
    }
    return '<a href="'+p.url+'" target="_blank" rel="noopener noreferrer" class="sc-share-btn" style="background:'+p.color+';'+styleExtra+'"'+aria+'>'+p.svg+'</a>';
  }

  /* Desktop floating sidebar */
  var dt=document.createElement('div');
  dt.id='sc-share-desktop';
  var dtHTML='<div class="sc-share-label">Share</div>';
  for(var i=0;i<platforms.length;i++){dtHTML+=btnHTML(platforms[i]);}
  dt.innerHTML=dtHTML;
  document.body.appendChild(dt);

  /* Mobile bottom row */
  var mb=document.createElement('div');
  mb.id='sc-share-mobile';
  var mbHTML='<p class="sc-share-mobile-label">Share this page</p><div class="sc-share-row">';
  for(var i=0;i<platforms.length;i++){mbHTML+=btnHTML(platforms[i]);}
  mbHTML+='</div>';
  mb.innerHTML=mbHTML;

  /* Insert mobile share row before footer */
  function placeMobile(){
    var footer=document.querySelector('footer');
    if(footer && footer.parentNode){footer.parentNode.insertBefore(mb,footer);}
    else{document.body.appendChild(mb);}
  }
  if(document.readyState==='complete'){placeMobile();}
  else{window.addEventListener('load',placeMobile);}

  /* ============================================================
     COPY LINK HANDLER + TOAST
     ============================================================ */
  function showToast(msg){
    var t=document.getElementById('sc-copy-toast');
    if(!t){
      t=document.createElement('div');
      t.id='sc-copy-toast';
      t.className='sc-copy-toast';
      document.body.appendChild(t);
    }
    t.textContent=msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer=setTimeout(function(){t.classList.remove('show');},2000);
  }
  function copyLink(){
    var url=window.location.href;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(function(){showToast('Link copied!');},function(){fallbackCopy(url);});
    }else{
      fallbackCopy(url);
    }
  }
  function fallbackCopy(text){
    var ta=document.createElement('textarea');
    ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';
    document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');showToast('Link copied!');}
    catch(e){showToast('Press Ctrl+C to copy');}
    document.body.removeChild(ta);
  }
  /* Attach copy handlers */
  setTimeout(function(){
    var copyBtns=document.querySelectorAll('.sc-copy-btn');
    for(var i=0;i<copyBtns.length;i++){
      copyBtns[i].addEventListener('click',function(e){e.preventDefault();copyLink();});
    }
  },200);

})();
