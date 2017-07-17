<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

$document = JFactory::getDocument();

$document->addStyleSheet(immobrowseAsset('bootstrap-fix.css'));
$document->addStyleSheet('https://libraries.homeinfo.de/sweetalert/dist/sweetalert.css');
$document->addStyleSheet(immobrowseAsset('immobrowse.css'));
$document->addStyleSheet(immobrowseAsset('list.css'));

$document->addScript('https://libraries.homeinfo.de/jquery/jquery-latest.min.js');
$document->addScript('https://fonts.googleapis.com/icon?family=Material+Icons');
$document->addScript('https://libraries.homeinfo.de/sweetalert/dist/sweetalert.min.js');
$document->addScript('https://javascript.homeinfo.de/homeinfo.min.js');
$document->addScript('https://javascript.homeinfo.de/immobrowse.min.js');
$document->addScriptDeclaration('var customer = ' . $this->customer . ';');
$document->addScript(immobrowseAsset('config.js'));
$document->addScript(immobrowseAsset('list.js'));
?>
<div>
  <button id="ib-sort-rooms" onclick="toggleSorting('rooms');" class="ib-btn-sort">Zimmer</button>
  <button id="ib-sort-area" onclick="toggleSorting('area');" class="ib-btn-sort">Fl&auml;che</button>
  <button id="ib-sort-rent" onclick="toggleSorting('rent');" class="ib-btn-sort">Miete</button>
  <div>
    <div id="list"></div>
    <div id="loader">
      <div class="loader"></div>
    </div>
  </div>
</div>
