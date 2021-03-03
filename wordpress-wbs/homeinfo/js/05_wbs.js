/*
  WBS individualization.
*/
'use strict';


var immobrowse = immobrowse ||  {};
immobrowse.wbs = immobrowse.wbs || {};
immobrowse.wbs.KATERNBERG_STREETS = ['Funckstr.', 'Katernberger Schulweg', 'Kruppstr.', 'Siemensstr.'];


/*
    Matches a real estate against a district.
*/
immobrowse.wbs.match = function (realEstate, district) {
    switch (district) {
    case 'Uellendahl-Katernberg':
        return immobrowse.wbs.KATERNBERG_STREETS.includes(realEstate.geo.strasse);
    case 'Elberfeld':
        return realEstate.geo.plz.startsWith('421');
    case 'Barmen':
        return realEstate.geo.plz.startsWith('422');
    default:
        return realEstate.geo.regionaler_zusatz == district;
    }
};


/*
    Filters real estates by WBS district.
*/
immobrowse.wbs.filter = function (realEstates, district) {
    const result = [];

    for (const realEstate of realEstates) {
        if (immobrowse.wbs.match(realEstate, district)) {
            result.push(realEstate);
        }
    }

    return result;
};


/*
    Yields filtered real estates if district argument is provided.
*/
immobrowse.wbs.districtFilteredRealEstates = function (realEstates) {
    if (immobrowse.wordpress.selectedDistricts().length == 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const district = urlParams.get('ortsteil');

        if (district != null && district != ''){
            return immobrowse.wbs.filter(realEstates, district);
        }
    }

    return realEstates;
};
