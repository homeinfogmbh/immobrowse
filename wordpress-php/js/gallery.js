/*
  gallery.js - ImmoBrowse image gallery

  (C) 2017-2020 HOMEINFO - Digitale Informationssysteme GmbH

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
      * immobrowse.js
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.wordpress = immobrowse.wordpress || {};
immobrowse.wordpress.gallery = immobrowse.wordpress.gallery || {};


immobrowse.wordpress.gallery.next = function (gallery) {
    gallery.next();
};


immobrowse.wordpress.gallery.previous = function (gallery) {
    gallery.previous();
};


immobrowse.wordpress.gallery.nextCallback = function (gallery) {
    return function () {
        gallery.next();
    };
};


immobrowse.wordpress.gallery.previousCallback = function (gallery) {
    return function () {
        gallery.previous();
    };
};


immobrowse.wordpress.gallery.Gallery = class {
    constructor (images, mapping, urlCallback) {
        this.images = images;
        this.mapping = mapping;
        this.urlCallback = urlCallback;
        this.index = 0;
    }

    next () {
        this.index++;

        if (this.index >= this.images.length) {
            this.index = 0;
        }

        this.render();
    }

    previous () {
        this.index--;

        if (this.index < 0) {
            this.index = this.images.length - 1;
        }

        this.render();
    }

    bind () {
        this.mapping.next.unbind('click');
        this.mapping.next.click(immobrowse.wordpress.gallery.nextCallback(this));
        this.mapping.previous.unbind('click');
        this.mapping.previous.click(immobrowse.wordpress.gallery.previousCallback(this));
    }

    render () {
        this.mapping.image.attr('src', this.urlCallback(this.images[this.index]));
        this.mapping.title.html(this.images[this.index].anhangtitel);
        this.mapping.index.html(this.index + 1);
        this.mapping.count.html(this.images.length);
    }
};
