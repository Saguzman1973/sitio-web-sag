<?php get_header(); ?>
<section class="phero phero--text">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap phero__grid"><div>
    <p class="lbl lbl--cy reveal"><?php echo is_home() ? esc_html__( 'Conocimiento', 'sag' ) : esc_html__( 'SAG Assessment & Consulting', 'sag' ); ?></p>
    <h1 class="reveal"><?php echo is_home() ? esc_html__( 'Ideas y análisis', 'sag' ) : ( is_singular() ? esc_html( get_the_title() ) : wp_kses_post( get_the_archive_title() ) ); ?></h1>
  </div></div>
</section>
<section class="sec sec--white"><div class="wrap">
<?php if ( is_singular() ) : while ( have_posts() ) : the_post(); ?>
  <article class="entry"><?php if ( is_single() ) : ?><p class="entry__date"><?php echo esc_html( get_the_date() ); ?></p><?php endif; ?><?php the_content(); ?></article>
<?php endwhile; else : ?>
  <ul class="posts"><?php while ( have_posts() ) : the_post(); ?>
    <li class="post"><a class="post__a" href="<?php the_permalink(); ?>"><span class="post__meta"><time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time></span><h3><?php the_title(); ?></h3><span class="post__go">Leer artículo <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a></li>
  <?php endwhile; ?></ul>
  <?php the_posts_pagination(); ?>
<?php endif; ?>
</div></section>
<?php get_footer();
