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
        return katernbergStreets.includes(realEstate.geo.strasse);
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
immobrowse.wbs.filter = function* (realEstates, district) {
    for (var realEstate of realEstates) {
        if (immobrowse.wbs.match(realEstate, district)) {
            yield realEstate;
        }
    }
};


/*
    Yields filtered real estates if district argument is provided.
*/
immobrowse.wbs.districtFilteredRealEstates = function* (realEstates) {
    if (immobrowse.wordpress.selectedDistricts().length == 0) {
        var args = new homeinfo.QueryString();
        var district = args.ortsteil;

        if (district != null && district != ''){
            yield* immobrowse.wbs.filter(realEstates, district);
        }
    }
};


/*
    Merges two real estates iterables.
*/
immobrowse.wbs.merge = function* (realEstates1, realEstates2) {
    var processed = [];
    var realEstate;

    for (realEstate of realEstates1) {
        processed.push(realEstate.verwaltung_techn.objektnr_extern);
        yield realEstate;
    }

    for (realEstate of realEstates2) {
        if (processed.includes(realEstate.verwaltung_techn.objektnr_extern)) {
            continue;
        }

        processed.push(realEstate.verwaltung_techn.objektnr_extern);
        yield realEstate;
    }
};
