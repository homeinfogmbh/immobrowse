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
*/
'use strict';


import { Loader, isEmail } from 'https://javascript.homeinfo.de/lib.mjs'
import { Contact, EMail, Mailer, immoblueMessage } from 'https://javascript.homeinfo.de/hisecon.mjs';
import { CONFIG, Filter, List, RealEstate } from 'https://javascript.homeinfo.de/immobrowse/immobrowse.mjs';

import { configure } from './config.mjs';
import { Gallery } from './gallery.mjs';


const URL_PARAMS = new URLSearchParams(window.location.search);
// XXX: Change config for appropriate productive setting.
const MAILER = new Mailer('homeinfo-testing');
const CUSTOMER = URL_PARAMS.get('customer');
const OBJECT_ID = URL_PARAMS.get('real_estate');
const DEFAULT_INQUIRY_TEXT = 'Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.';
const LOADER = new Loader('loader', 'expose');
let REAL_ESTATE, IMAGE_GALLERY, FLOORPLAN_GALLERY;


function clearContactForm () {
    document.getElementById('object_id').setAttribute('placeholder', document.getElementById('objectId').innerHTML);
    document.getElementById('gender_female').checked = true;
    document.getElementById('forename').value = '';
    document.getElementById('surname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('street').value = '';
    document.getElementById('house_number').value = '';
    document.getElementById('zip_code').value = '';
    document.getElementById('city').value = '';
    document.getElementById('message').value = DEFAULT_INQUIRY_TEXT;
    document.getElementById('contact_form_response').style.display = 'none';
}


function sendEmail () {
    const response = grecaptcha.getResponse();

    if (response.length == 0)
        return alert('Bitte den CAPTCHA lösen.');

    const firstName = document.getElementById('forename').value.trim();

    if (firstName == '')
        return alert('Bitte Pflichtfeld "Vorname" ausfüllen.');

    const lastName = document.getElementById('surname').value.trim();

    if (lastName == '')
        return alert('Bitte Pflichtfeld "Nachname" ausfüllen.');

    const emailAddress = document.getElementById('email').value.trim();

    if (emailAddress == '')
        return alert('Bitte Pflichtfeld "E-Mail Adresse" ausfüllen.');

    if (!isEmail(emailAddress))
        return alert('Bitte geben Sie eine gültige E-Mail Adresse an.');

    let salutation;

    if (document.getElementById('gender_female').checked)
        salutation = 'Frau';
    else if (document.getElementById('gender_male').checked)
        salutation = 'Herr';
    else
        salutation = 'Diverse Person';

    const objectTitle = REAL_ESTATE.objectTitle;
    const objectAddress = [REAL_ESTATE.addressPreview, REAL_ESTATE.cityPreview].join(' ');
    const phone = document.getElementById('phone').value.trim();
    const street = document.getElementById('street').value.trim();
    const houseNumber = document.getElementById('house_number').value.trim();
    const zipCode = document.getElementById('zip_code').value.trim();
    const city = document.getElementById('city').value.trim();
    const address = street + ' ' + houseNumber + ', ' + zipCode + ' ' + city;
    const message = document.getElementById('message').value.trim();
    const contact = new Contact(salutation, firstName, lastName, address, emailAddress, phone);
    const subject = 'Anfrage zu Objekt Nr. ' + REAL_ESTATE.objectId;
    const text = immoblueMessage(REAL_ESTATE, contact, message);
    //const email = new EMail(subject, text, [REAL_ESTATE.contact.email]);
    const email = new EMail(subject, text, ['r.neumann@homeinfo.de']);
    MAILER.send(response, email);
    grecaptcha.reset();
    clearContactForm();
    closeContactForm();
}


function initContactForm () {
    clearContactForm();
    document.getElementById('send_form').addEventListener('click', sendEmail);
    document.getElementById('clear_form').addEventListener('click', clearContactForm);
}


function postRender () {
    initContactForm();
    document.getElementById('loader').style.display = 'none';
}


function setupGalleries () {
    var galleryMapping = {
        image: document.getElementById('galleryImage'),
        title: document.getElementById('galleryTitle'),
        index: document.getElementById('galleryIndex'),
        count: document.getElementById('galleryImages'),
        next: document.getElementById('galleryNext'),
        previous: document.getElementById('galleryPrevious')
    };
    var images = Array.from(REAL_ESTATE.images);

    function attachmentUrlCallback(attachment) {
        return REAL_ESTATE.attachmentURL(attachment);
    }

    IMAGE_GALLERY = new Gallery(images, galleryMapping, attachmentUrlCallback);

    if (images.length > 0) {
        document.getElementById('titleImage').setAttribute('src', REAL_ESTATE.attachmentURL(images[0]));
    }

    if (images.length > 1) {
        document.getElementById('titleImageFrame').addEventListener('click', event => {
            IMAGE_GALLERY.bind();
            IMAGE_GALLERY.render();
            document.getElementById('gallery').modal('toggle');
        });

        document.getElementById('titleImageFrame').classList.add('ib-browsable');
    }

    var floorplans = Array.from(REAL_ESTATE.floorplans);
    FLOORPLAN_GALLERY = new Gallery(floorplans, galleryMapping, attachmentUrlCallback);

    if (floorplans.length > 0) {
        document.getElementById('floorplan').setAttribute('src', REAL_ESTATE.attachmentURL(floorplans[0]));
    }

    if (floorplans.length > 1) {
        dcoument.getElementById('floorplanFrame').addEventListener('click', event => {
            FLOORPLAN_GALLERY.bind();
            FLOORPLAN_GALLERY.render();
            document.getElementById('gallery').style.display = 'block';
        });

        document.getElementById('floorplanFrame').classList.add('ib-browsable');
    }
}


function closeContactForm () {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('expose').style.display = 'block';
}


/*
    Toggles between the contact form and the real estate.
*/
function toggleContactForm () {
    const contactForm = document.getElementById('contactForm');
    const expose = document.getElementById('expose');

    if (contactForm.style.display == 'block')
        return closeContactForm();

    expose.style.display = 'none';
    contactForm.style.display = 'block';
}


export function init () {
    LOADER.start();
    document.getElementById('back').addEventListener('click', event => window.open('list.html?customer=' + CUSTOMER, '_self'));
    document.getElementById('btnContactForm').addEventListener('click', toggleContactForm);
    document.getElementById('btnCloseContactForm').addEventListener('click', closeContactForm);
    configure(CONFIG, CUSTOMER);
    const elements = {
        objectId: 'objectId',
        objectTitle: 'objectTitle',
        coldRent: 'coldRent',
        serviceCharge: 'serviceCharge',
        heatingCosts: 'heatingCosts',
        heatingCostsInServiceCharge: 'heatingCostsInServiceCharge',
        securityDeposit: 'securityDeposit',
        subjectToCommission: 'subjectToCommission',
        livingArea: 'livingArea',
        rooms: 'rooms',
        floor: 'floor',
        availableFrom: 'availableFrom',
        councilFlat: 'councilFlat',
        constructionYear: 'constructionYear',
        state: 'state',
        lastModernization: 'lastModernization',
        energyCertificate: {
            type: 'energyCertificateType',
            consumption: {
                value: 'energyConsumption',
                container: 'energyConsumptionContainer'
            },
            demand: {
                value: 'energyDemand',
                container: 'energyDemandContainer'
            },
            primaryEnergyCarrier: 'primaryEnergyCarrier',
            valueClass: 'valueClass'
        },
        description: 'description',
        exposure: 'exposure',
        miscellanea: 'miscellanea',
        salutation: 'salutation',
        firstName: 'firstName',
        lastName: 'lastName',
        company: 'company',
        street: 'street',
        houseNumber: 'houseNumber',
        streetAndHouseNumber: 'streetAndHouseNumber',
        zipCode: 'zipCode',
        city: 'city',
        zipCodeAndCity: 'zipCodeAndCity',
        website: 'website',
        amenitiesList: 'amenitiesList',
        contact: {
            name: 'contactName',
            company: 'contactCompany',
            address: 'contactAddress',
            phone: 'contactPhone',
            website: 'contactWebsite'
        },
        titleImage: {
            image: 'titleImage',
            caption: 'titleImageCaption'
        },
        floorplan: {
            image: 'floorplan',
            caption: 'floorplanCaption'
        }
    };

    RealEstate.get(OBJECT_ID).then(realEstate => {
        REAL_ESTATE = realEstate;
        setupGalleries();
        realEstate.render(elements);
        document.title = 'Exposé Nr. ' + realEstate.objectId;
        postRender();
        LOADER.stop();
    });
}
