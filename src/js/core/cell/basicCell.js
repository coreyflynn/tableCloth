/***************************************************************************
 * Basic cell definition. This class should serve as the base of all other *
 * cells                                                                   *
 ***************************************************************************/
var cellOptions = require('./options');
var util = require('../util');
var ease = require('ease-component');

var basicCell = function(options) {
  // attach the options to the constructed object
  this.options = options;

  // configure base options
  this.options = cellOptions.configure(this.options);

}

basicCell.prototype.render = function(tableCloth,xOffset,yOffset,highlight) {
  var height = this.options.height;
  var width = this.options.width;
  var pixelRatio = util.getPixelRatio();

  tableCloth.viewport.ctx.globalAlpha = this.options.opacity;
  tableCloth.viewport.ctx.beginPath();
  tableCloth.viewport.ctx.rect(this.options.x + xOffset,
                                this.options.y - yOffset,
                                width * pixelRatio,
                                height * pixelRatio);
  tableCloth.viewport.ctx.fillStyle = this.options.bgColor;
  if (highlight) {
    tableCloth.viewport.ctx.globalAlpha = 0.5;
  } else {
    tableCloth.viewport.ctx.globalAlpha = 1;
  }
  tableCloth.viewport.ctx.fill();
  tableCloth.viewport.ctx.globalAlpha = 1;

  return tableCloth
}

basicCell.prototype.click = function() {
  return this;
}

basicCell.prototype.animateToHeight = function(tableCloth,
                                                height, duration, easeName) {
  var self = this;
  var start = new Date().getTime();
  var startingHeight = this.options.height;
  var delta = height - startingHeight;
  var easing = (easeName === undefined) ? ease.inOutExpo : ease[easeName];

  var timer = 0;
  var int = setInterval(function() {

    var now = new Date().getTime();
    var timeDiff =  now - start;
    var proportion = timeDiff / duration;
    self.options.height = startingHeight + easing(proportion) * delta;

    window.requestAnimationFrame(function() {
      tableCloth.cellManager.positionCells();
      tableCloth.cellManager.renderCells();
    });

    if (timeDiff >= duration) {
      clearInterval(int);
    }

  },1);
}

basicCell.prototype.animateToOpacity = function(tableCloth,
                                                opacity, duration, easeName) {
  var self = this;
  var start = new Date().getTime();
  var startingOpacity = this.options.opacity;
  var delta = opacity - startingOpacity;
  var easing = (easeName === undefined) ? ease.inOutExpo : ease[easeName];

  var timer = 0;
  var int = setInterval(function() {

    var now = new Date().getTime();
    var timeDiff =  now - start;
    var proportion = timeDiff / duration;
    self.options.opacity = startingOpacity + easing(proportion) * delta;

    window.requestAnimationFrame(function() {
      tableCloth.cellManager.positionCells();
      tableCloth.cellManager.renderCells();
    });

    if (timeDiff >= duration) {
      clearInterval(int);
    }

  },1);
}

module.exports = basicCell;
