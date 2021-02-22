/*
  expose.mjs - ImmoBrowse Expose front end.

  (C) 2021 HOMEINFO - Digitale Informationssysteme GmbH

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
*/
'use strict';


import { isEmail } from 'https://javascript.homeinfo.de/lib.mjs'
import { Mailer } from 'https://javascript.homeinfo.de/hisecon.mjs';
import { CONFIG, Filter, List, RealEstate } from 'https://javascript.homeinfo.de/immobrowse/immobrowse.mjs';

import { configure } from './config.mjs';
import { Gallery } from './gallery.mjs';


const urlParams = new URLSearchParams(window.location.search);
// XXX: Change config for appropriate productive setting.
const mailer = new Mailer('homeinfo-testing');
const customer = urlParams.get('customer');
const objectId = urlParams.get('real_estate');
let elements, realEstate, imageGallery, floorplanGallery;


function back () {
    immobrowse.open('list.html?customer=' + customer);
}


function clearContactForm () {
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


function sendEmail () {
    const response = grecaptcha.getResponse();

    if (response.length == 0) {
        alert('Bitte den CAPTCHA lösen.');
        return;
    }

    const forename = $('#forename').val().trim();

    if (forename == '') {
        alert('Bitte Pflichtfeld "Vorname" ausfüllen.');
        return;
    }

    const surname = $('#surname').val().trim();

    if (surname == '') {
        alert('Bitte Pflichtfeld "Nachname" ausfüllen.');
        return;
    }

    const email = $('#email').val().trim();

    if (email == '') {
        alert('Bitte Pflichtfeld "E-Mail Adresse" ausfüllen.');
        return;
    }

    if (!isEmail(email)) {
        alert('Bitte geben Sie eine gültige E-Mail Adresse an.');
        return;
    }

    let salutation;

    if (document.querySelector('input:radio[name="gender"]:checked').value == 1)
        salutation = 'Herr';
    else
        salutation = 'Frau';

    const objectTitle = realEstate.objectTitle;
    const objectAddress = [realEstate.addressPreview, realEstate.cityPreview].join(' ');
    const phone = document.getElementById('phone').value.trim();
    const street = document.getElementById('street').value.trim();
    const houseNumber = document.getElementById('house_number').value.trim();
    const zipCode = document.getElementById('zip_code').value.trim();
    const city = document.getElementById('city').value.trim();
    const message = document.getElementById('message').value.trim();
    const recipient = realEstate.contact.email;
    const html = immobrowse.dom.contactEmail(
        realEstate, message, salutation, forename, surname,
        phone, street, houseNumber, zipCode, city).outerHTML;
    mailer.send(response, 'Anfrage zu Objekt Nr. ' + realEstate.objectId, html, recipient, email);
    grecaptcha.reset();
}


function initContactForm () {
    clearContactForm();
    document.getElementById('send_form').addEventListener('click', sendEmail);
    $('#contactFormModal').on('shown.bs.modal', clearContactForm);
    document.getElementById('#clear_form').click(clearContactForm);
}


function postRender () {
    initContactForm();

    $('#loader').hide();
    $('#main').attr('style', 'padding-top: 80px');

    $('.showimage').click(function() {
        for (var i = 0; i < $(this).data('nrmax'); i++) {
            $('#image'+ i).hide();
        }

        $('#image'+ $(this).data('nr')).show();
    });

    $('.btn_contact').click(function(e) {
        //$('#contact').scrollIntoView(true);
        if ($('#contact').attr('style') == 'display: none;') {
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


function setupGalleries () {
    var galleryMapping = {
        'image': $('#galleryImage'),
        'title': $('#galleryTitle'),
        'index': $('#galleryIndex'),
        'count': $('#galleryImages'),
        'next': $('#galleryNext'),
        'previous': $('#galleryPrevious')
    };
    var images = Array.from(realEstate.images);

    function attachmentUrlCallback(attachment) {
        return realEstate.attachmentURL(attachment);
    }

    imageGallery = new Gallery(images, galleryMapping, attachmentUrlCallback);

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

    var floorplans = Array.from(realEstate.floorplans);
    floorplanGallery = new Gallery(floorplans, galleryMapping, attachmentUrlCallback);

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

export function init () {
    configure(CONFIG);
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
        amenitiesList: $('#amenitiesList'),
        contact: {
            name: $('#contactName'),
            company: $('#contactCompany'),
            address: $('#contactAddress'),
            phone: $('#contactPhone'),
            website: $('#contactWebsite')
        },
        titleImage: {
            image: $('#titleImage'),
            caption: $('#titleImageCaption')
        },
        floorplan: {
            image: $('#floorplan'),
            caption: $('#floorplanCaption')
        }
    };

    immobrowse.RealEstate.get(objectId).then(
        function (realEstate_) {
            realEstate = realEstate_;
            setupGalleries();
            realEstate.render(elements);
            document.title = 'Exposé Nr. ' + realEstate.objectId;
            postRender();
        }
    );
}
