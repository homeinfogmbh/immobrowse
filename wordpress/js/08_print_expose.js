/*
    print_expose.js - ImmoBrowse Exposé printing JavaScript

    (C) 2017-2020 HOMEINFO - Digitale Informationssysteme GmbH

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
        * immobrowse.js
*/
var immobrowse = immobrowse || {};
immobrowse.print = immobrowse.print || {};
immobrowse.print.expose = immobrowse.print.expose || {};


immobrowse.print.expose.getElements = function () {
    return {
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
        amenitiesList: jQuery('#amenitiesList'),
        contact: {
            container: jQuery('#contactInformation'),
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
        },
        titleImage: {
            image: jQuery('#titleImage'),
            caption: jQuery('#titleImageCaption')
        },
        floorplan: {
            image: jQuery('#floorplan'),
            caption: jQuery('#floorplanCaption')
        }
    };
};


immobrowse.print.expose.render = function (realEstate) {
    realEstate.render(immobrowse.print.expose.getElements());
    document.title = 'Exposé Nr. ' + realEstate.objectId();
    jQuery('#loader').hide();
    jQuery('#main').attr('style', 'padding-top: 80px');
};


immobrowse.print.expose.init = function () {
    var args = new homeinfo.QueryString();
    var objectId = args.real_estate;
    immobrowse.RealEstate.get(objectId).then(immobrowse.print.expose.render);
};


jQuery(document).ready(immobrowse.print.expose.init);
