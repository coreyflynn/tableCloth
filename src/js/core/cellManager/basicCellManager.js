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
  this.hoveredCellIndex = null;
}

/**
 * add cell to the cell manager instance at the end of the cell array
 * @param {tableCloth cell} cell the cell to add
 * @param {int} duration the duration in milliseconds for an animation when
 *                       adding the cell. Defaults to 1ms
 * @return {tableCloth basicCellManager}
 */
basicCellManager.prototype.addCell = function(cell,duration) {
  duration = (duration === undefined) ? 0 : duration;
  if (duration) {
    var targetHeight = cell.options.height;
    cell.options.height = 0;
  }
  if (cell.options.fillContainer) {
    cell.options.width = this.tableCloth.$el.clientWidth;
  }
  cell.options.y = this.cellsHeight;
  cell.options.index = this.cells.length;
  this.cells.push(cell);
  this.cellsHeight += cell.options.height;

  if (duration) {
    cell.animateToHeight(this.tableCloth,targetHeight,duration);
  } else {
    this.renderCells();
  }


  return this
}

/**
 * reflow the cells in the basicCellManager instance
 */
basicCellManager.prototype.reflowCells = function() {
  var self = this;
  this.cells.forEach(function(cell) {
    if (cell.options.fillContainer) {
      cell.options.width = self.tableCloth.$el.clientWidth;
    }
  });
  this.renderCells();

  return this
}

/**
 * add a cell to the cell manager instance at a given index
 * @param {tableCloth cell} cell  the cell to add
 * @param {int} index the index at which to add the cell
 * @return {tableCloth basicCellManager}
 */
basicCellManager.prototype.addCellAtIndex = function(cell,index) {
  this.cells.splice(index,0,cell);
  this.positionCells().reflowCells().renderCells();
  return this;
}


/**
 * utility to find the approximate start of cells in the viewport
 */
basicCellManager.prototype.findApproximateViewportCells = function() {
  // make an intelligent guess as to where we need to start looking at cells
  // in the array of cells
  var viewportCells;
  var averageCellHeight = this.cellsHeight / this.cells.length;
  var aproximateCellsAboveViewport = this.scrollPosition / averageCellHeight - 20;
  if (aproximateCellsAboveViewport <= 0) {
    aproximateCellsAboveViewport = 0;
  }

  var aproximateCellsInViewport = (this.tableCloth.options.height)
                                    / averageCellHeight + 40;

  viewportCells = this.cells.slice(Math.floor(aproximateCellsAboveViewport),
          Math.ceil(aproximateCellsAboveViewport + aproximateCellsInViewport));

  return viewportCells;
}

/**
 * determines the cell in which an x,y position falls when the scrollPosition is
 * taken into account
 * @param {float} x the x position to use
 * @param {float} y the y position to use
 *
 */
basicCellManager.prototype.findCellAtPosition = function(x,y) {
  var scrollPos = this.scrollPosition;
  var cellsToCheck = this.findApproximateViewportCells();
  var foundCell = null;
  for (var i = 0; i < cellsToCheck.length; i++) {
    var cell = cellsToCheck[i];
    if (cell.options.x < x && cell.options.x + cell.options.width > x) {
      if (cell.options.y -  scrollPos < y &&
          cell.options.y + cell.options.height - scrollPos > y) {
            foundCell = cell;
            break;
      }
    }
  }

  return foundCell;
}

/**
 * determines the x and y positions of all the cells given their ordering
 * in the cells array
 * @return {tableCloth basicCellManager}
 */
basicCellManager.prototype.positionCells = function() {
  var self = this;
  this.cellsHeight = 0;
  this.cells.forEach(function(cell,i){
    cell.options.index = i;
    cell.options.y = self.cellsHeight;
    self.cellsHeight += cell.options.height;
  });
  return this;
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

  this.tableCloth.viewport.ctx.setTransform(1,0,0, 1,0,0);
  this.tableCloth.viewport.can.width = viewportWidth * pixelRatio;
  this.tableCloth.viewport.can.height = viewportHeight * pixelRatio;
  this.tableCloth.viewport.can.style.width = viewportWidth + 'px';
  this.tableCloth.viewport.can.style.height = viewportHeight + 'px';

  // make an intelligent guess as to where we need to start looking at cells
  // in the array of cells
  var cellsToRender = this.findApproximateViewportCells();

  // render cells
  cellsToRender.some(function (cell) {
    var highlight = false;
    // only render the cell if it is in the viewport
    if (cell.options.y + cell.options.height > self.scrollPosition) {
        if (cell.options.index === self.hoveredCellIndex){
          highlight = true;
        }
        cell.render(self.tableCloth,0,self.scrollPosition,highlight);
    }

    // stop inspecting cells once we are below the viewport
    return cell.options.y > self.scrollPosition + self.tableCloth.options.height;
  });

  this.tableCloth.viewport.ctx.setTransform(1 / pixelRatio,0,0, 1 / pixelRatio,0,0);

  return this;
}

/**
 * sorts the cells in the cell manager by their value of the given options field
 * @param {string} field     the field to sort on
 * @param {[boolean]} ascending set to true for an ascending sort. defaults to
 *                              false
 */
basicCellManager.prototype.sortByField = function(field, ascending) {
  // sort the cells
  this.cells.sort(function(a,b){
    if (ascending) {
      return a.options[field] - b.options[field];
    } else {
      return b.options[field] - a.options[field];
    }
  });

  // position, reflow, and render
  this.positionCells().reflowCells().renderCells();

  return this;
}

module.exports = basicCellManager;
