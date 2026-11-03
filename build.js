// Genera el sitio estático (sitio/) y el tema de WordPress (wordpress/sag-theme/) desde un solo origen.
// Textos: este archivo. Estilos y comportamiento: src/styles.css y src/main.js. Imágenes, fuente y video: src/assets/.
const fs = require('fs'), path = require('path');
const OUT = __dirname;
const SRC = path.join(__dirname, 'src');
const P = (t) => `<span class="pending">[PENDIENTE: ${t}]</span>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');

// Datos que se completan aquí cuando existan (mientras estén vacíos, el sitio muestra el marcador [PENDIENTE]).
const ACADEMY_URL = '';   // Enlace de SAG Academy (viene en el código QR del afiche).
const ADDRESS = '';       // Dirección física, solo si se quiere publicar.

const C = {
  email: 'comercial@sagconsulting.co', tel: '+57 313 466 1950', telRaw: '+573134661950',
  wa: '+57 313 817 0765', waRaw: '573138170765',
  li: 'https://www.linkedin.com/company/sag-assesment-consulting-sas/',
  ig: 'https://www.instagram.com/sag.consulting/',
  liSimon: 'https://www.linkedin.com/in/simon-alejandro-guzman-mba-cfcs-cgap-1a299b29/',
  blog: 'https://www.sagconsulting.co/#conocimiento',
  legal: { t: 'https://www.sagconsulting.co/terminos.html', p: 'https://www.sagconsulting.co/privacidad.html', c: 'https://www.sagconsulting.co/cookies.html', e: 'https://www.sagconsulting.co/nosotros/codigo-de-etica-y-conducta/' },
  ia: 'Algunas imágenes y el video de fondo fueron generados con inteligencia artificial y no representan clientes ni instalaciones reales.',
};

const NAV = [
  ['auditoria-forense', 'Auditoría forense'],
  ['analitica-de-datos', 'Analítica forense'],
  ['dictamenes-periciales', 'Dictámenes periciales'],
  ['otros-servicios', 'Otros servicios'],
  ['nosotros', 'Nosotros'],
  ['reconocimientos', 'Reconocimientos'],
];

// ---------- Datos tomados de www.sagconsulting.co ----------
// Catálogo de 15 servicios (texto del sitio actual; "Gobernanza de datos" y "Analítica de datos" figuran allí como POR CONFIRMAR por el propietario).
const SVC = {
  '01': { c: "Forense", t: "Auditoría forense", d: "Prevenir, detectar y controlar el fraude, el abuso de confianza y la corrupción: malversación de activos, soborno, fraude fiscal, ciber-crimen y tráfico de influencias.", tags: [] },
  '02': { c: "Forense", t: "Laboratorio forense digital", d: "Recaudo, aseguramiento y análisis forense de evidencia digital en equipos, celulares, servidores y nube, con imágenes que preservan el original.", tags: [] },
  '03': { c: "Forense", t: "Evaluación de riesgo de fraude", d: "Fraud Risk Assessment: evaluamos y priorizamos esquemas y escenarios de fraude, y la eficacia de los controles que los mitigan.", tags: [] },
  '04': { c: "Forense", t: "Inteligencia de fuentes abiertas", d: "OSINT y SOCMINT: búsquedas estratégicas en fuentes abiertas y redes sociales para acelerar investigaciones y perfilar posibles implicados.", tags: [] },
  '05': { c: "Forense", t: "Debida diligencia de antecedentes", d: "Background Check Services: especialistas en detectar fraude y conductas antiéticas de personas y organizaciones.", tags: [] },
  '06': { c: "Datos y tecnología", t: "Analítica de datos", d: "Minería, análisis y visualización de todos los registros disponibles para encontrar patrones, anomalías e indicadores, y automatización de procesos repetitivos.", tags: [] },
  '07': { c: "Datos y tecnología", t: "Gobernanza de datos", d: "Políticas, responsables y controles para que los datos de la organización sean confiables, trazables y estén protegidos, base de cualquier análisis.", tags: [] },
  '08': { c: "Legal y pericial", t: "Dictámenes y peritajes", d: "Peritaje contable y financiero forense: daño emergente, lucro cesante, informes patrimoniales y sustentación ante jueces y tribunales de arbitramento nacionales e internacionales.", tags: [] },
  '09': { c: "Legal y pericial", t: "Contradicción de informes periciales", d: "Desafiamos la validez de informes periciales con alternativas metodológicas robustas y analizamos la tacha de documentos.", tags: [] },
  '10': { c: "Legal y pericial", t: "Apoyo a áreas legales", d: "Responsabilidad contractual y extracontractual, determinación de perjuicios y análisis de títulos valores complejos, con un equipo interdisciplinario de enfoque forense.", tags: [] },
  '11': { c: "Financiero y contable", t: "Auditoría forense de estados financieros", d: "Examen con técnicas forenses para detectar ingresos sobreestimados, manipulación de costos, ocultamiento de pasivos, fraude en nómina y pagos, entre otros.", tags: [] },
  '12': { c: "Financiero y contable", t: "Control interno y cumplimiento", d: "Análisis de controles internos y del cumplimiento normativo para identificar apropiación ilícita de activos, corrupción y soborno, LA/FT e inobservancia de normas.", tags: [] },
  '13': { c: "Sector público y cumplimiento", t: "Riesgos en recursos públicos", d: "Gestión y prevención de riesgos en la ejecución de recursos públicos: rendición de cuentas, planes de mejoramiento, defensa técnica ante entes de control y modelo preventivo y disciplinario.", tags: [] },
  '14': { c: "Sector público y cumplimiento", t: "Canales de denuncia", d: "Outsourcing de canales de denuncia transparentes y confiables: recepción por web, correo y teléfono, procesamiento y clasificación, comité de ética y reportes.", tags: [] },
  '15': { c: "Formación", t: "SAG Academy", d: "Plataforma de cursos guiados por expertos del sector para expandir conocimientos y habilidades en auditoría forense y destacar en la carrera profesional.", tags: [] },
};
for (const k of Object.keys(SVC)) SVC[k].n = k;
const AREAS = ["Advisory", "Propiedad intelectual", "Gobierno corporativo", "Público y regulatorio", "Cumplimiento normativo", "Tecnología, medios y telecomunicaciones", "Financiero", "Sostenibilidad y medio ambiente", "Fiscal", "Inmobiliario y urbanismo", "Litigación y arbitraje", "Privacidad", "Mercantil, fusiones y adquisiciones", "Mercado de valores"];
const SECTORES = ["Emprendimiento y startups", "Salud", "Energía y recursos naturales", "Seguros", "Entretenimiento y deporte", "Sociedades cotizadas", "Farmacia, salud y biotech", "Ocio y turismo", "Fundaciones y ONG", "Ciberseguridad", "Private client", "Derechos humanos"];
const VALORES = ["Excelencia", "Profesionalismo", "Imparcialidad", "Transparencia"];
// Artículos (los 6 más recientes se muestran en el inicio).
const POSTS = [
  { dt: "2026-01-22", d: "22 ene 2026", cat: "Economía y política pública", t: "Venezuela después del chavismo: oportunidades económicas para Colombia y la urgencia de una estrategia de reconstrucción", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2026/01/22/venezuela-despues-del-chavismo-oportunidades-economicas-para-colombia-y-la-urgencia-de-una-estrategia-de-reconstruccion/" },
  { dt: "2026-01-22", d: "22 ene 2026", cat: "Economía y política pública", t: "El salario mínimo no vive en el vacío: cuando el aumento ignora a las pymes, el empleo paga la cuenta", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2026/01/22/el-salario-minimo-no-vive-en-el-vacio-cuando-el-aumento-ignora-a-las-pymes-el-empleo-paga-la-cuenta/" },
  { dt: "2026-01-22", d: "22 ene 2026", cat: "Auditoría forense", t: "Davos 2026: señales de alerta para la auditoría forense en Latinoamérica", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2026/01/22/davos-2026-senales-de-alerta-para-la-auditoria-forense-en-latinoamerica-entre-el-dialogo-y-la-disrupcion-reflexiones-criticas-desde-la-vision-antifraude/" },
  { dt: "2025-11-22", d: "22 nov 2025", cat: "Auditoría forense", t: "Debida diligencia financiera forense en clubes de fútbol suramericanos", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2025/11/22/debida-diligencia-financiera-forense-en-clubes-de-futbol-suramericanos-metodologia-y-mejores-practicas/" },
  { dt: "2025-11-21", d: "21 nov 2025", cat: "Auditoría forense", t: "La evolución silenciosa del fraude bancario: cuando la prevención debe adelantarse al engaño", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2025/11/21/la-evolucion-silenciosa-del-fraude-bancario-cuando-la-prevencion-debe-adelantarse-al-engano/" },
  { dt: "2025-11-14", d: "14 nov 2025", cat: "Auditoría forense", t: "Auditoría forense y auditoría interna: una alianza estratégica para blindar la contratación pública", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2025/11/14/auditoria-forense-y-auditoria-interna-una-alianza-estrategica-para-blindar-la-contratacion-publica/" },
  { dt: "2025-11-13", d: "13 nov 2025", cat: "Peritaje", t: "Auditoría forense, peritaje financiero y la IA", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2025/11/13/auditoria-forense-peritaje-financiero-y-la-ia/" },
  { dt: "2024-08-21", d: "21 ago 2024", cat: "Analítica y tecnología", t: "Acceso a la inteligencia artificial para pymes en Colombia: un camino hacia la optimización", by: "Mónica Vargas", u: "https://www.sagconsulting.co/2024/08/21/acceso-a-la-inteligencia-artificial-para-pymes-en-colombia-un-camino-hacia-la-optimizacion/" },
  { dt: "2024-08-21", d: "21 ago 2024", cat: "Cumplimiento", t: "Consejos para el oficial de cumplimiento frente al SARLAFT 2.0 de la Supervigilancia", by: "Mónica Vargas", u: "https://www.sagconsulting.co/2024/08/21/consejos-para-el-o-cial-de-cumplimiento-frente-al-sarlaft-2-0-de-la-supervigilancia/" },
  { dt: "2024-01-24", d: "24 ene 2024", cat: "Cumplimiento", t: "Impacto del compliance en la prevención del riesgo en las empresas colombianas: un análisis a 2023", by: "Mónica Vargas", u: "https://www.sagconsulting.co/2024/01/24/impacto-del-compliance-en-la-prevencion-del-riesgo-en-las-empresas-colombianas-un-analisis-a-2023/" },
  { dt: "2021-01-13", d: "13 ene 2021", cat: "Auditoría forense", t: "La psicología, la sociología y los patrones de comportamiento de un defraudador", by: "Estefanía Ciendúa Rivera", u: "https://www.sagconsulting.co/2021/01/13/la-psicologia-la-sociologia-y-los-patrones-de-comportamiento-de-un-defraudador/" },
  { dt: "2020-05-20", d: "20 may 2020", cat: "Cumplimiento", t: "La prevención del lavado de activos y la financiación del terrorismo avanzan al ritmo del covid-19", by: "Germán Franco Lara", u: "https://www.sagconsulting.co/2020/05/20/la-prevencion-del-lavado-de-activos-y-la-financiacion-del-terrorismo-avanzan-al-ritmo-del-covid-19/" },
  { dt: "2020-04-15", d: "15 abr 2020", cat: "Auditoría forense", t: "Corrupnavirus", by: "Estefanía Ciendúa Rivera", u: "https://www.sagconsulting.co/2020/04/15/corrupnavirus/" },
  { dt: "2020-04-01", d: "1 abr 2020", cat: "Cumplimiento", t: "La debida diligencia y el coronavirus", by: "Germán Franco Lara", u: "https://www.sagconsulting.co/2020/04/01/la-debida-diligencia-y-el-coronavirus/" },
  { dt: "2020-03-17", d: "17 mar 2020", cat: "Auditoría forense", t: "Tipologías de delitos en tiempos de coronavirus", by: "Germán Franco Lara", u: "https://www.sagconsulting.co/2020/03/17/tipologias-de-delitos-en-tiempos-de-coronavirus/" },
  { dt: "2020-01-15", d: "15 ene 2020", cat: "Analítica y tecnología", t: "Al menos 43 % de las pymes no tiene planes contra los ciberataques", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2020/01/15/al-menos-43-de-las-pyme-no-tiene-planes-contra-los-ciberataques/" },
  { dt: "2020-01-13", d: "13 ene 2020", cat: "Auditoría forense", t: "En las auditorías hay un porcentaje de riesgo en que se puede dar la corrupción", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2020/01/13/en-las-auditorias-hay-un-porcentaje-de-riesgo-en-que-se-puede-dar-la-corrupcion/" },
  { dt: "2020-01-12", d: "12 ene 2020", cat: "Auditoría forense", t: "La auditoría forense y su efecto panóptico", by: "Simón Guzmán", u: "https://www.sagconsulting.co/2020/01/12/la-auditoria-forense-y-su-efecto-panoptico/" },
];

const TEAM = [
  { n: 'Mónica Vargas Ortega', r: 'CEO y socia', tags: ['Finanzas', 'Analítica de datos'], img: 'monica-480.webp', w: 480, h: 480, li: 'https://co.linkedin.com/in/monica-alejandra-vargas-ortega-84058b49',
    bio: ['Economista con especialización en finanzas de la Universidad del Rosario y MBA en dirección y administración de empresas de la Universidad Internacional de La Rioja (España), con formación en analítica de negocios de la escuela de negocios de la Universidad de Cambridge.', 'Más de 18 años de experiencia en el sector público y privado, con enfoque en auditoría, análisis financiero, estructuración de proyectos de control, minería de datos y visualización.', 'Es la CEO de SAG desde hace 8 años y lidera los procesos de tecnología: automatización, minería, analítica y visualización de datos, y auditoría de impuestos y parafiscales, a nivel nacional e internacional en países como Ecuador, México y Perú.'] },
  { n: 'Diego Andrés Alarcón', r: 'Director de investigaciones forenses', tags: ['Forense digital', 'Minería de datos'], img: 'diego-480.webp', w: 480, h: 480, li: 'https://www.linkedin.com/in/diego-alarcon-98bb47175/',
    bio: ['Contador público.', 'Trabaja en auditoría forense y forense digital, con herramientas de minería, analítica y visualización de datos.'] },
  { n: 'Andrea Sierra Sánchez', r: 'Gerente senior de investigaciones forenses', tags: ['Peritaje', 'Derecho y contaduría'], img: 'andrea-480.webp', w: 480, h: 480, li: 'https://www.linkedin.com/in/andrea-patricia-sierra-s%C3%A1nchez-a45042223/',
    bio: ['Abogada y contadora pública, especialista en gerencia tributaria y en instituciones jurídico procesales.', 'Elabora dictámenes periciales y análisis financieros de perjuicios, y coordina los asuntos legales de los encargos.'] },
  { n: 'Yamid Suárez Castellanos', r: 'Gerente de analítica forense', tags: ['Analítica', 'Automatización'], img: 'yamid-480.webp', w: 480, h: 480, li: 'https://www.linkedin.com/in/yamid-daney-suarez-castellanos-811b55226/',
    bio: ['Ingeniero de sistemas.', 'Trabaja en minería y analítica de datos, automatización de procesos y herramientas de tecnología de la información.'] },
];
// Equipo senior: tarjeta compacta (foto, nombre y cargo), como en el sitio actual. Si se quiere un perfil, agregar "bio" y pasar a TEAM.
const SENIORS = [['Alexandra Rodríguez', 'alexandra-480.webp'], ['Yulieth Monroy', 'yulieth-480.webp']];

const ADV = [
  ['Evidencia asegurada desde el primer día', 'Identificamos, obtenemos y aseguramos los elementos materiales probatorios, para que el informe pueda presentarse ante una autoridad.', 'Cadena de custodia'],
  ['Todos los datos, no solo una muestra', 'Revisamos todos los registros disponibles para separar lo habitual de lo inusual. Cada alerta se revisa antes de llamarla hallazgo.', null, '100%'],
  ['Forense digital completo', 'Análisis de equipos, celulares, servidores e información en la nube, con imágenes forenses que preservan el original.', 'Equipos · Nube'],
  ['Prevención y detección', 'Revisamos el marco interno y usamos analítica de datos para anticipar riesgos de fraude, antes de que se materialicen.', 'Analítica'],
  ['De la investigación a la audiencia', 'Acompañamos el proceso ante las autoridades y sustentamos el dictamen cuando se requiere.', 'Peritaje'],
  ['Muchos servicios, un mismo expediente', 'Auditoría forense, laboratorio digital, analítica de datos y peritaje se contratan por separado y, cuando el caso lo pide, trabajan juntos sobre la misma evidencia.', 'Integrado'],
];

const STEPS = [
  ['Diagnóstico', 'Partimos de lo que se sabe y de lo que se sospecha. Definimos el alcance y las preguntas que la investigación debe responder.'],
  ['Aseguramiento de la evidencia', 'Obtenemos y protegemos los elementos materiales probatorios, incluidas las imágenes forenses de equipos, celulares y servidores.'],
  ['Análisis', 'Trabajamos sobre todos los datos disponibles. Ubicamos dónde se materializó el riesgo, durante cuánto tiempo y con qué pérdida.'],
  ['Informe y dictamen', 'Entregamos un informe estructurado, con posible alcance pericial, y acompañamos el proceso hasta la sustentación en audiencia.'],
];

// ---------- Íconos ----------
const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  arr: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  up: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
  doc: svg('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>'),
  shield: svg('<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>'),
  list: svg('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>'),
  chart: svg('<path d="M4 20V4M4 20h16"/><path d="m8 15 3-4 3 2 4-6"/>'),
  grid: svg('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="4" rx="1.5"/><rect x="13" y="10" width="7" height="10" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/>'),
  trace: svg('<circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="12" r="2.2"/><circle cx="6" cy="18" r="2.2"/><path d="M8 6.5 16 11M8 17.5 16 13"/>'),
  mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  scale: svg('<path d="M12 4v16M7 20h10M5 8h14"/><path d="m5 8-3 7a3.5 3.5 0 0 0 6 0zM19 8l-3 7a3.5 3.5 0 0 0 6 0z"/>'),
};

// ---------- Plantillas compartidas ----------
// x = { L: (slug) => enlace a una página, A: (ruta) => URL de un recurso, wp: bool }
const navItem = (x, s, t, cur) => {
  const attr = x.wp ? `<?php echo ( '${s}' === $sag_cur ) ? ' aria-current="page"' : ''; ?>` : (s === cur ? ' aria-current="page"' : '');
  return `<li><a href="${x.L(s)}"${attr}>${t}</a></li>`;
};

const header = (x, cur) => `
<a class="skip" href="#contenido">Saltar al contenido</a>
<div class="progress" id="progress" aria-hidden="true"></div>
<header class="head" id="head">
  <div class="wrap head__in">
    <a class="head__logo" href="${x.L('')}" aria-label="SAG Assessment &amp; Consulting, inicio"><img src="${x.A('img/logo-sag-blanco.svg')}" alt="SAG Assessment &amp; Consulting" width="84" height="46"></a>
    <nav class="nav" id="nav" aria-label="Principal">
      <ul>${NAV.map(([s, t]) => navItem(x, s, t, cur)).join('')}</ul>
      <a class="btn btn--sm btn--line head__cta" href="${x.L('contacto')}"><span>Consultar un caso</span></a>
    </nav>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="nav" aria-label="Abrir menú"><i></i><i></i></button>
  </div>
