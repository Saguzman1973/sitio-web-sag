// Genera la PROPUESTA B "Expediente" (propuesta-b/) desde src-b/ y el contenido compartido de src/content.js.
// Imágenes, fotos del equipo y video: src/assets/. Fuentes: src-b/fonts/. Mapa: src-b/mapa-latam.json.
const fs = require('fs'), path = require('path');
const { SVC, AREAS, SECTORES, POSTS, TEAM, SENIORS, STEPS, ACADEMY_URL, ADDRESS } = require('./src/content.js');
const OUT = path.join(__dirname, 'propuesta-b');
const SRC = path.join(__dirname, 'src-b');
const P = (t) => `<span class="pending">[PENDIENTE: ${t}]</span>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const A = (p) => `assets/${p}`;

const C = {
  email: 'comercial@sagconsulting.co', tel: '+57 313 466 1950', telRaw: '+573134661950', wa: '+57 313 817 0765', waRaw: '573138170765',
  li: 'https://www.linkedin.com/company/sag-assesment-consulting-sas/', ig: 'https://www.instagram.com/sag.consulting/',
  liSimon: 'https://www.linkedin.com/in/simon-alejandro-guzman-mba-cfcs-cgap-1a299b29/',
  legal: { t: 'https://www.sagconsulting.co/terminos.html', p: 'https://www.sagconsulting.co/privacidad.html', c: 'https://www.sagconsulting.co/cookies.html', e: 'https://www.sagconsulting.co/nosotros/codigo-de-etica-y-conducta/' },
  ia: 'Algunas imágenes y el video de fondo fueron generados con inteligencia artificial y no representan clientes ni instalaciones reales.',
};

const NAV = [['experticia', 'Experticia', '01'], ['equipo', 'Equipo', '02'], ['resultados', 'Resultados', '03'], ['contacto', 'Contacto', '04']];
const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = { arr: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'), up: svg('<path d="M7 17 17 7M8 7h9v9"/>') };
const btn = (href, text, cls = '', extra = '') => `<a class="btn ${cls}" href="${href}"${extra}>${text}<i>${I.arr}</i></a>`;
const ml = (lines) => lines.map((l, i) => `<span class="ml" style="--i:${i}"><span>${l}</span></span>`).join('');
const strip = (s) => s.replace(/<[^>]+>/g, '');
const label = (n, t) => `<p class="label"><b>${n}</b> ${t}</p>`;

// ---------- Personas (orden: socio fundador, equipo directivo, senior) ----------
const SIMON = {
  n: 'Simón Guzmán Guerrero', r: 'Socio fundador', tags: ['MBA', 'CGAP', 'CFCS', 'Avaluador acreditado'], img: 'equipo/simon-900.webp', li: C.liSimon,
  bio: ['Economista, especialista en Administración Financiera y control fiscal, con máster en dirección y administración de empresas. Auditor forense con más de 30 años de experiencia en investigación de fraude, recuperación de activos y gobierno de organizaciones públicas y privadas en Colombia y Latinoamérica.', 'Actúa como perito ante jueces y tribunales. Es profesor de auditoría forense en la Pontificia Universidad Javeriana y autor de libros sobre la materia.'],
};
const PEOPLE = [SIMON, ...TEAM.map((m) => ({ ...m, img: 'equipo/' + m.img }))];
const peopleJson = JSON.stringify(PEOPLE.map((m) => ({ n: m.n, r: m.r, tags: m.tags, img: A('img/' + m.img), li: m.li, bio: m.bio }))).replace(/</g, '\\u003c');
const SEN = SENIORS.map(([n, img]) => ({ n, r: 'Senior de investigaciones forenses', img: 'equipo/' + img }));

// ---------- Plantillas compartidas ----------
const header = (cur) => `
<a class="skip" href="#contenido">Saltar al contenido</a>
<div class="prog" aria-hidden="true"></div>
<header class="head" id="head">
  <div class="wrap head__in">
    <a class="head__logo" href="index.html" aria-label="SAG Assessment &amp; Consulting, inicio"><img src="${A('img/logo-sag-blanco.svg')}" alt="SAG Assessment &amp; Consulting" width="74" height="41"></a>
    <nav class="nav" aria-label="Principal">${NAV.map(([s, t, n]) => `<a href="${s}.html"${s === cur ? ' aria-current="page"' : ''}><sup>${n}</sup>${t}</a>`).join('')}</nav>
    <a class="head__cta" href="contacto.html">Consultar un caso</a>
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú"><i></i><i></i></button>
  </div>
</header>
<div class="menu" id="menu">
  <nav aria-label="Menú"><ol>${[['index', 'Inicio', '00'], ...NAV].map(([s, t, n], i) => `<li style="--i:${i}"><a href="${s}.html"><span>${n}</span>${t}</a></li>`).join('')}</ol></nav>
  <div class="menu__foot mono"><a href="mailto:${C.email}">${C.email}</a><a href="tel:${C.telRaw}">${C.tel}</a><span>Bogotá, Colombia</span></div>
