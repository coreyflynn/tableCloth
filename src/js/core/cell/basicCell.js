/***************************************************************************
 * Basic cell definition. This class should serve as the base of all other *
 * cells                                                                   *
 ***************************************************************************/
var cellOptions = require('./options');
var util = require('../util');

var basicCell = function(options) {
  // attach the options to the constructed object
  this.options = options;

  // configure base options
  this.options = cellOptions.configure(this.options);

}

basicCell.prototype.render = function(tableCloth) {
  var height = this.options.height;
  var width = this.options.width;
  var pixelRatio = util.getPixelRatio();

  tableCloth.viewport.can.width = width;
  tableCloth.viewport.can.height = height;
  tableCloth.viewport.can.style.width = width + 'px';
  tableCloth.viewport.can.style.height = height + 'px';

  tableCloth.viewport.ctx.beginPath();
  tableCloth.viewport.ctx.rect(this.options.x, this.options.y, width * pixelRatio, height * pixelRatio);
  tableCloth.viewport.ctx.fillStyle = tableCloth.options.bgColor;
  tableCloth.viewport.ctx.fill();

  tableCloth.viewport.ctx.scale(1 / pixelRatio, 1 / pixelRatio);

  return tableCloth
}

module.exports = basicCell;
