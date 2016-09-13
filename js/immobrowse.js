/*
    ImmoBrowse real estate search front end

    Presumed global variables:
        * CID           The customer ID
        * LOCATIONS     Set of available locations
*/

var immobrowse = immobrowse || {};

immobrowse.BASE_URL = "https://tls.homeinfo.de/immosearch";
immobrowse.REAL_ESTATES_URL = immobrowse.BASE_URL + "/customer";
immobrowse.DUMMY_IMG = "img/customer_dummy/dummy.png";
immobrowse.DUMMY_DETAILS_IMG = "img/customer_dummy/dummy_details.png";
immobrowse.LOGOS_DIR = "img/customers_logos"

// Returns the appropriate real estate URL for the customer
immobrowse.url = function(cid) {
    return immobrowse.REAL_ESTATES_URL + "/" + cid;
}

// Returns the path of the appropriate customer logo
immobrowse.customerLogo = function(cid) {
    return immobrowse.LOGOS_DIR + "/" + cid + ".png";
}

// Appends data to a target with an optional separator
immobrowse.append = function(target, what, sep=null) {
    if (target === null) {
        return what;
    } else {
        if (sep === null) {
            return target + what;
        } else {
            return target + sep + what;
        }
    }
}

// And-join what to target
immobrowse.and = function(target, what) {
    return immobrowse.append(target, what, " and ");
}

// Or-join what to target
immobrowse.or = function(target, what) {
    return immobrowse.append(target, what, " or ");
}

// Class-like function to represent a search query
immobrowse.SearchQuery = function(
        cid, id, locations, sorting, includes, roomsMin, roomsMax, areaMin,
        areaMax, coldRentMin, coldRentMax, terrace, garden, balcony, bathTub,
        shower, lift, groundFloor, firstFloor, secondFloor) {
    this.cid = cid;     // The customer ID
    this.id = id;       // The real estate ID
    this.locations = locations || [];
    this.sorting = sorting;
    this.includes = includes;
    this.roomsMin = roomsMin;
    this.roomsMax = roomsMax;
    this.areaMin = areaMin;
    this.areaMax = areaMax;
    this.coldRentMin = coldRentMin;
    this.coldRentMax = coldRentMax;
    this.terrace = terrace;
    this.garden = garden;
    this.balcony = balcony;
    this.bathTub = bathTub;
    this.shower = shower;
    this.lift = lift;
    this.groundFloor = groundFloor;
    this.firstFloor = firstFloor;
    this.secondFloor = secondFloor;

    // Returns or-joint location filters string
    this._locationFilter = function() {
	    var result = null;

	    for(var i = 0; i < this.locations.length; i++) {
		    result = immobrowse.or(result, "ortsteil==" + this.locations[i]);
	    }

        return result
    };

    // Returns or-joint floor filters string
    this._etageFilter = function() {
	    var result = null;

	    if (this.groundFloor === true) {
		    result = immobrowse.or(result, "etage==0");
	    }

	    if (this.firstFloor === true) {
		    result = immobrowse.or(result, "etage==1");
	    }

	    if (this.secondFloor === true) {
		    result = immobrowse.or(result, "etage==2");
	    }

        return result;
    };

    // Returns and-joint filters string
    this._filters = function() {
	    var result = null;

	    if (this.id !== null) {
            result = immobrowse.append(result, "objektnr_extern==" + this.id, "&");
	    }

	    if (this.roomsMin !== null) {
		    result = immobrowse.and(result, "zimmer>=" + this.roomsMin);
	    }

	    if (this.roomsMax !== null) {
		    result = immobrowse.and(result, "zimmer<=" + this.roomsMax);
	    }

	    if (this.areaMin !== null) {
		    result = immobrowse.and(result, "wohnflaeche>=" + this.areaMin);
	    }

	    if (this.areaMax !== null) {
		    result = immobrowse.and(result, "wohnflaeche<=" + this.areaMax);
	    }

	    if (this.coldRentMin !== null) {
		    result = immobrowse.and(result, "kaltmiete>=" + this.coldRentMin);
	    }

	    if (this.coldRentMax !== null) {
		    result = immobrowse.and(result, "kaltmiete<=" + this.coldRentMax);
	    }

	    if (this.terrace === true) {
		    result = immobrowse.and(result, "terrassen>>0");
	    }

	    if (this.garden === true) {
		    result = immobrowse.and(result, "garten>>0");
	    }

	    if (this.balcony === true) {
		    result = immobrowse.and(result, "balkone>>0");
	    }

	    if (this.bathTub === true) {
		    result = immobrowse.and(result, "wanne>>0");
	    }

	    if (this.shower === true) {
		    result = immobrowse.and(result, "dusche>>0");
	    }

	    if (this.lift === true) {
		    result = immobrowse.and(result, "aufzug>>0");
	    }

	    var floorFilter = this._etageFilter();

	    if (floorFilter !== null) {
		    result = immobrowse.and(result, "(" + floorFilter + ")");
	    }

	    var locationFilter = this._locationFilter();

	    if (locationFilter !== null) {
		    result = immobrowse.and(result, "(" + locationFilter + ")");
	    }

	    return result;
    };

    // Returns includes, comma separated
    this._includes = function() {
        result = null;

	    for(var i = 0; i < this.includes.length; i++) {
		    result = immobrowse.append(result, this.includes[i], ",");
	    }

        return result;
    }

    // Returns an appropriate URL parameters string
    this.parameters = function(json=false) {
        var result = null;
        var filters = this._filters();

	    if (filters !== null) {
            result = immobrowse.append(result, "filter=" + filters, "&");
	    }

	    if (this.sorting !== null) {
            result = immobrowse.append(result, "sort=" + this.sorting, "&");
	    }

        var includes = this._includes();

	    if (includes !== null) {
            result = immobrowse.append(result, "include=" + includes, "&");
	    }

        if (json === true) {
            result = immobrowse.append(result, "json", "&")
        }

	    return result;
    }

    // Returns the query URL
    this.url = function(json=false) {
        var result = immobrowse.url(this.cid);
        var parameters = this.parameters(json);

        if (parameters !== null) {
            result = immobrowse.append(result, parameters, "?");
        }

        return result;
    };

    // Executes the query
    this.execute = function(beforeSend_, success_, error_) {
        $.ajax({
            url: this.url(),
			crossDomain: true,
			type: "GET",
			dataType: "application/json",
			cache: false,
			beforeSend: beforeSend_,
			success: success_,
			error: error_})
	};

    return this;
}
