#!/usr/bin/env bash
# Genera la versión de producción de la propuesta B y la empaqueta para el administrador del sitio:
#   SAG-sitio-nuevo-AAAA-MM-DD.zip
#   └── SAG-sitio-nuevo/
#       ├── LEAME-ADMINISTRADOR.txt   instrucciones de publicación
#       ├── CONTENIDO-sha256.txt      huella de cada archivo
#       └── ARCHIVOS-PARA-SUBIR/      copia de publicar/
# El ZIP queda en la raíz del repositorio y no se guarda en git (.gitignore excluye *.zip).
set -euo pipefail
cd "$(dirname "$0")"

node build-b.js --produccion

FECHA=$(date +%Y-%m-%d)
ZIP="$PWD/SAG-sitio-nuevo-$FECHA.zip"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
DEST="$TMP/SAG-sitio-nuevo"
mkdir -p "$DEST"
cp -R publicar "$DEST/ARCHIVOS-PARA-SUBIR"
# Con marca BOM para que el Bloc de notas de Windows muestre bien las tildes.
{ printf '\xEF\xBB\xBF'; cat LEAME-ADMINISTRADOR.txt; } > "$DEST/LEAME-ADMINISTRADOR.txt"
if command -v sha256sum >/dev/null 2>&1; then SHA=(sha256sum); else SHA=(shasum -a 256); fi
(cd "$DEST/ARCHIVOS-PARA-SUBIR" && find . -type f | LC_ALL=C sort | sed 's|^\./||' | while IFS= read -r f; do "${SHA[@]}" "$f"; done) > "$DEST/CONTENIDO-sha256.txt"

rm -f "$ZIP"
(cd "$TMP" && zip -qrX "$ZIP" SAG-sitio-nuevo)
echo "Listo: $ZIP"
