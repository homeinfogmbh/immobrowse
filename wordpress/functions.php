<?php

$IMMOBROWSE_IMAGE_GROUPS = [
	'TITELBILD',
	'BILD',
	'AUSSENANSICHTEN',
	'INNENANSICHTEN',
	'ANBIETERLOGO'
];
$IMMOBROWSE_AREAS = [
	'gesamtflaeche',
	'nutzflaeche',
	'wohnflaeche'
];


function immobrowse_street($immobilie) {
	if ($immobilie->geo)
		return $immobilie->geo->strasse;

	return NULL;
}

function immobrowse_house_number($immobilie) {
	if ($immobilie->geo)
		return $immobilie->geo->hausnummer;

	return NULL;
}

function immobrowse_zip_code($immobilie) {
	if ($immobilie->geo)
		return $immobilie->geo->plz;

	return NULL;
}

function immobrowse_city($immobilie) {
	if ($immobilie->geo)
		return $immobilie->geo->ort;

	return NULL;
}

function immobrowse_district($immobilie) {
	if ($immobilie->geo)
		return $immobilie->geo->regionaler_zusatz;

	return NULL;
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

        return NULL;
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

        return NULL;
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

        return NULL;
}

function immobrowse_address_preview($immobilie) {
	$strasse = immobrowse_street($immobilie);
	if (!$strasse)
		return NULL;

	$hausnummer = immobrowse_house_number($immobilie);
	if ($hausnummer)
		return $strasse . ' ' . $hausnummer;

	return $strasse;
}

function immobrowse_city_preview($immobilie) {
	if ($immobilie->geo == NULL || $immobilie->geo->ort == NULL)
		return 'N/A';

	if ($immobilie->geo->regionaler_zusatz == NULL || $immobilie->geo->regionaler_zusatz == $immobilie->geo->ort)
		return $immobilie->geo->ort;

	return $immobilie->geo->ort . ' ' . $immobilie->geo->regionaler_zusatz;
}

function immobrowse_object_title($immobilie) {
	if ($immobilie->freitexte && $immobilie->freitexte->objekttitel)
		return $immobilie->freitexte->objekttitel;

	$title = '';
	$rooms = immobrowse_rooms($immobilie);

	if ($rooms)
		$title .= 'Wohnung | ';
	else
		$title .= $rooms . ' Zimmer Wohnung | ';

	if (immobrowse_show_address($immobilie))
		$title .= (immobrowse_address_preview($immobilie) || 'N/A') . ' | ';

	return $title . immobrowse_city_preview($immobilie);
}

function immobrowse_attachments($immobilie) {
	if (!$immobilie->anhaenge || !$immobilie->anhaenge->anhang)
		return;

	foreach ($immobilie->anhaenge->anhang as $anhang)
		yield $anhang;
}

function immobrowse_images($immobilie) {
	foreach (immobrowse_attachments($immobilie) as $anhang) {
		if (in_array($anhang->gruppe, $IMMOBROWSE_IMAGE_GROUPS))
			yield $anhang;
	}
}

function immobrowse_floorplans($immobilie) {
	foreach (immobrowse_attachments($immobilie) as $anhang) {
		if ($anhang->gruppe == 'GRUNDRISS')
			yield $anhang;
	}
}

function immobrowse_title_image($immobilie) {
	foreach (immobrowse_attachments($immobilie) as $anhang) {
		if ($anhang->gruppe == 'TITELBILD')
			return $anhang;
	}

	foreach (immobrowse_attachments($immobilie) as $anhang) {
		if ($anhang->gruppe == 'AUSSENANSICHTEN')
			return $anhang;
	}

	foreach (immobrowse_attachments($immobilie) as $anhang) {
		if ($anhang->gruppe == 'BILD')
			return $anhang;
	}

	foreach (immobrowse_attachments($immobilie) as $anhang) {
		if ($anhang->gruppe == 'GRUNDRISS')
			return $anhang;
	}
}

function immobrowse_rooms($immobilie) {
	if ($immobilie->flaechen)
		return $immobilie->flaechen->anzahl_zimmer;

	return NULL;
}

function immobrowse_bathrooms($immobilie) {
	if ($immobilie->flaechen)
		return $immobilie->flaechen->anzahl_badezimmer;

	return NULL;
}

function immobrowse_bedrooms($immobilie) {
	if ($immobilie->flaechen)
		return $immobilie->flaechen->anzahl_schlafzimmer;

	return NULL;
}

function immobrowse_types($immobilie) {
	if (!$immobilie->objektkategorie || !$immobilie->objektkategorie->objektart)
		return [];

	if ($immobilie->objektkategorie->objektart->zimmer)
		return $immobilie->objektkategorie->objektart->zimmer;

	if ($immobilie->objektkategorie->objektart->wohnung)
		return $immobilie->objektkategorie->objektart->wohnung;

	if ($immobilie->objektkategorie->objektart->haus)
		return $immobilie->objektkategorie->objektart->haus;

	if ($immobilie->objektkategorie->objektart->grundstueck)
		return $immobilie->objektkategorie->objektart->grundstueck;

	if ($immobilie->objektkategorie->objektart->buero_praxen)
		return $immobilie->objektkategorie->objektart->buero_praxen;

	if ($immobilie->objektkategorie->objektart->einzelhandel)
		return $immobilie->objektkategorie->objektart->einzelhandel;

	if ($immobilie->objektkategorie->objektart->gastgewerbe)
		return $immobilie->objektkategorie->objektart->gastgewerbe;

	if ($immobilie->objektkategorie->objektart->hallen_lager_prod)
		return $immobilie->objektkategorie->objektart->hallen_lager_prod;

	if ($immobilie->objektkategorie->objektart->land_und_forstwirtschaft)
		return $immobilie->objektkategorie->objektart->land_und_forstwirtschaft;

	if ($immobilie->objektkategorie->objektart->parken)
		return $immobilie->objektkategorie->objektart->parken;

	if ($immobilie->objektkategorie->objektart->sonstige)
		return $immobilie->objektkategorie->objektart->sonstige;

	if ($immobilie->objektkategorie->objektart->freizeitimmobilie_gewerblich)
		return $immobilie->objektkategorie->objektart->freizeitimmobilie_gewerblich;

	if ($immobilie->objektkategorie->objektart->zinshaus_renditeobjekt)
		return $immobilie->objektkategorie->objektart->zinshaus_renditeobjekt;

	return [];
}

