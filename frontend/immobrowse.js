/*
  immobrowse.js - ImmoBrowse main JavaScript library

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
*/


var immobrowse = immobrowse || {};

// Real estates container
immobrowse.realEstates = null;

// Configuration
immobrowse.config = {
  logLevel: 1,
  customer: null,
  filters: {
    types: null,
    marketing: null
  },
  sorting: {
    property: null,
    order: null
  },
  listContainer: null,
  exposeContainer: null,
  districtsContainer: null
};


/*** logging ***/

immobrowse._log = function(prefix, msg) {
  console.log(prefix + ' immobrowse: ' + msg);
}


immobrowse.error = function(msg) {
  if (immobrowse.config.logLevel >= 0) {
    immobrowse._log('[ fail ]', msg);
  }
}


immobrowse.warning = function(msg) {
  if (immobrowse.config.logLevel >= 1) {
    immobrowse._log('[ warn ]', msg);
  }
}


immobrowse.info = function(msg) {
  if (immobrowse.config.logLevel >= 3) {
    immobrowse._log('[ info ]', msg);
  }
}


immobrowse.success = function(msg) {
  if (immobrowse.config.logLevel >= 4) {
    immobrowse._log('[  ok  ]', msg);
  }
}


immobrowse.debug = function(msg) {
  if (immobrowse.config.logLevel >= 5) {
    immobrowse._log('!<DEBUG>', msg);
  }
}


/*** Miscellaneous functions ***/


/*
  Compares two nullable values so that
  null values always come out last.
*/
immobrowse.compare = function (alice, bob, descending) {
  if (alice == null) {
    if (bob == null) {
      return 0;
    } else {
      return Infinity;
    }
  } else {
    if (bob == null) {
      return -Infinity;
    } else {
      var val = 0;

      if (alice < bob) {
        val = -1;
      } else {
        if (bob < alice) {
          val = 1;
        }
      }

      if (descending) {
        val =  val * -1;
      }

      return val;
    }
  }
}


immobrowse.getRealEstate = function (identifier) {
  for (var i=0; i<immobrowse.realEstates.length; i++) {
    var realEstate = immobrowse.realEstates[i];

    if (immobrowse.identify(realEstate) == identifier) {
      return realEstate;
    }
  }

  immobrowse.warning('No real estate for ID: ' + identifier);
  return null;
}


/*** HTML formatting ***/

immobrowse.escapeHtml = function (string) {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;',
    "ä": '&auml;',
    "ö": '&#ouml;',
    "ü": '&#uuml;',
    "Ä": '&#Auml;',
    "Ö": '&#Ouml;',
    "Ü": '&#Uuml;',
    "ß": '&#szlig;'
  };
  return String(string).replace(/[&<>"'\/äöüÄÖÜß]/g, function (s) {
    return entityMap[s];
  });
}


immobrowse.euroHtml = function (price) {
  if (price == null) {
    return 'N/A';
  } else {
    return (price.toFixed(2) + ' &euro;').replace('.',',');
  }
}


immobrowse.squareMetersHtml = function (area) {
  if (area == null) {
    return 'N/A';
  } else {
    return (area.toFixed(2) + ' m&sup2;').replace('.', ',');
  }
}


immobrowse.titleImageHtml = function (url) {
  return '<img src="' + url + '" alt="Titelbild" class="ib-preview-image">';
}


immobrowse.addressPreview = function (geo) {
  if (geo == null) {
    return 'N/A';
  } else {
    if (geo.strasse == null) {
      return 'N/A';
    } else {
      if (geo.hausnummer == null) {
        return geo.strasse;
      } else {
        return geo.strasse + ' ' + geo.hausnummer;
      }
    }
  }
}


immobrowse.cityPreview = function (geo) {
  if (geo == null) {
    return 'N/A';
  } else {
    if (geo.ort == null) {
      return 'N/A';
    } else {
      if (geo.regionaler_zusatz == null || geo.regionaler_zusatz == geo.ort) {
        return geo.ort;
      } else {
        return geo.ort + ' ' + geo.regionaler_zusatz;
      }
    }
  }
}


/*** JSON data extraction ***/

immobrowse.objektnr_extern = function (immobilie) {
  return immobilie.verwaltung_techn.objektnr_extern;
}


immobrowse.identify = function (immobilie) {
  return immobrowse.objektnr_extern(immobilie);
}