</div>`;

const footer = () => `
<footer class="foot">
  <div class="wrap">
    <div class="foot__top">
      <p class="foot__claim">Del dato al hecho. Del hecho <em>al dictamen.</em></p>
      <div><h2>Navegación</h2><ul><li><a href="index.html">Inicio</a></li>${NAV.map(([s, t]) => `<li><a href="${s}.html">${t}</a></li>`).join('')}</ul></div>
      <div><h2>Contacto</h2><ul>
        <li><a href="mailto:${C.email}">${C.email}</a></li>
        <li><a href="tel:${C.telRaw}">${C.tel}</a></li>
        <li><a href="https://wa.me/${C.waRaw}" target="_blank" rel="noopener">WhatsApp ${C.wa}</a></li>
        <li>Bogotá, Colombia</li></ul></div>
      <div><h2>Firma</h2><ul>
        <li><a href="${C.li}" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="${C.ig}" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="${C.legal.e}" target="_blank" rel="noopener">Código de ética</a></li></ul></div>
    </div>
    <div class="foot__markbox" aria-hidden="true"><img class="foot__mark" src="${A('img/logo-sag-blanco.svg')}" alt="" width="1420" height="784" loading="lazy"></div>
  </div>
  <div class="wrap foot__bot">
    <p>© <span id="year">2026</span> SAG Assessment &amp; Consulting S.A.S. · NIT 900.951.905-5 · Bogotá, Colombia<small class="foot__ia">${C.ia}</small></p>
    <nav aria-label="Legal">
      <a href="${C.legal.t}" target="_blank" rel="noopener">Términos y Condiciones</a>
      <a href="${C.legal.p}" target="_blank" rel="noopener">Política de Privacidad</a>
      <a href="${C.legal.c}" target="_blank" rel="noopener">Política de Cookies</a>
      <a href="#top">Volver arriba ↑</a>
    </nav>
  </div>
</footer>
<div class="cur" aria-hidden="true"><div class="cur__ring"><span></span></div><div class="cur__dot"></div></div>`;

const phead = (o) => `
<section class="phead">
  <div class="wrap phead__grid">
    <nav class="crumbs mono" aria-label="Ruta de navegación"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><span>${o.crumb}</span></nav>
    <h1 aria-label="${esc(strip(o.h1.join(' ')))}">${ml(o.h1)}</h1>
    <p class="lead rvh">${o.lead}</p>
  </div>
  <div class="phead__line" aria-hidden="true"></div>
</section>`;

const shead = (n, t, h2, lead, dark) => `
<header class="shead">
  ${label(n, t)}
  <h2 class="display rvl" aria-label="${esc(strip(h2.join(' ')))}">${ml(h2)}</h2>
  ${lead ? `<p class="lead rv">${lead}</p>` : ''}
</header>`;

const marquee = (items, dark, dir) => `
<div class="mq${dark ? ' mq--ink' : ''}"${dir ? ` data-dir="${dir}"` : ''} aria-hidden="true"><div class="mq__track">${[0, 1].map(() => items.map((t) => `<span>${t}</span>`).join('')).join('')}</div></div>`;

const cta = () => `
<section class="sec cta" id="consulta">
  <div class="wrap">
    ${label('§', 'Consulta confidencial')}
    <h2 class="cta__big rvl" style="margin-top:30px" aria-label="¿Tiene una sospecha que necesita convertirse en prueba?">${ml(['¿Tiene una sospecha', 'que necesita', '<em>convertirse en prueba?</em>'])}</h2>
    <div class="cta__row">
      <div class="rv">
        <p class="lead">Basta una descripción general. Si el caso avanza, le pediremos nombres y documentos por un canal seguro.</p>
        <p style="margin-top:28px">${btn('contacto.html', 'Consultar un caso', 'btn--red', ' data-mag')}</p>
      </div>
      <ul class="ch rv">
        <li><span class="mono">Correo</span><a href="mailto:${C.email}">${C.email}</a></li>
        <li><span class="mono">Teléfono</span><a href="tel:${C.telRaw}">${C.tel}</a></li>
        <li><span class="mono">WhatsApp</span><a href="https://wa.me/${C.waRaw}" target="_blank" rel="noopener">${C.wa}</a></li>
      </ul>
    </div>
  </div>
</section>`;

// ---------- Bloques ----------
const LINES = [
  { cls: 'card--ink', n: '01', lb: 'Fraude, corrupción y abuso de confianza', t: 'Auditoría <em>forense</em>', d: 'Prevención, detección e investigación de fraude, corrupción y abuso de confianza, en el sector público y en el privado.', ul: ['Investigación de fraude y corrupción', 'Laboratorio forense digital', 'Evaluación de riesgo de fraude', 'OSINT y debida diligencia'], img: 'img/ventajas.webp', w: 1536, h: 1024, alt: 'Estación de análisis forense digital con disco, bolsa de evidencia y lupa (imagen generada con IA)', cap: 'Laboratorio forense digital' },
  { cls: 'card--light', n: '02', lb: 'Minería, visualización y automatización', t: 'Analítica de datos <em>forense</em>', d: 'Revisamos todas las transacciones, no una muestra. Minería, visualización y automatización para encontrar lo que el muestreo no ve.', ul: ['Analítica forense de transacciones', 'Monitoreo y alertas tempranas', 'Gobernanza y calidad de datos', 'Tableros para la toma de decisiones'], img: 'img/hero.webp', w: 1024, h: 1536, alt: 'Analista forense revisando visualizaciones de datos en una oficina oscura (imagen generada con IA)', cap: 'Analítica sobre el 100% de los registros' },
  { cls: 'card--red', n: '03', lb: 'Peritaje contable y financiero forense', t: 'Dictámenes <em>periciales</em>', d: 'Peritaje contable y financiero forense para procesos judiciales, arbitrales y administrativos, con sustentación en audiencia.', ul: ['Daño emergente y lucro cesante', 'Contradicción de dictámenes', 'Tacha de documentos', 'Apoyo técnico a equipos legales'], img: 'img/banda.webp', w: 1536, h: 1024, alt: 'Panorámica de Bogotá al atardecer desde una oficina (imagen generada con IA)', cap: 'Bogotá, Colombia' },
];
const expertBlock = () => `
<section class="sec sec--paper2" id="experticia">
  <div class="wrap">
    ${shead('§ 02', 'Experticia', ['Tres líneas.', '<em>Un solo expediente.</em>'], 'Auditoría forense, analítica de datos y dictámenes periciales se contratan por separado y, cuando el caso lo pide, trabajan juntos sobre la misma evidencia.')}
    <div class="stack">${LINES.map((l, i) => `
      <article class="card ${l.cls}" style="--i:${i}">
        <div class="card__txt">
          <div class="card__top"><span class="card__n">${l.n}</span><span class="mono">${l.lb}</span></div>
          <h3>${l.t}</h3>
          <p>${l.d}</p>
          <ul>${l.ul.map((t, k) => `<li>${t}<span>${pad(k + 1)}</span></li>`).join('')}</ul>
          <a class="ulink" href="experticia.html#servicios">Ver los servicios ${I.up}</a>
        </div>
        <figure class="card__fig"><img src="${A(l.img)}" alt="${esc(l.alt)}" width="${l.w}" height="${l.h}" loading="lazy"><figcaption class="mono"><span>${l.cap}</span><span>Línea ${l.n}</span></figcaption></figure>
      </article>`).join('')}
    </div>
  </div>
