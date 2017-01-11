/*
    immobrowse.js - ImmoBrowse main JavaScript library

    (C) 2015 HOMEINFO - Digitale Informationssysteme GmbH

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
    return (price.toFixed(2) + ' &#8364;').replace('.',',');
}


immobrowse.squareMetersHtml = function (area) {
    return (area.toFixed(2) + ' m&#178;').replace('.', ',');
}


immobrowse.TitleImage = function (url) {
    this.url = url;
    this.img = function () {
        return '<img src="' + this.url + '" class="portrait" id="immosearch_image" width="300" height="201">';
    }
    this.html = function () {
        return '<div class="col-md-3"><div class="img_mask img-responsive img-thumbnail">' + this.img() + '</div></div>';
    }
}


immobrowse.preview = function (immobilie) {
    var html = '<div class="row panel-body">';
    html += new immobrowse.TitleImage('https://tls.homeinfo.de/immosearch/attachment/2776312').html();
    html += '<div class="col-md-9">';
    html += '<div class="col-md-12 col-sm-12 col-xs-12">';
    html += '<h4><strong>';
    html += 2;
    html += ' Zimmer Wohnung | ';
    html += immobilie.geo.strasse;
    html += ' ';
    html += immobilie.geo.hausnummer;
    html += ' | ';
    html += immobilie.geo.stadt;
    html += ' ';
    html += immobilie.geo.regionaler_zusatz;
    html += '</strong></h4>';
    html += '<small>';
    html += 'Wohnung zur Miete';
    html += '</small>';
    html += '<div class="row col-md-12 col-sm-12 col-xs-12" style="margin-top:10px;">';
    html +='<div class="col-md-4">';
    html += '<h4><strong>';
    html += immobrowse.euroHtml(123.12);
    html += '</strong></h4>';
    html += '<small>';
    html += 'Miete zzgl. NK';
    html += '</small>';
    html += '</div><div class="col-md-4">';
    html += '<h4><strong>';
    html += immobrowse.squareMetersHtml(20.0);
    html += '</strong></h4>';
    html += '<small>';
    html += 'Wohnfl&auml;che';
    html += '</small>';
    html += '</div>';
    html += '<div class="col-md-4">';
    html += '<h4><strong>';
    html += 2;
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
