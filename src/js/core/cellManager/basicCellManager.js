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
  this.headerCells = [];
  this.headerHeight = 0;
  this.hoveredCellIndex = null;
  this.lastChange = new Date().getTime();
}

/**
 * add cell to the cell manager instance at the end of the cell array
 * @param {tableCloth cell} cell the cell to add
 * @param {int} duration the duration in milliseconds for an animation when
 *                       adding the cell. Defaults to 0ms
 * @return {tableCloth basicCellManager}
 */
basicCellManager.prototype.addCell = function(cell,duration) {
  this.lastChange = new Date().getTime();
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
  cell.options.cellManager = this;
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
 * adds a header cell to the cell manager. Header cells will stick
 * to the top of the viewport regardless of scroll position
 * @param {tableCloth cell} cell the cell to add
 * @param {int} duration the duration in milliseconds for an animation when
 *                       adding the cell. Defaults to 0ms
 * @return {tableCloth basicCellManager}
 */
basicCellManager.prototype.addHeaderCell = function(cell,duration) {
  this.lastChange = new Date().getTime();
  duration = (duration === undefined) ? 0 : duration;
  if (duration) {
    this.addCellAtIndex(cell,0,duration);
  }

  if (cell.options.fillContainer) {
    cell.options.width = this.tableCloth.$el.clientWidth;
  }

  setTimeout(function(){
    if (duration) {
      this.removeCellAtIndex(0);
    }
    cell.options.y = 0;
    cell.options.cellManager = this;
    this.headerCells.push(cell);
    this.headerHeight = cell.options.height;
    this.renderCells();
  }.bind(this),duration);

  this.renderCells();

  return this;
}

/**
 * add cells to the cell manager instance at the end of the cell array
 * @param {array} cells the cells to add
 * @param {int} duration the duration in milliseconds for an animation when
 *                       adding the cell. Defaults to 0ms
 * @return {tableCloth basicCellManager}
 */
basicCellManager.prototype.addCells = function(cells,duration) {
  this.lastChange = new Date().getTime();
  duration = (duration === undefined) ? 0 : duration;

  cells.forEach(function(cell){

    if (duration) {
      var targetHeight = cell.options.height;
      cell.options.height = 0;
    }
    if (cell.options.fillContainer) {
      cell.options.width = this.tableCloth.$el.clientWidth;
    }
    cell.options.y = this.cellsHeight;
    cell.options.index = this.cells.length;
    cell.options.cellManager = this;
    this.cells.push(cell);
    this.cellsHeight += cell.options.height;

    if (duration) {
      cell.animateToHeight(this.tableCloth,targetHeight,duration);
    }
  }.bind(this));

  if (duration === 0) {
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
 * @param {int} duration the duration in milliseconds for an animation when
 *                       adding the cell. Defaults to 0ms
 * @return {basicCellManager}
 */
basicCellManager.prototype.addCellAtIndex = function(cell,index,duration) {
  this.lastChange = new Date().getTime();
  duration = (duration === undefined) ? 0 : duration;

  if (duration) {
    var targetHeight = cell.options.height;
    cell.options.height = 0;
  }
  if (cell.options.fillContainer) {
    cell.options.width = this.tableCloth.$el.clientWidth;
  }

  cell.options.cellManager = this;

  this.cells.splice(index,0,cell);
  this.cellsHeight += cell.options.height;

  this.positionCells().reflowCells();

  if (duration) {
    cell.animateToHeight(this.tableCloth,targetHeight,duration);
  } else {
    this.renderCells();
  }

  return this;
}

/**
 * add an array of cells to the cell manager at the index given
 * @param {array} cells an array of cells to add
 * @param {int} duration the duration in milliseconds for an animation when
 *                      adding the cell. Defaults to 0ms
 */
basicCellManager.prototype.addCellsAtIndex = function(cells, index, duration) {
  cells.forEach(function(cell) {
    this.addCellAtIndex(cell,index,duration);
  }.bind(this));

  return this;
}

/**
 * removes a cell at the given index
 * @param {int} index the index at which to add the cell
 * @param {int} duration the duration in milliseconds for an animation when
 *                       removing the cell. Defaults to 0ms.
 * @return {basicCellManager}
 */
basicCellManager.prototype.removeCellAtIndex = function(index,duration) {
  this.lastChange = new Date().getTime();
  duration = (duration === undefined) ? 0 : duration;

  if (duration) {
    var cell = this.cells[index];
    var targetHeight = 0;
    cell.animateToHeight(this.tableCloth,targetHeight,duration);
  }


  setTimeout(function(){
    this.cells.splice(index,1);
    this.positionCells().reflowCells().renderCells();
  }.bind(this),duration);

  return this;
}

/**
 * removes the cells specified by the passed array of indices
 * @param {Array} indexArray the indices to be used
 * @param {int} duration the duration in milliseconds for an animation when
 *                       removing the cell. Defaults to 0ms.
 * @return {basicCellManager}
 */
basicCellManager.prototype.removeCellsAtIndexArray = function(indexArray,duration) {
  this.lastChange = new Date().getTime();
  duration = (duration === undefined) ? 0 : duration;

  if (duration) {
    indexArray.forEach(function(index) {
      var cell = this.cells[index];
      var targetHeight = 0;
      this.cells[index].animateToHeight(this.tableCloth,targetHeight,duration);
    }.bind(this));
  }

  setTimeout(function(){
    var spliceCount = 0;
    indexArray.forEach(function(index){
      this.cells.splice(index - spliceCount,1);
      spliceCount += 1;
    }.bind(this));
    this.positionCells().reflowCells().renderCells();
  }.bind(this),duration);

  return this;
}

/**
 * remove cells falling in the given index range
 * @param {int} start    the start of the range
 * @param {end} end      the end of the range
 * @param {int} duration the duration in milliseconds for an animation when
 *                       removing the cell. Defaults to 0ms.
 * @return {basicCellManager}
 */
basicCellManager.prototype.removeCellsAtIndexRange = function(start,end,
                                                              duration) {
  this.lastChange = new Date().getTime();
  var cells = this.cells.slice(start,end);
  duration = (duration === undefined) ? 0 : duration;

  if (duration) {
    var targetHeight = 0;
    cells.forEach(function(cell) {
      cell.animateToHeight(this.tableCloth,targetHeight,duration);
    }.bind(this));
  }

  setTimeout(function(){
    this.cells.splice(start,cells.length);
    this.positionCells().reflowCells().renderCells();
  }.bind(this),duration);

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
  var scrollPos = this.scrollPosition - this.headerHeight;
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
        cell.render(self.tableCloth,0,
          self.scrollPosition - self.headerHeight,highlight);
    }

    // stop inspecting cells once we are below the viewport
    return cell.options.y > self.scrollPosition + self.tableCloth.options.height;
  });

  this.headerCells.forEach(function(cell){
    cell.render(self.tableCloth,0,0);
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
