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
var sorting = {
  property: null,
  order: null
};
var listElement;
var template;
var list;

function elements(index) {
  var suffix = '_' + index;

  return {
    linkElement: jQuery('#entry' + suffix),
    objectTitle: jQuery('#objectTitle' + suffix),
    coldRent: jQuery('#coldRent' + suffix),
    serviceCharge: jQuery('#serviceCharge' + suffix),
    livingArea: jQuery('#livingArea' + suffix),
    rooms: jQuery('#rooms' + suffix),
    amenitiesTags: jQuery('#amenitiesTags' + suffix),
    titleImage: jQuery('#titleImage' + suffix)
  };
}

function toggleOrder() {
  var previousOrder = sorting.order;

  if (sorting.order == 'descending') {
    sorting.order = 'ascending';
  } else {
    sorting.order = 'descending';
  }

  return previousOrder;
}

function toggleSorting(property) {
  var previousIssuer = document.getElementById('ib-sort-' + sorting.property);
  var issuer = document.getElementById('ib-sort-' + property);
  toggleOrder();
  sorting.property = property;

  // Remove arrow symbol
  if (previousIssuer != null) {
    previousIssuer.innerHTML = previousIssuer.innerHTML.slice(0, -1);
  }

  switch (sorting.order) {
    case 'ascending':
      issuer.innerHTML += ' &darr;';
      break;
    case 'descending':
      issuer.innerHTML += ' &uarr;';
      break;
  }

  list.sort(sorting.property, sorting.order);
  list.render(listElement, template, elements);
}

function filters() {
  var filters = {
    types: immobrowse.config.types,
    marketing: immobrowse.config.marketing
  }

  immobrowse.logger.debug('Filters:');
  immobrowse.logger.debug(JSON.stringify(filters));
  return filters;
}

function filter() {
  list.filter(filters());

  if (sorting.property != null) {
    list.sort(sorting.property, sorting.order);
  }

  list.render(listElement, template, elements);
}

jQuery(document).ready(function () {
  listElement = jQuery('#list');
  template = jQuery('#templateContainer');
  immobrowse.getRealEstates(customer, function (realEstates) {
    list = new immobrowse.List(customer, realEstates);
    list.filter(filters());
    list.render(listElement, template, elements);
    jQuery('#loader').hide();
  });
});
