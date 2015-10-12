////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL VARS & FUNCTIONS///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var immosearch_url = "https://tls.homeinfo.de/immosearch/customer/" + immosearch_customer_id + "/?";
var customer_img_dummy = "img/customer_dummy/dummy.png";
var customer_img_dummy_details = "img/customer_dummy/dummy_details.png";
var customer_logo = "img/customers_logos/" + immosearch_customer_id + ".png";
var empty_item_value = "---";
var selected_locations = [];//push and remove areas in the ckeckbox is checked
var build_locations_array = [];//this array should fill once
var build_locations_array_number = [];

//global arrays to clean up after (when append again in details page)
var immosearch_array_img = [];
var immosearch_array_details_object_attachment_pdf = [];
var immosearch_array_details_object_img_floor_plan = [];
var immosearch_array_details_object_img = [];

var sorting = "";
//var include = "freitexte,attachments";
var include = "freitexte";
//var attachments = "scaling:240x185,pictures:1";//on first load list (all objects in list)
//var attachments = "scaling:350x267,pictures:1";//on first load list (all objects in list)
var attachments = "";

//filter options
var zimmer_von = "";
var zimmer_bis = "";
var wohnflaeche_von = "";
var wohnflaeche_bis = "";
var grundmiete_von = "";
var grundmiete_bis = "";

//checkboxes
var terrasse = false;
var garten = false;
var balkon = false;
var wanne = false;
var dusche = false;
var aufzug = false;
var erdgeschoss = false;
var first_floor = false;
var second_floor = false;

