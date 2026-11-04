TEMA "SAG Forense" — instalación

1. En WordPress: Apariencia > Temas > Añadir nuevo > Subir tema > sag-theme.zip > Instalar.
   Hágalo PRIMERO en un sitio de pruebas (staging), no en producción.
2. Cree estas páginas (Páginas > Añadir) con exactamente estos slugs. El contenido puede quedar vacío:
   auditoria-forense, analitica-de-datos, dictamenes-periciales, otros-servicios, sag-academy, nosotros, reconocimientos, contacto
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
