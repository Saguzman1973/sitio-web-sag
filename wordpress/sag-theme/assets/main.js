(function(){
  var d=document, root=d.documentElement;
  root.classList.remove('no-js');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Encabezado al hacer scroll
  var header=d.querySelector('.site-header');
  function onScroll(){ if(header){ header.classList.toggle('scrolled', window.scrollY>30); } }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // Menú móvil
  var mb=d.querySelector('.menu-btn');
  if(mb){ mb.addEventListener('click',function(){
    var open=d.body.classList.toggle('menu-open');
    mb.setAttribute('aria-expanded',open?'true':'false');
  });
    d.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(){d.body.classList.remove('menu-open');mb.setAttribute('aria-expanded','false');});});
  }

  // Revelado
  var targets=d.querySelectorAll('.rv,.steps,.step');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15,rootMargin:'0px 0px -40px 0px'});
    targets.forEach(function(t){io.observe(t);});
  } else { targets.forEach(function(t){t.classList.add('in');}); }

  // Formulario de contacto (sin servidor en el prototipo)
  var form=d.querySelector('#case-form');
  if(form){ form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var msg=d.querySelector('#form-msg'); if(msg){msg.classList.add('show'); msg.focus();}
  });}

  // Lienzo del hero: "del dato al hecho"
  var cv=d.querySelector('#evidence');
  if(!cv||!cv.getContext) return;
  var ctx=cv.getContext('2d'), W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2), pts=[], trail=[], t0=0;
  function build(){
    W=cv.clientWidth; H=cv.clientHeight; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    pts=[]; var gap=W<700?34:42;
    for(var y=gap/2;y<H;y+=gap){ for(var x=gap/2;x<W;x+=gap){
      // densidad mayor a la derecha
      var p=(x/W); if(Math.random()<.18+p*.55){ pts.push({x:x+(Math.random()-.5)*6,y:y+(Math.random()-.5)*6,b:Math.random(),ph:Math.random()*6.28}); }
    }}
    pickTrail();
  }
  function pickTrail(){
    trail=[]; if(!pts.length) return;
    var cand=pts.filter(function(p){return p.x>W*.45;}); if(cand.length<8) cand=pts;
    var cur=cand[Math.floor(Math.random()*cand.length)], used={};
    for(var i=0;i<7;i++){
      trail.push(cur); used[pts.indexOf(cur)]=1;
      var best=null,bd=1e9;
      for(var j=0;j<cand.length;j++){var q=cand[j]; if(used[pts.indexOf(q)])continue; var dx=q.x-cur.x,dy=q.y-cur.y,dd=dx*dx+dy*dy; if(dd>3000&&dd<bd&&dx>-40){bd=dd;best=q;}}
      if(!best)break; cur=best;
    }
    t0=performance.now();
  }
  function draw(now){
    ctx.clearRect(0,0,W,H);
    var t=now/1000;
    for(var i=0;i<pts.length;i++){var p=pts[i]; var a=.12+.18*(0.5+0.5*Math.sin(t*.8+p.ph))*p.b + (p.x/W)*.12;
      ctx.fillStyle='rgba(154,163,181,'+a.toFixed(3)+')'; ctx.fillRect(p.x-1,p.y-1,2,2);}
    // trazo
    var el=(now-t0)/1000, segDur=.55, n=trail.length;
    if(n>1){
      ctx.lineWidth=1; ctx.strokeStyle='rgba(214,185,127,.75)'; ctx.beginPath(); ctx.moveTo(trail[0].x,trail[0].y);
      for(var k=1;k<n;k++){var f=Math.max(0,Math.min(1,(el-(k-1)*segDur)/segDur)); if(f<=0)break;
        var a0=trail[k-1],a1=trail[k]; ctx.lineTo(a0.x+(a1.x-a0.x)*f,a0.y+(a1.y-a0.y)*f);}
      ctx.stroke();
      for(var m=0;m<n;m++){ if(el<(m-1)*segDur+segDur && m>0) break;
        var p2=trail[m]; ctx.fillStyle='#D6B97F'; ctx.beginPath(); ctx.arc(p2.x,p2.y,m===n-1&&el>n*segDur?4:2.5,0,6.283); ctx.fill();
        if(m===n-1&&el>(n-1)*segDur){ ctx.strokeStyle='rgba(214,185,127,'+Math.max(0,.6-(el-(n-1)*segDur)*.25)+')'; ctx.beginPath(); ctx.arc(p2.x,p2.y,6+(el-(n-1)*segDur)*14,0,6.283); ctx.stroke(); }
      }
      if(el>n*segDur+3.2 && !reduce) pickTrail();
    }
    if(!reduce) requestAnimationFrame(draw);
  }
  build(); window.addEventListener('resize',function(){clearTimeout(cv._r);cv._r=setTimeout(build,200);});
  if(reduce){ t0=performance.now()-60000; draw(performance.now()); } else requestAnimationFrame(draw);
})();
