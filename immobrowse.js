/*
  immobrowse.js - ImmoBrowse JavaScript library.

  (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

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
        } else {
            return Infinity;
        }
    } else {
        if (bob == null) {
            return -Infinity;
        } else {
            var val = 0;

            if (alice < bob) {
                val = -1;
            } else {
                if (bob < alice) {
                    val = 1;
                }
            }

            if (descending) {
                val =    val * -1;
            }

            return val;
        }
    }
};


/*
  Returns an appropriate sorting function.
*/
immobrowse.getSorter = function (property, order) {
    var descending = false;

    if (order == 'descending') {
        descending = true;
    }

    switch(property) {
    case 'rooms': return this.sortByRooms(descending);
    case 'area': return this.sortByArea(descending);
    case 'rent': return this.sortByRent(descending);
    case 'street': return this.sortByStreet(descending);
    default: throw 'Invalid sorting property: ' + property;
    }
};


/*
  Returns comparison for rooms.
*/
immobrowse.sortByRooms = function (descending) {
    return function (immobilie1, immobilie2) {
        return immobrowse.compare(immobilie1.rooms(), immobilie2.rooms(), descending);
    };
};


/*
  Returns comparison for area.
*/
immobrowse.sortByArea = function (descending) {
    return function (immobilie1, immobilie2) {
        return immobrowse.compare(immobilie1.area(), immobilie2.area(), descending);
    };
};


/*
  Returns comparison for rent.
*/
immobrowse.sortByRent = function (descending) {
    return function (immobilie1, immobilie2) {
        return immobrowse.compare(immobilie1.rent(), immobilie2.rent(), descending);
    };
};


/*
  Returns comparison for streets.
*/
immobrowse.sortByStreet = function (descending) {
    return function (immobilie1, immobilie2) {
        return immobrowse.compare(immobilie1.street(), immobilie2.street(), descending);
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

        return number.toFixed(decimals).replace('.',',');
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
    } else if (boolean == true) {
        return 'Ja';
    } else {
        return 'Nein';
    }
};


/*
  Returns a list of cities from the provided real estates.
*/
immobrowse.cities = function (realEstates) {
    var cities = [];

    for (var i = 0; i < realEstates.length; i++) {
        var city = realEstates[i].geo.ort;

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
    var districts = [];

    for (var i = 0; i < realEstates.length; i++) {
        var district = realEstates[i].district();

        if (district != null) {
            if (districts[district] != undefined) {
                districts[district] += 1;
            } else {
                districts[district] = 1;
            }
        }
    }

    return districts;
};


/*
  Returns a list of district elements for rendering.
*/
immobrowse.districtElements = function (realEstates) {
    var districts = immobrowse.districts(realEstates);
    var districtElements = [];

    for (var district in districts) {
        if (districts.hasOwnProperty(district)) {
            var inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'checkbox');
            inputElement.setAttribute('class', 'ib-select-district');
            inputElement.setAttribute('name', district);
            districtElements.push(inputElement);
            var textElement = document.createTextNode(' ' + district + ' (' + districts[district] + ')');
            districtElements.push(textElement);
            var lineBreakElement = document.createElement('br');
            districtElements.push(lineBreakElement);
        }
    }

    return districtElements;
};


/*
  Opens the respective URL.
*/
immobrowse.open = function (url) {
    window.open(url, '_self');
};


/*
  Generates a contact email.
*/
immobrowse.mkContactMail = function (
    objectTitle, objectAddress, salutation, forename, surname, phone, street, houseNumber, zipCode, city, message) {
    var html = '<!DOCTYPE HTML>\n';
    html += '<h1>Anfrage zu Objekt</h1>';
    html += '<h2>' + objectTitle + '</h2>';
    html += '<h3>' + objectAddress + '</h4>';
    html += [salutation, '<span style="font-variant:small-caps;">' + forename, surname + '</span>'].join(' ');

    var inquirerInfo = '';

    if (street) {
        inquirerInfo += street;

        if (houseNumber) {
            inquirerInfo += ' ' + houseNumber;
        }

        inquirerInfo += '<br>\n';
    }

    if (zipCode) {
        inquirerInfo += zipCode;
    }

    if (city) {
        if (zipCode) {
            inquirerInfo += ' ';
        }

        inquirerInfo += city;
    }

    if (zipCode || city) {
        inquirerInfo += '<br>\n';
    }

    if (phone) {
        inquirerInfo += 'Tel.: ' + phone + '\n<br>\n';
    }

    if (inquirerInfo == '') {
        html += ' ';
    } else {
        html += '\n<br>\n' + inquirerInfo + '\n<br>\n';
    }

    html += 'hat folgende Anfrage an Sie:\n<br>\n<br>\n';
    html += '<div style="font-style:italic;">' + message.replace('\n', '\n<br>\n') + '</div>';
    return html;
};


