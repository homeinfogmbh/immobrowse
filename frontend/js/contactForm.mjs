/*
  contactForm.mjs - ImmoBrowse contact form.

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


import { isEmail } from 'https://javascript.homeinfo.de/lib.mjs';
import { Address } from 'https://javascript.homeinfo.de/mdb.mjs';
import { Contact, EMail, Mailer, immoblueMessage } from 'https://javascript.homeinfo.de/hisecon.mjs';


const MESSAGE = 'Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.';
const MAILER = new Mailer('homeinfo-testing');


/*
    Resets the contact form.
*/
function clearContactForm (realEstate) {
    document.getElementById('object_id').innerHTML = realEstate.objectId;
    document.getElementById('gender_female').checked = true;
    document.getElementById('forename').value = '';
    document.getElementById('surname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('street').value = '';
    document.getElementById('house_number').value = '';
    document.getElementById('zip_code').value = '';
    document.getElementById('city').value = '';
    document.getElementById('message').value = MESSAGE;
    document.getElementById('contact_form_response').style.display = 'none';
}


/*
    Opens the contact form.
*/
function openContactForm () {
    document.getElementById('expose').style.display = 'none';
    document.getElementById('contactForm').style.display = 'block';
}


/*
    Closes the contact form.
*/
function closeContactForm () {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('expose').style.display = 'block';
}


/*
    Sends an email with the content from the contact form.
*/
function sendEmail (realEstate) {
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

    const objectTitle = realEstate.objectTitle;
    const objectAddress = [realEstate.addressPreview, realEstate.cityPreview].join(' ');
    const phone = document.getElementById('phone').value.trim();
    const street = document.getElementById('street').value.trim();
    const houseNumber = document.getElementById('house_number').value.trim();
    const zipCode = document.getElementById('zip_code').value.trim();
    const city = document.getElementById('city').value.trim();
    const address = new Address(street, houseNumber, zipCode, city);
    const message = document.getElementById('message').value.trim();
    const contact = new Contact(salutation, firstName, lastName, address, emailAddress, phone);
    const subject = 'Anfrage zu Objekt Nr. ' + realEstate.objectId;
    const text = immoblueMessage(realEstate, contact, message);
    //const email = new EMail(subject, text, [realEstate.contact.email]);
    const email = new EMail(subject, text, ['r.neumann@homeinfo.de']);
    MAILER.send(response, email);
    grecaptcha.reset();
    clearContactForm(realEstate);
    closeContactForm();
}


/*
    Initializes the contact form.
*/
export function init (realEstate) {
    clearContactForm(realEstate);
    document.getElementById('btnContactForm').addEventListener('click', openContactForm);
    document.getElementById('btnCloseContactForm').addEventListener('click', closeContactForm);
    document.getElementById('send_form').addEventListener('click', () => sendEmail(realEstate));
    document.getElementById('clear_form').addEventListener('click', () => clearContactForm(realEstate));
}
