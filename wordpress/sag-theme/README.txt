TEMA "SAG Forense" — instalación

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
