/*
    HOMEINFO OpenImmo™ XML DOM library-jquery plugin

    (C) 2015 HOMEINFO - Digitale Informationssysteme GmbH

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    Change log:
    * 24.06.2015: Created jQuery.openimmo.js
*/

// anbieter
var openImmoArray__anbieter__anbieternr = [];
var openImmoArray__anbieter__firma = [];
var openImmoArray__anbieter__openimmo_anid = [];
var openImmoArray__anbieter__lizenzkennung = [];
var openImmoArray__anbieter__anhang = [];
var openImmoArray__anbieter__immobilie = [];
var openImmoArray__anbieter__impressum = [];
var openImmoArray__anbieter__impressum_strukt = [];
var openImmoArray__anbieter__user_defined_simplefield = [];
var openImmoArray__anbieter__user_defined_anyfield = [];
var openImmoArray__anbieter__user_defined_extend = [];

// objektkategorie
var openImmoArray__objektkategorie__nutzungsart = [];
var openImmoArray__objektkategorie__vermarktungsart = [];
var openImmoArray__objektkategorie__objektart = [];
var openImmoArray__objektkategorie__user_defined_simplefield = [];
var openImmoArray__objektkategorie__user_defined_anyfield = [];
var openImmoArray__objektkategorie__user_defined_extend = [];

// geo
var openImmoArray__geo__plz = [];
var openImmoArray__geo__ort = [];
var openImmoArray__geo__geokoordinaten = [];
var openImmoArray__geo__strasse = [];
var openImmoArray__geo__hausnummer = [];
var openImmoArray__geo__bundesland = [];
var openImmoArray__geo__land = [];
var openImmoArray__geo__gemeindecode = [];
var openImmoArray__geo__flur = [];
var openImmoArray__geo__flurstueck = [];
var openImmoArray__geo__gemarkung = [];
var openImmoArray__geo__etage = [];
var openImmoArray__geo__anzahl_etagen = [];
var openImmoArray__geo__lage_im_bau = [];
var openImmoArray__geo__wohnungsnr = [];
var openImmoArray__geo__lage_gebiet = [];
var openImmoArray__geo__regionaler_zusatz = [];
var openImmoArray__geo__karten_makro = [];
var openImmoArray__geo__karten_mikro = [];
var openImmoArray__geo__virtuelletour = [];
var openImmoArray__geo__luftbildern = [];
var openImmoArray__geo__user_defined_simplefield = [];
var openImmoArray__geo__user_defined_anyfield = [];
var openImmoArray__geo__user_defined_extend = [];

// kontaktperson
var openImmoArray__kontaktperson__email_zentrale = [];
var openImmoArray__kontaktperson__email_direkt = [];
var openImmoArray__kontaktperson__tel_zentrale = [];
var openImmoArray__kontaktperson__tel_durchw = [];
var openImmoArray__kontaktperson__tel_fax = [];
var openImmoArray__kontaktperson__tel_handy = [];
var openImmoArray__kontaktperson__name = [];
var openImmoArray__kontaktperson__vorname = [];
var openImmoArray__kontaktperson__titel = [];
var openImmoArray__kontaktperson__anrede = [];
var openImmoArray__kontaktperson__position = [];
var openImmoArray__kontaktperson__anrede_brief = [];
var openImmoArray__kontaktperson__firma = [];
var openImmoArray__kontaktperson__zusatzfeld = [];
var openImmoArray__kontaktperson__strasse = [];
var openImmoArray__kontaktperson__hausnummer = [];
var openImmoArray__kontaktperson__plz = [];
var openImmoArray__kontaktperson__ort = [];
var openImmoArray__kontaktperson__postfach = [];
var openImmoArray__kontaktperson__postf_plz = [];
var openImmoArray__kontaktperson__postf_ort = [];
var openImmoArray__kontaktperson__land = [];
var openImmoArray__kontaktperson__email_privat = [];
var openImmoArray__kontaktperson__email_sonstige = [];
var openImmoArray__kontaktperson__email_feedback = [];
var openImmoArray__kontaktperson__tel_privat = [];
var openImmoArray__kontaktperson__tel_sonstige = [];
var openImmoArray__kontaktperson__url = [];
var openImmoArray__kontaktperson__adressfreigabe = [];
var openImmoArray__kontaktperson__personennummer = [];
var openImmoArray__kontaktperson__immobilientreuhaenderid = [];
var openImmoArray__kontaktperson__foto = [];
var openImmoArray__kontaktperson__freitextfeld = [];
var openImmoArray__kontaktperson__user_defined_simplefield = [];
var openImmoArray__kontaktperson__user_defined_anyfield = [];
var openImmoArray__kontaktperson__user_defined_extend = [];

