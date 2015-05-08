var coreOptions = require('./core/options');
var coreViewport = require('./core/viewport');
var coreCellManager = require('./core/cellManager');
var coreScrollManager = require('./core/scrollManager');
var coreMouseManager = require('./core/mouseManager');
var coreCell = require('./core/cell');

/**
 * tableCloth constructor. Builds a new instance of tableCloth and binds it
 * to the dom at the desired target div
 * @param {string} target the DOM id of the target div to bind to
 * @param {object} options an object containing setup options for tableCloth
 */
var tableCloth = function(target,options) {
  // keep track of tableCloth's container
  this.$el = document.getElementById(target);

  // attach the options to the constructed object
  this.options = options;

  // configure base options
  this.options = coreOptions.configure(this.options);

  // if the fillContainer option is set, expand the tableCloth instance to fill its
  // container
  if (this.options.fillContainer) {
    this.options.width = this.$el.clientWidth;
  }

  // attach a top level canvas element to serve as the tableCloth viewport
  coreViewport.attach(this);

  // attach a cell manager
  this.cellManager = new coreCellManager.basicCellManager(this);

  // attach a scroll manager
  this.scrollManager = new coreScrollManager.basicScrollManager(this.cellManager);

  // attach a mouse manager
  this.mouseManager = new coreMouseManager.basicMouseManager(this);

  // attach a cell factory method
  this.cellFactory = {};
  this.cellFactory = coreCell;

  // listen for resize events on the window and reflow cells
  var self = this;
  window.onresize = function() {
    self.cellManager.reflowCells();
  }

}

/**
 * animates the tableCloth instance to the diesired height
 * @param {float} height   the height in pixels to animate to
 * @param {float} duration the duration of the animation in milliseconds
 */
tableCloth.prototype.animateToHeight = function(height,duration) {
  coreViewport.animateToHeight(this, height, duration);
}

// if a window object is present, attach tableCloth to it
if (window) {
  window.tableCloth = tableCloth
}
