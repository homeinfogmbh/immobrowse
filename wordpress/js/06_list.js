/*
  list.js - ImmoBrowse list front end JavaScript

  (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.    See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.    If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>

  Requires:
      * jquery.js
      * sweetalert.js
      * immobrowse.js
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.wbsWuppertal = immobrowse.wbsWuppertal || {};
immobrowse.wbsWuppertal.sorting = {
    property: null,
    order: null
};
immobrowse.wbsWuppertal.realEstates = null;
immobrowse.wbsWuppertal.listElement = null;


immobrowse.wbsWuppertal.toggleOrder = function () {
    var previousOrder = immobrowse.wbsWuppertal.sorting.order;

    if (immobrowse.wbsWuppertal.sorting.order == 'descending') {
        immobrowse.wbsWuppertal.sorting.order = 'ascending';
    } else {
        immobrowse.wbsWuppertal.sorting.order = 'descending';
    }

    return previousOrder;
};


immobrowse.wbsWuppertal.toggleSorting = function (property) {
    var previousIssuer = document.getElementById('ib-sort-' + immobrowse.wbsWuppertal.sorting.property);
    var issuer = document.getElementById('ib-sort-' + property);
    immobrowse.wbsWuppertal.toggleOrder();
    immobrowse.wbsWuppertal.sorting.property = property;

    // Remove arrow symbol
    if (previousIssuer != null) {
        previousIssuer.innerHTML = previousIssuer.innerHTML.slice(0, -1);
    }

    switch (immobrowse.wbsWuppertal.sorting.order) {
    case 'ascending':
        issuer.innerHTML += ' &darr;';
        break;
    case 'descending':
        issuer.innerHTML += ' &uarr;';
        break;
    }

    immobrowse.wbsWuppertal.list();
};


immobrowse.wbsWuppertal.renderDistricts = function (districtsElement, districtElements) {
    districtsElement.html('');

    for (var i = 0; i < districtElements.length; i++) {
        districtsElement.append(districtElements[i]);
    }

    jQuery('.ib-select-district').click(function() {
        immobrowse.wbsWuppertal.list();
    });
};


immobrowse.wbsWuppertal.selectedDistricts = function () {
    var districts = [];
    var checkboxes = document.getElementsByClassName('ib-select-district');

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            districts.push(checkboxes[i].getAttribute('name'));
        }
    }

    /* Add districts from query string iff none have been selected. */
    if (districts.length == 0) {
        var args = new homeinfo.QueryString();
        var district = args.ortsteil;

        if (district != null && district != ''){
            districts.push(district);
        }
    }

    return districts;
};


immobrowse.wbsWuppertal.filters = function () {
    var priceMax = jQuery('#ib-price-max').val();

    if (! priceMax) {
        priceMax = Infinity;
    } else {
        priceMax = Number(homeinfo.str.comma2dot(priceMax));
    }

    var priceMin = jQuery('#ib-price-min').val();

    if (! priceMin) {
        priceMin = 0;
    } else {
        priceMin = Number(homeinfo.str.comma2dot(priceMin));
    }

    var areaMin = jQuery('#ib-area-min').val();

    if (! areaMin) {
        areaMin = 0;
    } else {
        areaMin = Number(homeinfo.str.comma2dot(areaMin));
    }

    var roomsMin = jQuery('#ib-rooms-min').val();

    if (! roomsMin) {
        roomsMin = 0;
    } else {
        roomsMin = Number(homeinfo.str.comma2dot(roomsMin));
    }

    var filters = {
        types: immobrowse.config.types,
        marketing: immobrowse.config.marketing,
        priceMin: priceMin,
        priceMax: priceMax == 0 ? Infinity: priceMax,
        areaMin: areaMin,
        roomsMin: roomsMin,
        ebk: jQuery('#ib-filter-kitchen').is(':checked'),
        bathtub: jQuery('#ib-filter-bathtub').is(':checked'),
        window: jQuery('#ib-filter-window').is(':checked'),
        balcony: jQuery('#ib-filter-balcony').is(':checked'),
        carSpace: jQuery('#ib-filter-carspace').is(':checked'),
        guestwc: jQuery('#ib-filter-guestwc').is(':checked'),
        elevator: jQuery('#ib-filter-elevator').is(':checked'),
        garden: jQuery('#ib-filter-garden').is(':checked'),
        districts: immobrowse.wbsWuppertal.selectedDistricts()
    };

    immobrowse.logger.debug('Filters:');
    immobrowse.logger.debug(JSON.stringify(filters));
    return filters;
};


immobrowse.wbsWuppertal.list = function () {
    var filter = new immobrowse.Filter(immobrowse.wbsWuppertal.filters());
    var list = new immobrowse.List(filter.filter(immobrowse.wbsWuppertal.realEstates));

    if (immobrowse.wbsWuppertal.sorting.property != null) {
        list.sort(immobrowse.wbsWuppertal.sorting.property, immobrowse.wbsWuppertal.sorting.order);
    }

    if (list.realEstates.length > 0) {
        list.render(immobrowse.wbsWuppertal.listElement);
    } else {
        immobrowse.wbsWuppertal.listElement.html('Keine Angebote vorhanden.');
    }
};


immobrowse.wbsWuppertal.render = function (realEstates) {
    immobrowse.wbsWuppertal.realEstates = realEstates;
    immobrowse.wbsWuppertal.renderDistricts(jQuery('#ib-districts'), immobrowse.districtElements(immobrowse.wbsWuppertal.realEstates));
    immobrowse.wbsWuppertal.list();
    jQuery('#loader').hide();
};

immobrowse.wbsWuppertal.initList = function () {
    // If customer is not set, bail out.
    if (typeof customer == 'undefined') {
        return;
    }

    jQuery('#ib-extsearch-button').click(function() {
        if (jQuery('#extendedSearch').attr('style') == 'display: none;')
            jQuery('#extendedSearch').slideDown();
        else
            jQuery('#extendedSearch').slideUp();
    });

    jQuery('.ib-btn-filter-option').on('input', function() {
        immobrowse.wbsWuppertal.list();
    });

    jQuery('.ib-filter-amenities-option').click(function() {
        immobrowse.wbsWuppertal.list();
    });

    immobrowse.wbsWuppertal.listElement = jQuery('#list');
    immobrowse.RealEstate.list(customer).then(immobrowse.wbsWuppertal.render);
};


jQuery(document).ready(immobrowse.wbsWuppertal.initList);
