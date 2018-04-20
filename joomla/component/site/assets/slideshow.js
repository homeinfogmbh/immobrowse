/*
    expose.js - ImmoBrowse Expose front end JavaScript

    (C) 2017 HOMEINFO - Digitale Informationssysteme GmbH

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.    See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.    If not, see <http://www.gnu.org/licenses/>.

    Maintainer: Richard Neumann <r dot neumann at homeinfo period de>

    Requires:
        * jquery.js
        * sweetalert.js
        * immobrowse.js
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.slideshow = {};
immobrowse.slideshow.titleImageGallery = null;
immobrowse.slideshow.floorplanGallery = null;


immobrowse.slideshow.nextTitleImage = function () {
    immobrowse.slideshow.renderTitleImage(immobrowse.slideshow.titleImageGallery.next());
};


immobrowse.slideshow.previousTitleImage = function () {
    immobrowse.slideshow.renderTitleImage(immobrowse.slideshow.titleImageGallery.previous());
};


immobrowse.slideshow.nextFloorplan = function() {
    immobrowse.slideshow.renderFloorplan(immobrowse.slideshow.floorplanGallery.next());
};


immobrowse.slideshow.previousFloorplan = function () {
    immobrowse.slideshow.renderFloorplan(immobrowse.slideshow.floorplanGallery.previous());
};


immobrowse.slideshow.renderTitleImage = function (attachment) {
    if (attachment != null) {
        var url = immobrowse.expose.realEstate.attachmentURL(attachment);
        jQuery('#titleImage').attr('src', url);

        if (attachment.anhangtitel != null) {
            jQuery('#titleImageCaption').html(attachment.anhangtitel);
        }
    }
};


immobrowse.slideshow.renderFloorplan = function (attachment) {
    if (attachment != null) {
        var url = immobrowse.expose.realEstate.attachmentURL(attachment);
        jQuery('#floorplan').attr('src', url);

        if (attachment.anhangtitel != null) {
            jQuery('#floorplanCaption').html(attachment.anhangtitel);
        }
    }
};


immobrowse.slideshow.initGalleries = function () {
    immobrowse.slideshow.titleImageGallery = new immobrowse.gallery.Gallery(immobrowse.expose.realEstate.images());
    immobrowse.slideshow.floorplanGallery = new immobrowse.gallery.Gallery(immobrowse.expose.realEstate.floorplans());
    immobrowse.slideshow.renderTitleImage(immobrowse.slideshow.titleImageGallery.element());
    immobrowse.slideshow.renderFloorplan(immobrowse.slideshow.floorplanGallery.element());
};