// weitere_adresse
var openImmoArray__weitere_adresse__vorname = [];
var openImmoArray__weitere_adresse__name = [];
var openImmoArray__weitere_adresse__titel = [];
var openImmoArray__weitere_adresse__anrede = [];
var openImmoArray__weitere_adresse__anrede_brief = [];
var openImmoArray__weitere_adresse__firma = [];
var openImmoArray__weitere_adresse__zusatzfeld = [];
var openImmoArray__weitere_adresse__strasse = [];
var openImmoArray__weitere_adresse__hausnummer = [];
var openImmoArray__weitere_adresse__plz = [];
var openImmoArray__weitere_adresse__ort = [];
var openImmoArray__weitere_adresse__postfach = [];
var openImmoArray__weitere_adresse__postf_plz = [];
var openImmoArray__weitere_adresse__postf_ort = [];
var openImmoArray__weitere_adresse__land = [];
var openImmoArray__weitere_adresse__email_zentrale = [];
var openImmoArray__weitere_adresse__email_direkt = [];
var openImmoArray__weitere_adresse__email_privat = [];
var openImmoArray__weitere_adresse__email_sonstige = [];
var openImmoArray__weitere_adresse__tel_durchw = [];
var openImmoArray__weitere_adresse__tel_zentrale = [];
var openImmoArray__weitere_adresse__tel_handy = [];
var openImmoArray__weitere_adresse__tel_fax = [];
var openImmoArray__weitere_adresse__tel_privat = [];
var openImmoArray__weitere_adresse__tel_sonstige = [];
var openImmoArray__weitere_adresse__url = [];
var openImmoArray__weitere_adresse__adressfreigabe = [];
var openImmoArray__weitere_adresse__personennummer = [];
var openImmoArray__weitere_adresse__freitextfeld = [];
var openImmoArray__weitere_adresse__user_defined_simplefield = [];
var openImmoArray__weitere_adresse__user_defined_anyfield = [];
var openImmoArray__weitere_adresse__user_defined_extend = [];
var openImmoArray__weitere_adresse__adressart = [];

// preise
var openImmoArray__preise__kaufpreis = [];
var openImmoArray__preise__kaufpreisnetto = [];
var openImmoArray__preise__kaufpreisbrutto = [];
var openImmoArray__preise__nettokaltmiete = [];
var openImmoArray__preise__warmmiete = [];
var openImmoArray__preise__nebenkosten = [];
var openImmoArray__preise__heizkosten_enthalten = [];
var openImmoArray__preise__heizkosten = [];
var openImmoArray__preise__zzg_mehrwertsteuer = [];
var openImmoArray__preise__mietzuschlaege = [];
var openImmoArray__preise__hauptmietzinsnetto = [];
var openImmoArray__preise__pauschalmiete = [];
var openImmoArray__preise__betriebskostennetto = [];
var openImmoArray__preise__evbnetto = [];
var openImmoArray__preise__gesamtmietenetto = [];
var openImmoArray__preise__gesamtmietebrutto = [];
var openImmoArray__preise__gesamtbelastungnetto = [];
var openImmoArray__preise__gesamtbelastungbrutto = [];
var openImmoArray__preise__gesamtkostenprom2von = [];
var openImmoArray__preise__heizkostennetto = [];
var openImmoArray__preise__monatlichekostennetto = [];
var openImmoArray__preise__monatlichekostenbrutto = [];
var openImmoArray__preise__nebenkostenprom2von = [];
var openImmoArray__preise__ruecklagenetto = [];
var openImmoArray__preise__sonstigekostennetto = [];
var openImmoArray__preise__sonstigemietenetto = [];
var openImmoArray__preise__summemietenetto = [];
var openImmoArray__preise__nettomieteprom2von = [];
var openImmoArray__preise__pacht = [];
var openImmoArray__preise__erbpacht = [];
var openImmoArray__preise__hausgeld = [];
var openImmoArray__preise__abstand = [];
var openImmoArray__preise__preis_zeitraum_von = [];
var openImmoArray__preise__preis_zeitraum_bis = [];
var openImmoArray__preise__preis_zeiteinheit = [];
var openImmoArray__preise__mietpreis_pro_qm = [];
var openImmoArray__preise__kaufpreis_pro_qm = [];
var openImmoArray__preise__provisionspflichtig = [];
var openImmoArray__preise__provision_teilen = [];
var openImmoArray__preise__innen_courtage = [];
var openImmoArray__preise__aussen_courtage = [];
var openImmoArray__preise__courtage_hinweis = [];
var openImmoArray__preise__provisionnetto = [];
var openImmoArray__preise__provisionbrutto = [];
var openImmoArray__preise__waehrung = [];
var openImmoArray__preise__mwst_satz = [];
var openImmoArray__preise__mwst_gesamt = [];
var openImmoArray__preise__freitext_preis = [];
var openImmoArray__preise__x_fache = [];
var openImmoArray__preise__nettorendite = [];
var openImmoArray__preise__nettorendite_soll = [];
var openImmoArray__preise__nettorendite_ist = [];
var openImmoArray__preise__mieteinnahmen_ist = [];
var openImmoArray__preise__mieteinnahmen_soll = [];
var openImmoArray__preise__erschliessungskosten = [];
var openImmoArray__preise__kaution = [];
var openImmoArray__preise__kaution_text = [];
var openImmoArray__preise__geschaeftsguthaben = [];
var openImmoArray__preise__stp_carport = [];
var openImmoArray__preise__stp_duplex = [];
var openImmoArray__preise__stp_freiplatz = [];
var openImmoArray__preise__stp_garage = [];
var openImmoArray__preise__stp_parkhaus = [];
var openImmoArray__preise__stp_tiefgarage = [];
var openImmoArray__preise__stp_sonstige = [];
var openImmoArray__preise__richtpreis = [];
var openImmoArray__preise__richtpreisprom2 = [];
var openImmoArray__preise__user_defined_simplefield = [];
var openImmoArray__preise__user_defined_anyfield = [];
var openImmoArray__preise__user_defined_extend = [];

