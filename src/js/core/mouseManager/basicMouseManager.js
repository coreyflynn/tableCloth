/***********************
 * Basic Mouse Manager *
 ***********************/
var util = require('../util');
/**
 * the default mouse and touch event manager to handle clicks
 * @param {tableCloth} tableCloth the tableCloth instance to attach the manager to
 * @return {basicMouseManager}
 */
var basicMouseManager = function(tableCloth) {
  tableCloth.viewport.can.$el.addEventListener('mousemove', function(ev){
    // get the position relative to the top left of the canvas
    var rect = tableCloth.viewport.can.getBoundingClientRect();
    var position = {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    };

    var hoveredCell = tableCloth.cellManager.findCellAtPosition(position.x,position.y);
    tableCloth.cellManager.hoveredCellIndex = hoveredCell.options.index;
    tableCloth.cellManager.renderCells();
  });

  tableCloth.viewport.can.$el.addEventListener('mousedown', function(ev){
    var rect = tableCloth.viewport.can.getBoundingClientRect();
    var position = {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    };

    var clickedCell = tableCloth.cellManager.findCellAtPosition(position.x,position.y);
    clickedCell.click();
  });


  return this;
}

module.exports = basicMouseManager;
