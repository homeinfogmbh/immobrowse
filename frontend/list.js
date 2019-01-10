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
var args = new homeinfo.QueryString();
var customer = args.customer;
var sorting = {
    property: null,
    order: null
};
var realEstates;
var listElement;

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

    list();
}

function renderDistricts(districtsElement, districtElements) {
    districtsElement.html('');

    for (var districtElement of districtElements) {
        districtsElement.append(districtElement);
    }

    $('.ib-select-district').click(function() {
        list();
    });
}

function* selectedDistricts() {
    var districts = [];
    var checkboxes = document.getElementsByClassName('ib-select-district');

    for (var checkbox of checkboxes) {
        if (checkbox.checked) {
            yield checkbox.getAttribute('name');
        }
    }

    return districts;
}

function filters() {
    var priceMax = Number(homeinfo.str.comma2dot($('#ib-price-max').val()));
    return {
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
        districts: Array.from(selectedDistricts())
    };
}

function list() {
    var filter = new immobrowse.Filter(filters());
    var list = new immobrowse.List(filter.filter(realEstates));

    if (sorting.property != null) {
        list.sort(sorting.property, sorting.order);
    }

    list.render(listElement);
}

function init() {
    $('#ib-extsearch-button').click(function() {
        if ($('#extendedSearch').attr('style') == "display: none;")
            $('#extendedSearch').slideDown();
        else
            $('#extendedSearch').slideUp();
    });

    $('.ib-btn-filter-option').on('input',function(e) {
        list();
    });

    $('.ib-filter-amenities-option').click(function() {
        list();
    });

    listElement = $('#list');
    immobrowse.RealEstate.list(customer).then(
        function (realEstates_) {
            realEstates = realEstates_;
            renderDistricts($('#ib-districts'), immobrowse.districtElements(realEstates));
            list();
            $('#loader').hide();
        }
    );
}

$(document).ready(init);
