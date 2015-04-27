(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var coreOptions = require('./core/options');
var coreViewport = require('./core/viewport');
var coreCellManager = require('./core/cellManager');
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

  // attach a top level canvas element to serve as the tableCloth viewport
  coreViewport.attach(this);

  // attach a cell manager
  this.cellManager = new coreCellManager.basicCellManager(this);

  // attach a cell factory method
  this.cellFactory = {};
  this.cellFactory.basicCell = coreCell.basicCell;

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

},{"./core/cell":4,"./core/cellManager":7,"./core/options":8,"./core/viewport":12}],2:[function(require,module,exports){

// easing functions from "Tween.js"

exports.linear = function(n){
  return n;
};

exports.inQuad = function(n){
  return n * n;
};

exports.outQuad = function(n){
  return n * (2 - n);
};

exports.inOutQuad = function(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n;
  return - 0.5 * (--n * (n - 2) - 1);
};

exports.inCube = function(n){
  return n * n * n;
};

exports.outCube = function(n){
  return --n * n * n + 1;
};

exports.inOutCube = function(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n * n;
  return 0.5 * ((n -= 2 ) * n * n + 2);
};

exports.inQuart = function(n){
  return n * n * n * n;
};

exports.outQuart = function(n){
  return 1 - (--n * n * n * n);
};

exports.inOutQuart = function(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n * n * n;
  return -0.5 * ((n -= 2) * n * n * n - 2);
};

exports.inQuint = function(n){
  return n * n * n * n * n;
}

exports.outQuint = function(n){
  return --n * n * n * n * n + 1;
}

exports.inOutQuint = function(n){
  n *= 2;
  if (n < 1) return 0.5 * n * n * n * n * n;
  return 0.5 * ((n -= 2) * n * n * n * n + 2);
};

exports.inSine = function(n){
  return 1 - Math.cos(n * Math.PI / 2 );
};

exports.outSine = function(n){
  return Math.sin(n * Math.PI / 2);
};

exports.inOutSine = function(n){
  return .5 * (1 - Math.cos(Math.PI * n));
};

exports.inExpo = function(n){
  return 0 == n ? 0 : Math.pow(1024, n - 1);
};

exports.outExpo = function(n){
  return 1 == n ? n : 1 - Math.pow(2, -10 * n);
};

exports.inOutExpo = function(n){
  if (0 == n) return 0;
  if (1 == n) return 1;
  if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
  return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
};

exports.inCirc = function(n){
  return 1 - Math.sqrt(1 - n * n);
};

exports.outCirc = function(n){
  return Math.sqrt(1 - (--n * n));
};

exports.inOutCirc = function(n){
  n *= 2
  if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
  return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
};

exports.inBack = function(n){
  var s = 1.70158;
  return n * n * (( s + 1 ) * n - s);
};

exports.outBack = function(n){
  var s = 1.70158;
  return --n * n * ((s + 1) * n + s) + 1;
};

exports.inOutBack = function(n){
  var s = 1.70158 * 1.525;
  if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) );
  return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 );
};

exports.inBounce = function(n){
  return 1 - exports.outBounce(1 - n);
};

exports.outBounce = function(n){
  if ( n < ( 1 / 2.75 ) ) {
    return 7.5625 * n * n;
  } else if ( n < ( 2 / 2.75 ) ) {
    return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;
  } else if ( n < ( 2.5 / 2.75 ) ) {
    return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;
  } else {
    return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;
  }
};

exports.inOutBounce = function(n){
  if (n < .5) return exports.inBounce(n * 2) * .5;
  return exports.outBounce(n * 2 - 1) * .5 + .5;
};

// aliases

exports['in-quad'] = exports.inQuad;
exports['out-quad'] = exports.outQuad;
exports['in-out-quad'] = exports.inOutQuad;
exports['in-cube'] = exports.inCube;
exports['out-cube'] = exports.outCube;
exports['in-out-cube'] = exports.inOutCube;
exports['in-quart'] = exports.inQuart;
exports['out-quart'] = exports.outQuart;
exports['in-out-quart'] = exports.inOutQuart;
exports['in-quint'] = exports.inQuint;
exports['out-quint'] = exports.outQuint;
exports['in-out-quint'] = exports.inOutQuint;
exports['in-sine'] = exports.inSine;
exports['out-sine'] = exports.outSine;
exports['in-out-sine'] = exports.inOutSine;
exports['in-expo'] = exports.inExpo;
exports['out-expo'] = exports.outExpo;
exports['in-out-expo'] = exports.inOutExpo;
exports['in-circ'] = exports.inCirc;
exports['out-circ'] = exports.outCirc;
exports['in-out-circ'] = exports.inOutCirc;
exports['in-back'] = exports.inBack;
exports['out-back'] = exports.outBack;
exports['in-out-back'] = exports.inOutBack;
exports['in-bounce'] = exports.inBounce;
exports['out-bounce'] = exports.outBounce;
exports['in-out-bounce'] = exports.inOutBounce;

},{}],3:[function(require,module,exports){
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

},{"../util":11,"./options":5}],4:[function(require,module,exports){
var basicCell = require('./basicCell');

module.exports = {
  basicCell: basicCell
}

},{"./basicCell":3}],5:[function(require,module,exports){
/****************************************
 * cell option processing utilities   *
 **************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.height = (options.height === undefined) ? 25 : options.height;
  options.width = (options.width === undefined) ? 500 : options.width;
  options.bgColor = (options.bgColor === undefined) ? '#EEEEEE' : options.bgColor;
  options.x = (options.x === undefined) ? 0 : options.x;
  options.y = (options.y === undefined) ? 0 : options.y;

  return options;
}

module.exports = {
  configure: configure
}

},{}],6:[function(require,module,exports){
/********************************************************************
 * Minimal cell manager implementation. All logic related to moving *
 * cells around should go here                                      *
 ********************************************************************/
 var util = require('../util');
 var ease = require('ease-component');

/**
 * creates a new basicCellManager
 */
var basicCellManager = function(tableCloth) {
  this.tableCloth = tableCloth;
  this.cells = [];
  this.cellsHeight = 0;
  this.scrollPosition = 0;
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
      clearInterval(int);
    }

  },1);
}

