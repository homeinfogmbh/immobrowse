/*
  Customer's individual ImmoBrowse configuration
*/

immobrowse.config = {
  types: ['WOHNUNG'],
  marketing: ['MIETE_PACHT'],
  shortFloorNames: true,
  exposeURLCallback: function (cid, objectId) {
    return window.location.href + '&objectId=' + objectId;
  }
};
