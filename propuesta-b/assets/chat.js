/* SAG · Asistente de soporte (chat) de la propuesta B.
   Parte de js/chat.js del sitio actual y conserva su contrato con el servidor:
   - api/consent.php recibe la autorización ({ action: 'accept', terms, privacy } → { ok, id, token }) y su revocación.
   - api/chat.php recibe { messages, website, consent } y responde { ok, reply }. La clave de IA vive en el servidor.
   Sin esos servicios (vista previa local) la autorización queda solo en este navegador y el asistente responde con
   respuestas preparadas: no se envía nada a terceros. */
(function () {
  'use strict';
  var root = $('#chat'); if (!root) return;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var html = document.documentElement;
  var fab = $('#chat-fab'), panel = $('#chat-panel'), log = $('#chat-log'), chips = $('#chat-chips'),
      form = $('#chat-form'), input = $('#chat-input'), sendBtn = $('#chat-send'), tease = $('#chat-tease');
  var ENDPOINT = root.getAttribute('data-endpoint') || 'api/chat.php';
  var WA = '573138170765', MAIL = 'comercial@sagconsulting.co', TEL = '+57 313 466 1950';
  var KEY = 'sag_chat_v1', MAX_USER_TURNS = 14;
  var msgs = [], busy = false, userTurns = 0, lastSend = 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var GREETING = 'Hola, soy el asistente de SAG. Puedo resolver dudas sobre nuestros servicios de auditoría forense, laboratorio digital, analítica de datos, peritaje y formación. ¿En qué le ayudo?';
  var SUGGESTIONS = [
    '¿Qué es una auditoría forense?',
    '¿Qué servicios ofrecen?',
    'Sospecho de un fraude, ¿qué hago?',
    '¿Cómo manejan la confidencialidad?',
    '¿Cuánto cuesta y cuánto tarda?',
    'Necesito un perito o un dictamen',
    '¿Tienen canal de denuncias?',
    'Cursos de SAG Academy'
  ];

  /* ---------- Autorización (Política de Privacidad): el asistente no envía nada sin ella ---------- */
  var gate = $('#chat-gate'), gTerms = $('#g-terms'), gPriv = $('#g-priv'), gOk = $('#g-ok'), gErr = $('#g-err');
  var CONSENT_URL = root.getAttribute('data-consent') || 'api/consent.php';
  var LEGAL_VER = root.getAttribute('data-legal') || '1.0', CKEY = 'sag_chat_consent_v1', consent = null;
  function loadConsent() {
    try { var c = JSON.parse(localStorage.getItem(CKEY) || 'null'); if (c && c.ver === LEGAL_VER && c.exp > Date.now()) consent = c; } catch (e) {}
  }
  function saveConsent(c) { consent = c; try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch (e) {} }
  function clearConsent() { consent = null; try { localStorage.removeItem(CKEY); } catch (e) {} }
  function syncGate() {
    var ok = !!consent;
    gate.hidden = ok; log.hidden = !ok; form.hidden = !ok; chips.hidden = !ok || msgs.length > 0;
    if (ok) scrollDown();
    if (!ok) { gTerms.checked = false; gPriv.checked = false; gOk.disabled = true; gErr.hidden = true; }
  }
  function postJSON(url, body) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (d) { return { status: r.status, d: d }; }); });
  }

  /* ---------- Respuestas del modo básico (si el asistente con IA no está disponible) ---------- */
  var FAQ = [
    { re: /(auditor[ií]a forense|forense)\b.*(qu[eé] es|consiste|diferen)|qu[eé] es.*forense|diferen.*financiera/i,
      a: 'La auditoría forense busca irregularidades, patrones y conductas (fraude, abuso de confianza, corrupción) y asegura la evidencia para que pueda presentarse ante una autoridad. La auditoría financiera, en cambio, revisa si la información cumple las normas.', s: 'Auditoría forense' },
    { re: /fraude|sospech|robo|malversa|desfalco|corrupci/i,
      a: 'Si sospecha de un fraude, de forma general: no borre ni modifique archivos, evite seguir usando los equipos involucrados, restrinja accesos y no confronte a los sospechosos. Lo mejor es contactar cuanto antes a un especialista.', s: 'Auditoría forense', cta: true },
    { re: /precio|costo|cu[aá]nto cuesta|tarifa|honorario|cotiz|cu[aá]nto (tarda|demora)|plazo|tiempo/i,
      a: 'El valor y el tiempo dependen del alcance, del volumen de información y del tipo de entregable. Un especialista le prepara una propuesta tras conocer su caso.', cta: true },
    { re: /confiden|privad|reserva|secreto|datos personales/i,
      a: 'SAG trabaja con confidencialidad y cuenta con un código de ética y conducta. Le pedimos no compartir datos sensibles por este chat; los detalles se tratan con el equipo por un canal seguro.' },
    { re: /perit|dictamen|audiencia|tribunal|arbitra|lucro|da[nñ]o emergente|juez/i,
      a: 'Elaboramos dictámenes periciales contables y financieros (daño emergente, lucro cesante, informes patrimoniales), contradicción de informes y sustentación en audiencia ante jueces y tribunales de arbitramento.', s: 'Dictámenes periciales', cta: true },
    { re: /digital|celular|computador|servidor|nube|evidencia digital|laboratorio|inform[aá]tica forense/i,
      a: 'Nuestro laboratorio forense digital recauda, asegura y analiza evidencia digital en equipos, celulares, servidores y nube, con imágenes forenses que preservan el original.', s: 'Laboratorio forense digital', cta: true },
    { re: /dato|anal[ií]tica|gobernanza|miner[ií]a|tablero|dashboard/i,
      a: 'Con analítica de datos revisamos todos los registros disponibles, no solo una muestra, para encontrar patrones, anomalías e indicadores. También ofrecemos gobernanza de datos; un especialista le explica el alcance según su caso.', s: 'Analítica y gobernanza de datos', cta: true },
    { re: /denuncia|l[ií]nea [eé]tica|whistle/i,
      a: 'Ofrecemos canales de denuncia como servicio externo: recepción por web, correo y teléfono, procesamiento y clasificación, comité de ética y reportes.', s: 'Otro asunto', cta: true },
    { re: /academy|curso|capacit|formaci|estudiar|inscri|certific/i,
      a: 'SAG Academy ofrece cursos cortos de auditoría forense, analítica de datos, forense digital, peritaje y cumplimiento, en modalidad sincrónica, asincrónica o mixta, con certificado de SAG (educación informal). El catálogo está en la página Academy; para fechas y valores, escríbanos.', s: 'SAG Academy', cta: true },
    { re: /servicio|ofrecen|hacen|qu[eé] (hacen|ofrec)/i,
      a: 'Ofrecemos auditoría forense, laboratorio forense digital, evaluación de riesgo de fraude, OSINT, analítica y gobernanza de datos, dictámenes periciales, apoyo a áreas legales, auditoría de estados financieros y control interno, riesgos en recursos públicos, canales de denuncia y SAG Academy. Puede verlos en la página Experticia.' },
    { re: /contact|hablar|llamar|tel[eé]fono|whats|correo|email|reuni[oó]n|cita|agendar/i,
      a: 'Con gusto: puede escribirnos a ' + MAIL + ', llamar al ' + TEL + ' o usar WhatsApp.', cta: true },
    { re: /ubicaci|d[oó]nde|oficina|bogot|ciudad|pa[ií]s|latinoam/i,
      a: 'Estamos en Bogotá, Colombia, y atendemos casos en Colombia y Latinoamérica.' }
  ];

  /* ---------- Utilidades ---------- */
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify({ msgs: msgs.slice(-20), turns: userTurns })); } catch (e) {} }
  function load() { try { var d = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (d && d.msgs) { msgs = d.msgs; userTurns = d.turns || 0; } } catch (e) {} }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function scrollDown() { log.scrollTop = log.scrollHeight; }

  // Texto → nodos seguros (solo **negrita**, listas con guion y párrafos). Nunca HTML.
  function inline(text, parent) {
    text.split(/(\*\*[^*]+\*\*)/).forEach(function (p) {
      if (/^\*\*[^*]+\*\*$/.test(p)) parent.appendChild(el('strong', null, p.slice(2, -2)));
      else if (p) parent.appendChild(document.createTextNode(p));
    });
  }
  function renderRich(text, box) {
    var list = null;
    text.split(/\n/).forEach(function (line) {
      var m = line.match(/^\s*[-•*]\s+(.*)$/);
      if (m) { if (!list) { list = el('ul'); box.appendChild(list); } var li = el('li'); inline(m[1], li); list.appendChild(li); }
      else { list = null; if (line.trim()) { var p = el('p'); inline(line.trim(), p); box.appendChild(p); } }
    });
  }

  function addBubble(role, text, service, forceCta) {
    var cta = !!forceCta, svc = service || '';
    if (role === 'bot') {
      text = text.replace(/\[\[CTA(?::\s*([^\]]+))?\]\]/g, function (_, s) { cta = true; if (s) svc = s.trim(); return ''; }).trim();
    }
    var row = el('div', 'chat__m chat__m--' + (role === 'user' ? 'u' : 'b'));
    var b = el('div', 'chat__b');
    if (role === 'user') b.textContent = text; else renderRich(text, b);
    row.appendChild(b);
    if (role === 'bot' && cta) row.appendChild(actions(svc));
    log.appendChild(row); scrollDown();
    return text;
  }

  // Acciones al final de una respuesta: WhatsApp, formulario de contacto (con el servicio ya elegido) y correo.
  function actions(service) {
    var box = el('div', 'chat__act');
    var topic = service && service !== 'Otro asunto' ? ' sobre ' + service : '';
    var wa = el('a', 'chat__btn chat__btn--main', 'Escribir por WhatsApp');
    wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola SAG, quiero hacer una consulta' + topic + '.');
    wa.target = '_blank'; wa.rel = 'noopener';
    var contactForm = $('#form');
    var leave = el('a', 'chat__btn', 'Dejar mis datos');
    leave.href = contactForm ? '#contacto' : 'contacto.html' + (service ? '?servicio=' + encodeURIComponent(service) : '') + '#contacto';
    leave.addEventListener('click', function () {
      closePanel();
      if (contactForm && service) $$('input[name="servicio"]', contactForm).forEach(function (r) { if (r.value === service) r.checked = true; });
    });
    var mail = el('a', 'chat__btn chat__btn--ghost', 'Correo');
    mail.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Consulta desde la web' + topic);
    box.appendChild(wa); box.appendChild(leave); box.appendChild(mail);
    return box;
  }

  function typing(on) {
    var t = $('#chat-typing');
    if (on && !t) { t = el('div', 'chat__m chat__m--b'); t.id = 'chat-typing'; var b = el('div', 'chat__b chat__typing'); b.appendChild(el('span', 'vh', 'El asistente está escribiendo…')); b.appendChild(el('i')); b.appendChild(el('i')); b.appendChild(el('i')); t.appendChild(b); log.appendChild(t); scrollDown(); }
    if (!on && t) t.remove();
  }

  /* ---------- Envío ---------- */
  function fallback(q) {
    for (var i = 0; i < FAQ.length; i++) {
      if (FAQ[i].re.test(q)) return { text: FAQ[i].a, service: FAQ[i].s || '', cta: !!FAQ[i].cta };
    }
    return { text: 'Gracias por su pregunta. Para darle una respuesta precisa prefiero que la atienda directamente nuestro equipo.', service: '', cta: true };
  }

  function ask(q) {
    q = (q || '').trim().slice(0, 400);
    if (!q || busy) return;
    var now = Date.now(); if (now - lastSend < 900) return; lastSend = now;
    if (!consent) { syncGate(); return; }
    chips.hidden = true;
    addBubble('user', q); msgs.push({ role: 'user', text: q }); userTurns++; save();
    if (userTurns > MAX_USER_TURNS) {
      var end = 'Hemos conversado bastante por aquí. Para avanzar con su consulta, le invito a hablar directamente con nuestro equipo.';
      addBubble('bot', end, '', true); msgs.push({ role: 'assistant', text: end }); save(); return;
    }
    if (!consent.token) { // vista previa sin servidor: solo respuestas preparadas, nada se envía a terceros
      var f0 = fallback(q); addBubble('bot', f0.text, f0.service, f0.cta); msgs.push({ role: 'assistant', text: f0.text }); save(); return;
    }
    busy = true; sendBtn.disabled = true; typing(true);
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 32000);
    fetch(ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
      body: JSON.stringify({ messages: msgs.slice(-10), website: ($('#chat-hp') || {}).value || '', consent: consent.token }),
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) { return r.json().catch(function () { return { ok: false, code: 'bad' }; }).then(function (d) { return { status: r.status, d: d }; }); })
      .then(function (res) {
        clearTimeout(timer); typing(false);
        if (res.d && res.d.ok && res.d.reply) {
          var clean = addBubble('bot', res.d.reply); msgs.push({ role: 'assistant', text: clean || res.d.reply });
        } else {
          if (res.status === 403 && res.d && res.d.code === 'consent') {
            clearConsent(); syncGate(); addBubble('bot', 'Para continuar necesitamos de nuevo su autorización.'); return;
          }
          var f = fallback(q);
          if (res.d && res.d.code === 'rate') f = { text: 'Hay muchas consultas en este momento. Para atenderle sin demora, escríbanos directamente.', service: '', cta: true };
          addBubble('bot', f.text, f.service, f.cta); msgs.push({ role: 'assistant', text: f.text });
        }
      })
      .catch(function () {
        clearTimeout(timer); typing(false);
        var f = fallback(q);
        addBubble('bot', f.text, f.service, f.cta); msgs.push({ role: 'assistant', text: f.text });
      })
      .then(function () { busy = false; sendBtn.disabled = false; save(); if (!reduce && consent) input.focus(); });
  }

  /* ---------- Abrir / cerrar ---------- */
  function openPanel() {
    panel.hidden = false; root.classList.add('is-open'); html.classList.add('chat-open'); fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Cerrar asistente de soporte'); tease.hidden = true;
    try { sessionStorage.setItem('sag_chat_teased', '1'); } catch (e) {}
    setTimeout(function () { (consent ? input : gTerms).focus(); }, 60); scrollDown();
  }
  function closePanel() {
    panel.hidden = true; root.classList.remove('is-open'); html.classList.remove('chat-open'); fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Abrir asistente de soporte');
  }
  fab.addEventListener('click', function () { if (panel.hidden) openPanel(); else closePanel(); });
  $('#chat-x').addEventListener('click', function () { closePanel(); fab.focus(); });
  $('#chat-tease-go').addEventListener('click', openPanel);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { closePanel(); fab.focus(); } });

  $('#chat-new').addEventListener('click', function () {
    msgs = []; userTurns = 0; save(); log.innerHTML = ''; start(); syncGate();
  });

  form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; autosize(); ask(v); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { cancelable: true })); } });
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; }
  input.addEventListener('input', autosize);

  /* ---------- Inicio ---------- */
  SUGGESTIONS.forEach(function (s) {
    var b = el('button', 'chat__chip', s); b.type = 'button';
    b.addEventListener('click', function () { ask(s); });
    chips.appendChild(b);
  });
  function start() {
    addBubble('bot', GREETING);
    msgs.forEach(function (m) { addBubble(m.role === 'user' ? 'user' : 'bot', m.text); });
    if (msgs.length) chips.hidden = true;
  }
  load(); loadConsent(); start(); syncGate();

  function gateChange() { gOk.disabled = !(gTerms.checked && gPriv.checked); }
  gTerms.addEventListener('change', gateChange); gPriv.addEventListener('change', gateChange);
  gOk.addEventListener('click', function () {
    if (!(gTerms.checked && gPriv.checked)) return;
    gOk.disabled = true; gErr.hidden = true;
    function local() { saveConsent({ local: true, ver: LEGAL_VER, exp: Date.now() + 864e5 }); syncGate(); input.focus(); }
    postJSON(CONSENT_URL, { action: 'accept', terms: true, privacy: true }).then(function (res) {
      if (res.d && res.d.ok && res.d.token) { saveConsent({ id: res.d.id, token: res.d.token, ver: LEGAL_VER, exp: Date.now() + 365 * 864e5 }); syncGate(); input.focus(); }
      else if (res.status === 404 || res.status === 405 || res.status === 501) { local(); }
      else { gErr.textContent = 'No pudimos registrar su autorización. Inténtelo de nuevo o escríbanos a comercial@sagconsulting.co.'; gErr.hidden = false; gateChange(); }
    }).catch(local);
  });
  $('#chat-revoke').addEventListener('click', function () {
    var ref = consent && consent.id;
    if (ref) postJSON(CONSENT_URL, { action: 'revoke', ref: ref }).catch(function () {});
    clearConsent(); msgs = []; userTurns = 0; save(); log.innerHTML = ''; start(); syncGate(); gTerms.focus();
  });

  // Invitación discreta, una sola vez por visita (no en cada página que se recorre)
  try {
    if (!sessionStorage.getItem('sag_chat_teased')) {
      setTimeout(function () {
        if (!panel.hidden) return;
        try { sessionStorage.setItem('sag_chat_teased', '1'); } catch (e) {}
        tease.hidden = false; setTimeout(function () { tease.hidden = true; }, 9000);
      }, 10000);
    }
  } catch (e) {}
})();