module.exports = basicCellManager;

},{"../util":11,"ease-component":2}],7:[function(require,module,exports){
var basicCellManager = require('./basicCellManager');

module.exports = {
  basicCellManager: basicCellManager
}

},{"./basicCellManager":6}],8:[function(require,module,exports){
/*******************************
 * option processing utilities *
 *******************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.height = (options.height === undefined) ? 500 : options.height;
  options.width = (options.width === undefined) ? 500 : options.width;
  options.bgColor = (options.bgColor === undefined) ? '#EEEEEE' : options.bgColor;

  return options;
}

module.exports = {
  configure: configure
}

},{}],9:[function(require,module,exports){
'use strict'
var background = require('./render/background');

module.exports = {
  background: background.main
}

},{"./render/background":10}],10:[function(require,module,exports){
'use strict'
/*******************************
 * Background render utilities *
 *******************************/
var util = require('../util');

/**
 * renders the background of a tableCloth instance
 * @param  {tableCloth} tableCloth the tableCloth instance to be rendered
 * @return {tableCloth}            the tableCloth instance
 */
function main(tableCloth) {
  var height = tableCloth.options.height;
  var width = tableCloth.options.width;
  var pixelRatio = util.getPixelRatio();

  tableCloth.viewport.can.width = width;
  tableCloth.viewport.can.height = height;
  tableCloth.viewport.can.style.width = width + 'px';
  tableCloth.viewport.can.style.height = height + 'px';

  tableCloth.viewport.ctx.beginPath();
  tableCloth.viewport.ctx.rect(0, 0, width * pixelRatio, height * pixelRatio);
  tableCloth.viewport.ctx.fillStyle = tableCloth.options.bgColor;
  tableCloth.viewport.ctx.fill();

  tableCloth.viewport.ctx.scale(1 / pixelRatio, 1 / pixelRatio);

  return tableCloth
}

module.exports = {
  main: main
}

},{"../util":11}],11:[function(require,module,exports){
/**
 * grab the current browser's pixel ratio
 * http://www.html5rocks.com/en/tutorials/canvas/hidpi/
 */
function getPixelRatio() {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
}

module.exports = {
  getPixelRatio: getPixelRatio
}

},{}],12:[function(require,module,exports){
'use strict';
/**********************
 * Viewport functions *
 **********************/
 var util = require('./util');
 var render = require('./render');
 var ease = require('ease-component');

/**
 * attach a canvas element to the dom to serve as the top level tableCloth
 * viewport
 * @param  {TableCloth} tableCloth A tableCloth instance to attach
 * @return {tableCloth}            the attached tableCloth instance
 */
function attach(tableCloth) {
  // get the pixelRatio
  var pixelRatio = util.getPixelRatio();

  // generate a timestamped id for the tableCloth instance
  tableCloth.id = new Date().getTime();

  // build the viewport object and add it to the tableCloth instance
  tableCloth.viewport = {};
  tableCloth.viewport.can = document.createElement('canvas');
  tableCloth.viewport.can.id = tableCloth.id + 'viewport';
  tableCloth.viewport.can.setAttribute('data-height', tableCloth.options.height);
  tableCloth.viewport.can.classList.add('tableCloth');

  // attach the canvas
  tableCloth.$el.appendChild(tableCloth.viewport.can);

  // add the 2d context to the viewport
  tableCloth.viewport.can.$el = document.getElementById(tableCloth.viewport.can.id);
  tableCloth.viewport.ctx = tableCloth.viewport.can.$el.getContext('2d');




  // render the background
  render.background(tableCloth);


  // return the tableCloth instance
  return tableCloth;
}

function animateToHeight(tableCloth, height, duration, easeName) {
  var start = new Date().getTime();
  var startingHeight = tableCloth.options.height;
  var delta = height - tableCloth.viewport.can.height;
  var easing = (easeName === undefined) ? ease.inOutExpo : ease[easeName];

  var timer = 0;
  var int = setInterval(function() {

    var now = new Date().getTime();
    var timeDiff =  now - start;
    var proportion = timeDiff / duration;
    tableCloth.options.height = startingHeight + easing(proportion) * delta;

    window.requestAnimationFrame(function() {
      render.background(tableCloth);
      tableCloth.cellManager.renderCells();
    });

    if (timeDiff >= duration) {
      clearInterval(int);
    }

  },1);
}

module.exports = {
  attach: attach,
  animateToHeight: animateToHeight
}

},{"./render":9,"./util":11,"ease-component":2}]},{},[1]);

//# sourceMappingURL=bundle.js.map