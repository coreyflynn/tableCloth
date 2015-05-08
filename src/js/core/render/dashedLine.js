var util = require('../util');

function dashedLine(ctx,x,y,strokeStyle,dash,globalAlpha) {
    pixelRatio = util.getPixelRatio();

    dash = (dash === undefined) ? [5]: dash;
    ctx.setLineDash(dash);
    ctx.globalAlpha = (globalAlpha === undefined) ? 1: globalAlpha;
    ctx.strokeStyle = (strokeStyle === undefined) ? '#BDBDBD': strokeStyle;

    // -100 bound
    ctx.beginPath();
    ctx.moveTo(x[0] * pixelRatio,y[0] * pixelRatio);
    for (var i=1; i < x.length; i++) {
      ctx.lineTo(x[i] * pixelRatio,y[i] * pixelRatio);
    }
    ctx.stroke();
    ctx.closePath();

    return ctx;
}

module.exports = dashedLine;
