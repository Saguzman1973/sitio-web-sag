<?php
/* Contacto | SAG Assessment & Consulting — plantilla generada. Se aplica automáticamente a la página con slug "contacto". */
get_header(); ?>


<section class="phero phero--text">
  <div class="hero__lines" aria-hidden="true"></div>
  <div class="hero__aura hero__aura--a" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap phero__grid">
    <div>
      <nav class="crumbs reveal" aria-label="Ruta de navegación"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Inicio</a><i>/</i><span>Contacto</span></nav>
      <p class="lbl lbl--cy reveal">Contacto · Consulta confidencial</p>
      <h1 class="reveal">Cuéntenos <b>qué necesita resolver.</b></h1>
      <p class="lead lead--lt reveal">Describa la situación en términos generales. No incluya nombres, documentos ni datos sensibles en este primer contacto: si el caso avanza, definiremos un canal seguro.</p>
      
    </div>
    
  </div>
</section>
<section class="sec sec--contact" id="contacto" style="padding-top:clamp(48px,6vw,88px)">
  <div class="grain" aria-hidden="true"></div>
  <div class="hero__aura hero__aura--c" aria-hidden="true"></div>
  <div class="wrap contact">
    <div class="contact__copy">
      <p class="lbl lbl--cy reveal">Canales directos</p>
      <ul class="chan reveal">
        <li><span>Correo</span><a href="mailto:comercial@sagconsulting.co">comercial@sagconsulting.co</a></li>
        <li><span>Teléfono</span><a href="tel:+573134661950">+57 313 466 1950</a></li>
        <li><span>WhatsApp</span><a href="https://wa.me/573138170765" target="_blank" rel="noopener">+57 313 817 0765</a></li>
        <li><span>Oficina</span><div class="chan__v"><b>Bogotá, Colombia</b><span class="pending">[PENDIENTE: dirección física, si se quiere publicar]</span></div></li>
      </ul>
      <p class="soc reveal">
        <a href="https://www.linkedin.com/company/sag-assesment-consulting-sas/" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://www.instagram.com/sag.consulting/" target="_blank" rel="noopener">Instagram</a>
      </p>
    </div>
    <form class="form reveal" id="form" novalidate>
      <fieldset class="form__srv">
        <legend>¿Sobre qué servicio nos escribe?</legend>
        <label class="pill"><input type="radio" name="servicio" value="Auditoría forense" checked><span>Auditoría forense</span></label>
        <label class="pill"><input type="radio" name="servicio" value="Laboratorio forense digital"><span>Laboratorio forense digital</span></label>
        <label class="pill"><input type="radio" name="servicio" value="Analítica y gobernanza de datos"><span>Analítica y gobernanza de datos</span></label>
        <label class="pill"><input type="radio" name="servicio" value="Dictámenes periciales"><span>Dictámenes periciales</span></label>
        <label class="pill"><input type="radio" name="servicio" value="SAG Academy"><span>SAG Academy</span></label>
        <label class="pill"><input type="radio" name="servicio" value="Otro asunto"><span>Otro asunto</span></label>
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
      <label class="chk"><input type="checkbox" id="f-terms" required><span>He leído y acepto los <a href="https://www.sagconsulting.co/terminos.html" target="_blank" rel="noopener">Términos y Condiciones</a>.</span></label>
      <p class="err err--chk" id="err-terms" hidden></p>
      <label class="chk"><input type="checkbox" id="f-priv" required><span>He leído la <a href="https://www.sagconsulting.co/privacidad.html" target="_blank" rel="noopener">Política de Privacidad</a> y autorizo a SAG Assessment &amp; Consulting S.A.S. a tratar mis datos personales para responder esta consulta.</span></label>
      <p class="err err--chk" id="err-priv" hidden></p>
      <p class="aviso">Responsable: SAG Assessment &amp; Consulting S.A.S. (NIT 900.951.905-5). Usamos su nombre, correo y consulta solo para responderle; teléfono y organización son opcionales. Puede conocer, actualizar, rectificar o suprimir sus datos y revocar su autorización escribiendo a comercial@sagconsulting.co. Más información en la <a href="https://www.sagconsulting.co/privacidad.html" target="_blank" rel="noopener">Política de Privacidad</a>. No incluya datos sensibles ni confidenciales.</p>
      <button class="btn btn--solid btn--block" type="submit"><span>Enviar consulta</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
      <p class="form__note" id="form-note" role="status" aria-live="polite"></p>
      <p><span class="pending">[PENDIENTE: conectar el formulario a un servicio de envío; hoy abre el correo del visitante con la consulta redactada]</span></p>
    </form>
  </div>
</section>
<?php get_footer();
