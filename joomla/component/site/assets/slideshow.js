var titleImageIndex = 1;
var floorplanIndex = 1;

function plusTitleImage(n) {
  showTitleImage(titleImageIndex += n);
}

function showTitleImage(n) {
  var i;
  var x = document.getElementsByClassName("titleImages");

  if (n > x.length) {
    titleImageIndex = 1;
  }

  if (n < 1) {
    titleImageIndex = x.length;
  }

  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

  x[titleImageIndex-1].style.display = "block";
}

function plusFloorplan(n) {
  showFloorplan(floorplanIndex += n);
}

function showFloorplan(n) {
  var i;
  var x = document.getElementsByClassName("floorplans");

  if (n > x.length) {
    floorplanIndex = 1;
  }

  if (n < 1) {
    floorplanIndex = x.length;
  }

  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

  x[floorplanIndex-1].style.display = "block";
}

function setupSlideshows() {
  var template = '<div class="w3-display-container {group} ib-image-frame"><img src="{url}" class="ib-framed-image"><div class="w3-display-bottommiddle w3-container w3-padding-16 w3-black">{caption}</div></div>';
  var titleImages = realEstate.images();
  var titleImageSlideshow = [];

  for (var i = 0; i < titleImages.length; i++) {
    titleImageSlideshow.push(
      template.replace('{group}', 'titleImages').replace(
        '{url}', realEstate.attachmentURL(titleImages[i])).replace(
          '{caption}', titleImages[i].anhangtitel));
  }

  jQuery('#titleImages').html(titleImageSlideshow.join('\n'));
  showTitleImage(titleImageIndex);

  var floorplans = realEstate.floorplans();
  var floorplanSlideshow = [];

  for (var i = 0; i < floorplans.length; i++) {
    floorplanSlideshow.push(
      template.replace('{group}', 'floorplans').replace(
        '{url}', realEstate.attachmentURL(floorplans[i])).replace(
          '{caption}', floorplans[i].anhangtitel || 'Grundriss'));
  }

  jQuery('#floorplans').html(floorplanSlideshow.join('\n'));
  showFloorplan(floorplanIndex);
}
