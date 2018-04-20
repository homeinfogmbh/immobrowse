/*
  expose.js - ImmoBrowse Expose front end JavaScript.

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
immobrowse.joomla = immobrowse.joomla || {};
immobrowse.joomla.expose = immobrowse.joomla.expose || {};
immobrowse.joomla.expose.queryString = new homeinfo.QueryString();
immobrowse.joomla.expose.mailer = null;
immobrowse.joomla.expose.elements = null;
immobrowse.joomla.expose.objectId = null;
immobrowse.joomla.expose.realEstate = null;


immobrowse.joomla.expose.back = function () {
    immobrowse.open(decodeURIComponent(queryString.backlink));
}


immobrowse.joomla.expose.resetContactForm = function () {
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


immobrowse.joomla.expose.commitForm = function (response) {
    immobrowse.joomla.expose.sendEmail(response);
    grecaptcha.reset();
};


immobrowse.joomla.expose.sendEmail = function (response) {
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

    var objectTitle = immobrowse.joomla.expose.realEstate.objectTitle();
    var objectAddress = [
        immobrowse.joomla.expose.realEstate.addressPreview(),
        immobrowse.joomla.expose.realEstate.cityPreview()
    ].join(' ');
    var phone = jQuery('#phone').val().trim();
    var street = jQuery('#street').val().trim();
    var houseNumber = jQuery('#house_number').val().trim();
    var zipCode = jQuery('#zip_code').val().trim();
    var city = jQuery('#city').val().trim();
    var message = jQuery('#message').val().trim();
    var recipient = immobrowse.joomla.expose.realEstate.contact().email;
    var html = immobrowse.mkContactMail(
        objectTitle, objectAddress, salutation, forename, surname,
        phone, street, houseNumber, zipCode, city, message)
    immobrowse.joomla.expose.mailer.send(
        response, 'Anfrage zu Objekt Nr. ' + immobrowse.joomla.expose.realEstate.objectId(), html, recipient, email);
    immobrowse.joomla.expose.resetContactForm();
};


immobrowse.joomla.expose.postRender = function () {
    immobrowse.joomla.expose.mailer = new immobrowse.Mailer(immobrowse.joomla.expose.hiseconCfg);
    immobrowse.joomla.expose.resetContactForm();
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
};


immobrowse.joomla.expose.render = function (realEstate) {
    immobrowse.joomla.expose.realEstate = realEstate;
    immobrowse.joomla.slideshow.initGalleries();
    immobrowse.joomla.expose.realEstate.render(immobrowse.joomla.expose.elements);
    document.title = 'Exposé Nr. ' + immobrowse.joomla.expose.realEstate.objectId();
    immobrowse.joomla.expose.postRender();
};


immobrowse.joomla.expose.init =function () {
    immobrowse.joomla.expose.elements = {
        objectId: jQuery('#objectId'),
        address: jQuery('#objectAddress'),
        objectTitle: jQuery('#objectTitle'),
        coldRent: jQuery('#coldRent'),
        totalRent: jQuery('#totalRent'),
        operationalCosts: {
            container: jQuery('#operationalCostsContainer'),
            value: jQuery('#operationalCosts')
        },
        heatingCosts: {
            value: jQuery('#heatingCosts'),
            container: jQuery('#heatingCostsContainer')
        },
        heatingCostsInServiceCharge: jQuery('#heatingCostsInServiceCharge'),
        securityDeposit: jQuery('#securityDeposit'),
        subjectToCommission: jQuery('#subjectToCommission'),
        livingArea: jQuery('#livingArea'),
        rooms: jQuery('#rooms'),
        bathrooms: jQuery('#bathrooms'),
        bedrooms: jQuery('#bedrooms'),
        type: jQuery('#type'),
        heatingType: jQuery('#heatingType'),
        floor: jQuery('#floor'),
        availableFrom: jQuery('#availableFrom'),
        councilFlat: {
            value: jQuery('#councilFlat'),
            container: jQuery('#councilFlatContainer')
        },
        constructionYear: jQuery('#constructionYear'),
        state: jQuery('#state'),
        lastModernization: jQuery('#lastModernization'),
        energyCertificate: {
            constructionYear: jQuery('#constructionYearEnergyCertificate'),
            type: jQuery('#energyCertificateType'),
            consumption: {
                value: jQuery('#energyConsumption'),
                container: jQuery('#energyConsumptionContainer')
            },
            demand: {
                value: jQuery('#energyDemand'),
                container: jQuery('#energyDemandContainer')
            },
            primaryEnergyCarrier: {
                value: jQuery('#primaryEnergyCarrier'),
                container: jQuery('#primaryEnergyCarrierContainer')
            },
            valueClass: {
                value: jQuery('#valueClass'),
                container: jQuery('#valueClassContainer')
            }
        },
        description: jQuery('#description'),
        exposure: jQuery('#exposure'),
        amenities: jQuery('#amenities'),
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
        amenitiesList: jQuery('#amenitiesList'),
        contact: {
            name: jQuery('#contactName'),
            company: jQuery('#contactCompany'),
            address: jQuery('#contactAddress'),
            phone: jQuery('#contactPhone')
        }
    };

    immobrowse.RealEstate.get(immobrowse.joomla.expose.objectId).then(immobrowse.joomla.expose.render);
};


jQuery(document).ready(immobrowse.joomla.expose.init);