/*
  Mailer class.
*/
immobrowse.Mailer = function (config, html, successMsg, errorMsg) {
    this.baseUrl = 'https://hisecon.homeinfo.de';
    this.config = config;

    if (html == null) {
        this.html = true;
    } else {
        this.html = html;
    }

    if (successMsg == null) {
        this.successMsg = {
            title: 'Anfrage versendet!',
            type: 'success'
        };
    } else {
        this.successMsg = successMsg;
    }

    if (errorMsg == null) {
        this.errorMsg = {
            title: 'Fehler beim Versenden!',
            text: 'Bitte versuchen Sie es später noch ein Mal.',
            type: 'error'
        };
    } else {
        this.errorMsg = errorMsg;
    }

    /*
      Returns the respective URL for the Ajax call.
    */
    this._getUrl = function (response, subject, recipient, reply_to) {
        var url = this.baseUrl + '?config=' + this.config;

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
    };

    /*
      Returns the respective Ajax call object.
    */
    this._getAjax = function (url, body) {
        var successMsg = this.successMsg;
        var errorMsg = this.errorMsg;

        return {
            url: url,
            type: 'POST',
            data: body,
            cache: false,
            success: function () {
                swal(successMsg);
            },
            error: function () {
                swal(errorMsg);
            }
        };
    };

    /*
      Sends the respective emails.
    */
    this.send = function (response, subject, body, recipient, reply_to) {
        return jQuery.ajax(this._getAjax(this._getUrl(response, subject, recipient, reply_to), body));
    };
};


/*
  Matches real estates for filtering.
*/
immobrowse.Filter = function (rules) {
    this.rules = rules || {};

    /*
      Match filters on a real estate's JSON data.
    */
    this.match = function (realEstate) {
        var rent = realEstate.rent();

        if (this.rules.priceMin > rent) {
            return false;
        }

        if (this.rules.priceMax < rent) {
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
                if (this.rules.districts.indexOf(realEstate.district()) < 0) {
                    return false;
                }
            }
        }

        return true;
    };

    /*
      Filters a list of real estates.
    */
    this.filter = function (realEstates) {
        var filteredRealEstates = [];

        for (var i = 0; i < realEstates.length; i++) {
            if (this.match(realEstates[i])) {
                filteredRealEstates.push(realEstates[i]);
            }
        }

        return filteredRealEstates;
    };
};


