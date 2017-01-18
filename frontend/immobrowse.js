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

immobrowse.realEstates = [];

/*** logging ***/

immobrowse.logLevel = 1;


immobrowse.log = function(msg) {
  console.log('ImmoBrowse > ' + msg);
}


immobrowse.warning = function(msg) {
  if (immobrowse.logLevel >= 0) {
    immobrowse.log('ERROR: ' + msg);
  }
}


immobrowse.warning = function(msg) {
  if (immobrowse.logLevel >= 1) {
    immobrowse.log('Warning: ' + msg);
  }
}


immobrowse.info = function(msg) {
  if (immobrowse.logLevel >= 3) {
    immobrowse.log('Info: ' + msg);
  }
}


immobrowse.success = function(msg) {
  if (immobrowse.logLevel >= 4) {
    immobrowse.log('Success: ' + msg);
  }
}


immobrowse.debug = function(msg) {
  if (immobrowse.logLevel >= 5) {
    immobrowse.log('DEBUG: ' + msg);
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


immobrowse.address2html = function (geo) {
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


immobrowse.city2html = function (geo) {
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
      break;
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
      immobrowse.realEstates = json.immobilie;
      displayCallback();
    },
    error: errorCallback
  });
}


immobrowse.sortRealEstates function (realEstates, sortingProperty, sortingOrder) {
  var sorter = immobrowse.getSorter(sortingProperty, sortingOrder);
}


immobrowse.preview = function (immobilie) {
  var netColdRent = immobrowse.netColdRent(immobilie);
  var coldRent = immobrowse.coldRent(immobilie);
  var rooms = immobrowse.rooms(immobilie);
  var area = immobrowse.area(immobilie);

  var rentAnnotation = 'Miete zzgl. NK';
  var html = '<div class="row panel-body">';
  html += '<div class="col-md-3"><div class="img_mask img-responsive img-thumbnail">';
  html += immobrowse.titleImage('https://tls.homeinfo.de/immosearch/attachment/2776312');
  html += '</div></div>';
  html += '<div class="col-md-9">';
  html += '<div class="col-md-12 col-sm-12 col-xs-12">';
  html += '<h4><strong>';

  if (rooms == null) {
    html += 'Wohnung | ';
  } else {
    html += rooms + ' Zimmer Wohnung | ';
  }

  html += immobrowse.address2html(immobilie.geo);
  html += ' | ';
  html += immobrowse.city2html(immobilie.geo);
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
  html += rooms;
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
  html = '';
}
