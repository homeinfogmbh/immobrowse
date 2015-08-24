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

/*
$html_content = '<!doctype html>';
$html_content .= '<html>';
$html_content .= '<head>';
$html_content .= '<meta charset="utf-8">';
$html_content .= '<title>Immobrowse kontakt formular</title>';
$html_content .= '</head>';
$html_content .= '<body>';
$html_content .= '<table style="margin-top:0px;">';
$html_content .= '<tr>';
$html_content .= '<td colspan="2"><img src="'.$_SESSION["websiteDomain"].'img/homeinfo_logo_inner.png"><br><br></td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
$html_content .= '<td colspan="2" style="padding-left:4px;"><strong>Homeinfo kontakt formular<br><br></strong></td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
$html_content .= '<td style="padding-left:4px;"><strong>Unternehmensname: </strong></td>';
$html_content .= '<td style="padding-left:4px;">'.$homeinfo_unternehmensname.'</td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
$html_content .= '<td style="padding-left:4px;"><strong>Vorname und Nachname: </strong></td>';
$html_content .= '<td style="padding-left:4px;">'.$homeinfo_vorname.' '.$homeinfo_nachname.'</td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
$html_content .= '<td style="padding-left:4px;"><strong>E-mail:</strong></td>';
$html_content .= '<td style="padding-left:4px;">'.$homeinfo_email.'</td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
$html_content .= '<td style="padding-left:4px;"><strong>Telephonummer: </strong></td>';
$html_content .= '<td style="padding-left:4px;">'.$homeinfo_tel.'</td>';
$html_content .= '</tr>';
$html_content .= '<tr>';
$html_content .= '<td style="padding-left:4px;"><strong>Nachricht:</strong></td>';
$html_content .= '<td style="padding-left:4px;">'.$homeinfo_nachricht.'</td>';
$html_content .= '</tr>';
$html_content .= '</table>';
$html_content .= '</body>';
$html_content .= '</html>';

$mailer = new InsecurePHPMailer();
$mailer->IsSMTP();
$mailer->SMTPAuth = true;
$mailer->SMTPSecure = "ssl";
$mailer->Host = "mail2.homeinfo.de";
$mailer->Port = 465;
$mailer->Username = "web0p22";

// enables SMTP debug information (for testing)
// 1 = errors and messages
// 2 = messages only
//$mailer->SMTPDebug  = 1;

$mailer->Password = "d9MX1226mSWH";
$mailer->Subject = "Homeinfo.de Kontakt formular";
$mailer->AltBody = "Vorname und Nachname:".$homeinfo_vorname." ".$homeinfo_nachname." E-mail: ".$homeinfo_email." Telephonummer: ".$homeinfo_tel." Nachricht: ".$homeinfo_nachricht;
$mailer->MsgHTML($html_content);
$mailer->AddAddress("info@homeinfo.de");
$mailer->SetFrom("automailer@homeinfo.de");

//check if some fields are empty
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  if (!empty($homeinfo_vorname) && !empty($homeinfo_nachname) && !empty($homeinfo_email)) {

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
*/

//testing
echo '1';
?>
