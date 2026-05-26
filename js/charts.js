/* SavingsClub Chart Engine v3 */
function fmt(n){return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
function fmtI(n){return n.toLocaleString('en-US',{maximumFractionDigits:0})}

function drawLineChart(id,dataPoints,opts){
opts=opts||{};
var el=document.querySelector(id);if(!el)return;
var w=opts.w||480,h=opts.h||200,pad={t:30,r:20,b:35,l:50};
var pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
var maxY=Math.max.apply(null,dataPoints.map(function(d){return d.y}))*1.1||1;
var colors=opts.colors||['#3B82F6','#10B981'];
var labels=opts.labels||['Value'];
var datasets=opts.datasets||[dataPoints];
var svg='<div class="chart-wrap"><div class="chart-title"><span class="dot" style="background:'+colors[0]+'"></span>'+(opts.title||'Growth Over Time')+'</div>';
svg+='<svg class="chart-svg" viewBox="0 0 '+w+' '+h+'">';
for(var i=0;i<=4;i++){
var y=pad.t+ph-(ph/4)*i;
var val=(maxY/4)*i;
svg+='<line x1="'+pad.l+'" y1="'+y+'" x2="'+(w-pad.r)+'" y2="'+y+'" class="chart-grid-line"/>';
svg+='<text x="'+(pad.l-8)+'" y="'+(y+4)+'" class="chart-label" text-anchor="end">$'+(val>=1000?(val/1000).toFixed(0)+'k':Math.round(val))+'</text>';
}
var step=Math.max(1,Math.floor(dataPoints.length/6));
dataPoints.forEach(function(d,i){
if(i%step===0||i===dataPoints.length-1){
var x=pad.l+(pw/(dataPoints.length-1||1))*i;
svg+='<text x="'+x+'" y="'+(h-8)+'" class="chart-label" text-anchor="middle">'+d.x+'</text>';
}
});
datasets.forEach(function(ds,di){
var pts=ds.map(function(d,i){
var x=pad.l+(pw/(ds.length-1||1))*i;
var y=pad.t+ph-((d.y)/(maxY))*ph;
return{x:x,y:y};
});
var linePath=pts.map(function(p,i){return(i===0?'M':'L')+p.x.toFixed(1)+','+p.y.toFixed(1)}).join(' ');
var areaPath=linePath+' L'+pts[pts.length-1].x+','+(pad.t+ph)+' L'+pts[0].x+','+(pad.t+ph)+' Z';
svg+='<path d="'+areaPath+'" fill="'+colors[di]+'" class="chart-area"/>';
svg+='<path d="'+linePath+'" stroke="'+colors[di]+'" class="chart-line"/>';
var last=pts[pts.length-1];
svg+='<circle cx="'+last.x+'" cy="'+last.y+'" r="4" fill="'+colors[di]+'" stroke="#fff" stroke-width="2"/>';
});
svg+='</svg>';
if(labels.length>1){
svg+='<div class="donut-legend">'+labels.map(function(l,i){return'<div class="donut-legend-item"><div class="donut-legend-dot" style="background:'+colors[i]+'"></div>'+l+'</div>'}).join('')+'</div>';
}
svg+='</div>';
el.insertAdjacentHTML('beforeend',svg);
}

function drawDonutChart(id,segments,opts){
opts=opts||{};
var el=document.querySelector(id);if(!el)return;
var size=opts.size||180,cx=size/2,cy=size/2,r=size/2-20,strokeW=28;
var total=segments.reduce(function(a,s){return a+s.value},0)||1;
var svg='<div class="chart-wrap" style="text-align:center"><div class="chart-title" style="justify-content:center"><span class="dot" style="background:'+(segments[0]&&segments[0].color||'#3B82F6')+'"></span>'+(opts.title||'Breakdown')+'</div>';
svg+='<svg class="chart-svg" viewBox="0 0 '+size+' '+size+'" style="max-width:'+size+'px;margin:0 auto">';
var circ=2*Math.PI*r;
var offset=0;
segments.forEach(function(s){
var pct=s.value/total;
var dash=circ*pct;
var gap=circ-dash;
svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+s.color+'" stroke-width="'+strokeW+'" stroke-dasharray="'+dash.toFixed(1)+' '+gap.toFixed(1)+'" stroke-dashoffset="'+(-offset).toFixed(1)+'" class="donut-segment" style="transform:rotate(-90deg);transform-origin:center"/>';
offset+=dash;
});
svg+='<text x="'+cx+'" y="'+(cy-6)+'" class="donut-center-text" font-size="22" font-weight="800">'+(opts.centerTop||'')+'</text>';
svg+='<text x="'+cx+'" y="'+(cy+14)+'" class="donut-center-text" font-size="11" font-weight="400" fill="rgba(255,255,255,.5)">'+(opts.centerBot||'')+'</text>';
svg+='</svg>';
svg+='<div class="donut-legend">'+segments.map(function(s){return'<div class="donut-legend-item"><div class="donut-legend-dot" style="background:'+s.color+'"></div>'+s.label+': $'+fmtI(s.value)+'</div>'}).join('')+'</div>';
svg+='</div>';
el.insertAdjacentHTML('beforeend',svg);
}

function describeArc(cx,cy,r,startAngle,endAngle){
var s=startAngle*Math.PI/180,e=endAngle*Math.PI/180;
var x1=cx+r*Math.cos(s),y1=cy+r*Math.sin(s);
var x2=cx+r*Math.cos(e),y2=cy+r*Math.sin(e);
var large=endAngle-startAngle>180?1:0;
return'M '+x1+' '+y1+' A '+r+' '+r+' 0 '+large+' 1 '+x2+' '+y2;
}

function drawGauge(id,value,max,opts){
opts=opts||{};
var el=document.querySelector(id);if(!el)return;
var size=200,cx=100,cy=110,r=80;
var pct=Math.min(value/max,2);
var startAngle=-210,endAngle=30,range=endAngle-startAngle;
var angle=startAngle+range*Math.min(pct,1);
var color=pct>=1?'#10B981':pct>=0.7?'#F59E0B':'#EF4444';
var svg='<div class="chart-wrap" style="text-align:center"><div class="chart-title" style="justify-content:center"><span class="dot" style="background:'+color+'"></span>'+(opts.title||'Progress')+'</div>';
svg+='<svg class="chart-svg" viewBox="0 0 '+size+' '+(size*0.7)+'" style="max-width:'+size+'px;margin:0 auto">';
var d1=describeArc(cx,cy,r,startAngle,endAngle);
svg+='<path d="'+d1+'" class="gauge-track" stroke-width="14"/>';
var d2=describeArc(cx,cy,r,startAngle,angle);
svg+='<path d="'+d2+'" fill="none" stroke="'+color+'" stroke-width="14" stroke-linecap="round"/>';
svg+='<text x="'+cx+'" y="'+(cy-8)+'" class="gauge-text" font-size="28" font-weight="800">'+(pct>=1?'✓':Math.round(pct*100)+'%')+'</text>';
svg+='<text x="'+cx+'" y="'+(cy+12)+'" class="gauge-text" font-size="11" fill="rgba(255,255,255,.5)">'+(opts.subtitle||'')+'</text>';
svg+='</svg></div>';
el.insertAdjacentHTML('beforeend',svg);
}

function drawHBars(id,items,opts){
opts=opts||{};
var el=document.querySelector(id);if(!el)return;
var w=opts.w||480,barH=36,gap=12,pad={l:100,r:60};
var h=items.length*(barH+gap)+20;
var maxVal=Math.max.apply(null,items.map(function(i){return i.value}))||1;
var svg='<div class="chart-wrap"><div class="chart-title"><span class="dot" style="background:'+(items[0]&&items[0].color||'#3B82F6')+'"></span>'+(opts.title||'Comparison')+'</div>';
svg+='<svg class="chart-svg" viewBox="0 0 '+w+' '+h+'">';
items.forEach(function(item,i){
var y=i*(barH+gap)+10;
var barW=((w-pad.l-pad.r)*(item.value/maxVal));
svg+='<rect x="'+pad.l+'" y="'+y+'" width="'+(w-pad.l-pad.r)+'" height="'+barH+'" class="comp-bar-bg"/>';
svg+='<rect x="'+pad.l+'" y="'+y+'" width="'+barW+'" height="'+barH+'" fill="'+item.color+'" class="comp-bar-fill"/>';
svg+='<text x="'+(pad.l-8)+'" y="'+(y+barH/2+4)+'" class="comp-bar-label" text-anchor="end">'+item.label+'</text>';
svg+='<text x="'+(pad.l+barW+8)+'" y="'+(y+barH/2+4)+'" class="comp-bar-value">'+(item.display||'$'+fmtI(item.value))+'</text>';
});
svg+='</svg></div>';
el.insertAdjacentHTML('beforeend',svg);
}

function drawProgressRing(id,current,targets,opts){
opts=opts||{};
var el=document.querySelector(id);if(!el)return;
var size=180,cx=90,cy=90,r=70;
var circ=2*Math.PI*r;
var svg='<div class="chart-wrap" style="text-align:center"><div class="chart-title" style="justify-content:center"><span class="dot" style="background:#10B981"></span>'+(opts.title||'Target Progress')+'</div>';
svg+='<div style="display:flex;justify-content:center;gap:24px;flex-wrap:wrap">';
targets.forEach(function(t){
var pct=Math.min(current/t.value,1);
var off=circ-(circ*pct);
var color=pct>=1?'#10B981':pct>=0.5?'#F59E0B':'#EF4444';
svg+='<div style="text-align:center"><svg viewBox="0 0 '+size+' '+size+'" style="width:120px;height:120px">';
svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" class="ring-track"/>';
svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" class="ring-fill" stroke="'+color+'" stroke-dasharray="'+circ+'" stroke-dashoffset="'+off+'"/>';
svg+='<text x="'+cx+'" y="'+(cy-4)+'" class="gauge-text" font-size="20" font-weight="800">'+Math.round(pct*100)+'%</text>';
svg+='<text x="'+cx+'" y="'+(cy+14)+'" class="gauge-text" font-size="9" fill="rgba(255,255,255,.5)">'+t.label+'</text>';
svg+='</svg></div>';
});
svg+='</div></div>';
el.insertAdjacentHTML('beforeend',svg);
}
