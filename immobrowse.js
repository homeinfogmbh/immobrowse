
<div class="row panel-body">
    <div class="col-md-3">
        <div class="img_mask img-responsive img-thumbnail">
            <img src="https://tls.homeinfo.de/immosearch/attachment/2776312" class="portrait" id="immosearch_image" width="300" height="201">
        </div>
    </div>
    <div class="col-md-9">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <h4><strong>2 Zimmer Wohnung | Am Alten Forsthaus 4 |  Dortmund Hombruch</strong></h4>
            <small>Wohnung zur Miete</small>
        </div>
        <div class="row col-md-12 col-sm-12 col-xs-12" style="margin-top:10px;">
            <div class="col-md-4">
                <h4><strong>300,37 €</strong></h4>
                <small>Miete zzgl. NK</small>
            </div>
            <div class="col-md-4">
                <h4><strong>50,7 m²</strong></h4>
                <small>Wohnfläche</small>
            </div>
            <div class="col-md-4">
                <h4><strong>2</strong></h4>
                <small>Zimmer</small>
            </div>
        </div>
        <div class="col-md-12 col-sm-12 col-xs-12" style="margin-top:25px;">
        </div>
    </div>
</div>


var immobrowse = immobrowse || {};


immobrowse.euroHtml = function (price) {
    return (price.toFixed(2) + ' €').replace(/./g, ',');
}

immobrowse.squareMetersHtml = function (area) {
    return (area.toFixed(2) + ' m²').replace(/./g, ',');
}


immobrowse.TitleImage = function (url) {
    this.url = url;
    this.img = function () {
        return '<img src="' + this.url + '" class="portrait" id="immosearch_image" width="300" height="201">';
    }
    this.html = function () {
        return '<div class="col-md-3"><div class="img_mask img-responsive img-thumbnail">' + this.img() + '</div></div>';
    }
}


immobrowse.Geo = function (street, houseNumber, city, zipCode, district) {
    this.street = street;
    this.houseNumber = houseNumber;
    this.city = city;
    this.zipCode = zipCode;
    this.district = district;
}


immobrowse.Areas = function (rooms, livingArea) {
    this.rooms = rooms;
    this.livingArea = livingArea;
}


immobrowse.Marketing = function (sale, rent) {
    this.sale = sale;
    this.rent = rent;
}


immobrowse.Prices = function (coldRentNet, coldRent, warmRent, serviceCharge, operationalCharge, heatingCost, heatingCostInServiceCharge) {
    this.coldRentNet = coldRentNet;
    this.coldRent = coldRent;
    this.warmRent = warmRent;
    this.serviceCharge = serviceCharge;
    this.operationalCharge = operationalCharge;
    this.heatingCost = heatingCost;
    this.heatingCostInServiceCharge = heatingCostInServiceCharge;
}


immobrowse.RentalFlat = function (id, geo, areas, marketing, prices) {
    this.id = id;
    this.geo = geo;
    this.areas = areas;
    this.marketing = marketing;
    this.prices = prices;

    this.titleImage = function () {
        for (anhang of this.anhaenge()) {
            if (anhang.gruppe == 'TITELBILD') {
                return new TitleImage(anhang.daten.pfad);
            }
        }

        // Fall back on any attachment
        for (anhang of this.anhaenge()) {
            return new TitleImage(anhang.daten.pfad);
        }
    }

    this.htmlPreview = function () {
        var html = '<div class="row panel-body">';
        html += this.titleImage().html();
        html += '<div class="col-md-9"><div class="col-md-12 col-sm-12 col-xs-12"><h4><strong>';
        html += '<h4><strong>';
        html += this.areas.rooms;
        html += ' Zimmer Wohnung | ';
        html += this.geo.street;
        html += ' ';
        html += this.geo.houseNumber;
        html += ' | ';
        html += this.geo.city;
        html += ' ';
        html += this.geo.district;
        html += '</strong></h4><small>';
        html += 'Wohnung zur Miete';
        html += '</small><div class="row col-md-12 col-sm-12 col-xs-12" style="margin-top:10px;"><div class="col-md-4"><h4><strong>';
        html += immobrowse.euroHtml(this.preise.coldRentNet);
        html += '</strong></h4><small>';
        html += 'Miete zzgl. NK';
        html += '</small></div><div class="col-md-4"><h4><strong>';
        html += immobrowse.squareMetersHtml(this.areas.livingArea);
        html += '</strong></h4><small>';
        html += 'Wohnfläche';
        html += '</small></div><div class="col-md-4"><h4><strong>';
        html += this.areas.zimmer;
        html += '</strong></h4><small>';
        html += 'Zimmer';
        html += '</small></div></div><div class="col-md-12 col-sm-12 col-xs-12" style="margin-top:25px;"></div></div></div>';
        return html;
    }
}


function list_real_estates(real_estates) {
    var table = '<table>';

    for (real_estate of real_estates) {
        var row = '<tr><td>';

        if (real_estate.anhaenge !== null) {
            row += '<img src="' + real_estate.anhaenge.anhang[0].daten.pfad + '" alt="titelbild" width="200"/>';
        }

        row += '</td>';
        row += '<td>' + real_estate.freitexte.objekttitel + '</td>';
        row += '</tr>';
        table += row;
    }

    table += '</table>';
    return table;
}

