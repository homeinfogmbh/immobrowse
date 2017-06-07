var gallery = gallery || {};

gallery.Gallery = function (elements, startIndex) {
  this.elements = elements;

  if (startIndex == null) {
    this.index = 0;
  } else {
    if (startIndex >= elements.length) {
      throw 'Index out of bounds: ' + startIndex + '/' + elements.length - 1;
    } else {
      this.index = startIndex;
    }
  }

  this.element = function (index) {
    if (index == null) {
      index = this.index;
    }

    return this.elements[index];
  }

  this.next = function () {
    this.index += 1;

    if (this.index >= this.elements.length) {
      this.index = 0;
    }

    return this.element();
  }

  this.previous = function () {
    this.index -= 1;

    if (this.index < 0) {
      this.index = this.elements.length - 1;
    }

    return this.element();
  }
}
