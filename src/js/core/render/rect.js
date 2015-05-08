/********************************
 * Utility to render rectangles *
 ********************************/
var util = require('../util');

/**
 * draw a rectangle on the given canvas 2D context
 * @param  {canvas context} ctx    the context to draw to
 * @param  {float} x      the x origin
 * @param  {float} y      the y origin
 * @param  {float} width  the width of the rectangle
 * @param  {float} height the height of the rectangle
 * @param  {string} fillStyle the fillStyle to use
 * @return {null}
 */
function rect(ctx,x,y,width, height, fillStyle, globalAlpha) {
  var pixelRatio = util.getPixelRatio();

  ctx.globalAlpha = (globalAlpha === undefined) ? 1: globalAlpha;
  ctx.beginPath();
  ctx.rect(x * pixelRatio,y * pixelRatio,width * pixelRatio,height * pixelRatio);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.closePath();

  ctx.globalAlpha = 1;

}

module.exports = rect;
