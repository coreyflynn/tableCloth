/*********************************************************************
 * custom cell for the Connectivity Map's query result viewer header *
 *********************************************************************/
var basicCell = require('../basicCell');
var cellOptions = require('./options');

/**
 * constructor function for the queryResultViewerHeaderCell
 * @param {object} options an object that contains passed options
 */
var queryResultViewerHeaderCell = function(options){
  // set up options specific to queryResultViewerHeaderCell
  this.options = cellOptions.configure(options);

  // call basicCell's constructor to finish initilization of the cell
  basicCell.call(this,this.options);

  return this;
}
// inherit from basicCell
queryResultViewerHeaderCell.prototype = Object.create(basicCell.prototype);

module.exports = queryResultViewerHeaderCell;
