/*
  list.mjs - ImmoBrowse list front end JavaScript

  (C) 2021 HOMEINFO - Digitale Informationssysteme GmbH

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
*/
'use strict';


import { Loader, comma2dot } from 'https://javascript.homeinfo.de/lib.mjs';
import { CONFIG, districtElements, Filter, List, RealEstate} from 'https://javascript.homeinfo.de/immobrowse/immobrowse.mjs';
import { configure } from './config.mjs';


const URL_PARAMS = new URLSearchParams(window.location.search);
const CUSTOMER = null;
const SORTING = {
    property: null,
    order: null
};
const LOADER = new Loader('loader', 'list');
let REAL_ESTATES;


function toggleOrder () {
    const previousOrder = SORTING.order;

    if (SORTING.order == 'descending') {
        SORTING.order = 'ascending';
    } else {
        SORTING.order = 'descending';
    }

    return previousOrder;
}


export function toggleSorting (property) {
    const previousIssuer = document.getElementById('ib-sort-' + SORTING.property);
    const issuer = document.getElementById('ib-sort-' + property);
    toggleOrder();
    SORTING.property = property;

    if (previousIssuer != null)     // Remove arrow symbol
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


function renderDistricts (districtsElement, districtElements) {
    districtsElement.innerHTML = '';

    for (const districtElement of districtElements)
        districtsElement.appendChild(districtElement);

    for (const district of document.getElementsByClassName('ib-select-district'))
        district.addEventListener('click', event => list());
}


function* selectedDistricts () {
    const checkboxes = document.getElementsByClassName('ib-select-district');

    for (let checkbox of checkboxes) {
        if (checkbox.checked)
            yield checkbox.getAttribute('name');
    }
}


function filters () {
    const priceMax = Number(comma2dot(document.getElementById('ib-price-max').value));
    return {
        types: CONFIG.types,
        marketing: CONFIG.marketing,
        priceMin: Number(comma2dot(document.getElementById('ib-price-min').value)),
        priceMax: priceMax == 0 ? Infinity: priceMax,
        areaMin: Number(comma2dot(document.getElementById('ib-area-min').value)),
        roomsMin: Number(comma2dot(document.getElementById('ib-rooms-min').value)),
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
    const list = new List(filter.filter(REAL_ESTATES));

    if (SORTING.property != null) {
        list.sort(SORTING.property, SORTING.order);
    }

    list.render(document.getElementById('list'));
}


export function init () {
    LOADER.start();
    configure(CONFIG);
    document.getElementById('ib-extsearch-button').addEventListener('click', event => {
        if (document.getElementById('extendedSearch').style.display == 'none')
            document.getElementById('extendedSearch').style.display = 'block';
        else
            document.getElementById('extendedSearch').style.display = 'none';
    });

    for (const filter of document.getElementsByClassName('ib-btn-filter-option'))
        filter.addEventListener('input', event => list());

    for (const option of document.getElementsByClassName('ib-filter-amenities-option'))
        option.addEventListener('click', event => list());

    document.getElementById('ib-sort-rooms').addEventListener('click', event => toggleSorting('rooms'));
    document.getElementById('ib-sort-area').addEventListener('click', event => toggleSorting('area'));
    document.getElementById('ib-sort-rent').addEventListener('click', event => toggleSorting('rent'));

    RealEstate.list(CUSTOMER).then(realEstates => {
        REAL_ESTATES = realEstates;
        renderDistricts(document.getElementById('ib-districts'), districtElements(realEstates));
        list();
        LOADER.stop();
    });
}
