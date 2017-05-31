<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

function _prefixAsset($asset) {
    return 'components/com_immobrowse/views/list/tmpl/' . $asset;
}

$document = JFactory::getDocument();

//$document->addStyleSheet('https://tls.homeinfo.de/libs/bootstrap/latest/css/bootstrap.min.css');
$document->addStyleSheet('https://fonts.googleapis.com/icon?family=Material+Icons');
$document->addStyleSheet('https://tls.homeinfo.de/libs/sweetalert/dist/sweetalert.css');
$document->addStyleSheet(_prefixAsset('immobrowse.css'));

$document->addScript('https://tls.homeinfo.de/libs/jquery/jquery-latest.min.js');
$document->addScript('https://fonts.googleapis.com/icon?family=Material+Icons');
$document->addScript('https://tls.homeinfo.de/libs/sweetalert/dist/sweetalert.min.js');
$document->addScript('https://tls.homeinfo.de/jslibs/homeinfo.min.js');
$document->addScript('https://tls.homeinfo.de/jslibs/immobrowse.min.js');
$document->addScriptDeclaration('var customer = ' . $this->cid . ';');
$document->addScript(_prefixAsset('config.js'));

/* List */
if ($this->objectId == null) {
    $document->addStyleSheet(_prefixAsset('list.css'));
    $document->addScript(_prefixAsset('list.js')); ?>
<h1>Liste</h1>
<h2>Customer: <?php echo($this->cid); ?></h2>
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

<!-- Expose -->
<?php } else { ?>
<h1>Expose</h1>
<h2>Customer: <?php echo($this->cid); ?></h2>
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
            <div class="g-recaptcha" data-sitekey="6LctzhATAAAAADfc-ph7GHVYQ68y9lY4rYwV0Zft"></div>
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
<?php } ?>
