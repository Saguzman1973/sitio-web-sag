// Genera el sitio estático (dist/site) y el tema de WordPress (dist/sag-theme) desde un solo origen.
const fs = require('fs'), path = require('path');
const OUT = __dirname;
const P = (t) => `<span class="pending">[PENDIENTE: ${t}]</span>`;

const C = {
  email: 'comercial@sagconsulting.co', tel: '+57 313 466 1950', telRaw: '+573134661950',
  wa: '+57 313 817 0765', waRaw: '573138170765',
  li: 'https://www.linkedin.com/company/sag-assesment-consulting-sas/',
  ig: 'https://www.instagram.com/sag.consulting',
  liSimon: 'https://www.linkedin.com/in/simon-alejandro-guzman-mba-cfcs-cgap-1a299b29/',
  legal: { t: 'https://www.sagconsulting.co/terminos.html', p: 'https://www.sagconsulting.co/privacidad.html', c: 'https://www.sagconsulting.co/cookies.html', e: 'https://www.sagconsulting.co/nosotros/codigo-de-etica-y-conducta/' },
};

const NAV = [
  ['auditoria-forense', 'Auditoría forense'],
  ['analitica-de-datos', 'Analítica forense'],
  ['dictamenes-periciales', 'Dictámenes periciales'],
  ['otros-servicios', 'Otros servicios'],
  ['nosotros', 'Nosotros'],
  ['reconocimientos', 'Reconocimientos'],
];

