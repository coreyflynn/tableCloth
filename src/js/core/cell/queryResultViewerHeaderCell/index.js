/*********************************************************************
 * custom cell for the Connectivity Map's query result viewer header *
 *********************************************************************/
var queryResultViewerBodyCell = require('../queryResultViewerBodyCell');
var queryResultViewerSummaryCell = require('../queryResultViewerSummaryCell');
var cellOptions = require('./options');
var render = require('../../render/index');
var util = require('../../util');
var _ = require('underscore');

/**
 * constructor function for the queryResultViewerHeaderCell
 * @param {object} options an object that contains passed options
 * @return {queryResultViewerHeaderCell} a reference to the calling cell
 */
var queryResultViewerHeaderCell = function (options) {
  // set up options specific to queryResultViewerHeaderCell
  this.options = cellOptions.configure(options);

  // call basicCell's constructor to finish initilization of the cell
  queryResultViewerBodyCell.call(this, this.options);

  this.staleSummary = true;

  return this;
}
// inherit from basicCell
queryResultViewerHeaderCell.prototype = Object.create(queryResultViewerBodyCell.prototype);

/**
 * render the cell
 * @param  {tableCloth} tableCloth the tableCloth instance to render into
 * @param  {int} xOffset    the x offet to use when rendering
 * @param  {in} yOffset    the y offset to use when rendering
 * @param  {bool} highlight  whether or not to render the cell as highlighted
 * @return {queryResultViewerBodyCell}
 */
queryResultViewerHeaderCell.prototype.render = function (tableCloth, xOffset, yOffset, highlight) {
  // steal the scale from the one of the cells in the viewport
  var templateCell = this.options.cellManager.findApproximateViewportCells()[0];
  this.setScale(templateCell.scale.domain(),
                templateCell.scale.range());

  // render the background of the cell

  render.rect(tableCloth.viewport.ctx,
              this.options.x + xOffset,
              this.options.y - yOffset,
              this.options.width,
              this.options.height,
              this.options.bgColor);

  if (highlight) {
    this.renderHighlight(tableCloth, xOffset, yOffset, highlight);
  }

  // render the cell label
  render.text(tableCloth.viewport.ctx, this.options.title,
              this.options.x + xOffset + 40,
              this.options.y - yOffset + 17);

  // render the score text for the row
  if (this.staleSummary) {
    this.getSummaryScores();
    this.staleSummary = false;
  }
  render.text(tableCloth.viewport.ctx, this.options.summaryPct.toFixed(2),
              this.options.width - 60,
              this.options.y - yOffset + 17);

  // render the score indicators for all the rows in that viewport
  for (var bin in this.binnedScores) {
    var opacity = this.binnedScores[bin].length / this.maxBin;
    opacity = (opacity < 0.25) ? 0.25 : opacity;
    render.rect(tableCloth.viewport.ctx,
                bin * this.options.binSize,
                this.options.y - yOffset,
                this.options.binSize,
                this.options.height, this.options.binColor,
                opacity);
  }

  // render an overlay to emphasize the |90 - 100| scores
  render.rect(tableCloth.viewport.ctx,
              this.scale(-90) + xOffset,
              this.options.y - yOffset,
              this.scale(90) - this.scale(-90),
              this.options.height, this.options.bgColor, 0.8);

  // render the tail display for the window
  this.renderTailBoundaries(tableCloth, xOffset,
                            yOffset);

  // render the top border of the cell
  render.rect(tableCloth.viewport.ctx, this.options.x + xOffset,
              this.options.y - yOffset, this.options.width, 1, 'white');

  this.lastRender = new Date().getTime();
  return this;
};

/**
 * fetch all of the queryResultViewerSummaryCells in the from the cell's
 * containing cell manager and compute their summary score
 */
queryResultViewerHeaderCell.prototype.getSummaryScores = function () {
  // get all of the cells in the cell manager and find the summary cells
  var cells = this.options.cellManager.cells;
  var summaryCells = cells.filter(function (cell) {
    return (cell instanceof queryResultViewerSummaryCell);
  });

  // extract the scores from the summary cells
  var filteredCells = _.filter(summaryCells, function (cell) {
    var match = true;
    if (this.options.filters.length !== 0) {
      match = false;
      this.options.filters.forEach(function (filter) {
        var key = _.keys(filter)[0];
        var val = filter[key];
        if (cell.options[key] === val) {
          match = true;
        }
      });
    }
    return match;
  }.bind(this));

  this.options.summaryScores = filteredCells.map(function (cell) {
    return cell.options.score;
  });

  this.binnedScores = _.groupBy(this.options.summaryScores, function (score) {
    return Math.floor(this.scale(score) / this.options.binSize);
  }.bind(this));

  this.maxBin = _.max(_.keys(this.binnedScores).map(function (key) {
    return this.binnedScores[key].length;
  }.bind(this)));

  // compute the percentile score based on the mean
  var mean = util.mean(this.options.summaryScores);
  if (mean <= 0) {
    this.options.summaryPct = util.percentile(this.options.summaryScores, 25);
  } else {
    this.options.summaryPct = util.percentile(this.options.summaryScores, 75);
  }

  return this;
};

module.exports = queryResultViewerHeaderCell;
