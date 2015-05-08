'use strict';
/**********************
 * Viewport functions *
 **********************/
 var util = require('./util');
 var render = require('./render');
 var ease = require('ease-component');

/**
 * attach a canvas element to the dom to serve as the top level tableCloth
 * viewport
 * @param  {TableCloth} tableCloth A tableCloth instance to attach
 * @return {tableCloth}            the attached tableCloth instance
 */
function attach(tableCloth) {
  var height = tableCloth.options.height;
  var width = tableCloth.options.width;
  var pixelRatio = util.getPixelRatio();

  // generate a timestamped id for the tableCloth instance
  tableCloth.id = new Date().getTime();

  // build the viewport object and add it to the tableCloth instance
  tableCloth.viewport = {};
  tableCloth.viewport.can = document.createElement('canvas');
  tableCloth.viewport.can.width = width * pixelRatio;
  tableCloth.viewport.can.height = height * pixelRatio;
  tableCloth.viewport.can.style.width = width + 'px';
  tableCloth.viewport.can.style.height = height + 'px';
  tableCloth.viewport.can.id = tableCloth.id + 'viewport';
  tableCloth.viewport.can.setAttribute('data-height', tableCloth.options.height);
  tableCloth.viewport.can.classList.add('tableCloth');

  // attach the canvas
  tableCloth.$el.appendChild(tableCloth.viewport.can);

  // add the 2d context to the viewport
  tableCloth.viewport.can.$el = document.getElementById(tableCloth.viewport.can.id);
  tableCloth.viewport.ctx = tableCloth.viewport.can.$el.getContext('2d');
  tableCloth.viewport.ctx.setTransform(1 / pixelRatio,0,0, 1 / pixelRatio,0,0);




  // render the background
  render.background(tableCloth);


  // return the tableCloth instance
  return tableCloth;
}

function animateToHeight(tableCloth, height, duration, easeName) {
  var start = new Date().getTime();
  var startingHeight = tableCloth.options.height;
  var delta = height - tableCloth.viewport.can.height;
  var easing = (easeName === undefined) ? ease.inOutExpo : ease[easeName];

  var timer = 0;
  var int = setInterval(function() {

    var now = new Date().getTime();
    var timeDiff =  now - start;
    var proportion = timeDiff / duration;
    tableCloth.options.height = startingHeight + easing(proportion) * delta;

    window.requestAnimationFrame(function() {
      render.background(tableCloth);
      tableCloth.cellManager.renderCells();
    });

    if (timeDiff >= duration) {
      clearInterval(int);
    }

  },1);
}

module.exports = {
  attach: attach,
  animateToHeight: animateToHeight
}