/*
  Real estate wrapper class.
*/
immobrowse.RealEstate = function (json) {
    this._defaultElements = [
        {'name': 'coldRent', 'caption': 'Kaltmiete'},
        {'name': 'serviceCharge', 'caption': 'Nebenkosten'},
        {'name': 'rooms', 'caption': 'Zimmer'},
        {'name': 'area', 'caption': 'Fläche ca.'},
    ];

    for (var prop in json) {
        if (json.hasOwnProperty(prop)) {
            this[prop] = json[prop];
        }
    }

    this.street = function () {
        if (this.geo != null) {
            if (this.geo.strasse != null) {
                return this.geo.strasse;
            }
        }

        return null;
    };

    this.houseNumber = function () {
        if (this.geo != null) {
            if (this.geo.hausnummer != null) {
                return this.geo.hausnummer;
            }
        }

        return null;
    };

    this.zipCode = function () {
        if (this.geo != null) {
            if (this.geo.plz != null) {
                return this.geo.plz;
            }
        }

        return null;
    };

    this.city = function () {
        if (this.geo != null) {
            if (this.geo.ort != null) {
                return this.geo.ort;
            }
        }

        return null;
    };

    this.district = function () {
        if (this.geo != null) {
            if (this.geo.regionaler_zusatz != null) {
                return this.geo.regionaler_zusatz;
            }
        }

        return null;
    };

    this.streetAndHouseNumber = function () {
        var street = this.street();
        var houseNumber = this.houseNumber();
        var streetAndHouseNumber = [];

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
    };

    this.zipCodeAndCity = function () {
        var zipCode = this.zipCode();
        var city = this.city();
        var district = this.district();
        var zipCodeAndCity = [];

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
    };

    this.address = function () {
        var streetAndHouseNumber = this.streetAndHouseNumber();
        var zipCodeAndCity = this.zipCodeAndCity();
        var address = [];

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
    };

    this.addressPreview = function () {
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
    };

    this.cityPreview = function () {
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
    };

    this.objectTitle = function () {
        if (this.freitexte != null) {
            if (this.freitexte.objekttitel != null) {
                return this.freitexte.objekttitel;
            }
        }

        var html = '';
        var rooms = this.rooms();

        if (rooms == null) {
            html += 'Wohnung | ';
        } else {
            html += rooms + ' Zimmer Wohnung | ';
        }

        if (this.showAddress()) {
            html += this.addressPreview() || 'N/A';
            html += ' | ';
        }

        html += this.cityPreview();
        return html;
    };

    /*
      Extracts a potential title image from a
      real estate or null if none was found.
    */
    this.titleImage = function () {
        if (this.anhaenge == null) {
            return null;
        } else {
            if (this.anhaenge.anhang == null) {
                return null;
            } else {
                var i, anhang;

                for (i = 0; i < this.anhaenge.anhang.length; i++) {
                    anhang = this.anhaenge.anhang[i];

                    if (anhang.gruppe == 'TITELBILD') {
                        return anhang;
                    }
                }

                for (i = 0; i < this.anhaenge.anhang.length; i++) {
                    anhang = this.anhaenge.anhang[i];

                    if (anhang.gruppe == 'AUSSENANSICHTEN') {
                        return anhang;
                    }
                }

                for (i = 0; i < this.anhaenge.anhang.length; i++) {
                    anhang = this.anhaenge.anhang[i];

                    if (anhang.gruppe == 'BILD') {
                        return anhang;
                    }
                }

                for (i = 0; i < this.anhaenge.anhang.length; i++) {
                    anhang = this.anhaenge.anhang[i];

                    if (anhang.gruppe == 'GRUNDRISS') {
                        return anhang;
                    }
                }

                return null;
            }
        }
    };

    this.rooms = function () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_zimmer != null) {
                return immobrowse.germanDecimal(this.flaechen.anzahl_zimmer);
            }
        }

        return null;
    };

    this.bathrooms = function () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_badezimmer != null) {
                return immobrowse.germanDecimal(this.flaechen.anzahl_badezimmer);
            }
        }

        return null;
    };

    this.bedrooms = function () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_schlafzimmer != null) {
                return immobrowse.germanDecimal(this.flaechen.anzahl_schlafzimmer);
            }
        }

        return null;
    };

    this.types = function () {
        var types = [];

        if (this.objektkategorie != null) {
            if (this.objektkategorie.objektart != null) {
                if (this.objektkategorie.objektart.zimmer != null) {
                    types = this.objektkategorie.objektart.zimmer;
                } else if (this.objektkategorie.objektart.wohnung != null) {
                    types = this.objektkategorie.objektart.wohnung;
                } else if (this.objektkategorie.objektart.haus != null) {
                    types = this.objektkategorie.objektart.haus;
                } else if (this.objektkategorie.objektart.grundstueck != null) {
                    types = this.objektkategorie.objektart.grundstueck;
                } else if (this.objektkategorie.objektart.buero_praxen != null) {
                    types = this.objektkategorie.objektart.buero_praxen;
                } else if (this.objektkategorie.objektart.einzelhandel != null) {
                    types = this.objektkategorie.objektart.einzelhandel;
                } else if (this.objektkategorie.objektart.gastgewerbe != null) {
                    types = this.objektkategorie.objektart.gastgewerbe;
                } else if (this.objektkategorie.objektart.hallen_lager_prod != null) {
                    types = this.objektkategorie.objektart.hallen_lager_prod;
                } else if (this.objektkategorie.objektart.land_und_forstwirtschaft != null) {
                    types = this.objektkategorie.objektart.land_und_forstwirtschaft;
                } else if (this.objektkategorie.objektart.parken != null) {
                    types = this.objektkategorie.objektart.parken;
                } else if (this.objektkategorie.objektart.sonstige != null) {
                    types = this.objektkategorie.objektart.sonstige;
                } else if (this.objektkategorie.objektart.freizeitimmobilie_gewerblich != null) {
                    types = this.objektkategorie.objektart.freizeitimmobilie_gewerblich;
                } else if (this.objektkategorie.objektart.zinshaus_renditeobjekt != null) {
                    types = this.objektkategorie.objektart.zinshaus_renditeobjekt;
                }
            }
        }

        return types;
    };

    this.type = function () {
        var types = this.types();

        for (var i = 0; i < types.length; i++) {
            if (types[i] != null) {
                return homeinfo.str.capitalizeFirstLetter(types[i].toLowerCase());
            }
        }

        return null;
    };

    this.gardenUsage = function () {
        if (this.ausstattung != null) {
            if (this.ausstattung.gartennutzung != null) {
                return this.ausstattung.gartennutzung;
            }
        }

        return null;
    };

    this.petsAllowed = function () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.haustiere != null) {
                return this.verwaltung_objekt.haustiere;
            }
        }

        return null;
    };

    this.area = function () {
        if (this.flaechen == null) {
            return null;
        } else {
            if (this.flaechen.wohnflaeche == null) {
                if (this.flaechen.nutzflaeche == null) {
                    if (this.flaechen.gesamtflaeche == null) {
                        return null;
                    } else {
                        return this.flaechen.gesamtflaeche;
                    }
                } else {
                    return this.flaechen.nutzflaeche;
                }
            } else {
                return this.flaechen.wohnflaeche;
            }
        }
    };

    this.netColdRent = function () {
        if (this.preise != null) {
            if (this.preise.nettokaltmiete != null) {
                return this.preise.nettokaltmiete;
            }
        }

        return null;
    };

    this.coldRent = function () {
        if (this.preise != null) {
            if (this.preise.kaltmiete != null) {
                return this.preise.kaltmiete;
            }
        }

        return null;
    };

    this.warmRent = function () {
        if (this.preise != null) {
            if (this.preise.warmmiete != null) {
                return this.preise.warmmiete;
            }
        }

        return null;
    };

    this.rent = function () {
        var netColdRent = this.netColdRent();
        var coldRent = this.coldRent();

        if (netColdRent != null && netColdRent != '') {
            return netColdRent;
        } else if (coldRent != null && coldRent != '') {
            return coldRent;
        }

        return null;
    };

    this.totaledUpRent = function () {
        var rent = this.rent();

        if (rent == null) {
            return null;
        }

        var operationalCosts = this.operationalCosts() || 0;
        var heatingCosts = this.heatingCosts() || 0;
        return rent + operationalCosts + heatingCosts;
    };

    this.totalRent = function () {
        if (this.preise != null) {
            if (this.preise.gesamtmietenetto != null) {
                return this.preise.gesamtmietenetto;
            }
        }

        return null;
    };

    this.cableSatTv = function () {
        if (this.ausstattung != null) {
            return this.ausstattung.kabel_sat_tv;
        }

        return null;
    };

    this.builtInKitchen = function () {
        if (this.ausstattung != null) {
            if (this.ausstattung.kueche != null) {
                return this.ausstattung.kueche.EBK;
            }
        }

        return false;
    };

    this.basementRoom = function () {
        if (this.ausstattung != null) {
            return this.ausstattung.unterkellert;
        }

        return null;
    };

    this.balconies = function () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_balkone != null) {
                return this.flaechen.anzahl_balkone;
            }
        }

        return 0;
    };

    this.terraces = function () {
        if (this.flaechen != null) {
            if (this.flaechen.anzahl_terrassen != null) {
                return this.flaechen.anzahl_terrassen;
            }
        }

        return 0;
    };

    this.shower = function () {
        if (this.ausstattung != null) {
            if (this.ausstattung.bad != null) {
                return this.ausstattung.bad.DUSCHE;
            }
        }

        return false;
    };

    this.bathTub = function () {
        if (this.ausstattung != null) {
            if (this.ausstattung.bad != null) {
                return this.ausstattung.bad.WANNE;
            }
        }

        return false;
    };

    this.bathroomWindow = function () {
        if (this.ausstattung != null) {
            if (this.ausstattung.bad != null) {
                return this.ausstattung.bad.FENSTER;
            }
        }

        return false;
    };

    this.lavatoryDryingRoom = function () {
        if (this.ausstattung != null) {
            return this.ausstattung.wasch_trockenraum;
        }

        return false;
    };

    this.barrierFree = function () {
        if (this.ausstattung != null) {
            return this.ausstattung.barrierefrei;
        }

        return false;
    };

    this.objectTypes = function () {
        var types = [];
        var objektart = this.objektkategorie.objektart;

        if (objektart.zimmer != null) {
            types.push('ZIMMER');
        }

        if (objektart.wohnung != null) {
            types.push('WOHNUNG');
            types.concat(objektart.wohnung);
        }

        return types;
    };

    this.marketingTypes = function () {
        var types = [];
        var vermarktungsart = this.objektkategorie.vermarktungsart;

        if (vermarktungsart.KAUF) {
            types.push('KAUF');
        }

        if (vermarktungsart.MIETE_PACHT) {
            types.push('MIETE_PACHT');
        }

        if (vermarktungsart.ERBPACHT) {
            types.push('ERBPACHT');
        }

        if (vermarktungsart.LEASING) {
            types.push('LEASING');
        }

        return types;
    };

    this.showAddress = function () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.objektadresse_freigeben != null) {
                return this.verwaltung_objekt.objektadresse_freigeben;
            }
        }

        return true;
    };

    this.translatePrimaerenergietraeger = function (primaerenergietraeger) {
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

    this.matchTypes = function (types) {
        if (types == null) {
            return true;
        } else {
            var myTypes = this.objectTypes();

            for (var i = 0; i < myTypes.length; i++) {
                if (types.indexOf(myTypes[i]) >= 0) {
                    return true;
                }
            }

            return false;
        }
    };

    this.matchMarketing = function (types) {
        if (types == null) {
            return true;
        } else {
            var myTypes = this.marketingTypes();

            for (var i = 0; i < myTypes.length; i++) {
                if (types.indexOf(myTypes[i]) >= 0) {
                    return true;
                }
            }

            return false;
        }
    };

    this.objectId = function () {
        return this.verwaltung_techn.objektnr_extern;
    };

    this.attachmentURL = function (anhang) {
        if (anhang != null) {
            return 'https://backend.homeinfo.de/immobrowse/attachment/' + anhang.id;
        }

        return null;
    };

    this.defaultDetailsURL = function (baseUrl) {
        if (baseUrl != null) {
            return baseUrl + '?real_estate=' + this.id;
        }

        return null;
    };

    this.detailsURL = function () {
        if (immobrowse.config.exposeURLCallback != null) {
            return immobrowse.config.exposeURLCallback(this.id);
        } else if (immobrowse.config.detailsURL != null) {
            return this.defaultDetailsURL(immobrowse.config.detailsURL);
        }

        return this.defaultDetailsURL('expose.html');
    };

    this.miscellanea = function () {
        if (this.freitexte != null) {
            if (! homeinfo.str.isEmpty(this.freitexte.sonstige_angaben)) {
                return this.freitexte.sonstige_angaben;
            }
        }

        return null;
    };

    this.description = function () {
        if (this.freitexte != null) {
            if (! homeinfo.str.isEmpty(this.freitexte.objektbeschreibung)) {
                return this.freitexte.objektbeschreibung;
            }
        }

        return null;
    };

    this.exposure = function () {
        if (this.freitexte != null) {
            if (! homeinfo.str.isEmpty(this.freitexte.lage)) {
                return this.freitexte.lage;
            }
        }

        return null;
    };

    this.amenitiesDescription = function () {
        if (this.freitexte != null) {
            if (! homeinfo.str.isEmpty(this.freitexte.ausstatt_beschr)) {
                return this.freitexte.ausstatt_beschr;
            }
        }

        return null;
    };

    this.attachments = function () {
        var attachments = [];

        if (this.anhaenge != null) {
            if (this.anhaenge.anhang != null) {
                for (var i = 0; i < this.anhaenge.anhang.length; i++) {
                    attachments.push(this.anhaenge.anhang[i]);
                }
            }
        }

        return attachments;
    };

    this.images = function () {
        var attachments = this.attachments();
        var imageGroups = ['TITELBILD', 'BILD', 'AUSSENANSICHTEN', 'INNENANSICHTEN', 'ANBIETERLOGO'];
        var images = [];

        for (var i = 0; i < attachments.length; i++) {
            if (imageGroups.indexOf(attachments[i].gruppe) >= 0) {
                images.push(attachments[i]);
            }
        }

        return images;
    };

    this.floorplans = function () {
        var attachments = this.attachments();
        var floorplans = [];

        for (var i = 0; i < attachments.length; i++) {
            if (attachments[i].gruppe == 'GRUNDRISS') {
                floorplans.push(attachments[i]);
            }
        }

        return floorplans;
    };

    this.floorplan = function () {
        return this.floorplans()[0];
    };

    this.floor = function () {
        var ordinal = '. ';
        var dg = 'Dachgeschoss';
        var og = 'Obergeschoss';
        var eg = 'Erdgeschoss';
        var ug = 'Untergeschoss';

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
                } else if (this.geo.etage > 0) {
                    return this.geo.etage + ordinal + og;
                } else {
                    return eg;
                }
            }
        }
    };

    this.amenities = function () {
        var amenities = [];

        if (this.ausstattung != null) {
            if (this.ausstattung.rollstuhlgerecht) {
                amenities.push('Rollstuhlgerecht');
            }

            if (this.ausstattung.stellplatzart != null) {
                if (this.ausstattung.stellplatzart.FREIPLATZ) {
                    amenities.push('Stellplatz');
                }
            }

            if (this.ausstattung.fahrstuhl != null) {
                if (this.ausstattung.fahrstuhl.PERSONEN) {
                    amenities.push('Personenaufzug');
                }
            }

            if (this.ausstattung.gaestewc) {
                amenities.push('Gäste WC');
            }
        }

        if (this.flaechen != null) {
            if (this.flaechen.einliegerwohnung) {
                amenities.push('Einliegerwohnung');
            }
        }

        if (this.lavatoryDryingRoom()) {
            amenities.push('Wasch- / Trockenraum');
        }

        if (this.builtInKitchen()) {
            amenities.push('Einbauk&uuml;che');
        }

        if (this.shower()) {
            amenities.push('Dusche');
        }

        if (this.bathroomWindow()) {
            amenities.push('Fenster im Bad');
        }

        if (this.bathTub()) {
            amenities.push('Badewanne');
        }

        if (this.cableSatTv()) {
            amenities.push('Kabel / Sat. / TV');
        }

        if (this.barrierFree()) {
            amenities.push('Barrierefrei');
        }

        if (this.basementRoom()) {
            amenities.push('Keller');
        }

        if (this.balconies() > 0) {
            amenities.push('Balkon');
        }

        if (this.terraces() > 0) {
            amenities.push('Terrasse');
        }

        if (this.petsAllowed()) {
            amenities.push('Tierhaltung');
        }

        if (this.gardenUsage()) {
            amenities.push('Gartennutzung');
        }

        return amenities;
    };

    this.serviceCharge = function () {
        if (this.preise != null) {
            if (this.preise.nebenkosten != null && this.preise.nebenkosten != '') {
                return this.preise.nebenkosten;
            }
        }

        return null;
    };

    this.operationalCosts = function () {
        if (this.preise != null) {
            if (this.preise.betriebskostennetto != null && this.preise.betriebskostennetto != '') {
                return this.preise.betriebskostennetto;
            }
        }

        return null;
    };

    this.heatingCosts = function () {
        if (this.preise != null) {
            return this.preise.heizkosten;
        }

        return null;
    };

    this.heatingCostsInServiceCharge = function () {
        if (this.preise != null) {
            return this.preise.heizkosten_enthalten;
        }

        return null;
    };

    this.securityDeposit = function () {
        if (this.preise != null) {
            return this.preise.kaution;
        }

        return null;
    };

    this.provision = function () {
        if (this.preise != null) {
            return this.preise.provisionnetto;
        }

        return null;
    };

    this.subjectToCommission = function () {
        if (this.preise != null) {
            return this.preise.provisionspflichtig;
        }

        return null;
    };

    this.livingArea = function () {
        if (this.flaechen != null) {
            return this.flaechen.wohnflaeche;
        }

        return null;
    };

    this.availableFrom = function () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.abdatum != null) {
                var date = new Date(this.verwaltung_objekt.abdatum);
                return homeinfo.date.date(date);
            } else if (this.verwaltung_objekt.verfuegbar_ab != null) {
                return this.verwaltung_objekt.verfuegbar_ab;
            }
        }

        return null;
    };

    this.councilFlat = function () {
        if (this.verwaltung_objekt != null) {
            return this.verwaltung_objekt.wbs_sozialwohnung;
        }
    };

    this.constructionYear = function () {
        if (this.zustand_angaben != null) {
            return this.zustand_angaben.baujahr;
        }

        return null;
    };

    /*
      Returns the real estate's state.
    */
    this.state = function () {
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
    };

    /*
      Returns the last modernization.
    */
    this.lastModernization = function () {
        if (this.zustand_angaben != null) {
            return this.zustand_angaben.letztemodernisierung;
        }

        return null;
    };

    /*
      Returns the heating types.
    */
    this.heatingTypes = function () {
        var heatingTypes = [];

        if (this.ausstattung != null) {
            if (this.ausstattung.heizungsart != null) {
                if (this.ausstattung.heizungsart.OFEN) {
                    heatingTypes.push('Ofen');
                }

                if (this.ausstattung.heizungsart.ETAGE) {
                    heatingTypes.push('Etagenheizung');
                }

                if (this.ausstattung.heizungsart.ZENTRAL) {
                    heatingTypes.push('Zentralheizung');
                }

                if (this.ausstattung.heizungsart.FERN) {
                    heatingTypes.push('Fernwärme');
                }

                if (this.ausstattung.heizungsart.FUSSBODEN) {
                    heatingTypes.push('Fussbodenheizung');
                }
            }
        }

        return heatingTypes;
    };

    /*
      Returns the heating type.
    */
    this.heatingType = function () {
        var heatingTypes = this.heatingTypes();

        if (heatingTypes.length == 0) {
            return immobrowse.config.na;
        }

        return heatingTypes.join(', ');
    };

    /*
      Determines whether the real estate is listed.
    */
    this.listed = function () {
        if (this.verwaltung_objekt != null) {
            if (this.verwaltung_objekt.denkmalgeschuetzt != null) {
                return this.verwaltung_objekt.denkmalgeschuetzt;
            }
        }

        return null;
    };

    /*
      Aggregates energy performance certificate data.
    */
    this.energyCertificate = function () {
        try {
            var energiepass = this.zustand_angaben.energiepass[0];
        } catch(err) {
            return null;
        }

        var energyCertificate = {};

        if (energiepass.epart == null) {
            energyCertificate.type = 'Nicht angegeben';
        } else if (energiepass.epart == 'VERBRAUCH') {
            energyCertificate.type = 'Verbrauchsausweis';

            if (energiepass.energieverbrauchkennwert != null && energiepass.energieverbrauchkennwert != '') {
                var consumption = immobrowse.germanDecimal(Number(homeinfo.str.comma2dot(
                    energiepass.energieverbrauchkennwert))) + immobrowse.config.kwh;
                energyCertificate.value = consumption;
                energyCertificate.consumption = consumption;
            }
        } else {
            energyCertificate.type = 'Bedarfsausweis';

            if (energiepass.endenergiebedarf != null && energiepass.endenergiebedarf != '') {
                var demand = immobrowse.germanDecimal(Number(homeinfo.str.comma2dot(
                    energiepass.endenergiebedarf))) + immobrowse.config.kwh;
                energyCertificate.value = demand;
                energyCertificate.demand = demand;
            }
        }

        if (energiepass.baujahr != null && energiepass.baujahr != '') {
            energyCertificate.constructionYear = energiepass.baujahr;
        } else {
            // Fall back to real estate's construction year.
            var constructionYear = this.constructionYear();

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
    };

    this.contact = function () {
        if (this.kontaktperson == null) {
            return null;
        }

        var contact = {};
        var name = [];
        var address = [];

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
    };

    this.amenitiesTags = function () {
        var amenities = this.amenities();
        var elements = [];

        for (var i = 0; i < amenities.length; i++) {
            elements.push(immobrowse.dom.AmenitiesTag(amenities[i]));
        }

        return elements;
    };

    this.amenitiesList = function () {
        var amenities = this.amenities();

        if (amenities.length > 0) {
            var html = '<ul class="ib-amenities-list">';

            for (var i = 0; i < amenities.length; i++) {
                html += '<li>' + amenities[i] + '</li>';
            }

            return html + '</ul>';
        }

        return '–';
    };

    this.renderEnergyCertificate = function (elements) {
        if (elements != null) {
            var energyCertificate = this.energyCertificate();

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
    };

    this.renderContact = function (elements) {
        if (elements != null) {
            var contact = this.contact();

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
    };

    this.renderImage = function (element, image) {
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
    };

    /*
      Renders the real estate data into the specified elements.
      All elements are optional.
    */
    this.render = function (elements) {
        // Miscellaneous.
        immobrowse.setValue(elements.objectId, this.objectId());
        immobrowse.setValue(elements.objectTitle, this.objectTitle());

        if (this.showAddress()) {
            immobrowse.setValue(elements.address, this.address());
        }

        immobrowse.setValue(elements.objectTitle, this.objectTitle());
        immobrowse.setValue(elements.type, this.type());
        // Prices.
        immobrowse.setValue(elements.coldRent, immobrowse.euro(this.rent()));
        immobrowse.setValue(elements.warmRent, immobrowse.euro(this.warmRent()));
        immobrowse.setValue(elements.totaledUpRent, immobrowse.euro(this.totaledUpRent()));
        immobrowse.setValue(elements.totalRent, immobrowse.euro(this.totalRent()));
        immobrowse.setValue(elements.serviceCharge, immobrowse.euro(this.serviceCharge()));
        immobrowse.setValue(elements.operationalCosts, immobrowse.euro(this.operationalCosts()));
        immobrowse.setValue(elements.heatingCosts, immobrowse.euro(this.heatingCosts()));
        immobrowse.setValue(elements.heatingCostsInServiceCharge, immobrowse.yesNo(this.heatingCostsInServiceCharge()));
        immobrowse.setValue(elements.securityDeposit, immobrowse.euro(this.securityDeposit()));
        immobrowse.setValue(elements.provision, immobrowse.euro(this.provision()));
        immobrowse.setValue(elements.subjectToCommission, immobrowse.yesNo(this.subjectToCommission()));
        // Areas.
        immobrowse.setValue(elements.livingArea, immobrowse.squareMeters(this.livingArea()));
        immobrowse.setValue(elements.rooms, this.rooms());
        immobrowse.setValue(elements.bathrooms, this.bathrooms());
        immobrowse.setValue(elements.bedrooms, this.bedrooms());
        immobrowse.setValue(elements.floor, this.floor());
        // Amenities and state.
        immobrowse.setValue(elements.petsAllowed, immobrowse.yesNo(this.petsAllowed()));
        immobrowse.setValue(elements.gardenUsage, immobrowse.yesNo(this.gardenUsage()));
        immobrowse.setValue(elements.availableFrom, this.availableFrom());
        immobrowse.setValue(elements.councilFlat, immobrowse.yesNo(this.councilFlat()));
        immobrowse.setValue(elements.constructionYear, this.constructionYear());
        immobrowse.setValue(elements.state, this.state());
        immobrowse.setValue(elements.lastModernization, this.lastModernization());
        immobrowse.setValue(elements.heatingType, this.heatingType());
        this.renderEnergyCertificate(elements.energyCertificate);
        // Description texts.
        immobrowse.setValue(elements.description, this.description());
        immobrowse.setValue(elements.exposure, this.exposure());
        immobrowse.setValue(elements.amenities, this.amenitiesDescription());
        immobrowse.setValue(elements.miscellanea, this.miscellanea());
        this.renderContact(elements.contact);
        immobrowse.setValue(elements.amenitiesList, this.amenitiesList());
        this.renderImage(elements.titleImage, this.titleImage());
        this.renderImage(elements.floorplan, this.floorplan());

        if (this.listed()) {
            immobrowse.setValue(elements.listedHint, immobrowse.config.listedHint);
        }
    };

    /*
      Returns a list of data fields.
    */
    this._dataFields = function (elements) {
        elements = elements || this._defaultElements;
        var dataFields = [];
        var element;

        for (var i = 0; i < elements.length; i++) {
            element = elements[i];

            switch (element.name) {
            case 'coldRent':
                immobrowse.dom.preview.addDataFieldCol(element, immobrowse.euro(this.rent()), dataFields);
                break;
            case 'totalRent':
                immobrowse.dom.preview.addDataFieldCol(element, immobrowse.euro(this.totalRent()), dataFields);
                break;
            case 'serviceCharge':
                immobrowse.dom.preview.addDataFieldCol(element, immobrowse.euro(this.serviceCharge()), dataFields);
                break;
            case 'operationalCosts':
                immobrowse.dom.preview.addDataFieldCol(element, immobrowse.euro(this.operationalCosts()), dataFields);
                break;
            case 'rooms':
                immobrowse.dom.preview.addDataFieldCol(element, this.rooms() || immobrowse.config.na, dataFields);
                break;
            case 'area':
                immobrowse.dom.preview.addDataFieldCol(element, this.area() || immobrowse.config.na, dataFields);
                break;
            }
        }

        return dataFields;
    };

    /*
      Converts the real estate into a DOM element for list view.
    */
    this.preview = function (elements) {
        var addressRow = null;

        if (this.showAddress() && immobrowse.config.addressInList) {
            addressRow = immobrowse.dom.preview.AddressRow(immobrowse.dom.preview.ObjectAddress(this.address()));
        }

        return immobrowse.dom.preview.Entry(
            immobrowse.dom.preview.MainRow(
                immobrowse.dom.preview.ImageCol(
                    immobrowse.dom.preview.ImageFrame(
                        immobrowse.dom.preview.TitleImage(this.attachmentURL(this.titleImage()))
                    )
                ),
                immobrowse.dom.preview.DataCol(
                    immobrowse.dom.preview.TitleRow(immobrowse.dom.preview.ObjectTitle(this.objectTitle() || immobrowse.config.na)),
                    addressRow,
                    immobrowse.dom.preview.DataRow(this._dataFields(elements)),
                    immobrowse.dom.preview.AmenitiesTags(this.amenitiesTags())
                )
            ),
            this.detailsURL()
        );
    };
};


/*
  Queries real estate data from the API and returns a thenable.
*/
immobrowse.RealEstate.get = function (id) {
    function success (json) {
        return new immobrowse.RealEstate(json);
    }

    function error () {
        swal({
            title: 'Immobilie konnte nicht geladen werden.',
            text: 'Bitte versuchen Sie es später noch ein Mal.',
            type: 'error'
        });
    }

    return jQuery.ajax({url: 'https://backend.homeinfo.de/immobrowse/expose/' + id}).then(success, error);
};


/*
  Queries API for real estate list and returns a thenable.
*/
immobrowse.RealEstate.list = function (cid) {
    function success (json) {
        var realEstates = [];

        for (var i = 0; i < json.length; i++) {
            realEstates.push(new immobrowse.RealEstate(json[i]));
        }

        return realEstates;
    }

    function error () {
        swal({
            title: 'Immobilien konnten nicht geladen werden.',
            text: 'Bitte versuchen Sie es später noch ein Mal.',
            type: 'error'
        });
    }

    return jQuery.ajax({url: 'https://backend.homeinfo.de/immobrowse/list/' + cid}).then(success, error);
};


/*
  Real estate list class.
*/
immobrowse.List = function (realEstates) {
    this.realEstates = realEstates;

    /*
      Sorts real estates.
    */
    this.sort = function (property, order) {
        this.realEstates.sort(immobrowse.getSorter(property, order));
    };

    /*
      Renders the respective real estates into the given HTML element.
    */
    this.render = function (listElement, elements) {
        listElement.html('');  // Clear element.

        for (var i = 0; i < this.realEstates.length; i++) {
            listElement.append(this.realEstates[i].preview(elements));
        }
    };
};


/*
  ImmoBrowse's DOM factories.
*/
immobrowse.dom = immobrowse.dom || {};


immobrowse.dom.OvalInner = function (content) {
    var element = document.createElement('div');
    element.setAttribute('class', 'oval-inner');
    element.innerHTML = content;
    return element;
};


immobrowse.dom.OvalOuter = function (ovalInner) {
    var element = document.createElement('div');
    element.setAttribute('class', 'oval-outer');
    element.appendChild(ovalInner);
    return element;
};


immobrowse.dom.AmenitiesTag = function (content) {
    return immobrowse.dom.OvalOuter(immobrowse.dom.OvalInner(content));
};


immobrowse.dom.Numerator = function (content) {
    var element = document.createElement('span');
    element.setAttribute('class', 'numerator');
    element.innerHTML = content;
    return element;
};


immobrowse.dom.Denominator = function (content) {
    var element = document.createElement('span');
    element.setAttribute('class', 'denominator');
    element.innerHTML = content;
    return element;
};


immobrowse.dom.Fraction = function (numerator, denominator) {
    var element = document.createElement('span');
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
    var caption = element.caption;
    var hide = element.hide || false;

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
    var element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-data-caption');
    element.innerHTML = caption;
    return element;
};


immobrowse.dom.preview.DataFieldValue = function (value) {
    var element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-data-value');
    element.innerHTML = value;
    return element;
};


immobrowse.dom.preview.DataFieldRow = function (child) {
    var element = document.createElement('div');
    element.setAttribute('class', 'row');
    element.appendChild(child);
    return element;
};


immobrowse.dom.preview.DataFieldCol = function (captionRow, valueRow) {
    var element = document.createElement('div');
    element.setAttribute('class', 'col-md-3');
    element.appendChild(captionRow);
    element.appendChild(valueRow);
    return element;
};


immobrowse.dom.preview.DataRow = function (dataColumns) {
    var element = document.createElement('div');
    element.setAttribute('class', 'row row-centered ib-preview-data');

    for (var i = 0; i < dataColumns.length; i++) {
        element.appendChild(dataColumns[i]);
    }

    return element;
};


immobrowse.dom.preview.ObjectAddress = function (address) {
    var element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-title');
    element.innerHTML = address;
    return element;
};


immobrowse.dom.preview.AddressRow = function (objectAddress) {
    var element = document.createElement('div');
    element.setAttribute('class', 'row row-centered');
    element.appendChild(objectAddress);
    return element;
};


immobrowse.dom.preview.ObjectTitle = function (title) {
    var element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-title');
    element.innerHTML = title;
    return element;
};


immobrowse.dom.preview.TitleRow = function (objectTitle) {
    var element = document.createElement('div');
    element.setAttribute('class', 'row row-centered');
    element.appendChild(objectTitle);
    return element;
};


immobrowse.dom.preview.DataCol = function (titleRow, addressRow, dataRow, amenitiesTags) {
    var element = document.createElement('div');
    element.setAttribute('class', 'col-sm-8');
    element.appendChild(titleRow);

    if (addressRow != null) {
        element.appendChild(addressRow);
    }

    element.appendChild(dataRow);
    element.appendChild(amenitiesTags);
    return element;
};


immobrowse.dom.preview.TitleImage = function (url) {
    var element = document.createElement('img');

    if (url == null) {
        url = 'img/dummy.jpg';
    }

    element.setAttribute('src', url);
    element.setAttribute('class', 'ib-framed-image');
    element.setAttribute('alt', 'Titelbild');
    return element;
};


immobrowse.dom.preview.ImageFrame = function (image) {
    var element = document.createElement('div');
    element.setAttribute('class', 'ib-image-frame');
    element.appendChild(image);
    return element;
};


immobrowse.dom.preview.ImageCol = function (imageFrame) {
    var element = document.createElement('div');
    element.setAttribute('class', 'col-sm-4');
    element.appendChild(imageFrame);
    return element;
};


immobrowse.dom.preview.MainRow = function (imageCol, dataCol) {
    var element = document.createElement('div');
    element.setAttribute('class', 'row row-centered ib-preview-container');
    element.appendChild(imageCol);
    element.appendChild(dataCol);
    return element;
};


immobrowse.dom.preview.AmenitiesTags = function (amenities) {
    var element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-tags');

    for (var i = 0; i < amenities.length; i++) {
        element.appendChild(amenities[i]);
    }

    return element;
};


immobrowse.dom.preview.Entry = function (mainRow, detailsURL) {
    var element = document.createElement('div');
    element.setAttribute('class', 'ib-preview-item');
    element.setAttribute('onclick', 'immobrowse.open("' + detailsURL + '");');
    element.appendChild(mainRow);
    return element;
};


/*
  Customer-dependent configuration defaults.
*/
immobrowse.config = immobrowse.config || {};
immobrowse.config.listedHint = immobrowse.config.listedHint || 'Gebäude liegt im Denkmalschutzbereich.';
immobrowse.config.na = immobrowse.config.na || 'k. A.';
immobrowse.config.kwh = immobrowse.config.kwh || immobrowse.dom.Kwhsma().outerHTML;
immobrowse.config.addressInList = immobrowse.config.addressInList || false;
