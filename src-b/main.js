/* SAG Assessment & Consulting · Propuesta B "Expediente" · interacciones */
(function () {
  'use strict';
  var root = document.documentElement;
  var anim = root.classList.contains('anim');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var vh = window.innerHeight, vw = window.innerWidth;
  var desk = function () { return window.matchMedia('(min-width: 1024px)').matches; };

  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Telón de apertura y entrada ---------- */
  function ready() { root.classList.add('ready'); }
  var loader = $('.loader');
  if (anim && root.classList.contains('intro') && loader) {
    var cnt = $('.loader__count b'), bar = $('.loader__bar i'), t0 = performance.now(), D = 1400;
    (function step(t) {
      var p = clamp((t - t0) / D, 0, 1), e = 1 - Math.pow(1 - p, 3);
      cnt.textContent = String(Math.round(e * 100)).padStart(3, '0');
      bar.style.transform = 'scaleX(' + e + ')';
      if (p < 1) { window.requestAnimationFrame(step); return; }
      loader.classList.add('out');
      setTimeout(ready, 260);
      setTimeout(function () { loader.remove(); root.classList.remove('intro'); }, 1300);
      try { sessionStorage.setItem('sagB', '1'); } catch (er) {}
    })(t0);
  } else {
    if (loader) loader.remove();
    window.requestAnimationFrame(function () { window.requestAnimationFrame(ready); });
  }

  /* ---------- Palabras del manifiesto ---------- */
  function splitWords(el) {
    var frag = document.createDocumentFragment();
    function add(target, text) {
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { target.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement('span'); s.className = 'w'; s.textContent = part; target.appendChild(s);
      });
    }
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) add(frag, n.textContent);
      else if (n.nodeType === 1) { var c = n.cloneNode(false); add(c, n.textContent); frag.appendChild(c); }
    });
    el.textContent = ''; el.appendChild(frag);
  }
  $$('[data-words]').forEach(splitWords);

  /* ---------- Revelado ---------- */
  $$('[data-stagger]').forEach(function (box) {
    Array.prototype.forEach.call(box.children, function (el, i) { el.style.setProperty('--d', (i % 6) * 0.08 + 's'); });
  });
  var io = anim && 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;
  $$('.rv, .rvl, .rvi').forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); });

  /* ---------- Odómetros ---------- */
  if (anim && 'IntersectionObserver' in window) {
    var oio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$('.odo__c > span', e.target).forEach(function (col) { col.style.transform = 'translateY(' + (-(10 + +col.dataset.t)) + 'em)'; });
        oio.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    $$('.odo').forEach(function (el) {
      var to = el.textContent.trim();
      el.setAttribute('aria-label', to); el.textContent = '';
      to.split('').forEach(function (d, i) {
        var c = document.createElement('span'); c.className = 'odo__c'; c.setAttribute('aria-hidden', 'true');
        var col = document.createElement('span'); col.dataset.t = d; col.style.setProperty('--d', i * 0.14 + 's');
        for (var k = 0; k < 20; k++) { var s = document.createElement('span'); s.textContent = k % 10; col.appendChild(s); }
        c.appendChild(col); el.appendChild(c);
      });
      oio.observe(el);
    });
  }

  /* ---------- Cabecera, menú y progreso ---------- */
  var head = $('.head'), prog = $('.prog'), lastY = window.scrollY, vel = 0;
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    var b = $('#burger'); if (b) { b.setAttribute('aria-expanded', String(open)); b.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); }
  }
  var burger = $('#burger');
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Franjas de palabras (velocidad según el desplazamiento) ---------- */
  var mqs = anim ? $$('.mq').map(function (m) { return { t: $('.mq__track', m), x: 0, dir: m.dataset.dir === 'r' ? 1 : -1, w: 0 }; }) : [];
  function mqSize() { mqs.forEach(function (m) { m.w = m.t.scrollWidth / 2; }); }

  /* ---------- Campo de datos del inicio ---------- */
  var field = (function () {
    var cv = $('#field'), hero = $('.hero'); if (!cv || !hero) return null;
    var ctx = cv.getContext('2d'), W = 0, H = 0, pts = [], flags = [], mx = -1e4, my = -1e4, run = true, p = 0, sm = false, start = performance.now();
    var LABELS = ['Pago duplicado', 'Proveedor sin soporte', 'Fraccionamiento', 'Cuenta vinculada', 'Fuera de patrón', 'Sobrecosto', 'Beneficiario repetido'];
    function size() {
      var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var pitch = W < 700 ? 22 : 24; pts = [];
      for (var y = pitch / 2; y < H; y += pitch) for (var x = pitch / 2; x < W; x += pitch) pts.push({ x: x, y: y, ph: Math.random() * 6.283 });
      flags = [];
      var small = sm = W < 700, x0 = small ? W * 0.55 : W * 0.3, x1 = W >= 1180 ? W - 570 : small ? W - 14 : W - 170, y0 = H * (small ? 0.06 : 0.17), y1 = H * (small ? 0.94 : 0.38);
      var cand = pts.filter(function (q) { return q.x > x0 && q.x < x1 && q.y > y0 && q.y < y1; });
      for (var i = 0; i < (small ? 4 : LABELS.length) && cand.length; i++) {
        var q = cand.splice(Math.floor(Math.random() * cand.length), 1)[0]; q.f = true; q.l = small ? '' : LABELS[i].toUpperCase(); q.t0 = 900 + i * 520; flags.push(q);
        cand = cand.filter(function (o) { return Math.abs(o.x - q.x) > 150 || Math.abs(o.y - q.y) > 70; });
      }
      flags.sort(function (a, b) { return a.x - b.x; });
      if (!anim) draw(1e7);
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var noise = 1 - p, tt = t * 0.0009, i, q, x, y;
      ctx.fillStyle = '#f1ede4';
      for (i = 0; i < pts.length; i++) {
        q = pts[i]; if (q.f) continue;
        x = q.x + Math.sin(tt + q.ph + q.y * 0.012) * 7 * noise;
        y = q.y + Math.cos(tt * 1.2 + q.ph + q.x * 0.01) * 7 * noise;
        var dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
        if (d2 < 19600) { var d = Math.sqrt(d2) || 1, f = (140 - d) / 140 * 16; x += dx / d * f; y += dy / d * f; }
        ctx.globalAlpha = (0.12 + 0.2 * (0.5 + 0.5 * Math.sin(tt * 2 + q.ph))) * (1 - p * 0.6);
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
      ctx.globalAlpha = 1;
      var el = t - start, vis = flags.filter(function (fq) { return el > fq.t0; });
      if (vis.length > 1 && !sm) {
        ctx.strokeStyle = 'rgba(255,74,28,' + (0.18 + p * 0.4) + ')'; ctx.lineWidth = 1; ctx.beginPath();
        for (i = 1; i < vis.length; i++) { ctx.moveTo(vis[i - 1].x, vis[i - 1].y); ctx.lineTo(vis[i].x, vis[i].y); }
        ctx.stroke();
      }
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1.4px';
      ctx.font = '500 10px "Geist Mono", ui-monospace, monospace';
      vis.forEach(function (fq, k) {
        var age = (el - fq.t0) / 1000, ring = (age * 20 + k * 7) % 30;
        ctx.fillStyle = '#ff4a1c'; ctx.beginPath(); ctx.arc(fq.x, fq.y, 3.4, 0, 6.283); ctx.fill();
        ctx.strokeStyle = 'rgba(255,74,28,' + ((1 - ring / 30) * 0.7).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(fq.x, fq.y, 6 + ring, 0, 6.283); ctx.stroke();
        var a = clamp(age * 2, 0, 1);
        if (!fq.l) return;
        ctx.fillStyle = 'rgba(241,237,228,' + (0.78 * a).toFixed(3) + ')'; ctx.fillText(fq.l, fq.x + 12, fq.y - 9);
        ctx.fillStyle = 'rgba(255,74,28,' + (0.9 * a).toFixed(3) + ')'; ctx.fillText('ALERTA ' + String(k + 1).padStart(2, '0'), fq.x + 12, fq.y + 16);
      });
      return vis.length;
    }
    size();
    window.addEventListener('resize', size);
    hero.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    hero.addEventListener('pointerleave', function () { mx = my = -1e4; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { run = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    /* ficha */
    var fRec = $('#f-rec'), fAl = $('#f-al'), fSt = $('#f-st'), recShown = 0, recTo = 1248903;
    return {
      tick: function (t, y) {
        if (!run) return;
        p = clamp(y / Math.max(1, hero.offsetHeight - vh), 0, 1);
        var n = draw(t);
        if (fRec) {
          var el = t - start; recShown = Math.round(recTo * clamp(el / 4200, 0, 1) * (2 - clamp(el / 4200, 0, 1)) + Math.max(0, el - 4200) * 0.9);
          fRec.textContent = recShown.toLocaleString('es-CO');
          fAl.textContent = String(n).padStart(2, '0');
          fSt.textContent = p > 0.55 ? 'Hallazgos documentados' : 'En análisis';
        }
      },
    };
  })();
  if (!anim) { var fr = $('#f-rec'); if (fr) { fr.textContent = (1248903).toLocaleString('es-CO'); $('#f-al').textContent = '07'; } }

  /* ---------- Manifiesto ---------- */
  var mf = $('.mf'), mfW = mf ? $$('.mf__text .w', mf) : [], mfN = -1;
  function mfTick() {
    if (!mf || !mfW.length) return;
    var r = mf.getBoundingClientRect(), pinned = desk() || vw >= 900, p;
    if (pinned) p = clamp((-r.top + vh * 0.1) / Math.max(1, r.height - vh * 1.05), 0, 1);
    else p = clamp((vh * 0.9 - r.top) / Math.max(1, r.height), 0, 1);
    var n = Math.round(p * (mfW.length + 3));
    if (n === mfN) return; mfN = n;
    for (var i = 0; i < mfW.length; i++) mfW[i].classList.toggle('on', i < n);
  }

  /* ---------- Tarjetas apiladas ---------- */
  var cards = $$('.stack .card'), tops = [];
  function cardsSize() { tops = cards.map(function (c) { return parseFloat(getComputedStyle(c).top) || 0; }); }
  function cardsTick() {
    for (var i = 0; i < cards.length - 1; i++) {
      var r = cards[i + 1].getBoundingClientRect();
      var q = clamp(1 - (r.top - tops[i + 1]) / (vh * 0.8), 0, 1);
      cards[i].style.setProperty('--q', q.toFixed(3));
      cards[i].style.transform = 'scale(' + (1 - q * 0.06).toFixed(4) + ')';
    }
  }

  /* ---------- Método ---------- */
  var meth = $('.method'), msteps = $$('.mstep'), scenes = $$('.scene'), mnav = $$('.mnav li'), mCur = -1;
  function methTick() {
    if (!meth || !desk()) return;
    var r = meth.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    var idx = Math.min(3, Math.floor(p * 4));
    mnav.forEach(function (li, i) { li.style.setProperty('--f', (clamp(p * 4 - i, 0, 1) * 100).toFixed(1) + '%'); });
    if (idx === mCur) return; mCur = idx;
    msteps.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
    scenes.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
    mnav.forEach(function (li, i) { li.classList.toggle('on', i <= idx); });
  }
  if (msteps.length) { msteps[0].classList.add('active'); if (scenes[0]) scenes[0].classList.add('active'); }

  /* ---------- Lista del equipo: foto que sigue al cursor ---------- */
  var prev = $('.rprev'), pImg = prev && $('img', prev), px = 0, py = 0, tx = 0, ty = 0;
  if (prev && fine) {
    $$('.rrow[data-img]').forEach(function (r) {
      r.addEventListener('mouseenter', function () { pImg.src = r.dataset.img; pImg.alt = ''; prev.classList.add('on'); });
      r.addEventListener('mouseleave', function () { prev.classList.remove('on'); });
    });
    window.addEventListener('pointermove', function (e) { tx = e.clientX + 170; ty = e.clientY; }, { passive: true });
  }

  /* ---------- Ventana de perfiles ---------- */
  (function profiles() {
    var dlg = $('#prof'), data = $('#people'); if (!dlg || !data || typeof dlg.showModal !== 'function') return;
    var P = JSON.parse(data.textContent), last = null;
    function open(i, btn) {
      var m = P[i]; if (!m) return;
      $('#prof-ph').innerHTML = '<img src="' + m.img + '" alt="Retrato de ' + m.n + '">';
      $('#prof-role').textContent = m.r; $('#prof-name').textContent = m.n;
      var bio = $('#prof-bio'); bio.innerHTML = ''; m.bio.forEach(function (t) { var p = document.createElement('p'); p.textContent = t; bio.appendChild(p); });
      var tg = $('#prof-tags'); tg.innerHTML = ''; m.tags.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; tg.appendChild(li); });
      var a = $('#prof-link'); a.href = m.li; a.hidden = !m.li;
      last = btn; dlg.showModal(); document.body.style.overflow = 'hidden';
    }
    $$('[data-person]').forEach(function (b) { b.addEventListener('click', function () { open(+b.dataset.person, b); }); });
    $('#prof-x').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { document.body.style.overflow = ''; if (last) last.focus(); });
  })();

  /* ---------- Mapa de cobertura ---------- */
  var map = (function () {
    var box = $('.map'), src = $('#map-data'); if (!box || !src) return null;
    var cv = $('canvas', box), ctx = cv.getContext('2d'), M = JSON.parse(src.textContent), W = 0, H = 0, s = 1, t0 = null, run = false;
    var P = M.pins, from = P.bogota;
    var dests = [[P.quito, 'ECUADOR'], [P.lima, 'PERÚ'], [P.cdmx, 'MÉXICO']];
    var dist = M.dots.map(function (d) { return Math.hypot(d[0] - from[0], d[1] - from[1]); });
    function size() { var dpr = Math.min(window.devicePixelRatio || 1, 2); W = box.clientWidth; H = box.clientHeight; s = W / M.w; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (!anim) draw(1e7); }
    function curve(a, b, k) {
      var mxp = (a[0] + b[0]) / 2, myp = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
      var cx = mxp - dy / len * len * 0.28, cy = myp + dx / len * len * 0.28 * -1;
      var u = 1 - k; return [u * u * a[0] + 2 * u * k * cx + k * k * b[0], u * u * a[1] + 2 * u * k * cy + k * k * b[1]];
    }
    function draw(el) {
      ctx.clearRect(0, 0, W, H);
      var r = Math.max(1.4, M.pitch * 0.2 * s * 1.25);
      for (var i = 0; i < M.dots.length; i++) {
        var d = M.dots[i], a = clamp((el - dist[i] * 1.6) / 500, 0, 1); if (a <= 0) continue;
        ctx.fillStyle = d[2] === 1 ? '#ff4a1c' : d[2] === 2 ? 'rgba(241,237,228,.86)' : 'rgba(241,237,228,.2)';
        ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(d[0] * s, d[1] * s, r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '1.4px';
      ctx.font = '500 ' + Math.max(9, 11 * s * 1.2).toFixed(0) + 'px "Geist Mono", ui-monospace, monospace';
      dests.forEach(function (dd, k) {
        var p = clamp((el - 1300 - k * 280) / 1300, 0, 1); if (p <= 0) return;
        ctx.strokeStyle = 'rgba(255,74,28,.85)'; ctx.lineWidth = 1.4; ctx.beginPath();
        for (var j = 0; j <= 40 * p; j++) { var q = curve(from, dd[0], j / 40); if (j) ctx.lineTo(q[0] * s, q[1] * s); else ctx.moveTo(q[0] * s, q[1] * s); }
        ctx.stroke();
        if (p >= 1) {
          var tp = ((el / 2400) + k * 0.33) % 1, q2 = curve(from, dd[0], tp);
          ctx.fillStyle = '#ff4a1c'; ctx.beginPath(); ctx.arc(q2[0] * s, q2[1] * s, 3, 0, 6.283); ctx.fill();
          var ring = (el / 60 + k * 9) % 26;
          ctx.strokeStyle = 'rgba(241,237,228,' + (0.6 * (1 - ring / 26)).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(dd[0][0] * s, dd[0][1] * s, 4 + ring * s * 1.4, 0, 6.283); ctx.stroke();
          ctx.fillStyle = 'rgba(241,237,228,.9)'; ctx.fillText(dd[1], dd[0][0] * s + 12, dd[0][1] * s + 4);
        }
      });
      var pr = (el / 50) % 34;
      ctx.strokeStyle = 'rgba(255,74,28,' + (0.8 * (1 - pr / 34)).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(from[0] * s, from[1] * s, 6 + pr * s * 1.5, 0, 6.283); ctx.stroke();
      ctx.fillStyle = '#ff4a1c'; ctx.beginPath(); ctx.arc(from[0] * s, from[1] * s, 5, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#f1ede4'; ctx.fillText('BOGOTÁ · SEDE', from[0] * s + 14, from[1] * s - 10);
    }
    size(); window.addEventListener('resize', size);
    if ('IntersectionObserver' in window && anim) new IntersectionObserver(function (es) { run = es[0].isIntersecting; if (run && t0 === null) t0 = performance.now(); }, { threshold: 0.2 }).observe(box);
    return { tick: function (t) { if (run) draw(t - t0); } };
  })();

  /* ---------- Video de la banda: solo cuando conviene ---------- */
  (function bandVideo() {
    var v = $('.band video'); if (!v || !anim) return;
    var conn = navigator.connection || {}; if (conn.saveData || !window.matchMedia('(min-width: 761px)').matches) return;
    var started = false;
    new IntersectionObserver(function (es) {
      var on = es[0].isIntersecting;
      if (on && !started) { started = true; v.src = v.dataset.src; v.addEventListener('loadeddata', function () { v.classList.add('on'); }, { once: true }); }
      if (started) { if (on) { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } else v.pause(); }
    }, { rootMargin: '200px 0px' }).observe(v);
  })();

  /* ---------- Cursor y botones magnéticos ---------- */
  var cur = null, cx = -100, cy = -100, rx = -100, ry = -100;
  if (anim && fine) {
    root.classList.add('has-cursor');
    cur = $('.cur'); var dot = $('.cur__dot'), ring = $('.cur__ring'), lab = $('.cur__ring span');
    window.addEventListener('pointermove', function (e) { cx = e.clientX; cy = e.clientY; }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest && e.target.closest('a, button, label, [data-cursor]'), v = t && t.getAttribute('data-cursor');
      cur.classList.toggle('is-view', !!v); cur.classList.toggle('is-link', !!t && !v); if (v) lab.textContent = v;
    });
    cur.dot = dot; cur.ring = ring;
    $$('[data-mag]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)'; });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Parallax ---------- */
  var par = anim ? $$('[data-par]') : [];

  /* ---------- Bucle principal ---------- */
  function frame(t) {
    var y = window.scrollY;
    vel = lerp(vel, y - lastY, 0.25);
    if (head) {
      if (y > 420 && y > lastY + 3 && !root.classList.contains('menu-open')) head.classList.add('hide');
      else if (y < lastY - 3 || y < 420) head.classList.remove('hide');
    }
    lastY = y;
    var max = document.documentElement.scrollHeight - vh;
    if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? y / max : 0).toFixed(4) + ')';
    if (!anim) return;
    if (field) field.tick(t, y);
    mfTick(); cardsTick(); methTick();
    if (map) map.tick(t);
    for (var i = 0; i < mqs.length; i++) {
      var m = mqs[i]; if (!m.w) continue;
      m.x += m.dir * (0.55 + Math.min(Math.abs(vel) * 0.12, 9));
      if (m.x <= -m.w) m.x += m.w; if (m.x > 0) m.x -= m.w;
      m.t.style.transform = 'translate3d(' + m.x.toFixed(1) + 'px,0,0)';
    }
    for (var j = 0; j < par.length; j++) {
      var el = par[j], r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.par)).toFixed(1) + 'px,0)';
    }
    if (prev && prev.classList.contains('on')) { px = lerp(px, tx, 0.16); py = lerp(py, ty, 0.16); prev.style.left = px.toFixed(1) + 'px'; prev.style.top = py.toFixed(1) + 'px'; }
    else { px = tx; py = ty; }
    if (cur) { rx = lerp(rx, cx, 0.2); ry = lerp(ry, cy, 0.2); cur.dot.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; cur.ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)'; }
  }
  function loop(t) { frame(t); window.requestAnimationFrame(loop); }
  function resize() { vh = window.innerHeight; vw = window.innerWidth; mqSize(); cardsSize(); mfN = -1; mCur = -1; }
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
  resize();
  if (anim) window.requestAnimationFrame(loop);
  else { window.addEventListener('scroll', function () { frame(0); }, { passive: true }); frame(0); }

  /* ---------- Índice de servicios: filtros y acordeón ---------- */
  $$('.sv__btn').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true')); }); });
  var fb = $$('.filt button'), rows = $$('.sv__row');
  fb.forEach(function (b) {
    var f = b.dataset.f, n = f === 'todos' ? rows.length : rows.filter(function (r) { return r.dataset.cat === f; }).length;
    var i = $('i', b); if (i) i.textContent = n;
    b.addEventListener('click', function () {
      fb.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      rows.forEach(function (r) { r.hidden = !(f === 'todos' || r.dataset.cat === f); });
    });
  });

  /* ---------- Formulario de contacto ----------
     Con data-endpoint (versión de producción: api/contact.php, el servicio del sitio actual) envía los datos en JSON;
     el servidor guarda la prueba de la autorización, entrega la consulta por correo y responde { ok, ref }.
     Sin data-endpoint, o si ese servicio no existe (404, 405, 501) o no hay conexión, abre el correo del visitante con
     la consulta ya redactada y la constancia de la autorización incluida en el texto. */
  (function form() {
    var f = $('#form'); if (!f) return;
    var note = $('#form-note'), submit = $('button[type=submit]', f), endpoint = f.getAttribute('data-endpoint'), LEGAL = f.getAttribute('data-legal') || '1.0';
    function setErr(field, msg) { var w = field.closest('.fld'), p = w && $('.err', w); if (w) w.classList.toggle('bad', !!msg); if (p) { p.textContent = msg || ''; p.hidden = !msg; } }
    function chkErr(id, ok, msg) { var e = $(id); e.hidden = ok; e.textContent = ok ? '' : msg; return ok; }
    function mailto(d) {
      var body = 'Servicio: ' + d.servicio + '\nNombre: ' + d.nombre + '\nOrganización: ' + (d.organizacion || '-') + '\nCorreo: ' + d.correo + '\nTeléfono: ' + (d.telefono || '-') + '\n\n' + d.necesidad +
        '\n\n--\nAcepto los Términos y Condiciones (v' + LEGAL + ') y la Política de Privacidad (v' + LEGAL + '), y autorizo el tratamiento de mis datos para responder esta consulta. Aceptado en el formulario web el ' + new Date().toISOString() + '.';
      window.location.href = 'mailto:comercial@sagconsulting.co?subject=' + encodeURIComponent('Consulta web · ' + d.servicio) + '&body=' + encodeURIComponent(body);
      note.textContent = 'Abrimos su programa de correo con la consulta lista para enviar. Si no se abrió, escríbanos a comercial@sagconsulting.co.';
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = f.nombre, correo = f.correo, msg = f.necesidad, bad = false;
      setErr(nombre, nombre.value.trim().length > 1 ? '' : 'Escriba su nombre.'); if (nombre.value.trim().length < 2) bad = true;
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.value.trim()); setErr(correo, ok ? '' : 'Escriba un correo válido.'); if (!ok) bad = true;
      setErr(msg, msg.value.trim().length > 9 ? '' : 'Cuéntenos brevemente su necesidad.'); if (msg.value.trim().length <= 9) bad = true;
      var t = $('#f-terms'), pr = $('#f-priv');
      if (!chkErr('#err-terms', t.checked, 'Debe aceptar los Términos y Condiciones.')) bad = true;
      if (!chkErr('#err-priv', pr.checked, 'Debe autorizar el tratamiento de sus datos según la Política de Privacidad.')) bad = true;
      if (bad) { note.textContent = 'Revise los campos marcados.'; var first = $('.bad input, .bad textarea', f) || (!t.checked ? t : pr); if (first) first.focus(); return; }
      // Mismos campos que envía el sitio actual; "website" es la trampa para robots y la evalúa el servidor.
      var d = { servicio: (f.querySelector('input[name="servicio"]:checked') || {}).value || 'Otro asunto', nombre: nombre.value.trim(), correo: correo.value.trim(), organizacion: f.organizacion.value.trim(), telefono: f.telefono.value.trim(), necesidad: msg.value.trim(), terms: true, privacy: true, website: (f.website || {}).value || '' };
      if (!endpoint) { mailto(d); return; }
      submit.disabled = true; note.textContent = 'Enviando…';
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(d) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j || {} }; }); })
        .then(function (res) {
          if (res.j.ok) {
            note.textContent = 'Gracias, recibimos su consulta' + (res.j.ref ? '. Referencia: ' + res.j.ref : '') + '. Le responderemos pronto.';
            f.reset(); $$('.fld.bad', f).forEach(function (w) { w.classList.remove('bad'); });
          } else if (res.s === 404 || res.s === 405 || res.s === 501) mailto(d);
          else if (res.s === 429) note.textContent = 'Ha enviado varias consultas seguidas. Inténtelo de nuevo más tarde o escríbanos a comercial@sagconsulting.co.';
          else if (res.s === 400) note.textContent = 'Revise los datos e inténtelo de nuevo.';
          else note.textContent = 'No pudimos enviar su consulta en este momento. Escríbanos a comercial@sagconsulting.co o por WhatsApp.';
        })
        .catch(function () { mailto(d); })
        .then(function () { submit.disabled = false; });
    });
    $$('input, textarea', f).forEach(function (i) { i.addEventListener('input', function () { setErr(i, ''); }); });
    $$('.chk input', f).forEach(function (c) { c.addEventListener('change', function () { var e = $(c.id === 'f-terms' ? '#err-terms' : '#err-priv'); e.hidden = true; e.textContent = ''; }); });
  })();
})();