</header>`;

const footer = (x) => `
<footer class="foot">
  <div class="wrap">
    <div class="foot__top">
      <div class="foot__brand">
        <a href="${x.L('')}" aria-label="SAG Assessment &amp; Consulting, inicio"><img src="${x.A('img/logo-sag-blanco.svg')}" alt="SAG Assessment &amp; Consulting" width="108" height="60" loading="lazy"></a>
        <p class="foot__claim">Del dato al hecho. Del hecho al dictamen.</p>
      </div>
      <div><h2 class="foot__h">Líneas</h2><ul>
        <li><a href="${x.L('auditoria-forense')}">Auditoría forense</a></li>
        <li><a href="${x.L('analitica-de-datos')}">Analítica de datos forense</a></li>
        <li><a href="${x.L('dictamenes-periciales')}">Dictámenes periciales</a></li>
        <li><a href="${x.L('otros-servicios')}">Otros servicios</a></li></ul></div>
      <div><h2 class="foot__h">Firma</h2><ul>
        <li><a href="${x.L('nosotros')}">Nosotros y equipo</a></li>
        <li><a href="${x.L('reconocimientos')}">Reconocimientos</a></li>
        <li><a href="${x.L('contacto')}">Contacto</a></li>
        <li><a href="${C.legal.e}" target="_blank" rel="noopener">Código de ética</a></li></ul></div>
      <div><h2 class="foot__h">Contacto</h2><ul>
        <li><a href="mailto:${C.email}">${C.email}</a></li>
        <li><a href="tel:${C.telRaw}">${C.tel}</a></li>
        <li><a href="https://wa.me/${C.waRaw}" target="_blank" rel="noopener">WhatsApp ${C.wa}</a></li>
        <li>Bogotá, Colombia</li>
        <li><a href="${C.li}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${C.ig}" target="_blank" rel="noopener">Instagram</a></li></ul></div>
    </div>
    <div class="foot__bot">
      <p>© <span id="year">2026</span> SAG Assessment &amp; Consulting S.A.S. · NIT 900.951.905-5 · Bogotá, Colombia<small class="foot__ia">${C.ia}</small></p>
      <nav aria-label="Legal">
        <a href="${C.legal.t}" target="_blank" rel="noopener">Términos y Condiciones</a>
        <a href="${C.legal.p}" target="_blank" rel="noopener">Política de Privacidad</a>
        <a href="${C.legal.c}" target="_blank" rel="noopener">Política de Cookies</a>
        <a href="#top">Volver arriba ↑</a>
      </nav>
    </div>
  </div>
