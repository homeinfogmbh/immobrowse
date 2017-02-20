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

TEST
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
	immobrowse.config.exposeContainer.innerHTML = "Leider ist ein Fehler aufgetreten.";
  } else
	immobrowse.config.exposeContainer.innerHTML = "Leider ist ein Fehler aufgetreten.";
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

        if (anhang.gruppe == 'BILD') {
          return anhang;
        }
      }

      for (var i=0; i<immobilie.anhaenge.anhang.length; i++) {
        var anhang = immobilie.anhaenge.anhang[i];

        if (anhang.gruppe == 'GRUNDRISS') {
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

immobrowse.rooms = function(immobilie) {
  if (immobilie.flaechen == null) {
    return null;
  } else {
    if (immobilie.flaechen.anzahl_zimmer == null) {
      return null;
    } else {
      return immobilie.flaechen.anzahl_zimmer.toString().replace(".", ",");;
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


immobrowse.showAddress = function (immobilie) {
  if (immobilie.verwaltung_objekt == null) {
    return true;
  } else {
    if (immobilie.verwaltung_objekt.objektadresse_freigeben == null) {
      return true;
    } else {
      return immobilie.verwaltung_objekt.objektadresse_freigeben;
    }
  }
}


/*** Filtering ***/

immobrowse.matchTypes = function (immobilie) {
  if (immobrowse.config.filters.types == null) {
    return true;
  } else {
    var types = immobrowse.objectTypes(immobilie);
	var type;
    for (var i=0; i<types.length; i++) {
		type = types[i];
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
  var realEstate;
  for (var i = 0; i < realEstates.length; i++) {
    realEstate = realEstates[i];
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
    success: function (realEstates) {
	  //console.log(JSON.stringify(realEstates));
      immobrowse.debug('Retrieved ' + realEstates.length + ' real estates.');
      immobrowse.realEstates = immobrowse.filter(realEstates);
	  toggleSorting('rooms');
	  $('.loader').hide();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      immobrowse.error(xhr.responseText);
      immobrowse.debug(ajaxOptions);
      immobrowse.debug(thrownError);
      immobrowse.realEstates = [];
    }
  });
}
immobrowse.getRealEstate = function (object_extern, cid) {
  if (cid == null)
	  cid = immobrowse.config.customer;
  else
	immobrowse.config.customer = cid;
  $.ajax({
    url: 'https://tls.homeinfo.de/immobrowse/real_estate/' + object_extern + '?customer=' + cid,
    dataType: "json",
    success: function (realEstate) {
	  immobrowse.realEstate = realEstate;
	  immobrowse.expose();
	  $('.loader').hide();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      immobrowse.error(xhr.responseText);
      immobrowse.debug(ajaxOptions);
      immobrowse.debug(thrownError);
    }
  });
}

immobrowse.setSortingProperty = function (property) {
  immobrowse.config.sorting.property = property;
}


immobrowse.setSortingOrder = function (order) {
  immobrowse.config.sorting.order = order;
}


immobrowse.attachmentURL = function (anhang, objektnr_extern) {
  if (anhang == null)
	  return null;
  return 'https://tls.homeinfo.de/immobrowse/attachment/' + anhang.id + '?customer=' + immobrowse.config.customer + '&objektnr_extern=' + objektnr_extern;
}

/**TODO Mockup **/
immobrowse.titleImageDummy = 'https://tls.homeinfo.de/does/not/exist';


immobrowse.preview = function (immobilie) {
  var objektnr_extern = immobrowse.identify(immobilie);
  var titleImageUrl = immobrowse.attachmentURL(immobrowse.titleImage(immobilie), objektnr_extern);
  //var netColdRent = immobrowse.netColdRent(immobilie);
  //var coldRent = immobrowse.coldRent(immobilie);
  var rooms = immobrowse.rooms(immobilie);
  //var area = immobrowse.area(immobilie);

  var html = '<div class="ib-preview-entry" onclick="showDetailExpose(\'' + objektnr_extern + '\');">';

  if (titleImageUrl != null) {
    html += immobrowse.titleImageHtml(titleImageUrl);
  } else {
    html += immobrowse.titleImageHtml(immobrowse.titleImageDummy);
  }

  html += '<div class="ib-preview-data">';
  html += '<div class="ib-preview-header">';
  html += '<div class="ib-preview-header-title">';
  
if (immobilie.hasOwnProperty('freitexte'))
	if (immobilie.freitexte.hasOwnProperty('objekttitel'))
		html += '<a href="#"><h3><strong>' + immobilie.freitexte.objekttitel + '</strong></h3></a>';
	
	
  html += '<div class="ib-preview-header-main">';

  if (rooms == null) {
    html += 'Wohnung | ';
  } else {
    html += rooms + ' Zimmer Wohnung | ';
  }

  if (immobrowse.showAddress(immobilie)) {
    html += immobrowse.addressPreview(immobilie.geo);
    html += ' | ';
  }

  html += immobrowse.cityPreview(immobilie.geo);
  html += '</div>';
  //html += '<div class="ib-preview-header-sub">' + 'Wohnung zur Miete' + '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="ib-preview-body">';
  html += '<div class="ib-preview-rent">';
  html += '<div class="ib-preview-rent-caption">Nettokaltmiete</div>';
  html += '<div class="ib-preview-rent-data">' + getGermanDecimalFormat(immobilie.preise.nettokaltmiete) + ' €' + '</div>';
  html += '</div>';
  
  html += '<div class="ib-preview-area">';
  html += '<div class="ib-preview-area-caption">Wohnfläche</div>';  
  html += '<div class="ib-preview-area-data">' + immobilie.flaechen.wohnflaeche + '</div>';
  html += '</div>';
  
  html += '<div class="ib-preview-rooms">';
  html += '<div class="ib-preview-rooms-caption">Zimmer</div>';
  html += '<div class="ib-preview-rooms-data">' + rooms + '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  return html;
}


immobrowse.details = function (immobilie) { 
  //console.log(JSON.stringify(immobilie));
  immobrowse.titleImage(immobilie)
  var rooms = immobrowse.rooms(immobilie);
  var html = '';
  var documents = ''

  var header = '';
  header += '<h3 class="panel-title nohover">';
  header += '<div id="form_object_title">';
  if (getUrlParameter('parent'))
	header += '<div class="ib-preview-back" onclick="goBack();"> << Zurück<br></div>';
  header += '<strong>';
  if (immobilie.hasOwnProperty('freitexte'))
	if (immobilie.freitexte.hasOwnProperty('objekttitel'))
		header += immobilie.freitexte.objekttitel + '<br>';
  if (rooms == null) {
    header += 'Wohnung | ';
  } else {
    header += rooms + ' Zimmer Wohnung | ';
  }
  header += immobrowse.addressPreview(immobilie.geo);
  header += ' | ';
  header += immobrowse.cityPreview(immobilie.geo);
  header += '</strong><div></h3><br><br>';
  header += '<div id="objectNumber">';
  header += 'Objektnummer: ' + immobrowse.identify(immobilie);
  header += '</div>'
  html += header;

  var body = '';
  var maxImageCounter = 0; // Complete count of images; needed for the button to hide all images
  var i;
  if (immobilie.hasOwnProperty('anhaenge')) {
	  for (i = 0; i < immobilie.anhaenge.anhang.length; i++)
		if (immobilie.anhaenge.anhang[i].gruppe != "GRUNDRISS" && immobilie.anhaenge.anhang[i].gruppe != "DOKUMENTE")
			maxImageCounter++;
			
	  // Get anhaenge (images and documents)
	  var imagesLeft = '';
	  var imagesLeftCounter = 0;
	  var floorplans = '';
	  var floorplansCounter = 0;
	  
	  for (i = 0; i < immobilie.anhaenge.anhang.length; i++) {
		if (immobilie.anhaenge.anhang[i].gruppe == "GRUNDRISS") {
			floorplans += '<img src="' + immobrowse.attachmentURL(immobilie.anhaenge.anhang[i], immobrowse.identify(immobilie)) + '" id="floorplan' + floorplansCounter + '" alt="Grundriss' + (floorplansCounter+1) + '" class="ib-detail-image"' + ((floorplans != '') ?'style="display: none;")' :'') + ' />';
			floorplansCounter++;
		} else if (immobilie.anhaenge.anhang[i].gruppe == "DOKUMENTE") {
			documents += '<a href="' + immobrowse.attachmentURL(immobilie.anhaenge.anhang[i], immobrowse.identify(immobilie)) + '" target="_blank"><img src="pdf_icon.png" id="document' + i + '" alt="Dokument' + (i+1) + '" /> ' + immobrowse.titleImage(immobilie).anhangtitel + '</a>';
		} else {
			imagesLeft += '<img src="' + immobrowse.attachmentURL(immobilie.anhaenge.anhang[i], immobrowse.identify(immobilie)) + '" id="image' + imagesLeftCounter + '" alt="Bild' + (imagesLeftCounter+1) + '" class="ib-detail-image"' + ((imagesLeft != '') ?'style="display: none;")' :'') + ' />';
			imagesLeftCounter++;
		}
	  }
	  body += '<div id="details-body-left">';
	  body += imagesLeft;
	  body += '</div>';
	  body += '<div id="details-body-right">';
	  body += floorplans;
	  body += '</div>';
	  
	  // Set the button for each image
	  body += '<div style="clear:both"></div><br>'; // below again
	  for (i = 0; i < imagesLeftCounter; i++)
		if (immobilie.anhaenge.anhang[i].gruppe != "GRUNDRISS" && immobilie.anhaenge.anhang[i].gruppe != "DOKUMENTE")
			body += '<button class="showimage" id="button' + i + '" class="btn btn-success pull-right" type="button" data-nr="' + i + '" data-nrmax="' + maxImageCounter + '">' + (i+1) + '</button>';
  }
  
  body += '<div style="clear:both"></div><br><br>'; // below again
  body += '<div id="details-body-left">';
  body += '<h3>PREISE & KOSTEN</h3>';
  body += '<table width="420px" cellspacing="0">';
  if (immobilie.preise.nettokaltmiete != undefined) {
	body += '<tr>';
	body += '<td><strong>Nettokaltmiete</strong></td>';
	body += '<td align="right">' + getGermanDecimalFormat(Number(immobilie.preise.nettokaltmiete)) + ' €</td>';
	body += '</tr>';
  }
  if (immobilie.preise.nebenkosten != undefined) {
	  body += '<tr>';
	  body += '<td>Nebenkosten</td>';
	  body += '<td align="right">' + getGermanDecimalFormat(immobilie.preise.nebenkosten) + ' €</td>';
	  body += '</tr>';
  }
  if (immobilie.preise.heizkosten != undefined) {
	  body += '<tr>';
	  body += '<td>Heizkosten</td>';
	  body += '<td align="right">' + getGermanDecimalFormat(immobilie.preise.heizkosten) + ' €</td>';
	  body += '</tr>';
  }
  if (immobilie.preise.heizkosten_enthalten != undefined) {
	  body += '<tr>';
	  body += '<td>Heizkosten in Nebenkosten enthalten</td>';
	  body += '<td align="right">' + ((immobilie.preise.heizkosten_enthalten == true) ?"Ja" :"Nein") + '</td>';
	  body += '</tr>';
  }  
  if (immobilie.preise.kaution != undefined) {
	  body += '<tr>';
	  body += '<td>Kaution oder Genossenschaftsanteile</td>';
	  body += '<td align="right">' + getGermanDecimalFormat(immobilie.preise.kaution) + ' €</td>';
	  body += '</tr>';  
  }

  if (immobilie.preise.provisionspflichtig != undefined) {
	  body += '<tr>';
	  body += '<td><strong>Provisionsfrei</strong></td>';	  
	  if (immobilie.preise.provisionspflichtig == true)
		body += '<td align="right">Nein</td>';
	  else if (immobilie.preise.provisionspflichtig == false)
		body += '<td align="right">Ja</td>';
	  body += '</tr>';
  }
  body += '</table><br></div>';
  
  body += '<div id="details-body-right">';
  body += '<h3>GRÖSSE & ZUSTAND</h3>';
  body += '<table width="420px" cellspacing="0">';
  if (immobilie.flaechen.hasOwnProperty('wohnflaeche')) {
	  body += '<tr><td><strong>Wohnfläche in m²</strong></td>';
	  body += '<td align="right">' + immobilie.flaechen.wohnflaeche + '</td></tr>';
  }
  if (immobilie.flaechen.hasOwnProperty('anzahl_zimmer')) {
	  body += '<tr><td><strong>Zimmer</strong></td>';
	  body += '<td align="right">' + immobilie.flaechen.anzahl_zimmer.toString().replace(".", ","); + '</td></tr>';
  }
  if (immobilie.geo.hasOwnProperty('etage')) {
	  body += '<tr><td>Etage</td>';
	  body += '<td align="right">' + getZustand(immobilie.geo.etage) + '</td></tr>';
  }   
  if (immobilie.verwaltung_objekt.verfuegbar_ab != undefined) {
	body += '<tr><td>Verfügbar ab</td>';
	body += '<td align="right">' + immobilie.verwaltung_objekt.verfuegbar_ab + '</td></tr>';
  } 
  if (immobilie.hasOwnProperty('zustand_angaben')) {
	  if (immobilie.zustand_angaben.hasOwnProperty('baujahr')) {
		  body += '<tr><td>Baujahr</td>';
		  body += '<td align="right">' + immobilie.zustand_angaben.baujahr + '</td></tr>';
	  }  
	  if (immobilie.zustand_angaben.hasOwnProperty('zustand')) {
		  body += '<tr><td>Zustand</td>';
		  body += '<td align="right">' + getZustand(immobilie.zustand_angaben.zustand) + '</td></tr>';
	  }
  }
  if (immobilie.verwaltung_objekt.wbs_sozialwohnung == true) {
	body += '<tr><td>WBS</td>';
	body += '<td align="right">Erforderlich</td></tr>';
  }
  body += '</table><br></div>';
  
  body += '<div style="clear:both"></div>'; // below again
  body += '<div id="details-body-left">';
  body += '<h3>ENERGIEANGABEN</h3>';
  body += '<table width="420px" cellspacing="0">';
  body += '<tr>';
  body += '<td>Energieausweistyp</td>';
  if (immobilie.hasOwnProperty('zustand_angaben')) {
	  if (immobilie.zustand_angaben.hasOwnProperty('energiepass')) {
		  if (immobilie.zustand_angaben.energiepass.length > 0) {
			  body += '<td align="right">' + ((immobilie.zustand_angaben.energiepass[0].epart == "VERBRAUCH") ?'Verbrauchsausweis' :'Bedarfsausweis') + '</td>';
			  body += '</tr>';
			  if (immobilie.zustand_angaben.energiepass[0].energieverbrauchkennwert != "") {
				  body += '<tr>';
				  body += '<td>Endenergieverbrauch</td>';
				  body += '<td align="right">' + immobilie.zustand_angaben.energiepass[0].energieverbrauchkennwert + ' kWh/(m²*a)</td>';
				  body += '</tr>';
			  }
			  if (immobilie.zustand_angaben.energiepass[0].hasOwnProperty('primaerenergietraeger')) {
				  body += '<tr>';
				  body += '<td>Wesentlicher Energieträger</td>';
				  body += '<td align="right">' + getBefeuerung(immobilie.zustand_angaben.energiepass[0].primaerenergietraeger) + '</td>';
				  body += '</tr>';
			  }
			  if (immobilie.zustand_angaben.energiepass[0].hasOwnProperty('wertklasse')) {
				  body += '<tr>';
				  body += '<td>Effizienzklasse</td>';
				  body += '<td align="right">' + getBefeuerung(immobilie.zustand_angaben.energiepass[0].wertklasse) + '</td>';
				  body += '</tr>';
			  } 
		  }
		  if (immobilie.zustand_angaben.hasOwnProperty('letztemodernisierung')) {
			  body += '<tr>';
			  body += '<td>Letzte Modernisierung</td>';
			  body += '<td align="right">' + immobilie.zustand_angaben.letztemodernisierung + '</td>';
			  body += '</tr>';
		  }
	  }
  } else 
	  body += '<td align="right">Nicht angegeben</td>';
  body += '</tr>';  
  body += '</table><br></div>';

  if (immobilie.hasOwnProperty('ausstattung')) {
	  if (!jQuery.isEmptyObject(immobilie.ausstattung)) {
		  body += '<div id="details-body-right">';
		  body += '<h3>AUSSTATTUNG</h3>';
		  body += '<table width="420px" cellspacing="0">';
		  body += (immobilie.ausstattung.gartennutzung) ?'<tr><td style="border: none;"><img src="ok.png" /> Garten</td></tr>' :'';
		  if (immobilie.ausstattung.hasOwnProperty('kueche'))
			body += (immobilie.ausstattung.kueche.EBK) ?'<tr><td style="border: none;"><img src="ok.png" /> EBK</td></tr>' :'';
		  if (immobilie.ausstattung.hasOwnProperty('bad'))
			body += (immobilie.ausstattung.bad.WANNE) ?'<tr><td style="border: none;"><img src="ok.png" /> Badewanne</td></tr>' :'';
		  if (immobilie.ausstattung.hasOwnProperty('stellplatzart'))
			body += (immobilie.ausstattung.stellplatzart.TIEFGARAGE) ?'<tr><td style="border: none;"><img src="ok.png" /> Stellplatz</td></tr>' :'';
		  body += (immobilie.ausstattung.gaestewc) ?'<tr><td style="border: none;"><img src="ok.png" /> Gäste-WC</td></tr>' :'';
		  if (immobilie.ausstattung.hasOwnProperty('fahrstuhl'))
			body += (immobilie.ausstattung.fahrstuhl.PERSONEN) ?'<tr><td style="border: none;"><img src="ok.png" /> Fahrstuhl</td></tr>' :'';
		  body += '</table></div><br><br>';
	  }
  }

  body += '<div style="clear:both"></div><br>'; // below again
  if (immobilie.hasOwnProperty('freitexte')) {
	  if (immobilie.freitexte.hasOwnProperty('objektbeschreibung')) {
		body += '<h3>OBJEKTBESCHREIBUNG</h3>';
		body += '<table>';
		body += '<tr><td style="border: none;"> ' + immobilie.freitexte.objektbeschreibung + '</td></tr>';
		body += '</tr>';  
		body += '</table><br>';
	  }
  }
  
  if (immobilie.hasOwnProperty('freitexte')) {
	if (immobilie.freitexte.hasOwnProperty('lage')) {
		body += '<h3>LAGE</h3>';
		body += '<table>';
		body += '<tr><td style="border: none;"> ' + immobilie.freitexte.lage + '</td></tr>';
		body += '</tr>';  
		body += '</table><br>';
	}
  }

  if (immobilie.hasOwnProperty('freitexte')) {
	  if (immobilie.freitexte.hasOwnProperty('sonstige_angaben')) {
		body += '<h3>SONSTIGES</h3>';
		body += '<table>';
		body += '<tr><td style="border: none;"> ' + immobilie.freitexte.sonstige_angaben + '</td></tr>';
		body += '</tr>';  
		body += '</table><br>';
	  }
  }
  
  
  html += '<div id="content">' + body + '</div>';
  
  var footer = '';
  footer += '<div style="clear:both"></div>'; // below again
  footer += '<div id="details-body-left">';
  footer += '<h3>IHR ANSPRECHPARTNER</h3>';
  footer += '<b>' + ((immobilie.kontaktperson.anrede != "0") ?immobilie.kontaktperson.anrede :'') + ' ' + immobilie.kontaktperson.vorname + ' ' + immobilie.kontaktperson.name + '</b></br>';
  footer += (immobilie.kontaktperson.firma != undefined) ?immobilie.kontaktperson.firma + '</br>' : '';
  footer += (immobilie.kontaktperson.strasse != undefined && immobilie.kontaktperson.hausnummer != undefined) ?immobilie.kontaktperson.strasse + ' ' + immobilie.kontaktperson.hausnummer + '</br>' :'';
  footer += (immobilie.kontaktperson.plz != undefined && immobilie.kontaktperson.ort != undefined) ?immobilie.kontaktperson.plz + ' ' + immobilie.kontaktperson.ort + '</br>' :'';
  footer += (immobilie.kontaktperson.tel_durchw != undefined) ?'Tel.: ' + immobilie.kontaktperson.tel_durchw + '</br>' :'';
  footer += (immobilie.kontaktperson.url != undefined) ?'<a href="' + ((immobilie.kontaktperson.url.indexOf("http") == -1) ?'http://' + immobilie.kontaktperson.url :immobilie.kontaktperson.url) + '" target="_blank">' + immobilie.kontaktperson.url + '</a></br></br></br>': '</br></br></br>';
  footer += '</div>';
  
  footer += '<div id="details-body-right">';
  footer += '<h3>DOKUMENTE</h3>';  
  footer += '<table width="420px" cellspacing="0" style="background-color: #efefef">';
  if (documents == '')
	  footer += 'Keine Dokumente vorhanden';
  else
	footer += documents;
  footer += '</table><br></div>';
  footer += '<div style="clear:both"></div>'; // below again
  html += '<div id="footer">' + footer + '</div>';
 
  return html + '</div>';
}


immobrowse.list = function () {
  if (immobrowse.realEstates == null) {
    immobrowse.warning('No real estates available.');
  } else {
    html = '';
	var realEstate;
    for (var i = 0; i < immobrowse.realEstates.length; i++) {
		realEstate = immobrowse.realEstates[i];
		if (checkFilter(realEstate))  {
			html += immobrowse.preview(realEstate);
		}
    }
	if (html == '')
		html = 'Es konnten keine Angebote gefunden werden.';
    immobrowse.config.listContainer.innerHTML = '<div class="ib-preview-list">' + html + '</div>';
  }
}


immobrowse.expose = function () {
  var immobilie = immobrowse.realEstate;
  if (immobilie == null) {
    immobrowse.error('Could not show real estate');
  } else {
    immobrowse.config.exposeContainer.innerHTML = immobrowse.details(immobilie);
	$('.showimage').click(function() {
		for (var i = 0; i < $(this).data("nrmax"); i++)
			$('#image'+ i).hide();
		$('#image'+ $(this).data("nr")).show();
	});
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
function getBefeuerung(property) {
	switch (property) {
		case 'OEL':
			return "Öl";
		case 'GAS':
			return "Gas";
		case 'ELEKTRO':
			return "Elektisch";
		case 'ALTERNATIV':
			return "Alternativ";
		case 'SOLAR':
			return "Solar";
		case 'ERDWAERME':
			return "Erdwärme";
		case 'LUFTWP':
			return "Wärmepumpe Luft-Wasser";
		case 'FERN':
			return "Fernwärme";
		case 'BLOCK':
			return "Blockheizkraftwerk";
		case 'WASSER-ELEKTRO':
			return "Ergänzendes dezentrales Warmwasser";
		case 'PELLET':
			return "Pellet";
		case 'KOHLE':
			return "Kohle";
		case 'HOLZ':
			return "Holz";
		case 'FLUESSIGGAS':
			return "Flüssiggas";
	}
	return property;
}
function getZustand(property) {	
	switch (property) {
		case 'ERSTBEZUG':
			return "Erstbezug";
		case 'TEIL_VOLLRENOVIERUNGSBED':
			return "Teil-/Vollrenovierungsbedürftig";
		case 'NEUWERTIG':
			return "Neuwertig";
		case 'TEIL_VOLLRENOVIERT':
			return "Teil-/Vollrenoviert";
		case 'TEIL_SANIERT':
			return "Teilsaniert";
		case 'VOLL_SANIERT':
			return "Vollsaniert";
		case 'SANIERUNGSBEDUERFTIG':
			return "Sanierungsbedürftig";
		case 'BAUFAELLIG':
			return "Baufällig";
		case 'NACH_VEREINBARUNG':
			return "Nach Vereinbarung";
		case 'MODERNISIERT':
			return "Modernisiert";
		case 'GEPFLEGT':
			return "Gepflegt";
		case 'ROHBAU':
			return "Rohbau";
		case 'ENTKERNT':
			return "Entkernt";
		case 'ABRISSOBJEKT':
			return "Abrissobjekt";
		case 'PROJEKTIERT':
			return "Projektiert";			
	}
	return property;
}

function showDetailExpose(extern) {
	window.open('detailexpose.html?extern=' + extern + '&cid=' + immobrowse.config.customer + '&parent', '_self', false);
}
function goBack() {
    window.history.back();
}
function getGermanDecimalFormat(nr) {
	try {
		if (nr == undefined)
			return "";
		else {
			nr = String(nr);
			nr = nr.replace(".", ",");	
			if (nr.indexOf(",") == -1)
				nr += ",00";
			else if (nr.toString().indexOf(",")+2 == nr.toString().length)
				nr += "0";
		}
	} catch(err) {
		console.log(err);
		return "";
	}
	return nr;
}

function checkFilter(realEstate) {
	if (Number($('#pricefrom').val().replace(",",".")) > Number(realEstate.preise.nettokaltmiete))
		return false;
	else if (Number($('#pricetill').val().replace(",",".")) < Number(realEstate.preise.nettokaltmiete) && $('#pricetill').val().trim() != "")
		return false;
	else if (Number($('#areafrom').val().replace(",",".")) > Number(realEstate.flaechen.wohnflaeche) && $('#areafrom').val().trim() != "")
		return false;
	else if (Number($('#roomsfrom').val().replace(",",".")) > Number(realEstate.flaechen.anzahl_zimmer) && $('#roomsfrom').val().trim() != "")
		return false;
	else if ($("#checkbox_ebk").is(':checked')) {
		if (realEstate.hasOwnProperty('ausstattung')) {
			if (jQuery.isEmptyObject(realEstate.ausstattung))
				return false;
			else if (realEstate.ausstattung.hasOwnProperty('kueche'))
				if (!realEstate.ausstattung.kueche.EBK)
					return false;
		}
	} else if ($("#checkbox_bathtube").is(':checked')) {
		if (realEstate.hasOwnProperty('ausstattung')) {
			if (jQuery.isEmptyObject(realEstate.ausstattung))
				return false;
			else if (realEstate.ausstattung.hasOwnProperty('bad'))
				if (!realEstate.ausstattung.bad.WANNE)
					return false;
		}
	} else if ($("#checkbox_bathtube").is(':checked')) {
		if (realEstate.hasOwnProperty('ausstattung')) {
			if (jQuery.isEmptyObject(realEstate.ausstattung))
				return false;
			else if (realEstate.ausstattung.hasOwnProperty('stellplatzart'))
				if (!realEstate.ausstattung.stellplatzart.TIEFGARAGE)
					return false;
		}
	} else if ($("#checkbox_bathtube").is(':checked')) {
		if (realEstate.hasOwnProperty('ausstattung')) {
			if (jQuery.isEmptyObject(realEstate.ausstattung))
				return false;
			else if (realEstate.ausstattung.hasOwnProperty('fahrstuhl'))
				if (!realEstate.ausstattung.fahrstuhl.PERSONEN)
					return false;
		}	
	} else if ($("#checkbox_garden").is(':checked')) {
		if (realEstate.hasOwnProperty('ausstattung')) {
			if (jQuery.isEmptyObject(realEstate.ausstattung))
				return false;
			else if (!realEstate.ausstattung.gartennutzung)
				return false;
		}
	}
	return true;
}
