<div class="container homeinfo">
  <div class="row row-centered ib-header">
    <div class="col-md-3">
      <div class="item">
        <div class="content">
          <input id="ib-price-min" class="form-control ib-btn-filter-option" type="number" placeholder="Preis von">
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="item">
        <div class="content">
          <input id="ib-price-max" class="form-control ib-btn-filter-option" type="number" placeholder="Preis bis">
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="item">
        <div class="content">
          <input id="ib-area-min" class="form-control ib-btn-filter-option" type="number" placeholder="Größe ab in m²">
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="item">
        <div class="content">
          <input id="ib-rooms-min" class="form-control ib-btn-filter-option" type="number" placeholder="Zimmer ab">
        </div>
      </div>
    </div>
  </div>
  
  <div class="row row-centered ib-header" style="margin-top:-15px">
    <div class="col-md-6 col-centered">
      <div class="item">
        <div class="content">
          <button id="ib-sort-rooms" onclick="immobrowse.wordpress.toggleSorting('rooms');" class="btn btn-primary ib-btn-sort">Zimmer</button>
          <button id="ib-sort-area" onclick="immobrowse.wordpress.toggleSorting('area');" class="btn btn-primary ib-btn-sort">Fl&auml;che</button>
          <button id="ib-sort-rent" onclick="immobrowse.wordpress.toggleSorting('rent');" class="btn btn-primary ib-btn-sort">Miete</button>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="item">
        <div class="content" style="text-align:right">
          <button id="ib-extsearch-button" class="btn btn-default">Erweitert</button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="row row-centered">
    <div id="extendedSearch" class="ib-extsearch" style="display: none;">
      <div class="container">
        <div class="row row-centered">
          <div class="col-xs-6 col-centered">
            <label><strong>Austattung</strong></label><br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-kitchen" onclick="immobrowse.wordpress.list();"> Einbauküche (EBK)<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-bathtub" onclick="immobrowse.wordpress.list();"> Badewanne<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-window" onclick="immobrowse.wordpress.list();"> Fenster im Bad<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-balcony" onclick="immobrowse.wordpress.list();"> Balkon<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-carspace" onclick="immobrowse.wordpress.list();"> Stellplatz<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-guestwc" onclick="immobrowse.wordpress.list();"> Gäste-WC<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-elevator" onclick="immobrowse.wordpress.list();"> Fahrstuhl<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-garden" onclick="immobrowse.wordpress.list();"> Gartennutzung<br>
          </div>
          <div class="col-xs-6 col-centered">
            <label><strong>Stadtteile</strong></label><br>
            <div id="ib-districts"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row row-centered">
    <div id="list"></div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>
