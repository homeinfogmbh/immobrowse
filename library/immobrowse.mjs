/*
  immobrowse.mjs - ImmoBrowse main library.

  (C) 2021 HOMEINFO - Digitale Informationssysteme GmbH

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this library.  If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>
*/
'use strict';


import { capitalizeFirstLetter, euros, germanDecimal } from 'https://javascript.homeinfo.de/lib.mjs';
import { request } from 'https://javascript.homeinfo.de/requests.mjs';
import { AmenitiesTag, KilowattHoursPerSquareMeterAndYear, addDataFieldCol, preview } from './dom.js';


export const CONFIG = {
    addressInList: false,
    kwh: (new KilowattHoursPerSquareMeterAndYear()).outerHTML,
    listedHint: 'Gebäude liegt im Denkmalschutzbereich.',
    shortFloorNames: false,
    na: 'k. A.'
};
const DEFAULT_ELEMENTS = [
    {'name': 'coldRent', 'caption': 'Kaltmiete'},
    {'name': 'serviceCharge', 'caption': 'Nebenkosten'},
    {'name': 'rooms', 'caption': 'Zimmer'},
    {'name': 'area', 'caption': 'Fläche ca.'}
];
const EMAIL = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
const IMAGE_GROUPS = [
    'TITELBILD',
    'BILD',
    'AUSSENANSICHTEN',
    'INNENANSICHTEN',
    'ANBIETERLOGO'
];


/*
  Compares two nullable values so that
  null values always come out last.
*/
function compare (alice, bob, descending) {
    if (alice == null) {
        if (bob == null)
            return 0;

        return Infinity;
    }

    if (bob == null)
        return -Infinity;

    let val = 0;

    if (alice < bob)
        val = -1;
    else if (bob < alice)
        val = 1;

    if (descending)
        return -val;

    return val;
}


/*
  Returns an appropriate sorting function.
*/
function getSorter (property, order) {
    const descending = true ? (order == 'descending') : false;

    switch(property) {
    case 'rooms': return sortByRooms(descending);
    case 'area': return sortByArea(descending);
    case 'rent': return sortByRent(descending);
    case 'street': return sortByStreet(descending);
    default: throw 'Invalid sorting property: ' + property;
    }
}


/*
  Returns comparison for rooms.
*/
function sortByRooms (descending) {
    return (immobilie1, immobilie2) => compare(immobilie1.rooms, immobilie2.rooms, descending);
}


/*
  Returns comparison for area.
*/
function sortByArea (descending) {
    return (immobilie1, immobilie2) => compare(immobilie1.area, immobilie2.area, descending);
}


/*
  Returns comparison for rent.
*/
function sortByRent (descending) {
    return (immobilie1, immobilie2) => compare(immobilie1.rent, immobilie2.rent, descending);
}


/*
  Returns comparison for streets.
*/
function sortByStreet (descending) {
    return (immobilie1, immobilie2)  => compare(immobilie1.street, immobilie2.street, descending);
}


/*
  Converts a boolean value to "Ja", respectively "Nein" or returns null.
*/
function yesNoNull (boolean) {
    if (boolean == null)
        return null;

    if (boolean)
        return 'Ja';

    return 'Nein';
}


/*
    Padds a date with a zero if it's less than 10.
*/
function paddDate (num) {
    if (num < 10)
        return '0' + num;

    return '' + num;
}


/*
    Returns date like <%d.%m.%Y>.
*/
function dateToString (date) {
    return paddDate(date.getDate())
        + '.' + paddDate(date.getMonth() + 1)
        + '.' + date.getFullYear();
}


/*
  Sets a value onto the respective element configuration.
*/
export function setValue (element, value) {
    if (element != null) {
        if (value == null) {
            if (element.container == undefined) {
                element.html(CONFIG.na);
            } else {
                element.value.html(CONFIG.na);
                element.container.hide();
            }
        } else {
            if (element.value == undefined) {
                element.html(value);
            } else {
                element.value.html(value);
                element.container.show();
            }
        }
    }
}


/*
  Counts districts on the provided real estates.
*/
export function countDistricts (realEstates) {
    const districts = {};

    for (const realEstate of realEstates) {
        const district = realEstate.district;

        if (district != null) {
            if (district in districts)
                districts[district] += 1;
            else
                districts[district] = 1;
        }
    }

    return districts;
}


/*
  Returns a list of district elements for rendering.
*/
export function *districtElements (realEstates) {
    for (const [district, count] in countDistricts(realEstates).entries()) {
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'checkbox');
        inputElement.setAttribute('class', 'ib-select-district');
        inputElement.setAttribute('name', district);
        yield inputElement;
        yield document.createTextNode(' ' + district + ' (' + count + ')');
        yield document.createElement('br');
    }
}


