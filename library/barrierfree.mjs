/*
  barrierfree.mjs - ImmoBrowse library for accessible real estates

  (C) 2021 HOMEINFO - Digitale Informationssysteme GmbH

  This library is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this library.  If not, see <http://www.gnu.org/licenses/>.

  Maintainer: Richard Neumann <r dot neumann at homeinfo period de>
*/
'use strict';


import { request } from 'https://javascript.homeinfo.de/requests.mjs';
import { setValue, RealEstate as BaseRealEstate, Filter as BaseFilter } from './immobrowse.mjs';


/*
  Extended real estate with additional barrier
  freeness related properties and methods.
*/
export class RealEstate extends BaseRealEstate {
    constructor (json, portal) {
        super(json);
        this.portal = portal;
    }

    /*
      Queries real estate data from the API.
    */
    static get (objectId, portal) {
        const cls = this;
        return request.get('https://backend.homeinfo.de/barrierfree/expose/' + objectId + '?portal=' + portal).then(
            request => new cls(request.json, portal),
            function() {
                alert('Immobilie konnte nicht geladen werden.\nBitte versuchen Sie es später noch ein Mal.');
            }
        );
    }

    /*
      Queries API for real estate list.
    */
    static list (portal) {
        const cls = this;
        return request.get('https://backend.homeinfo.de/barrierfree/list?portal=' + portal).then(
            function (request) {
                const realEstates = [];

                for (const object of request.json) {
                    const realEstate = new cls(object, portal);
                    realEstates.push(realEstate);
                }

                return realEstates;
            },
            function() {
                alert('Immobilien konnten nicht geladen werden.\nBitte versuchen Sie es später noch ein Mal.');
            }
        );
    }

    /*
      Determines whether the real estate is completely barrier free
    */
    get completelyBarrierFree () {
        const barrierFreeness = this.barrier_freeness || {};

        function entryOk() {
            const entry = barrierFreeness.entry || {};
            return barrierFreeness.stairs == '0' || (entry.ramp_din && (barrierFreeness.stairs == '0-1' || barrierFreeness.stairs == '2-8'));
        }

        function doorsOk() {
            const entry = barrierFreeness.entry || {};
            return barrierFreeness.wide_door && barrierFreeness.low_thresholds && barrierFreeness.wide_doors && entry.door_opener;
        }

        function liftOk() {
            const lift = barrierFreeness.lift || {};
            return lift.value == 'DIN';
        }

        function bathOk() {
            const bath = barrierFreeness.bath || {};
            return bath.wide && (bath.shower_tray == 'low' || bath.shower_tray == 'walk-in');
        }

        function wheelchairParkingOk() {
            return barrierFreeness.wheelchair_parking == 'indoors' || barrierFreeness.wheelchair_parking == 'outdoors';
        }

        function doobellPanelOk() {
            const entry = barrierFreeness.entry || {};
            return entry.doorbell_panel;
        }

        return entryOk() && doorsOk() && liftOk() && bathOk() && wheelchairParkingOk() && doobellPanelOk();
    }

    /*
      Determines whether the real estate is limited barrier free
    */
    get limitedBarrierFree () {
        const barrierFreeness = this.barrier_freeness || {};
        const entry = barrierFreeness.entry || {};
        return barrierFreeness.stairs == '0' || (entry.ramp_din && (barrierFreeness.stairs == '0-1' || barrierFreeness.stairs == '2-8'));
    }

    *amenities () {
        yield* super.amenities();

        if (this.completelyBarrierFree())
            yield 'vollständig barrierefrei';
        else if (this.limitedBarrierFree())
            yield 'eingeschränkt barrierefrei';
    }

    attachmentURL (anhang) {
        if (anhang == null)
            return null;

        return 'https://backend.homeinfo.de/barrierfree/attachment/' + anhang.id + '?real_estate=' + this.id + '&portal=' + this.portal;
    }

