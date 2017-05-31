<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

$json = file_get_contents('https://tls.homeinfo.de/immobrowse/list/' . $this->cid);
$real_estates = json_decode($json)
}
?>
<h1>Customer: <?php echo($this->cid) ?></h1>
<h2>Real estates: <?php print_r($real_estates) ?></h2>
<div class="container">
  <div class="row row-centered ib-header">
    <div class="col-md-3 col-centered">
      <div class="item">
        <div class="content">
          <button id="ib-sort-rooms" onclick="toggleSorting('rooms');" class="btn btn-primary ib-btn-sort">Zimmer</button>
          <button id="ib-sort-area" onclick="toggleSorting('area');" class="btn btn-primary ib-btn-sort">Fl&auml;che</button>
          <button id="ib-sort-rent" onclick="toggleSorting('rent');" class="btn btn-primary ib-btn-sort">Miete</button>
        </div>
      </div>
    </div>
    <div class="col-md-2">
      <div class="item">
        <div class="content">
          <input id="ib-price-min" class="form-control ib-btn-filter-option" type="number" placeholder="Preis von">
        </div>
      </div>
    </div>
    <div class="col-md-2">
      <div class="item">
        <div class="content">
          <input id="ib-price-max" class="form-control ib-btn-filter-option" type="number" placeholder="Preis bis">
        </div>
      </div>
    </div>
    <div class="col-md-2">
      <div class="item">
        <div class="content">
          <input id="ib-area-min" class="form-control ib-btn-filter-option" type="number" placeholder="Größe ab in m²">
        </div>
      </div>
    </div>
    <div class="col-md-2">
      <div class="item">
        <div class="content">
          <input id="ib-rooms-min" class="form-control ib-btn-filter-option" type="number" placeholder="Zimmer ab">
        </div>
      </div>
    </div>
    <div class="col-md-1">
      <div class="item">
        <div class="content">
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
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-kitchen" onclick="filter();"> Einbauküche (EBK)<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-bathtub" onclick="filter();"> Badewanne<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-window" onclick="filter();"> Fenster im Bad<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-balcony" onclick="filter();"> Balkon<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-carspace" onclick="filter();"> Stellplatz<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-guestwc" onclick="filter();"> Gäste-WC<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-elevator" onclick="filter();"> Fahrstuhl<br>
            <input type="checkbox" class="ib-filter-amenities-option" id="ib-filter-garden" onclick="filter();"> Gartennutzung<br>
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
    <div id="templateContainer" class="ib-template-container">
      <div id="entry" class="container ib-preview-item">
        <div class="row row-centered ib-preview-container">
          <div class="col-md-4">
            <div class="ib-image-frame">
              <img src='img/dummy.jpg' id="titleImage" class="ib-framed-image" alt="Titelbild">
            </div>
          </div>
          <div class="col-md-8">
            <div class="row row-centered">
              <div id="objectTitle" class="ib-preview-title"></div>
            </div>
            <div class="row row-centered ib-preview-data">
              <div class="col-xs-3">
                <div class="row">
                  <div class="ib-preview-data-caption">Kaltmiete</div>
                </div>
                <div class="row">
                  <div id="coldRent"></div>
                </div>
              </div>
              <div class="col-xs-4">
                <div class="row">
                  <div class="ib-preview-data-caption">Nebenkosten</div>
                </div>
                <div class="row">
                  <div id="serviceCharge"></div>
                </div>
              </div>
              <div class="col-xs-2">
                <div class="row">
                  <div class="ib-preview-data-caption">Zimmer</div>
                </div>
                <div class="row">
                  <div id="rooms"></div>
                </div>
              </div>
              <div class="col-xs-3">
                <div class="row">
                  <div class="ib-preview-data-caption">Fläche</div>
                </div>
                <div class="row">
                  <div id="livingArea"></div>
                </div>
              </div>
            </div>
            <div id="amenitiesTags" class="ib-preview-tags"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="list"></div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>