</footer>`;

const cta = (x) => `
<section class="cta" id="consulta">
  <div class="grain" aria-hidden="true"></div>
  <div class="hero__aura hero__aura--c" aria-hidden="true"></div>
  <div class="wrap cta__grid">
    <div>
      <p class="lbl lbl--cy reveal">Consulta confidencial</p>
      <h2 class="h2 h2--lt" data-words>¿Tiene una sospecha que necesita <b>convertirse en prueba?</b></h2>
      <p class="lead lead--lt reveal">Basta una descripción general. Si el caso avanza, le pediremos nombres y documentos por un canal seguro.</p>
    </div>
    <div class="cta__box reveal">
      <ul class="chan">
        <li><span>Correo</span><a href="mailto:${C.email}">${C.email}</a></li>
        <li><span>Teléfono</span><a href="tel:${C.telRaw}">${C.tel}</a></li>
        <li><span>WhatsApp</span><a href="https://wa.me/${C.waRaw}" target="_blank" rel="noopener">${C.wa}</a></li>
      </ul>
      <a class="btn btn--solid btn--block" href="${x.L('contacto')}"><span>Consultar un caso</span>${I.arr}</a>
    </div>
  </div>
</section>`;

const pageHero = (x, o) => `
<section class="phero ${o.cls || 'phero--solo'}">
  <div class="hero__lines" aria-hidden="true"></div>
  <div class="hero__aura hero__aura--a" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap phero__grid">
    <div>
      <nav class="crumbs reveal" aria-label="Ruta de navegación"><a href="${x.L('')}">Inicio</a><i>/</i><span>${o.crumb}</span></nav>
      <p class="lbl lbl--cy reveal">${o.label}</p>
      <h1 class="reveal">${o.title}</h1>
      <p class="lead lead--lt reveal">${o.lead}</p>
      ${o.actions ? `<div class="phero__cta reveal">${o.actions}</div>` : ''}
    </div>
    ${o.visual || ''}
  </div>
</section>`;

const arch = (x, img, alt, w, h, pos, tag) => `
<div class="hero__vis reveal">
  <div class="arch__outline" aria-hidden="true"></div>
  <div class="arch" data-parallax="-0.05"><div class="ph ph--live"><img src="${x.A(img)}" alt="${esc(alt)}" width="${w}" height="${h}" style="object-position:${pos}"></div></div>
  <div class="vis__tag"><b>${tag[0]}</b><span>${tag[1]}</span></div>
