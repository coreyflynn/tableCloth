/**
 * grab the current browser's pixel ratio
 * http://www.html5rocks.com/en/tutorials/canvas/hidpi/
 */
function getPixelRatio() {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
}

module.exports = {
  getPixelRatio: getPixelRatio
}