/*
  Extracts a potential title image from a
  real estate or null if none was found.
*/
immobrowse.titleImage = function (immobilie) {
  if (immobilie.anhaenge == null) {
    return null;
  } else {
    if (immobilie.anhaenge.anhang == null) {
      return null;
    } else {
      for (var i=0; i<immobilie.anhaenge.anhang.length; i++) {
        var anhang = immobilie.anhaenge.anhang[i];

        if (anhang.gruppe == 'TITELBILD') {
          return anhang;
        }
      }

      for (var i=0; i<immobilie.anhaenge.anhang.length; i++) {
        var anhang = immobilie.anhaenge.anhang[i];

        if (anhang.gruppe == 'AUSSENANSICHTEN') {
          return anhang;
        }
      }

      for (var i=0; i<immobilie.anhaenge.anhang.length; i++) {
        var anhang = immobilie.anhaenge.anhang[i];

        if (anhang.gruppe == 'GRUNDRISS') {
          return anhang;
        }
      }

      for (var i=0; i<immobilie.anhaenge.anhang.length; i++) {
        var anhang = immobilie.anhaenge.anhang[i];

        if (anhang.gruppe == 'BILD') {
          return anhang;
        }
      }

      return null;
    }
  }
}


immobrowse.street = function (immobilie) {
  if (immobilie.geo == null) {
    return null;
  } else {
    if (immobilie.geo.strasse == null) {
      return null;
    } else {
      return immobilie.geo.strasse;
    }
  }
}


immobrowse.rooms = function (immobilie) {
  if (immobilie.flaechen == null) {
    return null;
  } else {
    if (immobilie.flaechen.anzahl_zimmer == null) {
      return null;
    } else {
      return immobilie.flaechen.anzahl_zimmer;
    }
  }
}


immobrowse.area = function (immobilie) {
  if (immobilie.flaechen == null) {
    return null;
  } else {
    if (immobilie.flaechen.wohnflaeche == null) {
      if (immobilie.flaechen.nutzflaeche == null) {
        if (immobilie.flaechen.gesamtflaeche == null) {
          return null;
        } else {
          return immobilie.flaechen.gesamtflaeche;
        }
      } else {
        return immobilie.flaechen.nutzflaeche;
      }
    } else {
      return immobilie.flaechen.wohnflaeche;
    }
  }
}


immobrowse.netColdRent = function (immobilie) {
  if (immobilie.preise == null) {
    return null;
  } else {
    if (immobilie.preise.nettokaltmiete == null) {
      return null;
    } else {
      return immobilie.preise.nettokaltmiete;
    }
  }
}


immobrowse.coldRent = function (immobilie) {
  if (immobilie.preise == null) {
    return null;
  } else {
    if (immobilie.preise.kaltmiete == null) {
      return null;
    } else {
      return immobilie.preise.kaltmiete;
    }
  }
}


immobrowse.cableSatTv = function (immobilie) {
  if (immobilie.ausstattung == null) {
    return null;
  } else {
    return immobilie.ausstattung.kabel_sat_tv;
  }
}


immobrowse.builtInKitchen = function (immobilie) {
  if (immobilie.ausstattung == null) {
    return false;
  } else {
    if (immobilie.ausstattung.kueche == null) {
      return false;
    } else {
      return immobilie.ausstattung.kueche.EBK;
    }
  }
}


immobrowse.basementRoom = function (immobilie) {
  if (immobilie.ausstattung == null) {
    return null;
  } else {
    return immobilie.ausstattung.unterkellert == 'JA';
  }
}


immobrowse.balconies = function (immobilie) {
  if (immobilie.flaechen == null) {
    return 0;
  } else {
    if (immobilie.flaechen.anzahl_balkone == null) {
      return 0;
    } else {
      return immobilie.flaechen.anzahl_balkone;
    }
  }
}


immobrowse.terraces = function (immobilie) {
  if (immobilie.flaechen == null) {
    return 0;
  } else {
    if (immobilie.flaechen.anzahl_terrassen == null) {
      return 0;
    } else {
      return immobilie.flaechen.anzahl_terrassen;
    }
  }
}


immobrowse.shower = function (immobilie) {
  if (immobilie.ausstattung == null) {
    return false;
  } else {
    if (immobilie.ausstattung.bad == null) {
      return false;
    } else {
      return immobilie.ausstattung.bad.DUSCHE;
    }
  }
}


immobrowse.bathTub = function (immobilie) {
  if (immobilie.ausstattung == null) {
    return false;
  } else {
    if (immobilie.ausstattung.bad == null) {
      return false;
    } else {
      return immobilie.ausstattung.bad.WANNE;
    }
  }
}


immobrowse.bathroomWindow = function (immobilie) {
  if (immobilie.ausstattung == null) {
    return false;
  } else {
    if (immobilie.ausstattung.bad == null) {
      return false;
    } else {
      return immobilie.ausstattung.bad.FENSTER;
    }
  }
}


immobrowse.lavatoryDryingRoom = function (immobilie) {
  if (immobilie.ausstattung == null) {
    return false;
  } else {
    return immobilie.ausstattung.wasch_trockenraum;
  }
}


