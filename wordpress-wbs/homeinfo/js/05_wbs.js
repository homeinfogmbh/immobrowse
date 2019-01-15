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

    return [];
};


/*
    Merges two real estates iterables.
*/
immobrowse.wbs.merge = function (realEstates1, realEstates2) {
    var processed = [];
    var result = [];
    var realEstate, i;

    for (i = 0; i < realEstates1.length; i++) {
        realEstate = realEstates1[i];
        processed.push(realEstate.verwaltung_techn.objektnr_extern);
        result.push(realEstate);
    }

    for (i = 0; i < realEstates2.length; i++) {
        realEstate = realEstates2[i];

        if (processed.includes(realEstate.verwaltung_techn.objektnr_extern)) {
            continue;
        }

        processed.push(realEstate.verwaltung_techn.objektnr_extern);
        result.push(realEstate);
    }

    return result;
};
