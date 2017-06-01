/*
  Customer's individual ImmoBrowse configuration
*/

immobrowse.config = {
  types: ['WOHNUNG'],
  marketing: ['MIETE_PACHT'],
  shortFloorNames: true,
  exposeURLCallback: function (customer, objectId) {
    var options = {
      option: 'com_immobrowse',
      view: 'expose',
      customer: customer,
      objectId: objectId
    };

    return window.location.href.split('?')[0] + homeinfo.queryString(homeinfo.queryArgs(options));
  }
};
