var util = require('../util');

function text(ctx,string,x,y,fillStyle,font) {
  // grab the current pixelRatio
  var pixelRatio = util.getPixelRatio();

  // check for default fillStyle and font
  ctx.font = (font === undefined) ? (14 * pixelRatio) + 'px Open Sans' : font;
  ctx.fillStyle = (fillStyle === undefined) ? 'black' : fillStyle;

  // render the text
  ctx.fillText(string, x * pixelRatio, y * pixelRatio);
}

module.exports = text
