<?php

// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
	echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
	exit;
}

class MySettingsPage {
	private $options;

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
		add_action( 'admin_init', array( $this, 'page_init' ) );
		$this->options = get_option('ImmobrowseOptions');
	}

	//fuegt Einstellungsseite hinzu
	public function add_plugin_page() {
		// This page will be under "Settings"
		add_options_page(
			'Settings Admin',
			'HOMEINFO ImmoBrowse',
			'manage_options',
			'ImmobrowseSettingPage',
			array( $this, 'create_admin_page' )
		);
	}

	//Einstellungsseite befuellen
	public function create_admin_page() {
		echo '<div class="wrap"><h1>Homeinfo ImmoBrowse Einstellungen</h1>';

		if ( isset( $_GET['settings-updated'] ) ) {
			// add settings saved message with the class of "updated"
			add_settings_error( 'wporg_messages', 'wporg_message', __( 'Settings Saved', 'wporg' ), 'updated' );
		}

		echo '<form method="post" action="options.php">';
		// This prints out all hidden setting fields
		settings_fields( 'ImmobrowseOptions' );
		do_settings_sections( 'ImmobrowseSettingPage' );
		submit_button();
		echo '</form></div>';
	}


	public function page_init() {
		register_setting(
			'ImmobrowseOptions', // Option group
			'ImmobrowseOptions', // Option name
			array( $this, 'sanitize' ) // Sanitize
		);

		add_settings_section(
			'setting_section_1', // ID
			'Kundenspezifische Einstellungen', // Title
			array( $this, '' ), // Callback
			'ImmobrowseSettingPage' // Page
		);

		add_settings_field(
			'customerId', // ID
			'Kundennummer', // Title
			array( $this, 'customerId_callback' ), // Callback
			'ImmobrowseSettingPage', // Page
			'setting_section_1' // Section
		);
		add_settings_field(
			'recaptcha', // ID
			'ReCAPTCHA Site Key', // Title
			array( $this, 'recaptcha_callback' ), // Callback
			'ImmobrowseSettingPage', // Page
			'setting_section_1' // Section
		);
	}

	/**
	 * Sanitize each setting field as needed
	 *
	 * @param array $input Contains all settings fields as array keys
	 */
	public function sanitize( $input ) {
		$new_input = array();

		if( isset( $input['customerId'] ) )
			$new_input['customerId'] = absint( $input['customerId'] );

		if( isset( $input['recaptcha'] ) )
			$new_input['recaptcha'] = htmlentities( $input['recaptcha'] );

		return $new_input;
	}

	/**
	 * Get the settings option array and print one of its values
	 */
	public function customerId_callback() {
		echo '<input type="text" id="customerId" name="ImmobrowseOptions[customerId]" value="'.$this->options['customerId'].'" />';
	}

	public function recaptcha_callback() {
		echo '<input type="text" id="recaptcha" name="ImmobrowseOptions[recaptcha]" value="'.$this->options['recaptcha'].'" />';
	}

}

if( is_admin() )
	$my_settings_page = new MySettingsPage();
