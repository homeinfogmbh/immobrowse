/*
  immobrowse-dom.js - ImmoBrowse DOM JavaScript library.

  (C) 2017-2020 HOMEINFO - Digitale Informationssysteme GmbH

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this library.  If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.dom = immobrowse.dom || {};


immobrowse.dom.OvalInner = class extends HTMLDivElement {
    constructor (content) {
        super();
        this.setAttribute('class', 'oval-inner');
        this.innerHTML = content;
    }
};
customElements.define('ib-oval-inner', immobrowse.dom.OvalInner, {extends: 'div'});


immobrowse.dom.OvalOuter = class extends HTMLDivElement {
    constructor (ovalInner) {
        super();
        this.setAttribute('class', 'oval-outer');
        this.appendChild(ovalInner);
    }
};
customElements.define('ib-oval-outer', immobrowse.dom.OvalOuter, {extends: 'div'});


immobrowse.dom.AmenitiesTag = class extends immobrowse.dom.OvalOuter {
    constructor (content) {
        super(new immobrowse.dom.OvalInner(content));
    }
};
customElements.define('ib-amenities-tag', immobrowse.dom.AmenitiesTag, {extends: 'div'});


immobrowse.dom.Numerator = class extends HTMLSpanElement {
    constructor (content) {
        super();
        this.setAttribute('class', 'numerator');
        this.innerHTML = content;
    }
};
customElements.define('ib-numerator', immobrowse.dom.Numerator, {extends: 'span'});


immobrowse.dom.Denominator = class extends HTMLSpanElement {
    constructor (content) {
        super();
        this.setAttribute('class', 'denominator');
        this.innerHTML = content;
    }
};
customElements.define('ib-denominator', immobrowse.dom.Denominator, {extends: 'span'});


immobrowse.dom.Fraction = class extends HTMLSpanElement {
    constructor (numerator, denominator) {
        super();
        this.setAttribute('class', 'fraction');

        if (!(numerator instanceof immobrowse.dom.Numerator))
            numerator = new immobrowse.dom.Numerator(numerator);

        if (!(denominator instanceof immobrowse.dom.Denominator))
            denominator = new immobrowse.dom.Denominator(denominator);

        this.appendChild(numerator);
        this.appendChild(denominator);
    }
};
customElements.define('ib-fraction', immobrowse.dom.Fraction, {extends: 'span'});


immobrowse.dom.KilowattHoursPerSquareMeterAndYear = class extends immobrowse.dom.Fraction {
    constructor () {
        super('kWh','m&sup2;&middot;a');
    }
};
customElements.define('ib-kwhsma', immobrowse.dom.KilowattHoursPerSquareMeterAndYear, {extends: 'span'});


/*
  Appends a data row to the list iff value is not null or hiding is disabled.
*/
immobrowse.dom.addDataFieldCol = function (element, value, list) {
    if (value == null) {
        if (element.hide || false)
            return;

        value = immobrowse.config.na;
    }

    list.push(
        new immobrowse.dom.DataFieldCol(
            new immobrowse.dom.DataFieldRow(new immobrowse.dom.DataFieldCaption(element.caption)),
            new immobrowse.dom.DataFieldRow(new immobrowse.dom.DataFieldValue(value))
        )
    );
};


immobrowse.dom.DataFieldCaption = class extends HTMLDivElement {
    constructor (caption) {
        super();
        this.setAttribute('class', 'ib-preview-data-caption');
        this.innerHTML = caption;
    }
};
customElements.define('ib-data-field-caption', immobrowse.dom.DataFieldCaption, {extends: 'div'});


immobrowse.dom.DataFieldValue = class extends HTMLDivElement {
    constructor (value) {
        super();
        this.setAttribute('class', 'ib-preview-data-value');
        this.innerHTML = value;
    }
};
customElements.define('ib-data-field-value', immobrowse.dom.DataFieldValue, {extends: 'div'});


immobrowse.dom.DataFieldRow = class extends HTMLDivElement {
    constructor (child) {
        super();
        this.setAttribute('class', 'row');
        this.appendChild(child);
    }
};
customElements.define('ib-data-field-row', immobrowse.dom.DataFieldRow, {extends: 'div'});