// bieterverfahren
var openImmoArray__bieterverfahren__beginn_angebotsphase = [];
var openImmoArray__bieterverfahren__besichtigungstermin = [];
var openImmoArray__bieterverfahren__besichtigungstermin_2 = [];
var openImmoArray__bieterverfahren__beginn_bietzeit = [];
var openImmoArray__bieterverfahren__ende_bietzeit = [];
var openImmoArray__bieterverfahren__hoechstgebot_zeigen = [];
var openImmoArray__bieterverfahren__mindestpreis = [];
var openImmoArray__bieterverfahren__user_defined_simplefield = [];
var openImmoArray__bieterverfahren__user_defined_anyfield = [];
var openImmoArray__bieterverfahren__user_defined_extend = [];

// versteigerung
var openImmoArray__versteigerung__zwangsversteigerung = [];
var openImmoArray__versteigerung__aktenzeichen = [];
var openImmoArray__versteigerung__zvtermin = [];
var openImmoArray__versteigerung__zusatztermin = [];
var openImmoArray__versteigerung__amtsgericht = [];
var openImmoArray__versteigerung__verkehrswert = [];

// flaechen
var openImmoArray__flaechen__wohnflaeche = [];
var openImmoArray__flaechen__nutzflaeche = [];
var openImmoArray__flaechen__gesamtflaeche = [];
var openImmoArray__flaechen__ladenflaeche = [];
var openImmoArray__flaechen__lagerflaeche = [];
var openImmoArray__flaechen__verkaufsflaeche = [];
var openImmoArray__flaechen__freiflaeche = [];
var openImmoArray__flaechen__bueroflaeche = [];
var openImmoArray__flaechen__bueroteilflaeche = [];
var openImmoArray__flaechen__fensterfront = [];
var openImmoArray__flaechen__verwaltungsflaeche = [];
var openImmoArray__flaechen__gastroflaeche = [];
var openImmoArray__flaechen__grz = [];
var openImmoArray__flaechen__gfz = [];
var openImmoArray__flaechen__bmz = [];
var openImmoArray__flaechen__bgf = [];
var openImmoArray__flaechen__grundstuecksflaeche = [];
var openImmoArray__flaechen__sonstflaeche = [];
var openImmoArray__flaechen__anzahl_zimmer = [];
var openImmoArray__flaechen__anzahl_schlafzimmer = [];
var openImmoArray__flaechen__anzahl_badezimmer = [];
var openImmoArray__flaechen__anzahl_sep_wc = [];
var openImmoArray__flaechen__anzahl_balkone = [];
var openImmoArray__flaechen__anzahl_terrassen = [];
var openImmoArray__flaechen__anzahl_logia = [];
var openImmoArray__flaechen__balkon_terrasse_flaeche = [];
var openImmoArray__flaechen__anzahl_wohn_schlafzimmer = [];
var openImmoArray__flaechen__gartenflaeche = [];
var openImmoArray__flaechen__kellerflaeche = [];
var openImmoArray__flaechen__fensterfront_qm = [];
var openImmoArray__flaechen__grundstuecksfront = [];
var openImmoArray__flaechen__dachbodenflaeche = [];
var openImmoArray__flaechen__teilbar_ab = [];
var openImmoArray__flaechen__beheizbare_flaeche = [];
var openImmoArray__flaechen__anzahl_stellplaetze = [];
var openImmoArray__flaechen__plaetze_gastraum = [];
var openImmoArray__flaechen__anzahl_betten = [];
var openImmoArray__flaechen__anzahl_tagungsraeume = [];
var openImmoArray__flaechen__vermietbare_flaeche = [];
var openImmoArray__flaechen__anzahl_wohneinheiten = [];
var openImmoArray__flaechen__anzahl_gewerbeeinheiten = [];
var openImmoArray__flaechen__einliegerwohnung = [];
var openImmoArray__flaechen__kubatur = [];
var openImmoArray__flaechen__ausnuetzungsziffer = [];
var openImmoArray__flaechen__flaechevon = [];
var openImmoArray__flaechen__flaechebis = [];
var openImmoArray__flaechen__user_defined_simplefield = [];
var openImmoArray__flaechen__user_defined_anyfield = [];
var openImmoArray__flaechen__user_defined_extend = [];

