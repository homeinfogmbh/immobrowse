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

/*
  Queries real estate data from the API and runs callback function.
*/
barrierfree.getRealEstate = function (objectId, portal, callback) {
  jQuery.ajax({
    url: 'https://backend.homeinfo.de/barrierfree/expose/' + objectId + '?portal=' + portal,
    success: function (json) {
      callback(new barrierfree.RealEstate(json));
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
        realEstates.push(new barrierfree.RealEstate(json[i]));
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
barrierfree.RealEstate = function (json) {
  immobrowse.RealEstate.call(this, json);

  /*
    Determines whether the real estate is completely barrier free
  */
  this.completelyBarrierFree = function () {
    var barrier_freeness = this.barrier_freeness || {};
    var stairs = barrier_freeness.stairs == '0' || (barrier_freeness.ramp_din && (barrier_freeness.stairs == '0-1' || barrier_freeness.stairs == '2-8'));
    var doors = barrier_freeness.wide_door && barrier_freeness.low_thresholds && barrier_freeness.wide_doors && barrier_freeness.door_opener;
    var lift = barrier_freeness.lift_size == 'DIN';
    var bath = barrier_freeness.bath_wide && (barrier_freeness.shower_tray == 'low' || barrier_freeness.shower_tray == 'walk-in');
    var wheelchair_parking = barrier_freeness.wheelchair_parking == 'indoors' || barrier_freeness.wheelchair_parking == 'outdoors';
    var entry = barrier_freeness.doorbell_panel;
    return stairs && doors && lift && bath && wheelchair_parking && entry;
  }

  /*
    Determines whether the real estate is limited barrier free
  */
  this.limitedBarrierFree = function () {
    var barrier_freeness = this.barrier_freeness || {};
    return barrier_freeness.stairs == '0' || (barrier_freeness.ramp_din && (barrier_freeness.stairs == '0-1' || barrier_freeness.stairs == '2-8'));
  }

  /*
    Amenities extension
  */
  this.amenities = function () {
    var amenities = immobrowse.RealEstate.amenities.call(this);

    if (this.completelyBarrierFree()) {
      amenities.push('vollständig barrierefrei');
    } else if (this.limitedBarrierFree()) {
      amenities.push('eingeschränkt barrierefrei');
    }

    return amenities;
  }
}


/*
  Extended filter for barrier freeness filering
*/
barrierfree.Filter = function (options) {
  immobrowse.Filter.call(options);

  this.match = function (realEstate) {
    if (this.options.completelyBarrierFree) {
      if (! realEstate.completelyBarrierFree) {
        return false;
      }
    }

    if (this.options.limitedBarrierFree) {
      if (! realEstate.limitedBarrierFree) {
        return false;
      }
    }

    return immobrowse.Filter.match.call(this, realEstate);
  }
}
