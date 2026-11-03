# Sitio web de SAG Assessment & Consulting (prototipo)

Prototipo del nuevo sitio de SAG Assessment & Consulting S.A.S. ([www.sagconsulting.co](https://www.sagconsulting.co)), organizado en torno a tres líneas: **auditoría forense**, **analítica de datos forense** y **dictámenes periciales**.

El diseño toma la identidad del sitio actual (logo "sag", azul profundo y cian, marfil, tipografía Archivo, imágenes, video del inicio y fotos del equipo) y la extiende a un sitio de ocho páginas, más un tema de WordPress con el mismo diseño.

> Este repositorio **no publica nada** en ningún dominio. El sitio actual no cambia hasta que se autorice la publicación.

## Cómo ver el sitio localmente

**Opción 1. Sin instalar nada:** descargue el repositorio (botón verde *Code* > *Download ZIP*), descomprímalo y abra `sitio/index.html` con doble clic.

**Opción 2. Con un servidor local** (recomendado para que todo se comporte como en la web):

```bash
cd sitio
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estructura

| Carpeta / archivo | Contenido |
|---|---|
| `sitio/` | Sitio estático generado (HTML + CSS + JS, sin frameworks ni recursos externos) |
| `wordpress/sag-theme/` | El mismo diseño como tema de WordPress (instrucciones en su `README.txt`) |
| `src/styles.css`, `src/main.js` | Estilos y comportamiento compartidos |
| `src/assets/` | Fuente Archivo (autoalojada), logo, imágenes, fotos del equipo y video del inicio |
| `build.js` | Genera `sitio/` y `wordpress/sag-theme/` desde un solo origen |

Para editar textos, modifique `build.js` y regenere:

```bash
node build.js
```

Dos datos pendientes se completan en las primeras líneas de `build.js`: `ACADEMY_URL` (enlace de SAG Academy) y `ADDRESS` (dirección física, solo si se quiere publicar).

Para empaquetar el tema de WordPress:

```bash
cd wordpress && zip -r sag-theme.zip sag-theme
```

## Páginas

Inicio · Auditoría forense · Analítica de datos forense · Dictámenes periciales · Otros servicios · Nosotros (equipo, valores y método) · Reconocimientos · Contacto

## Marcadores pendientes

Los datos que faltan aparecen en el sitio resaltados en amarillo como `[PENDIENTE: ...]`. Ninguna cifra, cliente, caso ni testimonio fue inventado.

| Página | Pendiente |
|---|---|
| Otros servicios | Enlace a SAG Academy (`ACADEMY_URL` en `build.js`) |
| Contacto | Dirección física, si se quiere publicar (`ADDRESS` en `build.js`) |
| Contacto | Conectar el formulario a un servicio de envío. Hoy abre el correo del visitante con la consulta redactada |

Resueltos con datos y recursos de [www.sagconsulting.co](https://www.sagconsulting.co): cifras (+600 casos, +150 clientes, +10 años), URLs de los artículos, fotografías de Simón y del equipo, logo y sellos de los reconocimientos (Leaders League *Ranked Firm 2025* y Wealth & Finance).

Decisiones de contenido a tener presentes:

- **Alexandra Rodríguez y Yulieth Monroy** aparecen en una tarjeta compacta (foto, nombre y cargo), igual que en el sitio actual, que no publica sus perfiles. Si se quiere un perfil, se agrega `bio` en `TEAM` dentro de `build.js`.
- **Cita del socio fundador:** se retiró del inicio porque no estaba validada; el sitio actual no la incluye.
- **Trayectoria de Simón:** se usa "más de 30 años", como en el sitio actual (el prototipo anterior decía 25).
- **Versión alternativa B del inicio:** se eliminó. El diseño nuevo reemplaza a las dos variantes anteriores (sigue disponible en el historial de git).

## Revisar antes de publicar

- **Enlaces que hoy devuelven 404 en www.sagconsulting.co:** los seis artículos de "Conocimiento" (por ejemplo `/2026/01/22/davos-2026-...`) y el Código de ética (`/nosotros/codigo-de-etica-y-conducta/`). Son los enlaces que usa el sitio actual, pero las rutas ya no responden. Funcionarán cuando el blog y esa página se restauren con los mismos enlaces permanentes.
- **Imágenes generadas con IA:** el inicio, la banda panorámica y la imagen de ventajas, además del video de fondo, fueron generados con inteligencia artificial. El pie de página lo indica y debe conservarse mientras se usen.
- **Video del inicio** (`src/assets/video/hero-bg.mp4`, 1,7 MB): solo se carga en pantallas anchas, sin "reducir movimiento" y sin ahorro de datos. En móvil se ve la imagen fija.
- **Páginas legales** (Términos, Privacidad, Cookies): el pie enlaza a las del sitio actual. Este prototipo no las incluye.
- **Asistente SAG (chat):** el sitio actual tiene un asistente de soporte que depende de un servidor. No se incluye en el prototipo.
- **Fuente:** Archivo va dentro del proyecto; el sitio ya no carga Google Fonts ni otros recursos externos.
- **Visibilidad del repositorio:** contiene borradores con marcadores; se sugiere mantenerlo privado.
