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
