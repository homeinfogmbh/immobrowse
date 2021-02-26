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


import { Loader } from 'https://javascript.homeinfo.de/lib.mjs';
import { CONFIG, Filter, List, RealEstate } from 'https://javascript.homeinfo.de/immobrowse/immobrowse.mjs';

import { configure } from './config.mjs';
import { init as initContactForm } from './contactForm.mjs';
import { init as initGalleries } from './galleries.mjs';


const URL_PARAMS = new URLSearchParams(window.location.search);
// XXX: Change config for appropriate productive setting.
const CUSTOMER = URL_PARAMS.get('customer');
const OBJECT_ID = URL_PARAMS.get('real_estate');
const LOADER = new Loader('loader', 'expose');
const ELEMENTS = {
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


/*
    Initializes the page based on a real estate.
*/
function initRealEstate(realEstate) {
    realEstate.render(ELEMENTS);
    document.title = 'Exposé Nr. ' + realEstate.objectId;
    initContactForm(realEstate);
    initGalleries(realEstate);
    LOADER.stop();
}


/*
    Initializes the page.
*/
export function init () {
    LOADER.start();
    document.getElementById('back').addEventListener('click', event => window.open('list.html?customer=' + CUSTOMER, '_self'));
    configure(CONFIG, CUSTOMER);
    RealEstate.get(OBJECT_ID).then(initRealEstate);
}
