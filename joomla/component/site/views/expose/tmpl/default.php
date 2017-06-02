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
          <td width="50%" class="ib-container-column">
            <table>
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
              </tr>
            </table>
          </td>
          <td width="50%" class="ib-container-column">
            <table>
              <tr>
                <th class="ib-section-caption ib-left">
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
      <table>
        <tr>
          <td>
            <table>
              <tr>
                <th class="ib-section-caption ib-left">
                  Objektbeschreibung
                </th>
              </tr>
              <tr>
                <td id="description" class="ib-justified"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table>
              <tr>
                <th class="ib-section-caption ib-left">
                  Lagebeschreibung
                </th>
              </tr>
              <tr>
                <td id="exposure" class="ib-justified"></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table>
              <tr>
                <th class="ib-section-caption">
                  Sonstiges
                </th>
              </tr>
              <tr>
                <td id="miscellanea" class="ib-justified"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td width="50%" class="ib-container-column">
            <table>
              <tr>
                <th class="ib-section-caption ib-left">
                  Kontakt
                </th>
              </tr>
                <td>
                  Name: <span id="contactName"></span><br>
                  Firma: <span id="contactCompany"></span><br>
                  Adresse: <span id="contactAddress"></span><br>
                  Tel.: <span id="contactPhone"></span><br>
                  Website: <span id="contactWebsite"></span><br>
                </td>
              </tr>
            </table>
          </td>
          <td width="50%" class="ib-container-column">
            <table>
              <tr>
                <th class="ib-section-caption ib-left">
                  Kontaktforumlar
                </th>
              </tr>
              <tr>
                <td>
                  Anrede
                </td>
                <td>
                   <label class="btn btn-default">
                     <input type="radio" name="gender" id="gender_male" value="1">Herr
                   </label>
                   <label class="btn btn-default">
                     <input type="radio" name="gender" id="gender_female" value="0">Frau
                   </label>
                </td>
              </tr>
              <tr>
                <td>
                  Objektnummer
                </td>
                <td>
                   <input type="text" class="form-control" id="object_id" disabled>
                </td>
              </tr>
              <tr>
                <td>
                  Vorname
                </td>
                <td>
                   <input type="text" class="form-control" id="forename" placeholder="Vorname*">
                </td>
              </tr>
              <tr>
                <td>
                  Nachname
                </td>
                <td>
                   <input type="text" class="form-control" id="surname" placeholder="Nachname*">
                </td>
              </tr>
              <tr>
                <td>
                  E-Mail Adresse
                </td>
                <td>
                   <input type="email" class="form-control" id="email" placeholder="E-Mail-Adresse*">
                </td>
              </tr>
              <tr>
                <td>
                  Telefon
                </td>
                <td>
                   <input type="text" class="form-control" id="phone" placeholder="Telefon">
                </td>
              </tr>
              <tr>
                <td>
                  Straße
                </td>
                <td>
                   <input type="text" class="form-control" id="street" placeholder="Straße">
                </td>
              </tr>
              <tr>
                <td>
                  Haus-Nr.
                </td>
                <td>
                   <input type="text" class="form-control" id="house_number" placeholder="Haus-Nr.">
                </td>
              </tr>
              <tr>
                <td>
                  PLZ
                </td>
                <td>
                   <input type="text" class="form-control" id="zip_code" placeholder="PLZ">
                </td>
              </tr>
              <tr>
                <td>
                  Ort
                </td>
                <td>
                   <input type="text" class="form-control" id="city" placeholder="Ort">
                </td>
              </tr>
              <tr>
                <td>
                  Nachricht
                </td>
                <td>
                  <textarea id="message" rows="4" cols="25"></textarea>
                </td>
              </tr>
              <tr>
                <td>
                  Mit einem (*) gekennzeichnete Felder sind Pflichfelder
                </td>
                <td>
                  <button class="g-recaptcha" data-sitekey="<?php echo($this->sitekey); ?>" data-callback="commitForm">Senden</button>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>
