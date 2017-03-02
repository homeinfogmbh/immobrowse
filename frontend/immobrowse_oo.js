/*
  immobrowse.js - ImmoBrowse object oriented JavaScript library

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

  Requires:
    * immobrowse.js
*/

var immobrowse = immobrowse || {};


/*
  Real estate wrapper pseudo-class
*/
immobrowse.RealEstate = function (cid, realEstate) {
  this.cid = cid;
  this.realEstate = realEstate;

  this.addressPreview = function () {
    if (this.realEstate.geo == null) {
      return 'N/A';
    } else {
      if (this.realEstate.geo.strasse == null) {
        return 'N/A';
      } else {
        if (this.realEstate.geo.hausnummer == null) {
          return this.realEstate.geo.strasse;
        } else {
          return this.realEstate.geo.strasse + ' ' + this.realEstate.geo.hausnummer;
        }
      }
    }
  }

  this.cityPreview = function () {
    if (this.realEstate.geo == null) {
      return 'N/A';
    } else {
      if (this.realEstate.geo.ort == null) {
        return 'N/A';
      } else {
        if (this.realEstate.geo.regionaler_zusatz == null || this.realEstate.geo.regionaler_zusatz == this.realEstate.geo.ort) {
          return this.realEstate.geo.ort;
        } else {
          return this.realEstate.geo.ort + ' ' + this.realEstate.geo.regionaler_zusatz;
        }
      }
    }
  }

  this.objektnr_extern = function () {
    return this.realEstate.verwaltung_techn.objektnr_extern;
  }

  this.objekttitel = function () {
    if (this.realEstate.freitexte != null) {
      if (this.realEstate.freitexte.objekttitel != null) {
        return this.realEstate.freitexte.objekttitel;
      }
    }

    var html = '';
    var rooms = this.rooms();
    if (rooms == null) {
      html += 'Wohnung | ';
    } else {
      html += rooms + ' Zimmer Wohnung | ';
    }
    if (this.showAddress()) {
      html += this.addressPreview();
      html += ' | ';
    }
    html += this.cityPreview();
    return html;
  }

  /*
    Extracts a potential title image from a
    real estate or null if none was found.
  */
  this.titleImage = function () {
    if (this.realEstate.anhaenge == null) {
      return null;
    } else {
      if (this.realEstate.anhaenge.anhang == null) {
        return null;
      } else {
        for (var i = 0; i < this.realEstate.anhaenge.anhang.length; i++) {
          var anhang = this.realEstate.anhaenge.anhang[i];

          if (anhang.gruppe == 'TITELBILD') {
            return anhang;
          }
        }

        for (var i = 0; i < this.realEstate.anhaenge.anhang.length; i++) {
          var anhang = this.realEstate.anhaenge.anhang[i];

          if (anhang.gruppe == 'AUSSENANSICHTEN') {
            return anhang;
          }
        }

        for (var i = 0; i < this.realEstate.anhaenge.anhang.length; i++) {
          var anhang = this.realEstate.anhaenge.anhang[i];

          if (anhang.gruppe == 'BILD') {
            return anhang;
          }
        }

        for (var i = 0; i < this.realEstate.anhaenge.anhang.length; i++) {
          var anhang = this.realEstate.anhaenge.anhang[i];

          if (anhang.gruppe == 'GRUNDRISS') {
            return anhang;
          }
        }
        return null;
      }
    }
  }

  this.street = function () {
    if (this.realEstate.geo == null) {
      return null;
    } else {
      if (this.realEstate.geo.strasse == null) {
        return null;
      } else {
        return this.realEstate.geo.strasse;
      }
    }
  }

  this.rooms = function() {
    if (this.realEstate.flaechen == null) {
      return null;
    } else {
      if (this.realEstate.flaechen.anzahl_zimmer == null) {
        return null;
      } else {
        return this.realEstate.flaechen.anzahl_zimmer.toString().replace(".", ",");;
      }
    }
  }

  this.area = function () {
    if (this.realEstate.flaechen == null) {
      return null;
    } else {
      if (this.realEstate.flaechen.wohnflaeche == null) {
        if (this.realEstate.flaechen.nutzflaeche == null) {
          if (this.realEstate.flaechen.gesamtflaeche == null) {
            return null;
          } else {
            return this.realEstate.flaechen.gesamtflaeche;
          }
        } else {
          return this.realEstate.flaechen.nutzflaeche;
        }
      } else {
        return this.realEstate.flaechen.wohnflaeche;
      }
    }
  }

  this.netColdRent = function () {
    if (this.realEstate.preise == null) {
      return null;
    } else {
      if (this.realEstate.preise.nettokaltmiete == null) {
        return null;
      } else {
        return this.realEstate.preise.nettokaltmiete;
      }
    }
  }

  this.coldRent = function () {
    if (this.realEstate.preise == null) {
      return null;
    } else {
      if (this.realEstate.preise.kaltmiete == null) {
        return null;
      } else {
        return this.realEstate.preise.kaltmiete;
      }
    }
  }

  this.rent = function () {
    var netColdRent = this.netColdRent();

    if (netColdRent == null) {
      return this.coldRent();
    } else {
      return netColdRent;
    }
  }

  this.cableSatTv = function () {
    if (this.realEstate.ausstattung == null) {
      return null;
    } else {
      return this.realEstate.ausstattung.kabel_sat_tv;
    }
  }

  this.builtInKitchen = function () {
    if (this.realEstate.ausstattung == null) {
      return false;
    } else {
      if (this.realEstate.ausstattung.kueche == null) {
        return false;
      } else {
        return this.realEstate.ausstattung.kueche.EBK;
      }
    }
  }

  this.basementRoom = function () {
    if (this.realEstate.ausstattung == null) {
      return null;
    } else {
      return this.realEstate.ausstattung.unterkellert == 'JA';
    }
  }

  this.balconies = function () {
    if (this.realEstate.flaechen == null) {
      return 0;
    } else {
      if (this.realEstate.flaechen.anzahl_balkone == null) {
        return 0;
      } else {
        return this.realEstate.flaechen.anzahl_balkone;
      }
    }
  }

  this.terraces = function () {
    if (this.realEstate.flaechen == null) {
      return 0;
    } else {
      if (this.realEstate.flaechen.anzahl_terrassen == null) {
        return 0;
      } else {
        return this.realEstate.flaechen.anzahl_terrassen;
      }
    }
  }

  this.shower = function () {
    if (this.realEstate.ausstattung == null) {
      return false;
    } else {
      if (this.realEstate.ausstattung.bad == null) {
        return false;
      } else {
        return this.realEstate.ausstattung.bad.DUSCHE;
      }
    }
  }

  this.bathTub = function () {
    if (this.realEstate.ausstattung == null) {
      return false;
    } else {
      if (this.realEstate.ausstattung.bad == null) {
        return false;
      } else {
        return this.realEstate.ausstattung.bad.WANNE;
      }
    }
  }

  this.bathroomWindow = function () {
    if (this.realEstate.ausstattung == null) {
      return false;
    } else {
      if (this.realEstate.ausstattung.bad == null) {
        return false;
      } else {
        return this.realEstate.ausstattung.bad.FENSTER;
      }
    }
  }

  this.lavatoryDryingRoom = function () {
    if (this.realEstate.ausstattung == null) {
      return false;
    } else {
      return this.realEstate.ausstattung.wasch_trockenraum;
    }
  }

  this.barrierFree = function () {
    if (this.realEstate.ausstattung == null) {
      return false;
    } else {
      return this.realEstate.ausstattung.barrierefrei;
    }
  }

  this.objectTypes = function () {
    var types = [];
    var objektart = this.realEstate.objektkategorie.objektart;

    if (objektart.zimmer != null) {
      types.push('ZIMMER');
    }

    if (objektart.wohnung != null) {
      types.push('WOHNUNG');
      types.concat(objektart.wohnung);
    }

    return types;
  }

  this.marketingTypes = function () {
    var types = [];
    var vermarktungsart = this.realEstate.objektkategorie.vermarktungsart;

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

  this.showAddress = function () {
    if (this.realEstate.verwaltung_objekt == null) {
      return true;
    } else {
      if (this.realEstate.verwaltung_objekt.objektadresse_freigeben == null) {
        return true;
      } else {
        return this.realEstate.verwaltung_objekt.objektadresse_freigeben;
      }
    }
  }

  this.matchTypes = function (types) {
    if (types == null) {
      return true;
    } else {
      var myTypes = this.objectTypes();

      for (var i = 0; i < myTypes.length; i++) {
        if (types.indexOf(myTypes[i]) >= 0) {
          return true;
        }
      }

      return false;
    }
  }

  this.matchMarketing = function (types) {
    if (types == null) {
      return true;
    } else {
      var myTypes = this.marketingTypes();

      for (var i = 0; i < myTypes.length; i++) {
        if (types.indexOf(myTypes[i]) >= 0) {
          return true;
        }
      }

      return false;
    }
  }

  this.attachmentURL = function (anhang) {
    if (anhang == null) {
      return null;
    } else {
      return 'https://tls.homeinfo.de/immobrowse/attachment/' + anhang.id
        + '?customer=' + this.cid + '&objektnr_extern=' + this.objektnr_extern();
    }
  }

  this.preview = function () {
    var objektnr_extern = this.objektnr_extern();
    var titleImageUrl = this.attachmentURL(this.titleImage());
    var rooms = this.rooms();

    var html = '<div class="ib-preview-entry" onclick="showDetailExpose(\'' + objektnr_extern + '\');">';

    if (titleImageUrl != null) {
      html += immobrowse.titleImageHtml(titleImageUrl);
    } else {
      html += immobrowse.titleImageHtml(immobrowse.titleImageDummy);
    }

    html += '<div class="ib-preview-data">';
    html += '<div class="ib-preview-header">';
    html += '<div class="ib-preview-header-title">';
    html += '<a href="#"><h3><strong>' + this.objekttitel() + '</strong></h3></a>';
    //html += '<div class="ib-preview-header-sub">' + 'Wohnung zur Miete' + '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ib-preview-body">';
    html += '<div class="ib-preview-rent">';
    html += '<div class="ib-preview-rent-caption">Nettokaltmiete</div>';
    html += '<div class="ib-preview-rent-data">' + immobrowse.euroHtml(this.rent()) + '</div>';
    html += '</div>';

    html += '<div class="ib-preview-area">';
    html += '<div class="ib-preview-area-caption">Wohnfläche</div>';
    html += '<div class="ib-preview-area-data">' + this.realEstate.flaechen.wohnflaeche + ' m²</div>';
    html += '</div>';

    html += '<div class="ib-preview-rooms">';
    html += '<div class="ib-preview-rooms-caption">Zimmer</div>';
    html += '<div class="ib-preview-rooms-data">' + rooms + '</div>';
    html += '</div>';


    html += '<div class="ib-preview-zimmer">';
    html += '<div class="ib-preview-zimmer-caption">Verfügbar ab</div>';
    html += '<div class="ib-preview-zimmer-data">' + this.realEstate.verwaltung_objekt.verfuegbar_ab + '</div>';
    html += '</div>';
    html += '</div>';


    if (this.realEstate.ausstattung != null) {
      if (this.realEstate.ausstattung.kueche != null || this.realEstate.ausstattung.bad != null ||
          this.realEstate.ausstattung.kabel_sat_tv || this.realEstate.ausstattung.stellplatzart != null ||
          this.realEstate.ausstattung.barrierefrei || this.realEstate.ausstattung.fahrstuhl != null ||
          this.realEstate.flaechen.anzahl_balkone > 0 || this.realEstate.ausstattung.bad != null ||
          this.realEstate.ausstattung.unterkellert || this.realEstate.ausstattung.rollstuhlgerecht) {
        html += (this.realEstate.flaechen.anzahl_balkone > 0) ?'<div class="ib-preview-oval"><div class="oval">Balkon</div></div>' :'';
        html += (this.realEstate.ausstattung.barrierefrei) ?'<div class="ib-preview-oval"><div class="oval">Barrierefrei</div></div>' :'';
        html += (this.realEstate.ausstattung.kabel_sat_tv) ?'<div class="ib-preview-oval"><div class="oval">Kabel/Sat/TV</div></div>' :'';
        html += (this.realEstate.ausstattung.unterkellert) ?'<div class="ib-preview-oval"><div class="oval">Keller</div></div>' :'';
        html += (this.realEstate.ausstattung.rollstuhlgerecht) ?'<div class="ib-preview-oval"><div class="oval">Rollstuhlgerecht</div></div>' :'';
        if (this.realEstate.ausstattung.bad != null) {
          html += (this.realEstate.ausstattung.bad.FENSTER) ?'<div class="ib-preview-oval"><div class="oval">Fenster im Bad</div></div>' :'';
          html += (this.realEstate.ausstattung.bad.WANNE) ?'<div class="ib-preview-oval"><div class="oval">Badewanne</div></div>' :'';
          html += (this.realEstate.ausstattung.bad.DUSCHE) ?'<div class="ib-preview-oval"><div class="oval">Dusche</div></div>' :'';
        }
        if (this.realEstate.ausstattung.kueche != null) {
          html += (this.realEstate.ausstattung.kueche.EBK) ?'<div class="ib-preview-oval"><div class="oval">EBK</div></div>' :'';
        }
        if (this.realEstate.ausstattung.bad != null) {
          html += (this.realEstate.ausstattung.bad.WANNE) ?'<div class="ib-preview-oval"><div class="oval">Badewanne</div></div>' :'';
        }
        if (this.realEstate.ausstattung.stellplatzart != null) {
          html += (this.realEstate.ausstattung.stellplatzart.FREIPLATZ) ?'<div class="ib-preview-oval"><div class="oval">Stellplatz</div></div>' :'';
        }
        if (this.realEstate.ausstattung.fahrstuhl != null) {
          html += (this.realEstate.ausstattung.fahrstuhl.PERSONEN) ?'<div class="ib-preview-oval"><div class="oval">Fahrstuhl</div></div>' :'';
        }
      }
    }

    html += '</div>';
    html += '</div>';
    return html;
  }
}


/*
  Real estate list pseudo-class
*/
immobrowse.List = function (cid, filters, sorting) {
  this.cid = cid;
  this.filters = filters;
  this.sorting = sorting;
  this.realEstates = null;

  // Match filters on a real estate
  this.match = function (realEstate) {
    var rent = immobrowse.rent(realEstate);

    if (this.filters.priceMin >= rent)
      return false;
    else if (this.filters.priceMax <= rent)
      return false;
    else if (this.filters.areaMin >= realEstate.flaechen.wohnflaeche)
      return false;
    else if (this.filters.roomsMin >= realEstate.flaechen.anzahl_zimmer)
      return false;
    else if (this.filters.ebk) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (realEstate.ausstattung.kueche != null)
          if (!realEstate.ausstattung.kueche.EBK)
            return false;
      }
    } else if (this.filters.bathtub) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (realEstate.ausstattung.bad != null)
          if (!realEstate.ausstattung.bad.WANNE)
            return false;
      }
    } else if (this.filters.carSpace) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (realEstate.ausstattung.stellplatzart != null)
          if (!realEstate.ausstattung.stellplatzart.TIEFGARAGE)
            return false;
      }
    } else if (this.filters.elevator) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (realEstate.ausstattung.fahrstuhl != null)
          if (!realEstate.ausstattung.fahrstuhl.PERSONEN)
            return false;
      }
    } else if (this.filters.garden) {
      if (realEstate.ausstattung != null) {
        if (jQuery.isEmptyObject(realEstate.ausstattung))
          return false;
        else if (!realEstate.ausstattung.gartennutzung)
          return false;
      }
    }
    return true;
  }

  // Filters real estates
  this.filter = function (realEstates) {
    var filteredRealEstates = [];

    for (var i = 0; i < realEstates.length; i++) {
      if (this.match(realEstates[i].realEstate)) {
        filteredRealEstates.push(realEstates[i]);
      } else {
        immobrowse.logger.debug('Discarding: ' + realEstates[i].objektnr_extern());
      }
    }

    if (! filteredRealEstates) {
      immobrowse.logger.warning('No real estates available after filtering.');
    }

    return filteredRealEstates;
  }

  // Sorts real estates
  this.sort = function (property, order) {
    immobrowse.logger.debug('Sorting after ' + property + ' ' + order + '.');
    this.realEstates.sort(immobrowse.getSorter(property, order));
  }

  // Converts real estates to HTML
  this.htmlList = function (realEstates) {
    var html = '';

    for (var i = 0; i < realEstates.length; i++) {
      html += realEstates[i].preview();
      html += '<br>';
    }

    if (html == '') {
     return 'Es konnten keine Angebote gefunden werden.';
    } else {
      return '<div class="ib-preview-list">' + html + '</div>';
    }
  }

  this.getRealEstates = function (htmlElement, loadAnimation) {
    var this_ = this;

    $.ajax({
      url: 'https://tls.homeinfo.de/immobrowse/list/' + this_.cid,
      dataType: "json",
      success: function (json) {
        immobrowse.logger.info('Retrieved ' + json.length + ' real estates.');
        immobrowse.logger.debug(JSON.stringify(json));
        this_.realEstates = [];

        for (var i = 0; i < json.length; i++) {
          this_.realEstates.push(new immobrowse.RealEstate(this_.cid, json[i]));
        }

        if (htmlElement != null) {
          this_.render(htmlElement, loadAnimation);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        immobrowse.logger.error(xhr.responseText);
        immobrowse.logger.debug(ajaxOptions);
        immobrowse.logger.debug(thrownError);
        // TODO: Display error message
      }
    });
  }

  // Renders real estates into the given HTML element
  this.render = function (htmlElement, loadAnimation) {
    immobrowse.logger.debug('CALLED');
    if (this.realEstates == null) {
      this.getRealEstates(htmlElement, loadAnimation);
    } else {
      htmlElement.innerHTML = this.htmlList(this.filter(this.realEstates));

      if (loadAnimation != null) {
        loadAnimation.hide();
      }
    }
  }
}