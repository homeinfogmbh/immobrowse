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
        <div class="col-sm-6">
          <div class="thumbnail">
            <div id="titleImageFrame" class="ib-image-frame">
              <img src="img/dummy.jpg" id="titleImage" alt="Titelbild" class="ib-framed-image">
            </div>
            <div id="titleImageCaption" class="caption">
              Titelbild
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="thumbnail">
            <div id="floorplanFrame" class="ib-image-frame">
              <img src="img/dummy.jpg" id="floorplan" alt="Grundriss" class="ib-framed-image">
            </div>
            <div id="floorplanCaption" class="caption">
              Grundriss
            </div>
          </div>
        </div>
      </div>
      <div class="row row-centered ib-expose-data-row">
        <div class="col-md-6 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Preise
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Kaltmiete
            </div>
            <div id="coldRent" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Nebenkosten
            </div>
            <div id="serviceCharge" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Kaution / Genoss.-Ant.
            </div>
            <div id="securityDeposit" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Heizkosten in NK enthalten?
            </div>
            <div id="heatingCostsInServiceCharge" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Heizkosten
            </div>
            <div id="heatingCosts" class="col-xs-6"></div>
          </div>
        </div>
        <div class="col-md-6 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Zustand und Ausstattung
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Verfügbar ab
            </div>
            <div id="availableFrom" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Wohnfläche
            </div>
            <div id="livingArea" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Zimmer
            </div>
            <div id="rooms" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Etage
            </div>
            <div id="floor" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Baujahr
            </div>
            <div id="constructionYear" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Zustand
            </div>
            <div id="state" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Letzte Modernisierung
            </div>
            <div id="lastModernization" class="col-xs-6"></div>
          </div>
        </div>
      </div>
      <div class="row row-centered ib-expose-data-row">
        <div class="col-md-6 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Energieausweis
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Ausweisart
            </div>
            <div id="energyCertificateType" class="col-xs-6"></div>
          </div>
          <div id="energyConsumptionContainer" class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Endenergieverbrauch
            </div>
            <div id="energyConsumption" class="col-xs-6"></div>
          </div>
          <div id="energyDemandContainer" class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Endenergiebedarf
            </div>
            <div id="energyDemand" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Primärenergieträger
            </div>
            <div id="primaryEnergyCarrier" class="col-xs-6"></div>
          </div>
          <div class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Wertklasse
            </div>
            <div id="valueClass" class="col-xs-6"></div>
          </div>
        </div>
        <div class="col-md-6 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Ausstattung
          </div>
          <div id="amenitiesList" class="row row-centered"></div>
        </div>
      </div>
      <div id="descriptionContainer" class="row row-centered ib-expose-data-row">
        <div class="col-md-12 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Objektbeschreibung
          </div>
          <div id="description" class="row row-centered ib-justified"></div>
        </div>
      </div>
      <div id="exposureContainer" class="row row-centered ib-expose-data-row">
        <div class="col-md-12 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Lagebeschreibung
          </div>
          <div id="exposure" class="row row-centered ib-justified"></div>
        </div>
      </div>
      <div id="miscellaneaContainer" class="row row-centered ib-expose-data-row">
        <div class="col-md-12 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Sonstiges
          </div>
          <div id="miscellanea" class="row row-centered ib-justified"></div>
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