/*
  Returns a human readable primary energy source.
*/
function translatePrimaerenergietraeger (primaerenergietraeger) {
    switch (primaerenergietraeger) {
    case 'OEL':
        return 'Öl';
    case 'GAS':
        return 'Gas';
    case 'ELEKTRO':
        return 'Elektisch';
    case 'ALTERNATIV':
        return 'Alternativ';
    case 'SOLAR':
        return 'Solar';
    case 'ERDWAERME':
        return 'Erdwärme';
    case 'LUFTWP':
        return 'Wärmepumpe Luft-Wasser';
    case 'FERN':
        return 'Fernwärme';
    case 'BLOCK':
        return 'Blockheizkraftwerk';
    case 'WASSER-ELEKTRO':
        return 'Ergänzendes dezentrales Warmwasser';
    case 'PELLET':
        return 'Pellet';
    case 'KOHLE':
        return 'Kohle';
    case 'HOLZ':
        return 'Holz';
    case 'FLUESSIGGAS':
        return 'Flüssiggas';
    }

    return primaerenergietraeger;
};


/*
  Opens the respective URL.
*/
export function open (url) {
    return window.open(url, '_self');
}


/*
  Matches real estates for filtering.
*/
export class Filter {
    constructor (rules) {
        this.rules = rules || {};
    }

    /*
      Match filters on a real estate's JSON data.
    */
    match (realEstate) {
        if (this.rules.priceMin > realEstate.rent)
            return false;

        if (this.rules.priceMax < realEstate.rent)
            return false;

        if (this.rules.areaMin != null) {
            if (realEstate.flaechen == null)
                return false;

            if (this.rules.areaMin > realEstate.flaechen.wohnflaeche)
                return false;
        }

        if (this.rules.roomsMin != null) {
            if (realEstate.flaechen == null)
                return false;

            if (this.rules.roomsMin > realEstate.flaechen.anzahl_zimmer)
                return false;
        }

        if (this.rules.ebk) {
            if (realEstate.ausstattung == null)
                return false;

            if (realEstate.ausstattung.kueche == null)
                return false;

            if (! realEstate.ausstattung.kueche.EBK)
                return false;
        }

        if (this.rules.bathtub) {
            if (realEstate.ausstattung == null)
                return false;

            if (realEstate.ausstattung.bad == null)
                return false;

            if (! realEstate.ausstattung.bad.WANNE)
                return false;
        }

        if (this.rules.window) {
            if (realEstate.ausstattung == null)
                return false;

            if (realEstate.ausstattung.bad == null)
                return false;

            if (! realEstate.ausstattung.bad.FENSTER)
                return false;
        }

        if (this.rules.guestwc) {
            if (realEstate.ausstattung == null)
                return false;

            if (! realEstate.ausstattung.gaestewc)
                return false;
        }

        if (this.rules.carSpace) {
            if (realEstate.ausstattung == null)
                return false;

            if (realEstate.ausstattung.stellplatzart == null)
                return false;

            if (! realEstate.ausstattung.stellplatzart.TIEFGARAGE)
                return false;
        }

        if (this.rules.elevator) {
            if (realEstate.ausstattung == null)
                return false;

            if (realEstate.ausstattung.fahrstuhl == null)
                return false;

            if (! realEstate.ausstattung.fahrstuhl.PERSONEN)
                return false;
        }

        if (this.rules.garden) {
            if (realEstate.ausstattung == null)
                return false;

            if (! realEstate.ausstattung.gartennutzung)
                return false;
        }

        if (this.rules.balcony) {
            if (realEstate.flaechen == null)
                return false;

            if (realEstate.flaechen.anzahl_balkone == null || realEstate.flaechen.anzahl_balkone == 0)
                return false;
        }

        if (this.rules.districts != null) {
            if (this.rules.districts.length > 0) {
                if (this.rules.districts.indexOf(realEstate.district) < 0)
                    return false;
            }
        }

        return true;
    }

    /*
      Filters a list of real estates.
    */
    *filter (realEstates) {
        for (const realEstate of realEstates) {
            if (this.match(realEstate))
                yield realEstate;
        }
    }
}


/*
  Real estate wrapper class.
*/
export class RealEstate {
    constructor (json) {
        for (const prop in json) {
            if (Object.prototype.hasOwnProperty.call(json, prop))
                this[prop] = json[prop];
        }
    }

    /*
      Queries real estate data from the API and returns a thenable.
    */
    static get (id) {
        const cls = this;
        return request.get('https://backend.homeinfo.de/immobrowse/expose/' + id).then(
            function (json) {
                return new cls(json);
            },
            function () {
                alert('Immobilie konnte nicht geladen werden.\nBitte versuchen Sie es später noch ein Mal.');
            }
        );
    }

    /*
      Queries API for real estate list and returns a thenable.
    */
    static list (cid) {
        const cls = this;
        return request.get('https://backend.homeinfo.de/immobrowse/list/' + cid).then(
            function (json) {
                const realEstates = [];

                for (const object of json) {
                    const realEstate = new cls(object);
                    realEstates.push(realEstate);
                }

                return realEstates;
            },
            function () {
                alert('Immobilien konnten nicht geladen werden.\nBitte versuchen Sie es später noch ein Mal.');
            }
        );
    }

    get street () {
        if (this.geo != null && this.geo.strasse != null)
            return this.geo.strasse;

        return null;
    }

