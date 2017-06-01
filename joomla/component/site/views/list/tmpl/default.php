<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

$document = JFactory::getDocument();

//$document->addStyleSheet('https://tls.homeinfo.de/libs/bootstrap/latest/css/bootstrap.min.css');
$document->addStyleSheet('https://tls.homeinfo.de/libs/sweetalert/dist/sweetalert.css');
$document->addStyleSheet(immobrowseAsset('immobrowse.css'));
$document->addStyleSheet(immobrowseAsset('list.css'));

$document->addScript('https://tls.homeinfo.de/libs/jquery/jquery-latest.min.js');
$document->addScript('https://fonts.googleapis.com/icon?family=Material+Icons');
$document->addScript('https://tls.homeinfo.de/libs/sweetalert/dist/sweetalert.min.js');
$document->addScript('https://tls.homeinfo.de/jslibs/homeinfo.min.js');
$document->addScript('https://tls.homeinfo.de/jslibs/immobrowse.min.js');
$document->addScriptDeclaration('var customer = ' . $this->customer . ';');
$document->addScript(immobrowseAsset('config.js'));
$document->addScript(immobrowseAsset('list.js'));
?>
<h1>Liste</h1>
<h2>Customer: <?php echo($this->customer); ?></h2>
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
  </div>
  <div class="row row-centered">
    <div id="templateContainer" class="ib-template-container">
      <div id="entry" class="container ib-preview-item">
        <table>
          <tr>
            <td>
              <img src='img/dummy.jpg' id="titleImage" alt="Titelbild">
            </td>
            <td>
              <table>
                <tr>
                  <td id="objectTitle"></td>
                </tr>
                <tr>
                  <table>
                    <tr>
                      <td>Anzahl Zimmer:</td>
                      <td id="rooms"></td>
                    </tr>
                    <tr>
                      <td>Fläche ca.: </td>
                      <td id="area"></td>
                    </tr>
                    <tr>
                      <td>Kaltmiete:</td>
                      <td id="coldRent"></td>
                    </tr>
                    <tr>
                      <td>Nebenkosten:</td>
                      <td id="serviceCharge"></td>
                    </tr>
                  </table>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div id="list"></div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>
