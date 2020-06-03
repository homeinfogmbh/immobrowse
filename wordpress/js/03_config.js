/*
  Customer's individual ImmoBrowse configuration.
*/

var immobrowse = immobrowse ||  {};
immobrowse.config = immobrowse.config || {};
immobrowse.config.types = ['WOHNUNG'];
immobrowse.config.marketing = ['MIETE_PACHT'];
immobrowse.config.shortFloorNames = true;
immobrowse.config.exposeURLCallback = function (objectId) {
    return '?real_estate=' + objectId;
};
immobrowse.config.addressInList = true;
