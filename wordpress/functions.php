<?php

$IMMOBROWSE_IMAGE_GROUPS = [
	'TITELBILD',
	'BILD',
	'AUSSENANSICHTEN',
	'INNENANSICHTEN',
	'ANBIETERLOGO'
];


function immobrowse_attachments($immobilie) {
	$anhaenge = $immobilie['anhaenge'];

	if (!$anhaenge)
		return;

	$anhaenge = $anhaenge['anhang'];

	if (!$anhaenge || empty($anhaenge))
		return;

	foreach ($anhaenge as $anhang)
		yield $anhang;
}

function immobrowse_images($immobilie) {
	$anhaenge = immobrowse_attachments($immobilie);

	if (!$anhaenge || empty($anhaenge))
		return;

	foreach ($anhaenge['anhang'] as $anhang) {
		if (in_array($anhang['gruppe'], $IMMOBROWSE_IMAGE_GROUPS)
			yield $anhang;
	}
}

function immobrowse_floorplans($immobilie) {
	$anhaenge = immobrowse_attachments($immobilie);

	if (!$anhaenge || empty($anhaenge))
		return;

	foreach ($anhaenge['anhang'] as $anhang) {
		if ($anhang['gruppe'] == 'GRUNDRISS')
			yield $anhang;
	}
}

function immobrowse_district($immobilie) {
	$geo = $immobilie['geo'];

	if (!$geo)
		return;

	return $geo['regionaler_zusatz'];
}

function immobrowse_districts($immobilien) {
	$districts = array();

	foreach ($immobilien as $immobilie) {
		$district = immobrowse_district($immobilie);

		if ($district) {
			if (in_array($district, $districts))
				continue;

			array_push($districts, $district);
		}
	}

	return $districts;
}

function immobrowse_amenities($immobilie) {

}
