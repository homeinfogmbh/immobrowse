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

var gallery = gallery || {};

gallery.galleryIndex = 0;


gallery.nextImage = function (images) {
  gallery.galleryIndex++;

  if (gallery.galleryIndex >= images.length) {
    gallery.galleryIndex = 0;
  }

  gallery.updateGallery(images, gallery.galleryIndex);
}


gallery.previousImage = function (images) {
  gallery.galleryIndex--;

  if (gallery.galleryIndex < 0) {
    gallery.galleryIndex = images.length - 1;
  }

  gallery.updateGallery(images, gallery.galleryIndex);
}


gallery.updateGallery = function (images) {
  $('#galleryImage').attr('src', realEstate.attachmentURL(images[gallery.galleryIndex]));
  $('#galleryTitle').html(images[gallery.galleryIndex].anhangtitel);
  $('#galleryIndex').html(gallery.galleryIndex + 1);
  $('#galleryImages').html(images.length);
}


gallery.initGallery = function (images) {
  gallery.galleryIndex = 0;

  if (images.length > 0) {
    $('#galleryImage').attr('src', realEstate.attachmentURL(images[0]));
  }

  if (images.length > 1) {
    $('#galleryNext').click(function() {
      gallery.nextImage(images)
    });
    $('#galleryPrevious').click(function() {
      gallery.previousImage(images)
    });
  }

  gallery.updateGallery(images, 0);
}
