/*
  list.mjs - ImmoBrowse list front end JavaScript

  (C) 2017-2021 HOMEINFO - Digitale Informationssysteme GmbH

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
*/
'use strict';


const SORTING = {
    property: null,
    order: null
};
const REAL_ESTATES = null;
const LIST_ELEMENT = null;
const LOADER = new Loader();


function toggleOrder () {
    const previousOrder = SORTING.order;

    if (SORTING.order == 'descending')
        SORTING.order = 'ascending';
    else
        SORTING.order = 'descending';

    return previousOrder;
}


function toggleSorting (property) {
    const previousIssuer = document.getElementById('ib-sort-' + SORTING.property);
    const issuer = document.getElementById('ib-sort-' + property);
    toggleOrder();
    SORTING.property = property;

    // Remove arrow symbol
    if (previousIssuer != null)
        previousIssuer.innerHTML = previousIssuer.innerHTML.slice(0, -1);

    switch (SORTING.order) {
    case 'ascending':
        issuer.innerHTML += ' &darr;';
        break;
    case 'descending':
        issuer.innerHTML += ' &uarr;';
        break;
    }

    list();
}


/*
    Renders the available districts.
*/
function renderDistricts (districtsElement, districtElements) {
    districtsElement.html('');

    for (const districtElement of districtElements)
        districtsElement.append(districtElement);

    for (const element of document.getElementsByClassName('.ib-select-district'))
        element.addEventListener('click', event => list());
}


/*
    Returns the filter settings.
*/
function filters () {
    let priceMax = document.getElementById('ib-price-max').value;
    priceMax = priceMax ? Number(comma2dot(priceMax)) : Infinity;

    let priceMin = document.getElementById('ib-price-min').value;
    priceMin = priceMin ? Number(comma2dot(priceMin)) : 0;

    let areaMin = document.getElementById('ib-area-min').value;
    areaMin = areaMin ? Number(comma2dot(areaMin)) : 0;

    let roomsMin = document.getElementById('ib-rooms-min').value;
    roomsMin = roomsMin ? Number(comma2dot(roomsMin)) : 0;

    return {
        types: CONSIG.types,
        marketing: CONSIG.marketing,
        priceMin: priceMin,
        priceMax: priceMax == 0 ? Infinity: priceMax,
        areaMin: areaMin,
        roomsMin: roomsMin,
        ebk: document.getElementById('ib-filter-kitchen').checked,
        bathtub: document.getElementById('ib-filter-bathtub').checked,
        window: document.getElementById('ib-filter-window').checked,
        balcony: document.getElementById('ib-filter-balcony').checked,
        carSpace: document.getElementById('ib-filter-carspace').checked,
        guestwc: document.getElementById('ib-filter-guestwc').checked,
        elevator: document.getElementById('ib-filter-elevator').checked,
        garden: document.getElementById('ib-filter-garden').checked,
        districts: Array.from(selectedDistricts())
    };
}


function list () {
    const filter = new Filter(filters());
    const realEstates = districtFilteredRealEstates(filter.filter(REAL_ESTATES));
    const list = new List(realEstates);

    if (SORTING.property != null)
        list.sort(SORTING.property, SORTING.order);

    if (list.realEstates.length > 0)
        list.render(LIST_ELEMENT);
    else
        LIST_ELEMENT.html('Keine Angebote vorhanden.');
}


function render (realEstates) {
    REAL_ESTATES = realEstates;
    renderDistricts(document.getElementById('ib-districts'), districtElements(realEstates));
    list();
    LOADER.stop();
}


function toggleExtendedSearch () {
    if (extendedSearch.style.display == 'block')
        extendedSearch.style.display = 'none';
    else
        extendedSearch.style.display = 'block';
}


export function init () {
    if (typeof customer === undefined)
        return;

    const extendedSearch = document.getElementById('extendedSearch');
    document.getElementById('ib-extsearch-button').addEventListener('click', toggleExtendedSearch);

    for (const filterOption of document.getElementsByClassName('ib-btn-filter-option'))
        filterOption.addEventListener('input', event => list());

    for (const amenitiesOption of document.getElementsByClassName('ib-filter-amenities-option'))
        amenitiesOption.addEventListener('click', event => list());

    LIST_ELEMENT = jQuery('#list');
    RealEstate.list(customer).then(immobrowse.wordpress.render);
}
