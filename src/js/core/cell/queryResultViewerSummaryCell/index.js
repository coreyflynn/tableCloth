/************************************************************************
 * Body cell customized for use with Broad Institute's Connectivity Map *
 * Query Result Viewer                                                  *
 ************************************************************************/
var queryResultViewerBodyCell = require('../queryResultViewerBodyCell');
var render = require('../../render/index');
var util = require('../../util');
var cellOptions = require('./options');

var queryResultViewerSummaryCell = function (options) {
  // configure the basic options for the cell
  queryResultViewerBodyCell.call(this, options);

  // configure custom options for queryResultViewerBodyCell
  this.options = cellOptions.configure(options);
};

// inherit from the queryResultViewerBodyCell
queryResultViewerSummaryCell.prototype = Object.create(queryResultViewerBodyCell.prototype);

/**
 * render the cell
 * @param  {tableCloth} tableCloth the tableCloth instance to draw against
 * @param  {[type]} xOffset    the x position to use in rendering
 * @param  {[type]} yOffset    the y position to use in rendering
 * @param  {[type]} highlight  indicates if the cell should be drawn as a
 *                               highlighted cell
 * @return {queryResultViewerSummaryCell} a reference to the calling cell
 */
queryResultViewerSummaryCell.prototype.render = function (tableCloth,
                                                xOffset, yOffset, highlight) {
  // render the background of the cell
  render.rect(tableCloth.viewport.ctx, this.options.x + xOffset,
              this.options.y - yOffset, this.options.width,
              this.options.height, '#DDDDDD');

  // render the label
  render.text(tableCloth.viewport.ctx, this.options.label,
              this.options.x + xOffset + 40,
              this.options.y - yOffset + 19);

  // render an overlay to block labels in the summary plot
  render.rect(tableCloth.viewport.ctx,
              this.scale(-100) + xOffset,
              this.options.y - yOffset,
              this.scale(100) - this.scale(-100),
              this.options.height, '#DDDDDD', 0.8);

  // render the color indicator for the row
  render.rect(tableCloth.viewport.ctx,
              this.options.x + xOffset + 13,
              this.options.y - yOffset,
              24, this.options.height, this.options.cellColor);

  // render the type text for the row
  render.text(tableCloth.viewport.ctx, this.options.type,
              this.options.x + xOffset + 16,
              this.options.y - yOffset + 19,
              'white');

  // render the score text for the row
  render.text(tableCloth.viewport.ctx, this.options.score.toFixed(2),
              this.options.width - 60,
              this.options.y - yOffset + 19);

  // render the score indicator for the row
  render.rect(tableCloth.viewport.ctx,
              this.scale(this.options.score) + xOffset,
              this.options.y - yOffset,
              2, this.options.height, this.options.cellColor);

  // render an overlay to emphasize the |90 - 100| scores
  render.rect(tableCloth.viewport.ctx,
              this.scale(-90) + xOffset,
              this.options.y - yOffset,
              this.scale(90) - this.scale(-90),
              this.options.height, '#DDDDDD', 0.8);

  // render the tail display for the window
  this.renderTailBoundaries(tableCloth, xOffset, yOffset);

  if (highlight) {
    this.renderHighlight(tableCloth, xOffset, yOffset, highlight);
  }

  // render the top border of the cell
  render.rect(tableCloth.viewport.ctx, this.options.x + xOffset,
              this.options.y - yOffset, this.options.width, 1, 'white');

  return this;

};

/**
 * render the highlight of the row
 * @param  {tableCloth} tableCloth the tableCloth instance to draw against
 * @param  {[type]} xOffset    the x position to use in rendering
 * @param  {[type]} yOffset    the y position to use in rendering
 * @param {[type]} highlight  [description]
 */
queryResultViewerBodyCell.prototype.renderHighlight = function(tableCloth,xOffset,yOffset){
  render.rect(tableCloth.viewport.ctx,this.options.x + xOffset,
              this.options.y - yOffset,5,this.options.height,'black');

  return this;
}

/**
 * opens the summary cell's subCells
 * @param  {int} duration the length of an opening animation in ms. Defaults to 0ms
 * @return {queryResultViewerSummaryCell}
 */
queryResultViewerSummaryCell.prototype.open = function(duration) {
  // make sure the cells have a height that is the same size as their summary cell
  this.options.subCells.map(function(cell) {
    cell.options.height = this.options.height;
  }.bind(this));

  var cells = this.options.subCells;

  this.options.cellManager.addCellsAtIndex(cells,
                                            this.options.index + 1,
                                            duration);
  this.options.subCells.forEach(function(cell){
    cell.setScale(this.scale.domain(),this.scale.range());
  }.bind(this));

  return this;
}

/**
 * closes the summary cell's subCells
 * @param  {int} duration the length of an closing animation in ms. Defaults to 0ms
 * @return {queryResultViewerSummaryCell}
 */
queryResultViewerSummaryCell.prototype.close = function(duration) {
  this.options.cellManager.removeCellsAtIndexRange(this.options.index + 1,
        this.options.index + this.options.subCells.length + 1, duration);
  return this;
}

/**
 * custom click handler to open or close the subCells
 * @return {queryResultViewerSummaryCell}
 */
queryResultViewerSummaryCell.prototype.click = function () {
  if (this.options.state === 'closed') {
    this.open(600);
  } else {
    this.close(600);
  }
  this.options.state = (this.options.state === 'open') ? 'closed' : 'open';

  return this;
};

/**
 * update the summary score of the cell based on the subCells
 * @return {null} null
 */
queryResultViewerSummaryCell.prototype.updateSummaryScore = function () {
  console.log('updateSummary');
  var scores = this.options.subCells.map(function (cell) {
    return cell.options.score;
  });

  var mean = util.mean(scores);
  var pct;
  if (mean >= 0) {
    pct = util.percentile(scores, 75);
  } else {
    pct = util.percentile(scores, 25);
  }

  this.options.score = pct;
};

/**
 * add subCells to the summary cell
 * @param {array} cells the cells to add
 * @return {queryResultViewerSummaryCell} a reference to the calling cell
 */
queryResultViewerSummaryCell.prototype.addSubCells = function (cells) {
  this.options.subCells.push(cells);

  var scores = this.options.subCells.map(function (cell) {
    return cell.options.score;
  });

  var mean = util.mean(scores);
  var pct;
  if (mean >= 0) {
    pct = util.percentile(scores, 75);
  } else {
    pct = util.percentile(scores, 25);
  }

  this.options.score = pct;

  return this;
};

module.exports = queryResultViewerSummaryCell;
