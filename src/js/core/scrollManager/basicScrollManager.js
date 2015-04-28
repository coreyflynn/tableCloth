/**************************
 * Basic Scroll Manager   *
 **************************/
var ease = require('ease-component');
var Hammer = require('hammerjs');

var basicScrollManager = function(cellManager) {
  var self = this;
  this.cellManager = cellManager;
  this.hammertime = new Hammer(cellManager.tableCloth.viewport.can.$el, {});
  this.hammertime.on('panstart', function(){
    self.panStartScrollPosition = self.cellManager.scrollPosition;
  });
  this.hammertime.on('pan', function(ev) {
    self.cellManager.scrollPosition = self.panStartScrollPosition - ev.deltaY;
    self.cellManager.renderCells();
  });

  this.hammertime.on('panend', function(ev){
    var finalscrollPosition = self.panStartScrollPosition - ev.deltaY;
    if (finalscrollPosition < 0) {
      self.scrollToPosition(0,300);
    }
    var maxScroll = self.cellManager.cellsHeight - self.cellManager.tableCloth.options.height;
    if ( self.cellManager.scrollPosition >= maxScroll) {
      self.scrollToPosition(maxScroll,300);
    }

  });

  this.cellManager.tableCloth.viewport.can.$el.addEventListener('wheel', function(ev){
    ev.preventDefault();
    self.cellManager.scrollPosition -= ev.wheelDeltaY;
    if (self.cellManager.scrollPosition < 0 ) {
      self.cellManager.scrollPosition = 0;
    }
    var maxScroll = self.cellManager.cellsHeight - self.cellManager.tableCloth.options.height;
    if ( self.cellManager.scrollPosition >= maxScroll) {
      self.cellManager.scrollPosition = maxScroll;
    }
    self.cellManager.renderCells();
  });
}

basicScrollManager.prototype.scrollToPosition = function(y, duration, easeName) {
  var self = this;
  var start = new Date().getTime();
  var startingPosition = this.cellManager.scrollPosition;
  var delta = y - startingPosition;
  var easing = (easeName === undefined) ? ease.inOutExpo : ease[easeName];

  var timer = 0;
  var int = setInterval(function() {

    var now = new Date().getTime();
    var timeDiff =  now - start;
    var proportion = timeDiff / duration;
    self.cellManager.scrollPosition = startingPosition + easing(proportion) * delta;

    window.requestAnimationFrame(function() {
      self.cellManager.renderCells();
    });

    if (timeDiff >= duration) {
      clearInterval(int);
    }

  },1);
}

module.exports = basicScrollManager;
