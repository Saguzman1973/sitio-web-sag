<?php get_header(); ?>
<section class="page-hero dark"><div class="wrap"><h1><?php echo is_home() ? esc_html__( 'Conocimiento', 'sag' ) : ( is_singular() ? esc_html( get_the_title() ) : wp_kses_post( get_the_archive_title() ) ); ?></h1></div></section>
<section class="sec"><div class="wrap">
<?php if ( is_singular() ) : while ( have_posts() ) : the_post(); ?>
  <article class="entry"><?php if ( is_single() ) : ?><p class="mono" style="color:var(--muted);margin-bottom:2rem"><?php echo esc_html( get_the_date() ); ?></p><?php endif; ?><?php the_content(); ?></article>
<?php endwhile; else : ?>
  <div class="post-list"><?php while ( have_posts() ) : the_post(); ?>
    <a class="post" href="<?php the_permalink(); ?>"><span class="mono"><?php echo esc_html( get_the_date() ); ?></span><h3><?php the_title(); ?></h3><span class="link">Leer artículo <span>→</span></span></a>
  <?php endwhile; the_posts_pagination(); ?></div>
<?php endif; ?>
</div></section>
<?php get_footer();
