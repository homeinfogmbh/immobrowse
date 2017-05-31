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

function selectedDistricts() {
  var districts = [];
  var checkboxes = document.getElementsByClassName('ib-select-district');

  for (i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      districts.push(checkboxes[i].getAttribute('name'));
    }
  }

  return districts;
}

function filters() {
  var priceMax = Number(homeinfo.str.comma2dot(jQuery('#ib-price-max').val()));
  var filters = {
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
    districts: selectedDistricts()
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
  jQuery('#ib-extsearch-button').click(function() {
    if (jQuery('#extendedSearch').attr('style') == "display: none;")
      jQuery('#extendedSearch').slideDown();
    else
      jQuery('#extendedSearch').slideUp();
  });

  jQuery('.ib-btn-filter-option').on('input',function(e) {
    filter();
  });

  jQuery('.ib-filter-amenities-option').click(function() {
    filter();
  });

  var districtsElement = document.getElementById('ib-districts');
  districtsElement.innerHTML = '';
  listElement = jQuery('#list');
  template = jQuery('#templateContainer');
  immobrowse.getRealEstates(customer, function (realEstates) {
    list = new immobrowse.List(customer, realEstates);
    list.filter(filters());

    var districts = list.districts();

    for (district in districts) {
      districtsElement.innerHTML += '<input type="checkbox" class="ib-select-district" name="'
        + district + '" onclick="filter();"> ' + district + ' (' + districts[district] + ')' + '</input><br>';
    }

    list.render(listElement, template, elements);
    jQuery('#loader').hide();
  });
});
