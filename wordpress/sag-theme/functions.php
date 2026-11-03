<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
} );
add_action( 'wp_enqueue_scripts', function () {
	$v = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'sag-style', get_template_directory_uri() . '/assets/styles.css', array(), $v );
	wp_enqueue_script( 'sag-main', get_template_directory_uri() . '/assets/main.js', array(), $v, true );
} );