function immobrowse_type($immobilie) {
	foreach (immobrowse_types($immobilie) as $type)
		return ucfirst(strtolower($type));
}

function immobrowse_garden_usage($immobilie) {
	if ($immobilie->ausstattung)
		return $immobilie->aussttattung->gartennutzung;

	return NULL;
}

function immobrowse_pets_allowed($immobilie) {
	if ($immobilie->verwaltung_objekt)
		return $immobilie->verwaltung_objekt->haustiere;

	return NULL;
}

function immobrowse_area($immobilie) {
	if (!$immobilie->flaechen)
		return NULL;

	if ($immobilie->flaechen->wohnflaeche)
		return $immobilie->flaechen->wohnflaeche;

	if ($immobilie->flaechen->nutzflaeche)
		return $immobilie->flaechen->nutzflaeche;

	return $immobilie->flaechen->gesamtflaeche;
}

function immobrowse_net_cold_rent($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->nettokaltmiete;

	return NULL;
}

function immobrowse_cold_rent($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->kaltmiete;

	return NULL;
}

function immobrowse_warm_rent($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->warmmiete;

	return NULL;
}

function immobrowse_rent($immobilie) {
	$netColdRent = immobrowse_net_cold_rent($immobilie);

	if ($netColdRent)
		return $netColdRent;

	return immobrowse_cold_rent($immobilie);
}

function immobrowse_totaled_up_rent($immobilie) {
	$rent = immobrowse_rent($immobilie);

	if (!$rent)
		return NULL;

	$operationalCosts = immobrowse_operational_costs($immobilie) || 0;
	$heatingCosts = immobrowse_heating_costs($immobilie) || 0;
	return $rent + $operationalCosts + $heatingCosts;
}

function immobrowse_total_rent($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->gesamtmietenetto;

	return NULL;
}

function immobrowse_cable_sat_tv($immobilie) {
	if ($immobilie->ausstattung)
		return $immobilie->ausstattung->kabel_sat_tv;

	return NULL;
}

function immobrowse_built_in_kitchen($immobilie) {
	if ($immobilie->ausstattung && $immobilie->ausstattung->kueche)
		return $immobilie->ausstattung->kueche->EBK;

	return NULL;
}

function immobrowse_basement_room($immobilie) {
	if ($immobilie->ausstattung)
		return $immobilie->ausstattung->unterkellert;

	return NULL;
}

function immobrowse_balconies($immobilie) {
	if ($immobilie->flaechen)
		return $immobilie->flaechen->anzahl_balkone;

	return NULL;
}

function immobrowse_terraces($immobilie) {
	if ($immobilie->flaechen)
		return $immobilie->flaechen->anzahl_terrassen;

	return NULL;
}

function immobrowse_shower($immobilie) {
	if ($immobilie->ausstattung && $immobilie->ausstattung->bad)
		return $immobilie->ausstattung->bad->DUSCHE;

	return NULL;
}

function immobrowse_bath_tub($immobilie) {
	if ($immobilie->ausstattung && $immobilie->ausstattung->bad)
		return $immobilie->ausstattung->bad->WANNE;

	return NULL;
}

function immobrowse_bathroom_window($immobilie) {
	if ($immobilie->ausstattung && $immobilie->ausstattung->bad)
		return $immobilie->ausstattung->bad->FENSTER;

	return NULL;
}

function immobrowse_lavatory_drying_room($immobilie) {
	if ($immobilie->ausstattung)
		return $immobilie->ausstattung->wasch_trockenraum;

	return NULL;
}

function immobrowse_barrier_free($immobilie) {
	if ($immobilie->ausstattung)
		return $immobilie->ausstattung->barrierefrei;

	return NULL;
}

function immobrowse_object_types($immobilie) {
	if (!$immobilie->objektkategorie || !$immobilie->objektkategorie->objektart)
		return;

	if ($immobilie->objektkategorie->objektart->zimmer)
		yield 'ZIMMER';

	if ($immobilie->objektkategorie->objektart->wohnung) {
		yield 'WOHNUNG';

		foreach ($immobilie->objektkategorie->objektart->wohnung as $type)
			yield $type;
	}
}

function immobrowse_marketing_types($immobilie) {
	if (!$immobilie->objektkategorie || !$immobilie->objektkategorie->vermarktungsart)
		return;

	if ($immobilie->objektkategorie->vermarktungsart->KAUF)
		yield 'KAUF';

	if ($immobilie->objektkategorie->vermarktungsart->MIETE_PACHT)
		yield 'MIETE_PACHT';

	if ($immobilie->objektkategorie->vermarktungsart->ERBPACHT)
		yield 'ERBPACHT';

	if ($immobilie->objektkategorie->vermarktungsart->LEASING)
		yield 'LEASING';
}

function immobrowse_show_address($immobilie) {
	if ($immobilie->verwaltung_objekt)
		return $immobilie->verwaltung_objekt->objektadresse_freigeben;

	return FALSE;
}

function

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