</div>`;

const ring = (inner) => `<div class="rs reveal">${inner}</div>`;

const svcCard = (s, i, showCat) => `<li class="svc__c reveal">
  <div class="svc__top"><span class="svc__n">${showCat && s.n ? s.n : pad(i + 1)}</span>${showCat ? `<span class="svc__cat">${esc(s.c)}</span>` : ''}</div>
  <h3>${esc(s.t)}</h3><p>${esc(s.d)}</p>
  ${s.tags && s.tags.length ? `<ul class="svc__tags">${s.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
</li>`;
const svcGrid = (items, two, showCat) => `<ul class="svc${two ? ' svc--2' : ''}" data-stagger>${items.map((s, i) => svcCard(s, i, showCat)).join('')}</ul>`;

const secHead = (lbl, h2, lead, dark, md) => `
<header class="sec__head">
  <p class="lbl ${dark ? 'lbl--cy' : 'lbl--d'} reveal">${lbl}</p>
  <h2 class="h2${dark ? ' h2--lt' : ''}${md ? ' h2--md' : ''}" data-words>${h2}</h2>
  ${lead ? `<p class="lead${dark ? ' lead--lt' : ''} reveal">${lead}</p>` : ''}
</header>`;

// ---------- Bloques de inicio ----------
const seal = `
<div class="seal seal--hero" data-parallax="0.07" role="img" aria-label="Leaders League: Highly Recommended, seis años consecutivos">
  <svg viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <linearGradient id="gold1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1deaa"/><stop offset=".5" stop-color="#d4b26a"/><stop offset="1" stop-color="#9a763a"/></linearGradient>
      <path id="sealPath1" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/>
    </defs>
    <circle cx="100" cy="100" r="97" fill="rgba(5,15,32,.82)" stroke="url(#gold1)" stroke-width="1.4"/>
    <circle cx="100" cy="100" r="62" fill="none" stroke="url(#gold1)" stroke-width=".7" opacity=".8"/>
    <g class="seal__spin"><text font-size="11.2" font-weight="600" letter-spacing="2.6" fill="url(#gold1)"><textPath href="#sealPath1" textLength="496" lengthAdjust="spacing">LEADERS LEAGUE · HIGHLY RECOMMENDED · 6 AÑOS CONSECUTIVOS ·</textPath></text></g>
    <text x="100" y="116" text-anchor="middle" font-size="58" font-weight="300" fill="url(#gold1)">6</text>
    <text x="100" y="136" text-anchor="middle" font-size="8.4" font-weight="600" letter-spacing="3" fill="#ecd8a4">AÑOS</text>
  </svg>
</div>`;

const MQ = ['Fraude', 'Corrupción', 'Abuso de confianza', 'Laboratorio forense digital', 'Gobernanza de datos', 'Analítica de datos', 'OSINT', 'Peritaje', 'SAG Academy', 'Cumplimiento'];
const marquee = `
<div class="mq" aria-hidden="true">
  <div class="mq__track">${[0, 1].map(() => MQ.map((t) => `<span>${t}</span><b></b>`).join('')).join('')}</div>
</div>`;

const awardsBlock = (x) => `
<div class="wrap awards" data-stagger>
  <article class="award award--lg reveal">
    <img class="award__seal" src="${x.A('img/leaders-league-ranked-2025.webp')}" alt="Sello de Leaders League: Ranked Firm 2025" width="560" height="560" loading="lazy">
    <div>
      <p class="lbl lbl--gold">Leaders League</p>
      <h3>Ranked Firm 2025</h3>
    </div>
  </article>
  <article class="award reveal">
    <img class="award__logo" src="${x.A('img/wealth-finance.webp')}" alt="Wealth &amp; Finance International" width="448" height="210" loading="lazy">
    <div>
      <p class="lbl lbl--gold">Management Consulting Awards 2024 · 2025</p>
      <ul class="award__list">
        <li>Best Forensic Auditing &amp; Compliance Advisory Firm 2025 · Latin America</li>
        <li>Client Service Excellence Award 2025</li>
        <li>Best Fraud Detection Consulting Firm · 2024</li>
      </ul>
    </div>
  </article>
</div>`;

const recogBlock = (x) => `
<section class="sec sec--bone" id="reconocimientos">
  <div class="wrap recog">
    <div class="recog__num reveal" aria-hidden="true"><span class="six"><span data-count="6">6</span></span></div>
    <div class="recog__copy">
      <p class="lbl lbl--d reveal">Reconocimientos</p>
      <h2 class="h2" data-words>Seis años consecutivos <b>altamente recomendados.</b></h2>
      <p class="lead reveal">Leaders League nos califica como firma <em>Highly Recommended</em> seis años seguidos. Una distinción se gana una vez; sostenerla año tras año exige la misma disciplina en cada encargo.</p>
      <a class="link link--d reveal" href="${x.L('reconocimientos')}"><span>Ver todos los reconocimientos</span>${I.arr}</a>
    </div>
  </div>
  ${awardsBlock(x)}
</section>`;

const statsBlock = `
<section class="stats" id="cifras" aria-label="SAG en cifras">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap">
    <h2 class="h2 h2--lt stats__h" data-words>SAG <b>en cifras.</b></h2>
    <ul class="stats__grid" data-stagger>
      <li class="stats__i reveal"><p class="stats__n"><span class="stats__p">+</span><span data-count="150">150</span></p><h3>clientes</h3><p>organizaciones que han confiado en SAG para prevenir, detectar e investigar el fraude.</p></li>
      <li class="stats__i reveal"><p class="stats__n"><span class="stats__p">+</span><span data-count="600">600</span></p><h3>casos atendidos</h3><p>de manera exitosa, con la evidencia y el rigor que cada caso exige.</p></li>
      <li class="stats__i reveal"><p class="stats__n"><span class="stats__p">+</span><span data-count="10">10</span></p><h3>años de experiencia</h3><p>fortaleciendo la gestión de nuestros clientes como socios estratégicos en la investigación y prevención de casos de fraude.</p></li>
    </ul>
  </div>
</section>`;

const LINES = [
  ['auditoria-forense', '01', 'Auditoría forense', 'Prevención, detección e investigación de fraude, corrupción y abuso de confianza, en el sector público y en el privado.', ['Investigación de fraude y corrupción', 'Laboratorio forense digital', 'Evaluación de riesgo de fraude', 'OSINT y debida diligencia']],
  ['analitica-de-datos', '02', 'Analítica de datos forense', 'Revisamos todas las transacciones, no una muestra. Minería, visualización y automatización para encontrar lo que el muestreo no ve.', ['Analítica forense de transacciones', 'Monitoreo y alertas tempranas', 'Gobernanza y calidad de datos', 'Tableros para la toma de decisiones']],
  ['dictamenes-periciales', '03', 'Dictámenes periciales', 'Peritaje contable y financiero forense para procesos judiciales, arbitrales y administrativos, con sustentación en audiencia.', ['Daño emergente y lucro cesante', 'Contradicción de dictámenes', 'Tacha de documentos', 'Apoyo técnico a equipos legales']],
];
const linesBlock = (x) => `
<section class="sec sec--white" id="lineas">
  <div class="wrap">
    ${secHead('Tres líneas, un mismo expediente', 'Un portafolio integrado para <b>prevenir, detectar e investigar.</b>', 'Somos su aliado estratégico en la prevención y detección de fraude, las investigaciones, el análisis proactivo de datos y la defensa judicial mediante informes periciales.')}
    <div class="lines" data-stagger>${LINES.map(([s, n, t, d, ul]) => `
      <article class="line reveal"><span class="line__n">${n}</span><h3>${t}</h3><p>${d}</p>
        <ul>${ul.map((li) => `<li>${li}</li>`).join('')}</ul>
        <a class="link" href="${x.L(s)}"><span>Explorar la línea</span>${I.arr}</a></article>`).join('')}
    </div>
    <p class="lines__more reveal">¿Busca control interno, cumplimiento LA/FT, canales de denuncia o formación? <a href="${x.L('otros-servicios')}">Vea otros servicios →</a></p>
  </div>
</section>`;

const advBlock = (x) => `
<section class="sec sec--dark" id="ventajas">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap adv">
    <div class="adv__side">
      <p class="lbl lbl--cy reveal">Ventajas de la consultoría forense</p>
      <h2 class="h2 h2--lt" data-words>Cuando importa saber qué pasó, <b>el método lo es todo.</b></h2>
      <p class="lead lead--lt reveal">Una investigación débil no se sostiene ante una autoridad. Trabajamos para que cada conclusión tenga evidencia detrás y pueda explicarse con claridad.</p>
      <div class="adv__img reveal" data-parallax="-0.04"><div class="ph ph--live"><img src="${x.A('img/ventajas.webp')}" alt="Estación de análisis forense digital con disco, bolsa de evidencia y lupa (imagen generada con IA)" width="1536" height="1024" loading="lazy"></div></div>
    </div>
    <ul class="adv__list" data-stagger>${ADV.map(([t, d, tag, fig], i) => `
      <li class="row reveal"><span class="row__n">${pad(i + 1)}</span><div><h3>${t}</h3><p>${d}</p></div>${fig ? `<span class="row__fig">${fig}</span>` : `<span class="row__t">${tag}</span>`}</li>`).join('')}
    </ul>
  </div>
</section>`;

const founderBlock = (x, teamLink) => `
<article class="founder reveal">
  <div class="founder__ph">
    <img src="${x.A('img/equipo/simon-900.webp')}" alt="Retrato de Simón Guzmán Guerrero" width="900" height="1079" loading="lazy">
    <span class="founder__badge">Socio fundador</span>
  </div>
  <div class="founder__body">
    <p class="lbl lbl--cy">Liderazgo</p>
    <h3>Simón Guzmán Guerrero</h3>
    <p class="founder__role">Socio fundador</p>
    <p>Economista, especialista en Administración Financiera y control fiscal, con máster en dirección y administración de empresas. Auditor forense con más de 30 años de experiencia en investigación de fraude, recuperación de activos y gobierno de organizaciones públicas y privadas en Colombia y Latinoamérica.</p>
    <p>Actúa como perito ante jueces y tribunales. Es profesor de auditoría forense en la Pontificia Universidad Javeriana y autor de libros sobre la materia.</p>
    <ul class="cred" aria-label="Credenciales"><li>MBA</li><li>CGAP</li><li>CFCS</li><li>Avaluador acreditado</li></ul>
    <dl class="path">
      <div><dt>Deloitte</dt><dd>Dirigió prácticas forenses; director para la Región Andina</dd></div>
      <div><dt>BDO</dt><dd>Dirigió la práctica forense</dd></div>
      <div><dt>Contraloría General de la República</dt><dd>Contralor Delegado Intersectorial, a cargo del Sistema General de Regalías</dd></div>
    </dl>
    <a class="link" href="${C.liSimon}" target="_blank" rel="noopener"><span>Ver perfil en LinkedIn</span>${I.up}</a>
    ${teamLink ? `<a class="link" href="${x.L('nosotros')}"><span>Conozca al equipo completo</span>${I.arr}</a>` : ''}
  </div>
</article>`;

const founderSection = (x) => `
<section class="sec sec--bone" id="equipo">
  <div class="wrap">
    ${secHead('El equipo', 'Experiencia que <b>sostiene cada dictamen.</b>', 'Un equipo multidisciplinario, con formación en contaduría, derecho, economía e ingeniería de sistemas, liderado por un socio fundador con más de 30 años en investigación de fraude.')}
    ${founderBlock(x, true)}
  </div>
</section>`;

const methodBlock = (x) => `
<section class="sec sec--dark" id="metodo">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap method">
    <div class="method__side">
      <p class="lbl lbl--cy reveal">Cómo trabajamos</p>
      <h2 class="h2 h2--lt" data-words>Del dato al dictamen, <b>sin saltos.</b></h2>
      <p class="lead lead--lt reveal">Cuatro pasos que se apoyan entre sí. Cada uno deja constancia de lo que hizo y por qué.</p>
      <a class="btn btn--solid reveal" href="${x.L('contacto')}"><span>Hablemos de su caso</span>${I.arr}</a>
    </div>
    <ol class="steps" id="steps">
      <span class="steps__rail" aria-hidden="true"><i id="rail"></i></span>
      ${STEPS.map(([t, d], i) => `<li class="step reveal"><span class="step__n">${pad(i + 1)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ol>
  </div>
</section>`;

const bandBlock = (x) => `
<section class="band">
  <div class="band__img" data-parallax="0.08"><div class="ph ph--live"><img src="${x.A('img/banda.webp')}" alt="Panorámica de Bogotá al atardecer desde una oficina (imagen generada con IA)" width="1536" height="1024" loading="lazy"></div></div>
  <div class="band__shade" aria-hidden="true"></div>
  <div class="wrap band__in">
    <p class="band__quote reveal">Rigor técnico, trazabilidad y un criterio que se sostiene ante cualquier autoridad.</p>
    <dl class="band__stats">
      <div class="reveal"><dt>Desde</dt><dd><span data-count="2019" data-plain>2019</span></dd></div>
      <div class="reveal"><dt>Servicios</dt><dd><span data-count="15">15</span></dd></div>
      <div class="reveal"><dt>Cobertura</dt><dd class="dd--txt">Colombia y Latinoamérica</dd></div>
    </dl>
  </div>
</section>`;

const postsBlock = `
<section class="sec sec--white" id="conocimiento">
  <div class="wrap">
    <header class="sec__head sec__head--row">
      <div>
        <p class="lbl lbl--d reveal">Conocimiento</p>
        <h2 class="h2" data-words>Ideas y análisis de <b>nuestros especialistas.</b></h2>
        <p class="lead reveal">Artículos sobre fraude, auditoría forense, analítica, peritaje y cumplimiento, escritos por el equipo de SAG.</p>
      </div>
      <div class="li reveal">
        <p>Más publicaciones en</p>
        <div class="li__b">
          <a class="btn btn--sm btn--dark" href="${C.li}" target="_blank" rel="noopener"><span>LinkedIn de SAG</span></a>
          <a class="btn btn--sm btn--dark" href="${C.liSimon}" target="_blank" rel="noopener"><span>Simón Guzmán</span></a>
        </div>
      </div>
    </header>
    <ul class="posts" data-stagger>${POSTS.slice(0, 6).map((p) => `
      <li class="post reveal"><a class="post__a" href="${p.u}" target="_blank" rel="noopener">
        <span class="post__meta"><time datetime="${p.dt}">${p.d}</time><em>${esc(p.cat)}</em></span>
        <h3>${esc(p.t)}</h3><span class="post__by">${esc(p.by)}</span>
        <span class="post__go">Leer artículo ${I.up}</span></a></li>`).join('')}
    </ul>
    <div class="posts__more reveal"><a class="btn btn--dark" href="${C.blog}" target="_blank" rel="noopener"><span>Ver más artículos</span>${I.arr}</a></div>
  </div>
</section>`;

// ---------- Páginas de línea (plantilla común) ----------
const linePage = (x, c) => `
${pageHero(x, {
  crumb: c.crumb, label: c.label, title: c.title, lead: c.lead,
  actions: `<a class="btn btn--solid" href="${x.L('contacto')}"><span>Consultar un caso</span>${I.arr}</a><a class="btn btn--ghost" href="#servicios"><span>Ver servicios</span></a>`,
  visual: arch(x, c.img, c.alt, c.w, c.h, c.pos, [c.n, c.crumb]),
})}
<section class="sec sec--sm sec--dark">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap">
    ${secHead('Cuándo nos llaman', 'Situaciones en las que <b>nos buscan.</b>', '', true, true)}
    <div class="when" data-stagger>${c.when.map((t, i) => `<div class="reveal"><span>${pad(i + 1)}</span><p>${t}</p></div>`).join('')}</div>
  </div>
</section>
<section class="sec sec--bone" id="servicios">
  <div class="wrap">
    ${secHead('Servicios', 'Qué <b>hacemos.</b>', c.svcLead, false, true)}
    ${svcGrid(c.svc, c.svc.length % 3 !== 0, false)}
  </div>
</section>
<section class="sec sec--dark">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap">
    ${secHead(c.flow.label, c.flow.title, c.flow.lead, true, true)}
    <div class="flow" data-stagger>${c.flow.steps.map(([t, d]) => `<div class="reveal"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>
<section class="sec sec--white">
  <div class="wrap">
    ${secHead('Entregables', 'Lo que <b>recibe.</b>', '', false, true)}
    <div class="deliv" data-stagger>${c.deliv.map(([ic, t, d]) => `<div class="reveal">${I[ic]}<h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </div>
</section>
<section class="sec sec--sm sec--bone">
  <div class="wrap">
    ${secHead('Otras líneas', 'Un mismo expediente, <b>tres líneas.</b>', '', false, true)}
    <div class="related" data-stagger>${c.related.map(([s, n, t]) => `<a class="reveal" href="${x.L(s)}"><div><small>${n}</small><h3>${t}</h3></div><span class="go">${I.arr}</span></a>`).join('')}</div>
  </div>
</section>
${cta(x)}`;

// ---------- Páginas ----------
const pages = {};

pages[''] = { title: 'SAG Assessment & Consulting | Auditoría forense en Colombia', desc: 'Firma colombiana de auditoría forense, laboratorio forense digital, analítica y gobernanza de datos, dictámenes periciales y formación. Highly Recommended por Leaders League seis años consecutivos.', body: (x) => `
<section class="hero" id="inicio">
  <div class="hero__bg" aria-hidden="true">
    <img class="hero__poster" src="${x.A('video/hero-bg-poster.webp')}" alt="" width="1280" height="720">
    <video class="hero__vid" id="hero-vid-a" muted playsinline preload="none" data-src="${x.A('video/hero-bg.mp4')}"></video>
    <video class="hero__vid" id="hero-vid-b" muted playsinline preload="none" data-src="${x.A('video/hero-bg.mp4')}"></video>
    <div class="hero__veil"></div>
  </div>
  <canvas class="hero__net" id="net" aria-hidden="true"></canvas>
  <div class="hero__aura hero__aura--a" aria-hidden="true"></div>
  <div class="hero__aura hero__aura--b" aria-hidden="true"></div>
  <div class="hero__lines" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <p class="lbl lbl--cy reveal">Consultoría forense · Colombia</p>
      <h1 class="hero__title" aria-label="Del dato al hecho. Del hecho al dictamen.">
        <span class="ln"><span>Del dato</span></span>
        <span class="ln"><span>al hecho.</span></span>
        <span class="ln ln--b"><span>Del hecho</span></span>
        <span class="ln ln--b"><span>al dictamen.</span></span>
      </h1>
      <p class="hero__lead reveal">Somos una firma colombiana con amplia experiencia en prevención, detección y contención de fraude, abuso de confianza y corrupción. Auditoría forense, laboratorio forense digital, analítica y gobernanza de datos, peritaje y formación, en un solo equipo.</p>
      <div class="hero__cta reveal">
        <a class="btn btn--solid" href="${x.L('contacto')}"><span>Consultar un caso</span>${I.arr}</a>
        <a class="btn btn--ghost" href="#lineas"><span>Conozca nuestras líneas</span></a>
      </div>
    </div>
    <div class="hero__vis">
      <div class="arch__outline" aria-hidden="true"></div>
      <div class="arch" data-parallax="-0.05"><div class="ph ph--live"><img src="${x.A('img/hero.webp')}" alt="Analista forense revisando visualizaciones de datos en una oficina oscura (imagen generada con IA)" width="1024" height="1536" fetchpriority="high"></div></div>
      ${seal}
    </div>
  </div>
  <div class="wrap hero__stats">
    <dl>
      <div class="reveal"><dt>Socio fundador</dt><dd>+<span data-count="30">30</span> años</dd><dd class="sub">investigando fraude y corrupción</dd></div>
      <div class="reveal"><dt>Servicios integrados</dt><dd><span data-count="15">15</span></dd><dd class="sub">de forense a formación</dd></div>
      <div class="reveal"><dt>Cobertura</dt><dd class="dd--sm">Colombia y<br>Latinoamérica</dd><dd class="sub">desde Bogotá</dd></div>
    </dl>
  </div>
  <a class="scroll" href="#reconocimientos" aria-label="Bajar a reconocimientos"><i></i></a>
</section>
${marquee}
${recogBlock(x)}
${statsBlock}
${linesBlock(x)}
${advBlock(x)}
${founderSection(x)}
${methodBlock(x)}
${bandBlock(x)}
${postsBlock}
${cta(x)}` };

pages['auditoria-forense'] = { title: 'Auditoría forense | SAG Assessment & Consulting', desc: 'Prevención, detección e investigación de fraude, corrupción y abuso de confianza.', body: (x) => linePage(x, {
  n: '01', crumb: 'Auditoría forense', label: 'Línea 01 · Fraude, corrupción y abuso de confianza',
  title: 'Auditoría <b>forense</b>',
  lead: 'Prevenimos, detectamos e investigamos fraude, corrupción y abuso de confianza. Malversación, soborno, fraude fiscal, ciberdelito y tráfico de influencias, en organizaciones públicas y privadas.',
  img: 'img/ventajas.webp', alt: 'Estación de análisis forense digital con disco, bolsa de evidencia y lupa (imagen generada con IA)', w: 1536, h: 1024, pos: '52% 50%',
  when: [
    'Hay una denuncia interna o una sospecha concreta y necesita saber qué pasó, quién participó y cuánto costó.',
    'Un ente de control, un regulador o un socio pide explicaciones y la organización necesita una revisión independiente.',
    'Los estados financieros no cuadran con la operación y la auditoría tradicional no encuentra la causa.',
    'Va a cerrar una inversión, una alianza o un contrato y necesita conocer a fondo a la contraparte.',
  ],
  svcLead: 'Seis frentes que se combinan según el caso.',
  svc: ['01', '02', '03', '04', '05', '11'].map((k) => SVC[k]),
  flow: { label: 'Cómo trabajamos', title: 'De la sospecha <b>a la prueba.</b>', lead: 'Cuatro pasos que se apoyan entre sí. Cada uno deja constancia de lo que hizo y por qué.', steps: STEPS },
  deliv: [
    ['doc', 'Informe de investigación', 'Hechos, responsables, mecanismos y cuantificación, con cada conclusión atada a su soporte.'],
    ['shield', 'Expediente de evidencia', 'Material recaudado con cadena de custodia, listo para uso disciplinario, fiscal, penal o civil.'],
    ['list', 'Plan de cierre de brechas', 'Controles concretos para que el esquema detectado no se repita.'],
  ],
  related: [['analitica-de-datos', 'Línea 02', 'Analítica de datos forense'], ['dictamenes-periciales', 'Línea 03', 'Dictámenes periciales']],
}) };

pages['analitica-de-datos'] = { title: 'Analítica de datos forense | SAG Assessment & Consulting', desc: 'Analítica forense, minería, visualización, automatización y gobernanza de datos.', body: (x) => linePage(x, {
  n: '02', crumb: 'Analítica de datos forense', label: 'Línea 02 · Minería, visualización y automatización',
  title: 'Analítica de datos <b>forense</b>',
  lead: 'Revisamos el cien por ciento de las transacciones, no una muestra. Minería, visualización y automatización para encontrar patrones, anomalías y relaciones que el muestreo tradicional no ve.',
  img: 'img/hero.webp', alt: 'Analista forense revisando visualizaciones de datos en una oficina oscura (imagen generada con IA)', w: 1024, h: 1536, pos: '50% 42%',
  when: [
    'Tiene millones de registros contables, de pagos o de contratación y nadie ha podido revisarlos completos.',
    'Quiere pasar de descubrir el fraude tarde a recibir alertas cuando empieza.',
    'Una investigación necesita cruzar fuentes que no conversan entre sí: ERP, bancos, proveedores, nómina.',
    'Sus datos no son confiables y eso debilita cualquier decisión o hallazgo construido sobre ellos.',
  ],
  svcLead: 'De los datos crudos a conclusiones que se pueden explicar.',
  svc: [SVC['06'],
    { t: 'Monitoreo continuo y alertas tempranas', d: 'Reglas y modelos que se ejecutan de forma automática y avisan cuando una operación se sale de lo esperado.', tags: ['Automatización', 'Indicadores de riesgo'] },
    { t: 'Visualización para la decisión', d: 'Tableros que muestran a la dirección dónde está el riesgo, sin depender de informes extensos.', tags: ['Tableros'] },
    SVC['07']],
  flow: { label: 'Cómo trabajamos', title: 'De los datos crudos <b>a la decisión.</b>', lead: 'Un recorrido en el que cada cifra se puede reproducir desde su fuente.', steps: [
    ['Fuentes', 'Identificamos y conectamos las fuentes de información: contabilidad, bancos, proveedores, nómina y contratación.'],
    ['Pruebas sobre el 100%', 'Aplicamos pruebas y modelos a toda la población de registros, no a una muestra.'],
    ['Hallazgos priorizados', 'Cada alerta se revisa antes de llamarla hallazgo. Ordenamos por nivel de riesgo y monto.'],
    ['Tableros y alertas', 'Entregamos visualizaciones y reglas que su equipo sigue usando después del encargo.'],
  ] },
  deliv: [
    ['chart', 'Hallazgos priorizados', 'Transacciones y terceros a revisar, ordenados por nivel de riesgo y monto.'],
    ['grid', 'Tableros y reglas', 'Herramientas que su equipo sigue usando después del encargo.'],
    ['trace', 'Trazabilidad completa', 'Cada cifra se puede reproducir desde la fuente, requisito para un uso pericial posterior.'],
  ],
  related: [['auditoria-forense', 'Línea 01', 'Auditoría forense'], ['dictamenes-periciales', 'Línea 03', 'Dictámenes periciales']],
}) };

pages['dictamenes-periciales'] = { title: 'Dictámenes periciales | SAG Assessment & Consulting', desc: 'Peritaje contable y financiero forense, contradicción de dictámenes y apoyo a equipos legales.', body: (x) => linePage(x, {
  n: '03', crumb: 'Dictámenes periciales', label: 'Línea 03 · Peritaje contable y financiero forense',
  title: 'Dictámenes <b>periciales</b>',
  lead: 'Peritaje contable y financiero forense para procesos judiciales, arbitrales y administrativos. Cuantificamos el daño, controvertimos dictámenes y sustentamos nuestras conclusiones en audiencia.',
  img: 'img/banda.webp', alt: 'Panorámica de Bogotá al atardecer desde una oficina (imagen generada con IA)', w: 1536, h: 1024, pos: '56% 50%',
  when: [
    'Un proceso exige cuantificar daño emergente y lucro cesante con un método que el juez pueda seguir.',
    'La contraparte aportó un dictamen y su equipo legal necesita controvertirlo con argumentos técnicos.',
    'Hay dudas sobre la autenticidad o el contenido de documentos que son prueba en el proceso.',
    'Los abogados necesitan un aliado financiero para estructurar la estrategia antes de presentar la demanda.',
  ],
  svcLead: 'Conclusiones técnicas, lenguaje claro y defensa en audiencia.',
  svc: [SVC['08'], SVC['09'],
    { t: 'Tacha de documentos', d: 'Análisis de la autenticidad, integridad y consistencia de documentos aportados como prueba.', tags: ['Autenticidad', 'Integridad'] },
    SVC['10']],
  flow: { label: 'Cómo trabajamos', title: 'Del encargo <b>a la audiencia.</b>', lead: 'El mismo equipo que investiga sustenta el dictamen ante el despacho.', steps: [
    ['Encargo y alcance', 'Definimos con el equipo legal las preguntas que el dictamen debe responder y el método de cálculo.'],
    ['Cuantificación', 'Cuantificamos daño emergente, lucro cesante y demás perjuicios con metodología explícita y verificable.'],
    ['Dictamen y anexos', 'Entregamos el dictamen con los requisitos del Código General del Proceso y los anexos de soporte.'],
    ['Sustentación en audiencia', 'El perito que firma el dictamen lo explica y lo defiende ante el despacho.'],
  ] },
  deliv: [
    ['doc', 'Dictamen pericial', 'Con los requisitos del Código General del Proceso y anexos de soporte.'],
    ['mic', 'Sustentación en audiencia', 'El perito que firma el dictamen lo explica y lo defiende ante el despacho.'],
    ['scale', 'Informe de contradicción', 'Debilidades técnicas del dictamen contrario, listas para el interrogatorio.'],
  ],
  related: [['auditoria-forense', 'Línea 01', 'Auditoría forense'], ['analitica-de-datos', 'Línea 02', 'Analítica de datos forense']],
}) };

pages['otros-servicios'] = { title: 'Otros servicios | SAG Assessment & Consulting', desc: 'Control interno, cumplimiento LA/FT, riesgos en recursos públicos, canales de denuncia y SAG Academy.', body: (x) => `
${pageHero(x, {
  cls: 'phero--solo', crumb: 'Otros servicios', label: 'Portafolio complementario',
  title: 'Otros <b>servicios</b>',
  lead: 'Además de nuestras tres líneas principales, acompañamos a las organizaciones en control interno, cumplimiento, gestión de recursos públicos y formación.',
  visual: ring('<b data-count="15">15</b><span>servicios integrados</span>'),
})}
<section class="sec sec--bone">
  <div class="wrap">
    ${secHead('Cumplimiento y sector público', 'Control, cumplimiento <b>y ética.</b>', 'Servicios que completan la investigación: prevenir, controlar y dar canales seguros para denunciar.', false, true)}
    ${svcGrid(['12', '13', '14'].map((k) => SVC[k]), false, true)}
    <div class="feature reveal">
      <div>
        <p class="lbl lbl--cy">Formación · ${SVC['15'].n}</p>
        <h3>SAG <b>Academy</b></h3>
        <p>${esc(SVC['15'].d)}</p>
        <ul class="svc__tags">${SVC['15'].tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      <div class="feature__side">
        ${ACADEMY_URL ? `<a class="btn btn--solid" href="${ACADEMY_URL}" target="_blank" rel="noopener"><span>Ir a SAG Academy</span>${I.up}</a>` : P('enlace a SAG Academy')}
        <a class="link" href="${x.L('contacto')}"><span>Consultar por SAG Academy</span>${I.arr}</a>
      </div>
    </div>
  </div>
</section>
<section class="sec sec--white">
  <div class="wrap">
    ${secHead('Cobertura', 'Áreas de práctica <b>y sectores.</b>', 'Trabajamos con organizaciones públicas y privadas de distintos sectores, con un enfoque interdisciplinario.', false, true)}
    <div class="reach" style="margin-top:0">
      <div><h3 class="reach__h">Áreas de práctica</h3><ul class="chips">${AREAS.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>
      <div><h3 class="reach__h">Sectores</h3><ul class="chips">${SECTORES.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>
      <div class="reach__v">${VALORES.map((v) => `<span>${v}</span>`).join('')}</div>
    </div>
  </div>
</section>
${cta(x)}` };

pages['nosotros'] = { title: 'Nosotros y equipo | SAG Assessment & Consulting', desc: 'Equipo, valores y método de SAG Assessment & Consulting.', body: (x) => `
${pageHero(x, {
  cls: 'phero--solo', crumb: 'Nosotros', label: 'Nosotros · Desde 2019',
  title: 'Una firma hecha por <b>investigadores</b>',
  lead: 'SAG Assessment & Consulting nació en diciembre de 2019 en Bogotá para llevar el rigor de la auditoría forense internacional a organizaciones públicas y privadas de Colombia y Latinoamérica.',
  visual: ring('<b data-count="2019" data-plain>2019</b><span>Desde</span>'),
})}
<section class="sec sec--bone" id="equipo">
  <div class="wrap">
    ${secHead('El equipo', 'Experiencia que <b>sostiene cada dictamen.</b>', 'Un equipo multidisciplinario, con formación en contaduría, derecho, economía e ingeniería de sistemas, liderado por un socio fundador con más de 30 años en investigación de fraude.')}
    ${founderBlock(x, false)}
    <ul class="team" data-stagger>${TEAM.map((m, i) => `
      <li class="mem reveal">
        <button class="mem__btn" type="button" data-open="${i}" aria-haspopup="dialog">
          <span class="mem__ph"><img src="${x.A('img/equipo/' + m.img)}" alt="Retrato de ${m.n}" width="${m.w}" height="${m.h}" loading="lazy"></span>
          <span class="mem__meta"><b>${m.n}</b><i>${m.r}</i></span>
          <span class="mem__tags">${m.tags.map((t) => `<em>${t}</em>`).join('')}</span>
          <span class="mem__plus" aria-hidden="true">+</span>
        </button>
        <div class="mem__full" hidden data-link="${m.li}">${m.bio.map((p) => `<p>${p}</p>`).join('')}</div>
      </li>`).join('')}
    </ul>
    <div class="seniors reveal">
      <h3 class="seniors__t">Equipo senior</h3>
      <ul class="sen">${SENIORS.map(([n, img]) => `
        <li class="sen__c"><span class="sen__ph"><img src="${x.A('img/equipo/' + img)}" alt="Retrato de ${n}" width="480" height="600" loading="lazy"></span><div><b>${n}</b><i>Senior de investigaciones forenses</i></div></li>`).join('')}
      </ul>
    </div>
  </div>
</section>
<dialog class="prof" id="prof" aria-labelledby="prof-name">
  <button class="prof__x" id="prof-x" type="button" aria-label="Cerrar perfil"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  <div class="prof__ph" id="prof-ph"></div>
  <div class="prof__body">
    <p class="lbl lbl--cy" id="prof-role"></p>
    <h3 id="prof-name"></h3>
    <div class="prof__bio" id="prof-bio"></div>
    <ul class="prof__tags" id="prof-tags"></ul>
    <a class="btn btn--solid" id="prof-link" href="#" target="_blank" rel="noopener"><span>Ver perfil en LinkedIn</span>${I.up}</a>
  </div>
</dialog>
<section class="sec sec--dark">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap">
    ${secHead('Valores', 'Lo que guía <b>cada encargo.</b>', '', true, true)}
    <div class="values" data-stagger>
      <div class="reveal"><h3>Excelencia</h3><p>Cada conclusión revisada como si fuera a ser controvertida.</p></div>
      <div class="reveal"><h3>Profesionalismo</h3><p>Reserva, método y estándares internacionales.</p></div>
      <div class="reveal"><h3>Imparcialidad</h3><p>Seguimos la evidencia, no la conclusión que se espera.</p></div>
      <div class="reveal"><h3>Transparencia</h3><p>Métodos explícitos y resultados reproducibles.</p></div>
    </div>
  </div>
</section>
${methodBlock(x)}
<section class="sec sec--sm sec--bone">
  <div class="wrap">
    <p class="lbl lbl--d reveal">Ética</p>
    <a class="link link--d reveal" href="${C.legal.e}" target="_blank" rel="noopener"><span>Conozca nuestro Código de ética y conducta</span>${I.up}</a>
  </div>
</section>
${cta(x)}` };

pages['reconocimientos'] = { title: 'Reconocimientos | SAG Assessment & Consulting', desc: 'Leaders League y Management Consulting Awards.', body: (x) => `
${pageHero(x, {
  cls: 'phero--solo', crumb: 'Reconocimientos', label: 'Reconocimientos',
  title: 'Reconocidos por <b>el mercado</b>',
  lead: 'Directorios y premios internacionales que evalúan a las firmas de consultoría por la calidad de su trabajo y la opinión de sus clientes.',
  visual: ring(`<img src="${x.A('img/leaders-league-ranked-2025.webp')}" alt="Sello de Leaders League: Ranked Firm 2025" width="560" height="560">`),
})}
<section class="sec sec--bone">
  <h2 class="vh">Distinciones recibidas</h2>
  ${awardsBlock(x).replace('class="wrap awards"', 'class="wrap awards" style="margin-top:0"')}
</section>
<section class="sec sec--white">
  <div class="wrap">
    ${secHead('Detalle', 'Cada distinción, <b>año por año.</b>', 'Seis años consecutivos como firma Highly Recommended por Leaders League y premios internacionales de consultoría forense y de servicio al cliente.', false, true)}
    <div class="arows" data-stagger>
      <div class="arow reveal"><span class="arow__y">6×</span><div><h3>Highly Recommended</h3><p>Seis años consecutivos en el ranking de firmas de Leaders League. Ranked Firm 2025.</p></div><span class="arow__t">Leaders League</span></div>
      <div class="arow reveal"><span class="arow__y">2025</span><div><h3>Best Forensic Auditing &amp; Compliance Advisory Firm</h3><p>Latinoamérica.</p></div><span class="arow__t">Management Consulting Awards</span></div>
      <div class="arow reveal"><span class="arow__y">2025</span><div><h3>Client Service Excellence Award</h3><p>Reconocimiento a la calidad del servicio al cliente.</p></div><span class="arow__t">Management Consulting Awards</span></div>
      <div class="arow reveal"><span class="arow__y">2024</span><div><h3>Best Fraud Detection Consulting Firm</h3><p>Firma de consultoría en detección de fraude.</p></div><span class="arow__t">Management Consulting Awards</span></div>
    </div>
    <p class="lead reveal" style="margin-top:28px">Los premios Management Consulting Awards son otorgados por Wealth &amp; Finance International.</p>
  </div>
</section>
${cta(x)}` };

pages['contacto'] = { title: 'Contacto | SAG Assessment & Consulting', desc: 'Consulte un caso de forma confidencial.', body: (x) => `
${pageHero(x, {
  cls: 'phero--text', crumb: 'Contacto', label: 'Contacto · Consulta confidencial',
  title: 'Cuéntenos <b>qué necesita resolver.</b>',
  lead: 'Describa la situación en términos generales. No incluya nombres, documentos ni datos sensibles en este primer contacto: si el caso avanza, definiremos un canal seguro.',
})}
<section class="sec sec--contact" id="contacto" style="padding-top:clamp(48px,6vw,88px)">
  <div class="grain" aria-hidden="true"></div>
  <div class="hero__aura hero__aura--c" aria-hidden="true"></div>
  <div class="wrap contact">
    <div class="contact__copy">
      <p class="lbl lbl--cy reveal">Canales directos</p>
      <ul class="chan reveal">
        <li><span>Correo</span><a href="mailto:${C.email}">${C.email}</a></li>
        <li><span>Teléfono</span><a href="tel:${C.telRaw}">${C.tel}</a></li>
        <li><span>WhatsApp</span><a href="https://wa.me/${C.waRaw}" target="_blank" rel="noopener">${C.wa}</a></li>
        <li><span>Oficina</span><div class="chan__v"><b>Bogotá, Colombia</b>${ADDRESS ? `<small>${ADDRESS}</small>` : P('dirección física, si se quiere publicar')}</div></li>
      </ul>
      <p class="soc reveal">
        <a href="${C.li}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${C.ig}" target="_blank" rel="noopener">Instagram</a>
      </p>
    </div>
    <form class="form reveal" id="form" novalidate>
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
      <button class="btn btn--solid btn--block" type="submit"><span>Enviar consulta</span>${I.arr}</button>
      <p class="form__note" id="form-note" role="status" aria-live="polite"></p>
      <p>${P('conectar el formulario a un servicio de envío; hoy abre el correo del visitante con la consulta redactada')}</p>
    </form>
  </div>
</section>` };

// ---------- Salida estática ----------
const ANIM = '<script>(function(){var d=document.documentElement;d.classList.add("js");try{var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,c=navigator.connection||{};if(!r&&!c.saveData)d.classList.add("anim")}catch(e){}})();</script>';

function copyAssets(dir) {
  fs.cpSync(path.join(SRC, 'assets'), path.join(dir, 'assets'), { recursive: true });
}

function buildStatic() {
  const dir = path.join(OUT, 'sitio'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  copyAssets(dir);
  fs.copyFileSync(path.join(SRC, 'styles.css'), path.join(dir, 'assets/styles.css'));
  fs.copyFileSync(path.join(SRC, 'main.js'), path.join(dir, 'assets/main.js'));
  const x = { L: (s) => (s === '' ? 'index.html' : `${s}.html`), A: (p) => `assets/${p}`, wp: false };
  for (const [slug, p] of Object.entries(pages)) {
    const html = `<!DOCTYPE html>
<html lang="es-CO">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title><meta name="description" content="${p.desc}">
<meta name="theme-color" content="#050f20">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/styles.css">
${ANIM}
</head>
<body id="top">
${header(x, slug)}
<main id="contenido">${p.body(x)}</main>
${footer(x)}
<script src="assets/main.js" defer></script>
</body>
</html>`;
    fs.writeFileSync(path.join(dir, x.L(slug)), html);
  }
}

// ---------- Tema de WordPress ----------
function buildTheme() {
  const dir = path.join(OUT, 'wordpress', 'sag-theme'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  copyAssets(dir);
  const x = {
    L: (s) => `<?php echo esc_url( home_url( '/${s ? s + '/' : ''}' ) ); ?>`,
    A: (p) => `<?php echo esc_url( get_template_directory_uri() . '/assets/${p}' ); ?>`,
    wp: true,
  };
  const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
  fs.writeFileSync(path.join(dir, 'assets/styles.css'), `${css}
/* Contenido editable de WordPress (entradas y páginas genéricas) */
.entry{max-width:46rem;margin:0 auto;color:var(--ink)}
.entry p,.entry ul,.entry ol{margin-bottom:1.2rem}
.entry ul{list-style:disc;padding-left:1.4rem}.entry ol{list-style:decimal;padding-left:1.4rem}
.entry h2,.entry h3{margin:2.4rem 0 1rem;letter-spacing:-.02em}
.entry a{color:var(--cy-d);border-bottom:1px solid currentColor}
.entry img{border-radius:18px;height:auto}
.entry__date{margin-bottom:2rem;font-size:.8rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
`);
  fs.copyFileSync(path.join(SRC, 'main.js'), path.join(dir, 'assets/main.js'));
  fs.writeFileSync(path.join(dir, 'style.css'), `/*
Theme Name: SAG Forense
Theme URI: https://www.sagconsulting.co
Author: SAG Assessment & Consulting
Description: Tema a la medida para SAG Assessment & Consulting. Inicio y páginas de las tres líneas (auditoría forense, analítica de datos, dictámenes periciales) más otros servicios, firma, reconocimientos y contacto.
Version: 2.0.0
Requires at least: 6.0
Requires PHP: 7.4
Text Domain: sag
*/
/* Los estilos del tema están en assets/styles.css (se cargan desde functions.php). */
`);
  fs.writeFileSync(path.join(dir, 'functions.php'), `<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
} );
add_action( 'wp_enqueue_scripts', function () {
	$v = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'sag-style', get_template_directory_uri() . '/assets/styles.css', array(), $v );
	wp_enqueue_script( 'sag-main', get_template_directory_uri() . '/assets/main.js', array(), $v, true );
} );
`);
  fs.writeFileSync(path.join(dir, 'header.php'), `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#050f20">
<link rel="icon" href="${x.A('img/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${x.A('fonts/archivo-var.woff2')}" as="font" type="font/woff2" crossorigin>
${ANIM}
<?php wp_head(); ?>
</head>
<body id="top" <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php $sag_cur = is_front_page() ? '' : ( is_page() ? get_post_field( 'post_name', get_queried_object_id() ) : '' ); ?>
${header(x, '')}
<main id="contenido">
`);
  fs.writeFileSync(path.join(dir, 'footer.php'), `</main>
${footer(x)}
<?php wp_footer(); ?>
</body>
</html>
`);
  for (const [slug, p] of Object.entries(pages)) {
    const file = slug === '' ? 'front-page.php' : `page-${slug}.php`;
    fs.writeFileSync(path.join(dir, file), `<?php
/* ${p.title} — plantilla generada. Se aplica automáticamente ${slug === '' ? 'a la página de inicio' : `a la página con slug "${slug}"`}. */
get_header(); ?>
${p.body(x)}
<?php get_footer();
`);
  }
  // Plantillas genéricas: entradas del blog y páginas sin plantilla propia
  const generic = `<section class="phero phero--text">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap phero__grid"><div>
    <p class="lbl lbl--cy reveal"><?php echo is_home() ? esc_html__( 'Conocimiento', 'sag' ) : esc_html__( 'SAG Assessment & Consulting', 'sag' ); ?></p>
    <h1 class="reveal"><?php echo is_home() ? esc_html__( 'Ideas y análisis', 'sag' ) : ( is_singular() ? esc_html( get_the_title() ) : wp_kses_post( get_the_archive_title() ) ); ?></h1>
  </div></div>
</section>
<section class="sec sec--white"><div class="wrap">
<?php if ( is_singular() ) : while ( have_posts() ) : the_post(); ?>
  <article class="entry"><?php if ( is_single() ) : ?><p class="entry__date"><?php echo esc_html( get_the_date() ); ?></p><?php endif; ?><?php the_content(); ?></article>
<?php endwhile; else : ?>
  <ul class="posts"><?php while ( have_posts() ) : the_post(); ?>
    <li class="post"><a class="post__a" href="<?php the_permalink(); ?>"><span class="post__meta"><time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time></span><h3><?php the_title(); ?></h3><span class="post__go">Leer artículo ${I.arr}</span></a></li>
  <?php endwhile; ?></ul>
  <?php the_posts_pagination(); ?>
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
5. Formulario de contacto: el del tema abre el correo del visitante con la consulta redactada (no usa servidor).
   Para que envíe correos desde el sitio, instale un plugin (p. ej. Contact Form 7 o WPForms) y reemplace el
   <form> de page-contacto.php por su shortcode.
6. La fuente (Archivo), las imágenes y el video del inicio van dentro del tema (carpeta assets/); no se cargan
   recursos externos. Las imágenes del inicio y el video fueron generados con IA y el pie de página lo indica.
7. Busque los textos "[PENDIENTE: ...]" y reemplácelos antes de publicar.
`);
}

buildStatic(); buildTheme();
console.log('OK');
