// Contenido compartido por las propuestas (build.js y build-b.js). Datos tomados de www.sagconsulting.co.

// Datos que se completan aquí cuando existan (mientras estén vacíos, el sitio muestra el marcador [PENDIENTE]).
const ACADEMY_URL = '';   // Enlace de SAG Academy (viene en el código QR del afiche).
const ADDRESS = '';       // Dirección física, solo si se quiere publicar.
// Catálogo de 15 servicios (texto del sitio actual; "Gobernanza de datos" y "Analítica de datos" figuran allí como POR CONFIRMAR por el propietario).
const SVC = {
  '01': { c: "Forense", t: "Auditoría forense", d: "Prevenir, detectar y controlar el fraude, el abuso de confianza y la corrupción: malversación de activos, soborno, fraude fiscal, ciber-crimen y tráfico de influencias.", tags: ["Prevenir", "Detectar", "Controlar"] },
  '02': { c: "Forense", t: "Laboratorio forense digital", d: "Recaudo, aseguramiento y análisis forense de evidencia digital en equipos, celulares, servidores y nube, con imágenes que preservan el original.", tags: ["Evidencia digital", "Informática forense"] },
  '03': { c: "Forense", t: "Evaluación de riesgo de fraude", d: "Fraud Risk Assessment: evaluamos y priorizamos esquemas y escenarios de fraude, y la eficacia de los controles que los mitigan.", tags: ["Fraud Risk Assessment", "Controles"] },
  '04': { c: "Forense", t: "Inteligencia de fuentes abiertas", d: "OSINT y SOCMINT: búsquedas estratégicas en fuentes abiertas y redes sociales para acelerar investigaciones y perfilar posibles implicados.", tags: ["OSINT", "SOCMINT"] },
  '05': { c: "Forense", t: "Debida diligencia de antecedentes", d: "Background Check Services: especialistas en detectar fraude y conductas antiéticas de personas y organizaciones.", tags: ["Background check"] },
  '06': { c: "Datos y tecnología", t: "Analítica de datos", d: "Minería, análisis y visualización de todos los registros disponibles para encontrar patrones, anomalías e indicadores, y automatización de procesos repetitivos.", tags: ["Minería", "Visualización", "Automatización"] },
  '07': { c: "Datos y tecnología", t: "Gobernanza de datos", d: "Políticas, responsables y controles para que los datos de la organización sean confiables, trazables y estén protegidos, base de cualquier análisis.", tags: ["Políticas", "Calidad", "Trazabilidad"] },
  '08': { c: "Legal y pericial", t: "Dictámenes y peritajes", d: "Peritaje contable y financiero forense: daño emergente, lucro cesante, informes patrimoniales y sustentación ante jueces y tribunales de arbitramento nacionales e internacionales.", tags: ["Daño emergente", "Lucro cesante", "Arbitraje"] },
  '09': { c: "Legal y pericial", t: "Contradicción de informes periciales", d: "Desafiamos la validez de informes periciales con alternativas metodológicas robustas y analizamos la tacha de documentos.", tags: ["Contradicción", "Tacha de documentos"] },
  '10': { c: "Legal y pericial", t: "Apoyo a áreas legales", d: "Responsabilidad contractual y extracontractual, determinación de perjuicios y análisis de títulos valores complejos, con un equipo interdisciplinario de enfoque forense.", tags: ["Contractual", "Títulos valores"] },
  '11': { c: "Financiero y contable", t: "Auditoría forense de estados financieros", d: "Examen con técnicas forenses para detectar ingresos sobreestimados, manipulación de costos, ocultamiento de pasivos, fraude en nómina y pagos, entre otros.", tags: ["Estados financieros"] },
  '12': { c: "Financiero y contable", t: "Control interno y cumplimiento", d: "Análisis de controles internos y del cumplimiento normativo para identificar apropiación ilícita de activos, corrupción y soborno, LA/FT e inobservancia de normas.", tags: ["Control interno", "LA/FT"] },
  '13': { c: "Sector público y cumplimiento", t: "Riesgos en recursos públicos", d: "Gestión y prevención de riesgos en la ejecución de recursos públicos: rendición de cuentas, planes de mejoramiento, defensa técnica ante entes de control y modelo preventivo y disciplinario.", tags: ["Entes de control", "Modelo preventivo"] },
  '14': { c: "Sector público y cumplimiento", t: "Canales de denuncia", d: "Outsourcing de canales de denuncia transparentes y confiables: recepción por web, correo y teléfono, procesamiento y clasificación, comité de ética y reportes.", tags: ["Web · correo · teléfono", "Comité de ética"] },
  '15': { c: "Formación", t: "SAG Academy", d: "Plataforma de cursos guiados por expertos del sector para expandir conocimientos y habilidades en auditoría forense y destacar en la carrera profesional.", tags: ["Cursos", "Expertos del sector", "Auditoría forense"] },
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

module.exports = { SVC, AREAS, SECTORES, VALORES, POSTS, TEAM, SENIORS, ADV, STEPS, ACADEMY_URL, ADDRESS };