    get houseNumber () {
        if (this.geo != null && this.geo.hausnummer != null)
            return this.geo.hausnummer;

        return null;
    }

    get zipCode () {
        if (this.geo != null && this.geo.plz != null)
            return this.geo.plz;

        return null;
    }

    get city () {
        if (this.geo != null && this.geo.ort != null)
            return this.geo.ort;

        return null;
    }

    get district () {
        if (this.geo != null && this.geo.regionaler_zusatz != null)
            return this.geo.regionaler_zusatz;

        return null;
    }

    get streetAndHouseNumber () {
        const street = this.street;
        const houseNumber = this.houseNumber;
        const streetAndHouseNumber = [];

        if (street)
            streetAndHouseNumber.push(street);

        if (houseNumber)
            streetAndHouseNumber.push(houseNumber);

        if (streetAndHouseNumber.length > 0)
            return streetAndHouseNumber.join(' ');

        return null;
    }

    get zipCodeAndCity () {
        const zipCode = this.zipCode;
        const city = this.city;
        const district = this.district;
        const zipCodeAndCity = [];

        if (zipCode)
            zipCodeAndCity.push(zipCode);

        if (city)
            zipCodeAndCity.push(city);

        if (district && district != city)
            zipCodeAndCity.push(district);

        if (zipCodeAndCity.length > 0)
            return zipCodeAndCity.join(' ');

        return null;
    }

    get address () {
        const streetAndHouseNumber = this.streetAndHouseNumber;
        const zipCodeAndCity = this.zipCodeAndCity;
        const address = [];

        if (streetAndHouseNumber)
            address.push(streetAndHouseNumber);

        if (zipCodeAndCity)
            address.push(zipCodeAndCity);

        if (address.length > 0)
            return address.join(', ');

        return null;
    }

    get addressPreview () {
        if (this.geo != null) {
            if (this.geo.strasse != null) {
                if (this.geo.hausnummer == null)
                    return this.geo.strasse;

                return this.geo.strasse + ' ' + this.geo.hausnummer;
            }
        }

        return null;
    }

    get cityPreview () {
        if (this.geo == null)
            return 'N/A';

        if (this.geo.ort == null)
            return 'N/A';

        if (this.geo.regionaler_zusatz == null || this.geo.regionaler_zusatz == this.geo.ort)
            return this.geo.ort;

        return this.geo.ort + ' ' + this.geo.regionaler_zusatz;
    }

    get objectTitle () {
        if (this.freitexte != null && this.freitexte.objekttitel != null)
            return this.freitexte.objekttitel;

        let html = '';

        if (this.rooms == null)
            html += 'Wohnung | ';
        else
            html += this.rooms + ' Zimmer Wohnung | ';

        if (this.showAddress) {
            html += this.addressPreview || CONFIG.na;
            html += ' | ';
        }

        html += this.cityPreview;
        return html;
    }

    /*
      Extracts a potential title image from a
      real estate or null if none was found.
    */
    get titleImage () {
        if (this.anhaenge == null)
            return null;

        if (this.anhaenge.anhang == null)
            return null;

        for (const anhang of this.anhaenge.anhang) {
            if (anhang.gruppe == 'TITELBILD')
                return anhang;
        }

        for (const anhang of this.anhaenge.anhang) {
            if (anhang.gruppe == 'AUSSENANSICHTEN')
                return anhang;
        }

        for (const anhang of this.anhaenge.anhang) {
            if (anhang.gruppe == 'BILD')
                return anhang;
        }

        for (const anhang of this.anhaenge.anhang) {
            if (anhang.gruppe == 'GRUNDRISS')
                return anhang;
        }

        return null;
    }

    get rooms () {
        if (this.flaechen != null && this.flaechen.anzahl_zimmer != null)
            return germanDecimal(this.flaechen.anzahl_zimmer);

        return null;
    }

    get bathrooms () {
        if (this.flaechen != null && this.flaechen.anzahl_badezimmer != null)
            return germanDecimal(this.flaechen.anzahl_badezimmer);

        return null;
    }

    get bedrooms () {
        if (this.flaechen != null && this.flaechen.anzahl_schlafzimmer != null)
            return germanDecimal(this.flaechen.anzahl_schlafzimmer);

        return null;
    }

