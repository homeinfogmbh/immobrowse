/*
    immobrowse.js - ImmoBrowse main JavaScript library

    (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    Maintainer: Richard Neumann <r dot neumann at homeinfo period de>
*/


var immobrowse = immobrowse || {};


immobrowse.escapeHtml = function (string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;',
        "ä": '&auml;',
        "ö": '&#ouml;',
        "ü": '&#uuml;',
        "Ä": '&#Auml;',
        "Ö": '&#Ouml;',
        "Ü": '&#Uuml;',
        "ß": '&#szlig;'
    };
    return String(string).replace(/[&<>"'\/äöüÄÖÜß]/g, function (s) {
        return entityMap[s];
    });
}


immobrowse.euroHtml = function (price) {
    if (price == null) {
        return 'N/A';
    } else {
        return (price.toFixed(2) + ' &#8364;').replace('.',',');
    }
}


immobrowse.squareMetersHtml = function (area) {
    if (area == null) {
        return 'N/A';
    } else {
        return (area.toFixed(2) + ' m&#178;').replace('.', ',');
    }
}


immobrowse.titleImage = function (url) {
    return '<img src="' + url + '" class="portrait" id="immosearch_image" width="300" height="201">';
}


immobrowse.address2html = function (geo) {
    if (geo == null) {
        return 'N/A';
    } else {
        if (geo.strasse == null) {
            return 'N/A';
        } else {
            if (geo.hausnummer == null) {
                return geo.strasse;
            } else {
                return geo.strasse + ' ' + geo.hausnummer;
            }
        }
    }
}


immobrowse.city2html = function (geo) {
    if (geo == null) {
        return 'N/A';
    } else {
        if (geo.ort == null) {
            return 'N/A';
        } else {
            if (geo.regionaler_zusatz == null) {
                return geo.ort;
            } else {
                if (geo.regionaler_zusatz == geo.ort) {
                    return geo.ort;
                } else {
                    return geo.ort + ' ' + geo.regionaler_zusatz;
                }
            }
        }
    }
}


immobrowse.rooms = function (immobilie) {
    if (immobilie.flaechen == null) {
        return null;
    } else {
        if (immobilie.flaechen.anzahl_zimmer == null) {
            return null;
        } else {
            return immobilie.flaechen.anzahl_zimmer;
        }
    }
}


immobrowse.preview = function (immobilie) {
    var rooms = immobrowse.rooms(immobilie);
    var html = '<div class="row panel-body">';
    html += '<div class="col-md-3"><div class="img_mask img-responsive img-thumbnail">';
    html += immobrowse.titleImage('https://tls.homeinfo.de/immosearch/attachment/2776312');
    html += '</div></div>';
    html += '<div class="col-md-9">';
    html += '<div class="col-md-12 col-sm-12 col-xs-12">';
    html += '<h4><strong>';

    if (rooms == null) {
        html += 'Wohnung | ';
    } else {
        html += rooms + ' Zimmer Wohnung | ';
    }

    html += immobrowse.address2html(immobilie.geo);
    html += ' | ';
    html += immobrowse.city2html(immobilie.geo);
    html += '</strong></h4>';
    html += '<small>';
    html += 'Wohnung zur Miete';
    html += '</small>';
    html += '<div class="row col-md-12 col-sm-12 col-xs-12" style="margin-top:10px;">';
    html += '<div class="col-md-4">';
    html += '<h4><strong>';

    if (immobilie.preise == null) {
        html += 'N/A';
    } else {
        html += immobrowse.euroHtml(immobilie.preise.nettokaltmiete);
    }

    html += '</strong></h4>';
    html += '<small>';
    html += 'Miete zzgl. NK';
    html += '</small>';
    html += '</div><div class="col-md-4">';
    html += '<h4><strong>';

    if (immobilie.flaechen == null) {
        html += 'N/A';
    } else {
        html += immobrowse.squareMetersHtml(immobilie.flaechen.wohnflaeche);
    }

    html += '</strong></h4>';
    html += '<small>';
    html += 'Wohnfl&auml;che';
    html += '</small>';
    html += '</div>';
    html += '<div class="col-md-4">';
    html += '<h4><strong>';

    if (rooms == null) {
        html += 'N/A';
    } else {
        html += rooms;
    }

    html += '</strong></h4>';
    html += '<small>';
    html += 'Zimmer';
    html += '</small>';
    html += '</div>';
    html += '</div>';
    html += '<div class="col-md-12 col-sm-12 col-xs-12" style="margin-top:25px;"></div>';
    html += '</div>';
    html += '</div>';
    return html;
}


/*
  Compares two nullable numerical values so
  that null values always come out last.
*/
immobrowse.compareNullLast = function (alice, bob, descending) {
    if (alice == null) {
        if (bob == null) {
            return 0;
        } else {
            return bob;
        }
    } else {
        if (bob == null) {
            return -1 * alice;
        } else {
            if (descending) {
                return bob - alice;
            } else {
                return alice - bob;
            }
        }
    }
}


immobrowse.sortByRooms = function (descending) {
    function compareRooms(immobilie1, immobilie2) {
        return immobrowse.compareNullLast(
            immobrowse.rooms(immobilie1),
            immobrowse.rooms(immobilie2),
            descending);
    }

    return compareRooms;
}


immobrowse.details = function (immobilie) {
    html = '';
}
