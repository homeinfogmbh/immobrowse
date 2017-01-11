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


immobrowse.Geo = function (street, houseNumber, city, zipCode, district) {
    this.street = street;
    this.houseNumber = houseNumber;
    this.city = city;
    this.zipCode = zipCode;
    this.district = district;
}


immobrowse.Geo.dummy = function () {
    return new immobrowse.Geo('Am Alten Forsthaus', 4, '44225', 'Dortmund', 'Hombruch');
}


immobrowse.Areas = function (rooms, livingArea) {
    this.rooms = rooms;
    this.livingArea = livingArea;
}


immobrowse.Marketing = function (sale, rent) {
    this.sale = sale;
    this.rent = rent;
}


immobrowse.Prices = function (coldRentNet, coldRent, warmRent, serviceCharge, operationalCharge, heatingCost, heatingCostInServiceCharge) {
    this.coldRentNet = coldRentNet;
    this.coldRent = coldRent;
    this.warmRent = warmRent;
    this.serviceCharge = serviceCharge;
    this.operationalCharge = operationalCharge;
    this.heatingCost = heatingCost;
    this.heatingCostInServiceCharge = heatingCostInServiceCharge;
}


immobrowse.Attachment = function(title, group, mimeType, url) {
    this.title = title;
    this.group = group;
    this.mimeType = mimeType;
    this.url = url;
}


immobrowse.RentalFlat = function (id, geo, areas, prices, attachments) {
    this.id = id;
    this.geo = geo;
    this.areas = areas;
    this.prices = prices;
    this.attachments = attachments || [];

    this.titleImage = function () {
        for (attachment of this.attachments) {
            if (attachment.group == 'TITELBILD') {
                return new immobrowse.TitleImage(attachment.url);
            }
        }

        // Fall back on any attachment
        for (attachment of this.attachments) {
            return new immobrowse.TitleImage(attachment.url);
        }
    }

    this.htmlPreview = function () {
        var html = '<div class="row panel-body">';
        html += this.titleImage().html();
        html += '<div class="col-md-9">';
        html += '<div class="col-md-12 col-sm-12 col-xs-12">';
        html += '<h4><strong>';
        html += this.areas.rooms;
        html += ' Zimmer Wohnung | ';
        html += this.geo.street;
        html += ' ';
        html += this.geo.houseNumber;
        html += ' | ';
        html += this.geo.city;
        html += ' ';
        html += this.geo.district;
        html += '</strong></h4>';
        html += '<small>';
        html += 'Wohnung zur Miete';
        html += '</small>';
        html += '<div class="row col-md-12 col-sm-12 col-xs-12" style="margin-top:10px;">';
        html +='<div class="col-md-4">';
        html += '<h4><strong>';
        html += immobrowse.euroHtml(this.prices.coldRentNet);
        html += '</strong></h4>';
        html += '<small>';
        html += 'Miete zzgl. NK';
        html += '</small>';
        html += '</div><div class="col-md-4">';
        html += '<h4><strong>';
        html += immobrowse.squareMetersHtml(this.areas.livingArea);
        html += '</strong></h4>';
        html += '<small>';
        html += 'Wohnfl&auml;che';
        html += '</small>';
        html += '</div>';
        html += '<div class="col-md-4">';
        html += '<h4><strong>';
        html += this.areas.rooms;
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
}
