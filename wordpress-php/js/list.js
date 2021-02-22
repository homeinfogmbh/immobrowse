/*
  list.js - ImmoBrowse list front end JavaScript

  (C) 2017-2020 HOMEINFO - Digitale Informationssysteme GmbH

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
      * immobrowse.js
      * immobrowse-dom.js
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.wordpress = immobrowse.wordpress || {};
immobrowse.wordpress.sorting = {
    property: null,
    order: null
};
immobrowse.wordpress.realEstates = null;
immobrowse.wordpress.listElement = null;


immobrowse.wordpress.toggleOrder = function () {
    const previousOrder = immobrowse.wordpress.sorting.order;

    if (immobrowse.wordpress.sorting.order == 'descending') {
        immobrowse.wordpress.sorting.order = 'ascending';
    } else {
        immobrowse.wordpress.sorting.order = 'descending';
    }

    return previousOrder;
};


immobrowse.wordpress.toggleSorting = function (property) {
    const previousIssuer = document.getElementById('ib-sort-' + immobrowse.wordpress.sorting.property);
    const issuer = document.getElementById('ib-sort-' + property);
    immobrowse.wordpress.toggleOrder();
    immobrowse.wordpress.sorting.property = property;

    // Remove arrow symbol.
    if (previousIssuer != null) {
        previousIssuer.innerHTML = previousIssuer.innerHTML.slice(0, -1);
    }

    switch (immobrowse.wordpress.sorting.order) {
    case 'ascending':
        issuer.innerHTML += ' &darr;';
        break;
    case 'descending':
        issuer.innerHTML += ' &uarr;';
        break;
    }

    immobrowse.wordpress.list();
};


immobrowse.wordpress.renderDistricts = function (districtsElement, districtElements) {
    districtsElement.html('');

    for (const districtElement of districtElements) {
        districtsElement.append(districtElement);
    }

    jQuery('.ib-select-district').click(function() {
        immobrowse.wordpress.list();
    });
};


immobrowse.wordpress.selectedDistricts = function () {
    const districts = [];
    const checkboxes = document.getElementsByClassName('ib-select-district');

    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            districts.push(checkbox.getAttribute('name'));
        }
    }

    /* Add districts from query string iff none have been selected. */
    if (districts.length == 0) {
        const url = new URL(location);
        const params = new URLSearchParams(url.search);
        const district = params.get('ortsteil');

        if (district != null && district != ''){
            districts.push(district);
        }
    }

    return districts;
};


immobrowse.wordpress.filters = function () {
    let priceMax = jQuery('#ib-price-max').val();

    if (! priceMax) {
        priceMax = Infinity;
    } else {
        priceMax = Number(priceMax.replace(',', '.'));
    }

    let priceMin = jQuery('#ib-price-min').val();

    if (! priceMin) {
        priceMin = 0;
    } else {
        priceMin = Number(priceMin.replace(',', '.'));
    }

    let areaMin = jQuery('#ib-area-min').val();

    if (! areaMin) {
        areaMin = 0;
    } else {
        areaMin = Number(areaMin.replace(',', '.'));
    }

    let roomsMin = jQuery('#ib-rooms-min').val();

    if (! roomsMin) {
        roomsMin = 0;
    } else {
        roomsMin = Number(roomsMin.replace(',', '.'));
    }

    return {
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
        districts: immobrowse.wordpress.selectedDistricts()
    };
};


immobrowse.wordpress.list = function () {
    const filter = new immobrowse.Filter(immobrowse.wordpress.filters());
    const list = new immobrowse.List(filter.filter(immobrowse.wordpress.realEstates));

    if (immobrowse.wordpress.sorting.property != null) {
        list.sort(immobrowse.wordpress.sorting.property, immobrowse.wordpress.sorting.order);
    }

    if (list.realEstates.length > 0) {
        list.render(immobrowse.wordpress.listElement);
    } else {
        immobrowse.wordpress.listElement.html('Keine Angebote vorhanden.');
    }
};


immobrowse.wordpress.render = function (realEstates) {
    immobrowse.wordpress.realEstates = realEstates;
    immobrowse.wordpress.renderDistricts(jQuery('#ib-districts'), immobrowse.districtElements(immobrowse.wordpress.realEstates));
    immobrowse.wordpress.list();
    jQuery('#loader').hide();
};

immobrowse.wordpress.initList = function () {
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
        immobrowse.wordpress.list();
    });

    jQuery('.ib-filter-amenities-option').click(function() {
        immobrowse.wordpress.list();
    });

    immobrowse.wordpress.listElement = jQuery('#list');
    immobrowse.RealEstate.list(customer).then(immobrowse.wordpress.render);
};


jQuery(document).ready(immobrowse.wordpress.initList);