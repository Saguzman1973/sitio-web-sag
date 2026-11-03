<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#050f20">
<link rel="icon" href="<?php echo esc_url( get_template_directory_uri() . '/assets/img/favicon.svg' ); ?>" type="image/svg+xml">
<link rel="preload" href="<?php echo esc_url( get_template_directory_uri() . '/assets/fonts/archivo-var.woff2' ); ?>" as="font" type="font/woff2" crossorigin>
<script>(function(){var d=document.documentElement;d.classList.add("js");try{var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,c=navigator.connection||{};if(!r&&!c.saveData)d.classList.add("anim")}catch(e){}})();</script>
<?php wp_head(); ?>
</head>
<body id="top" <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php $sag_cur = is_front_page() ? '' : ( is_page() ? get_post_field( 'post_name', get_queried_object_id() ) : '' ); ?>

<a class="skip" href="#contenido">Saltar al contenido</a>
<div class="progress" id="progress" aria-hidden="true"></div>
<header class="head" id="head">
  <div class="wrap head__in">
    <a class="head__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="SAG Assessment &amp; Consulting, inicio"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/img/logo-sag-blanco.svg' ); ?>" alt="SAG Assessment &amp; Consulting" width="84" height="46"></a>
    <nav class="nav" id="nav" aria-label="Principal">
      <ul><li><a href="<?php echo esc_url( home_url( '/auditoria-forense/' ) ); ?>"<?php echo ( 'auditoria-forense' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Auditoría forense</a></li><li><a href="<?php echo esc_url( home_url( '/analitica-de-datos/' ) ); ?>"<?php echo ( 'analitica-de-datos' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Analítica forense</a></li><li><a href="<?php echo esc_url( home_url( '/dictamenes-periciales/' ) ); ?>"<?php echo ( 'dictamenes-periciales' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Dictámenes periciales</a></li><li><a href="<?php echo esc_url( home_url( '/otros-servicios/' ) ); ?>"<?php echo ( 'otros-servicios' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Otros servicios</a></li><li><a href="<?php echo esc_url( home_url( '/nosotros/' ) ); ?>"<?php echo ( 'nosotros' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Nosotros</a></li><li><a href="<?php echo esc_url( home_url( '/reconocimientos/' ) ); ?>"<?php echo ( 'reconocimientos' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Reconocimientos</a></li></ul>
      <a class="btn btn--sm btn--line head__cta" href="<?php echo esc_url( home_url( '/contacto/' ) ); ?>"><span>Consultar un caso</span></a>
    </nav>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="nav" aria-label="Abrir menú"><i></i><i></i></button>
  </div>
</header>
<main id="contenido">
