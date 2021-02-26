/*
  WBS individualization.
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