</section>`;

const TILES = [
  ['600', '+', 'Casos atendidos', 'De manera exitosa, con la evidencia y el rigor que cada caso exige.'],
  ['150', '+', 'Clientes', 'Organizaciones que han confiado en SAG para prevenir, detectar e investigar el fraude.'],
  ['30', '+', 'Años del socio fundador', 'Investigando fraude y corrupción en Colombia y Latinoamérica.'],
  ['10', '+', 'Años de experiencia', 'Fortaleciendo la gestión de nuestros clientes como socios estratégicos en la investigación y prevención de casos de fraude.'],
  ['15', '', 'Servicios integrados', 'De la auditoría forense y el laboratorio digital a la analítica, el peritaje y la formación.'],
  ['6', '', 'Años Highly Recommended', 'Seis años consecutivos en el ranking de firmas de Leaders League.'],
];
const statsBlock = (n) => `
<section class="sec sec--ink" id="cifras">
  <div class="wrap">
    ${shead(n, 'Resultados', ['SAG <em>en cifras.</em>'], 'Lo que la firma ha hecho y la experiencia que la respalda.', true)}
    <div class="tiles" data-stagger>${TILES.map(([v, s, h, d], i) => `
      <div class="tile rv"><span class="mono">${pad(i + 1)}</span><div class="tile__n">${s ? `<sup>${s}</sup>` : ''}<span class="odo">${v}</span></div><h3>${h}</h3><p>${d}</p></div>`).join('')}
    </div>
    <p class="tiles__note mono">Cifras publicadas por SAG en www.sagconsulting.co</p>
  </div>
</section>`;

const scenes = `
<div class="method__vis" aria-hidden="true">
  <div class="scene"><div class="win"><div class="win__bar"><i></i><i></i><i></i><span class="mono">01 · Alcance y preguntas</span></div>
    <div class="win__body"><ul class="q">
      <li style="--k:0"><i></i><b>¿Qué se sabe?</b><span>Hechos</span></li>
      <li style="--k:1"><i></i><b>¿Qué se sospecha?</b><span>Hipótesis</span></li>
      <li style="--k:2"><i></i><b>¿Qué debe responder la investigación?</b><span>Preguntas</span></li>
      <li style="--k:3"><i></i><b>¿Hasta dónde llega el encargo?</b><span>Alcance</span></li>
    </ul></div><div class="win__foot">Representación ilustrativa</div></div></div>
  <div class="scene"><div class="win"><div class="win__bar"><i></i><i></i><i></i><span class="mono">02 · Cadena de custodia</span></div>
    <div class="win__body"><ul class="cust">
      <li style="--k:0"><span>EV-001</span><b>Equipo portátil · imagen forense</b><em>Asegurado</em></li>
      <li style="--k:1"><span>EV-002</span><b>Celular · extracción</b><em>Asegurado</em></li>
      <li style="--k:2"><span>EV-003</span><b>Correo corporativo · exportación</b><em>Asegurado</em></li>
      <li style="--k:3"><span>EV-004</span><b>Registros contables · ERP</b><em>Asegurado</em></li>
    </ul>
    <div class="hash"><span>Huella SHA-256 (ilustrativa)</span>9f2c 41ab e07d 3c55 b1f8 6a90 2d47 c3e1 58aa 0b6d e2f4 7c19</div>
    <div class="stamp">Custodia</div></div><div class="win__foot">Representación ilustrativa</div></div></div>
  <div class="scene"><div class="win"><div class="win__bar"><i></i><i></i><i></i><span class="mono">03 · Análisis de registros</span></div>
    <div class="win__body"><div class="scan"></div><table class="tbl"><thead><tr><th>Registro</th><th>Fecha</th><th>Tercero</th><th>Valor</th></tr></thead><tbody>
      <tr><td>004812</td><td>03/02</td><td>Proveedor A</td><td>12.400.000</td></tr>
      <tr class="fl" style="--t:1.1s"><td>004813</td><td>03/02</td><td>Proveedor A</td><td>12.400.000</td></tr>
      <tr><td>004814</td><td>04/02</td><td>Proveedor C</td><td>3.150.500</td></tr>
      <tr><td>004815</td><td>05/02</td><td>Proveedor D</td><td>860.000</td></tr>
      <tr><td>004816</td><td>06/02</td><td>Proveedor B</td><td>4.725.900</td></tr>
      <tr class="fl" style="--t:2s"><td>004817</td><td>06/02</td><td>Proveedor F</td><td>9.990.000</td></tr>
      <tr><td>004818</td><td>07/02</td><td>Proveedor C</td><td>1.204.300</td></tr>
      <tr><td>004819</td><td>08/02</td><td>Proveedor E</td><td>2.388.000</td></tr>
    </tbody></table>
    <div class="flagline mono"><span>Población revisada: 100%</span><em>2 alertas por validar</em></div></div><div class="win__foot">Representación ilustrativa</div></div></div>
  <div class="scene"><div class="win"><div class="win__bar"><i></i><i></i><i></i><span class="mono">04 · Informe y dictamen</span></div>
    <div class="win__body"><div class="doc"><h4>Informe de investigación</h4><small>Expediente · Reservado</small>
      <div class="hd" style="--k:0">1. Hechos</div><div class="ln" style="--k:1"></div><div class="ln m" style="--k:2"></div><div class="ln s" style="--k:3"></div>
      <div class="hd" style="--k:4">2. Hallazgos</div><div class="ln" style="--k:5"></div><div class="ln m" style="--k:6"></div>
      <div class="hd" style="--k:7">3. Conclusión</div><div class="ln s" style="--k:8"></div>
      <div class="stamp">Sustentado</div></div></div><div class="win__foot">Representación ilustrativa</div></div></div>
