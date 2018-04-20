/*
    list.js - ImmoBrowse list front end JavaScript.

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
immobrowse.list = {};


immobrowse.list.sorting = {
    property: null,
    order: null
};


immobrowse.list.toggleOrder = function () {
    var previousOrder = immobrowse.list.sorting.order;

    if (immobrowse.list.sorting.order == 'descending') {
        immobrowse.list.sorting.order = 'ascending';
    } else {
        immobrowse.list.sorting.order = 'descending';
    }

    return previousOrder;
}


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
}


immobrowse.list.filters = function () {
    var filters = {
        types: immobrowse.config.types,
        marketing: immobrowse.config.marketing
    };

    immobrowse.logger.debug('Filters:');
    immobrowse.logger.debug(JSON.stringify(filters));
    return filters;
}


immobrowse.list.list = function (realEstates) {
    var filter = new immobrowse.Filter(immobrowse.list.filters());
    var list = new immobrowse.List(filter.filter(realEstates));

    if (immobrowse.list.sorting.property != null) {
        list.sort(immobrowse.list.sorting.property, immobrowse.list.sorting.order);
    }

    list.render(jQuery('#ib-list'));
}


immobrowse.list.listRealEstates = function (realEstates) {
    if (realEstates.length > 0) {
        immobrowse.list.list(realEstates);
    } else {
        jQuery('#ib-header').hide();
        jQuery('#ib-message').show();
    }

    jQuery('#ib-loader').hide();
}


immobrowse.list.init = function () {
    immobrowse.getRealEstates(immobrowse.list.customer).then(immobrowse.list.listRealEstates);
};


jQuery(document).ready(immobrowse.list.init);
