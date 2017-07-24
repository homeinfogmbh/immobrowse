/*
  barrierfree.js - ImmoBrowse barrier free JavaScript library

  (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this library.  If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>

  Requires:
    * homeinfo.js
    * immobrowse.js
    * jquery.js
    * sweetalert.js
*/
"use strict";

var barrierfree = barrierfree || {};

barrierfree.logger = new homeinfo.logging.Logger('barrierfree');


/*
  Queries real estate data from the API and runs callback function.
*/
barrierfree.getRealEstate = function (objectId, portal, callback) {
  jQuery.ajax({
    url: 'https://backend.homeinfo.de/barrierfree/expose/' + objectId + '?portal=' + portal,
    success: function (json) {
      callback(new barrierfree.RealEstate(json, portal));
    },
    error: function() {
      swal({
        title: 'Immobilie konnte nicht geladen werden.',
        text: 'Bitte versuchen Sie es später noch ein Mal.',
        type: 'error'
      });
    }
  });
}


/*
  Queries API for real estate list and runs callback function.
*/
barrierfree.getRealEstates = function (portal, callback) {
  jQuery.ajax({
    url: 'https://backend.homeinfo.de/barrierfree/list?portal=' + portal,
    success: function (json) {
      var realEstates = [];

      for (var i = 0; i < json.length; i++) {
        realEstates.push(new barrierfree.RealEstate(json[i], portal));
      }

      callback(realEstates)
    },
    error: function() {
      swal({
        title: 'Immobilien konnten nicht geladen werden.',
        text: 'Bitte versuchen Sie es später noch ein Mal.',
        type: 'error'
      });
    }
  });
}


