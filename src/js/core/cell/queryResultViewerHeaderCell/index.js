/*********************************************************************
 * custom cell for the Connectivity Map's query result viewer header *
 *********************************************************************/
var queryResultViewerBodyCell = require('../queryResultViewerBodyCell');
var queryResultViewerSummaryCell = require('../queryResultViewerSummaryCell');
var cellOptions = require('./options');
var render = require('../../render/index');
var util = require('../../util');
var _ = require('underscore');
var d3 = require('d3-browserify');

/**
 * constructor function for the queryResultViewerHeaderCell
 * @param {object} options an object that contains passed options
 */
var queryResultViewerHeaderCell = function(options){
  // set up options specific to queryResultViewerHeaderCell
  this.options = cellOptions.configure(options);

  // call basicCell's constructor to finish initilization of the cell
  queryResultViewerBodyCell.call(this,this.options);

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
queryResultViewerHeaderCell.prototype.render = function(tableCloth,xOffset,yOffset,highlight) {
  // steal the scale from the one of the cells in the viewport
  var templateCell = this.options.cellManager.findApproximateViewportCells()[0];
  this.setScale(templateCell.scale.domain(),
                templateCell.scale.range());

  // render the background of the cell in two portions, the top half for labels
  // and the bottom half for the header plot
  render.rect(tableCloth.viewport.ctx,
              this.options.x + xOffset,
              this.options.y - yOffset,
              this.options.width,
              this.options.height / 2,'white');

  render.rect(tableCloth.viewport.ctx,
              this.options.x + xOffset,
              this.options.y - yOffset + this.options.height / 2,
              this.options.width,
              this.options.height / 2,
              '#DDDDDD');

  if (highlight) {
    this.renderHighlight(tableCloth,xOffset,yOffset,highlight);
  }

  // render the cell label
  render.text(tableCloth.viewport.ctx,'Summary',
              this.options.x + xOffset + 40,
              this.options.y - yOffset + this.options.height / 2 + 17);

  // render the score text for the row
  if (new Date().getTime() - this.options.cellManager.lastChange < 1000) {
    this.getSummaryScores();
  }
  render.text(tableCloth.viewport.ctx, this.options.summaryPct.toFixed(2),
              this.options.width - 60,
              this.options.y - yOffset + this.options.height / 2 + 17);

  // render the score indicators for all the rows in that viewport
  var binnedScores = _.groupBy(this.options.summaryScores,function(score){
    return Math.floor(this.scale(score) / 10);
  }.bind(this));

  var maxBin = _.max(_.values(binnedScores)
                      .map(function(a){return a.length}));
  for (bin in binnedScores){
    render.rect(tableCloth.viewport.ctx,
                bin * 10,
                this.options.y - yOffset + this.options.height / 2,
                10,
                this.options.height / 2, 'black',
                binnedScores[bin].length / this.options.summaryScores.length * 200);
  };


  // render an overlay to emphasize the |90 - 100| scores
  render.rect(tableCloth.viewport.ctx,
              this.scale(-90) + xOffset,
              this.options.y - yOffset + this.options.height / 2,
              this.scale(90) - this.scale(-90),
              this.options.height / 2, '#DDDDDD', 0.8);

  // render the tail display for the window
  this.renderTailBoundaries(tableCloth, xOffset,
                            yOffset - this.options.height / 2);

  // render the top border of the cell
  render.rect(tableCloth.viewport.ctx,this.options.x + xOffset,
              this.options.y - yOffset,this.options.width,1,'white');

  return this;
}

/**
 * fetch all of the queryResultViewerSummaryCells in the from the cell's
 * containing cell manager and compute their summary score
 */
queryResultViewerHeaderCell.prototype.getSummaryScores = function() {
  // get all of the cells in the cell manager and find the summary cells
  var cells = this.options.cellManager.cells;
  summaryCells = cells.filter(function(cell){
    return (cell instanceof queryResultViewerSummaryCell);
  });

  // extract the scores from the summary cells
  this.options.summaryScores = summaryCells.map(function(cell){
    return cell.options.score;
  });

  // compute the percentile score based on the mean
  var mean = util.mean(this.options.summaryScores);
  if (mean <= 0) {
    this.options.summaryPct = util.percentile(this.options.summaryScores,25);
  } else {
    this.options.summaryPct = util.percentile(this.options.summaryScores,75);
  }

  return this;
}

module.exports = queryResultViewerHeaderCell;