    get types () {
        if (this.objektkategorie != null && this.objektkategorie.objektart != null) {
            if (this.objektkategorie.objektart.zimmer != null)
                return this.objektkategorie.objektart.zimmer;

            if (this.objektkategorie.objektart.wohnung != null)
                return this.objektkategorie.objektart.wohnung;

            if (this.objektkategorie.objektart.haus != null)
                return this.objektkategorie.objektart.haus;

            if (this.objektkategorie.objektart.grundstueck != null)
                return this.objektkategorie.objektart.grundstueck;

            if (this.objektkategorie.objektart.buero_praxen != null)
                return this.objektkategorie.objektart.buero_praxen;

            if (this.objektkategorie.objektart.einzelhandel != null)
                return this.objektkategorie.objektart.einzelhandel;

            if (this.objektkategorie.objektart.gastgewerbe != null)
                return this.objektkategorie.objektart.gastgewerbe;

            if (this.objektkategorie.objektart.hallen_lager_prod != null)
                return this.objektkategorie.objektart.hallen_lager_prod;

            if (this.objektkategorie.objektart.land_und_forstwirtschaft != null)
                return this.objektkategorie.objektart.land_und_forstwirtschaft;

            if (this.objektkategorie.objektart.parken != null)
                return this.objektkategorie.objektart.parken;

            if (this.objektkategorie.objektart.sonstige != null)
                return this.objektkategorie.objektart.sonstige;

            if (this.objektkategorie.objektart.freizeitimmobilie_gewerblich != null)
                return this.objektkategorie.objektart.freizeitimmobilie_gewerblich;

            if (this.objektkategorie.objektart.zinshaus_renditeobjekt != null)
                return this.objektkategorie.objektart.zinshaus_renditeobjekt;
        }

        return [];
    }

    get type () {
        for (const type of this.types) {
            if (type != null)
                return capitalizeFirstLetter(type);
        }

        return null;
    }

    get gardenUsage () {
        if (this.ausstattung != null && this.ausstattung.gartennutzung != null)
            return this.ausstattung.gartennutzung;

        return null;
    }

    get petsAllowed () {
        if (this.verwaltung_objekt != null && this.verwaltung_objekt.haustiere != null)
            return this.verwaltung_objekt.haustiere;

        return null;
    }

    get area () {
        if (this.flaechen == null)
            return null;

        if (this.flaechen.wohnflaeche == null) {
            if (this.flaechen.nutzflaeche == null) {
                if (this.flaechen.gesamtflaeche == null)
                    return null;

                return this.flaechen.gesamtflaeche;
            }

            return this.flaechen.nutzflaeche;
        }

        return this.flaechen.wohnflaeche;
    }

    get netColdRent () {
        if (this.preise != null && this.preise.nettokaltmiete != null)
            return this.preise.nettokaltmiete;

        return null;
    }

    get coldRent () {
        if (this.preise != null && this.preise.kaltmiete != null)
            return this.preise.kaltmiete;

        return null;
    }

    get warmRent () {
        if (this.preise != null && this.preise.warmmiete != null)
            return this.preise.warmmiete;

        return null;
    }

    get rent () {
        if (this.netColdRent != null && this.netColdRent != '')
            return this.netColdRent;

        if (this.coldRent != null && this.coldRent != '')
            return this.coldRent;

        return null;
    }

    get totaledUpRent () {
        if (this.rent == null)
            return null;

        const operationalCosts = this.operationalCosts || 0;
        const heatingCosts = this.heatingCosts || 0;
        return this.rent + operationalCosts + heatingCosts;
    }

    get totalRent () {
        if (this.preise != null && this.preise.gesamtmietenetto != null)
            return this.preise.gesamtmietenetto;

        return null;
    }

    get cableSatTv () {
        if (this.ausstattung != null)
            return this.ausstattung.kabel_sat_tv;

        return null;
    }

    get builtInKitchen () {
        if (this.ausstattung != null && this.ausstattung.kueche != null)
            return this.ausstattung.kueche.EBK;

        return false;
    }

    get basementRoom () {
        if (this.ausstattung != null)
            return this.ausstattung.unterkellert;

        return null;
    }

    get balconies () {
        if (this.flaechen != null && this.flaechen.anzahl_balkone != null)
            return this.flaechen.anzahl_balkone;

        return 0;
    }

    get terraces () {
        if (this.flaechen != null && this.flaechen.anzahl_terrassen != null)
            return this.flaechen.anzahl_terrassen;

        return 0;
    }

    get shower () {
        if (this.ausstattung != null && this.ausstattung.bad != null)
            return this.ausstattung.bad.DUSCHE;

        return false;
    }

    get bathTub () {
        if (this.ausstattung != null && this.ausstattung.bad != null)
            return this.ausstattung.bad.WANNE;

        return false;
    }

    get bathroomWindow () {
        if (this.ausstattung != null && this.ausstattung.bad != null)
            return this.ausstattung.bad.FENSTER;

        return false;
    }

    get lavatoryDryingRoom () {
        if (this.ausstattung != null)
            return this.ausstattung.wasch_trockenraum;

        return false;
    }

    get barrierFree () {
        if (this.ausstattung != null)
            return this.ausstattung.barrierefrei;

        return false;
    }

    *objectTypes () {
        const objektart = this.objektkategorie.objektart;

        if (objektart.zimmer != null)
            yield 'ZIMMER';

        if (objektart.wohnung != null) {
            yield 'WOHNUNG';
            yield* objektart.wohnung;
        }
    }

    *marketingTypes () {
        const vermarktungsart = this.objektkategorie.vermarktungsart;

        if (vermarktungsart.KAUF)
            yield 'KAUF';

        if (vermarktungsart.MIETE_PACHT)
            yield 'MIETE_PACHT';

        if (vermarktungsart.ERBPACHT)
            yield 'ERBPACHT';

        if (vermarktungsart.LEASING)
            yield 'LEASING';
    }

