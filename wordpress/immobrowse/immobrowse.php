<?php
/*
Plugin Name: ImmoBrowse
Description: Real estate browsing
Version: 0.0.1
Author: HOMEINFO - Digitale Informationssysteme GmbH
License: GPL3

{Plugin Name} is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

{Plugin Name} is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with {Plugin Name}. If not, see {License URI}.
*/

function immobrowse_setup_post_type()
{
    // register the "book" custom post type
    register_post_type( 'book', ['public' => 'true'] );
}
add_action( 'init', 'immobrowse_setup_post_type' );

function immobrowse_install()
{
    // trigger our function that registers the custom post type
    immobrowse_setup_post_type();

    // clear the permalinks after the post type has been registered
    flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'immobrowse_install' );

function immobrowse_deactivation()
{
    // our post type will be automatically removed, so no need to unregister it

    // clear the permalinks to remove our post type's rules
    flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'immobrowse_deactivation' );

register_uninstall_hook(__FILE__, 'pluginprefix_function_to_run');
