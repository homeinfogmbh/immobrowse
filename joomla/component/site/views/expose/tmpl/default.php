<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

$document = JFactory::getDocument();

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
<div>
  <div id="header" class="ib-header">
    <table width="100%">
      <tr>
        <td width="20%" style="text-align: left;">
          <button type="button" onclick="back();">
            « Zur&uuml;ck
          </button>
        </td>
        <td width="60%" class="ib-centered">
          <span id="objectTitle" class="ib-title">Objekttitel</span><br>
          Objekt Nr. <span id="objectId" class="ib-id">Objektnummer</span>
        </td>
        <td width="20%" style="text-align: right;">
          <button type="button" class="btn btn-info" onclick="print();">
            Drucken
          </button>
        </td>
      </tr>
    </table>
  </div>
  <div>
    <div id="expose" class="ib-expose">
      <table width="100%">
        <tr>
          <td width="50%">
            <div id="titleImageFrame" class="ib-image-frame">
              <img src="img/dummy.jpg" id="titleImage" alt="Titelbild" class="ib-framed-image">
            </div>
            <div id="titleImageCaption" class="ib-centered">
              Titelbild
            </div>
          </td>
          <td width="50%">
            <div id="floorplanFrame" class="ib-image-frame">
              <img src="img/dummy.jpg" id="floorplan" alt="Grundriss" class="ib-framed-image">
            </div>
            <div id="floorplanCaption" class="ib-centered">
              Grundriss
            </div>
          </td>
        </tr>
      </table>
      <table width="100%">
        <tr>
          <td width="50%" class="ib-container-column">
            <table>
              <tr>
                <th class="ib-section-caption ib-left">
                  Preise
                </th>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Kaltmiete: <span id="coldRent"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Nebenkosten: <span id="serviceCharge"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Kaution / Genoss.-Ant.: <span id="securityDeposit"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Heizkosten in NK enthalten: <span id="heatingCostsInServiceCharge"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Heizkosten: <span id="heatingCosts"></span>
                </td>
              </tr>
            </table>
          </td>
          <td width="50%" class="ib-container-column">
            <table>
              <tr>
                <th class="ib-section-caption ib-left">
                  Zustand und Ausstattung
                </th>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Wohnfläche: <span id="livingArea"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Zimmer: <span id="rooms"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Etage: <span id="floor"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Baujahr: <span id="constructionYear"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Zustand: <span id="state"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Letzte Modernisierung: <span id="lastModernization"></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <table width="100%">
        <tr>
          <th class="ib-section-caption ib-left">
            Energieausweis
          </th>
        </tr>
        <tr>
          <td width="50%" class="ib-container-column">
            <table>
              <tr>
                <td class="ib-price-caption">
                  Ausweisart: <span id="energyCertificateType"></span>
                </td>
              </tr>
              <tr id="energyConsumptionContainer">
                <td class="ib-price-caption">
                  Endenergieverbrauch: <span id="energyConsumption"></span>
                </td>
              </tr>
              <tr id="energyDemandContainer">
                <td class="ib-price-caption">
                  Endenergiebedarf: <span id="energyDemand"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Primärenergieträger: <span id="primaryEnergyCarrier"></span>
                </td>
              </tr>
              <tr>
                <td class="ib-price-caption">
                  Wertklasse: <span id="valueClass"></span>
                </td>
              </tr>
            </table>
          </td>
          <td width="50%" class="ib-container-column">
            <table>
              <tr>
                <th class="ib-section-caption">
                  Ausstattung
                </th>
              </tr>
              <tr>
                <td id="amenitiesList"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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
