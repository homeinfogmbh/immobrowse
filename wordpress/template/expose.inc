<div class="container">
  <div id="header" class="w3-row ib-header no-print">
    <div id="objectTitle" class="w3-col m6 ib-title">
      Objekttitel
    </div>
    <div id="objectId" class="w3-col m6 ib-id">
      Objekt ID
    </div>
  </div>
  <div class="w3-row ib-header no-print">
    <div id="objectAddress" class="w3-col m12 ib-address">
      Objekt Adresse
    </div>
  </div>
  <div class="w3-row ib-header no-print">
    <div class="w3-col m4 ib-centered">
      <button type="button" class="w3-button w3-green" onclick="immobrowse.wordpress.back();">
        « Zur&uuml;ck
      </button>
    </div>
    <div class="w3-col m4">
      <div class="ib-detail-print ib-centered">
        <button type="button" class="w3-button w3-blue" onclick="immobrowse.wordpress.printExpose();">
          Expose drucken
        </button>
      </div>
    </div>
    <div class="w3-col m4">
      <div class="ib-detail-print ib-centered">
        <button type="button" class="w3-button w3-blue" onclick="immobrowse.wordpress.printGrundriss();">
          Grundriss drucken
        </button>
      </div>
    </div>
  </div>
  <div class="w3-row">
    <div id="expose" class="w3-col m12 ib-expose">
      <div class="w3-row">
        <div class="w3-col s12">
          <div class="thumbnail">
            <div id="titleImageFrame" class="ib-image-frame">
              <img src="[BASEDIR]img/dummy.jpg" id="titleImage" alt="Titelbild" class="ib-framed-image">
            </div>

            <div id="titleImageCaption" class="w3-center">
              Titelbild
            </div>

            <div id="furtherImages" class="ib-further-images"></div>
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
              Endenergie-<br />verbrauch
            </div>
            <div id="energyConsumption" class="w3-col s6"></div>
          </div>
          <div id="energyDemandContainer" class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Endenergie-<br />bedarf
            </div>
            <div id="energyDemand" class="w3-col s6"></div>
          </div>
          <div class="w3-row">
            <div class="w3-col s6 ib-price-caption">
              Primär-<br />energie-<br />träger
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
        <div class="w3-col m12 ib-expose-data-col">
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

<!-- Modal -->
<div id="contactForm" class="modal fade" role="dialog">
  <div class="w3-modal">
    <div class="w3-modal-content">
      <div class="w3-container">
        <div class="w3-row" id="the_form" style="margin-top:10px;">
          <div class="w3-col m6">
           <p><strong>Anrede</strong></p>
             <div class="btn-group" data-toggle="buttons">
               <label class="btn btn-default">
                 <input type="radio" name="salutation" value="1">Herr
               </label>
               <label class="btn btn-default">
                 <input type="radio" name="salutation" value="0">Frau
               </label>
             </div>
          </div>
          <div class="w3-col m6" id="contact_form_object_nr">
            <p><strong>Objektnummer</strong></p>
            <input type="text" class="form-control" id="object_id" disabled>
          </div>
          <div class="w3-row">
            <div class="w3-col m12">&nbsp;</div>
          </div>
          <div class="w3-col m6">
            <div class="form-group">
              <label for="forename">Vorname</label>
              <input type="text" class="form-control" id="forename" placeholder="Vorname*">
            </div>
          </div>
          <div class="w3-col m6">
            <div class="form-group">
              <label for="surname">Nachname</label>
              <input type="text" class="form-control" id="surname" placeholder="Nachname*">
            </div>
          </div>
          <div class="w3-col m6">
            <div class="form-group">
              <label for="email">E-Mail Adresse</label>
              <input type="email" class="form-control" id="email" placeholder="E-Mail-Adresse*">
            </div>
          </div>
          <div class="w3-col m6">
            <div class="form-group">
              <label for="phone">Telefon</label>
              <input type="text" class="form-control" id="phone" placeholder="Telefon">
            </div>
          </div>
          <div class="w3-col m8">
            <div class="form-group">
              <label for="street">Straße</label>
              <input type="text" class="form-control" id="street" placeholder="Straße">
            </div>
          </div>
          <div class="w3-col m4">
            <div class="form-group">
              <label for="house_number">Haus-Nr.</label>
              <input type="text" class="form-control" id="house_number" placeholder="Haus-Nr.">
            </div>
          </div>
          <div class="w3-col m3">
            <div class="form-group">
              <label for="zip_code">PLZ</label>
              <input type="text" class="form-control" id="zip_code" placeholder="PLZ">
            </div>
          </div>
          <div class="w3-col m9">
            <div class="form-group">
              <label for="city">Ort</label>
              <input type="text" class="form-control" id="city" placeholder="Ort">
            </div>
          </div>
          <div class="w3-col m12">
            <textarea class="form-control" rows="5" id="message" placeholder="Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.">Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.</textarea>
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
      </div>
      <div class="modal-footer" style="visible:false;">
        <input type="button" class="btn btn-default" id="clear_form" value="Zurücksetzen">
        <input type="button" class="btn btn-success" id="send_form" value="Anfrage senden">
        <img src="[BASEDIR]img/preloader.gif" id="loading" style="display:none;">
        <span class="glyphicon glyphicon-ok-sign" id="done" style="color:#2CCB2F; display:none;"></span>
      </div>
    </div>
  </div>
</div>
