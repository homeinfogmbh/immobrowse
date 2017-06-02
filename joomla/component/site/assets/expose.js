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
var queryString = new homeinfo.QueryString();
var mailer = new immobrowse.Mailer('hvo-eg');
var elements;
var realEstate;
var imageGallery;
var floorplanGallery;


function back() {
  immobrowse.open(decodeURIComponent(queryString.backlink));
}


function resetContactForm() {
  jQuery('#object_id').attr('placeholder', jQuery('#objectId').html());
  jQuery('#gender_female').click();
  jQuery('#forename').val('');
  jQuery('#surname').val('');
  jQuery('#email').val('');
  jQuery('#phone').val('');
  jQuery('#street').val('');
  jQuery('#house_number').val('');
  jQuery('#zip_code').val('');
  jQuery('#city').val('');
  jQuery('#message').val('Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.');
  jQuery('#contact_form_response').hide();
}


function commitForm(response) {
  sendEmail(response);
  grecaptcha.reset();
}


function sendEmail(response) {
  if (response.length == 0) {
    swal({
      title: 'Achtung!',
      text: 'Bitte den CAPTCHA lösen.',
      type: 'warning'
    });
    return;
  }

  var forename = jQuery("#forename").val().trim();

  if (forename == '') {
    swal({
      title: 'Achtung!',
      text: 'Bitte Pflichtfeld "Vorname" ausfüllen.',
      type: 'warning'
    });
    return;
  }

  var surname = jQuery("#surname").val().trim();

  if (surname == '') {
    swal({
      title: 'Achtung!',
      text: 'Bitte Pflichtfeld "Nachname" ausfüllen.',
      type: 'warning'
    });
    return;
  }

  var email = jQuery('#email').val().trim();

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

  if (jQuery("input:radio[name='gender']:checked").val() == 1) {
    salutation = "Herr";
  } else {
    salutation = "Frau";
  }

  var objectTitle = realEstate.objectTitle();
  var objectAddress = [realEstate.addressPreview(), realEstate.cityPreview()].join(' ');
  var phone = jQuery('#phone').val().trim();
  var street = jQuery('#street').val().trim();
  var houseNumber = jQuery('#house_number').val().trim();
  var zipCode = jQuery('#zip_code').val().trim();
  var city = jQuery('#city').val().trim();
  var message = jQuery('#message').val().trim();
  var recipient = realEstate.contact().email;
  var html = immobrowse.mkContactMail(
    objectTitle, objectAddress, salutation, forename, surname,
    phone, street, houseNumber, zipCode, city, message)
  mailer.send(response, 'Anfrage zu Objekt Nr. ' + objektnrExtern, html, recipient, email);
  resetContactForm();
}


function postRender() {
  resetContactForm();

  jQuery('#loader').hide();
  jQuery('#main').attr('style', 'padding-top: 80px');

  jQuery('.showimage').click(function() {
    for (var i = 0; i < jQuery(this).data("nrmax"); i++) {
      jQuery('#image'+ i).hide();
    }

    jQuery('#image'+ jQuery(this).data("nr")).show();
  });

  jQuery('.btn_contact').click(function(e) {
    //jQuery('#contact').scrollIntoView(true);
    if (jQuery('#contact').attr('style') == "display: none;") {
      jQuery('#contact').slideDown();
    } else {
      jQuery('#contact').slideUp();
    }

    jQuery('html, body').animate({
      scrollTop: jQuery('#contact').offset().top
    }, 500);

    return false; // Not scrolling to top alternative: e.preventDefault();
  });
}


function setupGalleries() {
  var galleryMapping = {
      'image': jQuery('#galleryImage'),
      'title': jQuery('#galleryTitle'),
      'index': jQuery('#galleryIndex'),
      'count': jQuery('#galleryImages'),
      'next': jQuery('#galleryNext'),
      'previous': jQuery('#galleryPrevious')
  };
  var images = realEstate.images();

  function attachmentUrlCallback(attachment) {
    return realEstate.attachmentURL(attachment);
  }

  imageGallery = new gallery.Gallery(images, galleryMapping, attachmentUrlCallback);

  if (images.length > 0) {
    jQuery('#titleImage').attr('src', realEstate.attachmentURL(images[0]));
  }

  if (images.length > 1) {
    jQuery('#titleImageFrame').click(function() {
      imageGallery.bind();
      imageGallery.render();
      jQuery('#gallery').modal('toggle');
    });

    jQuery('#titleImageFrame').addClass('ib-browsable');
  }

  var floorplans = realEstate.floorplans();
  floorplanGallery = new gallery.Gallery(floorplans, galleryMapping, attachmentUrlCallback);

  if (floorplans.length > 0) {
    jQuery('#floorplan').attr('src', realEstate.attachmentURL(floorplans[0]));
  }

  if (floorplans.length > 1) {
    jQuery('#floorplanFrame').click(function() {
      floorplanGallery.bind();
      floorplanGallery.render();
      jQuery('#gallery').modal('toggle');
    });

    jQuery('#floorplanFrame').addClass('ib-browsable');
  }
}


jQuery(document).ready(function () {
  elements = {
    objectId: jQuery('#objectId'),
    objectTitle: jQuery('#objectTitle'),
    coldRent: jQuery('#coldRent'),
    serviceCharge: jQuery('#serviceCharge'),
    heatingCosts: jQuery('#heatingCosts'),
    heatingCostsInServiceCharge: jQuery('#heatingCostsInServiceCharge'),
    securityDeposit: jQuery('#securityDeposit'),
    subjectToCommission: jQuery('#subjectToCommission'),
    livingArea: jQuery('#livingArea'),
    rooms: jQuery('#rooms'),
    floor: jQuery('#floor'),
    availableFrom: jQuery('#availableFrom'),
    councilFlat: jQuery('#councilFlat'),
    constructionYear: jQuery('#constructionYear'),
    state: jQuery('#state'),
    lastModernization: jQuery('#lastModernization'),
    energyCertificate: {
      type: jQuery('#energyCertificateType'),
      consumption: {
        value: jQuery('#energyConsumption'),
        container: jQuery('#energyConsumptionContainer')
      },
      demand: {
        value: jQuery('#energyDemand'),
        container: jQuery('#energyDemandContainer')
      },
      primaryEnergyCarrier: jQuery('#primaryEnergyCarrier'),
      valueClass: jQuery('#valueClass')
    },
    description: jQuery('#description'),
    exposure: jQuery('#exposure'),
    miscellanea: jQuery('#miscellanea'),
    salutation: jQuery('#salutation'),
    firstName: jQuery('#firstName'),
    lastName: jQuery('#lastName'),
    company: jQuery('#company'),
    street: jQuery('#street'),
    houseNumber: jQuery('#houseNumber'),
    streetAndHouseNumber: jQuery('#streetAndHouseNumber'),
    zipCode: jQuery('#zipCode'),
    city: jQuery('#city'),
    zipCodeAndCity: jQuery('#zipCodeAndCity'),
    website: jQuery('#website'),
    titleImage: {
      image: jQuery('#titleImage'),
      caption: jQuery('#titleImageCaption')
    },
    amenitiesList: jQuery('#amenitiesList'),
    contact: {
      name: jQuery('#contactName'),
      company: jQuery('#contactCompany'),
      address: jQuery('#contactAddress'),
      phone: jQuery('#contactPhone'),
      website: jQuery('#contactWebsite')
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
