<?
$cid = $_GET['cid'];
?>
<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic&subset=latin,cyrillic-ext,greek-ext,greek,vietnamese,latin-ext,cyrillic' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <!--<link rel="stylesheet" href="https://tls.homeinfo.de/libs/bootstrap/3.3.5/css/bootstrap.min.css">-->
        <link rel="stylesheet" href="css/bootstrap.min.css"><!-- LOCAL -->
        <!--<link rel="stylesheet" href="https://tls.homeinfo.de/libs/bootstrap/3.3.5/css/bootstrap-theme.min.css">-->
        <link rel="stylesheet" href="css/main.css"><!-- global for all customers -->
        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        <script src="https://tls.homeinfo.de/libs/modernizr/modernizr-2.8.3-respond-1.4.2.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="https://tls.homeinfo.de/libs/jquery/jquery-1.11.3.min.js"><\/script>')</script>
        <script src="https://tls.homeinfo.de/libs/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script src="https://tls.homeinfo.de/libs/ie10-viewport-bug-workaround/ie10-viewport-bug-workaround.js"></script>

        <!-- homeinfo libraries -->
        <script src="https://tls.homeinfo.de/javascript/jslibs/lib.js"></script>
        <script src="https://tls.homeinfo.de/javascript/jslibs/yellowmap.js"></script>
        <!-- homeinfo libraries -->

        <!-- jquery & other plugins -->
        <script src="https://tls.homeinfo.de/libs/jQuery.print/jQuery.print.js"></script><!-- plugin printElement -->
        <script src="https://tls.homeinfo.de/libs/DOMPurify/purify.js"></script><!-- plugin purify -->
        <script src="https://tls.homeinfo.de/libs/sweetalert/dist/sweetalert.min.js"></script><!--sweet alert plugin-->
    		<link rel="stylesheet" href="https://tls.homeinfo.de/libs/sweetalert/dist/sweetalert.css"><!--sweet alert plugin-->
        <script type="text/javascript" src="js/kenburns.js"></script><!-- kenburns -->
        <!-- jquery & other plugins -->

        <script>
          //global customer id
          var immosearch_customer_id = "<? echo $cid; ?>";//993301 BGW - Bielefeld
        </script>
        <script src="js/main.js"></script><!-- custom javascript -->
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        <!-- Fixed navbar -->
        <div class="row" id="immo_header">

          <div id="customer_logo"><img src="" id="customer_logo_src"></div>

          <div class="col-md-6">
            <h4 id="immo_title_angebote"><strong>Alle Wohnungen: <span id="total_angebote_in_title"></span></strong></h4>
          </div>

          <div class="col-md-6">

            <div class="row">

              <div class="col-md-3">
                <p style="margin-top:15px;">Sortieren nach:</p>
              </div>
              <div class="col-md-9">
                <select class="form-control" id="immo_filter">
                  <option value="0">Bitte wählen</option>
                  <option value="1">Zimmer aufsteigend</option>
                  <option value="2">Zimmer absteigend</option>
                  <option value="3">Fläche aufsteigend</option>
                  <option value="4">Fläche absteigend</option>
                  <option value="5">Grundmiete aufsteigend</option>
                  <option value="6">Grundmiete absteigend</option>
                  <option value="7">Gesamtmiete aufsteigend</option>
                  <option value="8">Gesamtmiete absteigend</option>
                </select>
                <p style="margin-top:10px;"><input type="button" class="btn btn-default btn-xs pull-right" value="Erweiterte Suche" id="immo_erweiterte_suche_btn" style="border-color:#356635; color:#FFFFFF; background-color:#356635;"></p>
              </div>



          </div>


          </div><!-- <div class="col-md-6">-->

          <!--
          <div class ="row" style="margin-left:13px; margin-right:13px;">
          <div class="panel panel-default">
            <div class="panel-body">
              Basic panel example Basic panel example Basic panel example Basic panel example
            </div>
          </div>
          </div>
          -->

          <span id="immo_erweiterte_suche_form" style="display:none;">

            <div class="row-fluid">
              <div class="col-md-12">
                <h4 id="immo_title_angebote"><strong>Suche verfeinern:</strong></h4>
              </div>
            </div>

            <!--
            <div class="row-fluid">
              <div class="col-md-3">
                <p>Kategorien</p>
              </div>
              <div class="col-md-9">
                <select class="form-control" id="immo_filter">
                  <option value="0">Alle</option>
                  <option value="keineBindung">Frei finanzierte Wohnungen</option>
                  <option value="Schwerbehind.">Behinderten gerechte Wohnungen</option>
                  <option value="Studentenwhg.">Studentenwohnungen</option>
                  <option value="Seniorenwohnung">Seniorenwohnungen</option>
                  <option value="Bielefelder Modell">Bielefelder Modell</option>
                  <option value="gefoerdert">Öffentlich geförderte Wohnungen</option>
                </select>
              </div>
            </div>
            -->

            <div class="row-fluid">
              <div class="col-md-12">
                <hr>
              </div>
            </div>

            <div class="row-fluid">
              <div class="col-md-6">
                <p>Zimmer: </p>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <input type="number" class="form-control" id="zimmer_von" placeholder="von">
                </div>
                <div class="form-group">
                  <input type="number" class="form-control" id="zimmer_bis" placeholder="bis">
                </div>
              </div>
            </div>

            <div class="row-fluid">
              <div class="col-md-6">
                <p>Wohnfläche (m²):</p>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <input type="number" class="form-control" id="wohnflaeche_von" placeholder="von">
                </div>
                <div class="form-group">
                  <input type="number" class="form-control" id="wohnflaeche_bis" placeholder="bis">
                </div>
              </div>
            </div>

            <div class="row-fluid">
              <div class="col-md-6">
                <p>Grundmiete (€):</p>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <input type="number" class="form-control" id="grundmiete_von" placeholder="von">
                </div>
                <div class="form-group">
                  <input type="number" class="form-control" id="grundmiete_bis" placeholder="bis">
                </div>
              </div>
            </div>

            <div class="row-fluid">
              <div class="col-md-12">
                <hr>
              </div>
            </div>

            <div class="row-fluid">
              <!--
              <div class="col-md-4 col-sm-4 col-xs-6">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="terrasse"> Terrasse
                  </label>
                </div>
              </div>
              -->
              <!--
              <div class="col-md-4 col-sm-4 col-xs-6">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="garten"> Garten
                  </label>
                </div>
              </div>
              -->
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="balkon_loggia"> Balkon/Loggia
                  </label>
                </div>
              </div>

              <!--
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="bad_mit_wanne"> Bad mit Wanne
                  </label>
                </div>
              </div>
              -->
              <!--
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="checkbox">
                  <label>
                  </label>
                    <input type="checkbox" id="bad_mit_dusche"> Bad mit Dusche
                </div>
              </div>
              -->
              <!--
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="aufzug"> Aufzug
                  </label>
                </div>
              </div>
              -->
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="eg"> EG.
                  </label>
                </div>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="1og"> 1. OG
                  </label>
                </div>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="2og_oder_hoher"> 2. OG oder höher
                  </label>
                </div>
              </div>
            </div>

            <div class="row-fluid">
              <div class="col-md-12 col-xs-12">
                <hr>
              </div>
            </div>

            <div class="row-fluid" id="dynamic_area_list">

            </div>

            <div class="row-fluid">
              <div class="col-md-12 col-xs-12">
                <br><br><br><br>
              </div>
            </div>

          </span><!-- <span id="immo_erweiterte_suche_form" style="display:none;"> -->

        </div><!-- <div class="row"> -->

        <div class="row" id="top_menu_after_filter" style="display:none; margin-left:4px; margin-right:20px; margin-botton:20px;">

            <div class="col-md-3 col-sm-3 col-xs-6">
                  <!--<p id="details_page_back_to_list" style="cursor:pointer; color:#aaa91f;"><strong>Zurück zur Liste</strong></p>-->
                  <!--<input type="button" class="btn btn-default btn-xs" id="details_page_back_to_list" value="Zurück zur Liste">-->
            </div>

            <div class="col-md-12 col-sm-12 col-xs-12">
              <button type="button" class="btn btn-specialBtnKA-bgw btn-xs" id="details_page_back_to_list" style="margin-right:10px;"><i class="fa fa-long-arrow-left"></i> Zurück zur Liste</button>
              <button type="button" class="btn btn-specialBtnKA-bgw btn-xs" id="details_page_print"><i class="fa fa-print"></i> Drucken</button>
            </div>

            <!--
            <div class="col-md-3 col-sm-3 col-xs-6">
                  <p id="details_page_map" style="cursor:pointer; color:#aaa91f;"><strong>Anfrage</strong></p>
            </div>


            <div class="col-md-3 col-sm-3 col-xs-6">
                  <p id="details_page_send_to_friend" style="cursor:pointer; color:#aaa91f;"><strong>Empfehlen</strong></p>
            </div>
            -->

            <div class="col-md-3 col-sm-3 col-xs-6">
                  <!--<p id="details_page_print" style="cursor:pointer; color:#aaa91f;"><strong>Drucken</strong></p>-->
                  <!--<input type="button" class="btn btn-default btn-xs" id="details_page_print" value="Drucken">-->
            </div>

        </div>

        <div class="row-fluid" id="top_menu_line_after_filter" style="display:none;">
          <div class="col-md-12 col-xs-12">
            <!--<hr>-->
          </div>
        </div>

        <div class="row-fluid" style="margin-right:20px; margin-bottom:20px;">
          <input type="button" class="btn btn-default btn-xs pull-right" value="Suche leeren" id="empty_search_fileds_btn" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; display:none;">
        </div>

        <div class="row" id="immo_data">

        </div><!-- <div class="row" id="immo_data"> -->

        <div class='row' id="map_container_button" style="margin-left:20px; margin-right:20px; width:100%; max-width:100% ">

        </div>

        <div class='row' id="map_container" style="margin-left:20px; margin-right:20px;">

        </div>

        <!--image gallery modal-->
        <div class="modal fade" id="imagesGalleryModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" id="close_modal"><span class="glyphicon glyphicon-remove btn-lg" style="cursor:pointer; margin-top:-15px; margin-right:-15px;"></span></span></button>
                <h6 class="modal-title" id="myModalLabel"></h6>
              </div>
              <div class="modal-body">
                 <img id="image_source_gallery" src="" class="thumb">
              </div>
              <div class="modal-footer">
                <table width="100%">
                  <tr>
                      <td><span class="glyphicon glyphicon-chevron-left btn-lg pull-left" aria-hidden="true" id="previous_pic" style="cursor:pointer;"></span></td>
                      <td align="middle"><span id="show_img_counter"></span>/<span id="show_img_length"></span></td>
                      <td><span class="glyphicon glyphicon-chevron-right btn-lg pull-right" aria-hidden="true" id="next_pic" style="cursor:pointer;"></span></td>
                    </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!--image gallery modal-->

        <!--image gallery modal floor plans-->
        <div class="modal fade" id="imagesGalleryModalFloorPlan" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog" style="widht:0px;">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" id="close_modal"><span class="glyphicon glyphicon-remove btn-lg" style="cursor:pointer; margin-top:-15px; margin-right:-15px;"></span></span></button>
                <h6 class="modal-title" id="myModalLabel_floor_plan"></h6>
              </div>
              <div class="modal-body">
                 <img id="image_source_gallery_floor_plan" src="" class="thumb">
              </div>
              <div class="modal-footer">
                <table width="100%">
                  <tr>
                      <td><span class="glyphicon glyphicon-chevron-left btn-lg pull-left" aria-hidden="true" id="previous_pic_floor_plans" style="cursor:pointer;"></span></td>
                      <td align="middle"><span id="show_img_counter_floor_plans"></span>/<span id="show_img_length_floor_plans"></span></td>
                      <td><span class="glyphicon glyphicon-chevron-right btn-lg pull-right" aria-hidden="true" id="next_pic_floor_plans" style="cursor:pointer;"></span></td>
                    </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!--image gallery modal floor plans-->

        <!--kontakt form -->
        <div class="modal fade" id="contactFormModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" id="close_modal"><span class="glyphicon glyphicon-remove btn-lg" style="cursor:pointer; margin-top:-15px; margin-right:-15px;"></span></span></button>
                <h6 class="modal-title" id="myModalLabel"><strong>Kontaktformular</strong></h6>
              </div>
              <div class="modal-body">
                <p id="service_team"></p>

                <div class="row" style="margin-top:40px;">

                  <div class="col-md-12">
                   <p><strong>Anrede</strong></p>
                     <div class="btn-group" data-toggle="buttons">
                         <label class="btn btn-default">
                             <input type="radio" name="gender" id="gender_1" value="1">Herr
                         </label>
                         <label class="btn btn-default">
                             <input type="radio" name="gender" id="gender_2" value="0">Frau
                         </label>
                     </div>
                  </div>

                  <div class="row">
                    <div class="col-md-12">&nbsp;</div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="vorname">Vorname</label>
                      <input type="text" class="form-control" id="vorname" placeholder="Vorname*">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="nachname">Nachname</label>
                      <input type="text" class="form-control" id="nachname" placeholder="Nachname*">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email">E-Mail-Adresse</label>
                      <input type="email" class="form-control" id="email" placeholder="E-Mail-Adresse">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="telefon">Telefon</label>
                      <input type="text" class="form-control" id="telefon" placeholder="Telefon">
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="adddress">Straße/Haus-Nr.</label>
                      <input type="text" class="form-control" id="adddress" placeholder="Straße/Haus-Nr.">
                    </div>
                  </div>

                  <div class="col-md-3">
                    <div class="form-group">
                      <label for="plz">PLZ</label>
                      <input type="number" class="form-control" id="plz" placeholder="PLZ">
                    </div>
                  </div>

                  <div class="col-md-9">
                    <div class="form-group">
                      <label for="ort">Ort</label>
                      <input type="text" class="form-control" id="ort" placeholder="Ort">
                    </div>
                  </div>

                  <div class="col-md-12">
                    <textarea class="form-control" rows="5" id="message" placeholder="Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.">Ich interessiere mich für Ihr Angebot. Bitte nehmen Sie Kontakt mit mir auf.</textarea>
                  </div>

                  <div class="col-md-12" style="color:#979696; font-size:10px;">
                    Mit einem (*) gekennzeichnete Felder sind Pflichfelder
                  </div>

                </div>

              </div>
              <div class="modal-footer">

                <input type="button" class="btn btn-default" id="empty_form" value="Kontaktformular leeren" disabled>
                <input type="button" class="btn btn-success" id="restore_chart" value="Anfrage senden" disabled>

              </div>
            </div>
          </div>
        </div>
        <!--kontakt form -->

        <script>
        $(document).ready(function() {

          /*
          $('#imagesGalleryModal').on('shown.bs.modal', function () {
            $(this).find('.modal-dialog').css({width:$("#image_source_gallery").width()});
            console.log($("#image_source_gallery").height());//trace
            //console.log($("#image_source_gallery").width());//trace
          });

          $('#imagesGalleryModalFloorPlan').on('shown.bs.modal', function () {
            $(this).find('.modal-dialog').css({width:$("#image_source_gallery_floor_plan").width()});
            console.log($("#image_source_gallery").height());//trace
            //console.log($("#image_source_gallery").width());//trace
          });
          */

        });
        </script>
    <!--</div>--><!-- <div class="container"> -->
    </body>
</html>
