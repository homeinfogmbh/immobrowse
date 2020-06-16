<?php
/**
* Plugin Name: HOMEINFO ImmoBrowse
* Description: Anzeige Ihrer HOMEINFO Immobilien auf Ihrer Website
* Version: 1.1.6
* Author: HOMEINFO - Digitale Informationssysteme GmbH
* Author URI: https://www.homeinfo.de/
* License: GPL v3 or later
**/

// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
	echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
	exit;
}

include("settings.php");
add_shortcode('ImmoBrowse', 'immobrowse_shortcut');

function immobrowse_shortcut() {
	$options = get_option('ImmobrowseOptions');
	$filename = "liste.inc";

	if ( isset( $_GET['real_estate'] ) ) {
		if ( isset( $_GET['print_expose'] ) ) {
			$filename = "print_expose.inc";
		} else if ( isset( $_GET['print_floorplan'] ) ) {
			$filename = "print_floorplan.inc";
		} else {
			$filename = "expose.inc";
		}
	}

	$filepath = plugin_dir_path( __FILE__ )."template/".$filename;

	if ( file_exists( $filepath ) ) {
		$content = file_get_contents( $filepath );
		$content = str_replace( "[BASEDIR]", plugins_url('/',__FILE__ ), $content );
		$content = str_replace( "[RECAPTCHA]", $options['recaptcha'], $content );
	} else {
		$content = "Datei ".$filepath." existiert nicht.";
	}

	$content =
		"<script>
		jQuery.noConflict();
			var customer=".$options['customerId'].";
			var homeinfo_recaptcha='".$options['recaptcha']."';
			var homeinfoBaseurl='".plugins_url( '', __FILE__ )."/';
			jQuery(document).ready(function($) {
				$( \".ib-image-frame, .homeinfo-contact,#furtherImages\" ).on( \"click\", function() {
					setTimeout(function(){

						$( \".modal-backdrop\" ).hide();
						$( \".modal\" ).css('z-index',99999);

					}, 1000);
				});
			});
		</script>
		".$content;

	return $content;
}

// remove wp version param from any enqueued scripts
function vc_remove_wp_ver_css_js( $src ) {
	if ( strpos( $src, 'ver=' ) )
		$src = remove_query_arg( 'ver', $src );

	return $src;
}

function immobrowse_setup_css() {
	foreach ( glob( plugin_dir_path( __FILE__ )."css/*.css") as $cssfile ) {
		$cssfile = basename($cssfile);
		$cssClass = substr($cssfile, 0, -4);

		wp_register_style( 'immobrowsecss-'.$cssClass, plugins_url( 'css/'.$cssfile,__FILE__ ) );
		wp_enqueue_style( 'immobrowsecss-'.$cssClass );
	}
}

function immobrowse_setup_js() {
	$javaScripts = [
		"jquery-3.5.1.min.js",
		"immobrowse-dom.js",
		"config.js",
		"immobrowse.js"
	];

	if ( isset( $_GET['real_estate'] ) ) {
		if ( isset( $_GET['print_expose'] ) ) {
			array_push( $javaScripts, "print_expose.js" );
		} else if ( isset( $_GET['print_floorplan'] ) ) {
			array_push( $javaScripts, "print_floorplan.js" );
		} else {
			array_push( $javaScripts, "expose.js" );
			array_push( $javaScripts, "gallery.js" );
		}
	} else {
		array_push( $javaScripts, "list.js" );
	}

	foreach ( $javaScripts as $javaScript ) {
		$javaScript = plugins_url( 'js/'.$javaScript, __FILE__ );
		wp_enqueue_script( 'immobrowsejs-'.$javaScript, $javaScript );
	}

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
