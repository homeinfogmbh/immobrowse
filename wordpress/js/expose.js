/*
  expose.js - ImmoBrowse Expose front end JavaScript

  (C) 2017-2020 HOMEINFO - Digitale Informationssysteme GmbH

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
    window.open('?real_estate=' + immobrowse.wordpress.objectId + '&print_floorplan');
};


immobrowse.wordpress.printExpose = function () {
    window.open('?real_estate=' + immobrowse.wordpress.objectId + '&print_expose');
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
        alert('Bitte den CAPTCHA lösen.');
        return;
    }

    const forename = jQuery('#forename').val().trim();

    if (forename == '') {
        alert('Bitte Pflichtfeld "Vorname" ausfüllen.');
        return;
    }

    const surname = jQuery('#surname').val().trim();

    if (surname == '') {
        alert('Bitte Pflichtfeld "Nachname" ausfüllen.');
        return;
    }

    const email = jQuery('#email').val().trim();

    if (email == '') {
        alert('Bitte Pflichtfeld "E-Mail Adresse" ausfüllen.');
        return;
    } else if (!immobrowse.EMAIL.test(email)) {
        alert('Bitte geben Sie eine gültige E-Mail Adresse an.');
        return;
    }

    let salutation;

    if (jQuery('input:radio[name=\'salutation\']:checked').val() == 1) {
        salutation = 'Herr';
    } else {
        salutation = 'Frau';
    }

    const objectTitle = immobrowse.wordpress.realEstate.objectTitle;
    const objectAddress = [immobrowse.wordpress.realEstate.addressPreview, immobrowse.wordpress.realEstate.cityPreview].join(' ');
    const phone = jQuery('#phone').val().trim();
    const street = jQuery('#street').val().trim();
    const houseNumber = jQuery('#house_number').val().trim();
    const zipCode = jQuery('#zip_code').val().trim();
    const city = jQuery('#city').val().trim();
    const message = jQuery('#message').val().trim();
    const recipient = immobrowse.wordpress.realEstate.contact.email;
    const html = immobrowse.mkContactMail(
        objectTitle, objectAddress, salutation, forename, surname,
        phone, street, houseNumber, zipCode, city, message);
    immobrowse.wordpress.mailer.send(response, 'Anfrage zu Objekt Nr. ' + immobrowse.wordpress.realEstate.objectId, html, recipient, email);
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
    const floorplans = Array.from(immobrowse.wordpress.realEstate.floorplans);
    const pictures = images.concat(floorplans);

    function attachmentUrlCallback(attachment) {
        return immobrowse.wordpress.realEstate.attachmentURL(attachment);
    }

    immobrowse.wordpress.imageGallery = new immobrowse.wordpress.gallery.Gallery(pictures, galleryMapping, attachmentUrlCallback);

    if (pictures.length > 0) {
        jQuery('#titleImage').attr('src', immobrowse.wordpress.realEstate.attachmentURL(pictures[0]));
    }

    if (pictures.length > 1) {
        let furtherImages = document.getElementById('furtherImages');
        let image, src;

        for (let i = 1; i < pictures.length; i++){
            src = immobrowse.wordpress.realEstate.attachmentURL(pictures[i]);
            image = new immobrowse.dom.PreviewImage(src);
            furtherImages.appendChild(image);
        }

        jQuery('#titleImageFrame, #furtherImages').click(function() {
            immobrowse.wordpress.imageGallery.bind();
            immobrowse.wordpress.imageGallery.render();
        });

        jQuery('#titleImageFrame, #furtherImages').addClass('ib-browsable');
    }
};


immobrowse.wordpress.render = function (realEstate) {
    immobrowse.wordpress.realEstate = realEstate;
    immobrowse.wordpress.setupGalleries();
    immobrowse.wordpress.realEstate.render(immobrowse.wordpress.elements);
    document.title = 'Exposé Nr. ' + immobrowse.wordpress.realEstate.objectId;
    immobrowse.wordpress.postRender();

};


immobrowse.wordpress.initExpose = function () {
    const url = new URL(location);
    const params = new URLSearchParams(url.search);
    immobrowse.wordpress.mailer = new immobrowse.Mailer(homeinfo_recaptcha);
    immobrowse.wordpress.objectId = params.get('real_estate');
    immobrowse.wordpress.elements = {
        objectId: jQuery('#objectId'),
        objectTitle: jQuery('#objectTitle'),
        address: jQuery('#objectAddress'),
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
        description: {
            container: jQuery('#descriptionContainer'),
            value: jQuery('#description')
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
