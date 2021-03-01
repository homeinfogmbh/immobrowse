<div class="w3-container">
  <div class="w3-row ib-header">
    <div class="w3-col m3">
      <button id="ib-sort-rooms" class="w3-btn ib-btn-sort">Zimmer</button>
      <button id="ib-sort-area" class="w3-btn ib-btn-sort">Fl&auml;che</button>
      <button id="ib-sort-rent" class="w3-btn ib-btn-sort">Miete</button>
    </div>
    <div class="w3-col m2">
      <input id="ib-price-min" class="w3-input ib-btn-filter-option" type="number" placeholder="Preis von">
    </div>
    <div class="w3-col m2">
      <input id="ib-price-max" class="w3-input ib-btn-filter-option" type="number" placeholder="Preis bis">
    </div>
    <div class="w3-col m2">
      <input id="ib-area-min" class="w3-input ib-btn-filter-option" type="number" placeholder="Größe ab in m²">
    </div>
    <div class="w3-col m2">
      <input id="ib-rooms-min" class="w3-input ib-btn-filter-option" type="number" placeholder="Zimmer ab">
    </div>
    <div class="col-md-1">
      <button id="ib-extsearch-button" class="w3-btn">Erweitert</button>
    </div>
  </div>
  <div class="w3-row">
    <div id="extendedSearch" class="ib-extsearch" style="display: none;">
      <div class="w3-container">
        <div class="w3-row">
          <div class="w3-col s6">
            <label><strong>Austattung</strong></label><br>
            <input id="ib-filter-kitchen" type="checkbox" class="w3-check ib-filter-amenities-option"> Einbauküche (EBK)<br>
            <input id="ib-filter-bathtub" type="checkbox" class="w3-check ib-filter-amenities-option"> Badewanne<br>
            <input id="ib-filter-window" type="checkbox" class="w3-check ib-filter-amenities-option"> Fenster im Bad<br>
            <input id="ib-filter-balcony" type="checkbox" class="w3-check ib-filter-amenities-option"> Balkon<br>
            <input id="ib-filter-carspace" type="checkbox" class="w3-check ib-filter-amenities-option"> Stellplatz<br>
            <input id="ib-filter-guestwc" type="checkbox" class="w3-check ib-filter-amenities-option"> Gäste-WC<br>
            <input id="ib-filter-elevator" type="checkbox" class="w3-check ib-filter-amenities-option"> Fahrstuhl<br>
            <input id="ib-filter-garden" type="checkbox" class="w3-check ib-filter-amenities-option"> Gartennutzung<br>
          </div>
          <div class="w3-col s6">
            <label><strong>Stadtteile</strong></label><br>
            <div id="ib-districts"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="w3-row">
    <div id="list"></div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>
