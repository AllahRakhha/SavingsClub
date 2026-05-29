/* SavingsClub - Auto Logo + Disclaimer Fix for ALL pages */
(function(){
  /* Replace old SVG logo with new SC icon on every page */
  var marks=document.querySelectorAll('.logo-mark');
  for(var i=0;i<marks.length;i++){
    var img=document.createElement('img');
    /* Detect path depth */
    var path=window.location.pathname;
    var depth=path.split('/').filter(function(x){return x.length>0}).length;
    var prefix='';
    if(depth===1)prefix='../';
    if(depth===2)prefix='../../';
    if(depth>=3)prefix='../../../';
    /* Special case: root path */
    if(path==='/'||path==='/index.html')prefix='';
    img.src=prefix+'img/sc-icon.png';
    img.alt='SavingsClub';
    img.style.cssText='height:34px;width:34px;vertical-align:middle;background:none;border:none';
    marks[i].parentNode.replaceChild(img,marks[i]);
  }

  /* Add disclaimer banner below nav if not already present */
  if(!document.getElementById('scDisclaimer')){
    var nav=document.querySelector('nav');
    if(nav){
      var d=document.createElement('div');
      d.id='scDisclaimer';
      d.style.cssText='background:#F0FDF4;border-bottom:1px solid rgba(5,150,105,.1);padding:8px 24px;text-align:center;font-size:.75rem;color:#475569;line-height:1.5';
      d.innerHTML='SavingsClub provides educational content only. We are not licensed financial advisors, tax professionals, or legal professionals. <a href="/disclaimer/" style="color:#059669;font-weight:600">Read full disclaimer</a>';
      nav.parentNode.insertBefore(d,nav.nextSibling);
    }
  }
})();