var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) !== -1) {
                return data[i].identity;
            }
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) {
            return;
        }

        var rv = dataString.indexOf("rv:");
        if (this.versionSearchString === "Trident" && rv !== -1) {
            return parseFloat(dataString.substring(rv + 3));
        } else {
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        }
    },

    dataBrowser: [
        {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
        {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
        {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
        {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
        {string: navigator.userAgent, subString: "Safari", identity: "Safari"},
        {string: navigator.userAgent, subString: "Opera", identity: "Opera"}
    ]

};

BrowserDetect.init();
//console.log("BROWSER: " + BrowserDetect.browser);

// capitalise function (first char toUpperCase and all the rest toLowerCase)
function capitalise(string) {
  if (typeof string != 'undefined') {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  } else {
    return string;
  }
}

function format(num){
    var n = num.toString(), p = n.indexOf(',');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
        return p<0 || i<p ? ($0+'.') : $0;
    });
}

Array.prototype.remove_from_array = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function validateEmail($email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if(!emailReg.test($email)) {
		return false;
	} else {
		return true;
	}
}

//global vars for URL
function filter() {

	var result = "";

	if (zimmer_von != "") {
		if (result == "") {
			result = "zimmer>=" + zimmer_von;
		} else {
			result += " and zimmer>=" + zimmer_von;
		}
	}

	if (zimmer_bis != "") {
		if (result == "") {
			result = "zimmer<=" + zimmer_bis;
		} else {
			result += " and zimmer<=" + zimmer_bis;
		}
	}

	if (wohnflaeche_von != "") {
		if (result == "") {
			result = "wohnflaeche>=" + wohnflaeche_von;
		} else {
			result += " and wohnflaeche>=" + wohnflaeche_von;
		}
	}

	if (wohnflaeche_bis != "") {
		if (result == "") {
			result = "wohnflaeche<=" + wohnflaeche_bis;
		} else {
			result += " and wohnflaeche<=" + wohnflaeche_bis;
		}
	}

	if (grundmiete_von != "") {
		if (result == "") {
			result = "kaltmiete>=" + grundmiete_von;
		} else {
			result += " and kaltmiete>=" + grundmiete_von;
		}
	}

	if (grundmiete_bis != "") {
		if (result == "") {
			result = "kaltmiete<=" + grundmiete_bis;
		} else {
			result += " and kaltmiete<=" + grundmiete_bis;
		}
	}

	if (terrasse == true) {
		if (result == "") {
			result = "terrassen>>0";
		} else {
			result += " and terrassen>>0";
		}
	}

	if (garten == true) {
		if (result == "") {
			result = "garten>>0"
		} else {
			result += " and garten>>0"
		}
	}

	if (balkon == true) {
		if (result == "") {
			result = "balkone>>0";
		} else {
			result += " and balkone>>0";
		}
	}

	if (wanne == true) {
		if (result == "") {
			result = "wanne>>0";
		} else {
			result += " and wanne>>0";
		}
	}

	if (dusche == true) {
		if (result == "") {
			result = "dusche>>0";
		} else {
			result += " and dusche>>0";
		}
	}

	if (aufzug == true) {
		if (result == "") {
			result = "aufzug>>0";
		} else {
			result += " and aufzug>>0";
		}
	}

	var etage = etageFilter();
	if (etage != "") {
		if (result == "") {
			result = etage;
		} else {
			result += " and " + etage;
		}
	}

	var location = locationFilter();
	if (location != "") {
		if (result == "") {
			result = location;
		} else {
			result += " and " + location;
		}
	}

	return result;

}

function locationFilter() {
	var current_item = "";
	var result = "";

	for(var i = 0; i < selected_locations.length; i++) {
		current_item = selected_locations[i];

		if (result == "") {
			result = "ortsteil==" + current_item;
		} else {
			result += " or ortsteil==" + current_item;
		}

	}

	if (result == "") {
		return result;
	} else {
		return "(" + result + ")";
	}

}

function etageFilter() {
	var result = "";

	if (erdgeschoss == true) {
		if (result == "") {
			result = "etage==0";
		} else {
			result += " or etage==0";
		}
	}

	if (first_floor == true) {
		if (result == "") {
			result = "etage==1";
		} else {
			result += " or etage==1";
		}
	}

	if (second_floor == true) {
		if (result == "") {
			result = "etage>=2";
		} else {
			result += " or etage>=2";
		}
	}

	if (result == "") {
		return result;
	} else {
		return "(" + result + ")";
	}
}

//browsers checking
if (window.File && window.FileReader && window.FileList && window.Blob) {
	//console.log('Great success! All the File APIs are supported.');
} else {
	console.log('The File APIs are not fully supported in this browser!');
}

function replaceCommaWithDot(str) {
	return str.replace(",", ".");
}

function replaceDotWithComma(value) {
  return value.replace(".", ",");
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function ifLastCharIsOnlyOneNull(str) {
	var afterComma = str.substr(str.indexOf(",") + 1);
	var char_length = afterComma.length;
	if (char_length == 1) {
		return str + "0";
	} else {
		return str;
	}
}

function afterCommaKeep2Char(str) {
  var afterCommaKeep2Char = str;
  var valueBeforeComma = str.substr(0, str.indexOf(','));
  if (afterCommaKeep2Char.indexOf(',') > -1) {//check if value has comma
    afterCommaKeep2Char = afterCommaKeep2Char.substr(afterCommaKeep2Char.indexOf(",") + 1)
    //return valueBeforeComma + "," + "<sup>" + afterCommaKeep2Char.substr(0, 2) + "</sup>";
    return valueBeforeComma + "," + afterCommaKeep2Char.substr(0, 2);
  } else {//else return the original value
    return str;
  }
}

//Base64
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

function checkIfNumberStartsFromZero(object_number) {
  if (object_number.charAt(2) == 0) {//get first 000
    return object_number.substr(3);
  } else if (object_number.charAt(1) == 0) {//get first 00
    return object_number.substr(2);
  } else if (object_number.charAt(0) == 0) {//get first 0
    return object_number.substr(1);
  }
}

function roundNumber(num, dec) {
   var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
   return result;
}

function getText(obj) {
    return obj.textContent ? obj.textContent : obj.innerText;
}

//escape HTML and return code names (because there is no build in functionj in Javascript yet)
function escapeHtml(unsafe) {
	//DOMPurify to sanitize HTML and prevents XSS attacks
  /*
  return DOMPurify.sanitize(unsafe
  	.replace(/&/g, "&amp;")
  	.replace(/</g, "&lt;")
  	.replace(/>/g, "&gt;")
  	.replace(/"/g, "&quot;")
  	.replace(/'/g, "&#039;"));
  */
    return unsafe;
}

function group_ortsteil(iterable) {
	var result = {};
	var len = iterable.length;

	for (var i = 0; i < len; i++) {
		match = false;
		for (var key in result) {
			if (key == iterable[i]) {
				result[key] = result[key] + 1;
				match = true;
				break;
			}
		}
		if (match == false) {
			result[iterable[i]] = 1;
		}
	}
	return result;
}

function removeAfterCertainCharacter(string, character) {
	//remove evrything after the dynamic character parameter
	return string.substring(0, string.indexOf(character));
}

function isOdd(num) {
	return num % 2;
}

function check_if_element_exists_boolean(element) {
  if (typeof(element) == 'undefined' && element == null) {
    return false;//element does not exists
  } else {
    return true;//element exists
  }
}

//global function details page by object id
function homeinfo_immosearch_details(object_id) {

	//document ready
	$(document).ready(function() {

    //check if the advance settings area is visible, if so hide it
    if($("#immo_erweiterte_suche_form").is(':visible')) {
      //$("#immo_erweiterte_suche_form").hide();
    }

		//ajax immosearch
		$.ajax({
			//url: immosearch_url + "filter=openimmo_obid==" + object_id + "&include=freitexte,attachments&attachments=scaling:650x488,pictures:15,floorplans:15,documents:15",
      url: immosearch_url + "filter=openimmo_obid==" + object_id + "&include=freitexte",
			crossDomain: true,
			type: "GET",
			dataType: "xml",
			cache: false,
			beforeSend: function() {
				$("#immo_data").empty();
        $('#details_page_print').unbind();
				$("#immo_data").append('<img src="img/preloader/preloader.gif" width="32" height="32" />');
			},
			success: function (xml) {
				if ($(xml).find("ns1\\:rsp").children().length >= 0) {
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//PARSE DETAILS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					var xml_namespace = $(xml).find("ns1\\:rsp");//console.log(xml_namespace);
					var anbieterCustomerId = escapeHtml($(xml).find("anbieternr").text());//console.log("CUSTOMER ID: " + anbieterCustomerId);
					var anbieterFirmName = escapeHtml($(xml).find("anbieternr").next().text());//console.log("FIRM NAME: " + anbieterFirm);
					//var findAllImmoText = escapeHtml($(xml).find("immobilie").text());
					//console.log("XML NAMESPACE: " + xml_namespace);
					//console.log("ANBIETER CUSTOMER ID: " + anbieterCustomerId);
					//console.log("ANBIETER FIRM NAME: " + anbieterFirmName);
					//console.log("ALL IMMOBILIENS TEXT: " + findAllImmoText);

					$("#immo_data").empty();//empty page

					//vars
					var total_counter = 0;
          var immosearch_var_object_details_wbs_val = "";
          var immosearch_var_details_object_heizkostennetto = "";
          var immosearch_var_details_object_heizkosten_enthalten = "";
          var immosearch_var_details_object_heizkosten = "";
          var immosearch_var_details_object_etage = "";
          var immosearch_var_details_object_nebenkosten = "";
          var immosearch_var_details_object_kaltmiete = "";
          var immosearch_var_details_object_provisionspflichtig = "";
          var immosearch_var_details_object_primaerenergietraeger = "";
          var immosearch_var_details_object_baujahr = "";
          var immosearch_var_details_object_objnumber = "";
          var immosearch_array_object_balkon = "";
          var immosearch_array_object_ausstatt_beschr = "";
          var immosearch_array_object_objektnr_intern = "";
          var immosearch_var_details_kontakt__email_zentrale = "";
          var immosearch_var_details_kontakt__tel_zentrale = "";
          var immosearch_var_details_kontakt__tel_fax = "";
          var immosearch_var_details_kontakt__name = "";
          var immosearch_var_details_kontakt__strasse = "";
          var immosearch_var_details_kontakt__hausnummer = "";
          var immosearch_var_details_kontakt__plz = "";
          var immosearch_var_details_kontakt__ort = "";

					//arrays
          immosearch_array_details_object_attachment_pdf = [];
          immosearch_array_details_object_img_floor_plan = [];
					immosearch_array_details_object_img = [];
					var immosearch_array_details_object_address = [];
					var immosearch_array_details_object_address_number = [];
					var immosearch_array_details_object_plz_number = [];
					var immosearch_array_details_object_ort = [];
					var immosearch_array_details_object_zimmer = [];
					var immosearch_array_details_object_wohnflaeche = [];
					var immosearch_array_details_object_gesamtmiete = [];
					var immosearch_array_details_object_nettokaltmiete = [];
					var immosearch_array_details_object_object_number = [];
					var immosearch_array_details_object_ortsteil = [];
					var immosearch_array_details_object_ausstattung = [];
          var immosearch_array_details_object_verfugbar_ab = [];
          var immosearch_array_details_object_betriebskosten = [];
          var immosearch_array_details_object_kaution = [];
          var immosearch_var_details_object_ausstattung_befeuerung = [];
          var immosearch_var_details_object_user_defined_anyfield = [];

          //energiepass
          var details_energiepass_epart = escapeHtml($(xml).find("energiepass epart").text());
          var details_energiepass_energieverbrauchkennwert = escapeHtml($(xml).find("energiepass energieverbrauchkennwert").text());
          var details_energiepass_endenergiebedarf = escapeHtml($(xml).find("energiepass endenergiebedarf").text());
          var details_energiepass_mitwarmwasser = escapeHtml($(xml).find("energiepass mitwarmwasser").text());

					$(xml).find("immobilie").each(function(i) {
            //push the images (normal images and floor plans) in separate arrays
						$(xml).find("anhang").each(function(i) {
              if ($(this).attr("gruppe") == "BILD" || $(this).attr("gruppe") == "TITELBILD") {
                if ($(this).attr("location") == "REMOTE") {
                  var normal_images_url = $(this).children().find("pfad").text();
                  if (normal_images_url) {
                    immosearch_array_details_object_img.push(normal_images_url);//push url
                  } else {
                    immosearch_array_details_object_img.push(customer_img_dummy_details);//dummy image
                  }
                } else if ($(this).attr("location") == "INTERN") {
                  var normal_images = $(this).children().find("anhanginhalt").text();//push base64 data
                  if (normal_images) {
                    immosearch_array_details_object_img.push("data:image/jpeg;base64," + normal_images);
                  } else {
                    immosearch_array_details_object_img.push(customer_img_dummy_details);//dummy image
                  }
                }
              } else if ($(this).attr("gruppe") == "GRUNDRISS") {
                if ($(this).attr("location") == "REMOTE") {
                  var floor_plan_images_url = $(this).children().find("pfad").text();
                  if (floor_plan_images_url) {
                    immosearch_array_details_object_img_floor_plan.push(floor_plan_images_url);//push url
                  } else {
                    immosearch_array_details_object_img_floor_plan.push(customer_img_dummy_details);//dummy image
                  }
                } else if ($(this).attr("location") == "INTERN") {
                  var floor_plan_images = $(this).children().find("anhanginhalt").text();
                  if (floor_plan_images) {
                    immosearch_array_details_object_img_floor_plan.push("data:image/jpeg;base64," + floor_plan_images);//push base64 data
                  } else {
                    immosearch_array_details_object_img_floor_plan.push(customer_img_dummy_details);//dummy image
                  }
                }
              } else if ($(this).attr("gruppe") == "DOKUMENTE") {
                if ($(this).attr("location") == "REMOTE") {
                  var document_file_pdf_url = $(this).children().find("pfad").text();
                  if (document_file_pdf_url) {
                    immosearch_array_details_object_attachment_pdf.push(document_file_pdf_url);
                  }
                } else if ($(this).attr("location") == "INTERN") {
                  var document_file_pdf = $(this).children().find("anhanginhalt").text();
                  if (document_file_pdf) {
                    immosearch_array_details_object_attachment_pdf.push("data:application/pdf;base64," + document_file_pdf);
                  }
                }
              }
						});

            //check the length of the array and add 1 dummy if is 0
            if (immosearch_array_details_object_img.length == 0) {
              immosearch_array_details_object_img.push(customer_img_dummy_details);//dummy image
            }

            //trace
            //console.log("IMAGE ARRAY LENGTH: " + immosearch_array_details_object_img.length);
            //console.log("IMAGE ARRAY DATA: " + immosearch_array_details_object_img);
            //console.log("PDF ARRAY: " + immosearch_array_details_object_attachment_pdf.length);
            //console.log("PDF ARRAY DATA: " + immosearch_array_details_object_attachment_pdf);

						//arrays to fill with data
						immosearch_array_details_object_address.push(escapeHtml($(this).find("geo strasse").text()));
						immosearch_array_details_object_address_number.push(escapeHtml($(this).find("geo hausnummer").text()));
						immosearch_array_details_object_plz_number.push(escapeHtml($(this).find("geo plz").text()));
						immosearch_array_details_object_ort.push(escapeHtml($(this).find("geo ort").text()));
						immosearch_array_details_object_zimmer.push(escapeHtml($(this).find("flaechen anzahl_zimmer").text()));
						immosearch_array_details_object_wohnflaeche.push(escapeHtml($(this).find("flaechen wohnflaeche").text()));
						immosearch_array_details_object_gesamtmiete.push(escapeHtml($(this).find("preise warmmiete").text()));
						immosearch_array_details_object_nettokaltmiete.push(escapeHtml($(this).find("preise nettokaltmiete").text()));
						immosearch_array_details_object_object_number.push(escapeHtml($(this).find("verwaltung_techn openimmo_obid").text()));
						immosearch_array_details_object_ortsteil.push(escapeHtml($(this).find("geo regionaler_zusatz").text()));
            immosearch_array_details_object_verfugbar_ab.push(escapeHtml($(this).find("verwaltung_objekt verfuegbar_ab").text()));
            immosearch_array_details_object_betriebskosten.push(escapeHtml($(this).find("preise betriebskostenust").text()));//////////////
            immosearch_array_details_object_kaution.push(escapeHtml($(this).find("preise kaution").text()));//////////////

            //vars to fill with data
            immosearch_var_details_object_kaltmiete = escapeHtml($(this).find("preise kaltmiete").text());
            immosearch_var_details_object_etage = escapeHtml($(this).find("geo etage").text());
            immosearch_var_object_details_wbs_val = escapeHtml($(this).find("verwaltung_objekt wbs_sozialwohnung").text());
            immosearch_var_details_object_heizkostennetto = escapeHtml($(this).find("preise heizkostennetto").text());//decimal
            immosearch_var_details_object_heizkosten_enthalten = escapeHtml($(this).find("preise heizkosten_enthalten").text());//boolean
            immosearch_var_details_object_heizkosten = escapeHtml($(this).find("preise heizkosten").text());//decimal
            immosearch_var_details_object_nebenkosten = escapeHtml($(this).find("preise nebenkosten").text());
            immosearch_var_details_object_provisionspflichtig = escapeHtml($(this).find("preise provisionspflichtig").text());
            immosearch_var_details_object_primaerenergietraeger = escapeHtml($(this).find("energiepass primaerenergietraeger").text());
            immosearch_var_details_object_baujahr = escapeHtml($(this).find("zustand_angaben baujahr").text());
            immosearch_var_details_object_objnumber = escapeHtml($(this).find("verwaltung_techn openimmo_obid").text());
            immosearch_array_object_balkon = escapeHtml($(this).find("flaechen anzahl_balkone").text());
            immosearch_array_object_ausstatt_beschr = escapeHtml($(this).find("freitexte ausstatt_beschr").text());
            immosearch_array_object_objektnr_intern  = escapeHtml($(this).find("verwaltung_techn objektnr_intern").text());

            //kontakt details
            immosearch_var_details_kontakt__email_zentrale = escapeHtml($(this).find("kontaktperson email_zentrale").text());
            immosearch_var_details_kontakt__tel_zentrale = escapeHtml($(this).find("kontaktperson tel_zentrale").text());
            immosearch_var_details_kontakt__tel_fax = escapeHtml($(this).find("kontaktperson tel_fax").text());
            immosearch_var_details_kontakt__name = escapeHtml($(this).find("kontaktperson name").text());
            immosearch_var_details_kontakt__strasse = escapeHtml($(this).find("kontaktperson strasse").text());
            immosearch_var_details_kontakt__hausnummer = escapeHtml($(this).find("kontaktperson hausnummer").text());
            immosearch_var_details_kontakt__plz = escapeHtml($(this).find("kontaktperson plz").text());
            immosearch_var_details_kontakt__ort = escapeHtml($(this).find("kontaktperson ort").text());

            // Wesentlicher Energieträger
            $(xml).find("ausstattung befeuerung").each(function() {
              $.each(this.attributes, function(i, attrib){
                 var name = attrib.name;
                 var value = attrib.value;
                 //console.log("NAME: " + name);
                 //console.log("VALUE: " + value);
                 if (value == "true") {
                   immosearch_var_details_object_ausstattung_befeuerung.push(name);
                 }
              });
            });

            $(xml).find("user_defined_anyfield").each(function() {
              //console.log("user_defined_anyfield: " + $(this).find('[fieldname="etage"]').text() );
              immosearch_var_details_object_user_defined_anyfield.push($(this).find('[fieldname="etage"]').text());
            });

					});//$(xml).find("immobilie").each(function(i) {

					//Ausstattung parser (needs to be outside of "immobilie" each loop)
					$(xml).find("ausstattung").each(function(i) {
						//console.log("AUSSTATTUNG GROUP LENGTH: " + $(this).children().length);//trace

						//check the length of the <tags>
						if ($(this).children().length > 0) {
							immosearch_array_details_object_ausstattung.push([]);//add anonymous array in immosearch_array_object_ausstattung array (multidimensional array)
							var total_details_group_length = $(this).children().length;
							for(var i_inner = 0; i_inner < total_details_group_length; i_inner++) {
								var object_details_ausstattung = $(this).children()[i_inner].nodeName;
								//console.log("AUSSTATTUNG NODE NAMES: " + object_details_ausstattung);//trace

								//check the node names and push in database
								if (object_details_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("DUSCHE") == "true") {
									immosearch_array_details_object_ausstattung[i].push("Dusche");
								} else if (object_details_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("WANNE") == "true") {
									immosearch_array_details_object_ausstattung[i].push("Badewanne");
								} else if (object_details_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("FENSTER") == "true") {
									immosearch_array_details_object_ausstattung[i].push("Badezimmerfenster");
								} else if (object_details_ausstattung == "kueche" && $(this).children()[i_inner].getAttribute("EBK") == "true") {
									immosearch_array_details_object_ausstattung[i].push("EBK");
								} else if (object_details_ausstattung == "kamin" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("Kamin");
								} else if (object_details_ausstattung == "klimatisiert" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("Klimatisiert");
								} else if (object_details_ausstattung == "fahrstuhl" && $(this).children()[i_inner].getAttribute("PERSONEN") == "true" || $(this).children()[i_inner].getAttribute("LASTEN") == "true") {
									immosearch_array_details_object_ausstattung[i].push("Aufzug");
								} else if (object_details_ausstattung == "gartennutzung" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("Gartennutzung");
								} else if (object_details_ausstattung == "moebliert" && $(this).children()[i_inner].getAttribute("moeb") == "VOLL" || $(this).children()[i_inner].getAttribute("moeb") == "TEIL") {
									immosearch_array_details_object_ausstattung[i].push("Möbliert");
								} else if (object_details_ausstattung == "rollstuhlgerecht" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("Rollstuhlger");
								} else if (object_details_ausstattung == "kabel_sat_tv" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("Kabel Sat TV");
								} else if (object_details_ausstattung == "dvbt" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("DVBT");
								} else if (object_details_ausstattung == "barrierefrei" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("Barrierefrei");
								} else if (object_details_ausstattung == "sauna" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("Sauna");
								} else if (object_details_ausstattung == "wasch_trockenraum" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_details_object_ausstattung[i].push("Trockenraum");
								} else if (object_details_ausstattung == "unterkellert" && $(this).children()[i_inner].getAttribute("keller") == "JA" || $(this).children()[i_inner].getAttribute("keller") == "TEIL") {
									immosearch_array_details_object_ausstattung[i].push("Keller");
								}

                //console.log("------------------------------------------------------");//trace
							}
							//console.log("/////////////////////////////////////////////////////////////////////////////////////////");//trace
						}
					});

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//PARSE DETAILS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//SHOW DETAILS DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

          $("#top_menu_after_filter").show();
          $("#top_menu_line_after_filter").show();
          $("#details_page_back_to_list").show();
          $("#details_page_print").show();

          var details_address = immosearch_array_details_object_address[0];

          var details_address_number = immosearch_array_details_object_address_number[0];
          if (details_address_number.charAt(0) == 0) {//check if start with 0
            details_address_number = checkIfNumberStartsFromZero(immosearch_array_details_object_address_number[0]);
          } else {
            details_address_number = immosearch_array_details_object_address_number[0];
          }

          var details_address_plz_number = immosearch_array_details_object_plz_number[0];
          var details_address_ort = immosearch_array_details_object_ort[0];
          var details_address_ortsteil = immosearch_array_details_object_ortsteil[0];
          var immosearch_array_object_details_zimmer_val = removeAfterCertainCharacter(immosearch_array_details_object_zimmer[0], ".");

          if (typeof details_address == "undefined") {
            details_address = "";
          }

          if (typeof details_address_number == "undefined") {
            details_address_number = "";
          }

          if (typeof details_address_plz_number == "undefined") {
            details_address_plz_number = "";
          }

          if (typeof details_address_ort == "undefined") {
            details_address_ort = "";
          }

          if (typeof details_address_ortsteil == "undefined") {
            details_address_ortsteil = "";
          }

          var immosearch_details_element = '';

              immosearch_details_element += '<div class="container" class="col-md-6 col-sm-12 col-xs-12" style="float: left !important; margin-left:-15px;">';//put the content more together

              immosearch_details_element += '<div class="row-fluid" id="details_object_title" style="width:100%; margin-bottom:20px; margin-top:-98px;">';
              //immosearch_details_element += '<strong id="details_page_map" data-toggle="tooltip" data-placement="top" title="Karte" style="cursor:pointer; color:#aaa91f;"><span class="label label-default" style="background-color:#aaa91f; color:#FFFFFF;">' + immosearch_array_object_details_zimmer_val + ' Zimmer Wohnung in ' + details_address + ' ' + details_address_number + ', ' + details_address_plz_number + ' ' + details_address_ort + ' - ' + details_address_ortsteil + '</span></strong>';


              immosearch_details_element += '<div class="panel panel-default" style="background-color:#aaa91f; color:#FFFFFF;">';
              immosearch_details_element += '<div class="panel-body">';
              immosearch_details_element += '<strong id="details_page_map" data-toggle="tooltip" data-placement="top" title="Karte" style="cursor:pointer;">' + immosearch_array_object_details_zimmer_val + ' Zimmer Wohnung | ' + details_address + ' ' + details_address_number + ' | ' + details_address_plz_number + ' ' + details_address_ort + ' - ' + details_address_ortsteil + '</strong>';
              immosearch_details_element += '</div>';
              immosearch_details_element += '</div>';

              //object number
              if (typeof immosearch_var_details_object_objnumber != "undefined" && immosearch_var_details_object_objnumber) {
                //immosearch_details_element += '<span class="label label-default" style="background-color:#f5f5f5; color:#333333; border: solid 1px; border-color: #F2F2F2; -moz-border-radius: 5px; -webkit-border-radius: 5px; -khtml-border-radius: 5px; border-radius: 5px;"><strong>Wohnungsnr: </strong> ' + immosearch_var_details_object_objnumber + '</span>';
                immosearch_details_element += '<button type="button" class="btn btn-specialBtnKA-bgw btn-xs" style="cursor: default;"><strong>Wohnungsnr: </strong> ' + immosearch_var_details_object_objnumber + '</button>';
                //immosearch_details_element += '<br><span style="color:#888888;"><strong>Wohnungsnr: </strong> ' + immosearch_var_details_object_objnumber + '</span>';
              }

              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="row">';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';
              if (immosearch_array_details_object_img.length != 0) {
                immosearch_details_element += '<a href="javascript:void(0);" id="images_modal_click_event" data-toggle="modal" data-target="#imagesGalleryModal">';//link to open image gallery
                  //immosearch_details_element += '<img class="img-thumbnail" id="mypic" src="' + immosearch_array_details_object_img[0] + '" width="350" height="267" style="z-index:98;">';

                  //KENBURNS///////////////////////////////////////////////////////////////////////////////
                  if (immosearch_array_details_object_img.length != 1) {
                    immosearch_details_element += '<canvas id="mypic" class="kenburns" width="350" height="267">';
              				immosearch_details_element += '<p>Your browser doesnt support canvas!</p>';
              			immosearch_details_element += '</canvas>';

                    immosearch_details_element += '<script>';
                    immosearch_details_element += '$(document).ready(function() {';
                    immosearch_details_element += '$(".kenburns").kenburns({';
            					immosearch_details_element += 'images:[';
                      //array loop
                      immosearch_array_details_object_img.forEach(function(item) {
                        immosearch_details_element += '"' + item + '",';
                      });
                      //array loop
            					immosearch_details_element += '],';
            					immosearch_details_element += 'frames_per_second: 30,';
            					immosearch_details_element += 'display_time: 7000,';
            					immosearch_details_element += 'fade_time: 1000,';
            					immosearch_details_element += 'zoom: 2,';
            					immosearch_details_element += 'background_color:"#ffffff",';
            					immosearch_details_element += 'post_render_callback:function($canvas, context) {';
            						immosearch_details_element += 'context.save();';
            						immosearch_details_element += 'context.fillStyle = "#000";';
            						immosearch_details_element += 'context.font = "bold 20px sans-serif";';
            						immosearch_details_element += 'var width = $canvas.width();';
            						immosearch_details_element += 'var height = $canvas.height();';
            						immosearch_details_element += 'var text = "";';
            						immosearch_details_element += 'var metric = context.measureText(text);';
            						immosearch_details_element += 'context.fillStyle = "#fff";';
            						immosearch_details_element += 'context.shadowOffsetX = 3;';
            						immosearch_details_element += 'context.shadowOffsetY = 3;';
            						immosearch_details_element += 'context.shadowBlur = 4;';
            						immosearch_details_element += 'context.shadowColor = "rgba(0, 0, 0, 0.8)";';
            						immosearch_details_element += 'context.fillText(text, width - metric.width - 8, height - 8);';
            						immosearch_details_element += 'context.restore();';
            					immosearch_details_element += '}';
            				immosearch_details_element += '});';
                    immosearch_details_element += '});';
                    immosearch_details_element += '<\/script>';
                  } else {
                    //immosearch_details_element += '<img id="mypic" src="' + immosearch_array_details_object_img[0] + '" width="350" height="267" style="z-index:98;">';
                    immosearch_details_element += '<div class="img_mask">';
                    immosearch_details_element += '<img src="' + immosearch_array_details_object_img[0] + '" class="portrait" />';
                    immosearch_details_element += '</div>';
                  }
                  //KENBURNS///////////////////////////////////////////////////////////////////////////////

                  //kenburns/////////////////////////////////////////////////////////////////////////////////////////////
                  /*
                  //go for all array items
                  immosearch_details_element += '<div id="slideshow">';
                  immosearch_array_details_object_img.forEach(function(item) {
                    immosearch_details_element += '<img class="" id="mypic" src="' + item + '" width="350" height="267" style="z-index:98;">';
                  });
                  immosearch_details_element += '</div>';
                  immosearch_details_element += '<script src="js/jQuery.kenBurns.js"></script>';//load kenburns custom plugin
                  */
                  //kenburns/////////////////////////////////////////////////////////////////////////////////////////////

                immosearch_details_element += '</a>';//end - anchor tag
              } else {
                immosearch_details_element += '<img id="mypic" src="' + immosearch_array_details_object_img[0] + '" width="350" height="267" style="z-index:98;">';
              }

              immosearch_details_element += '<div class="caption" style="margin-top:10px;">';
                  immosearch_details_element += '<table>';
                      immosearch_details_element += '<tr>';
                          immosearch_details_element += '<td valign="top">';

                            if (immosearch_array_details_object_img.length == 0 || immosearch_array_details_object_img.length == 1) {
                              immosearch_details_element += '<p><span class="badge">' + immosearch_array_details_object_img.length + '</span> <span class="badge">Bild</span></p>';
                            } else {
                              immosearch_details_element += '<p><span class="badge">' + immosearch_array_details_object_img.length + '</span> <span class="badge">Bilder</span></p>';
                            }

                          immosearch_details_element += '</td>';
                          immosearch_details_element += '<td valign="top">';
                              immosearch_details_element += '<i class="fa fa-search" style="margin-left:10px;"></i>';
                          immosearch_details_element += '</td>';
                      immosearch_details_element += '</tr>';
                  immosearch_details_element += '</table>';
              immosearch_details_element += '</div>';//end - <div class="caption">

              immosearch_details_element += '<script>';
              immosearch_details_element += '$(document).ready(function() {';

                  immosearch_details_element += '$("#immo_title_angebote").hide();';//hide the title

                  //immosearch_details_element += '$("#myModalLabel").html($("#details_object_title").html());';

                  var popup_images_details_title = '<strong style=color:#aaa91f;>' + immosearch_array_object_details_zimmer_val + ' Zimmer Wohnung, ' + details_address + ' ' + details_address_number + ', ' + details_address_plz_number + ' ' + details_address_ort + ' - ' + details_address_ortsteil + '</strong>';

                  immosearch_details_element += '$("#myModalLabel").html("' + popup_images_details_title + '");';

                  immosearch_details_element += '$("#images_modal_click_event").click(function() {';
                      immosearch_details_element += '$("#image_source_gallery").attr("src", "' + immosearch_array_details_object_img[0] + '");';
                  immosearch_details_element += '});';

              immosearch_details_element += '});';
              immosearch_details_element += '<\/script>';
              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';
              if (immosearch_array_details_object_img_floor_plan.length != 0) {
                immosearch_details_element += '<a href="javascript:void(0);" id="images_modal_click_event_floor_plan" data-toggle="modal" data-target="#imagesGalleryModalFloorPlan">';//link to open image gallery
                //immosearch_details_element += '<img id="mypic" src="' + immosearch_array_details_object_img_floor_plan[0] + '" width="350" height="267">';
                immosearch_details_element += '<img id="mypic" src="' + immosearch_array_details_object_img_floor_plan[0] + '" style="display: block; max-width:350px; max-height:267px; width: auto; height: auto;">';
                immosearch_details_element += '</a>';//end - anchor tag
              } else {
                immosearch_details_element += '<img id="mypic" src="' + customer_img_dummy_details + '" width="350" height="267">';
              }

              immosearch_details_element += '<div class="caption" style="margin-top:10px;">';
                  immosearch_details_element += '<table>';
                      immosearch_details_element += '<tr>';
                          immosearch_details_element += '<td valign="top">';
                              immosearch_details_element += '<p><span class="badge">' + immosearch_array_details_object_img_floor_plan.length + '</span> <span class="badge">Grundriss</span></p>';
                          immosearch_details_element += '</td>';
                          immosearch_details_element += '<td valign="top">';
                              immosearch_details_element += '<i class="fa fa-search" style="margin-left:10px;"></i>';
                          immosearch_details_element += '</td>';
                      immosearch_details_element += '</tr>';
                  immosearch_details_element += '</table>';
              immosearch_details_element += '</div>';//end - <div class="caption">

              immosearch_details_element += '<script>';
              immosearch_details_element += '$(document).ready(function() {';

                  //immosearch_details_element += '$("#myModalLabel_floor_plan").html($("#details_object_title").html());';

                  var popup_images_details_title_grundris = '<strong style=color:#aaa91f;>' + immosearch_array_object_details_zimmer_val + ' Zimmer Wohnung, ' + details_address + ' ' + details_address_number + ', ' + details_address_plz_number + ' ' + details_address_ort + ' - ' + details_address_ortsteil + '</strong>';

                  immosearch_details_element += '$("#myModalLabel_floor_plan").html("' + popup_images_details_title_grundris + '");';

                  if (immosearch_array_details_object_img_floor_plan.length != 0) {
                    immosearch_details_element += '$("#images_modal_click_event_floor_plan").click(function() {';
                        immosearch_details_element += '$("#image_source_gallery_floor_plan").attr("src", "' + immosearch_array_details_object_img_floor_plan[0] + '");';
                    immosearch_details_element += '});';
                  }

              immosearch_details_element += '});';
              immosearch_details_element += '<\/script>';
              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="row-fluid" style="margin-top:30px; margin-bottom:30px;" id="top_separator">';
              immosearch_details_element += '&nbsp;';
              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';

              immosearch_details_element += '<p id="list_text_style">GRÖSSE & ZUSTAND</p>';//group title

              immosearch_details_element += '<table width="320px;">';

              //zimmer
              immosearch_details_element += '<tr>';
              immosearch_details_element += '<td>'
              immosearch_details_element += '<strong>Zimmer</strong>';
              immosearch_details_element += '</td>';
              immosearch_details_element += '<td id="text_align_right">';
              if (typeof immosearch_array_object_details_zimmer_val != "undefined" && immosearch_array_object_details_zimmer_val) {
                immosearch_details_element += immosearch_array_object_details_zimmer_val;
              } else {
                immosearch_details_element += '<p>K.A.</p>';
              }
              immosearch_details_element += '</td>';
              immosearch_details_element += '</tr>';

              //Wohnfläche
              immosearch_details_element += '<tr>';
              immosearch_details_element += '<td>'
              immosearch_details_element += '<strong>Wohnfläche</strong>';
              immosearch_details_element += '</td>';
              immosearch_details_element += '<td id="text_align_right">';
              var immosearch_array_object_details_wohnflaeche_val = immosearch_array_details_object_wohnflaeche[0];
              if (typeof immosearch_array_object_details_wohnflaeche_val != "undefined" && immosearch_array_object_details_wohnflaeche_val) {
                immosearch_details_element += immosearch_array_object_details_wohnflaeche_val.dot2comma() + ' m&#178;';
              } else {
                immosearch_details_element += 'K.A.';
              }
              immosearch_details_element += '</td>';
              immosearch_details_element += '</tr>';

              //etage
              if (typeof immosearch_var_details_object_etage != "undefined" && immosearch_var_details_object_etage) {
                //check for etage value and modify
                if (immosearch_var_details_object_etage  == 0) {
                  //floor
                  immosearch_details_etage_string = "EG";
                } else if (immosearch_var_details_object_etage  < 0) {
                  //basement
                  immosearch_details_etage_string = "Souterrain";
                } else if (immosearch_var_details_object_etage  > 0) {
                  //floor
                  immosearch_details_etage_string = immosearch_var_details_object_etage  + ". OG";
                }
                //attach the custom value
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>'
                immosearch_details_element += '<strong>Etage</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">'
                immosearch_details_element += immosearch_details_etage_string;
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              } else {
                var user_defined_etage = immosearch_var_details_object_user_defined_anyfield[0];
                if (typeof user_defined_etage != "undefined" && user_defined_etage) {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>'
                  immosearch_details_element += '<strong>Etage</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">'
                  immosearch_details_element += user_defined_etage;
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                } else {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>'
                  immosearch_details_element += '<strong>Etage</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">'
                  immosearch_details_element += 'K.A.';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              }

              immosearch_details_element += '<tr>';
              immosearch_details_element += '<td>'
              immosearch_details_element += '<strong>WBS</strong>';
              immosearch_details_element += '</td>';
              immosearch_details_element += '<td id="text_align_right">';
              //immosearch_array_details_object_wbs
              if (typeof immosearch_var_object_details_wbs_val != "undefined" && immosearch_var_object_details_wbs_val) {
                if (immosearch_var_object_details_wbs_val == "true") {
                  immosearch_details_element += 'erforderlich';
                } else if (immosearch_var_object_details_wbs_val == "false") {
                  immosearch_details_element += 'nicht erforderlich';
                }
              }
              //check if element exists
              if ($(xml).find('wbs_sozialwohnung').children().length == 0) {
                immosearch_details_element += 'nicht erforderlich';
              }
              immosearch_details_element += '</td>';
              immosearch_details_element += '</tr>';

              immosearch_details_element += '</table>';
              immosearch_details_element += '<br><br>';

              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';

              immosearch_details_element += '<p id="list_text_style">PREISE & KOSTEN</p>';

              immosearch_details_element += '<table width="320px;">';

              var immosearch_array_object_details_grundmiete_val = immosearch_array_details_object_nettokaltmiete[0];
              if (typeof immosearch_array_object_details_grundmiete_val != "undefined" && immosearch_array_object_details_grundmiete_val) {
                immosearch_array_object_details_grundmiete_val = immosearch_array_object_details_grundmiete_val.dot2comma();
                immosearch_array_object_details_grundmiete_val = ifLastCharIsOnlyOneNull(immosearch_array_object_details_grundmiete_val);

                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>';
                immosearch_details_element += '<strong>Grundmiete:</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">';
                immosearch_details_element += immosearch_array_object_details_grundmiete_val + ' &euro;';
                $("#form_miete_nk").html(immosearch_array_object_details_grundmiete_val + ' &euro;');//form
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              } else {
                if (typeof immosearch_var_details_object_kaltmiete != "undefined" && immosearch_var_details_object_kaltmiete) {
                  immosearch_var_details_object_kaltmiete = immosearch_var_details_object_kaltmiete.dot2comma();
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>';
                  immosearch_details_element += '<strong>Grundmiete:</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += ifLastCharIsOnlyOneNull(immosearch_var_details_object_kaltmiete) + ' &euro;';
                  $("#form_miete_nk").html(ifLastCharIsOnlyOneNull(immosearch_var_details_object_kaltmiete) + ' &euro;');//form
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                } else {
                  //K.A
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>';
                  immosearch_details_element += '<strong>Grundmiete:</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += 'K.A.';
                  $("#form_miete_nk").html('K.A.');//form
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              }

              if (typeof immosearch_var_details_object_nebenkosten != "undefined" && immosearch_var_details_object_nebenkosten) {
                immosearch_var_details_object_nebenkosten = immosearch_var_details_object_nebenkosten.dot2comma();
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>';
                immosearch_details_element += '<strong>Betriebskosten:</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">';
                immosearch_details_element += ifLastCharIsOnlyOneNull(immosearch_var_details_object_nebenkosten) + ' &euro;';
                $("#form_nebenkosten").html(ifLastCharIsOnlyOneNull(immosearch_var_details_object_nebenkosten) + ' &euro;');//form
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              } else {
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>';
                immosearch_details_element += '<strong>Betriebskosten:</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">';
                immosearch_details_element += 'K.A.';
                $("#form_nebenkosten").html('K.A.');//form
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              }



              if (typeof immosearch_var_details_object_heizkostennetto != "undefined" && immosearch_var_details_object_heizkostennetto) {
                immosearch_var_details_object_heizkostennetto = immosearch_var_details_object_heizkostennetto.dot2comma();
                immosearch_var_details_object_heizkostennetto = ifLastCharIsOnlyOneNull(immosearch_var_details_object_heizkostennetto);
                if (immosearch_var_details_object_heizkostennetto == "0,00") {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td style="vertical-align: top;">';
                  immosearch_details_element += '<strong>Heizkosten:</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += 'werden direkt mit dem Energieversorger abgerechnet';
                  $("#form_heizkosten").html('werden direkt mit dem Energieversorger abgerechnet');//form
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                } else {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td style="vertical-align: top;">';
                  immosearch_details_element += '<strong>Heizkosten:</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += immosearch_var_details_object_heizkostennetto + ' &euro;';
                  $("#form_heizkosten").html(immosearch_var_details_object_heizkostennetto + ' &euro;');//form
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              } else {
                if (typeof immosearch_var_details_object_heizkosten != "undefined" && immosearch_var_details_object_heizkosten) {
                  immosearch_var_details_object_heizkosten = immosearch_var_details_object_heizkosten.dot2comma();
                  immosearch_var_details_object_heizkosten = ifLastCharIsOnlyOneNull(immosearch_var_details_object_heizkosten);
                  if (immosearch_var_details_object_heizkosten == "0,00") {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td style="vertical-align: top;">';
                    immosearch_details_element += '<strong>Heizkosten:</strong>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '<td id="text_align_right">';
                    immosearch_details_element += 'werden direkt mit dem Energieversorger abgerechnet';
                    $("#form_heizkosten").html('werden direkt mit dem Energieversorger abgerechnet');//form
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  } else {
                    immosearch_details_element += '<tr>';
                    immosearch_details_element += '<td style="vertical-align: top;">';
                    immosearch_details_element += '<strong>Heizkosten:</strong>';
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '<td id="text_align_right">';
                    immosearch_details_element += immosearch_var_details_object_heizkosten + ' &euro;';
                    $("#form_heizkosten").html(immosearch_var_details_object_heizkosten + ' &euro;');//form
                    immosearch_details_element += '</td>';
                    immosearch_details_element += '</tr>';
                  }
                } else {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>';
                  immosearch_details_element += '<strong>Heizkosten:</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += 'K.A.';
                  $("#form_heizkosten").html('K.A.');//form
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              }

              //fix the gasamtmiete value
              var immosearch_var_details_object_gesamtmiete_mix_value = "";
              if (immosearch_var_details_object_heizkosten_enthalten == true) {
                immosearch_var_details_object_gesamtmiete_mix_value = parseFloat(immosearch_array_details_object_nettokaltmiete[0]) + parseFloat(immosearch_var_details_object_nebenkosten);
              } else {
                immosearch_var_details_object_gesamtmiete_mix_value = parseFloat(immosearch_array_details_object_nettokaltmiete[0]) + parseFloat(immosearch_var_details_object_nebenkosten) + parseFloat(immosearch_var_details_object_heizkosten);
              }
              immosearch_var_details_object_gesamtmiete_mix_value = JSON.stringify(immosearch_var_details_object_gesamtmiete_mix_value);//modify from object to string
              immosearch_var_details_object_gesamtmiete_mix_value = immosearch_var_details_object_gesamtmiete_mix_value.dot2comma();//replace dot with comma
              immosearch_var_details_object_gesamtmiete_mix_value = ifLastCharIsOnlyOneNull(immosearch_var_details_object_gesamtmiete_mix_value);
              //append the value
              if (typeof immosearch_var_details_object_gesamtmiete_mix_value != "undefined" && immosearch_var_details_object_gesamtmiete_mix_value) {
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>';
                immosearch_details_element += '<strong>Gesamtmiete:</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">';
                immosearch_details_element += afterCommaKeep2Char(immosearch_var_details_object_gesamtmiete_mix_value) + ' &euro;';
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              } else {
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>';
                immosearch_details_element += '<strong>Gesamtmiete:</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">';
                immosearch_details_element += 'K.A.';
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              }

              var immosearch_array_object_details_kaution_val = immosearch_array_details_object_kaution[0];
              immosearch_array_object_details_kaution_val = numberWithCommas(immosearch_array_object_details_kaution_val);
              if (typeof immosearch_array_object_details_kaution_val != "undefined" && immosearch_array_object_details_kaution_val) {
                //immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.dot2comma();
                //immosearch_array_object_details_kaution_val = ifLastCharIsOnlyOneNull(immosearch_array_object_details_kaution_val);
                if (immosearch_array_details_object_kaution[0] > 1000) {
                  function numberCommaToDot(x) {
                      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  }
                  String.prototype.replaceAt=function(index, character) {
                      return this.substr(0, index) + character + this.substr(index+character.length);
                  }
                  immosearch_array_object_details_kaution_val = immosearch_array_details_object_kaution[0];
                  immosearch_array_object_details_kaution_val = numberCommaToDot(immosearch_array_object_details_kaution_val);
                  var pos = immosearch_array_object_details_kaution_val.lastIndexOf(".");
                  //immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.substring(0, pos);
                  //console.log("VALUE: " + immosearch_array_object_details_kaution_val);
                  //console.log("VALUE: " + immosearch_array_object_details_kaution_val.replaceAt(pos, ","));
                  immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.replaceAt(pos, ",");
                } else {
                  function numberCommaToDot(x) {
                      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  }
                  String.prototype.replaceAt=function(index, character) {
                      return this.substr(0, index) + character + this.substr(index+character.length);
                  }
                  immosearch_array_object_details_kaution_val = immosearch_array_details_object_kaution[0];
                  immosearch_array_object_details_kaution_val = numberCommaToDot(immosearch_array_object_details_kaution_val);
                  //console.log("KAUTION VAL: " + immosearch_array_object_details_kaution_val);
                  var pos = immosearch_array_object_details_kaution_val.lastIndexOf(".");
                  //immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.substring(0, pos);
                  //console.log("VALUE: " + immosearch_array_object_details_kaution_val);
                  //console.log("VALUE: " + immosearch_array_object_details_kaution_val.replaceAt(pos, ","));
                  immosearch_array_object_details_kaution_val = immosearch_array_object_details_kaution_val.replaceAt(pos, ",");
                }
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>';
                immosearch_details_element += '<strong>Kaution:</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">';
                immosearch_details_element += ifLastCharIsOnlyOneNull(immosearch_array_object_details_kaution_val) + ' &euro;';
                $("#form_kaution").html(ifLastCharIsOnlyOneNull(immosearch_array_object_details_kaution_val) + ' &euro;');//form
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              } else {
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>';
                immosearch_details_element += '<strong>Kaution:</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">';
                immosearch_details_element += 'K.A.';
                $("#form_kaution").html('K.A.');//form
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              }

              var immosearch_array_object_details_verfugbar_ab_val = immosearch_array_details_object_verfugbar_ab[0];
              var d_xml = Date.parse(immosearch_array_object_details_verfugbar_ab_val);
              var today_date = new Date();
              var today_month = today_date.getMonth() + 1;
              var today_day = today_date.getDate();
              var today_date_output = (today_day<10 ? '0' : '') + today_day + '.' + (today_month<10 ? '0' : '') + today_month + '.' + today_date.getFullYear();
              var xml_date = immosearch_array_details_object_verfugbar_ab[0]
              if (typeof immosearch_array_object_details_verfugbar_ab_val != "undefined" && immosearch_array_object_details_verfugbar_ab_val) {
                if (xml_date >= today_date_output) {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>'
                  immosearch_details_element += '<strong>Verfügbar ab</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">'
                  immosearch_details_element += immosearch_array_object_details_verfugbar_ab_val;
                  $("#form_verfugbar_ab").html(immosearch_array_object_details_verfugbar_ab_val);//form
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                } else {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>'
                  immosearch_details_element += '<strong>Verfügbar ab</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">'
                  immosearch_details_element += 'sofort';
                  $("#form_verfugbar_ab").html('sofort');//form
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              } else {
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>'
                immosearch_details_element += '<strong>Verfügbar ab</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">'
                immosearch_details_element += 'K.A.';
                $("#form_verfugbar_ab").html('K.A.');//form
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              }

              if (typeof immosearch_var_details_object_provisionspflichtig != "undefined" && immosearch_var_details_object_provisionspflichtig) {
                if (immosearch_var_details_object_provisionspflichtig == "false" || immosearch_var_details_object_provisionspflichtig == "") {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>'
                  immosearch_details_element += '<strong>Provisionsfrei</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">'
                  immosearch_details_element += 'ja';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              }

              immosearch_details_element += '</table>';
              immosearch_details_element += '<br><br>';

              immosearch_details_element += '</div>';

              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="row">';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';

              immosearch_details_element += '<p id="list_text_style">ENERGIEMERKMALE</p>';

              immosearch_details_element += '<table width="320px;">';

              if (typeof details_energiepass_epart != "undefined" && details_energiepass_epart) {
                var epassTyp;
                if (details_energiepass_epart == "VERBRAUCH") {
                  //epassTyp = "Endenergieverbrauch";
                  epassTyp = "Energieausweistyp";
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>';
                  immosearch_details_element += '<strong>' + epassTyp +'</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += 'Verbrauchsausweis';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                  if (typeof details_energiepass_energieverbrauchkennwert != "undefined" && details_energiepass_energieverbrauchkennwert) {
                    if (isNaN(details_energiepass_energieverbrauchkennwert)) {
                      //immosearch_details_element += '<p><strong>Endenergieverbrauch:</strong> ' + details_energiepass_energieverbrauchkennwert.dot2comma() + '</p>';
                      immosearch_details_element += '<tr>';
                      immosearch_details_element += '<td>';
                      immosearch_details_element += '<strong>Endenergieverbrauch</strong>';
                      immosearch_details_element += '</td>';
                      immosearch_details_element += '<td id="text_align_right">';
                      immosearch_details_element += details_energiepass_energieverbrauchkennwert.dot2comma();
                      immosearch_details_element += '</td>';
                      immosearch_details_element += '</tr>';
                    } else {
                      //immosearch_details_element += '<p><strong>Endenergieverbrauch:</strong> ' + details_energiepass_energieverbrauchkennwert.dot2comma() + ' kWh/(m&sup2;a)</p>';
                      immosearch_details_element += '<tr>';
                      immosearch_details_element += '<td>';
                      immosearch_details_element += '<strong>Endenergieverbrauch</strong>';
                      immosearch_details_element += '</td>';
                      immosearch_details_element += '<td id="text_align_right">';
                      immosearch_details_element += details_energiepass_energieverbrauchkennwert.dot2comma() + ' kWh/(m&sup2;a)';
                      immosearch_details_element += '</td>';
                      immosearch_details_element += '</tr>';
                    }
                  }
                } else if (details_energiepass_epart == "BEDARF") {
                  epassTyp = "Ausweistyp";
                  //immosearch_details_element += '<p><strong>' + epassTyp + ':</strong> Bedarfsausweis</p>';
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>';
                  immosearch_details_element += '<strong>' + epassTyp + '</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += 'Bedarfsausweis';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                  if (typeof details_energiepass_endenergiebedarf != "undefined" && details_energiepass_endenergiebedarf) {
                    if (isNaN(details_energiepass_endenergiebedarf)) {
                      //immosearch_details_element += '<p><strong>Endenergiebedarf:</strong> ' + details_energiepass_endenergiebedarf.dot2comma() + '</p>';
                      immosearch_details_element += '<tr>';
                      immosearch_details_element += '<td>';
                      immosearch_details_element += '<strong>Endenergiebedarf</strong>';
                      immosearch_details_element += '</td>';
                      immosearch_details_element += '<td id="text_align_right">';
                      immosearch_details_element += details_energiepass_endenergiebedarf.dot2comma();
                      immosearch_details_element += '</td>';
                      immosearch_details_element += '</tr>';
                    } else {
                      //immosearch_details_element += '<p><strong>Endenergiebedarf:</strong> ' + details_energiepass_endenergiebedarf.dot2comma() + ' kWh/(m&sup2;a)</p>';
                      immosearch_details_element += '<tr>';
                      immosearch_details_element += '<td>';
                      immosearch_details_element += '<strong>Endenergiebedarf</strong>';
                      immosearch_details_element += '</td>';
                      immosearch_details_element += '<td id="text_align_right">';
                      immosearch_details_element += details_energiepass_endenergiebedarf.dot2comma() + ' kWh/(m&sup2;a)';
                      immosearch_details_element += '</td>';
                      immosearch_details_element += '</tr>';
                    }
                  }
                }
              }



              /*
              if (typeof details_energiepass_epart != "undefined" && details_energiepass_epart) {
                var epassTyp;
                if (details_energiepass_epart == "VERBRAUCH") {
                  epassTyp = "Energieausweistyp";
                  if (typeof details_energiepass_energieverbrauchkennwert != "undefined" && details_energiepass_energieverbrauchkennwert) {
                    if (!isNaN(details_energiepass_energieverbrauchkennwert)) {
                      immosearch_details_element += '<p><strong>Energieausweistyp: </strong> Verbrauchsausweis</p>';
                    }
                  }
                }
              }
              */

              if (immosearch_var_details_object_primaerenergietraeger != "") {
                if (typeof immosearch_var_details_object_primaerenergietraeger != "undefined" && immosearch_var_details_object_primaerenergietraeger) {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>';
                  immosearch_details_element += '<strong>Wesentlicher Energieträger</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += immosearch_var_details_object_primaerenergietraeger;
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              } else {
                for (var i_befeuerung = 0; i_befeuerung < immosearch_var_details_object_ausstattung_befeuerung.length; ++i_befeuerung) {
                  var befeuerung_value = immosearch_var_details_object_ausstattung_befeuerung[i_befeuerung].capitalize();
                  befeuerung_value = befeuerung_value.umlauts();
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>';
                  immosearch_details_element += '<strong>Wesentlicher Energieträger</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += befeuerung_value;
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              }

              if (typeof details_energiepass_mitwarmwasser != "undefined" && details_energiepass_mitwarmwasser) {
                if (details_energiepass_mitwarmwasser == "true") {
                  immosearch_details_element += '<tr>';
                  immosearch_details_element += '<td>';
                  immosearch_details_element += '<strong>Mit Warmwasser</strong>';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '<td id="text_align_right">';
                  immosearch_details_element += 'ja';
                  immosearch_details_element += '</td>';
                  immosearch_details_element += '</tr>';
                }
              }

              //baujahr
              if (typeof immosearch_var_details_object_baujahr != "undefined" && immosearch_var_details_object_baujahr) {
                //immosearch_details_element += '<p><strong>Baujahr: </strong> ' + immosearch_var_details_object_baujahr + '</p>';
                immosearch_details_element += '<tr>';
                immosearch_details_element += '<td>';
                immosearch_details_element += '<strong>Baujahr</strong>';
                immosearch_details_element += '</td>';
                immosearch_details_element += '<td id="text_align_right">';
                immosearch_details_element += immosearch_var_details_object_baujahr;
                immosearch_details_element += '</td>';
                immosearch_details_element += '</tr>';
              }

              immosearch_details_element += '</table>';
              immosearch_details_element += '<br><br>';

              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';

              //concat 2 array to one and remove duplicates
              var immosearch_array_object_ausstatt_beschr_concat = immosearch_array_object_ausstatt_beschr.concat(immosearch_array_details_object_ausstattung[0]);
              if (immosearch_array_object_ausstatt_beschr_concat.length > 0) {
                //immosearch_details_element += '<strong>Ausstattungsmerkmale: <br></strong>' + var___immosearch_array_object_ausstatt_beschr;
                immosearch_details_element += '<p id="list_text_style">AUSSTATTUNGSMERKMALE<br></p>';
                $.each(immosearch_array_object_ausstatt_beschr_concat.split(','), function(index, value) {
                  //immosearch_details_element += '<input type="button" class="btn btn-default btn-xs" value="' + value + '" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-top:3px; cursor:default;"><br>';
                  immosearch_details_element += '<strong>' + value + '</strong>' + '<br>';
                });
              }
              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';
              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';
              immosearch_details_element += '</div>';

              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="row">';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12" id="kontakt_details">';
              immosearch_details_element += '<p id="list_text_style">IHR ANSPRECHPARTNER</p>';
              immosearch_details_element += '<p>';

              if (immosearch_var_details_kontakt__name.substring(0, 1) == "T") {
                //console.log("TEAM STRING: " + immosearch_var_details_kontakt__name.replace('T', 't'));
                immosearch_var_details_kontakt__name = immosearch_var_details_kontakt__name.replace('T', 't');
              }

              immosearch_details_element += 'Service' + immosearch_var_details_kontakt__name + '<br>';
              immosearch_details_element += immosearch_var_details_kontakt__strasse + ' ' + immosearch_var_details_kontakt__hausnummer + '<br>';
              immosearch_details_element += immosearch_var_details_kontakt__plz + ' ' + immosearch_var_details_kontakt__ort;
              immosearch_details_element += '<br>';
              immosearch_details_element += 'Tel.: ' + immosearch_var_details_kontakt__tel_zentrale + '<br>';
              immosearch_details_element += 'Fax.: ' + immosearch_var_details_kontakt__tel_fax + '<br>';
              immosearch_details_element += '<a href="mailto:' + immosearch_var_details_kontakt__email_zentrale + '" style="color: #409e49;" data-toggle="modal" data-target="#contactFormModal"><strong id="teammail_container">' + immosearch_var_details_kontakt__email_zentrale + '</strong></a>';

              //form service team email
              $("#form_email_bottom_text").attr("href", "mailto:" + immosearch_var_details_kontakt__email_zentrale);
              $("#form_email_bottom_text").html(immosearch_var_details_kontakt__email_zentrale);

              //jquery code to build dynamic the form
              if (immosearch_customer_id == "993301") {
                $("#service_team").html("<div class='row'><div class='col-md-6'><p id='list_text_style'>Anfrage an</p><span style='margin-top:0px;'><strong>Service" + immosearch_var_details_kontakt__name + "</strong><br>Bielefelder Gemeinnützige Wohnungsgesellschaft GmbH</span></div><div class='col-md-6'><img src='" + customer_logo + "'></div></div></div>");
              }

              immosearch_details_element += '</p>';
              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12" id="documente_distance">';
              immosearch_details_element += '<p id="list_text_style">DOKUMENTE</p>';
              //check if the array is not empty
              if (immosearch_array_details_object_attachment_pdf[0] !== undefined) {
                //immosearch_details_element += '<p style="margin-top:10px;"><input type="button" class="btn btn-specialBtnKA" value="Energieausweis" id="pdf_document"></p>';
                //immosearch_details_element += '<p style="margin-top:10px;"><button type="button" class="btn btn-specialBtnKA" id="pdf_document"><i class="fa fa-file-pdf-o"></i> Energieausweis</button></p>';
                immosearch_details_element += '<p style="margin-top:10px; cursor:pointer;"><span id="pdf_document"><img src="img/pdf_icon.png" style="padding-bottom:7px;"> <span style="color:#008fc4; font-size:16px;">Energieausweis</span></span></p>';
              }
              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';
              immosearch_details_element += '</div>';

              immosearch_details_element += '<div class="col-md-6 col-sm-6 col-xs-12">';
              immosearch_details_element += '</div>';

              immosearch_details_element += '</div>';//end - immosearch_details_element += '<div class="col-md-6 col-sm-12 col-xs-12">';//put the content more together
              immosearch_details_element += '</div>';

              //form object data
              $("#object_image_form").attr("src", immosearch_array_details_object_img[0]);
              $("#object_title").html(immosearch_array_object_details_zimmer_val + ' Zimmer Wohnung in ' + details_address_ort + ' ' + details_address_ortsteil);

              $("#form_zimmer").html(immosearch_array_object_details_zimmer_val);
              $("#form_baujahr").html(immosearch_var_details_object_baujahr);

              //object number
              /*
              if (immosearch_array_details_object_ausstattung.length > 0) {
                immosearch_details_element += '<div class="row-fluid" style="margin-top:30px;">';

                      if (immosearch_array_details_object_ausstattung.length > 0) {
                        if (typeof immosearch_array_details_object_ausstattung[0] != 'undefined' || immosearch_array_details_object_ausstattung[0] != '') {
                          for(var loop_details = 0; loop_details < immosearch_array_details_object_ausstattung[0].length; loop_details++) {
                            //change color 1 by 1 (Yellow, Green)
                            if (isOdd(loop_details) == false) {
                              immosearch_details_element += '<input type="button" class="btn btn-default btn-xs" value="' + immosearch_array_details_object_ausstattung[0][loop_details] + '" id="immo_small_icons" style="border-color:#356635; color:#FFFFFF; background-color:#356635; margin-right:5px; cursor:default;">';
                            } else {
                              immosearch_details_element += '<input type="button" class="btn btn-default btn-xs" value="' + immosearch_array_details_object_ausstattung[0][loop_details] + '" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px; cursor:default;">';
                            }
                          };
                        }
                      }

                      if (immosearch_array_object_balkon == "1.0") {
                        immosearch_details_element += '<input type="button" class="btn btn-default btn-xs" value="Balkon" id="balkon_immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px; cursor:default;">';
                      }

                immosearch_details_element += '</div>';
              }
              */

              //check if the string "var___immosearch_array_object_ausstatt_beschr" contains "Balkon" then hide the balkon austattung image
              /*
              if(immosearch_array_object_ausstatt_beschr.indexOf('Balkon') >= 0 || immosearch_array_object_ausstatt_beschr.indexOf('balkon') >= 0){
                // Hide the balkon button (icon)
                $("#balkon_immo_small_icons").hide();
              }
              */



              //images
              //image counter for the modal/////////////////////////////////////////////////////////////////////////////////////////////
              var img_counter = 0;//img counter for the arrows to run the img array

              //console.log("IMAGE LENGTH: " + immosearch_array_details_object_img.length);

              if (immosearch_array_details_object_img.length > 1) {
                //then disable the buttons
                $("#previous_pic").show();
                $("#next_pic").show();
              } else if (immosearch_array_details_object_img.length == 1) {
                //console.log("Case length 1: " + immosearch_array_details_object_img.length);
                $("#previous_pic").hide();
                $("#next_pic").hide();
              } else {
                $("#previous_pic").hide();
                $("#next_pic").hide();
              }

              //show the counter of the picture (on popup modal)
              function show_counter_pic(img_html_counter) {
                $("#show_img_counter").html(img_html_counter+1);
              }

              //reset the img counter
              $("#close_modal").click(function() {
                img_counter = 0;
                $("#show_img_counter").html(1);//reset the visual value (so when the user open the modal the number starts from 1)
              });

              //previous pic
              $("#previous_pic").click(function() {
                if (img_counter == 0) {
                  //do nothing
                } else if (img_counter <= immosearch_array_details_object_img.length) {
                  img_counter--;
                  if (immosearch_array_details_object_img[img_counter].substring(0, 5) == "data:") {
                    $("#image_source_gallery").attr("src", immosearch_array_details_object_img[img_counter]);
                  } else {
                    $("#image_source_gallery").attr("src", immosearch_array_details_object_img[img_counter] + "?" + $.now());
                  }
                  show_counter_pic(img_counter);
                }
              });

              //next pic
              $("#next_pic").click(function() {
                if (img_counter < immosearch_array_details_object_img.length -1) {
                  img_counter++;
                  if (immosearch_array_details_object_img[img_counter].substring(0, 5) == "data:") {
                    $("#image_source_gallery").attr("src", immosearch_array_details_object_img[img_counter]);
                  } else {
                    $("#image_source_gallery").attr("src", immosearch_array_details_object_img[img_counter] + "?" + $.now());
                  }
                  show_counter_pic(img_counter);
                }
              });

              //on close modal clean content and reset counter
              $('body').on('hidden.bs.modal', '.modal', function () {
                $(this).removeData('bs.modal');
                $("#number_of_visible_picture").empty();
                img_counter = 0;
                $("#show_img_counter").html(1);//reset the visual value (so when the user open the modal the number starts from 1)
              });

              show_counter_pic(img_counter);//show the number of the picture (next - previous btn)
              $("#show_img_length").html(immosearch_array_details_object_img.length);//show in modal the length of the pictures
              //image counter for the modal/////////////////////////////////////////////////////////////////////////////////////////////

              //images floor plan
              //image counter for the modal floor plans/////////////////////////////////////////////////////////////////////////////////
              var img_counter_floor_plans = 0;//img counter for the arrows to run the img array

              //show the counter of the picture (on popup modal)
              function show_counter_pic_floor_plans(img_html_counter) {
                $("#show_img_counter_floor_plans").html(img_counter_floor_plans+1);
              }

              //reset the img counter
              $("#close_modal_floor_plans").click(function() {
                img_counter_floor_plans = 0;
                $("#show_img_counter_floor_plans").html(1);//reset the visual value (so when the user open the modal the number starts from 1)
              });

              //previous pic
              $("#previous_pic_floor_plans").click(function() {
                if (img_counter_floor_plans == 0) {
                  //do nothing
                } else if (img_counter_floor_plans <= immosearch_array_details_object_img_floor_plan.length) {
                  img_counter_floor_plans--;
                  $("#image_source_gallery_floor_plan").attr("src", "" + immosearch_array_details_object_img_floor_plan[img_counter_floor_plans] + "");
                  show_counter_pic_floor_plans(img_counter_floor_plans);
                }
              });

              //next pic
              $("#next_pic_floor_plans").click(function() {
                if (img_counter_floor_plans < immosearch_array_details_object_img_floor_plan.length -1) {
                  img_counter_floor_plans++;
                  $("#image_source_gallery_floor_plan").attr("src", "" + immosearch_array_details_object_img_floor_plan[img_counter_floor_plans] + "");
                  show_counter_pic_floor_plans(img_counter_floor_plans);
                }
              });

              //on close modal clean content and reset counter
              $('body').on('hidden.bs.modal', '.modal', function () {
                $(this).removeData('bs.modal');
                $("#number_of_visible_picture_floor_plans").empty();
                img_counter_floor_plans = 0;
                $("#show_img_counter_floor_plans").html(1);//reset the visual value (so when the user open the modal the number starts from 1)
              });

              show_counter_pic_floor_plans(img_counter_floor_plans);//show the number of the picture (next - previous btn)
              $("#show_img_length_floor_plans").html(immosearch_array_details_object_img_floor_plan.length);//show in modal the length of the pictures
              //image counter for the modal floor plans/////////////////////////////////////////////////////////////////////////////////

              /*
              $("#pdf_document").click(function() {
                window.open(escape(immosearch_array_details_object_attachment_pdf[0]));
							  return false;
							});
              */

              immosearch_details_element += '<br><br><br>';

							immosearch_details_element += '<script>';
							immosearch_details_element += '$(document).ready(function() {';

              if(immosearch_array_object_ausstatt_beschr.indexOf('Balkon') >= 0 || immosearch_array_object_ausstatt_beschr.indexOf('balkon') >= 0){
                // Hide the balkon button (icon)
                immosearch_details_element += '$("#balkon_immo_small_icons").hide();';
              }

              immosearch_details_element += '$("#pdf_document").click(function() {';

              if (immosearch_array_details_object_attachment_pdf[0] !== undefined) {
                var pdf_item_from_array_to_check_last3_chars = immosearch_array_details_object_attachment_pdf[0];
                var check_the_last_3_characters_for_pdf_IE = pdf_item_from_array_to_check_last3_chars.substr(pdf_item_from_array_to_check_last3_chars.length - 3);
                //console.log("PDF LAST 3 CHARS: " + check_the_last_3_characters_for_pdf_IE);
                //console.log("PDF LINK: " + immosearch_array_details_object_attachment_pdf[0]);

                if (BrowserDetect.browser == "Explorer") {
                  if (check_the_last_3_characters_for_pdf_IE == "PDF" || check_the_last_3_characters_for_pdf_IE == "pdf") {
                    console.log("Case 1 link");
                    immosearch_details_element += 'window.location.href="' + immosearch_array_details_object_attachment_pdf[0] + '";';
                  } else {
                    console.log("Case 2 error");
                    immosearch_details_element += 'swal({';
                    immosearch_details_element += 'title: "Achtung!",';
                    immosearch_details_element += 'text: "Das PDF-Dokument ist Base64 codiert.  Diese Technologie wird vom Internet-Explorer nicht unterstützt. Um das PDF-Dokument zu öffnen, verwenden Sie bitte einen alternativen Browser.",';
                    immosearch_details_element += 'type: "warning",';
                    immosearch_details_element += 'html: true';
                    immosearch_details_element += '});';
                  }
                } else {
                  //immosearch_details_element += 'window.location.href="' + immosearch_array_details_object_attachment_pdf[0] + '";';
                  immosearch_details_element += 'window.open("' + immosearch_array_details_object_attachment_pdf[0] + '", "_blank");';
                }
              }
								immosearch_details_element += 'return false;';
							immosearch_details_element += '});';


							immosearch_details_element += '$("#details_page_back_to_list").click(function() {';
                immosearch_details_element += '$("#top_menu_after_filter").hide();';
                immosearch_details_element += '$("#top_menu_line_after_filter").hide();';
                immosearch_details_element += '$("#map_container").empty();';
                immosearch_details_element += '$("#immo_data").show();';
                immosearch_details_element += '$("#immo_title_angebote").show();';
                //immosearch_details_element += 'document.getElementById("immo_data").style.visibility = "visible";';
								immosearch_details_element += 'homeinfo_immosearch_global();';
								immosearch_details_element += 'return false;';
							immosearch_details_element += '});';

              immosearch_details_element += '$("#details_page_map").click(function() {';


                var yellowmap_temp_id = yellowmap.get_yellowmap_id(immosearch_array_object_objektnr_intern);
                var yellowmap_customer_id = yellowmap.yellowmap_customers[immosearch_customer_id];
                var yellowmap_url = yellowmap.gen_yellowmap_url(yellowmap_customer_id, yellowmap_temp_id);

                //ajax call to load the map
                /*
                immosearch_details_element += '$("#map_container").show();';
                immosearch_details_element += '$.ajax({';
                immosearch_details_element += 'url: "map.php",';
                immosearch_details_element += 'type: "POST",';
                immosearch_details_element += 'data: "yellowmap_url=' + yellowmap_url + '",';
                immosearch_details_element += 'cache: false,';
                immosearch_details_element += 'success: function (html) {';
                immosearch_details_element += '$("#map_container").html(html);';
                immosearch_details_element += '}';
                immosearch_details_element += '});';
                immosearch_details_element += '$("#immo_data").hide();';
                */

                immosearch_details_element += 'window.open("' + yellowmap_url + '", "_blank");';

                //immosearch_details_element += '$("#map_container").html("<p id=\'details_page_zuruck\' style=\'cursor:pointer; color:#aaa91f;\'><strong>Zurück zu Details</strong></p><br><iframe width=\'100%\' height=\'380\' frameborder=\'0\' scrolling=\'no\' marginheight=\'0\' marginwidth=\'0\' src=\'" + yellowmap_url + "\'></iframe><br><br>");';

                /*
                immosearch_details_element += '$.ajax(' + yellowmap_url + ', {';
                immosearch_details_element += 'success: function(data) {';
                immosearch_details_element += '$("#map_container").html("<p id=\'details_page_zuruck\' style=\'cursor:pointer; color:#aaa91f;\'><strong>Zurück zu Details</strong></p><br><iframe width=\'100%\' height=\'380\' frameborder=\'0\' scrolling=\'no\' marginheight=\'0\' marginwidth=\'0\' src=\'" + data + "\'></iframe><br><br>");';
                immosearch_details_element += '}';
                immosearch_details_element += '});';
                */
								immosearch_details_element += 'return false;';
							immosearch_details_element += '});';

              immosearch_details_element += '$("#details_page_print").click(function() {';
                  immosearch_details_element += '$.print("#immo_data");';
							immosearch_details_element += '});';

							immosearch_details_element += '});';
							immosearch_details_element += '<\/script>';

          //$("#map_container_button").html("<p id='details_page_zuruck' style='cursor:pointer; color:#aaa91f;'><strong>Zurück zu Details</strong></p><br><script>$(document).ready(function() {  $('#details_page_zuruck').click(function() {  $('#map_container').hide(); $('#immo_data').show(); });                      });<\/script>");

          //load the map in details page (in separate container)
          /*
          console.log("PLZ NUMBER: " + immosearch_array_details_object_plz_number[0]);
          console.log("ADDRESS: " + details_address);
          console.log("ADDRESS NR: " + details_address_number);
          */

          //$("#map_container").html("<p id='details_page_zuruck' style='cursor:pointer; color:#aaa91f;'><strong>Zurück zu Details</strong></p><br><iframe width='100%' height='380' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='https://maps.google.com/maps?q=" + details_address + "+" + details_address_number + "+" + immosearch_array_details_object_plz_number[0] + "+" + immosearch_array_details_object_ort[0] + "&amp;output=embed'></iframe><br><br><script>$(document).ready(function() {  $('#details_page_zuruck').click(function() {  $('#map_container').hide(); $('#immo_data').show(); });                      });<\/script>");

          //$("#map_container").html("<p id='details_page_zuruck' style='cursor:pointer; color:#aaa91f;'><strong>Zurück zu Details</strong></p><br><iframe width='100%' height='380' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='" + yellowmap_url + "'></iframe><br><br><script>$(document).ready(function() {  $('#details_page_zuruck').click(function() {  $('#map_container').hide(); $('#immo_data').show(); });                      });<\/script>");
          //$("#map_container").hide();

					$("#immo_data").append(immosearch_details_element);//add elements to HTML
          $('[data-toggle="tooltip"]').tooltip();//enables on click the haus-wohnung address to load the map

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//SHOW DETAILS DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				} else {
					//no children nodes, inform user
					swal({
						title: "Achtung!",
						text: "Keine Angebote vorhanden!",
						type: "warning",
						html: true,
						confirmButtonColor: "#f8bf86",
						confirmButtonText: "Wiederholen",
						allowOutsideClick: false,
						showConfirmButton: true
					},
					function(isConfirm){
						if (isConfirm) {

						}
					});

				}//if ($(xml).find("ns1\\:rsp").children().length >= 0) {
			},
			error: function (xhr, request, status, error) {
				//inform the user
				swal({
					title: "Achtung!",
					text: "Etwas ist schief gelaufen, bitte erneut versuchen oder Service kontaktieren.",
					type: "warning",
					html: true,
					confirmButtonColor: "#f8bf86",
					confirmButtonText: "Wiederholen",
					allowOutsideClick: false,
					showConfirmButton: true
				},
				function(isConfirm){
					if (isConfirm) {

					}
				});
			}//error: function (request, status, error) {
		});

	});//$(document).ready(function() {
}//function homeinfo_immosearch_details(object_id) {

function homeinfo_immosearch_global() {

	var _filter = filter();
	var params = "";

	if (_filter != "") {
		if (params == "") {
			params = "filter=" + _filter;
		} else {
			params += "&filter=" + _filter;
		}
	}

	if (sorting != "") {
		if (params == "") {
			params = "sort=" + sorting;
		} else {
			params += "&sort=" + sorting;
		}
	}

	if (include != "") {
		if (params == "") {
			params = "include=" + include;
		} else {
			params += "&include=" + include;
		}
	}

  /*
	if (attachments != "") {
		if (params == "") {
			params = "attachments=" + attachments;
		} else {
			params += "&attachments=" + attachments;
		}
	}
  */

  //if in the params string container "filter" show the reset button (so the user can reset the form)
  //console.log("Sorting value: " + sorting);
  if ($('#immo_erweiterte_suche_form').is(':visible')) {
    $("#empty_search_fileds_btn").show();
  } else if (sorting != 0) {
    $("#empty_search_fileds_btn").show();
    sorting = 0;
  }

	//document ready
	$(document).ready(function() {

    //add the customer logo by id to the index
    $("#customer_logo_src").attr("src", customer_logo);

    //form object data
    $("#object_image_form").attr("src", "");
    $("#object_title").html("");
    $("#form_miete_nk").html("");
    $("#form_zimmer").html("");
    $("#form_nebenkosten").html("");
    $("#form_wohnflache_ca").html("");
    $("#form_heizkosten").html("");
    $("#form_baujahr").html("");
    $("#form_kaution").html("");
    $("#form_verfugbar_ab").html("");

    $("#customer_logo_src").click(function() {
      $("#top_menu_after_filter").hide();
      $("#top_menu_line_after_filter").hide();
      $("#map_container").empty();
      $("#immo_data").show();
      $("#immo_title_angebote").show();
      homeinfo_immosearch_global();
      return false;
    });

		//ajax immosearch
		$.ajax({
			url: immosearch_url + params,
			crossDomain: true,
			type: "GET",
			dataType: "xml",
			cache: false,
			beforeSend: function() {
        $("#details_page_back_to_list").hide();
        $("#details_page_print").hide();
				$("#immo_data").empty();
				$("#immo_data").append('<img src="img/preloader/preloader.gif" width="32" height="32" />');
			},
			success: function (xml) {
				if ($(xml).find("ns1\\:rsp").children().length >= 0) {

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//PARSE///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					var xml_namespace = $(xml).find("ns1\\:rsp");//console.log(xml_namespace);
					var anbieterCustomerId = escapeHtml($(xml).find("anbieternr").text());//console.log("CUSTOMER ID: " + anbieterCustomerId);
					var anbieterFirmName = escapeHtml($(xml).find("anbieternr").next().text());//console.log("FIRM NAME: " + anbieterFirm);
					//var findAllImmoText = escapeHtml($(xml).find("immobilie").text());
					//console.log("XML NAMESPACE: " + xml_namespace);
					//console.log("ANBIETER CUSTOMER ID: " + anbieterCustomerId);
					//console.log("ANBIETER FIRM NAME: " + anbieterFirmName);
					//console.log("ALL IMMOBILIENS TEXT: " + findAllImmoText);

					$("#immo_data").empty();//empty page

					//vars
					var total_counter = 0;

					//arrays (push --- if the element or value not exists)
					immosearch_array_img = [];
					var immosearch_array_object_address = [];
					var immosearch_array_object_address_number = [];
					var immosearch_array_object_plz_number = [];
					var immosearch_array_object_ort = [];
					var immosearch_array_object_zimmer = [];
					var immosearch_array_object_wohnflaeche = [];
					var immosearch_array_object_gesamtmiete = [];
					var immosearch_array_object_kaltmiete = [];
					var immosearch_array_object_object_number = [];
					var immosearch_array_object_ausstattung = [];
					var immosearch_array_object_ortsteil = [];
          var immosearch_array_object_nettokaltmiete = [];
          var immosearch_array_object_heizkosten_enthalten = [];
          var immosearch_array_object_heizkosten = [];
          var immosearch_array_object_nebenkosten = [];
          var immosearch_array_object_balkon = [];
          var immosearch_array_object_objektart = [];

          var immosearch_array_object__objektkategorie_nutzungsart_ANLAGE = [];
          var immosearch_array_object__objektkategorie_nutzungsart_GEWERBE = [];
          var immosearch_array_object__objektkategorie_nutzungsart_WAZ = [];
          var immosearch_array_object__objektkategorie_nutzungsart_WOHNEN = [];
          var immosearch_array_object__objektkategorie_vermarktungsart_MIETE_PACHT = [];
          var immosearch_array_object__objektkategorie_vermarktungsart_KAUF = [];

					//throw an error message if the are no estates to show
					if ($(xml).find("immobilie").text() == "") {
						$("#immo_data").empty();
						var error_message = '<div class="alert alert-danger" role="alert" style="margin-top:20px;">';
								error_message += '<i class="fa fa-exclamation-triangle"></i>';
								error_message += '<span class="sr-only">Error:</span>';
								error_message += ' Keine angebote gefunden!';
								error_message += '</div>';
						$("#immo_data").append(error_message);
					}

					$(xml).find("immobilie").each(function(i) {

						total_counter = i+1;

						immosearch_array_object_address.push(escapeHtml($(this).find("geo strasse").text()));//address
						immosearch_array_object_address_number.push(escapeHtml($(this).find("geo hausnummer").text()));//address number
						immosearch_array_object_plz_number.push(escapeHtml($(this).find("geo plz").text()));
						immosearch_array_object_ort.push(escapeHtml($(this).find("geo ort").text()));
						immosearch_array_object_zimmer.push(escapeHtml($(this).find("flaechen anzahl_zimmer").text()));
						immosearch_array_object_wohnflaeche.push(escapeHtml($(this).find("flaechen wohnflaeche").text()));
						immosearch_array_object_gesamtmiete.push(escapeHtml($(this).find("preise warmmiete").text()));
						immosearch_array_object_object_number.push(escapeHtml($(this).find("verwaltung_techn openimmo_obid").text()));
						immosearch_array_object_ortsteil.push(escapeHtml($(this).find("geo regionaler_zusatz").text()));//push in the array all areas (once for each kind and count them)
            immosearch_array_object_nettokaltmiete.push(escapeHtml($(this).find("preise nettokaltmiete").text()));
            immosearch_array_object_kaltmiete.push(escapeHtml($(this).find("preise kaltmiete").text()));
            immosearch_array_object_heizkosten_enthalten.push(escapeHtml($(this).find("preise heizkosten_enthalten").text()));//boolean
            immosearch_array_object_nebenkosten.push(escapeHtml($(this).find("preise nebenkosten").text()));//decimal
            immosearch_array_object_heizkosten.push(escapeHtml($(this).find("preise heizkosten").text()));
            immosearch_array_object_balkon.push(escapeHtml($(this).find("flaechen anzahl_balkone").text()));

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('ANLAGE')) == true) {
              immosearch_array_object__objektkategorie_nutzungsart_ANLAGE.push($(this).find("objektkategorie nutzungsart").attr('ANLAGE'));//element exists
            } else {
              immosearch_array_object__objektkategorie_nutzungsart_ANLAGE.push(empty_item_value);//element not exists
            }
            //console.log("ANLAGE: " + $(this).find("objektkategorie nutzungsart").attr('ANLAGE'));
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('GEWERBE')) == true) {
              immosearch_array_object__objektkategorie_nutzungsart_GEWERBE.push($(this).find("objektkategorie nutzungsart").attr('GEWERBE'));//element exists
            } else {
              immosearch_array_object__objektkategorie_nutzungsart_GEWERBE.push(empty_item_value);//element not exists
            }
            //console.log("GEWERBE: " + $(this).find("objektkategorie nutzungsart").attr('GEWERBE'));
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('WAZ')) == true) {
              immosearch_array_object__objektkategorie_nutzungsart_WAZ.push($(this).find("objektkategorie nutzungsart").attr('WAZ'));//element exists
            } else {
              immosearch_array_object__objektkategorie_nutzungsart_WAZ.push(empty_item_value);//element not exists
            }
            //console.log("WAZ: " + $(this).find("objektkategorie nutzungsart").attr('WAZ'));
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (check_if_element_exists_boolean($(this).find("objektkategorie nutzungsart").attr('WOHNEN')) == true) {
              immosearch_array_object__objektkategorie_nutzungsart_WOHNEN.push($(this).find("objektkategorie nutzungsart").attr('WOHNEN'));//element exists
            } else {
              immosearch_array_object__objektkategorie_nutzungsart_WOHNEN.push(empty_item_value);//element not exists
            }
            //console.log("WOHNEN: " + $(this).find("objektkategorie nutzungsart").attr('WOHNEN'));
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (check_if_element_exists_boolean($(this).find("objektkategorie vermarktungsart").attr('MIETE_PACHT')) == true) {
              immosearch_array_object__objektkategorie_vermarktungsart_MIETE_PACHT.push($(this).find("objektkategorie vermarktungsart").attr('MIETE_PACHT'));//element exists
            } else {
              immosearch_array_object__objektkategorie_vermarktungsart_MIETE_PACHT.push(empty_item_value);//element not exists
            }
            //console.log("MIETE_PACHT: " + $(this).find("objektkategorie vermarktungsart").attr('MIETE_PACHT'));
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (check_if_element_exists_boolean($(this).find("objektkategorie vermarktungsart").attr('KAUF')) == true) {
              immosearch_array_object__objektkategorie_vermarktungsart_KAUF.push($(this).find("objektkategorie vermarktungsart").attr('KAUF'));//element exists
            } else {
              immosearch_array_object__objektkategorie_vermarktungsart_KAUF.push(empty_item_value);//element not exists
            }
            //console.log("KAUF: " + $(this).find("objektkategorie vermarktungsart").attr('KAUF'));
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            var objectart_children = $(this).find("objektart").children()[0].nodeName
            if (check_if_element_exists_boolean(objectart_children) == true) {
              //console.log("TRACE OBJECTART CHILDREN: " + objectart_children);
              //console.log("TRACE OBJECTART CHILDREN ATTR NAME: " + $(this).find("objektart").children()[0].attributes.name);

              /*
              $(xml).find("objektart").each(function() {
                console.log("TRACE OBJECTART CHILDREN" + $(this));
                $.each(this.children()[0].attributes, function(i, attrib){
                   var name = attrib.name;
                   var value = attrib.value;
                   console.log("ATTRIBUTE NAME: " + name);
                   console.log("ATTRIBUTE VALUE: " + value);
                });
              });
              */

            }

            if (check_if_element_exists_boolean($(this).find("objektart wohnung").attr('wohnungtyp')) == true) {
              //element exists
              var immosearch_objektart_wohnung = capitalise(escapeHtml($(this).find("objektart wohnung").attr('wohnungtyp')));
              if (immosearch_objektart_wohnung == "Etage") {
                immosearch_objektart_wohnung = "Etagenwohnung";
              } else if (immosearch_objektart_wohnung == "Dachgeschoss") {
                immosearch_objektart_wohnung = "Dachgeschosswohnung";
              } else if (immosearch_objektart_wohnung == "Erdgeschoss") {
                immosearch_objektart_wohnung = "Erdgeschosswohnung";
              }
              immosearch_array_object_objektart.push(immosearch_objektart_wohnung);
            } else {
              //element not exists
              immosearch_array_object_objektart.push(empty_item_value);
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					});//$(xml).find("immobilie").each(function(i) {


          //trace
          /*
          console.log("ARRAY ANLAGE: " + immosearch_array_object__objektkategorie_nutzungsart_ANLAGE);
          console.log("ARRAY GEWERBE: " + immosearch_array_object__objektkategorie_nutzungsart_GEWERBE);
          console.log("ARRAY WAZ: " + immosearch_array_object__objektkategorie_nutzungsart_WAZ);
          console.log("ARRAY WOHNEN: " + immosearch_array_object__objektkategorie_nutzungsart_WOHNEN);
          console.log("ARRAY MIETE_PACHT: " + immosearch_array_object__objektkategorie_vermarktungsart_MIETE_PACHT);
          console.log("ARRAY KAUF: " + immosearch_array_object__objektkategorie_vermarktungsart_KAUF);
          */

          //console.log("WOHNUNGTYP: " + immosearch_array_object_objektart);

          /*
          var xmlDom = $(xml).get(0);
          var anbieter = openimmo.anbieter(xmlDom);
          console.log(anbieter);
          */

					//var occurences_areas = group_ortsteil(immosearch_array_object_ortsteil);//group areas and count them
          var occurences_areas = immosearch_array_object_ortsteil.group();//group areas and count them

					$("#dynamic_area_list").empty();

          //check if the array "build_locations_array" is empty, if so then push the itams of the areas in
          if (build_locations_array.length == 0) {
  					for (var areas in occurences_areas) {
              build_locations_array.push(areas);
              build_locations_array_number.push(occurences_areas[areas]);
  					}
          }
					occurences_areas = "";//clear the object

          //build the areas checkboxes by the array "build_locations_array"
          for(var i_areas_arr = 0; i_areas_arr < build_locations_array.length; i_areas_arr++) {
            var ortsteil_element = '<div class="col-md-6 col-sm-6 col-xs-12">';
                ortsteil_element += '<div class="checkbox">';
                ortsteil_element += '<label>';
                ortsteil_element += '<input type="checkbox" value="' + build_locations_array[i_areas_arr] + '" id="checkbutton__' + build_locations_array[i_areas_arr] + '"> ' + build_locations_array[i_areas_arr] + ' <span class="badge">' + build_locations_array_number[i_areas_arr] + '</span>';
                ortsteil_element += '</label>';
                ortsteil_element += '</div>';
                ortsteil_element += '</div>';

                ortsteil_element += '<script>';
                ortsteil_element += '$(document).ready(function() {';

                //check if the checkbox value exists in the array, then checked
                ortsteil_element += 'if(selected_locations.indexOf("' + build_locations_array[i_areas_arr] + '") == -1) {';
                  ortsteil_element += '$("#checkbutton__' + build_locations_array[i_areas_arr] + '").attr("checked", false);';
                ortsteil_element += '} else {';
                  ortsteil_element += '$("#checkbutton__' + build_locations_array[i_areas_arr] + '").attr("checked", true);';
                ortsteil_element += '}';

                //on checkbox change
                ortsteil_element += '$("#checkbutton__' + build_locations_array[i_areas_arr] + '").on("change", function() {';
                ortsteil_element += 'if ($(this).is(":checked")) {';
                  ortsteil_element += 'if(selected_locations.indexOf("' + build_locations_array[i_areas_arr] + '") == -1) {';//area doesn't exist, so push it in the array
                      ortsteil_element += 'selected_locations.push($(this).val())';
                  ortsteil_element += '}';
                ortsteil_element += '} else {';
                  ortsteil_element += 'selected_locations.remove_from_array("' + build_locations_array[i_areas_arr] + '");';//if checkbox unchecked then remove the item
                ortsteil_element += '}';
                //ortsteil_element += 'console.log("ARRAY ORTSTEILE ITEMS: " + selected_locations);';//trace
                ortsteil_element += 'homeinfo_immosearch_global();';
                ortsteil_element += '});';

                ortsteil_element += '});';
                ortsteil_element += '<\/script>';

                $("#dynamic_area_list").append(ortsteil_element);//append areas
          }

					//Ausstattung parser (needs to be outside of "immobilie" each loop)
					$(xml).find("ausstattung").each(function(i) {
						//console.log("AUSSTATTUNG GROUP LENGTH: " + $(this).children().length);//trace

						//check the length of the <tags>
						if ($(this).children().length > 0) {
							immosearch_array_object_ausstattung.push([]);//add anonymous array in immosearch_array_object_ausstattung array (multidimensional array)
							var total_group_length = $(this).children().length;
							for(var i_inner = 0; i_inner < total_group_length; i_inner++) {
								var object_ausstattung = $(this).children()[i_inner].nodeName;
								//console.log("AUSSTATTUNG NODE NAMES: " + object_ausstattung);//trace

								//check the node names and push in database
								if (object_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("DUSCHE") == "true") {
									immosearch_array_object_ausstattung[i].push("Dusche");
								} else if (object_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("WANNE") == "true") {
									immosearch_array_object_ausstattung[i].push("Badewanne");
								} else if (object_ausstattung == "bad" && $(this).children()[i_inner].getAttribute("FENSTER") == "true") {
									immosearch_array_object_ausstattung[i].push("Badezimmerfenster");
								} else if (object_ausstattung == "kueche" && $(this).children()[i_inner].getAttribute("EBK") == "true") {
									immosearch_array_object_ausstattung[i].push("EBK");
								} else if (object_ausstattung == "kamin" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("Kamin");
								} else if (object_ausstattung == "klimatisiert" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("Klimatisiert");
								} else if (object_ausstattung == "fahrstuhl" && $(this).children()[i_inner].getAttribute("PERSONEN") == "true" || $(this).children()[i_inner].getAttribute("LASTEN") == "true") {
									immosearch_array_object_ausstattung[i].push("Aufzug");
								} else if (object_ausstattung == "gartennutzung" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("Gartennutzung");
								} else if (object_ausstattung == "moebliert" && $(this).children()[i_inner].getAttribute("moeb") == "VOLL" || $(this).children()[i_inner].getAttribute("moeb") == "TEIL") {
									immosearch_array_object_ausstattung[i].push("Möbliert");
								} else if (object_ausstattung == "rollstuhlgerecht" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("Rollstuhlger");
								} else if (object_ausstattung == "kabel_sat_tv" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("Kabel Sat TV");
								} else if (object_ausstattung == "dvbt" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("DVBT");
								} else if (object_ausstattung == "barrierefrei" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("Barrierefrei");
								} else if (object_ausstattung == "sauna" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("Sauna");
								} else if (object_ausstattung == "wasch_trockenraum" && $(this).children()[i_inner].nodeValue == "true") {
									immosearch_array_object_ausstattung[i].push("Trockenraum");
								} else if (object_ausstattung == "unterkellert" && $(this).children()[i_inner].getAttribute("keller") == "JA" || $(this).children()[i_inner].getAttribute("keller") == "TEIL") {
									immosearch_array_object_ausstattung[i].push("Keller");
								}

							}
						}
					});

          //push the pictures in the array
          $(xml).find("immobilie anhaenge").each(function(iv) {

              //console.log("TOTAL ANHAEGE: " + i);
              immosearch_array_img.push([]);

              $(this).find("anhang").each(function(i) {
                if ($(this).attr("gruppe") == "BILD" || $(this).attr("gruppe") == "TITELBILD" || $(this).attr("gruppe") == "AUSSENANSICHTEN") {
                  if ($(this).attr("location") == "REMOTE") {
                    var immosearch_list_img_url = $(this).children().find("pfad").text();
                    if (immosearch_list_img_url) {
                      immosearch_array_img[iv].push(immosearch_list_img_url);//push url
                    } else {
                      immosearch_array_img[iv].push(customer_img_dummy);//dummy image
                    }
                  } else if ($(this).attr("location") == "INTERN" || $(this).attr("gruppe") == "INNENANSICHTEN") {
                    var immosearch_list_img = $(this).children().find("anhanginhalt").text();
                    if (immosearch_list_img) {
                      immosearch_array_img[iv].push(immosearch_list_img);//push base64 data
                    } else {
                      immosearch_array_img[iv].push(customer_img_dummy);//dummy image
                    }
                  }
                }
              });

          });

					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//PARSE///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

					//add total angebote to title
					$("#total_angebote_in_title").html(total_counter + " Angebote");
          if (total_counter > 0) {
            $("#immo_erweiterte_suche_btn_ok").show();
            $("#total_angebote_in_title").css('color', '#AAA91F');
          } else {
            $("#immo_erweiterte_suche_btn_ok").hide();
            $("#total_angebote_in_title").css('color', '#FF0000');
          }

					//start append data
					$.each(immosearch_array_object_zimmer, function(i, array_value) {

            var immosearch_element = '<div class="row" style="margin-top:10px; cursor:pointer;" id="object_details___' + i + '">';

            immosearch_element += '<div class="col-md-3 col-sm-6 col-xs-12">';
            if (typeof immosearch_array_img[i] == "undefined" || typeof immosearch_array_img[i][0] == "undefined") {
              immosearch_element += '<img src="' + customer_img_dummy_details + '" id="__building_pic__' + i + '" width="350" height="267">';
            } else {
              //immosearch_element += '<img class="thumbnail" src="' + immosearch_array_img[i][0] + '" id="__building_pic__' + i + '" width="350" height="267">';

              /*
              immosearch_element += '<div class="custom_mask">';
              immosearch_element += '<img class="thumbnail" src="' + immosearch_array_img[i][0] + '" id="__building_pic__' + i + '" width="350" height="267">';
              immosearch_element += '</div>';
              */

              immosearch_element += '<div class="img_mask">';
              immosearch_element += '<img src="' + immosearch_array_img[i][0] + '" class="portrait" />';
              immosearch_element += '</div>';
            }

            immosearch_element += '</div>';

            immosearch_element += '<div class="col-md-6 col-sm-6 col-xs-12" id="responsive_point_laptops">';

            var immosearch_array_object_zimmer___display_value = removeAfterCertainCharacter(immosearch_array_object_zimmer[i], ".") + " Zimmer Wohnung | ";
            var list_address_number = immosearch_array_object_address_number[i];
            if (list_address_number.charAt(0) == 0) {//check if start with 0
              list_address_number = checkIfNumberStartsFromZero(immosearch_array_object_address_number[i]);
            } else {
              list_address_number = immosearch_array_object_address_number[i];
            }
            var immosearch_array_object_address___display_value = immosearch_array_object_address[i] + " " + list_address_number + " | ";
            var list_plz_number = immosearch_array_object_plz_number[i];
            var list_ort = immosearch_array_object_ort[i];
            var list_ort_without_plz = immosearch_array_object_ort[i];
            var list_ortsteil = immosearch_array_object_ortsteil[i];

            if (typeof immosearch_array_object_zimmer___display_value == "undefined") {
              immosearch_array_object_zimmer___display_value = "";
            }
            if (typeof list_plz_number == "undefined") {
              list_plz_number = "";
            }
            if (typeof list_ort == "undefined") {
              list_ort = "";
            }
            if (typeof list_ortsteil == "undefined") {
              list_ortsteil = "";
            }
            if (typeof immosearch_array_object_address___display_value == "undefined") {
              immosearch_array_object_address___display_value = "";
            }
            if (typeof list_address_number == "undefined") {
              list_address_number = "";
            }
            if (typeof list_address_number == "undefined") {
              list_address_number = "";
            }

            immosearch_element += '<p><strong id="list_title_style">' + immosearch_array_object_zimmer___display_value + immosearch_array_object_address___display_value + ' ' + list_ort + ' ' + list_ortsteil + '</strong></p>';

            immosearch_element += immosearch_array_object_objektart[i] + ' zur Miete';

            immosearch_element += '</div>';

            immosearch_element += '<div class="col-md-6 col-sm-6 col-xs-12" id="responsive_point_laptops">';

            //3 div's side by side
            immosearch_element += '<div class="row row-list">';
            immosearch_element += '<div class="col-xs-4">';
            var immosearch_array_object_grundmiete___display_value = replaceDotWithComma(immosearch_array_object_nettokaltmiete[i]);
            if (typeof immosearch_array_object_grundmiete___display_value != "undefined" && immosearch_array_object_grundmiete___display_value) {

              immosearch_array_object_grundmiete___display_value = ifLastCharIsOnlyOneNull(immosearch_array_object_grundmiete___display_value);
              immosearch_array_object_grundmiete___display_value = afterCommaKeep2Char(immosearch_array_object_grundmiete___display_value);
              immosearch_element += '<p id="list_text_style">' + immosearch_array_object_grundmiete___display_value + ' &euro;<br></p><p id="list_text_second_line_text">Miete zzgl. NK</p>';

            } else {
              //case that nettokaltmiete is empty
              immosearch_array_object_grundmiete___display_value = replaceDotWithComma(immosearch_array_object_kaltmiete[i]);
              if (typeof immosearch_array_object_grundmiete___display_value != "undefined" && immosearch_array_object_grundmiete___display_value) {

                immosearch_array_object_grundmiete___display_value = ifLastCharIsOnlyOneNull(immosearch_array_object_grundmiete___display_value);
                immosearch_array_object_grundmiete___display_value = afterCommaKeep2Char(immosearch_array_object_grundmiete___display_value);

                immosearch_element += '<p id="list_text_style">' + immosearch_array_object_grundmiete___display_value + ' &euro;<br></p><p id="list_text_second_line_text">Miete zzgl. NK</p>';
              } else {
                //if empty K.A.
                immosearch_element += '<p id="list_text_style">K.A. &euro;<br></p><p id="list_text_second_line_text">Miete zzgl. NK</p>';
              }
            }
            immosearch_element += '</div>';
            immosearch_element += '<div class="col-xs-4">';

            var immosearch_array_object_wohnflaeche___display_value = immosearch_array_object_wohnflaeche[i];
            if (typeof immosearch_array_object_wohnflaeche___display_value != "undefined" && immosearch_array_object_wohnflaeche___display_value) {
              immosearch_element += '<p id="list_text_style">' + immosearch_array_object_wohnflaeche___display_value.dot2comma() + ' m&#178;<br></p><p id="list_text_second_line_text">Wohnfläche</p>';
              $("#form_wohnflache_ca").html(immosearch_array_object_wohnflaeche___display_value.dot2comma() + ' m&#178;');//form
            } else {
              immosearch_element += '<p id="list_text_style">K.A. m&#178;<br></p><p id="list_text_second_line_text">Wohnfläche</p>';
              $("#form_wohnflache_ca").html('K.A. m&#178;');//form
            }

            immosearch_element += '</div>';
            immosearch_element += '<div class="col-xs-4">';
            var immosearch_array_object_gesamtmiete___display_value = "";
            //console.log("HEIZKOSTEN: " + immosearch_array_object_heizkosten[i]);
            var immosearch_var_object_heizkosten_enthalten = immosearch_array_object_heizkosten_enthalten[i];
            if (immosearch_var_object_heizkosten_enthalten == true) {
              immosearch_array_object_gesamtmiete___display_value = parseFloat(immosearch_array_object_nettokaltmiete[i]) + parseFloat(immosearch_array_object_nebenkosten[i]);
            } else {
              immosearch_array_object_gesamtmiete___display_value = parseFloat(immosearch_array_object_nettokaltmiete[i]) + parseFloat(immosearch_array_object_nebenkosten[i]) + parseFloat(immosearch_array_object_heizkosten[i]);
            }

            immosearch_array_object_gesamtmiete___display_value = JSON.stringify(immosearch_array_object_gesamtmiete___display_value);//modify from object to string
            immosearch_array_object_gesamtmiete___display_value = replaceDotWithComma(immosearch_array_object_gesamtmiete___display_value);//replace dot with comma
            immosearch_array_object_gesamtmiete___display_value = ifLastCharIsOnlyOneNull(immosearch_array_object_gesamtmiete___display_value);

            //append the value
            //afterCommaKeep2Char(immosearch_array_object_gesamtmiete___display_value)
            var list_zimmer_value = removeAfterCertainCharacter(immosearch_array_object_zimmer[i], ".");
            if (typeof list_zimmer_value != "undefined" && list_zimmer_value) {
              immosearch_element += '<p id="list_text_style">' + list_zimmer_value + '<br></p><p id="list_text_second_line_text">Zimmer</p>';
            } else {
              immosearch_element += '<p id="list_text_style"><strong>Zimmer:</strong> K.A.</p>';
            }

            immosearch_element += '</div>';
            immosearch_element += '</div>';//<div class="row row-list">

            immosearch_element += '</div>';


            immosearch_element += '<div class="col-md-6 col-sm-6 col-xs-12" id="responsive_point_laptops">';

            immosearch_element += '</div>';

            immosearch_element += '<div class="col-md-6 col-sm-6 col-xs-12" id="responsive_point_laptops">';
            if (immosearch_array_object_ausstattung.length > 0) {
              if (typeof immosearch_array_object_ausstattung[i] != 'undefined' || immosearch_array_object_ausstattung[i] != '') {
                for(var loop = 0; loop < immosearch_array_object_ausstattung[i].length; loop++) {
                  //change color 1 by 1 (Yellow, Green)
                  if (isOdd(loop) == false) {
                    immosearch_element += '<input type="button" class="btn btn-default btn-xs" value="' + immosearch_array_object_ausstattung[i][loop] + '" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px;">';
                  } else {
                    immosearch_element += '<input type="button" class="btn btn-default btn-xs" value="' + immosearch_array_object_ausstattung[i][loop] + '" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px;">';
                  }
                };
              }
            }

            if (immosearch_array_object_balkon[i] == "1.0") {
              immosearch_element += '<input type="button" class="btn btn-default btn-xs" value="Balkon" id="immo_small_icons" style="border-color:#f89406; color:#FFFFFF; background-color:#f89406; margin-right:5px;">';
            }
            immosearch_element += '<p style="margin-top:10px;"><input type="button" class="btn btn-default" value="Details" id="immo_details_btn"></p>';
            immosearch_element += '</div>';

            immosearch_element += '</div>';

            immosearch_element += '<div class="row">';
            immosearch_element += '<div class="col-md-12">';
            immosearch_element += '<hr>';
            immosearch_element += '</div>';
            immosearch_element += '</div>';

							immosearch_element += '<script>';
							immosearch_element += '$(document).ready(function() {';
							immosearch_element += '$("#object_details___' + i + '").click(function() {';
								immosearch_element += 'homeinfo_immosearch_details("' + immosearch_array_object_object_number[i] + '");';//(needs to convert in String value "object id") then ajax call for details page
								immosearch_element += 'return false;';
							immosearch_element += '});';
							immosearch_element += '});';
							immosearch_element += '<\/script>';

						$("#immo_data").append(immosearch_element);//add elements to HTML
					});

					//$("#immo_data").html(immosearch_element);//add elements to HTML
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//SHOW DATA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				} else {
					//no children nodes, inform user
					swal({
						title: "Achtung!",
						text: "Keine Angebote vorhanden!",
						type: "warning",
						html: true,
						confirmButtonColor: "#f8bf86",
						confirmButtonText: "Wiederholen",
						allowOutsideClick: false,
						showConfirmButton: true
					},
					function(isConfirm){
						if (isConfirm) {

						}
					});

				}//if ($(xml).find("ns1\\:rsp").children().length >= 0) {
			},
			error: function (xhr, request, status, error) {
				//general error for ajax call
				//console.log(request.responseText);
				//console.log(xhr.responseText);

				//inform the user
				swal({
					title: "Achtung!",
					text: "Etwas ist schief gelaufen, bitte erneut versuchen oder Service kontaktieren.",
					type: "warning",
					html: true,
					confirmButtonColor: "#f8bf86",
					confirmButtonText: "Wiederholen",
					allowOutsideClick: false,
					showConfirmButton: true
				},
				function(isConfirm){
					if (isConfirm) {

					}
				});

				/*
				if (xhr.status===400) {

				}//if (xhr.status===400) {
				*/
			}//error: function (request, status, error) {
		});
	});//$(document).ready(function() {
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL VARS & FUNCTIONS///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DOCUMENT LOAD & DOCUMENT READY////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//document load  (executes when complete page is fully loaded, including all frames, objects and images)
$(window).load(function() {

});

//document ready (executes when HTML-Document is loaded and DOM is ready)
$(document).ready(function() {

	//btn advance search form (hide/show the form)
  $("#immo_erweiterte_suche_btn_ok").hide();
	$("#immo_erweiterte_suche_btn").click(function(e) {
		$("#immo_erweiterte_suche_form").fadeToggle("slow");
		//change the button value (while hide/show the form)
		var array_btn_values = ['Schließen', 'Erweiterte Suche'];//array to strore button values
		$(this).val($(this).val() == array_btn_values[0] ? array_btn_values[1] : array_btn_values[0]);
	});

  $("#immo_erweiterte_suche_btn_ok").click(function(e) {
		$("#immo_erweiterte_suche_form").fadeToggle("slow");
		//change the button value back to orginal text
    if ($("#immo_erweiterte_suche_btn").val() == "Schließen") {
      $("#immo_erweiterte_suche_btn").val("Erweiterte Suche");
    } else {
      $("#immo_erweiterte_suche_btn").val("Schließen");
    }
	});

	//on load select the default value 0 (Bitte wählen) dropdown
	$('#immo_filter option[value="0"]').attr("selected", true);

	$("#immo_filter").change(function() {

    $("#details_page_back_to_list").hide();
    $("#details_page_print").hide();
    $("#immo_title_angebote").show();

		var immodrop_down_value = $(this).val();

		if (immodrop_down_value == 0) {
			//default
			sorting = "";
		} else if (immodrop_down_value == 1) {
			sorting = "zimmer";//sort by (Zimmer aufsteigend) small
		} else if (immodrop_down_value == 2) {
			sorting = "zimmer:desc";//sort by (Zimmer absteigend) bigger
		} else if (immodrop_down_value == 3) {
			sorting = "wohnflaeche";//sort by (Fläche aufsteigend) small
		} else if (immodrop_down_value == 4) {
			sorting = "wohnflaeche:desc";//sort by (Fläche absteigend) bigger
		} else if (immodrop_down_value == 5) {
			sorting = "kaltmiete";//sort by (Grundmiete aufsteigend) small (kaltmiete)
		} else if (immodrop_down_value == 6) {
			sorting = "kaltmiete:desc";//sort by (Grundmiete absteigend) bigger (kaltmiete)
		} else if (immodrop_down_value == 7) {
			sorting = "gesamtmiete";//sort by smallest (Gesamtmiete aufsteigend) small (warmmiete)
		} else if (immodrop_down_value == 8) {
			sorting = "gesamtmiete:desc";//sort by smallest (Gesamtmiete absteigend) bigger (warmmiete)
		}

		homeinfo_immosearch_global();//ajax call, function homeinfo_immosearch_global()
	});

	$("#zimmer_von").val("");//empty the filed on load
	$("#zimmer_von").on('input', function() {
		//console.log("ZIMMER VON: " + $(this).val());
		zimmer_von = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#zimmer_bis").val("");//empty the filed on load
	$("#zimmer_bis").on('input', function() {
		//console.log("ZIMMER BIS: " + $(this).val());
		zimmer_bis = + $(this).val();
		homeinfo_immosearch_global();
	});

	$("#wohnflaeche_von").val("");//empty the filed on load
	$("#wohnflaeche_von").on('input', function() {
		//console.log("WOHNFLAECHE VON: " + $(this).val());
		wohnflaeche_von = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#wohnflaeche_bis").val("");//empty the filed on load
	$("#wohnflaeche_bis").on('input', function() {
		//console.log("WOHNFLAECHE BIS: " + $(this).val());
		wohnflaeche_bis = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#grundmiete_von").val("");//empty the filed on load
	$("#grundmiete_von").on('input', function() {
		//console.log("GRUNDMIETE VON: " + $(this).val());
		grundmiete_von = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#grundmiete_bis").val("");//empty the filed on load
	$("#grundmiete_bis").on('input', function() {
		console.log("GRUNDMIETE BIS: " + $(this).val());
		grundmiete_bis = $(this).val();
		homeinfo_immosearch_global();
	});

	$("#terrasse").attr('checked', false);//uncheck the checkbox on load
	$("#terrasse").on('change', function() {
		if ($(this).attr("checked")) {
			terrasse = true;
		} else {
			terrasse = false;
		}
		homeinfo_immosearch_global();
	});

	$("#garten").attr('checked', false);//uncheck the checkbox on load
	$("#garten").on('change', function() {
		if ($(this).attr("checked")) {
			garten = true;
		} else {
			garten = false;
		}
		homeinfo_immosearch_global();
	});

	$("#balkon_loggia").attr('checked', false);//uncheck the checkbox on load
	$("#balkon_loggia").on('change', function() {
		if ($(this).is(":checked")) {
			balkon = true;
		} else {
			balkon = false;
		}
		homeinfo_immosearch_global();
	});

	$("#bad_mit_wanne").attr('checked', false);//uncheck the checkbox on load
	$("#bad_mit_wanne").on('change', function() {
		if ($(this).is(":checked")) {
			wanne = true;
		} else {
			wanne = false;
		}
		homeinfo_immosearch_global();
	});

	$("#bad_mit_dusche").attr('checked', false);//uncheck the checkbox on load
	$("#bad_mit_dusche").on('change', function() {
		if ($(this).is(":checked")) {
			dusche = true;
		} else {
			dusche = false;
		}
		homeinfo_immosearch_global();
	});

	$("#aufzug").attr('checked', false);//uncheck the checkbox on load
	$("#aufzug").on('change', function() {
		if ($(this).is(":checked")) {
			aufzug = true;
		} else {
			aufzug = false;
		}
		homeinfo_immosearch_global();
	});

	$("#eg").attr('checked', false);//uncheck the checkbox on load
	$("#eg").on('change', function() {
		if ($(this).is(":checked")) {
			erdgeschoss = true;
		} else {
			erdgeschoss = false;
		}
		homeinfo_immosearch_global();
	});

	$("#1og").attr('checked', false);//uncheck the checkbox on load
	$("#1og").on('change', function() {
		if ($(this).is(":checked")) {
			first_floor = true;
		} else {
			first_floor = false;
		}
		homeinfo_immosearch_global();
	});

	$("#2og_oder_hoher").attr('checked', false);//uncheck the checkbox on load
	$("#2og_oder_hoher").on('change', function() {
		if ($(this).is(":checked")) {
			second_floor = true;
		} else {
			second_floor = false;
		}
		homeinfo_immosearch_global();
	});

	//ajax call on page load
	homeinfo_immosearch_global();

  //btn clean the form
  $("#empty_search_fileds_btn").click(function(e) {

    //empty the fields of the form
    $("#immo_filter option[value='0']").prop('selected', true);
    $("#zimmer_von").val("");
    $("#zimmer_bis").val("");
    $("#wohnflaeche_von").val("");
    $("#wohnflaeche_bis").val("");
    $("#grundmiete_von").val("");
    $("#grundmiete_bis").val("");

    //clear checkboxes
    $("input:checkbox").prop('checked', false);
    $("input:checkbox").removeAttr('checked');

    //hide the form
    $("#immo_erweiterte_suche_form").hide();

    //change the button value (while hide/show the form)
		var array_btn_values = ['Schliessen', 'Erweiterte Suche'];//array to strore button values
    if ($("#immo_erweiterte_suche_btn").val() == "Schliessen") {
      $("#immo_erweiterte_suche_btn").val("Erweiterte Suche");
    }

    immodrop_down_value = "";
    zimmer_von = "";
    zimmer_bis = "";
    wohnflaeche_von = "";
    wohnflaeche_bis = "";
    grundmiete_von = "";
    grundmiete_bis = "";
    terrasse = false;
    garten = false;
    balkon = false;
    wanne = false;
    dusche = false;
    aufzug = false;
    erdgeschoss = false;
    first_floor = false;
    second_floor = false;
    selected_locations = [];

    $("#empty_search_fileds_btn").hide();
    homeinfo_immosearch_global();
	});

	//clear console.log()
	//console.clear();

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DOCUMENT LOAD & DOCUMENT READY////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
