<div class="container">
  <div id="header" class="w3-row ib-header">
    <div id="objectTitle" class="w3-col m5 ib-title">
      Objekttitel
    </div>
    <div id="objectId" class="w3-col m4 ib-id">
      Objekt ID
    </div>
    <div class="w3-col m3 no-print">
      <div class="ib-detail-print ib-centered">
        <button type="button" class="btn btn-info" onclick="print(); close();">
          Drucken
        </button>
      </div>
    </div>
  </div>
  <div class="w3-row ib-header">
    <div id="objectAddress" class="w3-col m12 ib-address">
      Objekt Adresse
    </div>
  </div>
  <div class="w3-row">
    <div id="expose" class="w3-col m12 ib-expose">
      <div class="w3-row">
        <div class="w3-col s12">
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
      <div id="contactInformation" class="w3-row ib-expose-data-row">
        <div class="w3-col m6 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Kontakt
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Name
            </div>
            <div id="contactName" class="w3-col s6"></div>
          </div>
          <div id="contactCompanyContainer" class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Firma
            </div>
            <div id="contactCompany" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Adresse
            </div>
            <div id="contactAddress" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Telefon
            </div>
            <div id="contactPhone" class="w3-col s6"></div>
          </div>
          <div id="contactWebsiteContainer" class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Website
            </div>
            <div id="contactWebsite" class="w3-col s6"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>
