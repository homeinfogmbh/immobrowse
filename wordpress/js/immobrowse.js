/*
  immobrowse.js - ImmoBrowse JavaScript library.

  (C) 2017-2020 HOMEINFO - Digitale Informationssysteme GmbH

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

  Requires:
    * homeinfo.js
    * jquery.js
    * sweetalert.js
*/
'use strict';

var immobrowse = immobrowse || {};

immobrowse.IMAGE_GROUPS = ['TITELBILD', 'BILD', 'AUSSENANSICHTEN', 'INNENANSICHTEN', 'ANBIETERLOGO'];


/*
  Sets a value onto the respective element configuration.
*/
immobrowse.setValue = function (element, value) {
    if (element != null) {
        if (value == null) {
            if (element.container == undefined) {
                element.html(immobrowse.config.na);
            } else {
                element.value.html(immobrowse.config.na);
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
};


/*
  Compares two nullable values so that
  null values always come out last.
*/
immobrowse.compare = function (alice, bob, descending) {
    if (alice == null) {
        if (bob == null) {
            return 0;
        }

        return Infinity;
    }

    if (bob == null) {
        return -Infinity;
    }

    let val = 0;

    if (alice < bob) {
        val = -1;
    } else if (bob < alice) {
        val = 1;
    }

    if (descending) {
        val = -val;
    }

    return val;
};


/*
  Returns an appropriate sorting function.
*/
immobrowse.getSorter = function (property, order) {
    let descending = false;

    if (order == 'descending') {
        descending = true;
    }

    switch(property) {
    case 'rooms': return immobrowse.sortByRooms(descending);
    case 'area': return immobrowse.sortByArea(descending);
    case 'rent': return immobrowse.sortByRent(descending);
    case 'street': return immobrowse.sortByStreet(descending);
    default: throw 'Invalid sorting property: ' + property;
    }
};


/*
  Returns comparison for rooms.
*/
immobrowse.sortByRooms = function (descending) {
    return function (immobilie1, immobilie2) {
        return immobrowse.compare(immobilie1.rooms, immobilie2.rooms, descending);
    };
};


/*
  Returns comparison for area.
*/
immobrowse.sortByArea = function (descending) {
    return function (immobilie1, immobilie2) {
        return immobrowse.compare(immobilie1.area, immobilie2.area, descending);
    };
};


/*
  Returns comparison for rent.
*/
immobrowse.sortByRent = function (descending) {
    return function (immobilie1, immobilie2) {
        return immobrowse.compare(immobilie1.rent, immobilie2.rent, descending);
    };
};


/*
  Returns comparison for streets.
*/
immobrowse.sortByStreet = function (descending) {
    return function (immobilie1, immobilie2) {
        return immobrowse.compare(immobilie1.street, immobilie2.street, descending);
    };
};


/*
  Returns a decimal number with German (comma) interpuctuation.
*/
immobrowse.germanDecimal = function (number, decimals) {
    if (number != null) {
        if (decimals == null) {
            decimals = 2;
        }

        return number.toFixed(decimals).replace('.', ',');
    }

    return null;
};


/*
  Formats the respective number as EUR currency.
*/
immobrowse.euro = function (price) {
    if (price != null) {
        return immobrowse.germanDecimal(price) + ' &euro;';
    }

    return null;
};


/*
  Formats the respective number as square meters.
*/
immobrowse.squareMeters = function (area) {
    if (area != null) {
        return immobrowse.germanDecimal(area) + ' m&sup2;';
    }

    return null;
};


/*
  Converts a boolean value to "Ja", respectively "Nein".
*/
immobrowse.yesNo = function (boolean) {
    if (boolean == null) {
        return null;
    }

    if (boolean == true) {
        return 'Ja';
    }

    return 'Nein';
};


/*
  Returns a list of cities from the provided real estates.
*/
immobrowse.cities = function (realEstates) {
    const cities = [];

    for (const realEstate of realEstates) {
        const city = realEstate.geo.ort;

        if (city != null) {
            if (cities[city] != undefined) {
                cities[city] += 1;
            } else {
                cities[city] = 1;
            }
        }
    }

    return cities;
};


/*
  Returns a list of districts from the provided real estates.
*/
immobrowse.districts = function (realEstates) {
    const districts = [];

    for (const realEstate of realEstates) {
        const district = realEstate.district;

        if (district != null) {
            if (districts[district] == undefined) {
                districts[district] = 1;
            } else {
                districts[district] += 1;
            }
        }
    }

    return districts;
};


/*
  Returns a list of district elements for rendering.
*/
immobrowse.districtElements = function* (realEstates) {
    const districts = immobrowse.districts(realEstates);

    for (const district in districts) {
        if (Object.prototype.hasOwnProperty.call(districts, district)) {
            const inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'checkbox');
            inputElement.setAttribute('class', 'ib-select-district');
            inputElement.setAttribute('name', district);
            yield inputElement;
            yield document.createTextNode(' ' + district + ' (' + districts[district] + ')');
            yield document.createElement('br');
        }
    }
};


/*
  Opens the respective URL.
*/
immobrowse.open = function (url) {
    window.open(url, '_self');
};


/*
  Mailer class.
*/
immobrowse.Mailer = class {
    constructor (config, html, successMsg, errorMsg) {
        this.baseUrl = 'https://hisecon.homeinfo.de';
        this.config = config;

        if (html == null) {
            this.html = true;
        } else {
            this.html = html;
        }

        if (successMsg == null) {
            this.successMsg = 'Anfrage versendet!';
        } else {
            this.successMsg = successMsg;
        }

        if (errorMsg == null) {
            this.errorMsg = 'Fehler beim Versenden!\nBitte versuchen Sie es später noch ein Mal.';
        } else {
            this.errorMsg = errorMsg;
        }
    }

    /*
      Returns the respective URL for the Ajax call.
    */
    _getUrl (response, subject, recipient, reply_to) {
        let url = this.baseUrl + '?config=' + this.config;

        if (response) {
            url += '&response=' + response;
        }

        if (subject) {
            url += '&subject=' + subject;
        }

        if (recipient) {
            url += '&recipient=' + recipient;
        }

        if (reply_to) {
            url += '&reply_to=' + reply_to;
        }

        if (this.html) {
            url += '&html=true';
        }

        return url;
    }

    /*
      Returns the respective Ajax call object.
    */
    _getAjax (url, body) {
        const successMsg = this.successMsg;
        const errorMsg = this.errorMsg;

        return {
            url: url,
            type: 'POST',
            data: body,
            cache: false,
            success: function () {
                alert(successMsg);
            },
            error: function () {
                alert(errorMsg);
            }
        };
    }

    /*
      Sends the respective emails.
    */
    send (response, subject, body, recipient, reply_to) {
        const url = this._getUrl(response, subject, recipient, reply_to);
        const ajaxQuery = this._getAjax(url, body);
        return jQuery.ajax(ajaxQuery);
    }
};


/*
  Matches real estates for filtering.
*/
immobrowse.Filter = class {
    constructor (rules) {
        this.rules = rules || {};
    }

    /*
      Match filters on a real estate's JSON data.
    */
    match (realEstate) {
        if (this.rules.priceMin > realEstate.rent) {
            return false;
        }

        if (this.rules.priceMax < realEstate.rent) {
            return false;
        }

        if (this.rules.areaMin != null) {
            if (realEstate.flaechen == null) {
                return false;
            } else if (this.rules.areaMin > realEstate.flaechen.wohnflaeche) {
                return false;
            }
        }

        if (this.rules.roomsMin != null) {
            if (realEstate.flaechen == null) {
                return false;
            } else if (this.rules.roomsMin > realEstate.flaechen.anzahl_zimmer) {
                return false;
            }
        }

        if (this.rules.ebk) {
            if (realEstate.ausstattung == null) {
                return false;
            } else if (realEstate.ausstattung.kueche == null) {
                return false;
            } else if (! realEstate.ausstattung.kueche.EBK) {
                return false;
            }
        }

        if (this.rules.bathtub) {
            if (realEstate.ausstattung == null) {
                return false;
            } else if (realEstate.ausstattung.bad == null) {
                return false;
            } else if (! realEstate.ausstattung.bad.WANNE) {
                return false;
            }
        }

        if (this.rules.window) {
            if (realEstate.ausstattung == null) {
                return false;
            } else if (realEstate.ausstattung.bad == null) {
                return false;
            } else if (! realEstate.ausstattung.bad.FENSTER) {
                return false;
            }
        }

        if (this.rules.guestwc) {
            if (realEstate.ausstattung == null) {
                return false;
            } else if (! realEstate.ausstattung.gaestewc) {
                return false;
            }
        }

        if (this.rules.carSpace) {
            if (realEstate.ausstattung == null) {
                return false;
            } else if (realEstate.ausstattung.stellplatzart == null) {
                return false;
            } else if (! realEstate.ausstattung.stellplatzart.TIEFGARAGE) {
                return false;
            }
        }

        if (this.rules.elevator) {
            if (realEstate.ausstattung == null) {
                return false;
            } else if (realEstate.ausstattung.fahrstuhl == null) {
                return false;
            } else if (! realEstate.ausstattung.fahrstuhl.PERSONEN) {
                return false;
            }
        }

        if (this.rules.garden) {
            if (realEstate.ausstattung == null) {
                return false;
            } else if (! realEstate.ausstattung.gartennutzung) {
                return false;
            }
        }

        if (this.rules.balcony) {
            if (realEstate.flaechen == null) {
                return false;
            } else if (realEstate.flaechen.anzahl_balkone == null || realEstate.flaechen.anzahl_balkone == 0) {
                return false;
            }
        }

        if (this.rules.districts != null) {
            if (this.rules.districts.length > 0) {
                if (this.rules.districts.indexOf(realEstate.district) < 0) {
                    return false;
                }
            }
        }

        return true;
    }

    /*
      Filters a list of real estates.
    */
    *filter (realEstates) {
        for (const realEstate of realEstates) {
            if (this.match(realEstate)) {
                yield realEstate;
            }
        }
    }
};


/*
  Real estate wrapper class.
*/
immobrowse.RealEstate = class {
    constructor (json) {
        this._defaultElements = [
            {'name': 'coldRent', 'caption': 'Kaltmiete'},
            {'name': 'serviceCharge', 'caption': 'Nebenkosten'},
            {'name': 'rooms', 'caption': 'Zimmer'},
            {'name': 'area', 'caption': 'Fläche ca.'}
        ];

        for (const prop in json) {
            if (Object.prototype.hasOwnProperty.call(json, prop)) {
                this[prop] = json[prop];
            }
        }
    }

    /*
      Queries real estate data from the API and returns a thenable.
    */
    static get (id) {
        const cls = this;
        return jQuery.ajax({
            url: 'https://backend.homeinfo.de/immobrowse/expose/' + id
        }).then(
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
        return jQuery.ajax({
            url: 'https://backend.homeinfo.de/immobrowse/list/' + cid
        }).then(
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
        if (this.geo != null) {
            if (this.geo.strasse != null) {
                return this.geo.strasse;
            }
        }

        return null;
    }

    get houseNumber () {
        if (this.geo != null) {
            if (this.geo.hausnummer != null) {
                return this.geo.hausnummer;
            }
        }

        return null;
    }

    get zipCode () {
        if (this.geo != null) {
            if (this.geo.plz != null) {
                return this.geo.plz;
            }
        }

        return null;
    }

    get city () {
        if (this.geo != null) {
            if (this.geo.ort != null) {
                return this.geo.ort;
            }
        }

        return null;
    }

    get district () {
        if (this.geo != null) {
            if (this.geo.regionaler_zusatz != null) {
                return this.geo.regionaler_zusatz;
            }
        }

        return null;
    }

    get streetAndHouseNumber () {
        const street = this.street;
        const houseNumber = this.houseNumber;
        const streetAndHouseNumber = [];

        if (street) {
            streetAndHouseNumber.push(street);
        }

        if (houseNumber) {
            streetAndHouseNumber.push(houseNumber);
        }

        if (streetAndHouseNumber.length > 0) {
            return streetAndHouseNumber.join(' ');
        }

        return null;
    }

    get zipCodeAndCity () {
        const zipCode = this.zipCode;
        const city = this.city;
        const district = this.district;
        const zipCodeAndCity = [];

        if (zipCode) {
            zipCodeAndCity.push(zipCode);
        }

        if (city) {
            zipCodeAndCity.push(city);
        }

        if (district && district != city) {
            zipCodeAndCity.push(district);
        }

        if (zipCodeAndCity.length > 0) {
            return zipCodeAndCity.join(' ');
        }

        return null;
    }

    get address () {
        const streetAndHouseNumber = this.streetAndHouseNumber;
        const zipCodeAndCity = this.zipCodeAndCity;
        const address = [];

        if (streetAndHouseNumber) {
            address.push(streetAndHouseNumber);
        }

        if (zipCodeAndCity) {
            address.push(zipCodeAndCity);
        }

        if (address.length > 0) {
            return address.join(', ');
        }

        return null;
    }

    get addressPreview () {
        if (this.geo != null) {
            if (this.geo.strasse != null) {
                if (this.geo.hausnummer == null) {
                    return this.geo.strasse;
                } else {
                    return this.geo.strasse + ' ' + this.geo.hausnummer;
                }
            }
        }

        return null;
    }

    get cityPreview () {
        if (this.geo == null) {
            return 'N/A';
        } else {
            if (this.geo.ort == null) {
                return 'N/A';
            } else {
                if (this.geo.regionaler_zusatz == null || this.geo.regionaler_zusatz == this.geo.ort) {
                    return this.geo.ort;
                } else {
                    return this.geo.ort + ' ' + this.geo.regionaler_zusatz;
                }
            }
        }
    }

    get objectTitle () {
        if (this.freitexte != null) {
            if (this.freitexte.objekttitel != null) {
                return this.freitexte.objekttitel;
            }
        }

        let html = '';

        if (this.rooms == null) {
            html += 'Wohnung | ';
        } else {
            html += this.rooms + ' Zimmer Wohnung | ';
        }

        if (this.showAddress) {
            html += this.addressPreview || 'N/A';
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
        if (this.anhaenge == null) {
            return null;
        }

        if (this.anhaenge.anhang == null) {
            return null;
        }

        for (const anhang of this.anhaenge.anhang) {
            if (anhang.gruppe == 'TITELBILD') {
                return anhang;
            }
        }

        for (const anhang of this.anhaenge.anhang) {
            if (anhang.gruppe == 'AUSSENANSICHTEN') {
                return anhang;
            }
        }

        for (const anhang of this.anhaenge.anhang) {
            if (anhang.gruppe == 'BILD') {
                return anhang;
            }
        }

        for (const anhang of this.anhaenge.anhang) {
            if (anhang.gruppe == 'GRUNDRISS') {
                return anhang;
            }
        }

        return null;
    }

    get rooms () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_zimmer != null) {
                return immobrowse.germanDecimal(this.flaechen.anzahl_zimmer);
            }
        }

        return null;
    }

    get bathrooms () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_badezimmer != null) {
                return immobrowse.germanDecimal(this.flaechen.anzahl_badezimmer);
            }
        }

        return null;
    }

    get bedrooms () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_schlafzimmer != null) {
                return immobrowse.germanDecimal(this.flaechen.anzahl_schlafzimmer);
            }
        }

        return null;
    }

    get types () {
        if (this.objektkategorie != null) {
            if (this.objektkategorie.objektart != null) {
                if (this.objektkategorie.objektart.zimmer != null) {
                    return this.objektkategorie.objektart.zimmer;
                } else if (this.objektkategorie.objektart.wohnung != null) {
                    return this.objektkategorie.objektart.wohnung;
                } else if (this.objektkategorie.objektart.haus != null) {
                    return this.objektkategorie.objektart.haus;
                } else if (this.objektkategorie.objektart.grundstueck != null) {
                    return this.objektkategorie.objektart.grundstueck;
                } else if (this.objektkategorie.objektart.buero_praxen != null) {
                    return this.objektkategorie.objektart.buero_praxen;
                } else if (this.objektkategorie.objektart.einzelhandel != null) {
                    return this.objektkategorie.objektart.einzelhandel;
                } else if (this.objektkategorie.objektart.gastgewerbe != null) {
                    return this.objektkategorie.objektart.gastgewerbe;
                } else if (this.objektkategorie.objektart.hallen_lager_prod != null) {
                    return this.objektkategorie.objektart.hallen_lager_prod;
                } else if (this.objektkategorie.objektart.land_und_forstwirtschaft != null) {
                    return this.objektkategorie.objektart.land_und_forstwirtschaft;
                } else if (this.objektkategorie.objektart.parken != null) {
                    return this.objektkategorie.objektart.parken;
                } else if (this.objektkategorie.objektart.sonstige != null) {
                    return this.objektkategorie.objektart.sonstige;
                } else if (this.objektkategorie.objektart.freizeitimmobilie_gewerblich != null) {
                    return this.objektkategorie.objektart.freizeitimmobilie_gewerblich;
                } else if (this.objektkategorie.objektart.zinshaus_renditeobjekt != null) {
                    return this.objektkategorie.objektart.zinshaus_renditeobjekt;
                }
            }
        }

        return [];
    }

    get type () {
        for (let type of this.types) {
            if (type != null) {
                type = type.toLowerCase();
                return homeinfo.str.capitalizeFirstLetter(type);
            }
        }

        return null;
    }

    get gardenUsage () {
        if (this.ausstattung != null) {
            if (this.ausstattung.gartennutzung != null) {
                return this.ausstattung.gartennutzung;
            }
        }

        return null;
    }

    get petsAllowed () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.haustiere != null) {
                return this.verwaltung_objekt.haustiere;
            }
        }

        return null;
    }

    get area () {
        if (this.flaechen == null) {
            return null;
        }

        if (this.flaechen.wohnflaeche == null) {
            if (this.flaechen.nutzflaeche == null) {
                if (this.flaechen.gesamtflaeche == null) {
                    return null;
                }

                return this.flaechen.gesamtflaeche;
            }

            return this.flaechen.nutzflaeche;
        }

        return this.flaechen.wohnflaeche;
    }

    get netColdRent () {
        if (this.preise != null) {
            if (this.preise.nettokaltmiete != null) {
                return this.preise.nettokaltmiete;
            }
        }

        return null;
    }

    get coldRent () {
        if (this.preise != null) {
            if (this.preise.kaltmiete != null) {
                return this.preise.kaltmiete;
            }
        }

        return null;
    }

    get warmRent () {
        if (this.preise != null) {
            if (this.preise.warmmiete != null) {
                return this.preise.warmmiete;
            }
        }

        return null;
    }

    get rent () {
        if (this.netColdRent != null && this.netColdRent != '') {
            return this.netColdRent;
        } else if (this.coldRent != null && this.coldRent != '') {
            return this.coldRent;
        }

        return null;
    }

    get totaledUpRent () {
        if (this.rent == null) {
            return null;
        }

        const operationalCosts = this.operationalCosts || 0;
        const heatingCosts = this.heatingCosts || 0;
        return this.rent + operationalCosts + heatingCosts;
    }

    get totalRent () {
        if (this.preise != null) {
            if (this.preise.gesamtmietenetto != null) {
                return this.preise.gesamtmietenetto;
            }
        }

        return null;
    }

    get cableSatTv () {
        if (this.ausstattung != null) {
            return this.ausstattung.kabel_sat_tv;
        }

        return null;
    }

    get builtInKitchen () {
        if (this.ausstattung != null) {
            if (this.ausstattung.kueche != null) {
                return this.ausstattung.kueche.EBK;
            }
        }

        return false;
    }

    get basementRoom () {
        if (this.ausstattung != null) {
            return this.ausstattung.unterkellert;
        }

        return null;
    }

    get balconies () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_balkone != null) {
                return this.flaechen.anzahl_balkone;
            }
        }

        return 0;
    }

    get terraces () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_terrassen != null) {
                return this.flaechen.anzahl_terrassen;
            }
        }

        return 0;
    }

    get shower () {
        if (this.ausstattung != null) {
            if (this.ausstattung.bad != null) {
                return this.ausstattung.bad.DUSCHE;
            }
        }

        return false;
    }

    get bathTub () {
        if (this.ausstattung != null) {
            if (this.ausstattung.bad != null) {
                return this.ausstattung.bad.WANNE;
            }
        }

        return false;
    }

    get bathroomWindow () {
        if (this.ausstattung != null) {
            if (this.ausstattung.bad != null) {
                return this.ausstattung.bad.FENSTER;
            }
        }

        return false;
    }

    get lavatoryDryingRoom () {
        if (this.ausstattung != null) {
            return this.ausstattung.wasch_trockenraum;
        }

        return false;
    }

    get barrierFree () {
        if (this.ausstattung != null) {
            return this.ausstattung.barrierefrei;
        }

        return false;
    }

    *_objectTypes () {
        const objektart = this.objektkategorie.objektart;

        if (objektart.zimmer != null) {
            yield 'ZIMMER';
        }

        if (objektart.wohnung != null) {
            yield 'WOHNUNG';
            yield* objektart.wohnung;
        }
    }

    get objectTypes () {
        return this._objectTypes();
    }

    *_marketingTypes () {
        const vermarktungsart = this.objektkategorie.vermarktungsart;

        if (vermarktungsart.KAUF) {
            yield 'KAUF';
        }

        if (vermarktungsart.MIETE_PACHT) {
            yield 'MIETE_PACHT';
        }

        if (vermarktungsart.ERBPACHT) {
            yield 'ERBPACHT';
        }

        if (vermarktungsart.LEASING) {
            yield 'LEASING';
        }
    }

    get marketingTypes () {
        return this._marketingTypes();
    }

    get showAddress () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.objektadresse_freigeben != null) {
                return this.verwaltung_objekt.objektadresse_freigeben;
            }
        }

        return true;
    }

    translatePrimaerenergietraeger (primaerenergietraeger) {
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
    }

    matchTypes (types) {
        if (types == null) {
            return true;
        }

        const ownTypes = new Set(this.objectTypes);

        for (const type of types) {
            if (ownTypes.has(type)) {
                return true;
            }
        }

        return false;
    }

    matchMarketing (types) {
        if (types == null) {
            return true;
        }

        const ownTypes = new Set(this.marketingTypes);

        for (const type of types) {
            if (ownTypes.has(type)) {
                return true;
            }
        }

        return false;
    }

    get objectId () {
        return this.verwaltung_techn.objektnr_extern;
    }

    attachmentURL (anhang) {
        if (anhang != null) {
            return 'https://backend.homeinfo.de/immobrowse/attachment/' + anhang.id;
        }

        return null;
    }

    defaultDetailsURL (baseUrl) {
        if (baseUrl != null) {
            return baseUrl + '?real_estate=' + this.id;
        }

        return null;
    }

    get detailsURL () {
        if (immobrowse.config.exposeURLCallback != null) {
            return immobrowse.config.exposeURLCallback(this.id);
        }

        if (immobrowse.config.detailsURL != null) {
            return this.defaultDetailsURL(immobrowse.config.detailsURL);
        }

        return this.defaultDetailsURL('expose.html');
    }

    get miscellanea () {
        if (this.freitexte != null) {
            if (! homeinfo.str.isEmpty(this.freitexte.sonstige_angaben)) {
                return this.freitexte.sonstige_angaben;
            }
        }

        return null;
    }

    get description () {
        if (this.freitexte != null) {
            if (! homeinfo.str.isEmpty(this.freitexte.objektbeschreibung)) {
                return this.freitexte.objektbeschreibung;
            }
        }

        return null;
    }

    get exposure () {
        if (this.freitexte != null) {
            if (! homeinfo.str.isEmpty(this.freitexte.lage)) {
                return this.freitexte.lage;
            }
        }

        return null;
    }

    get amenitiesDescription () {
        if (this.freitexte != null) {
            if (! homeinfo.str.isEmpty(this.freitexte.ausstatt_beschr)) {
                return this.freitexte.ausstatt_beschr;
            }
        }

        return null;
    }

    *_attachments () {
        if (this.anhaenge != null) {
            if (this.anhaenge.anhang != null) {
                for (const anhang of this.anhaenge.anhang) {
                    yield anhang;
                }
            }
        }
    }

    get attachments () {
        return this._attachments();
    }

    *_images () {
        for (const attachment of this.attachments) {
            if (immobrowse.IMAGE_GROUPS.includes(attachment.gruppe)) {
                yield attachment;
            }
        }
    }

    get images () {
        return this._images();
    }

    *_floorplans () {
        for (const attachment of this.attachments) {
            if (attachment.gruppe == 'GRUNDRISS') {
                yield attachment;
            }
        }
    }

    get floorplans () {
        return this._floorplans();
    }

    get floorplan () {
        for (const floorplan of this.floorplans) {
            return floorplan;
        }

        return null;
    }

    get floor () {
        const ordinal = '. ';
        let dg = 'Dachgeschoss';
        let og = 'Obergeschoss';
        let eg = 'Erdgeschoss';
        let ug = 'Untergeschoss';

        if (immobrowse.config.shortFloorNames) {
            dg = 'DG';
            og = 'OG';
            eg = 'EG';
            ug = 'UG';
        }

        if (this.geo != null) {
            if (this.geo.etage != null) {
                if (this.geo.anzahl_etagen != null) {
                    if (this.geo.etage == this.geo.anzahl_etagen) {
                        return dg;
                    }
                }

                if (this.geo.etage < 0) {
                    return -this.geo.etage + ordinal + ug;
                }

                if (this.geo.etage > 0) {
                    return this.geo.etage + ordinal + og;
                }

                return eg;
            }
        }

        return null;
    }

    *_amenities () {
        if (this.ausstattung != null) {
            if (this.ausstattung.rollstuhlgerecht) {
                yield 'Rollstuhlgerecht';
            }

            if (this.ausstattung.stellplatzart != null) {
                if (this.ausstattung.stellplatzart.FREIPLATZ) {
                    yield 'Stellplatz';
                }
            }

            if (this.ausstattung.fahrstuhl != null) {
                if (this.ausstattung.fahrstuhl.PERSONEN) {
                    yield 'Personenaufzug';
                }
            }

            if (this.ausstattung.gaestewc) {
                yield 'Gäste WC';
            }
        }

        if (this.flaechen != null) {
            if (this.flaechen.einliegerwohnung) {
                yield 'Einliegerwohnung';
            }
        }

        if (this.lavatoryDryingRoom) {
            yield 'Wasch- / Trockenraum';
        }

        if (this.builtInKitchen) {
            yield 'Einbauk&uuml;che';
        }

        if (this.shower) {
            yield 'Dusche';
        }

        if (this.bathroomWindow) {
            yield 'Fenster im Bad';
        }

        if (this.bathTub) {
            yield 'Badewanne';
        }

        if (this.cableSatTv) {
            yield 'Kabel / Sat. / TV';
        }

        if (this.barrierFree) {
            yield 'Barrierefrei';
        }

        if (this.basementRoom) {
            yield 'Keller';
        }

        if (this.balconies > 0) {
            yield 'Balkon';
        }

        if (this.terraces > 0) {
            yield 'Terrasse';
        }

        if (this.petsAllowed) {
            yield 'Tierhaltung';
        }

        if (this.gardenUsage) {
            yield 'Gartennutzung';
        }
    }

    get amenities () {
        return this._amenities();
    }

    get serviceCharge () {
        if (this.preise != null) {
            if (this.preise.nebenkosten != null && this.preise.nebenkosten != '') {
                return this.preise.nebenkosten;
            }
        }

        return null;
    }

    get operationalCosts () {
        if (this.preise != null) {
            if (this.preise.betriebskostennetto != null && this.preise.betriebskostennetto != '') {
                return this.preise.betriebskostennetto;
            }
        }

        return null;
    }

    get heatingCosts () {
        if (this.preise != null) {
            return this.preise.heizkosten;
        }

        return null;
    }

    get heatingCostsInServiceCharge () {
        if (this.preise != null) {
            return this.preise.heizkosten_enthalten;
        }

        return null;
    }

    get securityDeposit () {
        if (this.preise != null) {
            return this.preise.kaution;
        }

        return null;
    }

    get provision () {
        if (this.preise != null) {
            return this.preise.provisionnetto;
        }

        return null;
    }

    get subjectToCommission () {
        if (this.preise != null) {
            return this.preise.provisionspflichtig;
        }

        return null;
    }

    get livingArea () {
        if (this.flaechen != null) {
            return this.flaechen.wohnflaeche;
        }

        return null;
    }

    get availableFrom () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.abdatum != null) {
                const date = new Date(this.verwaltung_objekt.abdatum);
                return homeinfo.date.date(date);
            }

            if (this.verwaltung_objekt.verfuegbar_ab != null) {
                return this.verwaltung_objekt.verfuegbar_ab;
            }
        }

        return null;
    }

    get councilFlat () {
        if (this.verwaltung_objekt != null) {
            return this.verwaltung_objekt.wbs_sozialwohnung;
        }

        return null;
    }

    get constructionYear () {
        if (this.zustand_angaben != null) {
            return this.zustand_angaben.baujahr;
        }

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
        if (this.zustand_angaben != null) {
            return this.zustand_angaben.letztemodernisierung;
        }

        return null;
    }

    *_heatingTypes () {
        if (this.ausstattung != null) {
            if (this.ausstattung.heizungsart != null) {
                if (this.ausstattung.heizungsart.OFEN) {
                    yield 'Ofen';
                }

                if (this.ausstattung.heizungsart.ETAGE) {
                    yield 'Etagenheizung';
                }

                if (this.ausstattung.heizungsart.ZENTRAL) {
                    yield 'Zentralheizung';
                }

                if (this.ausstattung.heizungsart.FERN) {
                    yield 'Fernwärme';
                }

                if (this.ausstattung.heizungsart.FUSSBODEN) {
                    yield 'Fussbodenheizung';
                }
            }
        }
    }

    /*
      Returns the heating types.
    */
    get heatingTypes () {
        return this._heatingTypes();
    }

    /*
      Returns the heating type.
    */
    get heatingType () {
        const heatingTypes = Array.from(this.heatingTypes);

        if (heatingTypes.length == 0) {
            return immobrowse.config.na;
        }

        return heatingTypes.join(', ');
    }

    /*
      Determines whether the real estate is listed.
    */
    get listed () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.denkmalgeschuetzt != null) {
                return this.verwaltung_objekt.denkmalgeschuetzt;
            }
        }

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
                const energieverbrauchkennwert = Number(homeinfo.str.comma2dot(energiepass.energieverbrauchkennwert));
                const consumption = immobrowse.germanDecimal(energieverbrauchkennwert) + immobrowse.config.kwh;
                energyCertificate.value = consumption;
                energyCertificate.consumption = consumption;
            }
        } else {
            energyCertificate.type = 'Bedarfsausweis';

            if (energiepass.endenergiebedarf != null && energiepass.endenergiebedarf != '') {
                const endenergiebedarf = Number(homeinfo.str.comma2dot(energiepass.endenergiebedarf));
                const demand = immobrowse.germanDecimal(endenergiebedarf) + immobrowse.config.kwh;
                energyCertificate.value = demand;
                energyCertificate.demand = demand;
            }
        }

        if (energiepass.baujahr != null && energiepass.baujahr != '') {
            energyCertificate.constructionYear = energiepass.baujahr;
        } else {
            // Fall back to real estate's construction year.
            const constructionYear = this.constructionYear;

            if (constructionYear) {
                energyCertificate.constructionYear = constructionYear;
            }
        }

        if (energiepass.primaerenergietraeger != null) {
            energyCertificate.primaryEnergyCarrier = this.translatePrimaerenergietraeger(energiepass.primaerenergietraeger);
        }

        if (energiepass.wertklasse != null && energiepass.wertklasse != '') {
            energyCertificate.valueClass = energiepass.wertklasse;
        }

        return energyCertificate;
    }

    get contact () {
        if (this.kontaktperson == null) {
            return null;
        }

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

        if (this.kontaktperson.firma != null) {
            contact.company = this.kontaktperson.firma;
        }

        if (this.kontaktperson.strasse != null) {
            contact.street = this.kontaktperson.strasse;
        }

        if (this.kontaktperson.hausnummer != null) {
            contact.houseNumber = this.kontaktperson.hausnummer;
        }

        if (this.kontaktperson.strasse != null && this.kontaktperson.hausnummer != null) {
            contact.streetAndHouseNumber = this.kontaktperson.strasse + ' ' + this.kontaktperson.hausnummer;
            address.push(contact.streetAndHouseNumber);
        }

        if (this.kontaktperson.plz != null) {
            contact.zipCode = this.kontaktperson.plz;
        }

        if (this.kontaktperson.ort != null) {
            contact.city = this.kontaktperson.ort;
        }

        if (this.kontaktperson.plz != null && this.kontaktperson.ort != null) {
            contact.zipCodeAndCity = this.kontaktperson.plz + ' ' + this.kontaktperson.ort;
            address.push(contact.zipCodeAndCity);
        }

        if (address.length > 0) {
            contact.address = address.join(', ');
        }

        if (this.kontaktperson.email_direkt != null) {
            contact.email = this.kontaktperson.email_direkt;
        } else if (this.kontaktperson.email_zentrale != null) {
            contact.email = this.kontaktperson.email_zentrale;
        }

        if (this.kontaktperson.tel_durchw != null) {
            contact.phone = this.kontaktperson.tel_durchw;
        } else if (this.kontaktperson.tel_zentrale != null) {
            contact.phone = this.kontaktperson.tel_zentrale;
        }

        if (this.kontaktperson.url != null) {
            contact.website = this.kontaktperson.url;
        }

        return contact;
    }

    *_amenitiesTags () {
        for (const amenity of this.amenities) {
            yield immobrowse.dom.AmenitiesTag(amenity);
        }
    }

    get amenitiesTags () {
        return this._amenitiesTags();
    }

    get amenitiesList () {
        const amenities = Array.from(this.amenities);

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
                immobrowse.setValue(elements.constructionYear, energyCertificate.constructionYear);
                immobrowse.setValue(elements.type, energyCertificate.type);
                immobrowse.setValue(elements.demand, energyCertificate.demand);
                immobrowse.setValue(elements.consumption, energyCertificate.consumption);
                immobrowse.setValue(elements.primaryEnergyCarrier, energyCertificate.primaryEnergyCarrier);
                immobrowse.setValue(elements.valueClass, energyCertificate.valueClass);
            } else {
                immobrowse.setValue(elements.constructionYear, null);
                immobrowse.setValue(elements.type, null);
                immobrowse.setValue(elements.demand, null);
                immobrowse.setValue(elements.consumption, null);
                immobrowse.setValue(elements.primaryEnergyCarrier, null);
                immobrowse.setValue(elements.valueClass, null);
            }
        }
    }

    renderContact (elements) {
        if (elements != null) {
            const contact = this.contact;

            if (contact != null) {
                immobrowse.setValue(elements.salutation, contact.salutation);
                immobrowse.setValue(elements.firstName, contact.firstName);
                immobrowse.setValue(elements.lastName, contact.lastName);
                immobrowse.setValue(elements.name, contact.name);
                immobrowse.setValue(elements.company, contact.company);
                immobrowse.setValue(elements.street, contact.street);
                immobrowse.setValue(elements.houseNumber, contact.houseNumber);
                immobrowse.setValue(elements.streetAndHouseNumber, contact.streetAndHouseNumber);
                immobrowse.setValue(elements.zipCode, contact.zipCode);
                immobrowse.setValue(elements.city, contact.city);
                immobrowse.setValue(elements.zipCodeAndCity, contact.zipCodeAndCity);
                immobrowse.setValue(elements.address, contact.address);
                immobrowse.setValue(elements.phone, contact.phone);
                immobrowse.setValue(elements.website, contact.website);
            } else {
                immobrowse.setValue(elements.salutation, null);
                immobrowse.setValue(elements.firstName, null);
                immobrowse.setValue(elements.lastName, null);
                immobrowse.setValue(elements.name, null);
                immobrowse.setValue(elements.company, null);
                immobrowse.setValue(elements.street, null);
                immobrowse.setValue(elements.houseNumber, null);
                immobrowse.setValue(elements.streetAndHouseNumber, null);
                immobrowse.setValue(elements.zipCode, null);
                immobrowse.setValue(elements.city, null);
                immobrowse.setValue(elements.zipCodeAndCity, null);
                immobrowse.setValue(elements.address, null);
                immobrowse.setValue(elements.phone, null);
                immobrowse.setValue(elements.website, null);

                if (elements.container != null) {
                    elements.container.hide();
                }

                if (elements.button != null) {
                    elements.button.attr('disabled', true);
                }
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
        immobrowse.setValue(elements.objectId, this.objectId);
        immobrowse.setValue(elements.objectTitle, this.objectTitle);

        if (this.showAddress) {
            immobrowse.setValue(elements.address, this.address);
        }

        immobrowse.setValue(elements.objectTitle, this.objectTitle);
        immobrowse.setValue(elements.type, this.type);
        // Prices.
        immobrowse.setValue(elements.coldRent, immobrowse.euro(this.rent));
        immobrowse.setValue(elements.warmRent, immobrowse.euro(this.warmRent));
        immobrowse.setValue(elements.totaledUpRent, immobrowse.euro(this.totaledUpRent));
        immobrowse.setValue(elements.totalRent, immobrowse.euro(this.totalRent));
        immobrowse.setValue(elements.serviceCharge, immobrowse.euro(this.serviceCharge));
        immobrowse.setValue(elements.operationalCosts, immobrowse.euro(this.operationalCosts));
        immobrowse.setValue(elements.heatingCosts, immobrowse.euro(this.heatingCosts));
        immobrowse.setValue(elements.heatingCostsInServiceCharge, immobrowse.yesNo(this.heatingCostsInServiceCharge));
        immobrowse.setValue(elements.securityDeposit, immobrowse.euro(this.securityDeposit));
        immobrowse.setValue(elements.provision, immobrowse.euro(this.provision));
        immobrowse.setValue(elements.subjectToCommission, immobrowse.yesNo(this.subjectToCommission));
        // Areas.
        immobrowse.setValue(elements.livingArea, immobrowse.squareMeters(this.livingArea));
        immobrowse.setValue(elements.rooms, this.rooms);
        immobrowse.setValue(elements.bathrooms, this.bathrooms);
        immobrowse.setValue(elements.bedrooms, this.bedrooms);
        immobrowse.setValue(elements.floor, this.floor);
        // Amenities and state.
        immobrowse.setValue(elements.petsAllowed, immobrowse.yesNo(this.petsAllowed));
        immobrowse.setValue(elements.gardenUsage, immobrowse.yesNo(this.gardenUsage));
        immobrowse.setValue(elements.availableFrom, this.availableFrom);
        immobrowse.setValue(elements.councilFlat, immobrowse.yesNo(this.councilFlat));
        immobrowse.setValue(elements.constructionYear, this.constructionYear);
        immobrowse.setValue(elements.state, this.state);
        immobrowse.setValue(elements.lastModernization, this.lastModernization);
        immobrowse.setValue(elements.heatingType, this.heatingType);
        this.renderEnergyCertificate(elements.energyCertificate);
        // Description texts.
        immobrowse.setValue(elements.description, this.description);
        immobrowse.setValue(elements.exposure, this.exposure);
        immobrowse.setValue(elements.amenities, this.amenitiesDescription);
        immobrowse.setValue(elements.miscellanea, this.miscellanea);
        this.renderContact(elements.contact);
        immobrowse.setValue(elements.amenitiesList, this.amenitiesList);
        this.renderImage(elements.titleImage, this.titleImage);
        this.renderImage(elements.floorplan, this.floorplan);

        if (this.listed) {
            immobrowse.setValue(elements.listedHint, immobrowse.config.listedHint);
        }
    }

    /*
      Returns a list of data fields.
    */
    _dataFields (elements) {
        elements = elements || this._defaultElements;
        const dataFields = [];

        for (const element of elements) {
            switch (element.name) {
            case 'coldRent':
                immobrowse.dom.preview.addDataFieldCol(element, immobrowse.euro(this.rent) || immobrowse.config.na, dataFields);
                break;
            case 'totalRent':
                immobrowse.dom.preview.addDataFieldCol(element, immobrowse.euro(this.totalRent) || immobrowse.config.na, dataFields);
                break;
            case 'serviceCharge':
                immobrowse.dom.preview.addDataFieldCol(element, immobrowse.euro(this.serviceCharge) || immobrowse.config.na, dataFields);
                break;
            case 'operationalCosts':
                immobrowse.dom.preview.addDataFieldCol(element, immobrowse.euro(this.operationalCosts) || immobrowse.config.na, dataFields);
                break;
            case 'rooms':
                immobrowse.dom.preview.addDataFieldCol(element, this.rooms || immobrowse.config.na, dataFields);
                break;
            case 'area':
                immobrowse.dom.preview.addDataFieldCol(element, this.area || immobrowse.config.na, dataFields);
                break;
            }
        }

        return dataFields;
    }

    /*
      Converts the real estate into a DOM element for list view.
    */
    preview (elements) {
        let addressRow = null;

        if (this.showAddress && immobrowse.config.addressInList) {
            addressRow = immobrowse.dom.preview.AddressRow(immobrowse.dom.preview.ObjectAddress(this.address));
        }

        return immobrowse.dom.preview.Entry(
            immobrowse.dom.preview.MainRow(
                immobrowse.dom.preview.ImageCol(
                    immobrowse.dom.preview.ImageFrame(
                        immobrowse.dom.preview.TitleImage(this.attachmentURL(this.titleImage))
                    )
                ),
                immobrowse.dom.preview.DataCol(
                    immobrowse.dom.preview.TitleRow(immobrowse.dom.preview.ObjectTitle(this.objectTitle || immobrowse.config.na)),
                    addressRow,
                    immobrowse.dom.preview.DataRow(this._dataFields(elements)),
                    immobrowse.dom.preview.AmenitiesTags(this.amenitiesTags)
                )
            ),
            this.detailsURL
        );
    }
};


/*
  Real estate list class.
*/
immobrowse.List = class {
    constructor (realEstates) {
        this.realEstates = Array.from(realEstates);
    }

    /*
      Sorts real estates.
    */
    sort (property, order) {
        const sorter = immobrowse.getSorter(property, order);
        this.realEstates.sort(sorter);
    }

    /*
      Renders the respective real estates into the given HTML element.
    */
    render (listElement, elements) {
        listElement.html('');  // Clear element.

        for (const realEstate of this.realEstates) {
            const preview = realEstate.preview(elements);
            listElement.append(preview);
        }
    }
};


/*
  ImmoBrowse's DOM factories.
*/
immobrowse.dom = immobrowse.dom || {};


immobrowse.dom.OvalInner = function (content) {
    const element = document.createElement('div');
    element.setAttribute('class', 'oval-inner');
    element.innerHTML = content;
    return element;
};


immobrowse.dom.OvalOuter = function (ovalInner) {
    const element = document.createElement('div');
    element.setAttribute('class', 'oval-outer');
    element.appendChild(ovalInner);
    return element;
};


immobrowse.dom.AmenitiesTag = function (content) {
    return immobrowse.dom.OvalOuter(immobrowse.dom.OvalInner(content));
};


immobrowse.dom.Numerator = function (content) {
    const element = document.createElement('span');
    element.setAttribute('class', 'numerator');
    element.innerHTML = content;
    return element;
};


immobrowse.dom.Denominator = function (content) {
    const element = document.createElement('span');
    element.setAttribute('class', 'denominator');
    element.innerHTML = content;
    return element;
};


immobrowse.dom.Fraction = function (numerator, denominator) {
    const element = document.createElement('span');
    element.setAttribute('class', 'fraction');
    element.appendChild(numerator);
    element.appendChild(denominator);
    return element;
};


immobrowse.dom.Kwhsma = function () {
    return immobrowse.dom.Fraction(
        immobrowse.dom.Numerator('kWh'),
        immobrowse.dom.Denominator('m<sup>2</sup>&middot;a'));
};


// DOMs for preview.
immobrowse.dom.preview = immobrowse.dom.preview || {};


/*
  Appends a data row to the list iff value is not null or hiding is disabled.
*/
immobrowse.dom.preview.addDataFieldCol = function (element, value, list) {
    const caption = element.caption;
    const hide = element.hide || false;

    if (value == null) {
        if (hide) {
            return;
        }

        value = immobrowse.config.na;
    }

    list.push(
        immobrowse.dom.preview.DataFieldCol(
            immobrowse.dom.preview.DataFieldRow(immobrowse.dom.preview.DataFieldCaption(caption)),
            immobrowse.dom.preview.DataFieldRow(immobrowse.dom.preview.DataFieldValue(value))
        )
    );
};


immobrowse.dom.preview.DataFieldCaption = function (caption) {
    const element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-data-caption');
    element.innerHTML = caption;
    return element;
};


immobrowse.dom.preview.DataFieldValue = function (value) {
    const element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-data-value');
    element.innerHTML = value;
    return element;
};


immobrowse.dom.preview.DataFieldRow = function (child) {
    const element = document.createElement('div');
    element.setAttribute('class', 'row');
    element.appendChild(child);
    return element;
};


immobrowse.dom.preview.DataFieldCol = function (captionRow, valueRow) {
    const element = document.createElement('div');
    element.setAttribute('class', 'w3-col m3');
    element.appendChild(captionRow);
    element.appendChild(valueRow);
    return element;
};


immobrowse.dom.preview.DataRow = function (dataColumns) {
    const element = document.createElement('div');
    element.setAttribute('class', 'row row-centered ib-preview-data');

    for (const child of dataColumns) {
        element.appendChild(child);
    }

    return element;
};


immobrowse.dom.preview.ObjectAddress = function (address) {
    const element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-title');
    element.innerHTML = address;
    return element;
};


immobrowse.dom.preview.AddressRow = function (objectAddress) {
    const element = document.createElement('div');
    element.setAttribute('class', 'w3-row w3-centered');
    element.appendChild(objectAddress);
    return element;
};


immobrowse.dom.preview.ObjectTitle = function (title) {
    const element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-title');
    element.innerHTML = title;
    return element;
};


immobrowse.dom.preview.TitleRow = function (objectTitle) {
    const element = document.createElement('div');
    element.setAttribute('class', 'w3-row w3-centered');
    element.appendChild(objectTitle);
    return element;
};


immobrowse.dom.preview.DataCol = function (titleRow, addressRow, dataRow, amenitiesTags) {
    const element = document.createElement('div');
    element.setAttribute('class', 'w3-col s8');
    element.appendChild(titleRow);

    if (addressRow != null) {
        element.appendChild(addressRow);
    }

    element.appendChild(dataRow);
    element.appendChild(amenitiesTags);
    return element;
};


immobrowse.dom.preview.TitleImage = function (url) {
    const element = document.createElement('img');

    if (url == null) {
        url = 'img/dummy.jpg';
    }

    element.setAttribute('src', url);
    element.setAttribute('class', 'ib-framed-image');
    element.setAttribute('alt', 'Titelbild');
    return element;
};


immobrowse.dom.preview.ImageFrame = function (image) {
    const element = document.createElement('div');
    element.setAttribute('class', 'ib-image-frame');
    element.appendChild(image);
    return element;
};


immobrowse.dom.preview.ImageCol = function (imageFrame) {
    const element = document.createElement('div');
    element.setAttribute('class', 'w3-col s4');
    element.appendChild(imageFrame);
    return element;
};


immobrowse.dom.preview.MainRow = function (imageCol, dataCol) {
    const element = document.createElement('div');
    element.setAttribute('class', 'w3-row w3-centered ib-preview-container');
    element.appendChild(imageCol);
    element.appendChild(dataCol);
    return element;
};


immobrowse.dom.preview.AmenitiesTags = function (amenities) {
    const element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-tags');

    for (const child of amenities) {
        element.appendChild(child);
    }

    return element;
};


immobrowse.dom.preview.Entry = function (mainRow, detailsURL) {
    const element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-item');
    element.setAttribute('onclick', 'immobrowse.open("' + detailsURL + '");');
    element.appendChild(mainRow);
    return element;
};


/*
  Creates a contact email.
*/
immobrowse.dom.contactEmail = function (
    realEstate, message, salutation, forename, surname,
    phone, street, houseNumber, zipCode, city, member = null) {
    function  newline () {
        return document.createElement('br');
    }

    const doc = document.implementation.createHTMLDocument('Anfrage zu Objekt');
    const body = doc.body;

    const h1 = document.createElement('h1');
    h1.textContent = 'Anfrage zu Objekt';
    body.appendChild(h1);

    const h2 = document.createElement('h2');
    h2.textContent = realEstate.objectTitle;
    body.appendChild(h2);

    const h3 = document.createElement('h3');
    h3.textContent = [realEstate.addressPreview, realEstate.cityPreview].join(' ');
    body.appendChild(h3);

    salutation = document.createTextNode(salutation + ' ');
    body.appendChild(salutation);

    const span = document.createElement('span');
    span.setAttribute('style', 'font-variant:small-caps;');
    span.textContent = [forename, surname].join(' ');
    body.appendChild(span);

    let inquirerInfo = false;
    let streetAndHouseNumber = street;

    if (streetAndHouseNumber) {
        if (houseNumber) {
            streetAndHouseNumber += ' ' + houseNumber;
        }

        streetAndHouseNumber = document.createTextNode(streetAndHouseNumber);
        body.appendChild(newline());
        body.appendChild(streetAndHouseNumber);
        inquirerInfo = true;
    }

    if (city) {
        if (zipCode) {
            const zipCodeAndCity = document.createTextNode([zipCode, city].join(' '));
            body.appendChild(newline());
            body.appendChild(zipCodeAndCity);
        } else {
            city = document.createTextNode(city);
            body.appendChild(newline());
            body.appendChild(city);
        }

        inquirerInfo = true;
    } else if (zipCode) {
        zipCode = document.createTextNode(zipCode);
        body.appendChild(newline());
        body.appendChild(zipCode);
        inquirerInfo = true;
    }

    if (phone) {
        phone = document.createTextNode('Tel.: ' + phone);
        body.appendChild(newline());
        body.appendChild(phone);
        inquirerInfo = true;
    }

    if (member != null) {
        member = document.createTextNode('Mitglied: ' + member ? 'Ja' : 'Nein');
        body.appendChild(newline());
        body.appendChild(member);
        inquirerInfo = true;
    }

    if (inquirerInfo) {
        body.appendChild(newline());
        body.appendChild(newline());    // two new lines.
    } else {
        const space = document.createTextNode(' ');
        body.appendChild(space);
    }

    const messageHeader = document.createTextNode('hat folgende Anfrage an Sie:');
    body.appendChild(messageHeader);
    body.appendChild(newline());
    body.appendChild(newline());  // two new lines.

    const div = document.createElement('div');
    div.setAttribute('style', 'font-style:italic;');
    div.innerHTML = message.replace('\n', '\n<br>\n');
    body.appendChild(div);
    return doc.documentElement;
};


/*
  Customer-dependent configuration defaults.
*/
immobrowse.config = immobrowse.config || {};
immobrowse.config.listedHint = immobrowse.config.listedHint || 'Gebäude liegt im Denkmalschutzbereich.';
immobrowse.config.na = immobrowse.config.na || 'k. A.';
immobrowse.config.kwh = immobrowse.config.kwh || immobrowse.dom.Kwhsma().outerHTML;
immobrowse.config.addressInList = immobrowse.config.addressInList || false;
