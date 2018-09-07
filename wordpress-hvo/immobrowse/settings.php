<?php

// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
        echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
        exit;
}


class HomeinfoImmobrowseOptions {
    // Holds the values to be used in the fields callbacks
    private $options;

    public function __construct() {
        add_action('admin_menu', array($this, 'add_plugin_page'));
        add_action('admin_init', array($this, 'page_init'));

        //fill current options
        $this->options = get_option('homeinfo_immobrowse_options');
    }

    //fuegt Einstellungsseite hinzu
    public function add_plugin_page() {
        // This page will be under "Settings"
        add_options_page(
            'Settings Admin',
            'HOMEINFO ImmoBrowse',
            'manage_options',
            'homeinfo_immobrowse_settings_page',
            array($this, 'create_admin_page')
        );
    }

    //Einstellungsseite befuellen
    public function create_admin_page() {
        echo '<div class="wrap"><h1>HOMEINFO ImmoBrowse Einstellungen</h1>';

        if (isset($_GET['settings-updated'])) {
            // add settings saved message with the class of "updated"
            add_settings_error('wporg_messages', 'wporg_message', __('Settings Saved', 'wporg'), 'updated');
        }

        echo '<form method="post" action="options.php">';

        // This prints out all hidden setting fields
        settings_fields('homeinfo_immobrowse_options');
        do_settings_sections('homeinfo_immobrowse_settings_page');
        submit_button();


        echo '</form></div>';
    }

    public function page_init() {
        register_setting(
            'homeinfo_immobrowse_options', // Option group
            'homeinfo_immobrowse_options', // Option name
            array($this, 'sanitize') // Sanitize
        );

        add_settings_section(
            'homeinfo_immobrowse_settings_section', // ID
            'Kundenspezifische Einstellungen', // Title
            array($this, ''), // Callback
            'homeinfo_immobrowse_settings_page' // Page
        );

        add_settings_field(
            'customerId', // ID
            'Kundennummer', // Title
            array($this, 'customerId_callback'), // Callback
            'homeinfo_immobrowse_settings_page', // Page
            'homeinfo_immobrowse_settings_section' // Section
        );
        add_settings_field(
            'recaptcha', // ID
            'ReCAPTCHA Site Key', // Title
            array($this, 'recaptcha_callback'), // Callback
            'homeinfo_immobrowse_settings_page', // Page
            'homeinfo_immobrowse_settings_section' // Section
        );

    }

    /**
     * Sanitize each setting field as needed
     *
     * @param array $input Contains all settings fields as array keys
     */
    public function sanitize( $input ) {
        $new_input = array();

        if (isset($input['customerId'])) {
            $new_input['customerId'] = absint($input['customerId']);
        }

        if (isset($input['recaptcha'])) {
            $new_input['recaptcha'] = htmlentities($input['recaptcha']);
        }

        return $new_input;
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function customerId_callback() {
        echo '<input type="text" id="customerId" name="homeinfo_immobrowse_options[customerId]" value="' . $this->options['customerId'] . '" />';
    }

    public function recaptcha_callback() {
        echo '<input type="text" id="recaptcha" name="homeinfo_immobrowse_options[recaptcha]" value="' . $this->options['recaptcha'] . '" />';
    }

}


if (is_admin()) {
    $homeinfo_immobrowse_options = new HomeinfoImmobrowseOptions();
}