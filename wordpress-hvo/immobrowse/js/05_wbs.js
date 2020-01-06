/*
  WBS individualization.
*/
'use strict';


var immobrowse = immobrowse ||  {};
immobrowse.wbs = immobrowse.wbs || {};


/*
    Matches a real estate against a district.
*/
immobrowse.wbs.match = function (realEstate, district) {
    var katernbergStreets = ['Funckstr.', 'Katernberger Schulweg', 'Kruppstr.', 'Siemensstr.'];

    switch (district) {
    case 'Uellendahl-Katernberg':
        return katernbergStreets.indexOf(realEstate.geo.strasse) >= 0;
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
    var result = [];

    for (var i = 0; i < realEstates.length; i++) {
        var realEstate = realEstates[i];

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
        var args = new homeinfo.QueryString();
        var district = args.ortsteil;

        if (district != null && district != ''){
            return immobrowse.wbs.filter(realEstates, district);
        }
    }

    return realEstates;
};
