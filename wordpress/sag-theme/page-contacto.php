<?php
/* Contacto | SAG Assessment & Consulting — plantilla generada. Se aplica automáticamente a la página con slug "contacto". */
get_header(); ?>


<section class="page-hero dark">
  
  <div class="wrap" style="position:relative">
    <p class="crumbs"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Inicio</a> / Contacto</p>
    <span class="eyebrow rv">Consulta confidencial</span>
    <h1 class="rv d1" style="margin-top:1.4rem">Cuéntenos <em>su caso</em></h1>
    <p class="lead rv d2">Describa la situación en términos generales. No incluya nombres, documentos ni datos sensibles en este primer contacto: un socio le responderá para definir el canal adecuado.</p>
  </div>
</section>
<section class="sec"><div class="wrap contact">
  <div class="rv">
    <span class="eyebrow">Canales directos</span>
    <ul class="channels" style="margin-top:2rem">
      <li><span class="mono">Correo</span><a href="mailto:comercial@sagconsulting.co">comercial@sagconsulting.co</a></li>
      <li><span class="mono">Teléfono</span><a href="tel:+573134661950">+57 313 466 1950</a></li>
      <li><span class="mono">WhatsApp</span><a href="https://wa.me/573138170765">+57 313 817 0765</a></li>
      <li><span class="mono">Oficina</span><span class="v">Bogotá, Colombia</span> <span class="pending">[PENDIENTE: dirección física, si se quiere publicar]</span></li>
    </ul>
  </div>
  <form class="form rv d1" id="case-form" novalidate>
    <div class="field"><label for="f-n">Nombre</label><input id="f-n" name="nombre" autocomplete="name" required></div>
    <div class="field"><label for="f-o">Organización</label><input id="f-o" name="organizacion" autocomplete="organization"></div>
    <div class="field"><label for="f-e">Correo</label><input id="f-e" name="correo" type="email" autocomplete="email" required></div>
    <div class="field"><label for="f-t">Teléfono (opcional)</label><input id="f-t" name="telefono" type="tel" autocomplete="tel"></div>
    <div class="field full"><label for="f-l">Línea de interés</label><select id="f-l" name="linea"><option>Auditoría forense</option><option>Analítica de datos</option><option>Dictámenes periciales</option><option>Otro servicio</option></select></div>
    <div class="field full"><label for="f-d">Descripción general del caso</label><textarea id="f-d" name="descripcion" required></textarea></div>
    <p class="note full">Al enviar acepta la <a class="link" href="https://www.sagconsulting.co/privacidad.html">política de privacidad</a>.</p>
    <div class="full"><button class="btn btn-ink" type="submit">Enviar consulta <span class="arr">→</span></button></div>
    <div class="form-msg full" id="form-msg" tabindex="-1">Gracias. En este prototipo el formulario aún no envía mensajes. Por ahora escríbanos a <b>comercial@sagconsulting.co</b>. <span class="pending">[PENDIENTE: conectar el formulario al correo comercial]</span></div>
  </form>
</div></section>
<?php get_footer();
