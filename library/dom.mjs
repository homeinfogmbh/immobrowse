/*
  dom.mjs - ImmoBrowse DOM JavaScript library.

  (C) 2021 HOMEINFO - Digitale Informationssysteme GmbH

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


class OvalInner extends HTMLDivElement {
    constructor (content) {
        super();
        this.setAttribute('class', 'oval-inner');
        this.innerHTML = content;
    }
}
customElements.define('ib-oval-inner', OvalInner, {extends: 'div'});


class OvalOuter extends HTMLDivElement {
    constructor (ovalInner) {
        super();
        this.setAttribute('class', 'oval-outer');
        this.appendChild(ovalInner);
    }
}
customElements.define('ib-oval-outer', OvalOuter, {extends: 'div'});


class Numerator extends HTMLSpanElement {
    constructor (content) {
        super();
        this.setAttribute('class', 'numerator');
        this.innerHTML = content;
    }
}
customElements.define('ib-numerator', Numerator, {extends: 'span'});


class Denominator extends HTMLSpanElement {
    constructor (content) {
        super();
        this.setAttribute('class', 'denominator');
        this.innerHTML = content;
    }
}
customElements.define('ib-denominator', Denominator, {extends: 'span'});


class Fraction extends HTMLSpanElement {
    constructor (numerator, denominator) {
        super();
        this.setAttribute('class', 'fraction');

        if (!(numerator instanceof Numerator))
            numerator = new Numerator(numerator);

        if (!(denominator instanceof Denominator))
            denominator = new Denominator(denominator);

        this.appendChild(numerator);
        this.appendChild(denominator);
    }
}
customElements.define('ib-fraction', Fraction, {extends: 'span'});


class DataFieldCaption extends HTMLDivElement {
    constructor (caption) {
        super();
        this.setAttribute('class', 'ib-preview-data-caption');
        this.innerHTML = caption;
    }
}
customElements.define('ib-data-field-caption', DataFieldCaption, {extends: 'div'});


class DataFieldValue extends HTMLDivElement {
    constructor (value) {
        super();
        this.setAttribute('class', 'ib-preview-data-value');
        this.innerHTML = value;
    }
}
customElements.define('ib-data-field-value', DataFieldValue, {extends: 'div'});


class DataFieldRow extends HTMLDivElement {
    constructor (child) {
        super();
        this.setAttribute('class', 'row');
        this.appendChild(child);
    }
}
customElements.define('ib-data-field-row', DataFieldRow, {extends: 'div'});


class DataFieldCol extends HTMLDivElement {
    constructor (captionRow, valueRow) {
        super();
        this.setAttribute('class', 'w3-col m3');
        this.appendChild(captionRow);
        this.appendChild(valueRow);
    }
}
customElements.define('ib-data-field-col', DataFieldCol, {extends: 'div'});


class DataRow extends HTMLDivElement {
    constructor (dataColumns) {
        super();
        this.setAttribute('class', 'w3-row w3-centered ib-preview-container');

        for (const child of dataColumns)
            this.appendChild(child);
    }
}
customElements.define('ib-data-row', DataRow, {extends: 'div'});


class ObjectAddress extends HTMLDivElement {
    constructor (address) {
        super();
        this.setAttribute('class', 'ib-preview-title');
        this.innerHTML = address;
    }
}
customElements.define('ib-object-address', ObjectAddress, {extends: 'div'});


class AddressRow extends HTMLDivElement {
    constructor (objectAddress) {
        super();
        this.setAttribute('class', 'w3-row w3-centered');
        this.appendChild(objectAddress);
    }
}
customElements.define('ib-address-row', AddressRow, {extends: 'div'});


class ObjectTitle extends HTMLDivElement {
    constructor (title) {
        super();
        this.setAttribute('class', 'ib-preview-title');
        this.innerHTML = title;
    }
}
customElements.define('ib-object-title', ObjectTitle, {extends: 'div'});


class TitleRow extends HTMLDivElement {
    constructor (objectTitle) {
        super();
        this.setAttribute('class', 'w3-row w3-centered');
        this.appendChild(objectTitle);
    }
}
customElements.define('ib-title-row', TitleRow, {extends: 'div'});


class TitleCol extends HTMLDivElement {
    constructor (titleRow, addressRow) {
        super();
        this.setAttribute('class', 'w3-col m8');
        this.appendChild(titleRow);

        if (addressRow != null)
            this.appendChild(addressRow);
    }
}
customElements.define('ib-title-col', TitleCol, {extends: 'div'});


class DataCol extends HTMLDivElement {
    constructor (dataRow, amenitiesTags) {
        super();
        this.setAttribute('class', 'w3-col m8');
        this.appendChild(dataRow);
        this.appendChild(amenitiesTags);
    }
}
customElements.define('ib-data-col', DataCol, {extends: 'div'});


class TitleImage extends HTMLImageElement {
    constructor (url) {
        super();

        if (url == null)
            url = 'img/dummy.jpg';

        this.setAttribute('src', url);
        this.setAttribute('class', 'ib-framed-image');
        this.setAttribute('alt', 'Titelbild');
    }
}
customElements.define('ib-title-iamge', TitleImage, {extends: 'img'});


class ImageFrame extends HTMLDivElement {
    constructor (image) {
        super();
        this.setAttribute('class', 'ib-image-frame');
        this.appendChild(image);
    }
}
customElements.define('ib-image-frame', ImageFrame, {extends: 'div'});


class ImageCol extends HTMLDivElement {
    constructor (imageFrame) {
        super();
        this.setAttribute('class', 'w3-col m4');
        this.appendChild(imageFrame);
    }
}
customElements.define('ib-image-col', ImageCol, {extends: 'div'});


class HeaderRow extends HTMLDivElement {
    constructor (imageCol, titleCol) {
        super();
        this.setAttribute('class', 'w3-row w3-centered ib-preview-container');
        this.appendChild(imageCol);
        this.appendChild(titleCol);
    }
}
customElements.define('ib-header-row', HeaderRow, {extends: 'div'});


class AmenitiesTags extends HTMLDivElement {
    constructor (amenities) {
        super();
        //this.setAttribute('class', 'ib-preview-tags');

        for (const child of amenities)
            this.appendChild(child);
    }
}
customElements.define('ib-amenities-tags', AmenitiesTags, {extends: 'div'});


class AmenitiesRow extends HTMLDivElement {
    constructor (amenitiesTags) {
        super();
        this.setAttribute('class', 'w3-row w3-centered ib-preview-container');
        this.appendChild(amenitiesTags);
    }
}
customElements.define('ib-amenities-row', AmenitiesRow, {extends: 'div'});


class Entry extends HTMLDivElement {
    constructor (headerRow, dataRow, amenitiesRow, detailsURL) {
        super();
        this.setAttribute('class', 'ib-preview-item');
        this.setAttribute('onclick', 'immobrowse.open("' + detailsURL + '");');
        this.appendChild(headerRow);
        this.appendChild(dataRow);
        this.appendChild(amenitiesRow);
    }
}
customElements.define('ib-entry', Entry, {extends: 'div'});


export class AmenitiesTag extends OvalOuter {
    constructor (content) {
        super(new OvalInner(content));
    }
}
customElements.define('ib-amenities-tag', AmenitiesTag, {extends: 'div'});


export class KilowattHoursPerSquareMeterAndYear extends Fraction {
    constructor () {
        super('kWh','m&sup2;&middot;a');
    }
}
customElements.define('ib-kwhsma', KilowattHoursPerSquareMeterAndYear, {extends: 'span'});


/*
  Appends a data row to the list iff value is not null or hiding is disabled.
*/
export function addDataFieldCol (element, value, list) {
    if (value == null && element.hide)
        return;

    list.push(
        new DataFieldCol(
            new DataFieldRow(new DataFieldCaption(element.caption)),
            new DataFieldRow(new DataFieldValue(value))
        )
    );
}


export class PreviewImage extends HTMLImageElement {
    constructor (url, alt) {
        super();

        if (url == null)
            url = 'img/dummy.jpg';

        this.setAttribute('src', url);
        this.setAttribute('class', 'ib-further-image');

        if (alt)
            this.setAttribute('alt', alt);
    }
}
customElements.define('ib-preview-iamge', PreviewImage, {extends: 'img'});


export function preview (realEstate, elements) {
    let addressRow = null;

    if (realEstate.showAddress)
        addressRow = new AddressRow(new ObjectAddress(realEstate.address));

    return new Entry(
        new HeaderRow(
            new ImageCol(
                new ImageFrame(
                    new TitleImage(
                        realEstate.attachmentURL(realEstate.titleImage)
                    )
                )
            ),
            new TitleCol(
                new TitleRow(
                    new ObjectTitle(realEstate.objectTitle)
                ),
                addressRow
            )
        ),
        new DataRow(realEstate.dataFields(elements)),
        new AmenitiesRow(
            new AmenitiesTags(realEstate.amenitiesTags())
        ),
        realEstate.detailsURL
    );
}


/*
  Creates a contact email.
*/
export function contactHTMLEmail (
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
}