</div>`;

const methodBlock = (n) => `
<section class="method" id="metodo">
  <div class="method__pin"><div class="wrap method__grid">
    <div class="method__txt">
      ${label(n, 'Método')}
      <h2 class="display rvl" style="margin-top:26px" aria-label="Del dato al dictamen, sin saltos.">${ml(['Del dato al dictamen,', '<em>sin saltos.</em>'])}</h2>
      <ol class="msteps">${STEPS.map(([t, d], i) => `<li class="mstep"><b>${pad(i + 1)}</b><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
      <ol class="mnav" aria-hidden="true">${STEPS.map(([t]) => `<li>${t}</li>`).join('')}</ol>
    </div>
    ${scenes}
  </div></div>
</section>`;

const founder = (full) => `
<article class="founder">
  <figure class="founder__ph rvi"><img src="${A('img/equipo/simon-900.webp')}" alt="Retrato de Simón Guzmán Guerrero" width="900" height="1079" loading="lazy"><figcaption class="mono">Socio fundador</figcaption></figure>
  <div class="founder__body">
    ${label('Liderazgo', '')}
    <h3 class="founder__name rvl" aria-label="Simón Guzmán Guerrero">${ml(['Simón Guzmán', 'Guerrero'])}</h3>
    <p class="founder__role mono">Socio fundador</p>
    ${SIMON.bio.map((b) => `<p class="rv">${b}</p>`).join('')}
    <ul class="creds rv">${SIMON.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
    <dl class="trail rv">
      <div><dt>Deloitte</dt><dd>Dirigió prácticas forenses; director para la Región Andina</dd></div>
      <div><dt>BDO</dt><dd>Dirigió la práctica forense</dd></div>
      <div><dt>Contraloría General de la República</dt><dd>Contralor Delegado Intersectorial, a cargo del Sistema General de Regalías</dd></div>
      ${full ? '<div><dt>Academia</dt><dd>Profesor de auditoría forense en la Pontificia Universidad Javeriana y autor de libros sobre la materia</dd></div>' : ''}
    </dl>
    <p class="rv"><a class="ulink" href="${C.liSimon}" target="_blank" rel="noopener">Ver perfil en LinkedIn ${I.up}</a></p>
  </div>
</article>`;

const DISC = `<p class="disc rv"><i>Formación del equipo</i><span>Contaduría</span><span>Derecho</span><span>Economía</span><span>Ingeniería de sistemas</span></p>`;

const roster = () => `
<div class="roster">
  <div class="roster__h mono"><span>Equipo directivo y senior</span><span>Toque un nombre para ver el perfil</span></div>
  ${PEOPLE.slice(1).map((m, i) => `
  <button class="rrow" type="button" data-person="${i + 1}" data-img="${A('img/' + m.img)}" data-cursor="Perfil">
    <span class="rrow__n">${pad(i + 2)}</span><span class="rrow__ph"><img src="${A('img/' + m.img)}" alt="" width="480" height="480" loading="lazy"></span>
    <span class="rrow__name">${m.n}</span><span class="rrow__role">${m.r}</span>
    <span class="rrow__tags">${m.tags.map((t) => `<span>${t}</span>`).join('')}</span><span class="rrow__go">${I.up}</span>
  </button>`).join('')}
  ${SEN.map((m, i) => `
  <div class="rrow" data-img="${A('img/' + m.img)}">
    <span class="rrow__n">${pad(PEOPLE.length + i + 1)}</span><span class="rrow__ph"><img src="${A('img/' + m.img)}" alt="" width="480" height="600" loading="lazy"></span>
    <span class="rrow__name">${m.n}</span><span class="rrow__role">${m.r}</span><span class="rrow__tags"><span>Investigación forense</span></span><span></span>
  </div>`).join('')}
</div>
<div class="rprev" aria-hidden="true"><img src="${A('img/' + PEOPLE[1].img)}" alt="" width="480" height="480" loading="lazy"></div>`;

const dialog = `
<dialog class="prof" id="prof" aria-labelledby="prof-name">
  <button class="prof__x" id="prof-x" type="button" aria-label="Cerrar perfil"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  <div class="prof__ph" id="prof-ph"></div>
  <div class="prof__body">
    <p class="label" id="prof-role"></p>
    <h3 id="prof-name"></h3>
    <div class="prof__bio" id="prof-bio"></div>
    <ul class="prof__tags" id="prof-tags"></ul>
    <a class="btn" id="prof-link" href="#" target="_blank" rel="noopener">Ver perfil en LinkedIn<i>${I.up}</i></a>
  </div>
</dialog>
<script type="application/json" id="people">${peopleJson}</script>`;

const teamBlock = (n) => `
<section class="sec" id="equipo">
  <div class="wrap">
    ${shead(n, 'Equipo', ['Experiencia que', '<em>sostiene cada dictamen.</em>'], 'Un equipo multidisciplinario, con formación en contaduría, derecho, economía e ingeniería de sistemas, liderado por un socio fundador con más de 30 años en investigación de fraude.')}
    ${founder(false)}
    ${roster()}
    ${DISC}
    <p class="rv" style="margin-top:44px">${btn('equipo.html', 'Conozca al equipo')}</p>
  </div>
</section>
${dialog}`;

const mapData = fs.readFileSync(path.join(SRC, 'mapa-latam.json'), 'utf8');
const coverBlock = (n) => `
<section class="sec sec--ink" id="cobertura">
  <div class="wrap cov__grid">
    <div>
      ${label(n, 'Cobertura')}
      <h2 class="display rvl" style="margin-top:28px" aria-label="Desde Bogotá, para Colombia y Latinoamérica.">${ml(['Desde Bogotá,', 'para <em>Colombia</em>', '<em>y Latinoamérica.</em>'])}</h2>
      <ul class="legend rv">
        <li><i></i><b>Colombia</b><span class="mono">Sede · Bogotá</span></li>
        <li><i></i><b>Ecuador</b><span class="mono">Procesos liderados</span></li>
        <li><i></i><b>México</b><span class="mono">Procesos liderados</span></li>
        <li><i></i><b>Perú</b><span class="mono">Procesos liderados</span></li>
      </ul>
      <p class="cov__note rv">Además de Colombia, nuestro equipo ha liderado procesos en países como Ecuador, México y Perú.</p>
    </div>
    <div class="map rv" role="img" aria-label="Mapa de Latinoamérica con Bogotá como sede y conexiones hacia Ecuador, Perú y México"><canvas></canvas></div>
  </div>
  <script type="application/json" id="map-data">${mapData}</script>
</section>`;

const AWARDS = [
  ['6×', 'Highly Recommended', 'Leaders League'],
  ['2025', 'Ranked Firm', 'Leaders League'],
  ['2025', 'Best Forensic Auditing &amp; Compliance Advisory Firm · Latin America', 'Management Consulting Awards'],
  ['2025', 'Client Service Excellence Award', 'Management Consulting Awards'],
  ['2024', 'Best Fraud Detection Consulting Firm', 'Management Consulting Awards'],
];
const recBlock = (n) => `
<section class="sec" id="reconocimientos">
  <div class="wrap rec__grid">
    <div class="seals rv">
      <span class="seals__six" aria-hidden="true">6</span>
      <img class="ll" src="${A('img/leaders-league-ranked-2025.webp')}" alt="Sello de Leaders League: Ranked Firm 2025" width="560" height="560" loading="lazy">
      <img class="wf" src="${A('img/wealth-finance.webp')}" alt="Wealth &amp; Finance International" width="448" height="210" loading="lazy">
    </div>
    <div>
      ${label(n, 'Reconocimientos')}
      <h2 class="display rvl" style="margin:28px 0 40px" aria-label="Seis años consecutivos altamente recomendados.">${ml(['Seis años consecutivos', '<em>altamente recomendados.</em>'])}</h2>
      <ul class="aw" data-stagger>${AWARDS.map(([y, t, s]) => `<li class="rv"><b>${y}</b><h3>${t}</h3><span class="mono">${s}</span></li>`).join('')}</ul>
      <p class="mono" style="margin-top:18px;color:var(--mute)">Los Management Consulting Awards son otorgados por Wealth &amp; Finance International.</p>
    </div>
  </div>
</section>`;

const bandBlock = () => `
<section class="band">
  <div class="band__media" data-par="0.06"><img src="${A('video/hero-bg-poster.webp')}" alt="" width="1280" height="720" loading="lazy"><video muted loop playsinline preload="none" data-src="${A('video/hero-bg.mp4')}"></video></div>
  <div class="band__shade" aria-hidden="true"></div>
  <div class="wrap band__in">
    <p class="band__q rvl">${ml(['Rigor técnico, trazabilidad', 'y un criterio que se sostiene', '<em>ante cualquier autoridad.</em>'])}</p>
    <div class="band__meta mono rv"><div>Desde<b>2019</b></div><div>Servicios<b>15</b></div><div>Cobertura<b>Colombia y Latinoamérica</b></div></div>
  </div>
</section>`;

// ---------- Páginas ----------
const MQ1 = ['Auditoría forense', 'Laboratorio forense digital', 'Analítica de datos', 'Gobernanza de datos', 'Dictámenes periciales', 'OSINT', 'Debida diligencia', 'Cumplimiento', 'SAG Academy'];
const pages = {};

pages.index = { title: 'SAG Assessment & Consulting | Auditoría forense en Colombia', desc: 'Firma colombiana de auditoría forense, analítica de datos y dictámenes periciales. Del dato al hecho. Del hecho al dictamen.', intro: true, body: () => `
<section class="hero" id="inicio">
  <div class="hero__pin">
    <canvas class="hero__cv" id="field" aria-hidden="true"></canvas>
    <div class="hero__shade" aria-hidden="true"></div>
    <div class="wrap hero__meta mono"><span><i></i>Consultoría forense · Bogotá, Colombia</span><span>Highly Recommended · Leaders League · 6 años</span></div>
    <aside class="ficha" aria-label="Ficha ilustrativa de un expediente">
      <div><span>Expediente</span><b>SAG · 2026 · 0417</b></div>
      <div><span>Estado</span><b class="r" id="f-st">En análisis</b></div>
      <div><span>Registros revisados</span><b id="f-rec">0</b></div>
      <div><span>Alertas</span><b id="f-al">00</b></div>
      <small>Representación ilustrativa · no corresponde a un caso real</small>
    </aside>
    <div class="wrap hero__body">
      <h1 class="hero__title" aria-label="Del dato al hecho. Del hecho al dictamen.">${ml(['Del dato al hecho.', 'Del hecho <em>al dictamen.</em>'])}</h1>
      <div class="hero__row rvh">
        <p class="hero__lead">Somos una firma colombiana con amplia experiencia en prevención, detección y contención de fraude, abuso de confianza y corrupción. Auditoría forense, laboratorio forense digital, analítica y gobernanza de datos, peritaje y formación, en un solo equipo.</p>
        <div class="hero__cta">${btn('contacto.html', 'Consultar un caso', 'btn--red', ' data-mag')}${btn('#metodo', 'Cómo trabajamos', 'btn--line')}</div>
      </div>
      <div class="hero__stats rvh">
        <div><b>+30</b><span class="mono">Años del socio fundador</span></div>
        <div><b>+600</b><span class="mono">Casos atendidos</span></div>
        <div><b>+150</b><span class="mono">Clientes</span></div>
        <div><b>6</b><span class="mono">Años Highly Recommended</span></div>
      </div>
    </div>
  </div>
</section>
${marquee(MQ1, true)}
<section class="mf" aria-label="Manifiesto">
  <div class="mf__pin"><div class="wrap mf__grid">
    ${label('§ 01', 'Manifiesto')}
    <div>
      <p class="mf__text" data-words>Una investigación débil no se sostiene ante una autoridad. Por eso trabajamos para que cada conclusión tenga <em>evidencia detrás</em> y pueda <em>explicarse con claridad</em> ante un juez, un ente de control o una junta directiva.</p>
      <div class="mf__sign rv"><a class="ulink" href="equipo.html">Conozca a quienes llevan su caso ${I.up}</a><span class="mono" style="color:var(--mute)">Auditoría forense · Analítica · Peritaje</span></div>
    </div>
  </div></div>
</section>
${expertBlock()}
${statsBlock('§ 03')}
${methodBlock('§ 04')}
${teamBlock('§ 05')}
${coverBlock('§ 06')}
${recBlock('§ 07')}
${bandBlock()}
${cta()}` };

// Las claves '10'…'15' son numéricas para JavaScript y quedarían antes que '01'…'09': se ordenan explícitamente.
const SVCS = Object.keys(SVC).sort().map((k) => SVC[k]);
const CATS = [];
for (const s of SVCS) if (!CATS.includes(s.c)) CATS.push(s.c);
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
pages.experticia = { title: 'Experticia | SAG Assessment & Consulting', desc: 'Quince servicios de auditoría forense, analítica de datos, peritaje, cumplimiento y formación.', body: () => `
${phead({ crumb: 'Experticia', h1: ['Quince servicios,', '<em>un solo método.</em>'], lead: 'Somos su aliado estratégico en la prevención y detección de fraude, las investigaciones, el análisis proactivo de datos y la defensa judicial mediante informes periciales.' })}
<section class="sec" id="servicios">
  <div class="wrap">
    ${shead('§ 01', 'Índice de servicios', ['Prevenir, detectar', '<em>e investigar.</em>'], 'Elija un frente para filtrar. Cada servicio se contrata por separado o se integra en el mismo expediente.')}
    <div class="filt rv" role="group" aria-label="Filtrar servicios por frente">
      <button type="button" data-f="todos" aria-pressed="true">Todos<i></i></button>${CATS.map((c) => `<button type="button" data-f="${slug(c)}" aria-pressed="false">${c}<i></i></button>`).join('')}
    </div>
    <ul class="sv">${SVCS.map((s) => `
      <li class="sv__row" data-cat="${slug(s.c)}">
        <button class="sv__btn" type="button" aria-expanded="false"><span class="sv__n">${s.n}</span><span class="sv__t">${esc(s.t)}</span><span class="sv__c">${esc(s.c)}</span><span class="sv__i" aria-hidden="true">+</span></button>
        <div class="sv__panel"><div><div class="sv__inner"><p>${esc(s.d)}</p><ul>${s.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>${s.n === '15' ? (ACADEMY_URL ? `<a class="ulink" href="${ACADEMY_URL}" target="_blank" rel="noopener">Ir a SAG Academy ${I.up}</a>` : P('enlace a SAG Academy')) : ''}</div></div></div>
      </li>`).join('')}
    </ul>
  </div>
</section>
${marquee(AREAS, true, 'r')}
<section class="sec sec--ink">
  <div class="wrap">
    ${shead('§ 02', 'Cobertura temática', ['Áreas de práctica', '<em>y sectores.</em>'], 'Trabajamos con organizaciones públicas y privadas de distintos sectores, con un enfoque interdisciplinario.', true)}
    <div class="reach">
      <div class="rv"><h3>Áreas de práctica</h3><ul class="chips">${AREAS.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>
      <div class="rv"><h3>Sectores</h3><ul class="chips">${SECTORES.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>
    </div>
  </div>
</section>
${methodBlock('§ 03')}
<section class="sec" id="publicaciones">
  <div class="wrap">
    ${shead('§ 04', 'Conocimiento', ['Ideas y análisis de', '<em>nuestros especialistas.</em>'], 'Artículos sobre fraude, auditoría forense, analítica, peritaje y cumplimiento, escritos por el equipo de SAG.')}
    <div class="pubs" data-stagger>${POSTS.slice(0, 8).map((p) => `
      <a class="rv" href="${p.u}" target="_blank" rel="noopener" data-cursor="Leer"><time datetime="${p.dt}">${p.d}</time><h3>${esc(p.t)}</h3><span>${esc(p.cat)}</span>${I.up}</a>`).join('')}
    </div>
    <p class="rv" style="margin-top:40px;display:flex;flex-wrap:wrap;gap:12px">${btn(C.li, 'LinkedIn de SAG', '', ' target="_blank" rel="noopener"')}${btn(C.liSimon, 'Simón Guzmán en LinkedIn', 'btn--line', ' target="_blank" rel="noopener"')}</p>
  </div>
</section>
${cta()}` };

pages.equipo = { title: 'Equipo | SAG Assessment & Consulting', desc: 'Socio fundador, equipo directivo y senior de SAG Assessment & Consulting.', body: () => `
${phead({ crumb: 'Equipo', h1: ['Los investigadores', '<em>detrás de cada caso.</em>'], lead: 'Un equipo multidisciplinario, con formación en contaduría, derecho, economía e ingeniería de sistemas, liderado por un socio fundador con más de 30 años en investigación de fraude.' })}
<section class="sec" aria-labelledby="h-fundador">
  <h2 class="vh" id="h-fundador">Socio fundador</h2>
  <div class="wrap">${founder(true)}</div>
</section>
<section class="sec sec--paper2">
  <div class="wrap">
    ${shead('§ 02', 'Equipo directivo y senior', ['Quienes llevan', '<em>su caso.</em>'], 'Contadores, economistas, abogados e ingenieros que trabajan juntos sobre el mismo expediente.')}
    <div class="people" data-stagger>${PEOPLE.slice(1).map((m, i) => `
      <button class="pcard rv" type="button" data-person="${i + 1}" data-cursor="Perfil">
        <span class="pcard__ph"><img src="${A('img/' + m.img)}" alt="Retrato de ${m.n}" width="480" height="480" loading="lazy"><span class="mono">${pad(i + 2)}</span></span>
        <span class="pcard__meta"><span><b>${m.n}</b><i>${m.r}</i></span><span class="pcard__plus" aria-hidden="true">+</span></span>
        <span class="pcard__tags">${m.tags.map((t) => `<span>${t}</span>`).join('')}</span>
      </button>`).join('')}${SEN.map((m, i) => `
      <div class="pcard rv">
        <span class="pcard__ph"><img src="${A('img/' + m.img)}" alt="Retrato de ${m.n}" width="480" height="600" loading="lazy"><span class="mono">${pad(PEOPLE.length + i + 1)}</span></span>
        <span class="pcard__meta"><span><b>${m.n}</b><i>${m.r}</i></span></span>
        <span class="pcard__tags"><span>Investigación forense</span></span>
      </div>`).join('')}
    </div>
    ${DISC}
  </div>
</section>
${dialog}
<section class="sec sec--ink">
  <div class="wrap">
    ${shead('§ 03', 'Valores', ['Lo que guía', '<em>cada encargo.</em>'], '', true)}
    <div class="vals" data-stagger>
      <div class="rv"><span class="mono">01</span><h3>Excelencia</h3><p>Cada conclusión revisada como si fuera a ser controvertida.</p></div>
      <div class="rv"><span class="mono">02</span><h3>Profesionalismo</h3><p>Reserva, método y estándares internacionales.</p></div>
      <div class="rv"><span class="mono">03</span><h3>Imparcialidad</h3><p>Seguimos la evidencia, no la conclusión que se espera.</p></div>
      <div class="rv"><span class="mono">04</span><h3>Transparencia</h3><p>Métodos explícitos y resultados reproducibles.</p></div>
    </div>
    <p class="rv" style="margin-top:44px"><a class="ulink" href="${C.legal.e}" target="_blank" rel="noopener">Conozca nuestro Código de ética y conducta ${I.up}</a></p>
  </div>
</section>
${cta()}` };

pages.resultados = { title: 'Resultados | SAG Assessment & Consulting', desc: 'Cifras, reconocimientos, cobertura y casos de SAG Assessment & Consulting.', body: () => `
${phead({ crumb: 'Resultados', h1: ['Cifras,', '<em>reconocimientos y casos.</em>'], lead: 'Lo que la firma ha hecho desde 2019, cómo lo reconoce el mercado y dónde ha trabajado.' })}
${statsBlock('§ 01')}
${recBlock('§ 02')}
${coverBlock('§ 03')}
<section class="sec sec--paper2" id="casos">
  <div class="wrap">
    ${shead('§ 04', 'Casos', ['Casos', '<em>anonimizados.</em>'], 'Los casos se presentan sin nombres ni datos que permitan identificar a los clientes.')}
    <div class="cases" data-stagger>${['Auditoría forense', 'Analítica de datos forense', 'Dictámenes periciales'].map((l, i) => `
      <article class="case rv">
        <div class="case__top mono"><span>Expediente ${pad(i + 1)}</span><span>Anonimizado</span></div>
        <h3>${P('título del caso')}</h3>
        <span class="redact m" aria-hidden="true"></span><span class="redact s" aria-hidden="true"></span>
        <dl>
          <div><dt>Línea</dt><dd>${l}</dd></div>
          <div><dt>Sector</dt><dd>${P('sector')}</dd></div>
          <div><dt>Resultado</dt><dd>${P('resultado verificable y autorizado para publicar')}</dd></div>
        </dl>
      </article>`).join('')}
    </div>
  </div>
</section>
${cta()}` };

pages.contacto = { title: 'Contacto | SAG Assessment & Consulting', desc: 'Consulte un caso de forma confidencial.', body: () => `
${phead({ crumb: 'Contacto', h1: ['Cuéntenos', '<em>qué necesita resolver.</em>'], lead: 'Describa la situación en términos generales. No incluya nombres, documentos ni datos sensibles en este primer contacto: si el caso avanza, definiremos un canal seguro.' })}
<section class="sec sec--ink" id="contacto">
  <div class="wrap contact">
    <div>
      ${label('§', 'Canales directos')}
      <ul class="ch rv" style="margin-top:28px">
        <li><span class="mono">Correo</span><a href="mailto:${C.email}">${C.email}</a></li>
        <li><span class="mono">Teléfono</span><a href="tel:${C.telRaw}">${C.tel}</a></li>
        <li><span class="mono">WhatsApp</span><a href="https://wa.me/${C.waRaw}" target="_blank" rel="noopener">${C.wa}</a></li>
        <li><span class="mono">Oficina</span><b>Bogotá, Colombia${ADDRESS ? `<br>${ADDRESS}` : ''}</b></li>
      </ul>
      ${ADDRESS ? '' : `<p style="margin-top:12px">${P('dirección física, si se quiere publicar')}</p>`}
      <p class="soc rv"><a class="ulink" href="${C.li}" target="_blank" rel="noopener">LinkedIn ${I.up}</a><a class="ulink" href="${C.ig}" target="_blank" rel="noopener">Instagram ${I.up}</a></p>
    </div>
    <form class="form rv" id="form" novalidate>
      <fieldset class="form__srv">
        <legend>¿Sobre qué servicio nos escribe?</legend>
        ${['Auditoría forense', 'Laboratorio forense digital', 'Analítica y gobernanza de datos', 'Dictámenes periciales', 'SAG Academy', 'Otro asunto'].map((s, i) => `<label class="pill"><input type="radio" name="servicio" value="${s}"${i ? '' : ' checked'}><span>${s}</span></label>`).join('\n        ')}
      </fieldset>
      <div class="row2">
        <div class="fld"><input id="f-nombre" name="nombre" type="text" autocomplete="name" placeholder=" " required><label for="f-nombre">Nombre</label><p class="err" hidden></p></div>
        <div class="fld"><input id="f-org" name="organizacion" type="text" autocomplete="organization" placeholder=" "><label for="f-org">Organización</label></div>
      </div>
      <div class="row2">
        <div class="fld"><input id="f-correo" name="correo" type="email" autocomplete="email" placeholder=" " required><label for="f-correo">Correo electrónico</label><p class="err" hidden></p></div>
        <div class="fld"><input id="f-tel" name="telefono" type="tel" autocomplete="tel" placeholder=" "><label for="f-tel">Teléfono</label></div>
      </div>
      <div class="fld"><textarea id="f-msg" name="necesidad" rows="4" maxlength="1500" placeholder=" " required></textarea><label for="f-msg">Describa su necesidad de forma general</label><p class="err" hidden></p></div>
      <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="chk"><input type="checkbox" id="f-terms" required><span>He leído y acepto los <a href="${C.legal.t}" target="_blank" rel="noopener">Términos y Condiciones</a>.</span></label>
      <p class="err err--chk" id="err-terms" hidden></p>
      <label class="chk"><input type="checkbox" id="f-priv" required><span>He leído la <a href="${C.legal.p}" target="_blank" rel="noopener">Política de Privacidad</a> y autorizo a SAG Assessment &amp; Consulting S.A.S. a tratar mis datos personales para responder esta consulta.</span></label>
      <p class="err err--chk" id="err-priv" hidden></p>
      <p class="aviso">Responsable: SAG Assessment &amp; Consulting S.A.S. (NIT 900.951.905-5). Usamos su nombre, correo y consulta solo para responderle; teléfono y organización son opcionales. Puede conocer, actualizar, rectificar o suprimir sus datos y revocar su autorización escribiendo a ${C.email}. Más información en la <a href="${C.legal.p}" target="_blank" rel="noopener">Política de Privacidad</a>. No incluya datos sensibles ni confidenciales.</p>
      <button class="btn btn--red" type="submit">Enviar consulta<i>${I.arr}</i></button>
      <p class="form__note" id="form-note" role="status" aria-live="polite"></p>
      <p>${P('conectar el formulario a un servicio de envío; hoy abre el correo del visitante con la consulta redactada')}</p>
    </form>
  </div>
</section>` };

// ---------- Salida ----------
const head = (intro) => `<script>(function(){var d=document.documentElement;d.classList.add("js");try{var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,c=navigator.connection||{};if(!r&&!c.saveData){d.classList.add("anim");${intro ? 'if(!sessionStorage.getItem("sagB"))d.classList.add("intro");' : ''}}}catch(e){}})();</script>`;
const loader = `
<div class="loader" aria-hidden="true"><div class="loader__in">
  <img class="loader__logo" src="${A('img/logo-sag-blanco.svg')}" alt="" width="120" height="66">
  <div class="loader__count"><b>000</b><span>%</span></div>
  <div class="loader__bar"><i></i></div>
  <p class="loader__meta mono">Abriendo expediente</p>
</div></div>`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const d of ['img', 'video']) fs.cpSync(path.join(__dirname, 'src/assets', d), path.join(OUT, 'assets', d), { recursive: true });
fs.cpSync(path.join(SRC, 'fonts'), path.join(OUT, 'assets/fonts'), { recursive: true });
fs.copyFileSync(path.join(SRC, 'styles.css'), path.join(OUT, 'assets/styles.css'));
fs.copyFileSync(path.join(SRC, 'main.js'), path.join(OUT, 'assets/main.js'));
for (const [slugName, p] of Object.entries(pages)) {
  const html = `<!DOCTYPE html>
<html lang="es-CO">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title><meta name="description" content="${p.desc}">
<meta name="theme-color" content="#0b0e13">
<link rel="icon" href="${A('img/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${A('fonts/instrument-serif-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${A('fonts/geist-latin-wght-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${A('styles.css')}">
${head(p.intro)}
</head>
<body id="top">
${p.intro ? loader : ''}
${header(slugName)}
<main id="contenido">${p.body()}</main>
${footer()}
<script src="${A('main.js')}" defer></script>
</body>
</html>`;
  fs.writeFileSync(path.join(OUT, `${slugName}.html`), html);
}
console.log('OK propuesta B:', Object.keys(pages).length, 'páginas');
