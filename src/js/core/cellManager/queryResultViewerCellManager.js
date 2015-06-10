var basicCellManager = require('./basicCellManager');
var ease = require('ease-component');
var coreCell = require('../cell');

var queryResultViewerCellManager = function(tableCloth){
  basicCellManager.call(this,tableCloth);
  this.tailZoom = false;
}

queryResultViewerCellManager.prototype = Object.create(basicCellManager.prototype);

/**
 * add cell to the cell manager instance at the end of the cell array
 * @param {tableCloth cell} cell the cell to add
 * @param {int} duration the duration in milliseconds for an animation when
 *                       adding the cell. Defaults to 1ms
 * @return {tableCloth queryResultViewerCellManager}
 */
queryResultViewerCellManager.prototype.addCell = function(cell,duration) {
  if (cell.options.fillContainer) {
    cell.options.width = this.tableCloth.$el.clientWidth;
  }

  if (cell instanceof coreCell.queryResultViewerSummaryCell) {
    this.headerCells.forEach(function (headerCell) {
      headerCell.staleSummary = true;
    });
  }
  this.constructor.prototype.addCell.call(this,cell,duration);
  cell.setScale();
  return this;
}

queryResultViewerCellManager.prototype.addCells = function(cells, duration) {
  this.constructor.prototype.addCells.call(this,cells,duration);
  cells.forEach(function (cell) {
    cell.setScale();
    if (cell instanceof coreCell.queryResultViewerSummaryCell) {
      this.headerCells.forEach(function (headerCell) {
        headerCell.staleSummary = true;
      });
    }
  }.bind(this));
  this.renderCells();
};

/**
 * sets the scale of all cells in the cellManager
 * @param {array} domain an array that describes the input domain of the scale
 * @param {array} range  an array that describs the output range of the scale
 * @return {queryResultViewerCellManagerl}
 */
queryResultViewerCellManager.prototype.setScale = function(domain,range) {
  this.cells.forEach(function(cell) {
    if (cell.setScale) {
      cell.setScale(domain,range);
    }
  });
  return this;
};

/**
 * add a header cell
 * @param {cell} cell     the cell to add
 * @param {int} duration the time in ms for an animation to run;
 * @return {queryResultViewerCellManager} a reference to the calling object
 */
queryResultViewerCellManager.prototype.addHeaderCell = function (cell, duration) {
  cell.staleSummary = true;
  this.constructor.prototype.addHeaderCell.call(this, cell, duration);

  return this;
};

/**
 * toggles the tails to be zoomed in our out to default values
 * @return {queryResultViewerCellManager}
 */
 queryResultViewerCellManager.prototype.toggleTails = function() {
  this.lastChange = new Date().getTime();
  var start = 200;
  var end = this.tableCloth.options.width - 102;
  var unit = (this.tableCloth.options.width - 302) / 200;
  var domain = [-100, -90, 90, 100];
  var range;

  if (this.tailZoom) {
    range = [start, unit * 10 + 200, unit * 190 + 200, end];
  } else {
    range = [start, unit * 90 + 200, unit * 110 + 200, end];
  }

  this.animateToScale(domain, range, 600);
  this.tailZoom = !this.tailZoom;

  return this;
}

/**
 * collapses all of the top level cells in the cell manager
 * @param {int} duration the duration in milliseconds for an animation when
 *                     removing the cell. Defaults to 0ms.
 * @return {queryResultViewerCellManager}
 */
queryResultViewerCellManager.prototype.collapseAll = function(duration) {
  duration = (duration === undefined) ? 0 : duration;

  // find all of the subCell indices and collect them. Marked any
  // cells with subCells as closed
  var indices = [];
  var newCells = this.cells.map(function(cell){
    if (cell.options.state === 'open') {
      indices = indices.concat(
        cell.options.subCells.map(function(cell){ return cell.options.index}));
      cell.options.state = 'closed';
    }
    return cell;
  });

  this.cells = newCells;

  // collapse all of the cells in one shot after making sure the indices are
  // in ascending order
  indices.sort(function(a,b){return a > b});

  this.removeCellsAtIndexArray(indices,duration);

  return this;
}

/**
 * sorts the cells in the cell manager by their value of the given summary options field
 * @param {string} field     the field to sort on
 * @param {boolean} ascending set to true for an ascending sort. defaults to
 *                              false
 * @param {int} duration the duration in milliseconds for an animation when
 *                     removing the cell. Defaults to 0ms.
 * @return {queryResultViewerCellManager}
 */
queryResultViewerCellManager.prototype.sortBySummaryField = function(field,ascending,duration) {
  duration = (duration === undefined) ? 0 : duration;

  // collapse all of the open rows
  this.collapseAll(duration);

  // now sort by the summary rows since they are the only thing left
  setTimeout(function(){
    this.sortByField(field,ascending);
  }.bind(this),duration);

  return this;
}

/**
 * Animate the scale to the input domain and range. The length of the domain
 * and range arrays must match that of the
 * @param {tableCloth} The tableCloth instance to use when rendering
 * @param {array} domain an array that describes the input domain of the scale
 * @param {array} range  an array that describs the output range of the scale
 * @return {queryResultViewerCellManager}
 */
queryResultViewerCellManager.prototype.animateToScale = function(domain,
                                                              range,
                                                              duration,
                                                              easeName) {
  var self = this;
  var start = new Date().getTime();
  var tmpDomain, tmpRange;

  // calculate the domain delta
  var startingDomain = this.cells[0].scale.domain();
  deltaDomain = [];
  startingDomain.forEach(function(d,i){
    deltaDomain.push(domain[i] - d);
  });

  // calculate the range delta
  var startingRange = this.cells[0].scale.range();
  deltaRange = [];
  startingRange.forEach(function(d,i){
    deltaRange.push(range[i] - d);
  });

  // find the cells that we need to animate
  var cellsToAnimate = this.findApproximateViewportCells();

  // set the easing function to use
  var easing = (easeName === undefined) ? ease.inOutExpo : ease[easeName];

  // set up and setInterval to render the animation until it is complete
  var timer = 0;
  var int = setInterval(function() {
    window.requestAnimationFrame(function() {
      var now = new Date().getTime();
      var timeDiff =  now - start;
      var proportion = timeDiff / duration;

      // grab the eased domain and range
      tmpDomain = [];
      tmpRange = [];
      for (var i = 0; i < domain.length; i++) {
        tmpDomain.push(startingDomain[i] + easing(proportion) * deltaDomain[i]);
        tmpRange.push(startingRange[i] + easing(proportion) * deltaRange[i]);
      }

      // set the scale for all of the cells and render them;
      cellsToAnimate.forEach(function(cell){
        if (cell.setScale) {
          cell.setScale(tmpDomain,tmpRange);
        }
      })

      self.renderCells();

      if (timeDiff >= duration) {
        clearInterval(int);
        self.setScale(domain,range);
      }
    });

  },1);

  return this;
}

module.exports = queryResultViewerCellManager;
