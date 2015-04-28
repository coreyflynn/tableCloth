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
 * add a cell to the cell manager instance at a given index
 * @param {tableCloth cell} cell  the cell to add
 * @param {int} index the index at which to add the cell
 * @return {tableCloth basicCellManager}
 */
basicCellManager.prototype.addCellAtIndex = function(cell,index) {
  this.cells.splice(index,0,cell);
  this.positionCells().renderCells();
  return this;
}

/**
 * determines the x and y positions of all the cells given their ordering
 * in the cells array
 * @return {tableCloth basicCellManager}
 */
basicCellManager.prototype.positionCells = function() {
  var self = this;
  this.cellsHeight = 0;
  this.cells.forEach(function(cell){
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

  this.tableCloth.viewport.can.width = viewportWidth;
  this.tableCloth.viewport.can.height = viewportHeight;
  this.tableCloth.viewport.can.style.width = viewportWidth + 'px';
  this.tableCloth.viewport.can.style.height = viewportHeight + 'px';

  // make an intelligent guess as to where we need to start looking at cells
  // in the array of cells
  var cellsToRender;
  if (this.scrollPosition > 100) {
    var averageCellHeight = this.cellsHeight / this.cells.length;
    var aproximateCellsAboveViewport = this.scrollPosition / averageCellHeight - 2;
    cellsToRender = this.cells.slice(Math.floor(aproximateCellsAboveViewport),
                                          this.cells.length);
  } else {
    cellsToRender = this.cells;
  }

  // render cells
  cellsToRender.some(function (cell) {

    // only render the cell if it is in the viewport
    if (cell.options.y + cell.options.height > self.scrollPosition) {
        cell.render(self.tableCloth,0,self.scrollPosition);
    }

    // stop inspecting cells once we are below the viewport
    return cell.options.y > self.scrollPosition + self.tableCloth.options.height;
  });

  this.tableCloth.viewport.ctx.scale(1 / pixelRatio, 1 / pixelRatio);

  return this;
}

module.exports = basicCellManager;
