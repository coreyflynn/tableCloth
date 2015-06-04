var _ = require('underscore');
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

/**
 * calculate the value of the percentile given an array of numbers
 * @param  {array} data  an array of numbers to calculate the percentile on
 * @param  {number} p the percentile to calculate
 * @return {number}       the value at the desired percentile
 */
function percentile(data, p) {
  if (data.length < 3) {return mean(data);}
  if (p===100){return _.max(data)}
  if (p===0){return _.min(data)}
  var v = _.sortBy(data,function(n){return n});
  var h = ((v.length-1)*(p/100));
  return v[Math.floor(h)]+((h-Math.floor(h))*(v[Math.floor(h)+1]- v[Math.floor(h)]))
}

/**
 * calculate the mean of a given array of numbers
 * @param  {array} data an array of numbers to calculate the mean of
 * @return {number}      the mean of the array
 */
function mean(data) {
  return _.reduce(data, function(memo, num) {
    return memo + num;
  }, 0) / (data.length === 0 ? 1 : data.length);
}

module.exports = {
  getPixelRatio: getPixelRatio,
  percentile: percentile,
  mean: mean
}
