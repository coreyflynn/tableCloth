/************************************************************************
 * Body cell customized for use with Broad Institute's Connectivity Map *
 * Query Result Viewer                                                  *
 ************************************************************************/
var queryResultViewerBodyCell = require('../queryResultViewerBodyCell');
var cellOptions = require('./options');

var queryResultViewerSummaryCell = function(options) {
  // configure the basic options for the cell
  this.foo(options);

  // configure custom options for queryResultViewerBodyCell
  this.options = cellOptions.configure(options);
}

// inherit from the queryResultViewerBodyCell
queryResultViewerSummaryCell.prototype = Object.create(queryResultViewerBodyCell.prototype);
queryResultViewerSummaryCell.prototype.foo = queryResultViewerBodyCell;

/**
 * render the cell
 * @param  {tableCloth} tableCloth the tableCloth instance to draw against
 * @param  {[type]} xOffset    the x position to use in rendering
 * @param  {[type]} yOffset    the y position to use in rendering
 * @param  {[type]} highlight  indicates if the cell should be drawn as a
 *                               highlighted cell
 * @return {queryResultViewerSummaryCell}
 */
queryResultViewerSummaryCell.prototype.render = function(tableCloth,xOffset,yOffset,highlight) {
  this.constructor.prototype.render(tableCloth,xOffset,yOffset,highlight);
}

/**
 * opens the summary cell's subCells
 * @param  {int} duration the length of an opening animation in ms. Defaults to 0ms
 * @return {queryResultViewerSummaryCell}
 */
queryResultViewerSummaryCell.open = function(duration) {

  return this;
}

module.exports = queryResultViewerSummaryCell;
