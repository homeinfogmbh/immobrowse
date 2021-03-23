/*
  Customer's individual ImmoBrowse configuration.
*/

var immobrowse = immobrowse ||  {};
immobrowse.config = immobrowse.config || {};
immobrowse.config.types = ['WOHNUNG'];
immobrowse.config.marketing = ['MIETE_PACHT'];
immobrowse.config.shortFloorNames = true;
immobrowse.config.exposeURLCallback = objectId => '?real_estate=' + objectId;
immobrowse.config.addressInList = true;
