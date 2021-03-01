/*
  Customer's individual ImmoBrowse configuration.
*/


export function configure (config) {
    config.types = ['WOHNUNG'];
    config.marketing = ['MIETE_PACHT'];
    config.shortFloorNames = true;
    config.exposeURLCallback = objectId => '?real_estate=' + objectId;
    config.addressInList = true;
}