immobrowse.dom.DataFieldCol = class extends HTMLDivElement {
    constructor (captionRow, valueRow) {
        super();
        this.setAttribute('class', 'w3-col m3');
        this.appendChild(captionRow);
        this.appendChild(valueRow);
    }
};
customElements.define('ib-data-field-col', immobrowse.dom.DataFieldCol, {extends: 'div'});


immobrowse.dom.DataRow = class extends HTMLDivElement {
    constructor (dataColumns) {
        super();
        this.setAttribute('class', 'w3-row w3-centered ib-preview-container');

        for (const child of dataColumns)
            this.appendChild(child);
    }
};
customElements.define('ib-data-row', immobrowse.dom.DataRow, {extends: 'div'});


immobrowse.dom.ObjectAddress = class extends HTMLDivElement {
    constructor (address) {
        super();
        this.setAttribute('class', 'ib-preview-title');
        this.innerHTML = address;
    }
};
customElements.define('ib-object-address', immobrowse.dom.ObjectAddress, {extends: 'div'});


immobrowse.dom.AddressRow = class extends HTMLDivElement {
    constructor (objectAddress) {
        super();
        this.setAttribute('class', 'w3-row w3-centered');
        this.appendChild(objectAddress);
    }
};
customElements.define('ib-address-row', immobrowse.dom.AddressRow, {extends: 'div'});


immobrowse.dom.ObjectTitle = class extends HTMLDivElement {
    constructor (title) {
        super();
        this.setAttribute('class', 'ib-preview-title');
        this.innerHTML = title;
    }
};
customElements.define('ib-object-title', immobrowse.dom.ObjectTitle, {extends: 'div'});


immobrowse.dom.TitleRow = class extends HTMLDivElement {
    constructor (objectTitle) {
        super();
        this.setAttribute('class', 'w3-row w3-centered');
        this.appendChild(objectTitle);
    }
};
customElements.define('ib-title-row', immobrowse.dom.TitleRow, {extends: 'div'});


immobrowse.dom.TitleCol = class extends HTMLDivElement {
    constructor (titleRow, addressRow) {
        super();
        this.setAttribute('class', 'w3-col m8');
        this.appendChild(titleRow);

        if (addressRow != null)
            this.appendChild(addressRow);
    }
};
customElements.define('ib-title-col', immobrowse.dom.TitleCol, {extends: 'div'});


immobrowse.dom.DataCol = class extends HTMLDivElement {
    constructor (dataRow, amenitiesTags) {
        super();
        this.setAttribute('class', 'w3-col m8');
        this.appendChild(dataRow);
        this.appendChild(amenitiesTags);
    }
};
customElements.define('ib-data-col', immobrowse.dom.DataCol, {extends: 'div'});


immobrowse.dom.TitleImage = class extends HTMLImageElement {
    constructor (url) {
        super();

        if (url == null)
            url = homeinfo_baseurl + '/img/dummy.jpg';

        this.setAttribute('src', url);
        this.setAttribute('class', 'ib-framed-image');
        this.setAttribute('alt', 'Titelbild');
    }
};
customElements.define('ib-title-iamge', immobrowse.dom.TitleImage, {extends: 'img'});


immobrowse.dom.ImageFrame = class extends HTMLDivElement {
    constructor (image) {
        super();
        this.setAttribute('class', 'ib-image-frame');
        this.appendChild(image);
    }
};
customElements.define('ib-image-frame', immobrowse.dom.ImageFrame, {extends: 'div'});


immobrowse.dom.ImageCol = class extends HTMLDivElement {
    constructor (imageFrame) {
        super();
        this.setAttribute('class', 'w3-col m4');
        this.appendChild(imageFrame);
    }
};
customElements.define('ib-image-col', immobrowse.dom.ImageCol, {extends: 'div'});


immobrowse.dom.HeaderRow = class extends HTMLDivElement {
    constructor (imageCol, titleCol) {
        super();
        this.setAttribute('class', 'w3-row w3-centered ib-preview-container');
        this.appendChild(imageCol);
        this.appendChild(titleCol);
    }
};
customElements.define('ib-header-row', immobrowse.dom.HeaderRow, {extends: 'div'});


immobrowse.dom.AmenitiesTags = class extends HTMLDivElement {
    constructor (amenities) {
        super();
        //this.setAttribute('class', 'ib-preview-tags');

        for (const child of amenities)
            this.appendChild(child);
    }
};
customElements.define('ib-amenities-tags', immobrowse.dom.AmenitiesTags, {extends: 'div'});


