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
'use strict';

var immobrowse = immobrowse || {};
immobrowse.expose = immobrowse.expose || {};
immobrowse.expose.args;
immobrowse.expose.mailer;
immobrowse.expose.objectId;
immobrowse.expose.elements;
immobrowse.expose.realEstate;
immobrowse.expose.imageGallery;
immobrowse.expose.floorplanGallery;


immobrowse.expose.printGrundriss = function (){
  window.open(PLUGIN_BASE + 'print/grundriss.html?real_estate=' + immobrowse.expose.objectId);
}


immobrowse.expose.printExpose = function (){
  window.open(PLUGIN_BASE + 'print/expose.html?real_estate=' + immobrowse.expose.objectId);
}


immobrowse.expose.back = function () {
  window.history.back();
}


immobrowse.expose.clearContactForm = function() {
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


immobrowse.expose.sendEmail = function () {
  var response = grecaptcha.getResponse();

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

  var objectTitle = immobrowse.expose.realEstate.objectTitle();
  var objectAddress = [immobrowse.expose.realEstate.addressPreview(), immobrowse.expose.realEstate.cityPreview()].join(' ');
  var phone = jQuery('#phone').val().trim();
  var street = jQuery('#street').val().trim();
  var houseNumber = jQuery('#house_number').val().trim();
  var zipCode = jQuery('#zip_code').val().trim();
  var city = jQuery('#city').val().trim();
  var message = jQuery('#message').val().trim();
  var recipient = immobrowse.expose.realEstate.contact().email;
  var html = immobrowse.mkContactMail(
    objectTitle, objectAddress, salutation, forename, surname,
    phone, street, houseNumber, zipCode, city, message)
  mailer.send(response, 'Anfrage zu Objekt Nr. ' + immobrowse.expose.realEstate.objectId(), html, recipient, email);
  grecaptcha.reset();
}


immobrowse.expose.initContactForm = function () {
  immobrowse.expose.clearContactForm();
  jQuery("#send_form").click(immobrowse.expose.sendEmail);
  jQuery('#contactFormModal').on('shown.bs.modal', immobrowse.expose.clearContactForm);
  jQuery("#clear_form").click(immobrowse.expose.clearContactForm);
}


immobrowse.expose.postRender = function () {
  immobrowse.expose.initContactForm();

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


immobrowse.expose.setupGalleries = function () {
  var galleryMapping = {
      'image': jQuery('#galleryImage'),
      'title': jQuery('#galleryTitle'),
      'index': jQuery('#galleryIndex'),
      'count': jQuery('#galleryImages'),
      'next': jQuery('#galleryNext'),
      'previous': jQuery('#galleryPrevious')
  };
  var images = immobrowse.expose.realEstate.images();

  function attachmentUrlCallback(attachment) {
    return immobrowse.expose.realEstate.attachmentURL(attachment);
  }

  immobrowse.expose.imageGallery = new immobrowse.gallery.Gallery(images, galleryMapping, attachmentUrlCallback);

  if (images.length > 0) {
    jQuery('#titleImage').attr('src', immobrowse.expose.realEstate.attachmentURL(images[0]));
  }

  if (images.length > 1) {
      for (var i = 1; i < images.length; i++){
        jQuery('#furtherImages').append('<img style="height:35px" src="' + immobrowse.expose.realEstate.attachmentURL(images[i]) + '"/>');
      }

    jQuery('#titleImageFrame, #furtherImages').click(function() {
      immobrowse.expose.imageGallery.bind();
      immobrowse.expose.imageGallery.render();
      jQuery('#gallery').modal('toggle');
    });

    jQuery('#titleImageFrame, #furtherImages').addClass('ib-browsable');
  }

  var floorplans = immobrowse.expose.realEstate.floorplans();
  immobrowse.expose.floorplanGallery = new immobrowse.gallery.Gallery(floorplans, galleryMapping, attachmentUrlCallback);

  if (floorplans.length > 0) {
    jQuery('#floorplan').attr('src', immobrowse.expose.realEstate.attachmentURL(floorplans[0]));
  }

  if (floorplans.length > 0) {
    jQuery('#floorplanFrame').click(function() {
      immobrowse.expose.floorplanGallery.bind();
      immobrowse.expose.floorplanGallery.render();
      jQuery('#gallery').modal('toggle');
    });

    jQuery('#floorplanFrame').addClass('ib-browsable');
  }
}


immobrowse.expose.render = function (realEstate) {
    immobrowse.expose.realEstate = realEstate;
    immobrowse.expose.setupGalleries();
    immobrowse.expose.realEstate.render(immobrowse.expose.elements);
    document.title = 'Exposé Nr. ' + realEstate.objectId();
    immobrowse.expose.postRender();
}


immobrowse.expose.init = function () {
    immobrowse.expose.args = new homeinfo.QueryString();
    immobrowse.expose.mailer = new immobrowse.Mailer(php_vars.recaptcha);
    immobrowse.expose.objectId = immobrowse.expose.args.real_estate;
    immobrowse.expose.elements = {
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

    immobrowse.getRealEstate(immobrowse.expose.objectId, immobrowse.expose.render);
};


jQuery(document).ready(immobrowse.expose.init);
