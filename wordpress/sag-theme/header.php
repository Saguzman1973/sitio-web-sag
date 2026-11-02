<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php $sag_cur = is_front_page() ? '' : ( is_page() ? get_post_field( 'post_name', get_queried_object_id() ) : '' ); ?>

<a class="skip" href="#main">Ir al contenido</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="SAG Assessment & Consulting, inicio">
      <span class="brand-mark">S</span>
      <span class="brand-text"><b>SAG</b><span>Assessment &amp; Consulting</span></span>
    </a>
    <button class="menu-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Principal">
      <ul><li><a class="nl" href="<?php echo esc_url( home_url( '/auditoria-forense/' ) ); ?>"<?php echo ( 'auditoria-forense' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Auditoría forense</a></li><li><a class="nl" href="<?php echo esc_url( home_url( '/analitica-de-datos/' ) ); ?>"<?php echo ( 'analitica-de-datos' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Analítica forense</a></li><li><a class="nl" href="<?php echo esc_url( home_url( '/dictamenes-periciales/' ) ); ?>"<?php echo ( 'dictamenes-periciales' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Dictámenes periciales</a></li><li><a class="nl" href="<?php echo esc_url( home_url( '/otros-servicios/' ) ); ?>"<?php echo ( 'otros-servicios' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Otros servicios</a></li><li><a class="nl" href="<?php echo esc_url( home_url( '/nosotros/' ) ); ?>"<?php echo ( 'nosotros' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Nosotros</a></li><li><a class="nl" href="<?php echo esc_url( home_url( '/reconocimientos/' ) ); ?>"<?php echo ( 'reconocimientos' === $sag_cur ) ? ' aria-current="page"' : ''; ?>>Reconocimientos</a></li></ul>
      <a class="btn btn-brass" href="<?php echo esc_url( home_url( '/contacto/' ) ); ?>">Consultar un caso <span class="arr">→</span></a>
    </nav>
  </div>
</header>
<main id="main">
