/*
    printGrundriss.js - ImmoBrowse Expose front end JavaScript

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
        * immobrowse.js
*/
var immobrowse = immobrowse || {};
immobrowse.wbsWuppertal = immobrowse.wbsWuppertal || {};
immobrowse.wbsWuppertal.print = immobrowse.wbsWuppertal.print || {};


immobrowse.wbsWuppertal.print.getElements = function () {
    return {
        objectId: jQuery('#objectId'),
        objectTitle: jQuery('#objectTitle'),
        address: jQuery('#objectAddress'),
        contact: {
            container: jQuery('#contactInformation'),
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
        floorplan: {
            image: jQuery('#floorplan'),
            caption: jQuery('#floorplanCaption')
        }
    };
};


immobrowse.wbsWuppertal.print.render = function (realEstate) {
    realEstate.render(immobrowse.wbsWuppertal.print.getElements());
    document.title = 'Exposé Nr. ' + realEstate.objectId;
    jQuery('#loader').hide();
    jQuery('#main').attr('style', 'padding-top: 80px');
};


immobrowse.wbsWuppertal.print.init = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const objectId = urlParams.get('real_estate');
    immobrowse.RealEstate.get(objectId).then(immobrowse.wbsWuppertal.print.render);
};


jQuery(document).ready(immobrowse.wbsWuppertal.print.init);