    get showAddress () {
        if (this.verwaltung_objekt != null && this.verwaltung_objekt.objektadresse_freigeben != null)
            return this.verwaltung_objekt.objektadresse_freigeben;

        return true;
    }

    matchTypes (types) {
        if (types == null)
            return true;

        const ownTypes = new Set(this.objectTypes());

        for (const type of types) {
            if (ownTypes.has(type))
                return true;
        }

        return false;
    }

    matchMarketing (types) {
        if (types == null)
            return true;

        const ownTypes = new Set(this.marketingTypes());

        for (const type of types) {
            if (ownTypes.has(type))
                return true;
        }

        return false;
    }

    get objectId () {
        return this.verwaltung_techn.objektnr_extern;
    }

    attachmentURL (anhang) {
        if (anhang != null)
            return 'https://backend.homeinfo.de/immobrowse/attachment/' + anhang.id;

        return null;
    }

    defaultDetailsURL (baseUrl) {
        if (baseUrl != null)
            return baseUrl + '?real_estate=' + this.id;

        return null;
    }

    get detailsURL () {
        if (CONFIG.exposeURLCallback != null)
            return CONFIG.exposeURLCallback(this.id);

        if (CONFIG.detailsURL != null)
            return this.defaultDetailsURL(CONFIG.detailsURL);

        return this.defaultDetailsURL('expose.html');
    }

    get miscellanea () {
        if (this.freitexte != null && this.freitexte.sonstige_angaben != null && this.freitexte.sonstige_angaben.trim() != '')
            return this.freitexte.sonstige_angaben;

        return null;
    }

    get description () {
        if (this.freitexte != null && this.freitexte.objektbeschreibung != null && this.freitexte.objektbeschreibung.trim() != '')
            return this.freitexte.objektbeschreibung;

        return null;
    }

    get exposure () {
        if (this.freitexte != null && this.freitexte.lage != null && this.freitexte.lage.trim() != '')
            return this.freitexte.lage;

        return null;
    }

    get amenitiesDescription () {
        if (this.freitexte != null && this.freitexte.ausstatt_beschr != null && this.freitexte.ausstatt_beschr.trim() != '')
            return this.freitexte.ausstatt_beschr;

        return null;
    }

    *attachments () {
        if (this.anhaenge != null && this.anhaenge.anhang != null) {
            for (const anhang of this.anhaenge.anhang)
                yield anhang;
        }
    }

    *images () {
        for (const attachment of this.attachments()) {
            if (IMAGE_GROUPS.includes(attachment.gruppe))
                yield attachment;
        }
    }

    *floorplans () {
        for (const attachment of this.attachments()) {
            if (attachment.gruppe == 'GRUNDRISS')
                yield attachment;
        }
    }

    get floorplan () {
        for (const floorplan of this.floorplans())
            return floorplan;

        return null;
    }

    get floor () {
        const ordinal = '. ';
        const dg = 'DG' ? (CONFIG.shortFloorNames) : 'Dachgeschoss';
        const og = 'OG' ? (CONFIG.shortFloorNames) : 'Obergeschoss';
        const eg = 'EG' ? (CONFIG.shortFloorNames) : 'Erdgeschoss';
        const ug = 'UG' ? (CONFIG.shortFloorNames) : 'Untergeschoss';

        if (this.geo != null) {
            if (this.geo.etage != null) {
                if (this.geo.anzahl_etagen != null) {
                    if (this.geo.etage == this.geo.anzahl_etagen)
                        return dg;
                }

                if (this.geo.etage < 0)
                    return -this.geo.etage + ordinal + ug;

                if (this.geo.etage > 0)
                    return this.geo.etage + ordinal + og;

                return eg;
            }
        }

        return null;
    }

    *amenities () {
        if (this.ausstattung != null) {
            if (this.ausstattung.rollstuhlgerecht)
                yield 'Rollstuhlgerecht';

            if (this.ausstattung.stellplatzart != null && this.ausstattung.stellplatzart.FREIPLATZ)
                yield 'Stellplatz';

            if (this.ausstattung.fahrstuhl != null && this.ausstattung.fahrstuhl.PERSONEN)
                yield 'Personenaufzug';

            if (this.ausstattung.gaestewc)
                yield 'Gäste WC';
        }

        if (this.flaechen != null) {
            if (this.flaechen.einliegerwohnung)
                yield 'Einliegerwohnung';
        }

        if (this.lavatoryDryingRoom)
            yield 'Wasch- / Trockenraum';

        if (this.builtInKitchen)
            yield 'Einbauk&uuml;che';

        if (this.shower)
            yield 'Dusche';

        if (this.bathroomWindow)
            yield 'Fenster im Bad';

        if (this.bathTub)
            yield 'Badewanne';

        if (this.cableSatTv)
            yield 'Kabel / Sat. / TV';

        if (this.barrierFree)
            yield 'Barrierefrei';

        if (this.basementRoom)
            yield 'Keller';

        if (this.balconies > 0)
            yield 'Balkon';

        if (this.terraces > 0)
            yield 'Terrasse';

        if (this.petsAllowed)
            yield 'Tierhaltung';

        if (this.gardenUsage)
            yield 'Gartennutzung';
    }

