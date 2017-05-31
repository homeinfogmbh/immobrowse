<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

$document = JFactory::getDocument();

//$document->addStyleSheet('https://tls.homeinfo.de/libs/bootstrap/latest/css/bootstrap.min.css');
$document->addStyleSheet('https://tls.homeinfo.de/libs/sweetalert/dist/sweetalert.css');
$document->addStyleSheet(immobrowseAsset('immobrowse.css'));
$document->addStyleSheet(immobrowseAsset('gallery.css'));
$document->addStyleSheet(immobrowseAsset('expose.css'));

$document->addScript('https://tls.homeinfo.de/libs/jquery/jquery-latest.min.js');
$document->addScript('https://fonts.googleapis.com/icon?family=Material+Icons');
$document->addScript('https://tls.homeinfo.de/libs/sweetalert/dist/sweetalert.min.js');
$document->addScript('https://www.google.com/recaptcha/api.js');
$document->addScript('https://tls.homeinfo.de/jslibs/homeinfo.min.js');
$document->addScript('https://tls.homeinfo.de/jslibs/immobrowse.min.js');
$document->addScriptDeclaration('var customer = ' . $this->customer . ';');
$document->addScriptDeclaration('var objektnrExtern = "' . $this->objectId . '";');
$document->addScript(immobrowseAsset('config.js'));
$document->addScript(immobrowseAsset('gallery.js'));
$document->addScript(immobrowseAsset('expose.js'));
?>
<h1>Expose</h1>
<h2>Customer: <?php echo($this->customer); ?></h2>
<h2>Object Id: <?php echo($this->objectId); ?></h2>
<h2>Site Key: <?php echo($this->sitekey); ?></h2>
<div class="container">
  <div id="header" class="row row-centered ib-header">
    <div class="col-md-2 col-centered ib-centered">
      <button type="button" class="btn btn-default" onclick="back();">
        « Zur&uuml;ck
      </button>
    </div>
    <div id="objectTitle" class="col-md-5 col-centered ib-title">
      Objekttitel
    </div>
    <div id="objectId" class="col-md-2 col-centered ib-id">
      Objekt ID
    </div>
    <div class="col-md-1 col-centered">
      <div class="ib-detail-print ib-centered">
        <button type="button" class="btn btn-info" onclick="print();">
          Drucken
        </button>
      </div>
    </div>
    <div class="col-md-2 col-centered">
      <div class="ib-detail-contactform ib-centered">
        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#contactForm">
          Kontaktformular
        </button>
      </div>
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
          </div><div class="row row-centered">
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
      <div class="row row-centered ib-expose-data-row">
        <div class="col-md-12 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Objektbeschreibung
          </div>
          <div id="description" class="row row-centered ib-justified"></div>
        </div>
      </div>
      <div class="row row-centered ib-expose-data-row">
        <div class="col-md-12 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Lagebeschreibung
          </div>
          <div id="exposure" class="row row-centered ib-justified"></div>
        </div>
      </div>
      <div class="row row-centered ib-expose-data-row">
        <div class="col-md-12 ib-expose-data-col">
          <div class="row row-centered ib-section-caption">
            Sonstiges
          </div>
          <div id="miscellanea" class="row row-centered ib-justified"></div>
        </div>
      </div>
      <div class="row row-centered ib-expose-data-row">
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
          <div id="energyConsumptionContainer" class="row row-centered">
            <div class="col-xs-6 ib-price-caption">
              Firma
            </div>
            <div id="contactCompany" class="col-xs-6"></div>
          </div>
          <div id="energyDemandContainer" class="row row-centered">
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
          <div class="row row-centered">
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