// ---------- Plantillas compartidas ----------
const header = (L, cur) => `
<a class="skip" href="#main">Ir al contenido</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${L('')}" aria-label="SAG Assessment & Consulting, inicio">
      <span class="brand-mark">S</span>
      <span class="brand-text"><b>SAG</b><span>Assessment &amp; Consulting</span></span>
    </a>
    <button class="menu-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Principal">
      <ul>${NAV.map(([s, t]) => `<li><a class="nl" href="${L(s)}"${s === cur ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul>
      <a class="btn btn-brass" href="${L('contacto')}">Consultar un caso <span class="arr">→</span></a>
    </nav>
  </div>
</header>`;

const footer = (L) => `
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-top">
      <div>
        <a class="brand" href="${L('')}"><span class="brand-mark">S</span><span class="brand-text"><b>SAG</b><span>Assessment &amp; Consulting</span></span></a>
        <p class="foot-claim">Del dato al hecho. Del hecho al dictamen.</p>
      </div>
      <div><h4>Líneas</h4><ul>
        <li><a href="${L('auditoria-forense')}">Auditoría forense</a></li>
        <li><a href="${L('analitica-de-datos')}">Analítica de datos forense</a></li>
        <li><a href="${L('dictamenes-periciales')}">Dictámenes periciales</a></li>
        <li><a href="${L('otros-servicios')}">Otros servicios</a></li></ul></div>
      <div><h4>Firma</h4><ul>
        <li><a href="${L('nosotros')}">Nosotros y equipo</a></li>
        <li><a href="${L('reconocimientos')}">Reconocimientos</a></li>
        <li><a href="${L('contacto')}">Contacto</a></li>
        <li><a href="${C.legal.e}">Código de ética</a></li></ul></div>
      <div><h4>Contacto</h4><ul>
        <li><a href="mailto:${C.email}">${C.email}</a></li>
        <li><a href="tel:${C.telRaw}">${C.tel}</a></li>
        <li><a href="https://wa.me/${C.waRaw}">WhatsApp ${C.wa}</a></li>
        <li>Bogotá, Colombia</li>
        <li><a href="${C.li}">LinkedIn</a> · <a href="${C.ig}">Instagram</a></li></ul></div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 SAG Assessment &amp; Consulting S.A.S. · NIT 900.951.905-5 · Bogotá, Colombia</span>
      <nav aria-label="Legal"><a href="${C.legal.t}">Términos</a><a href="${C.legal.p}">Privacidad</a><a href="${C.legal.c}">Cookies</a></nav>
    </div>
  </div>
</footer>`;

const cta = (L) => `
<section class="sec dark cta">
  <div class="wrap">
    <div class="rv">
      <span class="eyebrow">Consulta confidencial</span>
      <h2 style="margin-top:1.2rem">¿Tiene una sospecha que necesita <em>convertirse en prueba?</em></h2>
      <p class="lead" style="margin-top:1.4rem">Cuéntenos el caso en términos generales. Un socio revisa cada solicitud y le responde con una ruta de trabajo.</p>
    </div>
    <div class="cta-box rv d2">
      <dl>
        <div><dt>Correo</dt><dd><a href="mailto:${C.email}">${C.email}</a></dd></div>
        <div><dt>Teléfono</dt><dd><a href="tel:${C.telRaw}">${C.tel}</a></dd></div>
        <div><dt>WhatsApp</dt><dd><a href="https://wa.me/${C.waRaw}">${C.wa}</a></dd></div>
      </dl>
      <a class="btn btn-brass" href="${L('contacto')}">Consultar un caso <span class="arr">→</span></a>
    </div>
  </div>
</section>`;

const pageHero = (L, crumb, eyebrow, title, lead, num) => `
<section class="page-hero dark">
  ${num ? `<span class="big-num" aria-hidden="true">${num}</span>` : ''}
  <div class="wrap" style="position:relative">
    <p class="crumbs"><a href="${L('')}">Inicio</a> / ${crumb}</p>
    <span class="eyebrow rv">${eyebrow}</span>
    <h1 class="rv d1" style="margin-top:1.4rem">${title}</h1>
    <p class="lead rv d2">${lead}</p>
  </div>
</section>`;

const svcList = (items) => `<div class="svc">${items.map((s, i) => `
  <div class="svc-item rv"><span class="mono">${String(i + 1).padStart(2, '0')}</span><div>
    <h3>${s.t}</h3><p>${s.d}</p>${s.tags ? `<ul>${s.tags.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
  </div></div>`).join('')}</div>`;

const related = (L, items) => `
<section class="sec-sm"><div class="wrap">
  <span class="eyebrow">Otras líneas</span>
  <div class="related" style="margin-top:2rem">${items.map(([s, n, t]) => `
    <a href="${L(s)}"><div><span class="mono">${n}</span><h3>${t}</h3></div><span class="link">Ver línea <span>→</span></span></a>`).join('')}
  </div></div></section>`;

// ---------- Bloques de inicio ----------
const awardsStrip = `
<section class="sec-sm"><div class="wrap">
  <div class="awards">
    <div class="award rv"><span class="mono">Leaders League</span><p>Highly Recommended</p><small>Seis años consecutivos · Ranked Firm 2025</small></div>
    <div class="award rv d1"><span class="mono">Management Consulting Awards 2025</span><p>Best Forensic Auditing &amp; Compliance Advisory Firm</p><small>Latinoamérica · Wealth &amp; Finance International</small></div>
    <div class="award rv d2"><span class="mono">Management Consulting Awards 2025</span><p>Client Service Excellence Award</p><small>Wealth &amp; Finance International</small></div>
    <div class="award rv d3"><span class="mono">Management Consulting Awards 2024</span><p>Best Fraud Detection Consulting Firm</p><small>Wealth &amp; Finance International</small></div>
  </div>
</div></section>`;

const linesBlock = (L) => `
<section class="sec dark" id="lineas"><div class="wrap">
  <div class="sec-head">
    <div class="rv"><span class="eyebrow">Tres líneas, un mismo expediente</span><h2>Lo que hacemos <em>mejor que nadie</em></h2></div>
    <p class="lead rv d1">Investigamos, medimos y sustentamos. Cada línea alimenta a la siguiente: la evidencia que asegura la auditoría forense es la que procesa la analítica y la que defiende el dictamen ante el juez.</p>
  </div>
  <div class="lines">
    <article class="line-card rv"><span class="num">01</span><h3>Auditoría forense</h3>
      <p>Prevención, detección e investigación de fraude, corrupción y abuso de confianza, en el sector público y en el privado.</p>
      <ul><li>Investigación de fraude y corrupción</li><li>Laboratorio forense digital</li><li>Evaluación de riesgo de fraude</li><li>OSINT y debida diligencia</li></ul>
      <a class="link" href="${L('auditoria-forense')}">Explorar la línea <span>→</span></a></article>
    <article class="line-card rv d1"><span class="num">02</span><h3>Analítica de datos forense</h3>
      <p>Revisamos todas las transacciones, no una muestra. Minería, visualización y automatización para encontrar lo que el muestreo no ve.</p>
      <ul><li>Analítica forense de transacciones</li><li>Monitoreo y alertas tempranas</li><li>Gobernanza y calidad de datos</li><li>Tableros para la toma de decisiones</li></ul>
      <a class="link" href="${L('analitica-de-datos')}">Explorar la línea <span>→</span></a></article>
    <article class="line-card rv d2"><span class="num">03</span><h3>Dictámenes periciales</h3>
      <p>Peritaje contable y financiero forense para procesos judiciales, arbitrales y administrativos, con sustentación en audiencia.</p>
      <ul><li>Daño emergente y lucro cesante</li><li>Contradicción de dictámenes</li><li>Tacha de documentos</li><li>Apoyo técnico a equipos legales</li></ul>
      <a class="link" href="${L('dictamenes-periciales')}">Explorar la línea <span>→</span></a></article>
  </div>
  <p class="rv" style="margin-top:2.4rem;color:var(--muted-d)">¿Busca control interno, cumplimiento LA/FT, canales de denuncia o formación? <a class="link" style="color:var(--paper)" href="${L('otros-servicios')}">Vea otros servicios <span>→</span></a></p>
</div></section>`;

const ADV = [
  ['Evidencia asegurada desde el primer día', 'Cadena de custodia desde el recaudo. Lo que encontramos se puede presentar, porque se obtuvo bien.'],
  ['Todos los datos, no una muestra', 'Procesamos la población completa de transacciones. El fraude rara vez cae en la muestra.'],
  ['Forense digital completo', 'Equipos, celulares, servidores y nube, con imágenes forenses que preservan la integridad de la información.'],
  ['Prevención y detección con analítica', 'Modelos y reglas que encienden alertas antes de que el daño crezca.'],
  ['De la investigación a la audiencia', 'El mismo equipo que investiga sustenta el dictamen ante el juez, el árbitro o el ente de control.'],
  ['Servicios integrados en un expediente', 'Auditoría, analítica y peritaje trabajan sobre la misma evidencia, sin pérdidas entre etapas.'],
];
const advBlock = `
<section class="sec"><div class="wrap">
  <div class="sec-head">
    <div class="rv"><span class="eyebrow">Por qué SAG</span><h2>Rigor que <em>resiste el escrutinio</em></h2></div>
    <p class="lead rv d1">Un hallazgo vale lo que vale su prueba. Por eso diseñamos cada encargo pensando desde el inicio en quién lo va a revisar.</p>
  </div>
  <div class="adv">${ADV.map(([t, d], i) => `<div class="adv-item rv${i % 3 ? ' d' + (i % 3) : ''}"><span class="mono">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
</div></section>`;

const STEPS = [
  ['Diagnóstico', 'Definimos el alcance, las preguntas de la investigación y las hipótesis a probar o descartar.'],
  ['Aseguramiento', 'Recaudamos y preservamos la evidencia física y digital, incluidas imágenes forenses, con cadena de custodia.'],
  ['Análisis', 'Cruzamos todos los datos disponibles: contables, transaccionales, documentales, digitales y de fuentes abiertas.'],
  ['Informe y dictamen', 'Entregamos conclusiones sustentadas y, cuando se requiere, el dictamen pericial y su defensa en audiencia.'],
];
const methodBlock = `
<section class="sec dark" id="metodo"><div class="wrap">
  <div class="sec-head">
    <div class="rv"><span class="eyebrow">Método</span><h2>Cuatro pasos, <em>cero atajos</em></h2></div>
    <p class="lead rv d1">Un proceso probado que convierte una sospecha en conclusiones verificables.</p>
  </div>
  <div class="steps"><span class="bar"></span>${STEPS.map(([t, d], i) => `<div class="step"><span class="dot"></span><span class="mono">Paso ${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
</div></section>`;

const founderBlock = (L) => `
<section class="sec"><div class="wrap founder">
  <div class="portrait rv"><span class="initials">SG</span>${P('fotografía profesional de Simón')}</div>
  <div class="rv d1">
    <span class="eyebrow">Socio fundador</span>
    <blockquote>“El fraude deja rastro. Nuestro trabajo es encontrarlo, asegurarlo y explicarlo de forma que nadie pueda discutirlo.” ${P('validar o reemplazar la cita')}</blockquote>
    <h3>Simón Guzmán Guerrero</h3>
    <div class="cred"><span>MBA</span><span>CGAP</span><span>CFCS</span><span>Avaluador acreditado</span></div>
    <ul class="facts">
      <li><b>Trayectoria</b><span>Más de 25 años en auditoría forense e investigación de fraude</span></li>
      <li><b>Sector privado</b><span>Exdirector de Deloitte Forensics para la Región Andina; paso por BDO</span></li>
      <li><b>Sector público</b><span>Contralor Delegado Intersectorial en la Contraloría General de la República, a cargo del Sistema General de Regalías</span></li>
      <li><b>Academia</b><span>Profesor de auditoría forense en la Pontificia Universidad Javeriana y autor de libros sobre la materia</span></li>
    </ul>
    <p style="margin-top:2rem"><a class="link" href="${L('nosotros')}">Conozca al equipo <span>→</span></a></p>
  </div>
</div></section>`;

const statsBlock = `
<section class="sec-sm dark"><div class="wrap">
  <div class="stats">
    <div class="stat rv"><div class="v">2019</div><p>Año de fundación de SAG</p></div>
    <div class="stat rv d1"><div class="v">6</div><p>Años consecutivos como firma Highly Recommended por Leaders League</p></div>
    <div class="stat rv d2"><div class="v">+600</div><p>Casos atendidos</p></div>
    <div class="stat rv d3"><div class="v">+150</div><p>Clientes que han confiado en SAG</p></div>
  </div>
</div></section>`;

const POSTS = [
  ['22 ene 2026', 'Davos 2026: señales de alerta para la auditoría forense en Latinoamérica', 'https://www.sagconsulting.co/2026/01/22/davos-2026-senales-de-alerta-para-la-auditoria-forense-en-latinoamerica-entre-el-dialogo-y-la-disrupcion-reflexiones-criticas-desde-la-vision-antifraude/'],
  ['22 nov 2025', 'Debida diligencia financiera forense en clubes de fútbol suramericanos', 'https://www.sagconsulting.co/2025/11/22/debida-diligencia-financiera-forense-en-clubes-de-futbol-suramericanos-metodologia-y-mejores-practicas/'],
  ['14 nov 2025', 'Auditoría forense y auditoría interna: una alianza estratégica para blindar la contratación pública', 'https://www.sagconsulting.co/2025/11/14/auditoria-forense-y-auditoria-interna-una-alianza-estrategica-para-blindar-la-contratacion-publica/'],
];
const postsBlock = `
<section class="sec paper2"><div class="wrap">
  <div class="sec-head">
    <div class="rv"><span class="eyebrow">Conocimiento</span><h2>Análisis <em>desde la práctica</em></h2></div>
    <p class="lead rv d1">Lo que vemos en los casos, convertido en criterio para directivos, abogados y oficiales de cumplimiento.</p>
  </div>
  <div class="posts">${POSTS.map(([d, t, u], i) => `<a class="post rv${i ? ' d' + i : ''}" href="${u}"><span class="mono">${d}</span><h3>${t}</h3><span class="link">Leer artículo <span>→</span></span></a>`).join('')}</div>
</div></section>`;

// ---------- Páginas ----------
const pages = {};

pages[''] = { title: 'SAG Assessment & Consulting | Auditoría forense en Colombia', desc: 'Auditoría forense, analítica de datos y dictámenes periciales. Del dato al hecho. Del hecho al dictamen.', body: (L) => `
<section class="hero dark">
  <canvas id="evidence" aria-hidden="true"></canvas>
  <div class="wrap">
    <span class="eyebrow rv">Auditoría forense · Analítica de datos · Dictámenes periciales</span>
    <h1 class="rv d1">Del dato al hecho. <span class="l2">Del hecho al dictamen.</span></h1>
    <p class="lead rv d2">Investigamos fraude y corrupción con evidencia que resiste el examen de un juez, un ente de control o una junta directiva. Desde Bogotá, para Colombia y Latinoamérica.</p>
    <div class="actions rv d3">
      <a class="btn btn-brass" href="${L('contacto')}">Consultar un caso <span class="arr">→</span></a>
      <a class="btn btn-ghost" href="#lineas">Conozca nuestras líneas</a>
    </div>
    <div class="hero-foot rv d3">
      <a href="${L('auditoria-forense')}"><b>01</b><span>Auditoría forense</span></a>
      <a href="${L('analitica-de-datos')}"><b>02</b><span>Analítica de datos forense</span></a>
      <a href="${L('dictamenes-periciales')}"><b>03</b><span>Dictámenes periciales</span></a>
    </div>
  </div>
</section>
${awardsStrip}${linesBlock(L)}${advBlock}${methodBlock}${founderBlock(L)}${statsBlock}${postsBlock}${cta(L)}` };

pages['auditoria-forense'] = { title: 'Auditoría forense | SAG Assessment & Consulting', desc: 'Prevención, detección e investigación de fraude, corrupción y abuso de confianza.', body: (L) => `
${pageHero(L, 'Auditoría forense', 'Línea 01', 'Auditoría <em>forense</em>', 'Prevenimos, detectamos e investigamos fraude, corrupción y abuso de confianza. Malversación, soborno, fraude fiscal, ciberdelito y tráfico de influencias, en organizaciones públicas y privadas.', '01')}
<section class="sec dark" style="padding-top:0"><div class="wrap">
  <span class="eyebrow rv">Cuándo nos llaman</span>
  <div class="when" style="margin-top:2rem">
    <div class="rv"><p>Hay una denuncia interna o una sospecha concreta y necesita saber qué pasó, quién participó y cuánto costó.</p></div>
    <div class="rv d1"><p>Un ente de control, un regulador o un socio pide explicaciones y la organización necesita una revisión independiente.</p></div>
    <div class="rv d2"><p>Los estados financieros no cuadran con la operación y la auditoría tradicional no encuentra la causa.</p></div>
    <div class="rv d3"><p>Va a cerrar una inversión, una alianza o un contrato y necesita conocer a fondo a la contraparte.</p></div>
  </div>
</div></section>
<section class="sec"><div class="wrap split">
  <div class="sticky rv"><span class="eyebrow">Servicios</span><h2 style="margin-top:1rem">Qué hacemos</h2><p class="lead" style="margin-top:1.2rem">Seis frentes que se combinan según el caso.</p></div>
  ${svcList([
    { t: 'Investigación de fraude y corrupción', d: 'Reconstruimos los hechos con evidencia documental, contable y digital. Identificamos responsables, mecanismos y cuantía del daño.', tags: ['Malversación', 'Soborno', 'Fraude fiscal', 'Tráfico de influencias', 'Ciberdelito'] },
    { t: 'Laboratorio forense digital', d: 'Recaudo, aseguramiento y análisis de evidencia digital en equipos, celulares, servidores y nube, con imágenes forenses y cadena de custodia.', tags: ['Imágenes forenses', 'Cadena de custodia', 'Correo y mensajería'] },
    { t: 'Evaluación de riesgo de fraude', d: 'Fraud Risk Assessment: priorizamos los esquemas de fraude más probables en su organización y medimos la eficacia real de los controles.', tags: ['Mapa de riesgos', 'Pruebas de controles'] },
    { t: 'Auditoría forense de estados financieros', d: 'Examinamos cifras, registros y soportes para detectar manipulación contable, ingresos ficticios o gastos ocultos.' },
    { t: 'Inteligencia de fuentes abiertas', d: 'OSINT y SOCMINT para investigaciones y perfilamiento de personas, empresas y redes de relacionamiento.' },
    { t: 'Debida diligencia de antecedentes', d: 'Background check de contrapartes, proveedores, socios y candidatos a cargos críticos antes de tomar la decisión.' },
  ])}
</div></section>
<section class="sec paper2"><div class="wrap">
  <span class="eyebrow rv">Entregables</span><h2 class="rv d1" style="margin:1rem 0 3rem">Lo que recibe</h2>
  <div class="deliv">
    <div class="rv"><h4>Informe de investigación</h4><p>Hechos, responsables, mecanismos y cuantificación, con cada conclusión atada a su soporte.</p></div>
    <div class="rv d1"><h4>Expediente de evidencia</h4><p>Material recaudado con cadena de custodia, listo para uso disciplinario, fiscal, penal o civil.</p></div>
    <div class="rv d2"><h4>Plan de cierre de brechas</h4><p>Controles concretos para que el esquema detectado no se repita.</p></div>
  </div>
</div></section>
${related(L, [['analitica-de-datos', 'Línea 02', 'Analítica de datos forense'], ['dictamenes-periciales', 'Línea 03', 'Dictámenes periciales']])}
${cta(L)}` };

pages['analitica-de-datos'] = { title: 'Analítica de datos forense | SAG Assessment & Consulting', desc: 'Analítica forense, minería, visualización, automatización y gobernanza de datos.', body: (L) => `
${pageHero(L, 'Analítica de datos forense', 'Línea 02', 'Analítica de datos <em>forense</em>', 'Revisamos el cien por ciento de las transacciones, no una muestra. Minería, visualización y automatización para encontrar patrones, anomalías y relaciones que el muestreo tradicional no ve.', '02')}
<section class="sec dark" style="padding-top:0"><div class="wrap">
  <span class="eyebrow rv">Cuándo nos llaman</span>
  <div class="when" style="margin-top:2rem">
    <div class="rv"><p>Tiene millones de registros contables, de pagos o de contratación y nadie ha podido revisarlos completos.</p></div>
    <div class="rv d1"><p>Quiere pasar de descubrir el fraude tarde a recibir alertas cuando empieza.</p></div>
    <div class="rv d2"><p>Una investigación necesita cruzar fuentes que no conversan entre sí: ERP, bancos, proveedores, nómina.</p></div>
    <div class="rv d3"><p>Sus datos no son confiables y eso debilita cualquier decisión o hallazgo construido sobre ellos.</p></div>
  </div>
</div></section>
<section class="sec"><div class="wrap split">
  <div class="sticky rv"><span class="eyebrow">Servicios</span><h2 style="margin-top:1rem">Qué hacemos</h2><p class="lead" style="margin-top:1.2rem">De los datos crudos a conclusiones que se pueden explicar.</p></div>
  ${svcList([
    { t: 'Analítica forense de transacciones', d: 'Pruebas sobre la población completa: duplicados, fraccionamientos, proveedores fantasma, pagos fuera de patrón y relaciones ocultas.', tags: ['Minería de datos', 'Ley de Benford', 'Cruces de bases'] },
    { t: 'Monitoreo continuo y alertas tempranas', d: 'Reglas y modelos que se ejecutan de forma automática y avisan cuando una operación se sale de lo esperado.', tags: ['Automatización', 'Indicadores de riesgo'] },
    { t: 'Visualización para la decisión', d: 'Tableros que muestran a la dirección dónde está el riesgo, sin depender de informes extensos.' },
    { t: 'Gobernanza de datos', d: 'Políticas, responsables, calidad y trazabilidad para que la información resista una auditoría y un litigio.', tags: ['Calidad', 'Trazabilidad', 'Roles y responsables'] },
  ])}
</div></section>
<section class="sec paper2"><div class="wrap">
  <span class="eyebrow rv">Entregables</span><h2 class="rv d1" style="margin:1rem 0 3rem">Lo que recibe</h2>
  <div class="deliv">
    <div class="rv"><h4>Hallazgos priorizados</h4><p>Transacciones y terceros a revisar, ordenados por nivel de riesgo y monto.</p></div>
    <div class="rv d1"><h4>Tableros y reglas</h4><p>Herramientas que su equipo sigue usando después del encargo.</p></div>
    <div class="rv d2"><h4>Trazabilidad completa</h4><p>Cada cifra se puede reproducir desde la fuente, requisito para un uso pericial posterior.</p></div>
  </div>
</div></section>
${related(L, [['auditoria-forense', 'Línea 01', 'Auditoría forense'], ['dictamenes-periciales', 'Línea 03', 'Dictámenes periciales']])}
${cta(L)}` };

pages['dictamenes-periciales'] = { title: 'Dictámenes periciales | SAG Assessment & Consulting', desc: 'Peritaje contable y financiero forense, contradicción de dictámenes y apoyo a equipos legales.', body: (L) => `
${pageHero(L, 'Dictámenes periciales', 'Línea 03', 'Dictámenes <em>periciales</em>', 'Peritaje contable y financiero forense para procesos judiciales, arbitrales y administrativos. Cuantificamos el daño, controvertimos dictámenes y sustentamos nuestras conclusiones en audiencia.', '03')}
<section class="sec dark" style="padding-top:0"><div class="wrap">
  <span class="eyebrow rv">Cuándo nos llaman</span>
  <div class="when" style="margin-top:2rem">
    <div class="rv"><p>Un proceso exige cuantificar daño emergente y lucro cesante con un método que el juez pueda seguir.</p></div>
    <div class="rv d1"><p>La contraparte aportó un dictamen y su equipo legal necesita controvertirlo con argumentos técnicos.</p></div>
    <div class="rv d2"><p>Hay dudas sobre la autenticidad o el contenido de documentos que son prueba en el proceso.</p></div>
    <div class="rv d3"><p>Los abogados necesitan un aliado financiero para estructurar la estrategia antes de presentar la demanda.</p></div>
  </div>
</div></section>
<section class="sec"><div class="wrap split">
  <div class="sticky rv"><span class="eyebrow">Servicios</span><h2 style="margin-top:1rem">Qué hacemos</h2><p class="lead" style="margin-top:1.2rem">Conclusiones técnicas, lenguaje claro y defensa en audiencia.</p></div>
  ${svcList([
    { t: 'Peritaje contable y financiero forense', d: 'Dictámenes para jurisdicción ordinaria, contencioso administrativa y arbitraje, con metodología explícita y verificable.', tags: ['Daño emergente', 'Lucro cesante', 'Arbitraje', 'Liquidación de contratos'] },
    { t: 'Contradicción de dictámenes periciales', d: 'Revisión técnica del dictamen de la contraparte: supuestos, cálculos, fuentes y coherencia. Preparamos preguntas para la audiencia.' },
    { t: 'Tacha de documentos', d: 'Análisis de la autenticidad, integridad y consistencia de documentos aportados como prueba.' },
    { t: 'Apoyo a áreas legales', d: 'Acompañamiento técnico en responsabilidad contractual y extracontractual, perjuicios y títulos valores, desde la estrategia hasta la sentencia.' },
  ])}
</div></section>
<section class="sec paper2"><div class="wrap">
  <span class="eyebrow rv">Entregables</span><h2 class="rv d1" style="margin:1rem 0 3rem">Lo que recibe</h2>
  <div class="deliv">
    <div class="rv"><h4>Dictamen pericial</h4><p>Con los requisitos del Código General del Proceso y anexos de soporte.</p></div>
    <div class="rv d1"><h4>Sustentación en audiencia</h4><p>El perito que firma el dictamen lo explica y lo defiende ante el despacho.</p></div>
    <div class="rv d2"><h4>Informe de contradicción</h4><p>Debilidades técnicas del dictamen contrario, listas para el interrogatorio.</p></div>
  </div>
</div></section>
${related(L, [['auditoria-forense', 'Línea 01', 'Auditoría forense'], ['analitica-de-datos', 'Línea 02', 'Analítica de datos forense']])}
${cta(L)}` };

pages['otros-servicios'] = { title: 'Otros servicios | SAG Assessment & Consulting', desc: 'Control interno, cumplimiento LA/FT, riesgos en recursos públicos, canales de denuncia y SAG Academy.', body: (L) => `
${pageHero(L, 'Otros servicios', 'Portafolio complementario', 'Otros <em>servicios</em>', 'Además de nuestras tres líneas principales, acompañamos a las organizaciones en control interno, cumplimiento, gestión de recursos públicos y formación.')}
<section class="sec"><div class="wrap groups">
  <div class="group rv"><span class="eyebrow">Cumplimiento</span><h3>Control interno y cumplimiento</h3>
    ${svcList([{ t: 'Control interno', d: 'Diseño y evaluación de controles que reducen la exposición al fraude y al error.' }, { t: 'Cumplimiento LA/FT', d: 'Revisión de sistemas de prevención de lavado de activos y financiación del terrorismo y del cumplimiento normativo aplicable.' }])}</div>
  <div class="group rv d1"><span class="eyebrow">Sector público</span><h3>Riesgos en recursos públicos</h3>
    ${svcList([{ t: 'Rendición de cuentas y planes de mejoramiento', d: 'Acompañamiento a entidades y contratistas en la gestión de recursos públicos.' }, { t: 'Defensa ante entes de control', d: 'Soporte técnico frente a contralorías, procuradurías y superintendencias.' }])}</div>
  <div class="group rv"><span class="eyebrow">Ética</span><h3>Canales de denuncia</h3>
    ${svcList([{ t: 'Línea ética tercerizada', d: 'Recepción de denuncias por web, correo y teléfono, con gestión independiente y apoyo al comité de ética.' }])}</div>
  <div class="group rv d1"><span class="eyebrow">Formación</span><h3>SAG Academy</h3>
    ${svcList([{ t: 'Cursos con expertos', d: 'Programas de auditoría forense guiados por los profesionales que trabajan los casos. ' + P('enlace a SAG Academy') }])}</div>
</div></section>
${cta(L)}` };

const TEAM = [
  ['SG', 'Simón Guzmán Guerrero', 'Socio fundador', 'Economista, MBA, CGAP, CFCS y avaluador acreditado. Exdirector de Deloitte Forensics para la Región Andina y exintegrante de la Contraloría General de la República. Perito ante jueces y profesor de la Pontificia Universidad Javeriana.'],
  ['MV', 'Mónica Vargas Ortega', 'CEO y socia', 'Finanzas y analítica de datos.'],
  ['DA', 'Diego Andrés Alarcón', 'Director de investigaciones forenses', 'Investigaciones contables y financieras, forense digital y minería de datos.'],
  ['AS', 'Andrea Sierra Sánchez', 'Gerente senior de investigaciones forenses', 'Peritaje, derecho y contaduría. Perfil financiero, contable y de prevención de LA/FT.'],
  ['YS', 'Yamid Suárez Castellanos', 'Gerente de analítica forense', 'Analítica de datos forense, automatización y tecnología.'],
  ['AR', 'Alexandra Rodríguez', 'Senior de investigaciones forenses', P('breve perfil')],
  ['YM', 'Yulieth Monroy', 'Senior de investigaciones forenses', P('breve perfil')],
];
pages['nosotros'] = { title: 'Nosotros y equipo | SAG Assessment & Consulting', desc: 'Equipo, valores y método de SAG Assessment & Consulting.', body: (L) => `
${pageHero(L, 'Nosotros', 'Nosotros · Desde 2019', 'Una firma hecha por <em>investigadores</em>', 'SAG Assessment & Consulting nació en diciembre de 2019 en Bogotá para llevar el rigor de la auditoría forense internacional a organizaciones públicas y privadas de Colombia y Latinoamérica.')}
<section class="sec"><div class="wrap">
  <div class="sec-head"><div class="rv"><span class="eyebrow">Equipo</span><h2>Quienes llevan <em>sus casos</em></h2></div>
  <p class="lead rv d1">Contadores, economistas, abogados y analistas de datos que trabajan juntos sobre el mismo expediente.</p></div>
  <div class="team">${TEAM.map(([i, n, r, d], k) => `<div class="member rv${k % 3 ? ' d' + (k % 3) : ''}"><div class="av">${i}</div><h3>${n}</h3><span class="mono">${r}</span><p>${d}</p></div>`).join('')}</div>
  <p class="rv" style="margin-top:2rem">${P('fotografías del equipo')}</p>
</div></section>
<section class="sec-sm dark"><div class="wrap">
  <span class="eyebrow rv">Valores</span>
  <div class="values" style="margin-top:2.4rem">
    <div class="rv"><h3>Excelencia</h3><p>Cada conclusión revisada como si fuera a ser controvertida.</p></div>
    <div class="rv d1"><h3>Profesionalismo</h3><p>Reserva, método y estándares internacionales.</p></div>
    <div class="rv d2"><h3>Imparcialidad</h3><p>Seguimos la evidencia, no la conclusión que se espera.</p></div>
    <div class="rv d3"><h3>Transparencia</h3><p>Métodos explícitos y resultados reproducibles.</p></div>
  </div>
</div></section>
${methodBlock}
<section class="sec-sm"><div class="wrap"><p class="rv">Conozca nuestro <a class="link" href="${C.legal.e}">Código de ética y conducta <span>→</span></a></p></div></section>
${cta(L)}` };

pages['reconocimientos'] = { title: 'Reconocimientos | SAG Assessment & Consulting', desc: 'Leaders League y Management Consulting Awards.', body: (L) => `
${pageHero(L, 'Reconocimientos', 'Reconocimientos', 'Reconocidos por <em>el mercado</em>', 'Directorios y premios internacionales que evalúan a las firmas de consultoría por la calidad de su trabajo y la opinión de sus clientes.')}
<section class="sec"><div class="wrap">
  <div class="award-list">
    <div class="award-row rv"><span class="y">6×</span><div><h3>Highly Recommended</h3><p>Seis años consecutivos en el ranking de firmas de Leaders League. Ranked Firm 2025.</p></div><span class="mono">Leaders League</span></div>
    <div class="award-row rv"><span class="y">2025</span><div><h3>Best Forensic Auditing &amp; Compliance Advisory Firm</h3><p>Latinoamérica.</p></div><span class="mono">Management Consulting Awards · Wealth &amp; Finance International</span></div>
    <div class="award-row rv"><span class="y">2025</span><div><h3>Client Service Excellence Award</h3><p>Reconocimiento a la calidad del servicio al cliente.</p></div><span class="mono">Management Consulting Awards · Wealth &amp; Finance International</span></div>
    <div class="award-row rv"><span class="y">2024</span><div><h3>Best Fraud Detection Consulting Firm</h3><p>Firma de consultoría en detección de fraude.</p></div><span class="mono">Management Consulting Awards · Wealth &amp; Finance International</span></div>
  </div>
  <p class="rv" style="margin-top:2rem">${P('logos oficiales de cada reconocimiento')}</p>
</div></section>
${cta(L)}` };

pages['contacto'] = { title: 'Contacto | SAG Assessment & Consulting', desc: 'Consulte un caso de forma confidencial.', body: (L) => `
${pageHero(L, 'Contacto', 'Consulta confidencial', 'Cuéntenos <em>su caso</em>', 'Describa la situación en términos generales. No incluya nombres, documentos ni datos sensibles en este primer contacto: un socio le responderá para definir el canal adecuado.')}
<section class="sec"><div class="wrap contact">
  <div class="rv">
    <span class="eyebrow">Canales directos</span>
    <ul class="channels" style="margin-top:2rem">
      <li><span class="mono">Correo</span><a href="mailto:${C.email}">${C.email}</a></li>
      <li><span class="mono">Teléfono</span><a href="tel:${C.telRaw}">${C.tel}</a></li>
      <li><span class="mono">WhatsApp</span><a href="https://wa.me/${C.waRaw}">${C.wa}</a></li>
      <li><span class="mono">Oficina</span><span class="v">Bogotá, Colombia</span> ${P('dirección física, si se quiere publicar')}</li>
    </ul>
  </div>
  <form class="form rv d1" id="case-form" novalidate>
    <div class="field"><label for="f-n">Nombre</label><input id="f-n" name="nombre" autocomplete="name" required></div>
    <div class="field"><label for="f-o">Organización</label><input id="f-o" name="organizacion" autocomplete="organization"></div>
    <div class="field"><label for="f-e">Correo</label><input id="f-e" name="correo" type="email" autocomplete="email" required></div>
    <div class="field"><label for="f-t">Teléfono (opcional)</label><input id="f-t" name="telefono" type="tel" autocomplete="tel"></div>
    <div class="field full"><label for="f-l">Línea de interés</label><select id="f-l" name="linea"><option>Auditoría forense</option><option>Analítica de datos</option><option>Dictámenes periciales</option><option>Otro servicio</option></select></div>
    <div class="field full"><label for="f-d">Descripción general del caso</label><textarea id="f-d" name="descripcion" required></textarea></div>
    <p class="note full">Al enviar acepta la <a class="link" href="${C.legal.p}">política de privacidad</a>.</p>
    <div class="full"><button class="btn btn-ink" type="submit">Enviar consulta <span class="arr">→</span></button></div>
    <div class="form-msg full" id="form-msg" tabindex="-1">Gracias. En este prototipo el formulario aún no envía mensajes. Por ahora escríbanos a <b>${C.email}</b>. ${P('conectar el formulario al correo comercial')}</div>
  </form>
</div></section>` };

pages['inicio-alternativo'] = { staticOnly: true, lightHead: true, title: 'Inicio (versión alternativa) | SAG Assessment & Consulting', desc: 'Variante editorial del inicio.', body: (L) => `
<section class="ed-hero"><div class="wrap">
  <div class="ed-grid">
    <h1 class="rv">Encontramos lo que <em>otros no ven</em>. Y lo probamos.</h1>
    <div class="ed-side rv d1"><span class="eyebrow">Auditoría forense · Bogotá · Latinoamérica</span>
      <p>Investigación de fraude, analítica de datos y dictámenes periciales para organizaciones que necesitan certezas, no sospechas.</p>
      <a class="btn btn-ink" href="${L('contacto')}">Consultar un caso <span class="arr">→</span></a></div>
  </div>
  <div class="ed-rule rv"><span>Leaders League · Highly Recommended · 6 años</span><span>Best Fraud Detection Consulting Firm 2024</span><span>Best Forensic Auditing &amp; Compliance Advisory Firm 2025</span></div>
</div></section>
<section class="sec-sm"><div class="wrap">
  <div class="ed-lines">
    <a class="ed-line rv" href="${L('auditoria-forense')}"><span class="n">01</span><h3>Auditoría forense</h3><p>Fraude, corrupción y abuso de confianza: qué pasó, quién participó y cuánto costó.</p><span class="go">→</span></a>
    <a class="ed-line rv" href="${L('analitica-de-datos')}"><span class="n">02</span><h3>Analítica de datos forense</h3><p>El cien por ciento de las transacciones, no una muestra. Alertas antes del daño.</p><span class="go">→</span></a>
    <a class="ed-line rv" href="${L('dictamenes-periciales')}"><span class="n">03</span><h3>Dictámenes periciales</h3><p>Cuantificación del daño, contradicción de dictámenes y defensa en audiencia.</p><span class="go">→</span></a>
  </div>
</div></section>
<section class="ed-band"><div class="wrap"><span class="eyebrow">Nuestro principio</span><p class="q rv">Un hallazgo vale <em>lo que vale su prueba.</em></p></div></section>
${advBlock}${founderBlock(L)}${postsBlock}${cta(L)}
<div class="variant-tag">Versión alternativa B <a href="${L('')}">Ver versión A</a></div>` };

// ---------- Documento ----------
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">';

// ---------- Salida estática ----------
function buildStatic() {
  const dir = path.join(OUT, 'sitio'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'src/styles.css'), path.join(dir, 'assets/styles.css'));
  fs.copyFileSync(path.join(__dirname, 'src/main.js'), path.join(dir, 'assets/main.js'));
  const L = (s) => s === '' ? 'index.html' : `${s}.html`;
  for (const [slug, p] of Object.entries(pages)) {
    const html = `<!DOCTYPE html>
<html lang="es" class="no-js">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title><meta name="description" content="${p.desc}">
${FONTS}
<link rel="stylesheet" href="assets/styles.css">
</head>
<body${p.lightHead ? ' class="light-head"' : ''}>
${header(L, slug)}
<main id="main">${p.body(L)}</main>
${footer(L)}
<script src="assets/main.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(dir, L(slug)), html);
  }
}

// ---------- Tema de WordPress ----------
function buildTheme() {
  const dir = path.join(OUT, 'wordpress', 'sag-theme'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  const L = (s) => `<?php echo esc_url( home_url( '/${s ? s + '/' : ''}' ) ); ?>`;
  const css = fs.readFileSync(path.join(__dirname, 'src/styles.css'), 'utf8');
  fs.writeFileSync(path.join(dir, 'style.css'), `/*
Theme Name: SAG Forense
Theme URI: https://www.sagconsulting.co
Author: SAG Assessment & Consulting
Description: Tema a la medida para SAG Assessment & Consulting. Inicio y páginas de las tres líneas (auditoría forense, analítica de datos, dictámenes periciales) más otros servicios, firma, reconocimientos y contacto.
Version: 1.0.0
Requires at least: 6.0
Requires PHP: 7.4
Text Domain: sag
*/
${css}
/* Contenido editable de WordPress (entradas y páginas genéricas) */
.entry{max-width:46rem;margin:0 auto}
.entry p,.entry ul,.entry ol{margin-bottom:1.2rem}
.entry h2,.entry h3{margin:2.4rem 0 1rem}
.entry a{border-bottom:1px solid var(--brass)}
.post-list{display:grid;gap:2rem;max-width:46rem;margin:0 auto}
`);
  fs.copyFileSync(path.join(__dirname, 'src/main.js'), path.join(dir, 'assets/main.js'));
  fs.writeFileSync(path.join(dir, 'functions.php'), `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
} );
add_action( 'wp_enqueue_scripts', function () {
	$v = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'sag-fonts', 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap', array(), null );
	wp_enqueue_style( 'sag-style', get_stylesheet_uri(), array( 'sag-fonts' ), $v );
	wp_enqueue_script( 'sag-main', get_template_directory_uri() . '/assets/main.js', array(), $v, true );
} );
add_filter( 'language_attributes', function ( $out ) { return $out . ' class="no-js"'; } );
`);
  const slugOf = (s) => s;
  fs.writeFileSync(path.join(dir, 'header.php'), `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php $sag_cur = is_front_page() ? '' : ( is_page() ? get_post_field( 'post_name', get_queried_object_id() ) : '' ); ?>
${header(L, '__CUR__').replace(/<li><a class="nl" href="([^"]+)">([^<]+)<\/a><\/li>/g, (m, href, t) => {
    const slug = NAV.find(n => n[1] === t)[0];
    return `<li><a class="nl" href="${href}"<?php echo ( '${slugOf(slug)}' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>${t}</a></li>`;
  })}
<main id="main">
`);
  fs.writeFileSync(path.join(dir, 'footer.php'), `</main>
${footer(L)}
<?php wp_footer(); ?>
</body>
</html>
`);
  for (const [slug, p] of Object.entries(pages)) {
    if (p.staticOnly) continue;
    const file = slug === '' ? 'front-page.php' : `page-${slug}.php`;
    fs.writeFileSync(path.join(dir, file), `<?php
/* ${p.title} — plantilla generada. Se aplica automáticamente ${slug === '' ? 'a la página de inicio' : `a la página con slug "${slug}"`}. */
get_header(); ?>
${p.body(L)}
<?php get_footer();
`);
  }
  // Plantillas genéricas: entradas del blog y páginas sin plantilla propia
  const generic = `<section class="page-hero dark"><div class="wrap"><h1><?php echo is_home() ? esc_html__( 'Conocimiento', 'sag' ) : ( is_singular() ? esc_html( get_the_title() ) : wp_kses_post( get_the_archive_title() ) ); ?></h1></div></section>
<section class="sec"><div class="wrap">
<?php if ( is_singular() ) : while ( have_posts() ) : the_post(); ?>
  <article class="entry"><?php if ( is_single() ) : ?><p class="mono" style="color:var(--muted);margin-bottom:2rem"><?php echo esc_html( get_the_date() ); ?></p><?php endif; ?><?php the_content(); ?></article>
<?php endwhile; else : ?>
  <div class="post-list"><?php while ( have_posts() ) : the_post(); ?>
    <a class="post" href="<?php the_permalink(); ?>"><span class="mono"><?php echo esc_html( get_the_date() ); ?></span><h3><?php the_title(); ?></h3><span class="link">Leer artículo <span>→</span></span></a>
  <?php endwhile; the_posts_pagination(); ?></div>
<?php endif; ?>
</div></section>`;
  fs.writeFileSync(path.join(dir, 'index.php'), `<?php get_header(); ?>\n${generic}\n<?php get_footer();\n`);
  fs.writeFileSync(path.join(dir, 'README.txt'), `TEMA "SAG Forense" — instalación

1. En WordPress: Apariencia > Temas > Añadir nuevo > Subir tema > sag-theme.zip > Instalar.
   Hágalo PRIMERO en un sitio de pruebas (staging), no en producción.
2. Cree estas páginas (Páginas > Añadir) con exactamente estos slugs. El contenido puede quedar vacío:
   auditoria-forense, analitica-de-datos, dictamenes-periciales, otros-servicios, nosotros, reconocimientos, contacto
   El tema les aplica su diseño automáticamente (archivos page-<slug>.php).
3. Ajustes > Lectura > "Una página estática" > Página de inicio: cualquier página llamada "Inicio".
   (front-page.php dibuja el inicio.) Opcional: página de entradas "Conocimiento" para los artículos.
4. Ajustes > Enlaces permanentes > "Nombre de la entrada".
5. Formulario de contacto: el del tema es visual. Para que envíe correos, instale un plugin
   (p. ej. Contact Form 7 o WPForms) y reemplace el <form> de page-contacto.php por su shortcode.
6. Busque los textos "[PENDIENTE: ...]" y reemplácelos antes de publicar.
`);
}

buildStatic(); buildTheme();
console.log('OK');
