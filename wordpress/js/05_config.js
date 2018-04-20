/*
  Customer's individual ImmoBrowse configuration.
*/

var immobrowse = immobrowse ||  {};
immobrowse.config = {
    types: ['WOHNUNG'],
    marketing: ['MIETE_PACHT'],
    shortFloorNames: true,
    exposeURLCallback: function (objectId) {
        return '?real_estate=' + objectId;
    }
};
