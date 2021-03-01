<div class="w3-container">
  <div id="header" class="w3-row ib-header no-print">
    <div class="w3-col m4 ib-centered">
      <button id="back" type="button" class="w3-btn">
        « Zur&uuml;ck
      </button>
    </div>
    <div class="w3-col m4">
      <div class="ib-detail-print ib-centered">
        <button type="button" class="w3-btn w3-blue" onclick="print();">
          Drucken
        </button>
      </div>
    </div>
    <div class="w3-col m4">
      <div class="ib-detail-contactform ib-centered">
        <button id="btnContactForm" type="button" class="w3-btn w3-green">
          Kontaktformular
        </button>
      </div>
    </div>
  </div>
  <div class="w3-row ib-header">
    <div id="objectTitle" class="w3-col m8 ib-title">
      Objekttitel
    </div>
    <div class="w3-col m4 ib-id">
      Objektnr: <span id="objectId"></span>
    </div>
  </div>
  <div class="w3-row">
    <div id="expose" class="w3-col m12 ib-expose">
      <div class="w3-row">
        <div class="w3-col s6">
          <div class="thumbnail">
            <div id="titleImageFrame" class="ib-image-frame">
              <img src="img/dummy.jpg" id="titleImage" alt="Titelbild" class="ib-framed-image">
            </div>
            <div id="titleImageCaption" class="caption">
              Titelbild
            </div>
          </div>
        </div>
        <div class="w3-col s6">
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
      <div class="w3-row ib-expose-data-row">
        <div class="w3-col m12 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Objektbeschreibung
          </div>
          <div id="description" class="w3-row ib-justified"></div>
        </div>
      </div>
      <div class="w3-row ib-expose-data-row">
        <div class="w3-col m12 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Lagebeschreibung
          </div>
          <div id="exposure" class="w3-row ib-justified"></div>
        </div>
      </div>
      <div class="w3-row ib-expose-data-row">
        <div class="w3-col m12 ib-expose-data-col">
          <div class="w3-row ib-section-caption">
            Sonstiges
          </div>
          <div id="miscellanea" class="w3-row ib-justified"></div>
        </div>
      </div>
      <div class="w3-row ib-expose-data-row">
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
          <div class="w3-row">
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
          <div class="w3-row">
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

<div id="contactForm" class="w3-container">
  <h4>Kontaktformular für Objekt Nr. <span id="object_id"></span></h4>
  <div class="row" id="the_form" style="margin-top:10px;">
    <div class="w3-col m12">
     <p><strong>Anrede</strong></p>
       <div class="btn-group" data-toggle="buttons">
         <input type="radio" class="w3-radio" name="gender" id="gender_female" value="0">
         <label>Frau</label>
         <input type="radio" class="w3-radio" name="gender" id="gender_male" value="1">
         <label>Herr</label>
         <input type="radio" class="w3-radio" name="gender" id="gender_diverse" value="2">
         <label>Divers</label>
       </div>
    </div>
    <div class="w3-col m6">
      <input type="text" class="w3-input" id="forename" placeholder="Vorname*">
    </div>
    <div class="w3-col m6">
      <input type="text" class="w3-input" id="surname" placeholder="Nachname*">
    </div>
    <div class="w3-col m6">
      <input type="email" class="w3-input" id="email" placeholder="E-Mail-Adresse*">
    </div>
    <div class="w3-col m6">
      <input type="text" class="w3-input" id="phone" placeholder="Telefon">
    </div>
    <div class="w3-col m8">
      <input type="text" class="w3-input" id="street" placeholder="Straße">
    </div>
    <div class="w3-col m4">
      <input type="text" class="w3-input" id="house_number" placeholder="Haus-Nr.">
    </div>
    <div class="w3-col m3">
      <input type="text" class="w3-input" id="zip_code" placeholder="PLZ">
    </div>
    <div class="w3-col m9">
      <input type="text" class="w3-input" id="city" placeholder="Ort">
    </div>
    <div class="w3-col m12">
      <textarea class="w3-input" rows="5" id="message"></textarea>
    </div>
    <div class="w3-col m12" style="color:#979696; font-size:10px;">
      Mit einem (*) gekennzeichnete Felder sind Pflichfelder
    </div>
    <div class="w3-col m12" style="margin-top:20px;">
      <div class="g-recaptcha" data-sitekey="[RECAPTCHA]"></div>
    </div>
  </div>
  <hr>
  <div class="w3-row" id="contact_form_response" style="display:none;">
    <hr>
    <div class="w3-col m2">
      <i class="fa fa-check fa-4x" style="color:#5cb85c; margin-top:12px;"></i>
    </div>
    <div class="w3-col m9">
      <h3>VIELEN DANK!<br>Ihre Anfrage wurde erfolgreich versandt.</h3>
    </div>
  </div>
  <div class="w3-row">
    <input id="clearContactForm" type="button" class="w3-btn w3-red" value="Zurücksetzen">
    <input id="submitContactForm" type="button" class="w3-btn w3-green" value="Anfrage senden">
    <img src="img/preloader.gif" id="loading" style="display:none;">
    <span class="glyphicon glyphicon-ok-sign" id="done" style="color:#2CCB2F; display:none;"></span>
  </div>
</div>

<div id="gallery" class="w3-container">
  <div class="w3-row">
    <div class="w3-col m2 w3-left">
      &nbsp;
    </div>
    <div class="w3-col m8 w3-center">
      <h4 id="galleryTitle" class="w3-center"></h4>
    </div>
    <div class="w3-col m2 w3-right">
      <button id="btnCloseGallery" type="button" class="w3-btn w3-red w3-right">&times;</button>
    </div>
  </div>
  <div class="ib-gallery-image-container">
     <img id="galleryImage" class="w3-image" style="width:75%">
  </div>
  <div class="w3-row">
    <div class="w3-col m4 w3-center">
      <span id="galleryPrevious" class="ib-gallery-scroll-button">←</span>
    </div>
    <div class="w3-col m4 w3-center">
      <span id="galleryIndex"></span>
        /
      <span id="galleryImages"></span>
    </div>
    <div class="w3-col m4 w3-center">
      <span id="galleryNext" class="ib-gallery-scroll-button">→</span>
    </div>
  </div>
  <div class="w3-row w3-center">
    <small>Tipp: Benutzen Sie die Pfeiltasten zum Navigieren.</small>
  </div>
</div>
