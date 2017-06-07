var titleImageGallery;
var floorplanGallery;

function nextTitleImage() {
  renderTitleImage(titleImageGallery.next());
}

function previousTitleImage() {
  renderTitleImage(titleImageGallery.previous());
}

function nextFloorplan() {
  renderFloorplan(floorplanGallery.next());
}

function previousFloorplan() {
  renderFloorplan(floorplanGallery.previous());
}

function renderTitleImage(attachment) {
  var url = realEstate.attachmentURL(attachment);
  jQuery('#titleImage' + elementId).attr('src', url);
  jQuery('#titleImageCaption').html(image.anhangtitel);
  jQuery('#titleImageGalleryImage' + elementId).attr('src', url);
  jQuery('#titleImageGalleryCaption').html(image.anhangtitel);
}

function renderFloorplan(attachment) {
  var url = realEstate.attachmentURL(attachment);
  jQuery('#floorplan' + elementId).attr('src', url);
  jQuery('#floorplanCaption').html(image.anhangtitel);
  jQuery('#floorplanGalleryImage' + elementId).attr('src', url);
  jQuery('#floorplanGalleryCaption').html(image.anhangtitel);
}

function initGalleries() {
  titleImageGallery = gallery.Gallery(realEstate.images());
  floorplanGallery = gallery.Gallery(realEstate.floorplans());
  renderTitleImage(titleImageGallery.element());
  renderFloorplan(floorplanGallery.element());
}
