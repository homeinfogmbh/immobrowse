/*
  expose.js - ImmoBrowse Expose front end JavaScript

  (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.    See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.    If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>

  Requires:
      * jquery.js
      * sweetalert.js
      * immobrowse.js
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.wordpress = immobrowse.wordpress || {};
immobrowse.wordpress.mailer = null;
immobrowse.wordpress.objectId = null;
immobrowse.wordpress.elements = null;
immobrowse.wordpress.realEstate = null;
immobrowse.wordpress.imageGallery = null;
immobrowse.wordpress.floorplanGallery = null;


immobrowse.wordpress.printGrundriss = function () {
    window.open('/immobrowse/printGrundriss.html?real_estate=' + immobrowse.wordpress.objectId);
};


immobrowse.wordpress.printExpose = function (){
    window.open('/immobrowse/print.html?real_estate=' + immobrowse.wordpress.objectId);
};

immobrowse.wordpress.back = function () {
    window.history.back();
};


immobrowse.wordpress.clearContactForm = function () {
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
};


immobrowse.wordpress.sendEmail = function() {
    const response = grecaptcha.getResponse();

    if (response.length == 0) {
        swal({
            title: 'Achtung!',
            text: 'Bitte den CAPTCHA lösen.',
            type: 'warning'
        });
        return;
    }

    const forename = jQuery('#forename').val().trim();

    if (forename == '') {
        swal({
            title: 'Achtung!',
            text: 'Bitte Pflichtfeld "Vorname" ausfüllen.',
            type: 'warning'
        });
        return;
    }

    const surname = jQuery('#surname').val().trim();

    if (surname == '') {
        swal({
            title: 'Achtung!',
            text: 'Bitte Pflichtfeld "Nachname" ausfüllen.',
            type: 'warning'
        });
        return;
    }

    const email = jQuery('#email').val().trim();

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

    let salutation;

    if (jQuery('input:radio[name=\'gender\']:checked').val() == 1) {
        salutation = 'Herr';
    } else {
        salutation = 'Frau';
    }

    let member = jQuery('input:radio[name=\'member\']:checked').val();

    if (member == 1) {
        member = true;
    } else if (member == 0) {
        member = false;
    } else {
        member = null;
    }

    const phone = jQuery('#phone').val().trim();

    if (phone == '') {
        swal({
            title: 'Achtung!',
            text: 'Bitte Pflichtfeld "Telefon" ausfüllen.',
            type: 'warning'
        });
        return;
    }

    const street = jQuery('#street').val().trim();

    if (street == '') {
        swal({
            title: 'Achtung!',
            text: 'Bitte Pflichtfeld "Straße" ausfüllen.',
            type: 'warning'
        });
        return;
    }

    const houseNumber = jQuery('#house_number').val().trim();

    if (houseNumber == '') {
        swal({
            title: 'Achtung!',
            text: 'Bitte Pflichtfeld "Hausnummer" ausfüllen.',
            type: 'warning'
        });
        return;
    }

    const zipCode = jQuery('#zip_code').val().trim();

    if (zipCode == '') {
        swal({
            title: 'Achtung!',
            text: 'Bitte Pflichtfeld "PLZ" ausfüllen.',
            type: 'warning'
        });
        return;
    }

    const city = jQuery('#city').val().trim();

    if (city == '') {
        swal({
            title: 'Achtung!',
            text: 'Bitte Pflichtfeld "Ort" ausfüllen.',
            type: 'warning'
        });
        return;
    }

    const message = jQuery('#message').val().trim();
    const recipient = immobrowse.wordpress.realEstate.contact.email;
    const body = immobrowse.wordpress.createTextEmail(
        immobrowse.wordpress.realEstate, salutation, forename, surname, street,
        houseNumber, zipCode, city, email, phone, member, message
    );
    immobrowse.wordpress.mailer.send(response, 'Anfrage zu Objekt Nr. ' + immobrowse.wordpress.realEstate.objectId, body, recipient, email);
    grecaptcha.reset();
};


immobrowse.wordpress.initContactForm = function () {
    immobrowse.wordpress.clearContactForm();
    jQuery('#send_form').click(immobrowse.wordpress.sendEmail);
    jQuery('#contactFormModal').on('shown.bs.modal', immobrowse.wordpress.clearContactForm);
    jQuery('#clear_form').click(immobrowse.wordpress.clearContactForm);
};


immobrowse.wordpress.postRender = function () {
    immobrowse.wordpress.initContactForm();

    jQuery('#loader').hide();
    jQuery('#main').attr('style', 'padding-top: 80px');

    jQuery('.showimage').click(function() {
        for (let i = 0; i < jQuery(this).data('nrmax'); i++) {
            jQuery('#image'+ i).hide();
        }

        jQuery('#image'+ jQuery(this).data('nr')).show();
    });

    jQuery('.btn_contact').click(function() {
        //jQuery('#contact').scrollIntoView(true);
        if (jQuery('#contact').attr('style') == 'display: none;') {
            jQuery('#contact').slideDown();
        } else {
            jQuery('#contact').slideUp();
        }

        jQuery('html, body').animate({
            scrollTop: jQuery('#contact').offset().top
        }, 500);

        return false; // Not scrolling to top alternative: e.preventDefault();
    });
};


immobrowse.wordpress.setupGalleries = function() {
    const galleryMapping = {
        'image': jQuery('#galleryImage'),
        'title': jQuery('#galleryTitle'),
        'index': jQuery('#galleryIndex'),
        'count': jQuery('#galleryImages'),
        'next': jQuery('#galleryNext'),
        'previous': jQuery('#galleryPrevious')
    };
    const images = Array.from(immobrowse.wordpress.realEstate.images);

    function attachmentUrlCallback(attachment) {
        return immobrowse.wordpress.realEstate.attachmentURL(attachment);
    }

    immobrowse.wordpress.imageGallery = new immobrowse.wordpress.gallery.Gallery(images, galleryMapping, attachmentUrlCallback);

    if (images.length > 0) {
        jQuery('#titleImage').attr('src', immobrowse.wordpress.realEstate.attachmentURL(images[0]));
    }

    if (images.length > 1) {
        for (const image of images){
            jQuery('#furtherImages').append('<img style="height:35px" src="' + immobrowse.wordpress.realEstate.attachmentURL(image) + '"/>');
        }

        jQuery('#titleImageFrame, #furtherImages').click(function() {
            immobrowse.wordpress.imageGallery.bind();
            immobrowse.wordpress.imageGallery.render();
            jQuery('#gallery').modal('toggle');
        });

        jQuery('#titleImageFrame, #furtherImages').addClass('ib-browsable');
    }

    const floorplans = Array.from(immobrowse.wordpress.realEstate.floorplans);
    immobrowse.wordpress.floorplanGallery = new immobrowse.wordpress.gallery.Gallery(floorplans, galleryMapping, attachmentUrlCallback);

    if (floorplans.length > 0) {
        jQuery('#floorplan').attr('src', immobrowse.wordpress.realEstate.attachmentURL(floorplans[0]));
    }

    if (floorplans.length > 1) {
        jQuery('#floorplanFrame').click(function() {
            immobrowse.wordpress.floorplanGallery.bind();
            immobrowse.wordpress.floorplanGallery.render();
            jQuery('#gallery').modal('toggle');
        });

        jQuery('#floorplanFrame').addClass('ib-browsable');
    }
};


immobrowse.wordpress.render = function (realEstate) {
    immobrowse.wordpress.realEstate = realEstate;
    immobrowse.wordpress.setupGalleries();
    immobrowse.wordpress.realEstate.render(immobrowse.wordpress.elements);
    document.title = 'Exposé Nr. ' + immobrowse.wordpress.realEstate.objectId;
    immobrowse.wordpress.postRender();
};


immobrowse.wordpress.createTextEmail = function(
        realEstate, salutation, firstName, lastName, street, houseNumber,
        zipCode, city, email, phone, member, message) {
    const fields = [
        ['Objekt', realEstate.objectId],
        ['Anrede', salutation],
        ['Vorname', firstName],
        ['Nachname', lastName],
        ['Strasse', street + ' ' + houseNumber],
        ['PLZ', zipCode],
        ['Ort', city],
        ['E-Mail', email],
        ['Telefon', phone],
        ['Mitglied', member ? 'Ja' : 'Nein'],
        ['Bemerkung', message]
    ];
    return fields.map(field => field.join(': ')).join('\n');
};


immobrowse.wordpress.initExpose = function () {
    const urlParams = new URLSearchParams(window.location.search);
    // XXX: Change config for appropriate productive setting
    immobrowse.wordpress.mailer = new immobrowse.Mailer(homeinfo_recaptcha, false);
    immobrowse.wordpress.objectId = urlParams.get('real_estate');
    immobrowse.wordpress.elements = {
        objectId: jQuery('#objectId'),
        objectTitle: jQuery('#objectTitle'),
        address: jQuery('#objectAddress'),
        coldRent: jQuery('#coldRent'),
        serviceCharge: jQuery('#serviceCharge'),
        heatingCosts: jQuery('#heatingCosts'),
        heatingCostsInServiceCharge: jQuery('#heatingCostsInServiceCharge'),
        subjectToCommission: jQuery('#subjectToCommission'),
        livingArea: jQuery('#livingArea'),
        rooms: jQuery('#rooms'),
        floor: jQuery('#floor'),
        availableFrom: jQuery('#availableFrom'),
        councilFlat: jQuery('#councilFlat'),
        constructionYear: jQuery('#constructionYear'),
        state: jQuery('#state'),
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
        description: {
            container: jQuery('#descriptionContainer'),
            value: jQuery('#description')
        },
        amenities: {
            container: jQuery('#amenitiesContainer'),
            value: jQuery('#amenities')
        },
        exposure: {
            container: jQuery('#exposureContainer'),
            value: jQuery('#exposure')
        },
        miscellanea: {
            container: jQuery('#miscellaneaContainer'),
            value: jQuery('#miscellanea')
        },
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
            container: jQuery('#contactInformation'),
            button: jQuery('#btnContactForm'),
            name: jQuery('#contactName'),
            company: {
                container: jQuery('#contactCompanyContainer'),
                value: jQuery('#contactCompany')
            },
            address: jQuery('#contactAddress'),
            phone: jQuery('#contactPhone'),
            website: {
                container: jQuery('#contactWebsiteContainer'),
                value: jQuery('#contactWebsite')
            }
        }
    };

    immobrowse.RealEstate.get(immobrowse.wordpress.objectId).then(immobrowse.wordpress.render);
};


jQuery(document).ready(immobrowse.wordpress.initExpose);
