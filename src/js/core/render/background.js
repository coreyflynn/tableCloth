'use strict'
/*******************************
 * Background render utilities *
 *******************************/
var util = require('../util');

/**
 * renders the background of a tableCloth instance
 * @param  {tableCloth} tableCloth the tableCloth instance to be rendered
 * @return {tableCloth}            the tableCloth instance
 */
function main(tableCloth) {
  var height = tableCloth.options.height;
  var width = tableCloth.options.width;
  var pixelRatio = util.getPixelRatio();

  tableCloth.viewport.can.width = width * pixelRatio;
  tableCloth.viewport.can.height = height * pixelRatio;
  tableCloth.viewport.can.style.width = width + 'px';
  tableCloth.viewport.can.style.height = height + 'px';

  tableCloth.viewport.ctx.beginPath();
  tableCloth.viewport.ctx.rect(0, 0, width * pixelRatio, height * pixelRatio);
  tableCloth.viewport.ctx.fillStyle = tableCloth.options.bgColor;
  tableCloth.viewport.ctx.fill();

  // tableCloth.viewport.ctx.scale(1 / pixelRatio, 1 / pixelRatio);
  tableCloth.viewport.ctx.setTransform(1 / pixelRatio,0,0, 1 / pixelRatio,0,0);

  return tableCloth
}

module.exports = {
  main: main
}