    get serviceCharge () {
        if (this.preise != null && this.preise.nebenkosten != null && this.preise.nebenkosten != '')
            return this.preise.nebenkosten;

        return null;
    }

    get operationalCosts () {
        if (this.preise != null && this.preise.betriebskostennetto != null && this.preise.betriebskostennetto != '')
            return this.preise.betriebskostennetto;

        return null;
    }

    get heatingCosts () {
        if (this.preise != null)
            return this.preise.heizkosten;

        return null;
    }

    get heatingCostsInServiceCharge () {
        if (this.preise != null)
            return this.preise.heizkosten_enthalten;

        return null;
    }

    get securityDeposit () {
        if (this.preise != null)
            return this.preise.kaution;

        return null;
    }

    get provision () {
        if (this.preise != null)
            return this.preise.provisionnetto;

        return null;
    }

    get subjectToCommission () {
        if (this.preise != null)
            return this.preise.provisionspflichtig;

        return null;
    }

    get livingArea () {
        if (this.flaechen != null)
            return this.flaechen.wohnflaeche;

        return null;
    }

    get availableFrom () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.abdatum != null) {
                const date = new Date(this.verwaltung_objekt.abdatum);
                return dateToString(date);
            }

            if (this.verwaltung_objekt.verfuegbar_ab != null)
                return this.verwaltung_objekt.verfuegbar_ab;
        }

        return null;
    }

    get councilFlat () {
        if (this.verwaltung_objekt != null)
            return this.verwaltung_objekt.wbs_sozialwohnung;

        return null;
    }

    get constructionYear () {
        if (this.zustand_angaben != null)
            return this.zustand_angaben.baujahr;

        return null;
    }

    /*
      Returns the real estate's state.
    */
    get state () {
        if (this.zustand_angaben != null) {
            switch (this.zustand_angaben.zustand) {
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

        return null;
    }

    /*
      Returns the last modernization.
    */
    get lastModernization () {
        if (this.zustand_angaben != null)
            return this.zustand_angaben.letztemodernisierung;

        return null;
    }

    *heatingTypes () {
        if (this.ausstattung != null && this.ausstattung.heizungsart != null) {
            if (this.ausstattung.heizungsart.OFEN)
                yield 'Ofen';

            if (this.ausstattung.heizungsart.ETAGE)
                yield 'Etagenheizung';

            if (this.ausstattung.heizungsart.ZENTRAL)
                yield 'Zentralheizung';

            if (this.ausstattung.heizungsart.FERN)
                yield 'Fernwärme';

            if (this.ausstattung.heizungsart.FUSSBODEN)
                yield 'Fussbodenheizung';
        }
    }

    /*
      Returns the heating type.
    */
    get heatingType () {
        const heatingTypes = Array.from(this.heatingTypes());

        if (heatingTypes.length == 0)
            return CONFIG.na;

        return heatingTypes.join(', ');
    }

    /*
      Determines whether the real estate is listed.
    */
    get listed () {
        if (this.verwaltung_objekt != null && this.verwaltung_objekt.denkmalgeschuetzt != null)
            return this.verwaltung_objekt.denkmalgeschuetzt;

        return null;
    }

    /*
      Aggregates energy performance certificate data.
    */
    get energyCertificate () {
        let energiepass;

        try {
            energiepass = this.zustand_angaben.energiepass[0];
        } catch(err) {
            return null;
        }

        const energyCertificate = {};

        if (energiepass.epart == null) {
            energyCertificate.type = 'Nicht angegeben';
        } else if (energiepass.epart == 'VERBRAUCH') {
            energyCertificate.type = 'Verbrauchsausweis';

            if (energiepass.energieverbrauchkennwert != null && energiepass.energieverbrauchkennwert != '') {
                const energieverbrauchkennwert = Number(energiepass.energieverbrauchkennwert.replace(',', '.'));
                const consumption = germanDecimal(energieverbrauchkennwert) + CONFIG.kwh;
                energyCertificate.value = consumption;
                energyCertificate.consumption = consumption;
            }
        } else {
            energyCertificate.type = 'Bedarfsausweis';

            if (energiepass.endenergiebedarf != null && energiepass.endenergiebedarf != '') {
                const endenergiebedarf = Number(energiepass.endenergiebedarf.replace(',', '.'));
                const demand = germanDecimal(endenergiebedarf) + CONFIG.kwh;
                energyCertificate.value = demand;
                energyCertificate.demand = demand;
            }
        }

        if (energiepass.baujahr != null && energiepass.baujahr != '') {
            energyCertificate.constructionYear = energiepass.baujahr;
        } else {
            // Fall back to real estate's construction year.
            if (this.constructionYear) {
                energyCertificate.constructionYear = this.constructionYear;
            }
        }

        if (energiepass.primaerenergietraeger != null)
            energyCertificate.primaryEnergyCarrier = translatePrimaerenergietraeger(energiepass.primaerenergietraeger);

        if (energiepass.wertklasse != null && energiepass.wertklasse != '')
            energyCertificate.valueClass = energiepass.wertklasse;

        return energyCertificate;
    }

    get contact () {
        if (this.kontaktperson == null)
            return null;

        const contact = {};
        const name = [];
        const address = [];

        if (this.kontaktperson.anrede != null) {
            contact.salutation = this.kontaktperson.anrede;
            name.push(contact.salutation);
        }

        if (this.kontaktperson.vorname != null) {
            contact.firstName = this.kontaktperson.vorname;
            name.push(contact.firstName);
        }

        contact.lastName = this.kontaktperson.name;
        name.push(contact.lastName);
        contact.name = name.join(' ');

        if (this.kontaktperson.firma != null)
            contact.company = this.kontaktperson.firma;

        if (this.kontaktperson.strasse != null)
            contact.street = this.kontaktperson.strasse;

        if (this.kontaktperson.hausnummer != null)
            contact.houseNumber = this.kontaktperson.hausnummer;

        if (this.kontaktperson.strasse != null && this.kontaktperson.hausnummer != null) {
            contact.streetAndHouseNumber = this.kontaktperson.strasse + ' ' + this.kontaktperson.hausnummer;
            address.push(contact.streetAndHouseNumber);
        }

        if (this.kontaktperson.plz != null)
            contact.zipCode = this.kontaktperson.plz;

        if (this.kontaktperson.ort != null)
            contact.city = this.kontaktperson.ort;

        if (this.kontaktperson.plz != null && this.kontaktperson.ort != null) {
            contact.zipCodeAndCity = this.kontaktperson.plz + ' ' + this.kontaktperson.ort;
            address.push(contact.zipCodeAndCity);
        }

        if (address.length > 0)
            contact.address = address.join(', ');

        if (this.kontaktperson.email_direkt != null)
            contact.email = this.kontaktperson.email_direkt;
        else if (this.kontaktperson.email_zentrale != null)
            contact.email = this.kontaktperson.email_zentrale;

        if (this.kontaktperson.tel_durchw != null)
            contact.phone = this.kontaktperson.tel_durchw;
        else if (this.kontaktperson.tel_zentrale != null)
            contact.phone = this.kontaktperson.tel_zentrale;

        if (this.kontaktperson.url != null)
            contact.website = this.kontaktperson.url;

        return contact;
    }

    *amenitiesTags () {
        for (const amenity of this.amenities())
            yield new AmenitiesTag(amenity);
    }

    get amenitiesList () {
        const amenities = Array.from(this.amenities());

        if (amenities.length > 0) {
            const ul = document.createElement('ul');
            ul.setAttribute('class', 'ib-amenities-list');

            for (const amenity of amenities) {
                const li = document.createElement('li');
                li.textContent = amenity;
                ul.appendChild(li);
            }

            return ul.outerHTML;
        }

        return '–';
    }

    renderEnergyCertificate (elements) {
        if (elements != null) {
            const energyCertificate = this.energyCertificate;

            if (energyCertificate != null) {
                setValue(elements.constructionYear, energyCertificate.constructionYear);
                setValue(elements.type, energyCertificate.type);
                setValue(elements.demand, energyCertificate.demand);
                setValue(elements.consumption, energyCertificate.consumption);
                setValue(elements.primaryEnergyCarrier, energyCertificate.primaryEnergyCarrier);
                setValue(elements.valueClass, energyCertificate.valueClass);
            } else {
                setValue(elements.constructionYear, null);
                setValue(elements.type, null);
                setValue(elements.demand, null);
                setValue(elements.consumption, null);
                setValue(elements.primaryEnergyCarrier, null);
                setValue(elements.valueClass, null);
            }
        }
    }

    renderContact (elements) {
        if (elements != null) {
            const contact = this.contact;

            if (contact != null) {
                setValue(elements.salutation, contact.salutation);
                setValue(elements.firstName, contact.firstName);
                setValue(elements.lastName, contact.lastName);
                setValue(elements.name, contact.name);
                setValue(elements.company, contact.company);
                setValue(elements.street, contact.street);
                setValue(elements.houseNumber, contact.houseNumber);
                setValue(elements.streetAndHouseNumber, contact.streetAndHouseNumber);
                setValue(elements.zipCode, contact.zipCode);
                setValue(elements.city, contact.city);
                setValue(elements.zipCodeAndCity, contact.zipCodeAndCity);
                setValue(elements.address, contact.address);
                setValue(elements.phone, contact.phone);
                setValue(elements.website, contact.website);
            } else {
                setValue(elements.salutation, null);
                setValue(elements.firstName, null);
                setValue(elements.lastName, null);
                setValue(elements.name, null);
                setValue(elements.company, null);
                setValue(elements.street, null);
                setValue(elements.houseNumber, null);
                setValue(elements.streetAndHouseNumber, null);
                setValue(elements.zipCode, null);
                setValue(elements.city, null);
                setValue(elements.zipCodeAndCity, null);
                setValue(elements.address, null);
                setValue(elements.phone, null);
                setValue(elements.website, null);

                if (elements.container != null)
                    elements.container.hide();

                if (elements.button != null)
                    elements.button.attr('disabled', true);
            }
        }
    }

    renderImage (element, image) {
        if (element != null) {
            if (image != null) {
                if (element.image != null) {
                    element.image.attr('src', this.attachmentURL(image));
                    element.caption.html(image.anhangtitel);
                } else {
                    element.attr('src', this.attachmentURL(image));
                }
            }
        }
    }

    /*
      Renders the real estate data into the specified elements.
      All elements are optional.
    */
    render (elements) {
        // Miscellaneous.
        setValue(elements.objectId, this.objectId);
        setValue(elements.objectTitle, this.objectTitle);

        if (this.showAddress)
            setValue(elements.address, this.address);

        setValue(elements.objectTitle, this.objectTitle);
        setValue(elements.type, this.type);
        // Prices.
        setValue(elements.coldRent, euros(this.rent) ? this.rent : null);
        setValue(elements.warmRent, euros(this.warmRent) ? this.warmRent : null);
        setValue(elements.totaledUpRent, euros(this.totaledUpRent) ? this.totaledUpRent : null);
        setValue(elements.totalRent, euros(this.totalRent) ? this.totalRent : null);
        setValue(elements.serviceCharge, euros(this.serviceCharge) ? this.serviceCharge : null);
        setValue(elements.operationalCosts, euros(this.operationalCosts) ? this.operationalCosts : null);
        setValue(elements.heatingCosts, euros(this.heatingCosts) ? this.heatingCosts : null);
        setValue(elements.heatingCostsInServiceCharge, yesNoNull(this.heatingCostsInServiceCharge));
        setValue(elements.securityDeposit, euros(this.securityDeposit) ? this.securityDeposit : null);
        setValue(elements.provision, euros(this.provision) ? this.provision : null);
        setValue(elements.subjectToCommission, yesNoNull(this.subjectToCommission));
        // Areas.
        setValue(elements.livingArea, squareMeters(this.livingArea));
        setValue(elements.rooms, this.rooms);
        setValue(elements.bathrooms, this.bathrooms);
        setValue(elements.bedrooms, this.bedrooms);
        setValue(elements.floor, this.floor);
        // Amenities and state.
        setValue(elements.petsAllowed, yesNoNull(this.petsAllowed));
        setValue(elements.gardenUsage, yesNoNull(this.gardenUsage));
        setValue(elements.availableFrom, this.availableFrom);
        setValue(elements.councilFlat, yesNoNull(this.councilFlat));
        setValue(elements.constructionYear, this.constructionYear);
        setValue(elements.state, this.state);
        setValue(elements.lastModernization, this.lastModernization);
        setValue(elements.heatingType, this.heatingType);
        this.renderEnergyCertificate(elements.energyCertificate);
        // Description texts.
        setValue(elements.description, this.description);
        setValue(elements.exposure, this.exposure);
        setValue(elements.amenities, this.amenitiesDescription);
        setValue(elements.miscellanea, this.miscellanea);
        this.renderContact(elements.contact);
        setValue(elements.amenitiesList, this.amenitiesList);
        this.renderImage(elements.titleImage, this.titleImage);
        this.renderImage(elements.floorplan, this.floorplan);

        if (this.listed)
            setValue(elements.listedHint, CONFIG.listedHint);
    }

    /*
      Returns a list of data fields.
    */
    dataFields (elements) {
        elements = elements || DEFAULT_ELEMENTS;
        const dataFields = [];

        for (const element of elements) {
            switch (element.name) {
            case 'coldRent':
                addDataFieldCol(element, euros(this.rent) ? this.rent : CONFIG.na, dataFields);
                break;
            case 'totalRent':
                addDataFieldCol(element, euros(this.totalRent) ? this.totalRent : CONFIG.na, dataFields);
                break;
            case 'serviceCharge':
                addDataFieldCol(element, euros(this.serviceCharge) ? this.serviceCharge : CONFIG.na, dataFields);
                break;
            case 'operationalCosts':
                addDataFieldCol(element, euros(this.operationalCosts) ? this.operationalCosts : CONFIG.na, dataFields);
                break;
            case 'rooms':
                addDataFieldCol(element, this.rooms || CONFIG.na, dataFields);
                break;
            case 'area':
                addDataFieldCol(element, this.area || CONFIG.na, dataFields);
                break;
            }
        }

        return dataFields;
    }
}


/*
  Real estate list class.
*/
export class List {
    constructor (realEstates) {
        this.realEstates = Array.from(realEstates);
    }

    /*
      Sorts real estates.
    */
    sort (property, order) {
        this.realEstates.sort(getSorter(property, order));
    }

    /*
      Renders the respective real estates into the given HTML element.
    */
    render (listElement, elements) {
        listElement.html('');  // Clear element.

        for (const realEstate of this.realEstates) {
            const preview = preview(realEstate, elements);
            listElement.append(preview);
        }
    }
}
