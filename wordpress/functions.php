<?php

$IMMOBROWSE_IMAGE_GROUPS = [
	'TITELBILD',
	'BILD',
	'AUSSENANSICHTEN',
	'INNENANSICHTEN',
	'ANBIETERLOGO'
];


function immobrowse_street($immobilie) {
	if ($immobilie['geo'])
		return $immobilie['geo']['strasse'];

	return null;
}

function immobrowse_house_number($immobilie) {
	if ($immobilie['geo'])
		return $immobilie['geo']['hausnummer'];

	return null;
}

function immobrowse_zip_code($immobilie) {
	if ($immobilie['geo'])
		return $immobilie['geo']['plz'];

	return null;
}

function immobrowse_city($immobilie) {
	if ($immobilie['geo'])
		return $immobilie['geo']['ort'];

	return null;
}

function immobrowse_district($immobilie) {
	if ($immobilie['geo'])
		return $immobilie['geo']['regionaler_zusatz'];

	return null;
}

function immobrowse_street_and_house_number($immobilie) {
	$street = immobrowse_street($immobilie);
	$houseNumber = immobrowse_house_number($immobilie);
	$streetAndHouseNumber = array();

	if ($street)
		array_push($streetAndHouseNumber, $street);

	if ($houseNumber)
		array_push($streetAndHouseNumber, $houseNumber);

        if (count($streetAndHouseNumber) > 0)
            return implode(' ', $streetAndHouseNumber);

        return null;
}

function immobrowse_zip_code_and_city($immobilie) {
	$zipCode = immobrowse_zip_code($immobilie);
	$city = immobrose_city($immobilie);
	$district = immobrowse_district($immobilie);
	$zipCodeAndCity = array();

	if ($zipCode)
		array_push($zipCodeAndCity, $zipCode);

	if ($city)
		array_push($zipCodeAndCity, $city);

	if ($district && $district != $city)
		array_push($zipCodeAndCity, $district);

        if (count($zipCodeAndCity) > 0)
            return implode(' ', $zipCodeAndCity);

        return null;
}

function immobrowse_address($immobilie) {
	$streetAndHouseNumber = immobrowse_street_and_house_number($immobilie);
	$zipCodeAndCity = immobrowse_zip_code_and_city($immobilie);
	$address = array();

	if ($streetAndHouseNumber)
		array_push($address, $streetAndHouseNumber);

	if ($zipCodeAndCity)
		array_push($address, $zipCodeAndCity);

        if (count($address) > 0)
            return implode(' ', $address);

        return null;
}

function immobrowse_address_preview($immobilie) {
	$strasse = immobrowse_street($immobilie);
	if (!$strasse)
		return null;

	$hausnummer = immobrowse_house_number($immobilie);
	if ($hausnummer)
		return $strasse . ' ' . $hausnummer;

	return $strasse;
}

function immobrowse_city_preview($immobilie) {
	if (!$immobilie['geo'] || !$immobilie['geo']['ort'])
		return 'N/A';

	if (!$immobilie['geo']['regionaler_zusatz'] || $immobilie['geo']['regionaler_zusatz'] == $immobilie['geo']['ort'])
		return $immobilie['geo']['ort'];

	return $immobilie['geo']['ort'] . ' ' . $immobilie['geo']['regionaler_zusatz'];
}

function immobrowse_object_title($immobilie) {
	if ($immobilie['freitexte']) {
		if ($immobilie['freitexte']['objekttitel'])
			return $immobilie['freitexte']['objekttitel'];
	}

	$title = '';
	$rooms = immobrowse_rooms($immobilie);

	if ($rooms)
		$title .= 'Wohnunh | ';
	else
		$title .= $rooms . ' Zimmer Wohnung | ';

	if (immobrowse_show_address($immobilie)) {
		$title .= immobrowse_address_preview($immobilie) || 'N/A';
		$title .= ' | ';
	}

	return $title . immobrowse_city_preview($immobilie);
}

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
