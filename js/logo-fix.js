/* SavingsClub - Auto Logo Fix for ALL pages */
(function(){
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
  /* Remove any disclaimer banner from top if it exists */
  var d=document.getElementById('scDisclaimer');
  if(d)d.remove();
})();
