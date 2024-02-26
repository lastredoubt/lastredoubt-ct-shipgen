<?php
/*
Plugin Name: LR's Traveller Tools - Classic Traveller Character Generator
Description: An interactive character generator using Classic Traveller rules.
Version: 0.1
Author: Last Redoubg
*/

if ( ! defined( 'ABSPATH' ) ) 
{
exit;
} 

// function lr_ct_chargen_admin_menu_page() {
// add_menu_page(
// __('CT Chargen'),             // Page title
// __('CT Chargen Settings'),        // Menu title
// 'manage_options',             // Capability required to access
// 'lr-ct-chargen-vue',                  // Menu slug
// 'lr-ct-chargen-vue_render_content',   // Callback function to render content
// 'dashicons-admin-plugins',    // Icon URL or dashicon class
// 20                            // Menu position
// );
// }

// # lr-ct-chargen_

// add_action('admin_menu', 'lr_ct_chargen_admin_menu_page');

// function verus_vue_render_content() 
// {
//                                                                                                   ? >
// <!-- 
// <h1>Classic Traveller Character Generator</h1>
// <div id="lr-travtools-ct-chargen"> //same div id as in our vue main.JS and index.html
// </div>
// -->
//                                                                                                  <?  php

// }



// function admin_enqueue_vue_scripts( $hook ) 
// {
// if ( 'toplevel_page_lr-ct-chargen-vue' === $hook ) 
// {
// wp_enqueue_script('app-script', plugins_url('/vue-ct-chargen-wp-plugin/dist/assets/index-857a7f15.js', __FILE__), array(), null, true);
// wp_enqueue_style('app-style', plugins_url('/vue-ct-chargen-wp-plugin/dist/assets/index-bd9cf2ed.css', __FILE__));
// }
// }


// add_action('admin_enqueue_scripts', 'admin_enqueue_vue_scripts');


function lt_ct_chargen_render_frontend()
{
return '<div id="lr-travtools-ct-chargen"></div>';
}

add_shortcode('lt-ct-chargen', 'lt_ct_chargen_render_frontend');
// Short code usage: [lt-ct-chargen]

function front_enqueue_vue_scripts() 
{
wp_enqueue_script('app-script', plugins_url('/dist/assets/index-7ed95b4d.js', __FILE__), array(), null, true);
wp_enqueue_style('app-style', plugins_url('/dist/assets/index-c61c31c0.css', __FILE__));
}

add_action('wp_enqueue_scripts', 'front_enqueue_vue_scripts');


?>

