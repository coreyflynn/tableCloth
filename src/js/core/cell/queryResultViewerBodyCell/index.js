/************************************************************************
 * Body cell customized for use with Broad Institute's Connectivity Map *
 * Query Result Viewer                                                  *
 ************************************************************************/
var basicCell = require('../basicCell');
var cellOptions = require('./options');
var util = require('../../util');
var render = require('../../render/index');
var ease = require('ease-component');
var d3 = require('d3-browserify');

var queryResultViewerBodyCell = function(options) {
  // configure the basic options for the cell
  this.constructor(options);

  // configure custom options for queryResultViewerBodyCell
  this.options = cellOptions.configure(options);

  // set the initial scale
  this.setScale();
}

// inherit from the basicCell
queryResultViewerBodyCell.prototype = Object.create(basicCell.prototype);
queryResultViewerBodyCell.prototype.constructor = basicCell;


queryResultViewerBodyCell.prototype.render = function(tableCloth,xOffset,yOffset,highlight) {
  var height = this.options.height;
  var width = this.options.width;

  // render the background of the cell
  render.rect(tableCloth.viewport.ctx,this.options.x + xOffset,
              this.options.y - yOffset,width,height,'#EEEEEE');

  if (highlight) {
    this.renderHighlight(tableCloth,xOffset,yOffset,highlight);
  }

  // render the cell label
  render.text(tableCloth.viewport.ctx,this.options.label,
              this.options.x + xOffset + 40,
              this.options.y - yOffset + 19);

  // render the color indicator for the row
  render.rect(tableCloth.viewport.ctx,
              this.options.x + xOffset + 33,
              this.options.y - yOffset,
              5,height,this.options.cellColor);

  // render the score text for the row
  render.text(tableCloth.viewport.ctx, this.options.score.toFixed(2),
              this.options.width - 60,
              this.options.y - yOffset + 19,
              '#BDBDBD');
  // render the score indicator for the row
  render.rect(tableCloth.viewport.ctx,
              this.scale(this.options.score) + xOffset,
              this.options.y - yOffset,
              2, height, this.options.cellColor);

  // render an overlay to emphasize the |90 - 100| scores
  render.rect(tableCloth.viewport.ctx,
              this.scale(-90) + xOffset,
              this.options.y - yOffset,
              this.scale(90) - this.scale(-90),
              height, '#EEEEEE', 0.8);

  // render the tail display for the window
  this.renderTailBoundaries(tableCloth, xOffset, yOffset);

  // render the top border of the cell
  render.rect(tableCloth.viewport.ctx,this.options.x + xOffset,
              this.options.y - yOffset,width,1,'white');

  return this;
}

queryResultViewerBodyCell.prototype.renderHighlight = function(tableCloth,xOffset,yOffset,highlight){
  var height = this.options.height;
  var width = this.options.width;

  render.rect(tableCloth.viewport.ctx,this.options.x + xOffset,
              this.options.y - yOffset,33,height,'#183b8e');

  return this;
}

queryResultViewerBodyCell.prototype.renderTailBoundaries = function(tableCloth, xOffset, yOffset) {
  var self = this;
  bounds = [-100,-90,90,100];
  bounds.forEach(function(bound){
    render.dashedLine(tableCloth.viewport.ctx,
                      [self.scale(bound) + xOffset, self.scale(bound) + xOffset],
                      [self.options.y - yOffset,self.options.y - yOffset + 24]);
  });
}

/**
 * sets the current scaling factor applied to the rendering of the cell
 * The scale is linear between values in the passed arrays
 * @param {array} domain an array that describes the input domain of the scale
 * @param {array} range  an array that describs the output range of the scale
 * @return {queryResultViewerBodyCell}
 */
queryResultViewerBodyCell.prototype.setScale = function(domain, range) {
  var width = this.options.width;

  // if a domain and range are passed, use them. Otherwise set to a default
  if (domain && range) {
    this.scale = d3.scale.linear()
                  .domain(domain)
                  .range(range);
  } else {
    var start = 200;
    var end = width - 102;
    var unit = (width - 302) / 200;
    this.scale = d3.scale.linear()
                  .domain([-100, -90, 90, 100])
                  .range([start, unit * 10 + 200, unit * 190 + 200, end]);
  }

  return this;
}

/**
 * Animate the scale to the input domain and range. The length of the domain
 * and range arrays must match that of the
 * @param {tableCloth} The tableCloth instance to use when rendering
 * @param {array} domain an array that describes the input domain of the scale
 * @param {array} range  an array that describs the output range of the scale
 * @return {queryResultViewerBodyCell}
 */
queryResultViewerBodyCell.prototype.animateToScale = function(tableCloth,
                                          domain, range, easeName) {
  var self = this;
  var start = new Date().getTime();
  var tmpDomain, tmpRange;

  // calculate the domain delta
  var startingDomain = this.scale.domain;
  deltaDomain = [];
  startingDomain.forEach(function(d,i){
    deltaDomain.push(domain[i] - d);
  });

  // calculate the range delta
  var startingRange = this.scale.range;
  deltaRange = [];
  startingRange.forEach(function(d,i){
    deltaRange.push(range[i] - d);
  });

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
      for (var i = 0; i < domain.length; i++) {
        tmpDomain = tmpRange = [];
        tmpDomain[i].push(startingDomain[i] + easing(proportion) * delta);
        tmpRange[i].push(startingRange[i] + easing(proportion) * delta);
      }

      tableCloth.cellManager.positionCells();
      tableCloth.cellManager.renderCells();
    });

    if (timeDiff >= duration) {
      clearInterval(int);
    }

  },1);

  return this;
}

module.exports = queryResultViewerBodyCell;
