/*
  list.js - ImmoBrowse list front end JavaScript.

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
immobrowse.joomla = immobrowse.joomla || {};
immobrowse.joomla.list = immobrowse.joomla.list || {};
immobrowse.joomla.list.realEstates = [];

immobrowse.joomla.list.sorting = {
    property: null,
    order: null
};

immobrowse.joomla.list.elements = [
    {'name': 'coldRent', 'caption': 'Kaltmiete', 'hide': true},
    {'name': 'totalRent', 'caption': 'Gesamtmiete', 'hide': true},
    {'name': 'serviceCharge', 'caption': 'Nebenkosten', 'hide': true},
    {'name': 'operationalCosts', 'caption': 'Betriebskosten VZ', 'hide': true},
    {'name': 'rooms', 'caption': 'Zimmer', 'hide': true}
];


immobrowse.joomla.list.toggleOrder = function () {
    var previousOrder = immobrowse.joomla.list.sorting.order;

    if (immobrowse.joomla.list.sorting.order == 'descending') {
        immobrowse.joomla.list.sorting.order = 'ascending';
    } else {
        immobrowse.joomla.list.sorting.order = 'descending';
    }

    return previousOrder;
};


immobrowse.joomla.list.toggleSorting = function (property) {
    var previousIssuer = document.getElementById('ib-sort-' + immobrowse.joomla.list.sorting.property);
    var issuer = document.getElementById('ib-sort-' + property);
    immobrowse.joomla.list.toggleOrder();
    immobrowse.joomla.list.sorting.property = property;

    // Remove arrow symbol
    if (previousIssuer != null) {
        previousIssuer.innerHTML = previousIssuer.innerHTML.slice(0, -1);
    }

    switch (immobrowse.joomla.list.sorting.order) {
    case 'ascending':
        issuer.innerHTML += ' &darr;';
        break;
    case 'descending':
        issuer.innerHTML += ' &uarr;';
        break;
    }

    immobrowse.joomla.list.list();
};


immobrowse.joomla.list.filters = function () {
    var filters = {
        types: immobrowse.config.types,
        marketing: immobrowse.config.marketing
    };

    return filters;
};


immobrowse.joomla.list.list = function (realEstates) {
    var filter = new immobrowse.Filter(immobrowse.joomla.list.filters());
    var list = new immobrowse.List(filter.filter(realEstates));

    if (immobrowse.joomla.list.sorting.property != null) {
        list.sort(immobrowse.joomla.list.sorting.property, immobrowse.joomla.list.sorting.order);
    }

    list.render(jQuery('#ib-list'), immobrowse.joomla.list.elements);
};


immobrowse.joomla.list.render = function (realEstates) {
    if (realEstates != null) {
        immobrowse.joomla.list.realEstates = realEstates;
    }

    if (immobrowse.joomla.list.realEstates.length > 0) {
        immobrowse.joomla.list.list(immobrowse.joomla.list.realEstates);
    } else {
        jQuery('#ib-header').hide();
        jQuery('#ib-message').show();
    }

    jQuery('#ib-loader').hide();
};


immobrowse.joomla.list.init = function () {
    immobrowse.RealEstate.list(immobrowse.joomla.list.customer).then(immobrowse.joomla.list.render);
};


jQuery(document).ready(immobrowse.joomla.list.init);
