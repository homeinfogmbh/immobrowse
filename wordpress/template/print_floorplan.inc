<div class="container">
  <div id="header" class="row row-centered ib-header">
    <div id="objectTitle" class="col-md-5 col-centered ib-title">
      Objekttitel
    </div>
    <div id="objectId" class="col-md-4 col-centered ib-id">
      Objekt ID
    </div>
    <div class="col-md-3 col-centered no-print">
      <div class="ib-detail-print ib-centered">
        <button type="button" class="btn btn-info" onclick="print(); close();">
          Drucken
        </button>
      </div>
    </div>
  </div>
  <div class="row row-centered ib-header">
    <div id="objectAddress" class="col-md-12 col-centered ib-address">
      Objekt Adresse
    </div>
  </div>
  <div class="row row-centered">
    <div id="expose" class="col-md-12 ib-expose">
      <div class="row row-centered">
        <div class="col-sm-12">
          <div class="thumbnail">
            <div id="floorplanFrame" class="ib-image-frame">
              <img src="[BASEDIR]img/dummy.jpg" id="floorplan" alt="Grundriss" class="ib-framed-image">
            </div>
            <div id="floorplanCaption" class="caption">
              Grundriss
            </div>
          </div>
        </div>
      </div>
      <div id="contactInformation" class="row row-centered ib-expose-data-row">
        <div class="col-md-6 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Kontakt
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Name
            </div>
            <div id="contactName" class="col-xs-6"></div>
          </div>
          <div id="contactCompanyContainer" class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Firma
            </div>
            <div id="contactCompany" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Adresse
            </div>
            <div id="contactAddress" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Telefon
            </div>
            <div id="contactPhone" class="col-xs-6"></div>
          </div>
          <div id="contactWebsiteContainer" class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Website
            </div>
            <div id="contactWebsite" class="col-xs-6"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>