immobrowse.barrierFree = function (immobilie) {
  if (immobilie.ausstattung == null) {
    return false;
  } else {
    return immobilie.ausstattung.barrierefrei;
  }
}


immobrowse.objectTypes = function (immobilie) {
  var types = [];
  var objektart = immobilie.objektkategorie.objektart;

  if (objektart.zimmer != null) {
    types.push('ZIMMER');
  }

  if (objektart.wohnung != null) {
    types.push('WOHNUNG');
    types.concat(objektart.wohnung);
  }

  return types;
}


immobrowse.marketingTypes = function (immobilie) {
  var types = [];
  var vermarktungsart = immobilie.objektkategorie.vermarktungsart;

  if (vermarktungsart.KAUF) {
    types.push('KAUF');
  }

  if (vermarktungsart.MIETE_PACHT) {
    types.push('MIETE_PACHT');
  }

  if (vermarktungsart.ERBPACHT) {
    types.push('ERBPACHT');
  }

  if (vermarktungsart.LEASING) {
    types.push('LEASING');
  }

  return types;
}


/*** Filtering ***/

immobrowse.matchTypes = function (immobilie) {
  if (immobrowse.config.filters.types == null) {
    return true;
  } else {
    var types = immobrowse.objectTypes(immobilie);

    for (var i=0; i<types.length; i++) {
      var type = types[i];

      if (immobrowse.config.filters.types.indexOf(type) >= 0) {
        return true;
      }
    }

    return false;
  }
}


immobrowse.matchMarketing = function (immobilie) {
  if (immobrowse.config.filters.marketing == null) {
    return true;
  } else {
    var types = immobrowse.marketingTypes(immobilie);

    for (var i=0; i<types.length; i++) {
      var type = types[i];

      if (immobrowse.config.filters.marketing.indexOf(type) >= 0) {
        return true;
      }
    }

    return false;
  }
}


immobrowse.filter = function (realEstates) {
  var filteredRealEstates = [];

  for (var i=0; i<realEstates.length; i++) {
    var realEstate = realEstates[i];

    if (immobrowse.matchTypes(realEstate) && immobrowse.matchMarketing(realEstate)) {
      filteredRealEstates.push(realEstate);
    }
  }

  immobrowse.debug('Filtered ' + filteredRealEstates.length + ' real estates.');
  return filteredRealEstates;
}


/*** Sorting ***/

immobrowse.sortByRooms = function (descending) {
  return function compareRooms(immobilie1, immobilie2) {
    return immobrowse.compare(
      immobrowse.rooms(immobilie1),
      immobrowse.rooms(immobilie2),
      descending);
  }
}


immobrowse.sortByArea = function (descending) {
  return function compareAreas(immobilie1, immobilie2) {
    return immobrowse.compare(
      immobrowse.area(immobilie1),
      immobrowse.area(immobilie2),
      descending);
  }
}


immobrowse.sortByStreet = function (descending) {
  return function compareAreas(immobilie1, immobilie2) {
    return immobrowse.compare(
      immobrowse.street(immobilie1),
      immobrowse.street(immobilie2),
      descending);
  }
}


immobrowse.getSorter = function (property, order) {
  var descending = false;

  if (order == 'descending') {
    descending = true;
  }

  switch(property) {
    case 'rooms':
      return immobrowse.sortByRooms(descending);
    case 'area':
      return immobrowse.sortByArea(descending);
    case 'street':
      return immobrowse.sortByStreet(descending);
    default:
      throw 'Invalid sorting property: ' + property;
  }
}


/*** Invocation ***/

/*
  Retrieves real estates from the back-end API
  and invokes appropriate callback functions
*/
immobrowse.getRealEstates = function (cid) {
  if (cid == null) {
    cid = immobrowse.config.customer;
  }

  $.ajax({
    url: 'https://tls.homeinfo.de/immobrowse/list/' + cid,
    dataType: "json",
    success: function (json) {
      immobrowse.debug('Retrieved ' + json.immobilie.length + ' real estates.');
      immobrowse.realEstates = immobrowse.filter(json.immobilie);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      immobrowse.error(xhr.responseText);
      immobrowse.debug(ajaxOptions);
      immobrowse.debug(thrownError);
      immobrowse.realEstates = [];
    }
  });
}


immobrowse.setSortingProperty = function (property) {
  immobrowse.config.sorting.property = property;
}


immobrowse.setSortingOrder = function (order) {
  immobrowse.config.sorting.order = order;
}


immobrowse.titleImageUrl = function (immobilie) {
  return 'https://tls.homeinfo.de/immobrowse/attachment/' + immobilie.titelbild
    + '?customer=' + immobrowse.config.customer
    + '&objektnr_extern=' + immobrowse.identify(immobilie);
}