<!-- Modal -->
<div id="contactForm" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Kontaktformular</h4>
      </div>
      <div class="modal-body">
        <div class="row" id="the_form" style="margin-top:10px;">
          <div class="col-md-6">
           <p><strong>Anrede</strong></p>
             <div class="btn-group" data-toggle="buttons">
               <label class="btn btn-default">
                 <input type="radio" name="gender" id="gender_male" value="1">Herr
               </label>
               <label class="btn btn-default">
                 <input type="radio" name="gender" id="gender_female" value="0">Frau
               </label>
             </div>
          </div>
          <div class="col-md-6" id="contact_form_object_nr">
            <p><strong>Objektnummer</strong></p>
            <input type="text" class="form-control" id="object_id" disabled>
          </div>
          <div class="row">
            <div class="col-md-12">&nbsp;</div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="forename">Vorname</label>
              <input type="text" class="form-control" id="forename" placeholder="Vorname*">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="surname">Nachname</label>
              <input type="text" class="form-control" id="surname" placeholder="Nachname*">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="email">E-Mail Adresse</label>
              <input type="email" class="form-control" id="email" placeholder="E-Mail-Adresse*">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="phone">Telefon</label>
              <input type="text" class="form-control" id="phone" placeholder="Telefon">
            </div>
          </div>
          <div class="col-md-8">
            <div class="form-group">
              <label for="street">Straße</label>
              <input type="text" class="form-control" id="street" placeholder="Straße">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="house_number">Haus-Nr.</label>
              <input type="text" class="form-control" id="house_number" placeholder="Haus-Nr.">
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="zip_code">PLZ</label>
              <input type="text" class="form-control" id="zip_code" placeholder="PLZ">
            </div>
          </div>
          <div class="col-md-9">
            <div class="form-group">
              <label for="city">Ort</label>
              <input type="text" class="form-control" id="city" placeholder="Ort">
            </div>
          </div>
          <div class="col-md-12">
            <textarea class="form-control" rows="5" id="message" placeholder="Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.">Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.</textarea>
          </div>
          <div class="col-md-12" style="color:#979696; font-size:10px;">
            Mit einem (*) gekennzeichnete Felder sind Pflichfelder
          </div>
          <div class="col-md-12" style="margin-top:20px;">
            <div class="g-recaptcha" data-sitekey="<?php echo($this->sitekey); ?>"></div>
          </div>
        </div>
        <hr>
        <div class="row" id="contact_form_response" style="display:none;">
          <hr>
          <div class="col-md-2">
            <i class="fa fa-check fa-4x" style="color:#5cb85c; margin-top:12px;"></i>
          </div>
          <div class="col-md-9">
            <h3>VIELEN DANK!<br>Ihre Anfrage wurde erfolgreich versandt.</h3>
          </div>
        </div>
      </div>
      <div class="modal-footer" style="visible:false;">
        <input type="button" class="btn btn-default" id="clear_form" value="Zurücksetzen">
        <input type="button" class="btn btn-success" id="send_form" value="Anfrage senden">
        <img src="img/preloader.gif" id="loading" style="display:none;">
        <span class="glyphicon glyphicon-ok-sign" id="done" style="color:#2CCB2F; display:none;"></span>
      </div>
    </div>
  </div>
</div>

<div id="gallery" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true" id="close_modal">
            <span class="glyphicon glyphicon-remove btn-lg .ib-gallery-close-button"></span>
          </span>
        </button>
        <div class="ib-gallery-title">
          <h3 class="modal-title" id="galleryTitle"></h3>
        </div>
      </div>
      <div class="modal-body ib-gallery-image-container">
         <img id="galleryImage" src="" class="img-thumbnail">
      </div>
      <div class="modal-footer">
        <table width="100%">
          <tr>
              <td>
                <span id="galleryPrevious" class="glyphicon glyphicon-chevron-left btn-lg pull-left ib-gallery-scroll-button" aria-hidden="true"></span>
              </td>
              <td align="middle">
                <span id="galleryIndex"></span>
                  /
                <span id="galleryImages"></span>
              </td>
              <td>
                <span id="galleryNext" class="glyphicon glyphicon-chevron-right btn-lg pull-right ib-gallery-scroll-button" aria-hidden="true"></span>
              </td>
            </tr>
        </table>
      </div>
    </div>
  </div>
</div>
