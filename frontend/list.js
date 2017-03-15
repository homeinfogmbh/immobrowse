/*
  @licstart  The following is the entire license notice for the JavaScript code in this page.
  The JavaScript code in this page is free software: you can
  redistribute it and/or modify it under the terms of the GNU
  General Public License (GNU GPL) as published by the Free Software
  Foundation, either version 3 of the License, or (at your option)
  any later version.  The code is distributed WITHOUT ANY WARRANTY;
  without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

  As additional permission under GNU GPL version 3 section 7, you
  may distribute non-source (e.g., minimized or compacted) forms of
  that code without the copy of the GNU GPL normally required by
  section 4, provided you include this license notice and a URL
  through which recipients can access the Corresponding Source.
  @licend  The above is the entire license notice
*/
var customer = location.search.slice(1);
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
    linkElement: $('#entry' + suffix),
    objectTitle: $('#objectTitle' + suffix),
    prices: {
      coldRent: $('#coldRent' + suffix),
      serviceCharge: $('#serviceCharge' + suffix),
    },
    area: {
      livingArea: $('#livingArea' + suffix),
      rooms: $('#rooms' + suffix)
    },
    furnishingTags: $('#furnishingTags' + suffix),
    titleImage: $('#titleImage' + suffix)
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
  var priceMax = Number(homeinfo.str.comma2dot($('#ib-price-max').val()));
  var filters = {
    types: immobrowse.config.types,
    marketing: immobrowse.config.marketing,
    priceMin: Number(homeinfo.str.comma2dot($('#ib-price-min').val())),
    priceMax: priceMax == 0 ? Infinity: priceMax,
    areaMin: Number(homeinfo.str.comma2dot($('#ib-area-min').val())),
    roomsMin: Number(homeinfo.str.comma2dot($('#ib-rooms-min').val())),
    ebk: $("#ib-filter-kitchen").is(':checked'),
    bathtub: $("#ib-filter-bathtub").is(':checked'),
    window: $("#ib-filter-window").is(':checked'),
    balcony: $("#ib-filter-balcony").is(':checked'),
    carSpace: $("#ib-filter-carspace").is(':checked'),
    guestwc: $("#ib-filter-guestwc").is(':checked'),
    elevator: $("#ib-filter-elevator").is(':checked'),
    garden: $("#ib-filter-garden").is(':checked'),
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

$(document).ready(function () {
  $('#ib-extsearch-button').click(function() {
    if ($('#extendedSearch').attr('style') == "display: none;")
      $('#extendedSearch').slideDown();
    else
      $('#extendedSearch').slideUp();
  });

  $('.ib-btn-filter-option').on('input',function(e) {
    filter();
  });

  $('.ib-filter-amenities-option').click(function() {
    filter();
  });

  var districtsElement = document.getElementById('ib-districts');
  districtsElement.innerHTML = '';
  listElement = $('#list');
  template = $('#templateContainer');
  immobrowse.getRealEstates(customer, function (realEstates) {
    list = new immobrowse.List(customer, realEstates);
    list.filter(filters());

    var districts = list.districts();

    for (district in districts) {
      districtsElement.innerHTML += '<input type="checkbox" class="ib-select-district" name="'
        + district + '" onclick="filter();"/> ' + district + ' (' + districts[district] + ')' + '</input><br/>';
    }

    list.render(listElement, template, elements);
    $('#loader').hide();
  });
});
