<?php
/**
* Plugin Name: HOMEINFO ImmoBrowse
* Plugin URI: https://www.homeinfo.de/
* Description: Homeinfo ImmoBrowse
* Version: 1.1.6
**/

// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}


require_once("settings.php");


add_shortcode('ImmoBrowse', 'immobrowse_shortcode');

add_filter( 'style_loader_src', 'vc_remove_wp_ver_css_js', 9999 );
add_filter( 'script_loader_src', 'vc_remove_wp_ver_css_js', 9999 );

wp_register_style('immobrowsecss-MaterialIconsFont', plugins_url('css/MaterialIconsFont.css', __FILE__));
wp_register_style('immobrowsecss-bootstrap', plugins_url('css/bootstrap.min.css', __FILE__));
wp_register_style('immobrowsecss-sweetalert', plugins_url('css/sweetalert.css', __FILE__));
wp_register_style('immobrowsecss-immobrowse', plugins_url('css/immobrowse.css', __FILE__));
wp_register_style('immobrowsecss-list', plugins_url('css/list.css', __FILE__));
wp_register_style('immobrowsecss-expose', plugins_url('css/expose.css', __FILE__));


function immobrowse_shortcode() {
    $options = get_option('homeinfo_immobrowse_options');
    wp_enqueue_style('immobrowsecss-MaterialIconsFont');
    //wp_enqueue_style('immobrowsecss-bootstrap');
    wp_enqueue_style('immobrowsecss-sweetalert');
    wp_enqueue_style('immobrowsecss-immobrowse');
    wp_enqueue_script('immobrowsejs-bootstrap', plugins_url('js/bootstrap.min.js', __FILE__));
    wp_enqueue_script('immobrowsejs-sweetalert', plugins_url('js/sweetalert.min.js', __FILE__));
    wp_enqueue_script('immobrowsejs-homeinfo', plugins_url('js/homeinfo.min.js', __FILE__));
    wp_enqueue_script('immobrowsejs-config', plugins_url('js/config.js', __FILE__));
    wp_enqueue_script('immobrowsejs-immobrowse', plugins_url('js/immobrowse.js', __FILE__));

    if (isset($_GET['real_estate'])) {
        wp_enqueue_style('immobrowsecss-expose');
        wp_enqueue_script('immobrowsejs-recaptcha','https://www.google.com/recaptcha/api.js');
        wp_enqueue_script('immobrowsejs-gallery', plugins_url('js/gallery.js', __FILE__));
        wp_enqueue_script('immobrowsejs-expose', plugins_url('js/expose.js', __FILE__));
        wp_localize_script('immobrowsejs-expose', 'php_vars', $options);
        $content = file_get_contents(plugin_dir_path( __FILE__ ) . 'template/expose.inc');
        $content = str_replace("[BASEDIR]", plugins_url('/', __FILE__ ), $content);
        $content = str_replace("[RECAPTCHA]", $options['recaptcha'], $content);
    } else {
        wp_enqueue_style('immobrowsecss-list');
        wp_enqueue_script('immobrowsejs-list', plugins_url('js/list.js', __FILE__));
        wp_localize_script('immobrowsejs-list', 'php_vars', $options);
        $content = file_get_contents(plugin_dir_path( __FILE__ ) . 'template/liste.inc');
        $content = str_replace("[BASEDIR]", plugins_url('/', __FILE__ ), $content);
    }

    return $content;
}


// Remove wp version param from any enqueued scripts.
function vc_remove_wp_ver_css_js($src) {
    if (strpos( $src, 'ver=') ) {
        $src = remove_query_arg('ver', $src);
    }

    return $src;
}
?>
