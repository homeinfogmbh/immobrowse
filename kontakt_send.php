<?
date_default_timezone_set('Europe/Berlin');//send the mail using the class
//include "inc/PHPMailer/PHPMailerAutoload.php";
require_once("inc/PHPMailer/class.phpmailer.php");
require_once("inc/PHPMailer/class.smtp.php");

class InsecurePHPMailer extends PHPMailer {
    public function smtpConnect($options = array()) {
        // Override options
        $options = array(
            'ssl' => array(
                'verify_peer' => true,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        return parent::smtpConnect($options);
    }
}

$vorname = $_POST['vorname'];
$nachname = $_POST['nachname'];
$email = $_POST['email'];
$telefon = $_POST['telefon'];
$adddress = $_POST['adddress'];
$plz = $_POST['plz'];
$ort = $_POST['ort'];
$nachricht = $_POST['nachricht'];
$cid = $_POST['cid'];
$andere = $_POST['andere'];
$the_offer = $_POST['the_offer'];
$date = $_POST['date'];
$image = $_POST['image'];
$object_title = $_POST['object_title'];
$form_miete_nk = $_POST['form_miete_nk'];
$form_zimmer = $_POST['form_zimmer'];
$form_nebenkosten = $_POST['form_nebenkosten'];
$form_wohnflache_ca = $_POST['form_wohnflache_ca'];
$form_heizkosten = $_POST['form_heizkosten'];
$form_baujahr = $_POST['form_baujahr'];
$form_kaution = $_POST['form_kaution'];
$form_verfugbar_ab = $_POST['form_verfugbar_ab'];
$teammail = $_POST['teammail'];
$object_nr_email = $_POST['object_nr_email'];
$object_email_address = $_POST['object_email_address'];

//get the team number
$service_team_number = $teammail[4];

$html_content = '<!doctype html>';
$html_content .= '<html>';
$html_content .= '<head>';
$html_content .= '<meta charset="utf-8">';
$html_content .= '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">';

if ($cid == "993301") {//bgw-bielfeld 993301 cid
  $html_content .= '<title>BGW-Bielfeld kontakt formular</title>';
} else {//else give Immobrowse title
  $html_content .= '<title>Immobrowse kontakt formular</title>';
}

/*
$html_content .= '<style>';
$html_content .= 'body {';
$html_content .= 'font-family: Arial,Helvetica,sans-serif;';
$html_content .= '}';
$html_content .= '<style>';
*/

$html_content .= '</head>';
$html_content .= '<body>';
//////////////////////////////////////////////////
$html_content .= 'Anfrage an<br>';
$html_content .= 'ServiceTeam '.$service_team_number.'<br>';
$html_content .= 'Bielefelder Gemeinnützige<br>';
$html_content .= 'Wohnungsgesellschaft mbH<br><br>';
if ($cid == "993301") {//bgw-bielfeld 993301 cid
    $html_content .= '<img src="https://tls.homeinfo.de/immobrowse/img/customers_logos/'.$cid.'.png"><br><br>';
} else {//else give Immobrowse logo or Homeinfo logo
    $html_content .= '<br><br>';
}
$html_content .= '<hr>';
if ($cid == "993301") {//bgw-bielfeld 993301 cid
    $html_content .= '<p>Sie haben auf BGW-Bielefeld am '.$date.' eine Anfrage zu folgendem Objekt gestellt:<br></p><br>';
} else {//else give Immobrowse logo or Homeinfo logo
    $html_content .= '<p>Sie haben auf Homeinfo am '.$date.' eine Anfrage zu folgendem Objekt gestellt:<br></p><br>';
}
$html_content .= '<img src="'.$image.'"><br>';
$html_content .= '<br><br><strong>'.$object_title.'</strong>';
$html_content .= '<table>';
$html_content .= '<tr>';
  $html_content .= '<td><strong>Miete zzgl.NK</strong></td>';
  $html_content .= '<td align="right">'.$form_miete_nk.'</td>';
  $html_content .= '<td><strong>&nbsp;&nbsp;Zimmer</strong></td>';
  $html_content .= '<td align="right">'.$form_zimmer.'</td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
  $html_content .= '<td><strong>Nebenkosten</strong></td>';
  $html_content .= '<td align="right">'.$form_nebenkosten.'</td>';
  $html_content .= '<td><strong>&nbsp;&nbsp;Wohnfläche ca.</strong></td>';
  $html_content .= '<td align="right">'.$form_wohnflache_ca.'</td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
  $html_content .= '<td><strong>Heizkosten</strong></td>';
  $html_content .= '<td align="right">'.$form_heizkosten.'</td>';
  $html_content .= '<td><strong>&nbsp;&nbsp;Baujahr</strong></td>';
  $html_content .= '<td align="right">'.$form_baujahr.'</td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
  $html_content .= '<td><strong>Kaution</strong></td>';
  $html_content .= '<td align="right">'.$form_kaution.'</td>';
  $html_content .= '<td><strong>&nbsp;&nbsp;Verfügbar ab</strong></td>';
  $html_content .= '<td align="right">'.$form_verfugbar_ab.'</td>';
$html_content .= '</tr>';
$html_content .= '</table>';
//$html_content .= '<strong style="color:#267f00;"><br><br>Weitere Wohnungsdaten im Überblick</strong>';
$html_content .= '<hr>';
$html_content .= '<strong style="color:#267f00;"> Ihre Kontaktanfrage im Überblick</strong><br><br>';

if ($andere == 1) {
  $andere_text = "Herr";
} else {
  $andere_text = "Frau";
}

$html_content .= '<strong>Andere:</strong> '.$andere_text.'<br>';
$html_content .= '<strong>Name / Nachname:</strong> '.$vorname.' '.$nachname.'<br>';
$html_content .= '<strong>E-Mail-Adresse:</strong> '.$email.'<br>';
$html_content .= '<strong>Telefon:</strong> '.$telefon.'<br>';
$html_content .= '<strong>Straße/Haus-Nr.:</strong> '.$adddress.'<br>';
$html_content .= '<strong>PLZ:</strong> '.$plz.'<br>';
$html_content .= '<strong>Ort:</strong> '.$ort.'<br>';
$html_content .= '<strong>Ihre Nachricht:</strong> '.$nachricht.'<br>';
$html_content .= '<br><br>';
$html_content .= 'Dies ist eine automatisch generierte Nachricht, bitte antworten Sie nicht an diese E-Mail-Adresse.<br>
Sollten Sie weitere Fragen zu dieser Wohnung haben, wenden Sie sich bitte unter '.$teammail.' direkt an das Serviceteam.<br><br>';

if ($cid == "993301") {//bgw-bielfeld 993301 cid
    $html_content .= '<a href="http://www.bgw-bielefeld.de" target="_blank" style="color:#267f00;">www.bgw-bielefeld.de</a> | <a href="http://www.bgw-bielefeld.de/impressum.html" target="_blank" style="color:#267f00;">Impressum</a>';
} else {//homeinfo
    $html_content .= '<a href="https://www.homeinfo.de" target="_blank" style="color:#267f00;">www.homeinfo.de</a> | <a href="https://www.homeinfo.de/#impressum" target="_blank" style="color:#267f00;">Impressum</a>';
}
$html_content .= '<hr>';
$html_content .= '<i class="fa fa-check fa-3x" style="color:#a4be04;"></i> <h3>VIELEN DANK!<br>Ihre Anfrage wurde erfolgreich versandt.</h3>';
//////////////////////////////////////////////////
$html_content .= '<br><br>';
$html_content .= '</body>';
$html_content .= '</html>';

$mailer = new InsecurePHPMailer();
$mailer->IsSMTP();
$mailer->CharSet = 'UTF-8';
$mailer->SMTPAuth = true;
$mailer->SMTPSecure = "ssl";
$mailer->Host = "mail2.homeinfo.de";//change this bgw-bielefeld email
$mailer->Port = 465;
$mailer->Username = "web0p22";

// enables SMTP debug information (for testing)
// 1 = errors and messages
// 2 = messages only
//$mailer->SMTPDebug  = 1;

$mailer->Password = "d9MX1226mSWH";
if ($cid == "993301") {//bgw-bielfeld 993301 cid
    $mailer->Subject = "Anfrage für Ihr Objekt ".$object_nr_email." von bgw-bielefeld.de ".$object_email_address;
} else {//homeinfo
    $mailer->Subject = "Anfrage für Ihr Objekt ".$object_nr_email." von bgw-bielefeld.de ".$object_email_address;
}
//$mailer->AltBody = "Vorname und Nachname:".$vorname." ".$nachname." E-mail: ".$email." Telephonummer: ".$telefon." Nachricht: ".$nachricht;
$mailer->MsgHTML($html_content);
$mailer->AddAddress($teammail);//change this bgw-bielefeld email
$mailer->addCC('vermietung@bgw-bielefeld.de');
$mailer->addBCC($email);
$mailer->SetFrom("automailer@homeinfo.de");//change this bgw-bielefeld email

//check if some fields are empty
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  if (!empty($vorname) && !empty($nachname) && !empty($email)) {

  	//send the message, check for errors
  	if(!$mailer->Send()) {
  		//echo "Mailer Error: ".$mailer->ErrorInfo;
  		echo '0';
  	} else{
  		//echo "Message sent!";
  		echo '1';
  	}

  }
}
?>
