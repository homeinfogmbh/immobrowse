<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

$document = JFactory::getDocument();

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
<div>
  <button id="ib-sort-rooms" onclick="toggleSorting('rooms');" class="ib-btn-sort">Zimmer</button>
  <button id="ib-sort-area" onclick="toggleSorting('area');" class="ib-btn-sort">Fl&auml;che</button>
  <button id="ib-sort-rent" onclick="toggleSorting('rent');" class="ib-btn-sort">Miete</button>
  <div>
    <div id="templateContainer" class="ib-template-container">
      <div id="entry" class="ib-preview-item">
        <table width="100%" style="table-layout: fixed;">
          <tr>
            <th id="objectTitle" class="ib-left"></th>
          </tr>
          <tr>
            <td width="20%">
              <div>
                <img src='img/dummy.jpg' id="titleImage" alt="Titelbild" style="max-height:120px">
              </div>
            </td>
            <td width="80%">
              <table>
                <tr>
                  <th id="address"></td>
                </tr>
                <tr>
                  <td class="ib-container-column">
                    <table>
                      <tr>
                        <td>Anzahl Zimmer:</td>
                        <td id="rooms"></td>
                      </tr>
                      <tr>
                        <td>Fläche ca.: </td>
                        <td id="livingArea"></td>
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
                  </td>
                </tr>
                <tr>
                  <td id="amenitiesTags" class="ib-container-column"></td>
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
