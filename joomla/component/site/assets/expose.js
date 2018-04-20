/*
    expose.js - ImmoBrowse Expose front end JavaScript.

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
immobrowse.expose = immobrowse.expose || {};
immobrowse.expose.queryString = new homeinfo.QueryString();
immobrowse.expose.mailer = null;
immobrowse.expose.elements = null;
immobrowse.expose.realEstate = null;


immobrowse.expose.back = function () {
    immobrowse.open(decodeURIComponent(immobrowse.expose.queryString.backlink));
};


immobrowse.expose.resetContactForm = function () {
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


immobrowse.expose.commitForm = function (response) {
    immobrowse.expose.sendEmail(response);
    grecaptcha.reset();
};


immobrowse.expose.sendEmail = function (response) {
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
        phone, street, houseNumber, zipCode, city, message);
    immobrowse.expose.mailer.send(response, 'Anfrage zu Objekt Nr. ' + immobrowse.expose.realEstate.objectId(), html, recipient, email);
    immobrowse.expose.resetContactForm();
};


immobrowse.expose.postRender = function () {
    immobrowse.expose.mailer = new immobrowse.Mailer(immobrowse.expose.hiseconCfg);
    immobrowse.expose.resetContactForm();
    jQuery('#ib-loader').hide();
    jQuery('#main').attr('style', 'padding-top: 80px');
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


immobrowse.expose.render = function (realEstate) {
    immobrowse.expose.realEstate = realEstate;
    immobrowse.slideshow.initGalleries();
    immobrowse.expose.realEstate.render(immobrowse.expose.elements);
    document.title = 'Exposé Nr. ' + immobrowse.expose.realEstate.objectId();
    immobrowse.expose.postRender();
};


immobrowse.expose.init = function () {
    immobrowse.expose.elements = {
        objectId: jQuery('#objectId'),
        address: jQuery('#objectAddress'),
        objectTitle: jQuery('#objectTitle'),
        coldRent: jQuery('#coldRent'),
        serviceCharge: jQuery('#serviceCharge'),
        operationalCosts: {
            container: jQuery('#operationalCostsContainer'),
            value: jQuery('#operationalCosts')
        },
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
        amenitiesList: jQuery('#amenitiesList'),
        contact: {
            name: jQuery('#contactName'),
            company: jQuery('#contactCompany'),
            address: jQuery('#contactAddress'),
            phone: jQuery('#contactPhone'),
            website: jQuery('#contactWebsite')
        }
    };

    immobrowse.RealEstate.get(immobrowse.expose.objectId).then(immobrowse.expose.render);
};


jQuery(document).ready(immobrowse.expose.init);
