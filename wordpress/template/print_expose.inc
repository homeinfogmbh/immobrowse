<div class="container">
  <div id="header" class="w3-row ib-header">
    <div id="objectTitle" class="w3-col m5 col-centered ib-title">
      Objekttitel
    </div>
    <div id="objectId" class="w3-col m4 col-centered ib-id">
      Objekt ID
    </div>
    <div class="w3-col m3 col-centered no-print">
      <div class="ib-detail-print ib-centered">
        <button type="button" class="btn btn-info" onclick="print(); close();">
          Drucken
        </button>
      </div>
    </div>
  </div>
  <div class="w3-row ib-header">
    <div id="objectAddress" class="w3-col m12 col-centered ib-address">
      Objekt Adresse
    </div>
  </div>
  <div class="w3-row">
    <div id="expose" class="w3-col m12 ib-expose">
      <div class="w3-row">
        <div class="col-sm-6">
          <div class="thumbnail">
            <div id="titleImageFrame" class="ib-image-frame">
              <img src="[BASEDIR]img/dummy.jpg" id="titleImage" alt="Titelbild" class="ib-framed-image">
            </div>
            <div id="titleImageCaption" class="caption">
              Titelbild
            </div>
          </div>
        </div>
        <div class="col-sm-6">
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
      <div class="w3-row ib-expose-data-row">
        <div class="w3-col m6 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Preise
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Kaltmiete
            </div>
            <div id="coldRent" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Nebenkosten
            </div>
            <div id="serviceCharge" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Kaution / Genoss.-Ant.
            </div>
            <div id="securityDeposit" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Heizkosten in NK enthalten?
            </div>
            <div id="heatingCostsInServiceCharge" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Heizkosten
            </div>
            <div id="heatingCosts" class="w3-col s6"></div>
          </div>
        </div>
        <div class="w3-col m6 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Zustand und Ausstattung
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Verfügbar ab
            </div>
            <div id="availableFrom" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Wohnfläche
            </div>
            <div id="livingArea" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Zimmer
            </div>
            <div id="rooms" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Etage
            </div>
            <div id="floor" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Baujahr
            </div>
            <div id="constructionYear" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Zustand
            </div>
            <div id="state" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Letzte Modernisierung
            </div>
            <div id="lastModernization" class="w3-col s6"></div>
          </div>
        </div>
      </div>
      <div class="w3-row ib-expose-data-row">
        <div class="w3-col m6 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Energieausweis
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Ausweisart
            </div>
            <div id="energyCertificateType" class="w3-col s6"></div>
          </div>
          <div id="energyConsumptionContainer" class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Endenergieverbrauch
            </div>
            <div id="energyConsumption" class="w3-col s6"></div>
          </div>
          <div id="energyDemandContainer" class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Endenergiebedarf
            </div>
            <div id="energyDemand" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Primärenergieträger
            </div>
            <div id="primaryEnergyCarrier" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Wertklasse
            </div>
            <div id="valueClass" class="w3-col s6"></div>
          </div>
        </div>
        <div class="w3-col m6 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Ausstattung
          </div>
          <div id="amenitiesList" class="w3-row"></div>
        </div>
      </div>
      <div id="descriptionContainer" class="w3-row ib-expose-data-row">
        <div class="w3-col m12 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Objektbeschreibung
          </div>
          <div id="description" class="w3-row ib-justified"></div>
        </div>
      </div>
      <div id="exposureContainer" class="w3-row ib-expose-data-row">
        <div class="w3-col m12 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Lagebeschreibung
          </div>
          <div id="exposure" class="w3-row ib-justified"></div>
        </div>
      </div>
      <div id="miscellaneaContainer" class="w3-row ib-expose-data-row">
        <div class="w3-col m12 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Sonstiges
          </div>
          <div id="miscellanea" class="w3-row ib-justified"></div>
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
