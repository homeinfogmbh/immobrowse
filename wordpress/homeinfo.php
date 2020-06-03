<?php
/**
* Plugin Name: HOMEINFO ImmoBrowse
* Plugin URI: https://www.homeinfo.de/
* Description: Anzeige Ihrer HOMEINFO Immobilien auf Ihrer Website
* Version: 1.1.5
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

	if ( isset( $_GET['real_estate'] ) ) {
		if ( isset( $_GET['print'] ) ) {
			$filename = plugin_dir_path( __FILE__ )."template/print.inc";

			if ( file_exists( $filename ){
				$content = file_get_contents( $filename );
				$content = str_replace( "[BASEDIR]", plugins_url('/',__FILE__ ), $content );
			} else {
				$content = "Datei print.inc existiert nicht.";
			}
		} else {
			$filename = plugin_dir_path( __FILE__ )."template/expose.inc";

			if ( file_exists( $filename ) ){
				$content = file_get_contents( $filename );
				$content = str_replace( "[BASEDIR]", plugins_url('/',__FILE__ ), $content );
				$content = str_replace( "[RECAPTCHA]", $options['recaptcha'], $content );
			} else {
				$content = "Datei expose.inc existiert nicht.";
			}
		}
	} else {
		$filename = plugin_dir_path( __FILE__ )."template/liste.inc";
		if ( file_exists( $filename ) ){
			$content = file_get_contents( $filename );
		} else {
			$content = "Datei liste.inc existiert nicht.";
		}
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

add_filter( 'style_loader_src', array( $this, 'vc_remove_wp_ver_css_js' ), 9999 );
add_filter( 'script_loader_src', array( $this, 'vc_remove_wp_ver_css_js' ), 9999 );
add_action( 'wp_enqueue_scripts', array( $this, 'immobrowse_setup_js') );

function immobrowse_setup_js() {
	foreach ( glob( plugin_dir_path( __FILE__ )."css/*.css") as $cssfile ){
		$cssfile=basename($cssfile);
		$cssClass=substr($cssfile, 0, -4);

		wp_register_style( 'immobrowsecss-'.$cssClass, plugins_url( 'css/'.$cssfile,__FILE__ ) );
		wp_enqueue_style( 'immobrowsecss-'.$cssClass );
	}

	foreach ( glob( plugin_dir_path( __FILE__ )."js/*.js" ) as $jsfile ){
		$jsfile=basename($jsfile);
		$jsClass=substr($jsfile, 0, -3);
		$basenameWithoutPrefix=substr($jsfile, 3);

		/* Load list.js and expose.js only when loading the respective site. */
		if ( $basenameWithoutPrefix == "list.js" && isset( $_GET['real_estate'] ) ) {
			continue;
		} else if ( $basenameWithoutPrefix == "expose.js" && ! isset( $_GET['real_estate'] ) ) {
			continue;
		}

		wp_enqueue_script( 'immobrowsejs-'.$jsClass, plugins_url( 'js/'.$jsfile,__FILE__ ) );
	}

	wp_enqueue_script( 'immobrowsejs-recaptcha','https://www.google.com/recaptcha/api.js' );
}
?>
