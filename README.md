# Sitio web de SAG Assessment & Consulting (prototipo)

Prototipo del nuevo sitio de SAG Assessment & Consulting S.A.S. ([www.sagconsulting.co](https://www.sagconsulting.co)), organizado en torno a tres líneas: **auditoría forense**, **analítica de datos forense** y **dictámenes periciales**.

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
| `sitio/` | Sitio estático generado (HTML + CSS + JS, sin frameworks) |
| `sitio/inicio-alternativo.html` | Versión B del inicio, estilo editorial claro, para comparar |
| `wordpress/sag-theme/` | El mismo diseño como tema de WordPress (instrucciones en su `README.txt`) |
| `src/styles.css`, `src/main.js` | Estilos y comportamiento compartidos |
| `build.js` | Genera `sitio/` y `wordpress/sag-theme/` desde un solo origen |

Para editar textos, modifique `build.js` (o `src/`) y regenere:

```bash
node build.js
```

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
| Inicio | Fotografía profesional de Simón Guzmán |
| Inicio | Validar o reemplazar la cita atribuida al socio fundador |
| Nosotros | Fotografías del equipo |
| Nosotros | Breve perfil de Alexandra Rodríguez |
| Nosotros | Breve perfil de Yulieth Monroy |
| Otros servicios | Enlace a SAG Academy |
| Reconocimientos | Logos oficiales de cada reconocimiento |
| Contacto | Dirección física (si se quiere publicar) |
| Contacto | Conectar el formulario al correo comercial (hoy es solo visual) |

Resueltos con datos de [www.sagconsulting.co](https://www.sagconsulting.co): cifras (+600 casos, +150 clientes) y URLs de los tres artículos de "Conocimiento". El sitio actual no publica los perfiles de Alexandra y Yulieth, el enlace de SAG Academy, la dirección física ni la cita de Simón, por lo que siguen pendientes.

Otros puntos a revisar antes de publicar:

- **Logo:** el encabezado usa un monograma tipográfico provisional ("S" + SAG). Reemplazar por el logo oficial.
- **Fuentes:** se cargan desde Google Fonts (Fraunces, Inter Tight, JetBrains Mono).
- **Visibilidad del repositorio:** contiene borradores con marcadores; se sugiere mantenerlo privado.
