/*
    gallery.js - ImmoBrowse Expose gallery.

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
immobrowse.gallery = {};


immobrowse.gallery.Gallery = function (elements, startIndex) {
    this.elements = elements;

    if (startIndex == null) {
        this.index = 0;
    } else {
        if (startIndex >= elements.length) {
            throw 'Index out of bounds: ' + startIndex + '/' + elements.length - 1;
        } else {
            this.index = startIndex;
        }
    }

    this.element = function (index) {
        if (index == null) {
            index = this.index;
        }

        return this.elements[index];
    };

    this.next = function () {
        this.index += 1;

        if (this.index >= this.elements.length) {
            this.index = 0;
        }

        return this.element();
    };

    this.previous = function () {
        this.index -= 1;

        if (this.index < 0) {
            this.index = this.elements.length - 1;
        }

        return this.element();
    };
};
