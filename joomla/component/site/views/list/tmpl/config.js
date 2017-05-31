/*
  Customer's individual ImmoBrowse configuration
*/

immobrowse.config = {
  types: ['WOHNUNG'],
  marketing: ['MIETE_PACHT'],
  shortFloorNames: true,
  exposeURLCallback: function (cid, objectId) {
    return window.location.href.split('?')[0] + '?option=com_immobrowse&view=expose&cid=' + cid + '&objectId=' + objectId;
  }
};
