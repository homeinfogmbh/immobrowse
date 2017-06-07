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
  jQuery('#titleImage').attr('src', url);
  jQuery('#titleImageCaption').html(attachment.anhangtitel);
}

function renderFloorplan(attachment) {
  var url = realEstate.attachmentURL(attachment);
  jQuery('#floorplan').attr('src', url);
  jQuery('#floorplanCaption').html(attachment.anhangtitel);
}

function initGalleries() {
  titleImageGallery = new gallery.Gallery(realEstate.images());
  floorplanGallery = new gallery.Gallery(realEstate.floorplans());
  renderTitleImage(titleImageGallery.element());
  renderFloorplan(floorplanGallery.element());
}
