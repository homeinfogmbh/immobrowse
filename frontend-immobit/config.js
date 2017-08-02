/*
  Customer's individual ImmoBrowse configuration
*/
immobrowse.config = {
  types: ['WOHNUNG'],
  marketing: ['MIETE_PACHT'],
  shortFloorNames: true,
  exposeURLCallback: function (objectId) {
    return 'expose.html?real_estate=' + objectId + '&customer=' + customer;
  }
};