/*
  Extended real estate with additional barrier
  freeness related properties and methods.
*/
barrierfree.RealEstate = function (json, portal) {
  immobrowse.RealEstate.call(this, json);
  this.portal = portal;

  /*
    Determines whether the real estate is completely barrier free
  */
  this.completelyBarrierFree = function () {
    var barrierFreeness = this.barrier_freeness || {};

    function entryOk() {
      var entry = barrierFreeness.entry || {};
      return barrierFreeness.stairs == '0' || (entry.ramp_din && (barrierFreeness.stairs == '0-1' || barrierFreeness.stairs == '2-8'));
    }

    function doorsOk() {
      var entry = barrierFreeness.entry || {};
      return barrierFreeness.wide_door && barrierFreeness.low_thresholds && barrierFreeness.wide_doors && entry.door_opener;
    }

    function liftOk() {
      var lift = barrierFreeness.lift || {};
      return lift.value == 'DIN';
    }

    function bathOk() {
      var bath = barrierFreeness.bath || {};
      return bath.wide && (bath.shower_tray == 'low' || bath.shower_tray == 'walk-in');
    }

    function wheelchairParkingOk() {
      return barrierFreeness.wheelchair_parking == 'indoors' || barrierFreeness.wheelchair_parking == 'outdoors';
    }

    function doobellPanelOk() {
      var entry = barrierFreeness.entry || {};
      return entry.doorbell_panel;
    }

    return entryOk() && doorsOk() && liftOk() && bathOk() && wheelchairParkingOk() && doobellPanelOk();
  }

  /*
    Determines whether the real estate is limited barrier free
  */
  this.limitedBarrierFree = function () {
    var barrierFreeness = this.barrier_freeness || {};
    var entry = barrierFreeness.entry || {};
    return barrierFreeness.stairs == '0' || (entry.ramp_din && (barrierFreeness.stairs == '0-1' || barrierFreeness.stairs == '2-8'));
  }

  this._super_amenities = this.amenities;

  /*
    Amenities extension
  */
  this.amenities = function () {
    var amenities = this._super_amenities();

    if (this.completelyBarrierFree()) {
      amenities.push('vollständig barrierefrei');
    } else if (this.limitedBarrierFree()) {
      amenities.push('eingeschränkt barrierefrei');
    }

    return amenities;
  }

  this.attachmentURL = function (anhang) {
    if (anhang == null) {
      return null;
    } else {
      return 'https://backend.homeinfo.de/barrierfree/attachment/' + anhang.id + '?real_estate=' + this.id + '&portal=' + this.portal;
    }
  }

  this.barrierFreeAmenities = function () {
    var barrierFreeAmenities = [];
    var barrierFreeness = this.barrier_freeness || {};
    var entry = barrier_freeness.entry || {};
    var lift = barrierFreeness.lift || {};
    var bath = barrierFreeness.bath || {};
    var balcony = barrierFreeness.balcony || {};

    if (barrierFreeness.stairs == '0') {
      barrierFreeAmenities.push('Keine Stufen bis zum Wohnungseingang');
    } else if (barrierFreeness.stairs == '0-1') {
      barrierFreeAmenities.push('Maximal eine Stufe bis zum Wohnungseingang');
    } else if (barrierFreeness.stairs == '2-8') {
      barrierFreeAmenities.push('2-8 Stufen bis zum Wohnungseingang');
    }

    if (entry.ramp_din) {
      barrierFreeAmenities.push('Rampe mit bis zu 6 % Gefälle (nach DIN-Norm)');
    } else if (entry.ramp_din === false) {
      barrierFreeAmenities.push('Rampe mit über 6 % Gefälle');
    }

    if (barrierFree.wide_door) {
      barrierFreeAmenities.push('Mindestbreite der Wohnungseingangstür 90 cm');
    }

    if (barrierFree.low_thresholds) {
      barrierFreeAmenities.push('keine Türschwellen > 2cm (außer Balkon)');
    }

    if (barrierFree.wide_doors) {
      barrierFreeAmenities.push('Mindestbreite aller Wohnungstüren 80 cm (außer Abstellraum und Balkon)');
    }

    if (entry.door_opener) {
      barrierFreeAmenities.push('Automatischer Türöffner an der Haustür');
    }

    if (lift) {
      barrierFreeAmenities.push('Aufzug');

      if (lift.wide_door) {
        barrierFreeAmenities.push('Mindestbreite der Aufzugstür 80 cm');
      }

      if (lift.value == '90x140') {
        barrierFreeAmenities.push('Kabinengröße bis 90 x 140 cm Innenmaß');
      } else if (lift.value == 'DIN') {
        barrierFreeAmenities.push('Kabinengröße ab 90 x 140 cm Innenmaß (nach DIN-Norm)');
      }
    }

    if (bath.bathtub) {
      barrierFreeAmenities.push('Badewanne');
    }

    if (bath.shower_tray == 'high') {
      barrierFreeAmenities.push('Hoher Duschwanne ab 7 cm');
    } else if (bath.shower_tray == 'low') {
      barrierFreeAmenities.push('Flache Duschwanne bis 7 cm (nach DIN-Norm)');
    } else if (bath.shower_tray == 'walk-in') {
      barrierFreeAmenities.push('Bodengleiche Dusche (nach DIN-Norm)');
    }

    if (bath.wide) {
      barrierFreeAmenities.push('Durchgangsbreite Vorderseite Sanitärobjekt zur Wand mind. 120 cm');
    }

    if (bath.large) {
      barrierFreeAmenities.push('Größe des Badezimmers ab 3 m²');
    }

    if (balcony.wide_door) {
      barrierFreeAmenities.push('Mindestbreite Balkontür 80cm');
    }

    if (balcony.threshold) {
      barrierFreeAmenities.push('Balkon mit Schwelle (Höhe 2 cm und mehr)');
    } else if (balcony.threshold === false) {
      barrierFreeAmenities.push('Balkon schwellenlos erreichbar (Absatz bis 2 cm)');
    }

    if (bacony.large) {
      barrierFreeAmenities.push('Balkongröße über 2,5 m²');
    }

    if (entry.doorbell_panel) {
      barrierFreeAmenities.push('Klingeltableau behindertengerecht (große Tasten, große Ziffern, Höhe +/- 85 cm)');
    }

    if (entry.intercom) {
      barrierFreeAmenities.push('Gegensprechanlage');
    }

    if (barrierFree.wheelchair_parking == 'indoors') {
      barrierFreeAmenities.push('Abstellmöglichkeit für Hilfsmittel (Rollator/Rollstuhl) 1,90 x 3 m innerhalb der Wohnung');
    } else if (barrierFree.wheelchair_parking == 'outdoorsv') {
      barrierFreeAmenities.push('Abstellmöglichkeit für Hilfsmittel (Rollator/Rollstuhl) 1,90 x 3 m außerhalb der Wohnung');
    }

    return barrierFreeAmenities;
  }
}


/*
  Extended filter for barrier freeness filering
*/
barrierfree.Filter = function (rules) {
  immobrowse.Filter.call(this, rules);

  this._super_match = this.match;

  this.match = function (realEstate) {
    if (this.rules.completelyBarrierFree) {
      if (! realEstate.completelyBarrierFree) {
        return false;
      }
    }

    if (this.rules.limitedBarrierFree) {
      if (! realEstate.limitedBarrierFree) {
        return false;
      }
    }

    return this._super_match(realEstate);
  }
}
