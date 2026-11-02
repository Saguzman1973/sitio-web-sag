<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
} );
add_action( 'wp_enqueue_scripts', function () {
	$v = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'sag-fonts', 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap', array(), null );
	wp_enqueue_style( 'sag-style', get_stylesheet_uri(), array( 'sag-fonts' ), $v );
	wp_enqueue_script( 'sag-main', get_template_directory_uri() . '/assets/main.js', array(), $v, true );
} );
add_filter( 'language_attributes', function ( $out ) { return $out . ' class="no-js"'; } );
