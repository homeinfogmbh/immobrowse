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
var args = queryArgs();
// XXX: Change config for appropriate productive setting
var mailer = new immobrowse.Mailer('homeinfo-testing');
var customer = args['customer'];
var listUrl = 'list.html?' + customer;
var objektnrExtern = args['objektnr_extern'];
var elements;
var realEstate;
var imageGallery;
var floorplanGallery;


function queryArgs() {
  var queryString = decodeURIComponent(window.location.search.substring(1));
  var assignments = queryString.split('&');
  var args = {};

  for (var i = 0; i < assignments.length; i++) {
    var parts = assignments[i].split('=');

    if (parts[1] == null) {
      args[parts[0]] = true;
    } else {
      args[parts[0]] = parts[1];
    }
  }

  return args;
}


function back() {
  immobrowse.open('list.html?' + customer);
}


function clearContactForm() {
  $('#object_id').attr('placeholder', $('#objectId').html());
  $('#gender_female').click();
  $('#forename').val('');
  $('#surname').val('');
  $('#email').val('');
  $('#phone').val('');
  $('#street').val('');
  $('#house_number').val('');
  $('#zip_code').val('');
  $('#city').val('');
  $('#message').val('Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.');
  $('#contact_form_response').hide();
}


function sendEmail() {
  var response = grecaptcha.getResponse();

  if (response.length == 0) {
    swal({
      title: 'Achtung!',
      text: 'Bitte den CAPTCHA lösen.',
      type: 'warning'
    });
    return;
  }

  var forename = $("#forename").val().trim();

  if (forename == '') {
    swal({
      title: 'Achtung!',
      text: 'Bitte Pflichtfeld "Vorname" ausfüllen.',
      type: 'warning'
    });
    return;
  }

  var surname = $("#surname").val().trim();

  if (surname == '') {
    swal({
      title: 'Achtung!',
      text: 'Bitte Pflichtfeld "Nachname" ausfüllen.',
      type: 'warning'
    });
    return;
  }

  var email = $('#email').val().trim();

  if (email == '') {
    swal({
      title: 'Achtung!',
      text: 'Bitte Pflichtfeld "E-Mail Adresse" ausfüllen.',
      type: 'warning'
    });
    return;
  } else if (homeinfo.str.isEmail(email) == false) {
    swal({
      title: 'Achtung!',
      text: 'Bitte geben Sie eine gültige E-Mail Adresse an.',
      type: 'warning'
    });
    return;
  }

  var salutation;

  if ($("input:radio[name='gender']:checked").val() == 1) {
    salutation = "Herr";
  } else {
    salutation = "Frau";
  }

  var objectTitle = realEstate.objectTitle();
  var objectAddress = [realEstate.addressPreview(), realEstate.cityPreview()].join(' ');
  var phone = $('#phone').val().trim();
  var street = $('#street').val().trim();
  var houseNumber = $('#house_number').val().trim();
  var zipCode = $('#zip_code').val().trim();
  var city = $('#city').val().trim();
  var message = $('#message').val().trim();
  var recipient = realEstate.contact().email;
  var html = immobrowse.mkContactMail(
    objectTitle, objectAddress, salutation, forename, surname,
    phone, street, houseNumber, zipCode, city, message)
  mailer.send(response, 'Anfrage zu Objekt Nr. ' + objektnrExtern, html, recipient, email);
  grecaptcha.reset();
}


function initContactForm() {
  clearContactForm();
  $("#send_form").click(sendEmail);
  $('#contactFormModal').on('shown.bs.modal', clearContactForm);
  $("#clear_form").click(clearContactForm);
}


function postRender() {
  initContactForm();

  $('#loader').hide();
  $('#main').attr('style', 'padding-top: 80px');

  $('.showimage').click(function() {
    for (var i = 0; i < $(this).data("nrmax"); i++) {
      $('#image'+ i).hide();
    }

    $('#image'+ $(this).data("nr")).show();
  });

  $('.btn_contact').click(function(e) {
    //$('#contact').scrollIntoView(true);
    if ($('#contact').attr('style') == "display: none;") {
      $('#contact').slideDown();
    } else {
      $('#contact').slideUp();
    }

    $('html, body').animate({
      scrollTop: $('#contact').offset().top
    }, 500);

    return false; // Not scrolling to top alternative: e.preventDefault();
  });
}


function setupGalleries() {
  var galleryMapping = {
      'image': $('#galleryImage'),
      'title': $('#galleryTitle'),
      'index': $('#galleryIndex'),
      'count': $('#galleryImages'),
      'next': $('#galleryNext'),
      'previous': $('#galleryPrevious')
  };
  var images = realEstate.images();

  function attachmentUrlCallback(attachment) {
    return realEstate.attachmentURL(attachment);
  }

  imageGallery = new gallery.Gallery(images, galleryMapping, attachmentUrlCallback);

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
  floorplanGallery = new gallery.Gallery(floorplans, galleryMapping, attachmentUrlCallback);

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


$(document).ready(function () {
  elements = {
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

  immobrowse.getRealEstate(customer, objektnrExtern, function (realEstate_) {
    realEstate = realEstate_;
    setupGalleries();
    realEstate.render(elements);
    document.title = 'Exposé Nr. ' + realEstate.objectId();
    postRender();
  });
});
