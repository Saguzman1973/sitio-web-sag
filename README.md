# Sitio web de SAG Assessment & Consulting (prototipo)

Prototipo del nuevo sitio de SAG Assessment & Consulting S.A.S. ([www.sagconsulting.co](https://www.sagconsulting.co)), organizado en torno a tres líneas: **auditoría forense**, **analítica de datos forense** y **dictámenes periciales**.

Hay dos propuestas de diseño para comparar:

- **Propuesta A** (`sitio/` y tema de WordPress): toma la identidad del sitio actual (logo "sag", azul profundo y cian, marfil, tipografía Archivo, imágenes, video del inicio y fotos del equipo) y la extiende a un sitio de ocho páginas.
- **Propuesta B · "Expediente"** (`propuesta-b/`): dirección editorial distinta, con tinta, marfil y un solo acento rojo (la "bandera roja" del fraude), tipografía serif de revista y mucha más animación. Tiene seis páginas: Inicio, Experticia, Equipo, Resultados, SAG Academy y Contacto. Más detalles abajo.

> Este repositorio **no publica nada** en ningún dominio. El sitio actual no cambia hasta que se autorice la publicación.

## Cómo ver el sitio localmente

**Opción 1. Sin instalar nada:** descargue el repositorio (botón verde *Code* > *Download ZIP*), descomprímalo y abra `sitio/index.html` (propuesta A) o `propuesta-b/index.html` (propuesta B) con doble clic.

**Opción 2. Con un servidor local** (recomendado para que todo se comporte como en la web):

```bash
cd sitio
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estructura

| Carpeta / archivo | Contenido |
|---|---|
| `sitio/` | Propuesta A: sitio estático generado (HTML + CSS + JS, sin frameworks ni recursos externos) |
| `wordpress/sag-theme/` | Propuesta A como tema de WordPress (instrucciones en su `README.txt`) |
| `propuesta-b/` | Propuesta B: sitio estático generado (sin frameworks ni recursos externos) |
| `src/content.js` | Contenido compartido por ambas propuestas: servicios, equipo, artículos, ventajas, método y los datos pendientes |
| `src/styles.css`, `src/main.js` | Estilos y comportamiento de la propuesta A |
| `src-b/` | Estilos, comportamiento, fuentes (Instrument Serif, Geist, Geist Mono) y puntos del mapa de la propuesta B |
| `src/assets/` | Fuente Archivo, logo, imágenes, fotos del equipo y video (los usan ambas propuestas) |
| `build.js` / `build-b.js` | Generan la propuesta A (`sitio/` y el tema) y la propuesta B (`propuesta-b/`) |

Los textos de cada página están en `build.js` (A) y `build-b.js` (B). El contenido que comparten está en `src/content.js`. Después de editar, regenere:

```bash
node build.js
```

```bash
node build-b.js
```

Dos datos pendientes se completan en las primeras líneas de `src/content.js` y valen para ambas propuestas: `ACADEMY_URL` (enlace de SAG Academy) y `ADDRESS` (dirección física, solo si se quiere publicar).

Para empaquetar el tema de WordPress:

```bash
cd wordpress && zip -r sag-theme.zip sag-theme
```

## Páginas

Inicio · Auditoría forense · Analítica de datos forense · Dictámenes periciales · Otros servicios · SAG Academy · Nosotros (equipo, valores y método) · Reconocimientos · Contacto

En el tema de WordPress, la página de SAG Academy se crea con el slug `sag-academy`.

## Marcadores pendientes

Los datos que faltan aparecen en el sitio resaltados en amarillo como `[PENDIENTE: ...]`. Ninguna cifra, cliente, caso ni testimonio fue inventado.

| Página | Pendiente |
|---|---|
| SAG Academy (A y B) | Enlace a la plataforma de cursos (`ACADEMY_URL` en `src/content.js`) |
| Contacto | Dirección física, si se quiere publicar (`ADDRESS` en `src/content.js`) |
| Contacto | Conectar el formulario a un servicio de envío. Hoy abre el correo del visitante con la consulta redactada |
| Resultados (B) | Tres casos anonimizados: título, sector y un resultado verificable y autorizado para publicar |

Resueltos con datos y recursos de [www.sagconsulting.co](https://www.sagconsulting.co): cifras (+600 casos, +150 clientes, +10 años), URLs de los artículos, fotografías de Simón y del equipo, logo y sellos de los reconocimientos (Leaders League *Ranked Firm 2025* y Wealth & Finance).

Decisiones de contenido a tener presentes:

- **Perfiles de Alexandra Rodríguez y Yulieth Monroy:** tomados de las hojas de vida que entregó SAG (noviembre de 2026), pasados a tercera persona y sin agregar datos. No tienen enlace a LinkedIn, así que la ventana de perfil no muestra ese botón.
- **Perfiles de Diego Alarcón, Andrea Sierra y Yamid Suárez:** se ampliaron a pedido de SAG con su participación en asignaciones periciales, analítica de datos y automatización, según su perfil y las líneas de la firma. Conviene que cada persona los confirme.
- **Etiquetas de los servicios:** se recuperaron las del sitio actual (en la versión anterior habían quedado vacías por un error de extracción); ahora aparecen también en la propuesta A.
- **Cita del socio fundador:** se retiró del inicio porque no estaba validada; el sitio actual no la incluye.
- **Trayectoria de Simón:** se usa "más de 30 años", como en el sitio actual (el prototipo anterior decía 25).
- **Versión alternativa B del inicio:** se eliminó. El diseño nuevo reemplaza a las dos variantes anteriores (sigue disponible en el historial de git).

## Propuesta B · "Expediente"

El concepto es un expediente que se arma mientras se recorre la página: del dato (ruido) al hecho (evidencia) y del hecho al dictamen.

- **Inicio:** telón de apertura y un campo de datos animado donde aparecen "banderas rojas". Le siguen un manifiesto que se ilumina palabra por palabra, las tres líneas en tarjetas que se apilan y las cifras en odómetros. El método queda fijo en pantalla con cuatro escenas (alcance, cadena de custodia, análisis de registros, informe). Cierran el equipo (fundador y lista con foto que sigue al cursor), el mapa de cobertura, los reconocimientos y una banda con video.
- **Páginas internas:** Experticia (índice filtrable de los 15 servicios, áreas y sectores, publicaciones), Equipo (fundador, fichas con perfil completo, valores), Resultados (cifras, reconocimientos, mapa y casos) y Contacto.
- **Datos ilustrativos, marcados como tales:** la ficha y las alertas del inicio y las escenas del método (registros, huella SHA-256, montos) dicen "Representación ilustrativa" y no corresponden a casos reales. Las cifras de resultados son las publicadas en el sitio actual.
- **Casos:** la sección está diseñada, pero su contenido queda `[PENDIENTE]`. No se inventaron resultados.
- **Mapa:** Colombia como sede; Ecuador, México y Perú según el perfil de la CEO ("procesos liderados" en esos países).
- **Movimiento:** con "reducir movimiento" o sin JavaScript se muestra todo el contenido, sin animaciones. Cursor propio solo con mouse.
- **Tema de WordPress:** por ahora solo existe para la propuesta A. Si se elige la B, se puede generar igual.

## SAG Academy

- **Catálogo:** 21 cursos cortos en seis líneas (auditoría forense; analítica de datos e IA; forense digital y fuentes abiertas; peritaje; cumplimiento y sector público; programas ejecutivos), en modalidad sincrónica, asincrónica o mixta, más cinco rutas de certificación y un webinar mensual abierto. Se edita en `ACADEMY`, dentro de `src/content.js`.
- **Certificación:** son cursos de educación informal (menos de 160 horas, sin título académico); al aprobarlos, SAG expide un certificado. Las condiciones publicadas (80 % en la evaluación, 80 % de asistencia y caso integrador en las rutas) son una propuesta que SAG puede ajustar. Conviene confirmar el encuadre legal con su asesor.
- **No se publican** docentes, fechas ni valores: la página invita a consultarlos por contacto.

## Revisar antes de publicar

- **Enlaces que hoy devuelven 404 en www.sagconsulting.co:** los seis artículos de "Conocimiento" (por ejemplo `/2026/01/22/davos-2026-...`) y el Código de ética (`/nosotros/codigo-de-etica-y-conducta/`). Son los enlaces que usa el sitio actual, pero las rutas ya no responden. Funcionarán cuando el blog y esa página se restauren con los mismos enlaces permanentes.
- **Imágenes generadas con IA:** el inicio, la banda panorámica y la imagen de ventajas, además del video de fondo, fueron generados con inteligencia artificial. El pie de página lo indica y debe conservarse mientras se usen.
- **Video del inicio** (`src/assets/video/hero-bg.mp4`, 1,7 MB): solo se carga en pantallas anchas, sin "reducir movimiento" y sin ahorro de datos. En móvil se ve la imagen fija.
- **Páginas legales** (Términos, Privacidad, Cookies): el pie enlaza a las del sitio actual. Este prototipo no las incluye.
- **Asistente SAG (chat):** el sitio actual tiene un asistente de soporte que depende de un servidor. No se incluye en el prototipo.
- **Fuente:** Archivo va dentro del proyecto; el sitio ya no carga Google Fonts ni otros recursos externos.
- **Visibilidad del repositorio:** contiene borradores con marcadores; se sugiere mantenerlo privado.