immobrowse.dom.AmenitiesRow = class extends HTMLDivElement {
    constructor (amenitiesTags) {
        super();
        this.setAttribute('class', 'w3-row w3-centered ib-preview-container');
        this.appendChild(amenitiesTags);
    }
};
customElements.define('ib-amenities-row', immobrowse.dom.AmenitiesRow, {extends: 'div'});


immobrowse.dom.Entry = class extends HTMLDivElement {
    constructor (headerRow, dataRow, amenitiesRow, detailsURL) {
        super();
        this.setAttribute('class', 'ib-preview-item');
        this.setAttribute('onclick', 'immobrowse.open("' + detailsURL + '");');
        this.appendChild(headerRow);
        this.appendChild(dataRow);
        this.appendChild(amenitiesRow);
    }
};
customElements.define('ib-entry', immobrowse.dom.Entry, {extends: 'div'});


immobrowse.dom.PreviewImage = class extends HTMLImageElement {
    constructor (url, alt) {
        super();

        if (url == null)
            url = 'img/dummy.jpg';

        this.setAttribute('src', url);
        this.setAttribute('class', 'ib-further-image');

        if (alt)
            this.setAttribute('alt', alt);
    }
};
customElements.define('ib-preview-iamge', immobrowse.dom.PreviewImage, {extends: 'img'});


/*
  Creates a contact email.
*/
immobrowse.dom.contactEmail = function (
    realEstate, message, salutation, forename, surname,
    phone, street, houseNumber, zipCode, city, member = null) {
    function newline () {
        return document.createElement('br');
    }

    const doc = document.implementation.createHTMLDocument('Anfrage zu Objekt');
    const body = doc.body;

    const h1 = document.createElement('h1');
    h1.textContent = 'Anfrage zu Objekt';
    body.appendChild(h1);

    const h2 = document.createElement('h2');
    h2.textContent = realEstate.objectTitle;
    body.appendChild(h2);

    const h3 = document.createElement('h3');
    h3.textContent = [realEstate.addressPreview, realEstate.cityPreview].join(' ');
    body.appendChild(h3);

    salutation = document.createTextNode(salutation + ' ');
    body.appendChild(salutation);

    const span = document.createElement('span');
    span.setAttribute('style', 'font-variant:small-caps;');
    span.textContent = [forename, surname].join(' ');
    body.appendChild(span);

    let inquirerInfo = false;
    let streetAndHouseNumber = street;

    if (streetAndHouseNumber) {
        if (houseNumber)
            streetAndHouseNumber += ' ' + houseNumber;

        streetAndHouseNumber = document.createTextNode(streetAndHouseNumber);
        body.appendChild(newline());
        body.appendChild(streetAndHouseNumber);
        inquirerInfo = true;
    }

    if (city) {
        if (zipCode) {
            const zipCodeAndCity = document.createTextNode([zipCode, city].join(' '));
            body.appendChild(newline());
            body.appendChild(zipCodeAndCity);
        } else {
            city = document.createTextNode(city);
            body.appendChild(newline());
            body.appendChild(city);
        }

        inquirerInfo = true;
    } else if (zipCode) {
        zipCode = document.createTextNode(zipCode);
        body.appendChild(newline());
        body.appendChild(zipCode);
        inquirerInfo = true;
    }

    if (phone) {
        phone = document.createTextNode('Tel.: ' + phone);
        body.appendChild(newline());
        body.appendChild(phone);
        inquirerInfo = true;
    }

    if (member != null) {
        member = document.createTextNode('Mitglied: ' + member ? 'Ja' : 'Nein');
        body.appendChild(newline());
        body.appendChild(member);
        inquirerInfo = true;
    }

    if (inquirerInfo) {
        body.appendChild(newline());
        body.appendChild(newline());    // two new lines.
    } else {
        const space = document.createTextNode(' ');
        body.appendChild(space);
    }

    const messageHeader = document.createTextNode('hat folgende Anfrage an Sie:');
    body.appendChild(messageHeader);
    body.appendChild(newline());
    body.appendChild(newline());  // two new lines.

    const div = document.createElement('div');
    div.setAttribute('style', 'font-style:italic;');
    div.innerHTML = message.replace('\n', '\n<br>\n');
    body.appendChild(div);
    return doc.documentElement;
};
