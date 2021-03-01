/*
  Customer's individual ImmoBrowse configuration.
*/


export function configure (config) {
    config.types = ['WOHNUNG'];
    config.marketing = ['MIETE_PACHT'];
    config.shortFloorNames = true;
    config.exposeURLCallback = objectId => {
        const url = new URL(window.location);
        url.searchParams.append('real_estate', objectId);
        return url.toString();
    }
    config.addressInList = true;
}
