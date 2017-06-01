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
<div>
  <div id="header" class="ib-header">
    <div class="ib-centered">
      <button type="button" onclick="back();">
        « Zur&uuml;ck
      </button>
    </div>
    <table>
      <tr>
        <th id="objectTitle" class="ib-title"></th>
      </tr>
      <tr>
        <td id="objectId" class="ib-id"></td>
      </tr>
      <tr>
        <td id="objectId" class="ib-id"></td>
      </tr>
    </table>
    <div class="ib-detail-print ib-centered">
      <button type="button" class="btn btn-info" onclick="print();">
        Drucken
      </button>
    </div>
  </div>
  <div>
    <div id="expose" class="ib-expose">
      <div>
        <div>
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
      <div class="ib-expose-data-row">
        <div class="ib-expose-data-col">
          <div class="ib-section-caption">
            Preise
          </div>
          <div>
            <div class="ib-price-caption">
              Kaltmiete
            </div>
            <div id="coldRent"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Nebenkosten
            </div>
            <div id="serviceCharge"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Kaution / Genoss.-Ant.
            </div>
            <div id="securityDeposit"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Heizkosten in NK enthalten?
            </div>
            <div id="heatingCostsInServiceCharge"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Heizkosten
            </div>
            <div id="heatingCosts"></div>
          </div>
        </div>
        <div class="ib-expose-data-col">
          <div class="ib-section-caption">
            Zustand und Ausstattung
          </div>
          <div>
            <div class="ib-price-caption">
              Wohnfläche
            </div>
            <div id="livingArea"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Zimmer
            </div>
            <div id="rooms"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Etage
            </div>
            <div id="floor"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Baujahr
            </div>
            <div id="constructionYear"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Zustand
            </div>
            <div id="state"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Letzte Modernisierung
            </div>
            <div id="lastModernization"></div>
          </div>
        </div>
      </div>
      <div class="ib-expose-data-row">
        <div class="ib-expose-data-col">
          <div class="ib-section-caption">
            Energieausweis
          </div>
          <div >
            <div class="ib-price-caption">
              Ausweisart
            </div>
            <div id="energyCertificateType"></div>
          </div>
          <div id="energyConsumptionContainer">
            <div class="ib-price-caption">
              Endenergieverbrauch
            </div>
            <div id="energyConsumption"></div>
          </div>
          <div id="energyDemandContainer">
            <div class="ib-price-caption">
              Endenergiebedarf
            </div>
            <div id="energyDemand"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Primärenergieträger
            </div>
            <div id="primaryEnergyCarrier"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Wertklasse
            </div>
            <div id="valueClass"></div>
          </div>
        </div>
        <div class="ib-expose-data-col">
          <div class="ib-section-caption">
            Ausstattung
          </div>
          <div id="amenitiesList"></div>
        </div>
      </div>
      <div class="ib-expose-data-row">
        <div class="ib-expose-data-col">
          <div class="ib-section-caption">
            Objektbeschreibung
          </div>
          <div id="description" class="ib-justified"></div>
        </div>
      </div>
      <div class="ib-expose-data-row">
        <div class="ib-expose-data-col">
          <div class="ib-section-caption">
            Lagebeschreibung
          </div>
          <div id="exposure" class="ib-justified"></div>
        </div>
      </div>
      <div class="ib-expose-data-row">
        <div class="ib-expose-data-col">
          <div class="ib-section-caption">
            Sonstiges
          </div>
          <div id="miscellanea" class="ib-justified"></div>
        </div>
      </div>
      <div class="ib-expose-data-row">
        <div class="ib-expose-data-col">
          <div class="ib-section-caption">
            Kontakt
          </div>
          <div>
            <div class="ib-price-caption">
              Name
            </div>
            <div id="contactName"></div>
          </div>
          <div id="energyConsumptionContainer">
            <div class="ib-price-caption">
              Firma
            </div>
            <div id="contactCompany"></div>
          </div>
          <div id="energyDemandContainer" >
            <div class="ib-price-caption">
              Adresse
            </div>
            <div id="contactAddress"></div>
          </div>
          <div >
            <div class="ib-price-caption">
              Telefon
            </div>
            <div id="contactPhone"></div>
          </div>
          <div>
            <div class="ib-price-caption">
              Website
            </div>
            <div id="contactWebsite"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>

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
