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
		return "$strasse $hausnummer";

	return $strasse;
}

function immobrowse_city_preview($immobilie) {
	if ($immobilie->geo == NULL || $immobilie->geo->ort == NULL)
		return 'N/A';

	if ($immobilie->geo->regionaler_zusatz == NULL || $immobilie->geo->regionaler_zusatz == $immobilie->geo->ort)
		return $immobilie->geo->ort;

	return "$immobilie->geo->ort $immobilie->geo->regionaler_zusatz";
}

function immobrowse_object_title($immobilie) {
	if ($immobilie->freitexte && $immobilie->freitexte->objekttitel)
		return $immobilie->freitexte->objekttitel;

	$rooms = immobrowse_rooms($immobilie);

	if ($rooms)
		$title = "$rooms Zimmer Wohnung |";
	else
		$title = 'Wohnung |';

	if (immobrowse_show_address($immobilie))
		$address = immobrowse_address_preview($immobilie) || 'N/A';
	else
		$address = immobrowse_city_preview($immobilie) || 'N/A';

	return "$title $address";
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

function immobrowse_floorplan($immobilie) {
	foreach (immobrowse_floorplans($immobilie) as $floorplan)
		return $floorplan;
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

function immobrowse_match_types($immobilie, $types) {
	if (!$types)
		return TRUE;

	$ownTypes = iterator_to_array(immobrowse_object_types($immobilie));

	foreach ($types as $type) {
		if (in_array($type, $ownTypes))
			return TRUE;
	}

	return FALSE;
}

function immobrowse_match_marketing($immobilie, $types) {
	if (!$types)
		return TRUE;

	$ownTypes = iterator_to_array(immobrowse_marketing_types($immobilie));

	foreach ($types as $type) {
		if (in_array($type, $ownTypes))
			return TRUE;
	}

	return FALSE;
}

function immobrowse_object_id($immobilie) {
	return $immobilie->verwaltung_techn->objektnr_extern;
}

function immobrowse_attachment_url($anhang) {
	if ($anhang)
		return "https://backend.homeinfo.de/immobrowse/attachment/$anhang->id";

	return NULL;
}

function immobrowse_default_details_url($immobilie, $baseURL) {
	if (!$baseURL)
		return NULL;

	return "$baseURL?real_estate=$immobilie->id";
}

function immobrowse_details_url($immobilie, $options) {
	if ($options['exposeURLCallback'])
		return $options['exposeURLCallback'];

	if ($options['detailsURL'])
		return immobrowse_default_details_url($immobilie, $options['detailsURL']);

	return immobrowse_default_details_url($immobilie, 'expose.html');
}

function immobrowse_miscellanea($immobilie) {
	if ($immobilie->freitexte)
		return $immobilie->freitexte->sonstige_angaben;

	return NULL;
}

function immobrowse_description($immobilie) {
	if ($immobilie->freitexte)
		return $immobilie->freitexte->objektbeschreibung;

	return NULL;
}

function immobrowse_exposure($immobilie) {
	if ($immobilie->freitexte)
		return $immobilie->freitexte->lage;

	return NULL;
}

function immobrowse_amenities_description($immobilie) {
	if ($immobilie->freitexte)
		return $immobilie->freitexte->ausstatt_beschr;

	return NULL;
}

function immobrowse_floor($immobilie, $options) {
	if ($options['shortFloorNames']) {
		$dg = 'DG';
		$og = 'OG';
		$eg = 'EG';
		$ug = 'UG';
	} else {
		$dg = 'Dachgeschoss';
		$og = 'Obergeschoss';
		$eg = 'Erdgeschoss';
		$ug = 'Untergeschoss';
	}

	if ($immobilie->geo && $immobilie->geo->etage !== NULL) {
		if ($immobilie->geo->anzahl_etagen !== NULL) {
			if ($immobilie->geo->etage == $immobilie->geo->anzahl_etagen)
				return dg;
		}

		if ($immobilie->geo->etage < 0)
			return -$immobilie->geo->etage . ". $ug";

		if ($immobilie->geo->etage > 0)
			return "$immobilie->geo->etage. $og";

		return $eg;
	}

	return NULL;
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
	if ($immobilie->ausstattung) {
		if ($immobilie->ausstattung->rollstuhlgerecht)
			yield 'Rollstuhlgerecht';

		if ($immobilie->ausstattung->stellplatzart)
			yield 'Stellplatz';

		if ($immobilie->ausstattung->fahrstuhl) {
			if ($immobilie->ausstattung->fahrstuhl->PERSONEN)
				yield 'Personenaufzug';

			if ($immobilie->ausstattung->fahrstuhl->LASTEN)
				yield 'Lastenaufzug';
		}

		if ($immobilie->ausstattung->gaestewc)
			yield 'Gäste WC';
	}

	if ($immobilie->flaechen) {
		if ($immobilie->flaechen->einliegerwohnung)
			yield 'Einliegerwohnung';
	}

	if (immobrowse_lavatory_drying_room($immobilie))
		yield 'Wasch- / Trockenraum';

	if (immobrowse_built_in_kitchen($immobilie))
		yield 'Einbauk&uuml;che';

	if (immobrowse_shower($immobilie))
		yield 'Dusche';

	if (immobrowse_bathroom_window($immobilie))
		yield 'Fenster im Bad';

	if (immobrowse_bath_tub($immobilie))
		yield 'Badewanne';

	if (immobrowse_cable_sat_tv($immobilie))
		yield 'Kabel / Sat. / TV';

	if (immobrowse_barrier_free($immobilie))
		yield 'Barrierefrei';

	if (immobrowse_basement_room($immobilie))
		yield 'Keller';

	if (immobrowse_balconies($immobilie))
		yield 'Balkon';

	if (immobrowse_terraces($immobilie))
		yield 'Terrasse';

	if (immobrowse_pets_allowed($immobilie))
		yield 'Tierhaltung';

	if (immobrowse_garden_usage($immobilie))
		yield 'Gartennutzung';
}

function immobrowse_service_charge($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->nebenkosten;

	return NULL;
}

function immobrowse_operational_costs($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->betriebskostennetto;

	return NULL;
}

function immobrowse_heating_costs($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->heizkosten;

	return NULL;
}

function immobrowse_heating_costs_in_service_charge($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->heizkosten_enthalten;

	return NULL;
}

function immobrowse_security_deposit($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->kaution;

	return NULL;
}

function immobrowse_provision($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->provisionnetto;

	return NULL;
}

function immobrowse_subject_to_commission($immobilie) {
	if ($immobilie->preise)
		return $immobilie->preise->provisionspflichtig;

	return NULL;
}

function immobrowse_living_area($immobilie) {
	if ($immobilie->flaechen)
		return $immobilie->flaechen->wohnflaeche;

	return NULL;
}

function immobrowse_available_from($immobilie) {
	if ($immobilie->verwaltung_objekt) {
		if ($immobilie->verwaltung_objekt->abdatum) {
			$time = strtotime($immobilie->verwaltung_objekt->abdatum);
			return date('dd.mm.YYYY', $time);
		}

		return $immobilie->verwaltung_objekt->verfuegbar_ab;
	}

	return NULL;
}

function immobrowse_council_flat($immobilie) {
	if ($immobilie->verwaltung_objekt)
		return $immobilie->verwaltung_objekt->wbs_sozialwohnung;

	return NULL;
}

function immobrowse_contruction_year($immobilie) {
	if ($immobilie->zustand_angaben)
		return $immobilie->zustand_angaben->baujahr;

	return NULL;
}

function immobrowse_state($immobilie) {
	if ($immobilie->zustand_angaben) {
		switch ($immobilie->zustand_angaben->zustand) {
		case 'ERSTBEZUG':
			return 'Erstbezug';
		case 'TEIL_VOLLRENOVIERUNGSBED':
			return 'Teil-/Vollrenovierungsbedürftig';
		case 'NEUWERTIG':
			return 'Neuwertig';
		case 'TEIL_VOLLRENOVIERT':
			return 'Teil-/Vollrenoviert';
		case 'TEIL_SANIERT':
			return 'Teilsaniert';
		case 'VOLL_SANIERT':
			return 'Vollsaniert';
		case 'SANIERUNGSBEDUERFTIG':
			return 'Sanierungsbedürftig';
		case 'BAUFAELLIG':
			return 'Baufällig';
		case 'NACH_VEREINBARUNG':
			return 'Nach Vereinbarung';
		case 'MODERNISIERT':
			return 'Modernisiert';
		case 'GEPFLEGT':
			return 'Gepflegt';
		case 'ROHBAU':
			return 'Rohbau';
		case 'ENTKERNT':
			return 'Entkernt';
		case 'ABRISSOBJEKT':
			return 'Abrissobjekt';
		case 'PROJEKTIERT':
			return 'Projektiert';
		}
	}

	return NULL;
}

function immobrowse_last_modernization($immobilie) {
	if ($immobilie->zustand_angaben)
		return $immobilie->zustand_angaben->letztemodernisierung;

	return NULL;
}

function immobrowse_heating_types($immobilie) {
	if ($immobilie->ausstattung && $immobilie->ausstattung->heizungsart) {
		if ($immobilie->ausstattung->heizungsart->OFEN)
			yield 'Ofen';

		if ($immobilie->ausstattung->heizungsart->ETAGE)
			yield 'Etagenheizung';

		if ($immobilie->ausstattung->heizungsart->ZENTRAL)
			yield 'Zentralheizung';

		if ($immobilie->ausstattung->heizungsart->FERN)
			yield 'Fernwärme';

		if ($immobilie->ausstattung->heizungsart->FUSSBODEN)
			yield 'Fussbodenheizung';
	}
}

function immobrowse_heating_type($immobilie, $options) {
	$heatingTypes = iterator_to_array(immobrowse_heating_types($immobilie));

	if (count($heatingTypes) > 0)
		return implode(', ', $heatingTypes);

	return $options['notApplicable'];
}

function immobrowse_listed($immobilie) {
	if ($immobilie->verwaltung_objekt)
		return $immobilie->verwaltung_objekt->denkmalgeschuetzt;

	return NULL;
}

function immobrowse_energy_certificate($immobilie) {
	if ($immobilie->zustand_angaben && count($immobilie->zustand_angaben->energiepass))
		return $immobilie->zustand_angaben->energiepass[0];

	return NULL;
}

function immobrowse_contact($immobilie) {
	if (!$immobilie->kontaktperson)
		return NULL;

	$contact = [];
	$name = [];
	$address = [];

	if ($immobilie->kontaktperson->anrede) {
		$contact['salutation'] = $immobilie->kontaktperson->anrede;
		array_push($name, $immobilie->kontaktperson->anrede);
	}

	if ($immobilie->kontaktperson->vorname) {
		$contact['firstName'] = $immobilie->kontaktperson->vorname;
		array_push($name, $immobilie->kontaktperson->vorname);
	}

	$contact['lastName'] = $immobilie->kontaktperson->name;
	array_push($name, $immobilie->kontaktperson->name);
	$contact['name'] = implode(' ', $name);

	if ($immobilie->kontaktperson->firma)
		$contact['company'] = $immobilie->kontaktperson->firma;

	if ($immobilie->kontaktperson->strasse)
		$contact['street'] = $immobilie->kontaktperson->strasse;

	if ($immobilie->kontaktperson->hausnummer)
		$contact['houseNUmber'] = $immobilie->kontaktperson->hausnummer;

	if ($contact['street'] && $contact['houseNumber']) {
		$contact['streetAndHouseNumber'] = $contact['street'] . ' ' . $contact['houseNumber'];
		array_push($address, $contact['streetAndHouseNumber']);
	}

	if ($immobilie->kontaktperson->plz)
		$contact['zipCode'] = $immobilie->kontaktperson->plz;

	if ($immobilie->kontaktperson->ort)
		$contact['city'] = $immobilie->kontaktperson->ort;

	if ($contact['zipCode'] && $contact['city']) {
		$contact['zipCodeAndCity'] = $contact['zipCode'] . ' ' . $contact['city'];
		array_push($address, $contact['zipCodeAndCity']);
	}

	if (count($address) > 0)
		$contact['address'] = implode(', ', $address);

	if ($immobilie->kontaktperson->email_direkt)
		$contact['email'] = $immobilie->kontaktperson->email_direkt;
	else
		$contact['email'] = $immobilie->kontaktperson->email_zentrale;

	if ($immobilie->kontaktperson->tel_durchw)
		$contact['email'] = $immobilie->kontaktperson->tel_durchw;
	else
		$contact['email'] = $immobilie->kontaktperson->tel_zentrale;

	if ($immobilie->kontaktperson->url)
		$contact['website'] = $immobilie->kontaktperson->url;

	return $contact;
}
