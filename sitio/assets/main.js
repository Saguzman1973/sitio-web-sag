/* SAG Assessment & Consulting · interacciones del sitio */
(function () {
  "use strict";
  var root = document.documentElement;
  var anim = root.classList.contains("anim");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Entrada del titular ---------- */
  window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { root.classList.add("ready"); }); });

  /* ---------- Partir títulos en palabras (respeta <b>) ---------- */
  $$("[data-words]").forEach(function (el) {
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    var out = [], i = 0;
    Array.prototype.forEach.call(el.childNodes, function (n) {
      var tag = n.nodeType === 1 ? n.tagName.toLowerCase() : null;
      n.textContent.trim().split(/\s+/).filter(Boolean).forEach(function (w) {
        var inner = tag ? "<" + tag + ">" + w + "</" + tag + ">" : w;
        out.push('<span class="w" aria-hidden="true"><span style="--i:' + (i++) + '">' + inner + "</span></span>");
      });
    });
    el.innerHTML = out.join(" ");
  });

  /* ---------- Revelado escalonado ---------- */
  $$("[data-stagger]").forEach(function (box) {
    Array.prototype.forEach.call(box.children, function (el, i) { el.style.setProperty("--d", (i % 4) * 0.08 + "s"); });
  });
  var targets = $$(".reveal, [data-words]");
  if ("IntersectionObserver" in window && anim) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* ---------- Contadores ---------- */
  function countUp(el) {
    var to = parseInt(el.getAttribute("data-count"), 10);
    var plain = el.hasAttribute("data-plain");
    var t0 = null, dur = 1800;
    (function step(t) {
      if (t0 === null) t0 = t;
      var p = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round((plain ? to - 80 : 0) + e * (plain ? 80 : to));
      if (p < 1) window.requestAnimationFrame(step);
    })(performance.now());
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window && anim) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) {
      var to = parseInt(c.getAttribute("data-count"), 10);
      c.textContent = c.hasAttribute("data-plain") ? to - 80 : 0;
      co.observe(c);
    });
  }

  /* ---------- Cabecera, progreso, parallax y línea del método ---------- */
  var head = $("#head"), bar = $("#progress"), nav = $("#nav"), lastY = 0, ticking = false;
  var par = $$("[data-parallax]");
  var steps = $$(".step"), rail = $("#rail"), stepsBox = $("#steps");

  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (head) {
      head.classList.toggle("is-solid", y > 40);
      head.classList.toggle("is-hidden", y > 560 && y > lastY + 4 && !(nav && nav.classList.contains("open")));
      if (y < lastY - 4 || y < 560) head.classList.remove("is-hidden");
    }
    lastY = y;
    if (anim) {
      par.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -240 || r.top > vh + 240) return;
        var k = parseFloat(el.getAttribute("data-parallax")) || 0;
        el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * k).toFixed(1) + "px,0)";
      });
    }
    if (stepsBox && rail) {
      var b = stepsBox.getBoundingClientRect();
      if (anim) rail.style.transform = "scaleY(" + clamp((vh * 0.6 - b.top) / b.height, 0, 1) + ")";
      steps.forEach(function (s) { s.classList.toggle("on", s.getBoundingClientRect().top < vh * 0.62); });
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Menú móvil ---------- */
  var burger = $("#burger");
  function setMenu(open) {
    if (!nav || !burger) return;
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }
  if (burger && nav) {
    burger.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.matchMedia("(min-width: 1121px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- Foco de luz que sigue al cursor en tarjetas ---------- */
  if (fine) {
    $$(".line, .svc__c").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", (e.clientX - r.left) + "px");
        c.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Red de datos del hero (sutil) ---------- */
  (function net() {
    var c = $("#net"), hero = $("#inicio"); if (!c || !hero) return;
    var ctx = c.getContext("2d");
    var w = 0, h = 0, nodes = [], mouse = { x: -9999, y: -9999 }, run = true, lastFlag = 0, LINK = 150;

    function size() {
      var r = c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(clamp(w * h / 21000, 24, 70));
      nodes = [];
      for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, r: Math.random() * 1.2 + 0.6, f: 0 });
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      if (anim && t - lastFlag > 2200) { lastFlag = t; nodes[(Math.random() * nodes.length) | 0].f = 1; }
      var i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        if (anim) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
          dx = a.x - mouse.x; dy = a.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120 && d > 0) { a.x += (dx / d) * 0.8; a.y += (dy / d) * 0.8; }
        }
        if (a.f > 0) a.f = Math.max(0, a.f - 0.006);
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            var hot = a.f > 0.05 || b.f > 0.05;
            ctx.strokeStyle = hot ? "rgba(212,178,106," + (0.5 * (1 - d / LINK)).toFixed(3) + ")" : "rgba(143,227,242," + (0.15 * (1 - d / LINK)).toFixed(3) + ")";
            ctx.lineWidth = hot ? 1.1 : 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        dx = a.x - mouse.x; dy = a.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) { ctx.strokeStyle = "rgba(47,184,211," + (0.45 * (1 - d / 180)).toFixed(3) + ")"; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = a.f > 0.05 ? "#d4b26a" : "rgba(160,225,240,.75)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r + a.f * 2.2, 0, 6.283); ctx.fill();
        if (a.f > 0.05) { ctx.strokeStyle = "rgba(212,178,106," + (a.f * 0.6).toFixed(3) + ")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(a.x, a.y, 6 + (1 - a.f) * 32, 0, 6.283); ctx.stroke(); }
      }
    }
    function frame(t) { if (run) draw(t); window.requestAnimationFrame(frame); }
    size();
    if (anim) window.requestAnimationFrame(frame); else draw(0);
    window.addEventListener("resize", function () { size(); if (!anim) draw(0); });
    hero.addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { run = en[0].isIntersecting; }, { threshold: 0 }).observe(hero);
  })();

  /* ---------- Inclinación suave del marco del hero ---------- */
  (function tilt() {
    var vis = $(".hero__vis"), ph = vis && $(".arch .ph");
    if (!vis || !ph || !fine || !anim) return;
    vis.addEventListener("pointermove", function (e) {
      var r = vis.getBoundingClientRect();
      ph.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 7).toFixed(2) + "deg");
      ph.style.setProperty("--rx", (((e.clientY - r.top) / r.height - 0.5) * -7).toFixed(2) + "deg");
    });
    vis.addEventListener("pointerleave", function () { ph.style.setProperty("--rx", "0deg"); ph.style.setProperty("--ry", "0deg"); });
  })();

  /* ---------- Video de fondo del hero: bucle con cruce suave, solo si conviene ---------- */
  (function heroVideo() {
    var a = $("#hero-vid-a"), b = $("#hero-vid-b"), hero = $("#inicio"); if (!a || !b || !hero) return;
    var conn = navigator.connection || {};
    if (!anim || conn.saveData || !window.matchMedia("(min-width: 761px)").matches) return;
    var cur = a, nxt = b, XF = 1.4, swapping = false, inView = true, started = false;
    function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    function swap() {
      if (swapping) return; swapping = true;
      nxt.currentTime = 0; play(nxt); nxt.classList.add("on"); cur.classList.remove("on");
      var old = cur; cur = nxt; nxt = old;
      setTimeout(function () { nxt.pause(); swapping = false; }, XF * 1000 + 200);
    }
    function watch(v) {
      v.addEventListener("timeupdate", function () { if (v === cur && v.duration && v.duration - v.currentTime < XF) swap(); });
      v.addEventListener("ended", function () { if (v === cur) swap(); });
    }
    watch(a); watch(b);
    function start() {
      if (started) return; started = true;
      a.src = a.getAttribute("data-src"); b.src = b.getAttribute("data-src"); b.load();
      a.addEventListener("loadeddata", function () { a.classList.add("on"); play(a); }, { once: true });
      a.load();
    }
    start();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        inView = en[0].isIntersecting;
        if (inView) { if (started) play(cur); } else { a.pause(); b.pause(); }
      }, { threshold: 0.05 }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) { a.pause(); b.pause(); } else if (inView) play(cur); });
  })();

  /* ---------- Ventana de perfiles del equipo ---------- */
  (function profiles() {
    var dlg = $("#prof"); if (!dlg || typeof dlg.showModal !== "function") return;
    var last = null;
    function open(btn) {
      var li = btn.closest(".mem"), full = $(".mem__full", li);
      var img = $("img", btn).cloneNode(true);
      img.removeAttribute("loading");
      var ph = $("#prof-ph"); ph.innerHTML = ""; ph.appendChild(img);
      $("#prof-role").textContent = $(".mem__meta i", btn).textContent;
      $("#prof-name").textContent = $(".mem__meta b", btn).textContent;
      var bio = $("#prof-bio"); bio.innerHTML = "";
      $$("p", full).forEach(function (p) { var n = document.createElement("p"); n.textContent = p.textContent; bio.appendChild(n); });
      var tags = $("#prof-tags"); tags.innerHTML = "";
      $$(".mem__tags em", btn).forEach(function (t) { var n = document.createElement("li"); n.textContent = t.textContent; tags.appendChild(n); });
      $("#prof-link").href = full.getAttribute("data-link");
      last = btn; dlg.showModal(); document.body.style.overflow = "hidden";
    }
    $$("[data-open]").forEach(function (b) { b.addEventListener("click", function () { open(b); }); });
    $("#prof-x").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { document.body.style.overflow = ""; if (last) last.focus(); });
  })();

  /* ---------- Formulario de contacto ----------
     Si el formulario declara data-endpoint, envía allí los datos (JSON). Si no, abre el correo del visitante con la
     consulta ya redactada y la constancia de la autorización incluida en el texto. */
  (function form() {
    var f = $("#form"); if (!f) return;
    var note = $("#form-note"), submit = $("button[type=submit]", f), endpoint = f.getAttribute("data-endpoint");
    function setErr(field, msg) {
      var wrap = field.closest(".fld"), p = wrap && $(".err", wrap);
      if (wrap) wrap.classList.toggle("bad", !!msg);
      if (p) { p.textContent = msg || ""; p.hidden = !msg; }
    }
    function chkErr(errId, ok, msg) { var e = $(errId); e.hidden = ok; e.textContent = ok ? "" : msg; return ok; }
    function mailtoFallback(data) {
      var when = new Date();
      var body = "Servicio: " + data.servicio + "\nNombre: " + data.nombre + "\nOrganización: " + (data.organizacion || "-") +
        "\nCorreo: " + data.correo + "\nTeléfono: " + (data.telefono || "-") + "\n\n" + data.necesidad +
        "\n\n--\nAcepto los Términos y Condiciones y la Política de Privacidad, y autorizo el tratamiento de mis datos para responder esta consulta. Aceptado en el formulario web el " + when.toISOString() + ".";
      window.location.href = "mailto:comercial@sagconsulting.co?subject=" + encodeURIComponent("Consulta web · " + data.servicio) + "&body=" + encodeURIComponent(body);
      note.textContent = "Abrimos su programa de correo con la consulta lista para enviar. Si no se abrió, escríbanos a comercial@sagconsulting.co.";
    }
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = f.nombre, correo = f.correo, msg = f.necesidad, bad = false;
      setErr(nombre, nombre.value.trim().length > 1 ? "" : "Escriba su nombre."); if (nombre.value.trim().length < 2) bad = true;
      var mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.value.trim());
      setErr(correo, mailOk ? "" : "Escriba un correo válido."); if (!mailOk) bad = true;
      setErr(msg, msg.value.trim().length > 9 ? "" : "Cuéntenos brevemente su necesidad."); if (msg.value.trim().length <= 9) bad = true;
      var t = $("#f-terms"), pr = $("#f-priv");
      if (!chkErr("#err-terms", t.checked, "Debe aceptar los Términos y Condiciones.")) bad = true;
      if (!chkErr("#err-priv", pr.checked, "Debe autorizar el tratamiento de sus datos según la Política de Privacidad.")) bad = true;
      if (bad) { note.textContent = "Revise los campos marcados."; var first = $(".bad input, .bad textarea", f) || (!t.checked ? t : pr); if (first) first.focus(); return; }
      if (f.website && f.website.value) return; // campo trampa para robots

      var data = {
        servicio: (f.querySelector('input[name="servicio"]:checked') || {}).value || "Otro asunto",
        nombre: nombre.value.trim(), correo: correo.value.trim(), organizacion: f.organizacion.value.trim(),
        telefono: f.telefono.value.trim(), necesidad: msg.value.trim(), terms: true, privacy: true
      };
      if (!endpoint) { mailtoFallback(data); return; }
      submit.disabled = true; note.textContent = "Enviando…";
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (d) { return { ok: r.ok && d && d.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok) { note.textContent = "Gracias, recibimos su consulta. Le responderemos pronto."; f.reset(); }
          else { note.textContent = "No pudimos enviar su consulta en este momento. Escríbanos a comercial@sagconsulting.co o por WhatsApp."; }
        })
        .catch(function () { mailtoFallback(data); })
        .then(function () { submit.disabled = false; });
    });
    $$("input, textarea", f).forEach(function (i) { i.addEventListener("input", function () { setErr(i, ""); }); });
    $$(".chk input", f).forEach(function (c) { c.addEventListener("change", function () { var e = $(c.id === "f-terms" ? "#err-terms" : "#err-priv"); e.hidden = true; e.textContent = ""; }); });
  })();
})();
