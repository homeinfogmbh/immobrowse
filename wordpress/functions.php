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

/*
 *  Yields human-readable amenities of the real estate.
 */
function immobrowse_amenities($immobilie) {
	$ausstattung = $immobilie['ausstattung'];
	if ($ausstattung) {
		if ($ausstattung['rollstuhlgerecht'])
			yield 'Rollstuhlgerecht';

		if ($ausstattung['stellplatzart']) {
			if ($ausstattung['stellplatzart']['FREIPLATZ'])
				yield 'Stellplatz';
		}

		if ($ausstattung['fahrstuhl']) {
			if ($ausstattung['fahrstuhl']['PERSONEN'])
				yield 'Personenaufzug';

			if ($ausstattung['fahrstuhl']['LASTEN'])
				yield 'Lastenaufzug';
		}

		if ($ausstattung['gaestewc'])
			yield 'Gäste WC';
	}

	$flaechen = $immobilie['flaechen'];
	if ($flaechen) {
		if ($flaechen['einliegerwohnung'])
			yield 'Einliegerwohnung';
	}

	if ($immobilie['lavatoryDryingRoom'])
		yield 'Wasch- / Trockenraum';

	if ($immobilie['builtInKitchen'])
		yield 'Einbauk&uuml;che';

	if ($immobilie['shower'])
		yield 'Dusche';

	if ($immobilie['bathroomWindow'])
		yield 'Fenster im Bad';

	if ($immobilie['bathTub'])
		yield 'Badewanne';

	if ($immobilie['cableSatTv'])
		yield 'Kabel / Sat. / TV';

	if ($immobilie['barrierFree'])
		yield 'Barrierefrei';

	if ($immobilie['basementRoom'])
		yield 'Keller';

	if ($immobilie['balconies'] > 0)
		yield 'Balkon';

	if ($immobilie['terraces'] > 0)
		yield 'Terrasse';

	if ($immobilie['petsAllowed'])
		yield 'Tierhaltung';

	if ($immobilie['gardenUsage'])
		yield 'Gartennutzung';
}

function immobrowse_service_charge($immobilie) {
	if ($immobilie['preise']) {
		if ($immobilie['preise']['nebenkosten'])
			return $immobilie['preise']['nebenkosten'];
	}

	return null;
}

function immobrowse_operational_costs($immobilie) {
	if ($immobilie['preise']) {
		if ($immobilie['preise']['betriebskostennetto'])
			return $immobilie['preise']['betriebskostennetto'];
	}

	return null;
}

function immobrowse_heating_costs($immobilie) {
	if ($immobilie['preise'])
		return $immobilie['preise']['heizkosten'];

	return null;
}

function immobrowse_heating_costs_in_service_change($immobilie) {
	if ($immobilie['preise'])
		return $immobilie['preise']['heizkosten_enthalten'];

	return null;
}

function immobrowse_security_deposit($immobilie) {
	if ($immobilie['preise'])
		return $immobilie['preise']['kaution'];

	return null;
}
