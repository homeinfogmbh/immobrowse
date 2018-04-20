/*
  Customer's individual ImmoBrowse configuration.
*/
'use strict';

var immobrowse = immobrowse || {};

immobrowse.config = {
    types: ['WOHNUNG'],
    marketing: ['MIETE_PACHT'],
    shortFloorNames: true,
    exposeURLCallback: function (objectId) {
        var options = {
            option: 'com_immobrowse',
            view: 'expose',
            objectId: objectId,
            backlink: encodeURIComponent(window.location.href)
        };

        return window.location.href.split('?')[0] + homeinfo.queryString(homeinfo.queryArgs(options));
    }
};
