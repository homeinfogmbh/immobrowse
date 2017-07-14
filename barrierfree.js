/*
  barrierfree.js - ImmoBrowse's barrier free JavaScript library

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
      callback(new immobrowse.RealEstate(json));
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
        realEstates.push(new immobrowse.RealEstate(json[i]));
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