    *barrierFreeAmenities () {
        const barrierFreeness = this.barrier_freeness || {};
        const entry = barrierFreeness.entry || {};
        const lift = barrierFreeness.lift || {};
        const bath = barrierFreeness.bath || {};
        const balcony = barrierFreeness.balcony || {};

        if (barrierFreeness.stairs == '0')
            yield 'Keine Stufen bis zum Wohnungseingang';
        else if (barrierFreeness.stairs == '0-1')
            yield 'Maximal eine Stufe bis zum Wohnungseingang';
        else if (barrierFreeness.stairs == '2-8')
            yield '2-8 Stufen bis zum Wohnungseingang';

        if (entry.ramp_din)
            yield 'Rampe mit bis zu 6 % Gefälle (nach DIN-Norm)';
        else if (entry.ramp_din === false)
            yield 'Rampe mit über 6 % Gefälle';

        if (barrierFreeness.wide_door)
            yield 'Mindestbreite der Wohnungseingangstür 90 cm';

        if (barrierFreeness.low_thresholds)
            yield 'keine Türschwellen > 2cm (außer Balkon)';

        if (barrierFreeness.wide_doors)
            yield 'Mindestbreite aller Wohnungstüren 80 cm (außer Abstellraum und Balkon)';

        if (entry.door_opener)
            yield 'Automatischer Türöffner an der Haustür';

        if (lift) {
            yield 'Aufzug';

            if (lift.wide_door)
                yield 'Mindestbreite der Aufzugstür 80 cm';

            if (lift.value == '90x140')
                yield 'Kabinengröße bis 90 x 140 cm Innenmaß';
            else if (lift.value == 'DIN')
                yield 'Kabinengröße ab 90 x 140 cm Innenmaß (nach DIN-Norm)';
        }

        if (bath.bathtub)
            yield 'Badewanne';

        if (bath.shower_tray == 'high')
            yield 'Hoher Duschwanne ab 7 cm';
        else if (bath.shower_tray == 'low')
            yield 'Flache Duschwanne bis 7 cm (nach DIN-Norm)';
        else if (bath.shower_tray == 'walk-in')
            yield 'Bodengleiche Dusche (nach DIN-Norm)';

        if (bath.wide)
            yield 'Durchgangsbreite Vorderseite Sanitärobjekt zur Wand mind. 120 cm';

        if (bath.large)
            yield 'Größe des Badezimmers ab 3 m²';

        if (balcony.wide_door)
            yield 'Mindestbreite Balkontür 80cm';

        if (balcony.threshold)
            yield 'Balkon mit Schwelle (Höhe 2 cm und mehr)';
        else if (balcony.threshold === false)
            yield 'Balkon schwellenlos erreichbar (Absatz bis 2 cm)';

        if (balcony.large)
            yield 'Balkongröße über 2,5 m²';

        if (entry.doorbell_panel)
            yield 'Klingeltableau behindertengerecht (große Tasten, große Ziffern, Höhe +/- 85 cm)';

        if (entry.intercom)
            yield 'Gegensprechanlage';

        if (barrierFreeness.wheelchair_parking == 'indoors')
            yield 'Abstellmöglichkeit für Hilfsmittel (Rollator/Rollstuhl) 1,90 x 3 m innerhalb der Wohnung';
        else if (barrierFreeness.wheelchair_parking == 'outdoors')
            yield 'Abstellmöglichkeit für Hilfsmittel (Rollator/Rollstuhl) 1,90 x 3 m außerhalb der Wohnung';
    }

    render (elements) {
        super.render(elements);
        setValue(elements.barrierFreeAmenitiesList, this.listAmenities(this.barrierFreeAmenities()));
    }
}


/*
  Extended filter for barrier freeness filering
*/
export class Filter extends BaseFilter {
    constructor (rules) {
        super(rules);
    }

    match (realEstate) {
        if (this.rules.completelyBarrierFree) {
            if (! realEstate.completelyBarrierFree)
                return false;
        }

        if (this.rules.limitedBarrierFree) {
            if (! realEstate.limitedBarrierFree)
                return false;
        }

        return super.match(realEstate);
    }
}
