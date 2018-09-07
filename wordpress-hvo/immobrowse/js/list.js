/*
  list.js - ImmoBrowse list front end JavaScript

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

  Requires:
    * jquery.js
    * sweetalert.js
    * immobrowse.js
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.list = immobrowse.list || {};
immobrowse.list.args;
immobrowse.list.sorting;
immobrowse.list.realEstates;
immobrowse.list.listElement;


immobrowse.list.toggleOrder = function () {
    var previousOrder = immobrowse.list.sorting.order;

    if (immobrowse.list.sorting.order == 'descending') {
        immobrowse.list.sorting.order = 'ascending';
    } else {
        immobrowse.list.sorting.order = 'descending';
    }

    return previousOrder;
};


immobrowse.list.toggleSorting = function (property) {
    var previousIssuer = document.getElementById('ib-sort-' + immobrowse.list.sorting.property);
    var issuer = document.getElementById('ib-sort-' + property);
    immobrowse.list.toggleOrder();
    immobrowse.list.sorting.property = property;

    // Remove arrow symbol
    if (previousIssuer != null) {
        previousIssuer.innerHTML = previousIssuer.innerHTML.slice(0, -1);
    }

    switch (immobrowse.list.sorting.order) {
        case 'ascending':
            issuer.innerHTML += ' &darr;';
            break;
        case 'descending':
            issuer.innerHTML += ' &uarr;';
            break;
    }

    immobrowse.list.list();
};


immobrowse.list.renderDistricts = function (districtsElement, districtElements) {
    districtsElement.html('');

    for (var i = 0; i < districtElements.length; i++) {
        districtsElement.append(districtElements[i]);
    }

    jQuery('.ib-select-district').click(function() {
        immobrowse.list.list();
    });
};


immobrowse.list.selectedDistricts = function () {
    var districts = [];
    var checkboxes = document.getElementsByClassName('ib-select-district');

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            districts.push(checkboxes[i].getAttribute('name'));
        }
    }

    if (immobrowse.list.args.ortsteil){
        districts.push(immobrowse.list.args.ortsteil);
    }

    return districts;
};


immobrowse.list.filters = function () {
    var priceMax = Number(homeinfo.str.comma2dot(jQuery('#ib-price-max').val()));
    return {
        types: immobrowse.config.types,
        marketing: immobrowse.config.marketing,
        priceMin: Number(homeinfo.str.comma2dot(jQuery('#ib-price-min').val())),
        priceMax: priceMax == 0 ? Infinity: priceMax,
        areaMin: Number(homeinfo.str.comma2dot(jQuery('#ib-area-min').val())),
        roomsMin: Number(homeinfo.str.comma2dot(jQuery('#ib-rooms-min').val())),
        ebk: jQuery("#ib-filter-kitchen").is(':checked'),
        bathtub: jQuery("#ib-filter-bathtub").is(':checked'),
        window: jQuery("#ib-filter-window").is(':checked'),
        balcony: jQuery("#ib-filter-balcony").is(':checked'),
        carSpace: jQuery("#ib-filter-carspace").is(':checked'),
        guestwc: jQuery("#ib-filter-guestwc").is(':checked'),
        elevator: jQuery("#ib-filter-elevator").is(':checked'),
        garden: jQuery("#ib-filter-garden").is(':checked'),
        districts: immobrowse.list.selectedDistricts()
    };
};


immobrowse.list.list = function () {
    var filter = new immobrowse.Filter(immobrowse.list.filters());
    var list = new immobrowse.List(filter.filter(immobrowse.list.realEstates));

    if (immobrowse.list.sorting.property != null) {
        list.sort(immobrowse.list.sorting.property, immobrowse.list.sorting.order);
    }

    list.render(immobrowse.list.listElement);
};


immobrowse.list.init = function () {
    immobrowse.list.args = new homeinfo.QueryString();
    immobrowse.list.sorting = {
      property: null,
      order: null
    };
    immobrowse.list.listElement = jQuery('#list');

    jQuery('#ib-extsearch-button').click(function() {
        if (jQuery('#extendedSearch').attr('style') == "display: none;")
            jQuery('#extendedSearch').slideDown();
        else
            jQuery('#extendedSearch').slideUp();
    });

    jQuery('.ib-btn-filter-option').on('input',function(e) {
        immobrowse.list.list();
    });

    jQuery('.ib-filter-amenities-option').click(function() {
        immobrowse.list.list();
    });

    immobrowse.getRealEstates(php_vars.customerId, function (realEstates) {
        immobrowse.list.realEstates = realEstates;
        immobrowse.list.renderDistricts(jQuery('#ib-districts'), immobrowse.districtElements(realEstates));
        immobrowse.list.list();
        jQuery('#loader').hide();
    });
};


jQuery(document).ready(immobrowse.list.init);
