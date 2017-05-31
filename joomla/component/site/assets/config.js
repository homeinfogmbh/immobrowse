/*
  Customer's individual ImmoBrowse configuration
*/

immobrowse.config = {
  types: ['WOHNUNG'],
  marketing: ['MIETE_PACHT'],
  shortFloorNames: true,
  exposeURLCallback: function (customer, objectId) {
    return window.location.href.split('?')[0] + '?option=com_immobrowse&view=expose&customer=' + customer + '&objectId=' + objectId;
  }
};
