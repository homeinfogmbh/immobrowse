<?php
/**
* Plugin Name: HOMEINFO ImmoBrowse
* Description: Anzeige Ihrer HOMEINFO Immobilien auf Ihrer Website
* Version: 2.0.0
* Author: HOMEINFO - Digitale Informationssysteme GmbH
* Author URI: https://www.homeinfo.de/
* License: GPL v3 or later
**/

// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
	echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
	exit;
}

include('settings.php');
add_shortcode('ImmoBrowse', 'immobrowse_shortcut');

function immobrowse_shortcut() {
	$options = get_option('ImmobrowseOptions');
	$filebase = "list";

	if ( isset( $_GET['real_estate'] ) ) {
		$filebase = "expose";
	}

	$filepath = plugin_dir_path( __FILE__ )."template/".$filebase.".inc";

	if ( file_exists( $filepath ) ) {
		$content = file_get_contents( $filepath );
		$content = str_replace( "[RECAPTCHA]", $options['recaptcha'], $content );
	} else {
		$content = "Datei ".$filepath." existiert nicht.";
	}

	return "<script type=\"module\">
  const CUSTOMER = ".$options['customerId'].";
  const RECAPTCHA = '".$options['recaptcha']."';
  import { init } from '".plugins_url( '', __FILE__ )."/js/".$filebase.".mjs';

  document.addEventListener('DOMContentLoaded', () => init(CUSTOMER));
</script>
".$content;
}

// remove wp version param from any enqueued scripts
function vc_remove_wp_ver_css_js( $src ) {
	if ( strpos( $src, 'ver=' ) )
		$src = remove_query_arg( 'ver', $src );

	return $src;
}

function immobrowse_setup_css() {
	wp_enqueue_style( 'w3-css', 'https://www.w3schools.com/w3css/4/w3.css' );

	foreach ( glob( plugin_dir_path( __FILE__ )."css/*.css") as $cssfile ) {
		$cssfile = basename($cssfile);
		$cssClass = substr($cssfile, 0, -4);

		wp_register_style( 'immobrowsecss-'.$cssClass, plugins_url( 'css/'.$cssfile,__FILE__ ) );
		wp_enqueue_style( 'immobrowsecss-'.$cssClass );
	}
}

function immobrowse_setup_js() {
	wp_enqueue_script( 'immobrowsejs-recaptcha','https://www.google.com/recaptcha/api.js' );
}

function immobrowse_setup_scripts() {
	immobrowse_setup_css();
	immobrowse_setup_js();
}

add_filter( 'style_loader_src', 'vc_remove_wp_ver_css_js', 9999 );
add_filter( 'script_loader_src', 'vc_remove_wp_ver_css_js', 9999 );
add_action( 'wp_enqueue_scripts', 'immobrowse_setup_scripts' );
?>
