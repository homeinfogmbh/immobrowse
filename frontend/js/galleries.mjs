/*
  galleries.mjs - ImmoBrowse image galleries.

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


import { Gallery } from 'https://javascript.homeinfo.de/gallery.mjs'


/*
    Sets up a gallery for real esatate images.
*/
function setupImageGallery (realEstate, mapping) {
    const images = Array.from(realEstate.images);
    mapping.open = document.getElementById('titleImage');

    if (images.length > 0)
        document.getElementById('titleImage').setAttribute('src', realEstate.attachmentURL(images[0]));

    if (images.length > 1) {
        document.getElementById('titleImageFrame').addEventListener('click', event => {
            const imageGallery = new Gallery(images, mapping, attachment => realEstate.attachmentURL(attachment));
            imageGallery.bind();
            imageGallery.render();
            document.getElementById('gallery').modal('toggle');
        });

        document.getElementById('titleImageFrame').classList.add('ib-browsable');
    }
}


/*
    Sets up a gallery for floor plans.
*/
function setupFloorplanGallery (realEstate, mapping) {
    const floorplans = Array.from(realEstate.floorplans);
    mapping.open = document.getElementById('floorplan');

    if (floorplans.length > 0)
        document.getElementById('floorplan').setAttribute('src', realEstate.attachmentURL(floorplans[0]));

    if (floorplans.length > 1) {
        dcoument.getElementById('floorplanFrame').addEventListener('click', event => {
            const floorplanGallery = new Gallery(floorplans, mapping, attachment => realEstate.attachmentURL(attachment));
            floorplanGallery.bind();
            floorplanGallery.render();
            document.getElementById('gallery').style.display = 'block';
        });

        document.getElementById('floorplanFrame').classList.add('ib-browsable');
    }
}


/*
    Sets up the image and floorplan galleries.
*/
export function init (realEstate) {
    const mapping = {
        image: document.getElementById('galleryImage'),
        title: document.getElementById('galleryTitle'),
        index: document.getElementById('galleryIndex'),
        count: document.getElementById('galleryImages'),
        close: document.getElementById('btnCloseGallery'),
        next: document.getElementById('galleryNext'),
        previous: document.getElementById('galleryPrevious')
    };
    setupImageGallery(realEstate, mapping);
    setupFloorplanGallery(realEstate, mapping);
}
