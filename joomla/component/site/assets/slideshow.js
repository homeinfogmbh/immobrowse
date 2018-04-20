/*
  gallery.js - ImmoBrowse Expose gallery JavaScript library.

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
      * sweetalert.js
      * immobrowse.js
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.joomla = immobrowse.joomla || {};
immobrowse.joomla.slideshow = immobrowse.joomla.slideshow || {};
immobrowse.joomla.slideshow.titleImageGallery = null;
immobrowse.joomla.slideshow.floorplanGallery = null;


immobrowse.joomla.slideshow.nextTitleImage = function () {
    immobrowse.joomla.slideshow.renderTitleImage(immobrowse.joomla.slideshow.titleImageGallery.next());
};


immobrowse.joomla.slideshow.previousTitleImage = function () {
    immobrowse.joomla.slideshow.renderTitleImage(immobrowse.joomla.slideshow.titleImageGallery.previous());
};


immobrowse.joomla.slideshow.nextFloorplan = function () {
    immobrowse.joomla.slideshow.renderFloorplan(immobrowse.joomla.slideshow.floorplanGallery.next());
};


immobrowse.joomla.slideshow.previousFloorplan = function () {
    immobrowse.joomla.slideshow.renderFloorplan(immobrowse.joomla.slideshow.floorplanGallery.previous());
};


immobrowse.joomla.slideshow.renderTitleImage = function (attachment) {
    if (attachment != null) {
        var url = immobrowse.joomla.expose.realEstate.attachmentURL(attachment);
        jQuery('#titleImage').attr('src', url);

        if (attachment.anhangtitel != null) {
            jQuery('#titleImageCaption').html(attachment.anhangtitel);
        }
    }
};


immobrowse.joomla.slideshow.renderFloorplan = function (attachment) {
    if (attachment != null) {
        var url = immobrowse.joomla.expose.realEstate.attachmentURL(attachment);
        jQuery('#floorplan').attr('src', url);

        if (attachment.anhangtitel != null) {
            jQuery('#floorplanCaption').html(attachment.anhangtitel);
        }
    }
};


immobrowse.joomla.slideshow.initGalleries = function () {
    immobrowse.joomla.slideshow.titleImageGallery = new immobrowse.joomla.gallery.Gallery(
        immobrowse.joomla.expose.realEstate.images());
    immobrowse.joomla.slideshow.floorplanGallery = new immobrowse.joomla.gallery.Gallery(
        immobrowse.joomla.expose.realEstate.floorplans());
    immobrowse.joomla.slideshow.renderTitleImage(immobrowse.joomla.slideshow.titleImageGallery.element());
    immobrowse.joomla.slideshow.renderFloorplan(immobrowse.joomla.slideshow.floorplanGallery.element());
};
