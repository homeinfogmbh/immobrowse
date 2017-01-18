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
  sortingSelector: null,
  orderingSelector: null,
  listContainer: null,
  exposeContainer: null,
  districtsContainer: null
};


/*** logging ***/

immobrowse._log = function(prefix, msg) {
  console.log(prefix + ' immobrowse: ' + msg);
}


immobrowse.warning = function(msg) {
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
  Compares two nullable numerical values so
  that null values always come out last.
*/
immobrowse.compareNum = function (alice, bob, descending) {
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
      if (descending) {
        return bob - alice;
      } else {
        return alice - bob;
      }
    }
  }
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
    return (price.toFixed(2) + ' &#8364;').replace('.',',');
  }
}


immobrowse.squareMetersHtml = function (area) {
  if (area == null) {
    return 'N/A';
  } else {
    return (area.toFixed(2) + ' m&#178;').replace('.', ',');
  }
}


immobrowse.titleImageHtml = function (url) {
  return '<img src="' + url + '" class="portrait" id="immosearch_image" width="300" height="201">';
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
      for (anhang of immobilie.anhaenge.anhang) {
        if (anhang.gruppe == 'TITELBILD') {
          return anhang;
        }
      }

      for (anhang of immobilie.anhaenge.anhang) {
        if (anhang.gruppe == 'AUSSENANSICHTEN') {
          return anhang;
        }
      }

      for (anhang of immobilie.anhaenge.anhang) {
        if (anhang.gruppe == 'GRUNDRISS') {
          return anhang;
        }
      }

      for (anhang of immobilie.anhaenge.anhang) {
        if (anhang.gruppe == 'BILD') {
          return anhang;
        }
      }

      return null;
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
    for (type of immobrowse.objectTypes(immobilie)) {
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
    for (type of immobrowse.marketingTypes(immobilie)) {
      if (immobrowse.config.filters.marketing.indexOf(type) >= 0) {
        return true;
      }
    }

    return false;
  }
}


immobrowse.filter = function (realEstates) {
  var filteredRealEstates = [];

  for (realEstate of realEstates) {
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
    return immobrowse.compareNum(
      immobrowse.rooms(immobilie1),
      immobrowse.rooms(immobilie2),
      descending);
  }
}


immobrowse.sortByArea = function (descending) {
  return function compareAreas(immobilie1, immobilie2) {
    return immobrowse.compareNum(
      immobrowse.area(immobilie1),
      immobrowse.area(immobilie2),
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
    default:
      throw 'Invalid sorting property: ' + property;
  }
}


/*** Invocation ***/

/*
  Retrieves real estates from the back-end API
  and invokes appropriate callback functions
*/
immobrowse.getRealEstates = function (cid, successCallback, errorCallback) {
  $.ajax({
    url: 'https://tls.homeinfo.de/realestates/customer/' + cid,
    dataType: "json",
    success: function (json) {
      immobrowse.debug('Retrieved ' + json.immobilie.length + ' real estates.');
      immobrowse.realEstates = immobrowse.filter(json.immobilie);
      displayCallback();
    },
    error: errorCallback
  });
}


immobrowse.preview = function (immobilie) {
  var netColdRent = immobrowse.netColdRent(immobilie);
  var coldRent = immobrowse.coldRent(immobilie);
  var rooms = immobrowse.rooms(immobilie);
  var area = immobrowse.area(immobilie);

  var rentAnnotation = 'Miete zzgl. NK';
  var html = '<div class="row panel-body">';
  html += '<div class="col-md-3"><div class="img_mask img-responsive img-thumbnail">';
  html += immobrowse.titleImageHtml('https://tls.homeinfo.de/immosearch/attachment/2776312');  // Debug
  html += '</div></div>';
  html += '<div class="col-md-9">';
  html += '<div class="col-md-12 col-sm-12 col-xs-12">';
  html += '<h4><strong>';

  if (rooms == null) {
    html += 'Wohnung | ';
  } else {
    html += rooms + ' Zimmer Wohnung | ';
  }

  html += immobrowse.addressPreview(immobilie.geo);
  html += ' | ';
  html += immobrowse.cityPreview(immobilie.geo);
  html += '</strong></h4>';
  html += '<small>';
  html += 'Wohnung zur Miete';
  html += '</small>';
  html += '<div class="row col-md-12 col-sm-12 col-xs-12" style="margin-top:10px;">';
  html += '<div class="col-md-4">';
  html += '<h4><strong>';

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

  html += '</strong></h4>';
  html += '<small>';
  html += rentAnnotation;
  html += '</small>';
  html += '</div><div class="col-md-4">';
  html += '<h4><strong>';
  html += immobrowse.squareMetersHtml(area);
  html += '</strong></h4>';
  html += '<small>';
  html += 'Wohnfl&auml;che';
  html += '</small>';
  html += '</div>';
  html += '<div class="col-md-4">';
  html += '<h4><strong>';

  if (rooms == null) {
    html += 'N/A';
  } else {
    html += rooms;
  }

  html += '</strong></h4>';
  html += '<small>';
  html += 'Zimmer';
  html += '</small>';
  html += '</div>';
  html += '</div>';
  html += '<div class="col-md-12 col-sm-12 col-xs-12" style="margin-top:25px;"></div>';
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
  header += 'Wohnungsnr: 1/8/31';
  header += '</strong></button></h3></div>'
  html += header;

  var body = '';


}


immobrowse.list = function () {
  if (immobrowse.realEstates == null) {
    immobrowse.warning('No real estates available.');
  } else {
    html = '<table>';

    for (realEstate of immobrowse.realEstates) {
      html += '<tr><td>' + immobrowse.preview(realEstate) + '</td></tr>';
    }

    immobrowse.config.listContainer.innerHTML = html + '</table>';
  }
}


immobrowse.sortRealEstates = function () {
  if (immobrowse.realEstates == null) {
    immobrowse.warning('No real estates available.');
  } else {
    immobrowse.realEstates = immobrowse.realEstates.sort(
      immobrowse.getSorter(
        immobrowse.config.sortingProperty.value,
        immobrowse.config.sortingOrder.value));

    immobrowse.list();
  }
}
