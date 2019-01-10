/*
  Customer's individual ImmoBrowse configuration
*/
'use strict';

var immobrowse = immobrowse || {};
immobrowse.config = immobrowse.config || {};
immobrowse.config['types'] = ['WOHNUNG'];
immobrowse.config['marketing'] = ['MIETE_PACHT'];
immobrowse.config['shortFloorNames'] = true;
immobrowse.config['exposeURLCallback'] = function (objectId) {
    return 'expose.html?real_estate=' + objectId + '&customer=' + customer;
};