// ausstattung
var openImmoArray__ausstattung__ausstatt_kategorie = [];
var openImmoArray__ausstattung__wg_geeignet = [];
var openImmoArray__ausstattung__raeume_veraenderbar = [];
var openImmoArray__ausstattung__bad = [];
var openImmoArray__ausstattung__kueche = [];
var openImmoArray__ausstattung__boden = [];
var openImmoArray__ausstattung__kamin = [];
var openImmoArray__ausstattung__heizungsart = [];
var openImmoArray__ausstattung__befeuerung = [];
var openImmoArray__ausstattung__klimatisiert = [];
var openImmoArray__ausstattung__fahrstuhl = [];
var openImmoArray__ausstattung__stellplatzart = [];
var openImmoArray__ausstattung__gartennutzung = [];
var openImmoArray__ausstattung__ausricht_balkon_terrasse = [];
var openImmoArray__ausstattung__moebliert = [];
var openImmoArray__ausstattung__rollstuhlgerecht = [];
var openImmoArray__ausstattung__kabel_sat_tv = [];
var openImmoArray__ausstattung__dvbt = [];
var openImmoArray__ausstattung__barrierefrei = [];
var openImmoArray__ausstattung__sauna = [];
var openImmoArray__ausstattung__swimmingpool = [];
var openImmoArray__ausstattung__wasch_trockenraum = [];
var openImmoArray__ausstattung__wintergarten = [];
var openImmoArray__ausstattung__dv_verkabelung = [];
var openImmoArray__ausstattung__rampe = [];
var openImmoArray__ausstattung__hebebuehne = [];
var openImmoArray__ausstattung__kran = [];
var openImmoArray__ausstattung__gastterrasse = [];
var openImmoArray__ausstattung__stromanschlusswert = [];
var openImmoArray__ausstattung__kantine_cafeteria = [];
var openImmoArray__ausstattung__teekueche = [];
var openImmoArray__ausstattung__hallenhoehe = [];
var openImmoArray__ausstattung__angeschl_gastronomie = [];
var openImmoArray__ausstattung__brauereibindung = [];
var openImmoArray__ausstattung__sporteinrichtungen = [];
var openImmoArray__ausstattung__wellnessbereich = [];
var openImmoArray__ausstattung__serviceleistungen = [];
var openImmoArray__ausstattung__telefon_ferienimmobilie = [];
var openImmoArray__ausstattung__breitband_zugang = [];
var openImmoArray__ausstattung__umts_empfang = [];
var openImmoArray__ausstattung__sicherheitstechnik = [];
var openImmoArray__ausstattung__unterkellert = [];
var openImmoArray__ausstattung__abstellraum = [];
var openImmoArray__ausstattung__fahrradraum = [];
var openImmoArray__ausstattung__rolladen = [];
var openImmoArray__ausstattung__dachform = [];
var openImmoArray__ausstattung__bauweise = [];
var openImmoArray__ausstattung__ausbaustufe = [];
var openImmoArray__ausstattung__energietyp = [];
var openImmoArray__ausstattung__bibliothek = [];
var openImmoArray__ausstattung__dachboden = [];
var openImmoArray__ausstattung__gaestewc = [];
var openImmoArray__ausstattung__kabelkanaele = [];
var openImmoArray__ausstattung__seniorengerecht = [];
var openImmoArray__ausstattung__user_defined_simplefield = [];
var openImmoArray__ausstattung__user_defined_anyfield = [];
var openImmoArray__ausstattung__user_defined_extend = [];

// anhaenge
var openImmoArray__titelbild__remote = [];
var openImmoArray__titelbild__intern = [];
var openImmoArray__grundriss__remote = [];
var openImmoArray__grundriss__intern = [];
var openImmoArray__documente__remote = [];
var openImmoArray__documente__intern = [];

(function($){



})(jQuery);
