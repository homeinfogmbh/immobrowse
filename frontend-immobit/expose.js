/*
  expose.js - ImmoBrowse Expose front end JavaScript

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
    * jquery.js
    * sweetalert.js
    * immobrowse.js
*/
var args = new homeinfo.QueryString();
// XXX: Change config for appropriate productive setting
var mailer = new immobrowse.Mailer('homeinfo-testing');
var objectId = args.object_id;
var realEstate = args.real_estate;
var sessionId = args.session;
var imageGallery;
var floorplanGallery;


/*
  Override realEstate.attachmentURL
*/
RealEstate = function (json) {
  immobrowse.RealEstate.call(this, json);

  this.attachmentURL = function (anhang) {
    return 'https://backend.immobit.de/attachments/' + anhang.id + '?session=' + sessionId;
  }
}


function getRealEstate(callback) {
  $.ajax({
    url: 'https://backend.immobit.de/realestates/' + objectId + '?session=' + sessionId,
    success: function(json) {
      callback(new RealEstate(json));
    },
    error: function () {
      swal('Fehler!', 'Immobilie konnte nicht geladen werden.', 'error');
    }
  });
}


function postRender() {
  $('#loader').hide();
  $('#main').attr('style', 'padding-top: 80px');

  $('.showimage').click(function() {
    for (var i = 0; i < $(this).data("nrmax"); i++) {
      $('#image'+ i).hide();
    }

    $('#image'+ $(this).data("nr")).show();
  });

  $('.btn_contact').click(function(e) {
    if ($('#contact').attr('style') == "display: none;") {
      $('#contact').slideDown();
    } else {
      $('#contact').slideUp();
    }

    return false; // Not scrolling to top alternative: e.preventDefault();
  });
}


function setupGalleries(realEstate) {
  var galleryMapping = {
      'image': $('#galleryImage'),
      'title': $('#galleryTitle'),
      'index': $('#galleryIndex'),
      'count': $('#galleryImages'),
      'next': $('#galleryNext'),
      'previous': $('#galleryPrevious')
  };
  var images = realEstate.images();
  imageGallery = new gallery.Gallery(images, galleryMapping, realEstate.attachmentURL);

  if (images.length > 0) {
    $('#titleImage').attr('src', realEstate.attachmentURL(images[0]));
  }

  if (images.length > 1) {
    $('#titleImageFrame').click(function() {
      imageGallery.bind();
      imageGallery.render();
      $('#gallery').modal('toggle');
    });

    $('#titleImageFrame').addClass('ib-browsable');
  }

  var floorplans = realEstate.floorplans();
  floorplanGallery = new gallery.Gallery(floorplans, galleryMapping, realEstate.attachmentURL);

  if (floorplans.length > 0) {
    $('#floorplan').attr('src', realEstate.attachmentURL(floorplans[0]));
  }

  if (floorplans.length > 1) {
    $('#floorplanFrame').click(function() {
      floorplanGallery.bind();
      floorplanGallery.render();
      $('#gallery').modal('toggle');
    });

    $('#floorplanFrame').addClass('ib-browsable');
  }
}


function elements() {
  return {
    objectId: $('#objectId'),
    objectTitle: $('#objectTitle'),
    coldRent: $('#coldRent'),
    serviceCharge: $('#serviceCharge'),
    heatingCosts: $('#heatingCosts'),
    heatingCostsInServiceCharge: $('#heatingCostsInServiceCharge'),
    securityDeposit: $('#securityDeposit'),
    subjectToCommission: $('#subjectToCommission'),
    livingArea: $('#livingArea'),
    rooms: $('#rooms'),
    floor: $('#floor'),
    availableFrom: $('#availableFrom'),
    councilFlat: $('#councilFlat'),
    constructionYear: $('#constructionYear'),
    state: $('#state'),
    lastModernization: $('#lastModernization'),
    energyCertificate: {
      type: $('#energyCertificateType'),
      consumption: {
        value: $('#energyConsumption'),
        container: $('#energyConsumptionContainer')
      },
      demand: {
        value: $('#energyDemand'),
        container: $('#energyDemandContainer')
      },
      primaryEnergyCarrier: $('#primaryEnergyCarrier'),
      valueClass: $('#valueClass')
    },
    description: $('#description'),
    exposure: $('#exposure'),
    miscellanea: $('#miscellanea'),
    salutation: $('#salutation'),
    firstName: $('#firstName'),
    lastName: $('#lastName'),
    company: $('#company'),
    street: $('#street'),
    houseNumber: $('#houseNumber'),
    streetAndHouseNumber: $('#streetAndHouseNumber'),
    zipCode: $('#zipCode'),
    city: $('#city'),
    zipCodeAndCity: $('#zipCodeAndCity'),
    website: $('#website'),
    titleImage: {
      image: $('#titleImage'),
      caption: $('#titleImageCaption')
    },
    amenitiesList: $('#amenitiesList'),
    contact: {
      name: $('#contactName'),
      company: $('#contactCompany'),
      address: $('#contactAddress'),
      phone: $('#contactPhone'),
      website: $('#contactWebsite')
    }
  };
}


function render(realEstate) {
  setupGalleries(realEstate);
  realEstate.render(elements());
  $('#angebotsnummerPrint').text(realEstate.objectId());
  var title = 'Angebots-Nr. ' + realEstate.objectId();

  if (realEstate.showAddress()) {
    var address = realEstate.address();

    if (address) {
      title += ': ' + address;
    }
  }

  document.title = title;
  postRender();
}


$(document).ready(function () {
  if (realEstate == null) {
    getRealEstate(render);
  } else {
    render(new RealEstate(JSON.parse(realEstate)));
  }
});
