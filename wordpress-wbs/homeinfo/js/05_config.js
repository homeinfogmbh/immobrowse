/*
  Customer's individual ImmoBrowse configuration.

  (C) 2017-2021 HOMEINFO - Digitale Informationssysteme GmbH

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
*/

var immobrowse = immobrowse ||  {};
immobrowse.config = immobrowse.config || {};
immobrowse.config.types = ['WOHNUNG'];
immobrowse.config.marketing = ['MIETE_PACHT'];
immobrowse.config.shortFloorNames = true;
immobrowse.config.exposeURLCallback = objectId => '?real_estate=' + objectId;
immobrowse.config.addressInList = true;
