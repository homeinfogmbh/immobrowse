/*
  wbs.mjs - ImmoBrowse customization for WBS Wuppertal.

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


const KATERNBERG_STREETS = [
    'Funckstr.',
    'Katernberger Schulweg',
    'Kruppstr.',
    'Siemensstr.'
];


/*
    Matches a real estate against a district.
*/
function match (realEstate, district) {
    switch (district) {
    case 'Uellendahl-Katernberg':
        return KATERNBERG_STREETS.includes(realEstate.geo.strasse);
    case 'Elberfeld':
        return realEstate.geo.plz.startsWith('421');
    case 'Barmen':
        return realEstate.geo.plz.startsWith('422');
    default:
        return realEstate.geo.regionaler_zusatz == district;
    }
}


/*
    Filters real estates by WBS district.
*/
function *filter (realEstates, district) {
    for (const realEstate of realEstates) {
        if (match(realEstate, district))
            yield realEstate;
    }
}


/*
    Yields explicitely selected districts.
*/
export function *selectedDistricts () {
    const checkboxes = document.getElementsByClassName('ib-select-district');

    for (const checkbox of checkboxes) {
        if (checkbox.checked)
            yield checkbox.getAttribute('name'));
    }
}


/*
    Yields filtered real estates if district argument is provided.
*/
export function districtFilteredRealEstates (realEstates) {
    const districts = Array.from(selectedDistricts());

    if (districts.length != 0)
        return realEstates;

    const urlParams = new URLSearchParams(window.location.search);
    const district = urlParams.get('ortsteil');

    if (district != null && district != '')
        return filter(realEstates, district);
}