/** Mockup **/
immobrowse.titleImageDummy = 'https://tls.homeinfo.de/does/not/exist';


immobrowse.preview = function (immobilie) {
  var titleImageUrl = immobrowse.titleImageUrl(immobilie);
  var objektnr_extern = immobrowse.identify(immobilie);
  var netColdRent = immobrowse.netColdRent(immobilie);
  var coldRent = immobrowse.coldRent(immobilie);
  var rooms = immobrowse.rooms(immobilie);
  var area = immobrowse.area(immobilie);

  var rentAnnotation = 'Miete zzgl. NK';
  var html = '<div class="ib-preview-entry" onclick="immobrowse.expose(\'' + objektnr_extern + '\');">';

  if (titleImageUrl != null) {
    html += immobrowse.titleImageHtml(titleImageUrl);
  } else {
    html += immobrowse.titleImageHtml(immobrowse.titleImageDummy);
  }

  html += '<div class="ib-preview-data">';
  html += '<div class="ib-preview-header">';
  html += '<div class="ib-preview-header-main">';

  if (rooms == null) {
    html += 'Wohnung | ';
  } else {
    html += rooms + ' Zimmer Wohnung | ';
  }

  html += immobrowse.addressPreview(immobilie.geo);
  html += ' | ';
  html += immobrowse.cityPreview(immobilie.geo);
  html += '</div>';
  html += '<div class="ib-preview-header-sub">';
  html += 'Wohnung zur Miete';
  html += '</div>';
  html += '</div>';
  html += '<div class="ib-preview-body">';
  html += '<div class="ib-preview-rent">';
  html += '<div class="ib-preview-rent-data">';

  if (coldRent == null) {
    if (netColdRent == null) {
      html += 'N/A';
    } else {
      html += immobrowse.euroHtml(netColdRent);
    }
  } else {
    html += immobrowse.euroHtml(coldRent);
    rentAnnotation = 'Miete incl. NK';
  }

  html += '</div>';
  html += '<div class="ib-preview-rent-caption">' + rentAnnotation + '</div>';
  html += '</div>';
  html += '<div class="ib-preview-area">';
  html += '<div class="ib-preview-area-data">';
  html += immobrowse.squareMetersHtml(area);
  html += '</div>';
  html += '<div class="ib-preview-area-caption">Wohnfl&auml;che</div>';
  html += '</div>';
  html += '<div class="ib-preview-rooms">';
  html += '<div class="ib-preview-rooms-data">';

  if (rooms == null) {
    html += 'N/A';
  } else {
    html += rooms;
  }

  html += '</div>';
  html += '<div class="ib-preview-rooms-caption">Zimmer</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  return html;
}


immobrowse.details = function (immobilie) {
  var rooms = immobrowse.rooms(immobilie);
  var html = '<div class="panel panel-default nohover">';

  var header = '<div class="panel-heading nohover">';
  header += '<h3 class="panel-title nohover">';
  header += '<strong id="form_object_title">';

  if (rooms == null) {
    html += 'Wohnung | ';
  } else {
    html += rooms + ' Zimmer Wohnung | ';
  }

  html += immobrowse.addressPreview(immobilie.geo);
  html += ' | ';
  html += immobrowse.cityPreview(immobilie.geo);
  header += '</strong>';
  header += '<button id="objectNumber" class="btn btn-success pull-right" type="button">';
  header += '<strong>';
  header += 'Wohnungsnr: ';
  header += immobrowse.identify(immobilie);
  header += '</strong></button></h3></div>'
  html += header;

  var body = '';

  return html;
}


immobrowse.list = function () {
  if (immobrowse.realEstates == null) {
    immobrowse.warning('No real estates available.');
  } else {
    html = '<div class="ib-preview-list">';

    for (var i=0; i<immobrowse.realEstates.length; i++) {
      var realEstate = immobrowse.realEstates[i];

      html += immobrowse.preview(realEstate);
    }

    immobrowse.config.listContainer.innerHTML = html + '</div>';
  }
}


immobrowse.expose = function (identifier) {
  var immobilie = immobrowse.getRealEstate(identifier);

  if (immobilie == null) {
    immobrowse.error('Could not show real estate');
  } else {
    immobrowse.config.exposeContainer.innerHTML = immobrowse.details(immobilie);
  }
}


immobrowse.sortRealEstates = function (property, order) {
  immobrowse.debug('Sorting...');

  if (immobrowse.realEstates == null) {
    immobrowse.warning('No real estates available.');
  } else {
    immobrowse.realEstates = immobrowse.realEstates.sort(
      immobrowse.getSorter(property, order));

    immobrowse.list();
  }
}
