/*
  gallery.js - ImmoBrowse image gallery

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
    * immobrowse.js
*/

var exposeGallery = exposeGallery || {};

exposeGallery.galleryIndex = 0;


exposeGallery.nextImage = function (images) {
  exposeGallery.galleryIndex++;

  if (exposeGallery.galleryIndex >= images.length) {
    exposeGallery.galleryIndex = 0;
  }

  exposeGallery.updateGallery(images, exposeGallery.galleryIndex);
}


exposeGallery.previousImage = function (images) {
  exposeGallery.galleryIndex--;

  if (exposeGallery.galleryIndex < 0) {
    exposeGallery.galleryIndex = images.length - 1;
  }

  exposeGallery.updateGallery(images, exposeGallery.galleryIndex);
}


exposeGallery.updateGallery = function (images) {
  $('#exposeGalleryImage').attr('src', realEstate.attachmentURL(images[exposeGallery.galleryIndex]));
  $('#exposeGalleryTitle').html(images[exposeGallery.galleryIndex].anhangtitel);
  $('#exposeGalleryIndex').html(exposeGallery.galleryIndex + 1);
  $('#exposeGalleryImages').html(images.length);
}


exposeGallery.initGallery = function (images) {
  exposeGallery.galleryIndex = 0;

  if (images.length > 0) {
    $('#exposeGalleryImage').attr('src', realEstate.attachmentURL(images[0]));
  }

  if (images.length > 1) {
    $('#exposeGalleryNext').click(function() {
      exposeGallery.nextImage(images)
    });
    $('#exposeGalleryPrevious').click(function() {
      exposeGallery.previousImage(images)
    });
  }

  exposeGallery.updateGallery(images, 0);
}
