/********************************************************************
 * Minimal cell manager implementation. All logic related to moving *
 * cells around should go here                                      *
 ********************************************************************/
 var util = require('../util');
 var ease = require('ease-component');
 var Hammer = require('hammerjs');

/**
 * creates a new basicCellManager
 */
var basicCellManager = function(tableCloth) {
  var self = this;
  this.tableCloth = tableCloth;
  this.cells = [];
  this.cellsHeight = 0;
  this.scrollPosition = 0;
  this.hammertime = new Hammer(tableCloth.viewport.can.$el, {});
  this.hammertime.on('panstart', function(){
    self.panStartScrollPosition = self.scrollPosition;
  });
  this.hammertime.on('pan', function(ev) {
    console.log(ev.isFirst);
    self.scrollPosition = self.panStartScrollPosition - ev.deltaY;
    self.renderCells();
  });

  this.hammertime.on('panend', function(ev){
    var finalscrollPosition = self.panStartScrollPosition - ev.deltaY;
    if (finalscrollPosition < 0) {
      self.scrollToPosition(0,300);
    }
    var maxScroll = self.cellsHeight - self.tableCloth.options.height;
    if ( self.scrollPosition >= maxScroll) {
      self.scrollToPosition(maxScroll,300);
    }

  });

  this.tableCloth.viewport.can.$el.addEventListener('wheel', function(ev){
    ev.preventDefault();
    self.scrollPosition -= ev.wheelDeltaY;
    if (self.scrollPosition < 0 ) {
      self.scrollPosition = 0;
    }
    var maxScroll = self.cellsHeight - self.tableCloth.options.height;
    if ( self.scrollPosition >= maxScroll) {
      self.scrollPosition = maxScroll;
    }
    self.renderCells();
  });
}

/**
 * add cell to the cell manager instance
 * @param {tableCloth cell} cell the cell to add
 */
basicCellManager.prototype.addCell = function(cell) {

  cell.options.y = this.cellsHeight;
  this.cells.push(cell);
  this.cellsHeight += cell.options.height;
  this.renderCells();

  return this
}

/**
 * render all cells at the current scroll position
 */
basicCellManager.prototype.renderCells = function() {
  this.renderCellsAtPosition(this.scrollPosition,0);
}

/**
 * renders the view of the cells at the given x and y position
 * @param {float} x the x position to be used
 * @param {float} y the y position to be used
 * @return {basicCellManager}
 */
basicCellManager.prototype.renderCellsAtPosition = function(x,y) {
  var ctx = this.tableCloth.viewport.ctx;
  var self = this;
  var viewportHeight = this.tableCloth.options.height;
  var viewportWidth = this.tableCloth.options.width;
  var pixelRatio = util.getPixelRatio();

  this.tableCloth.viewport.can.width = viewportWidth;
  this.tableCloth.viewport.can.height = viewportHeight;
  this.tableCloth.viewport.can.style.width = viewportWidth + 'px';
  this.tableCloth.viewport.can.style.height = viewportHeight + 'px';

  // render cells
  this.cells.forEach(function (cell) {

    // only render the cell if it is in the viewport
    if (cell.options.y + cell.options.height > self.scrollPosition
      && cell.options.y < self.scrollPosition + self.tableCloth.options.height) {
        self.tableCloth.viewport.ctx.beginPath();
        self.tableCloth.viewport.ctx.rect(cell.options.x, cell.options.y - self.scrollPosition,
                                      cell.options.width * pixelRatio,
                                      cell.options.height * pixelRatio);
        self.tableCloth.viewport.ctx.fillStyle = cell.options.bgColor;
        self.tableCloth.viewport.ctx.fill();
    }
  });

  this.tableCloth.viewport.ctx.scale(1 / pixelRatio, 1 / pixelRatio);

  return this;
}


basicCellManager.prototype.scrollToPosition = function(y, duration, easeName) {
  var self = this;
  var start = new Date().getTime();
  var startingPosition = this.scrollPosition;
  var delta = y - startingPosition;
  var easing = (easeName === undefined) ? ease.inOutExpo : ease[easeName];

  var timer = 0;
  var int = setInterval(function() {

    var now = new Date().getTime();
    var timeDiff =  now - start;
    var proportion = timeDiff / duration;
    self.scrollPosition = startingPosition + easing(proportion) * delta;

    window.requestAnimationFrame(function() {
      self.renderCells();
    });

    if (timeDiff >= duration) {
      self.scrollAnimating = false;
      clearInterval(int);
    }

  },1);
}

module.exports = basicCellManager;
