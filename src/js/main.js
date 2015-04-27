var coreOptions = require('./core/options');
var coreViewport = require('./core/viewport');

/**
 * tableCloth constructor. Builds a new instance of tableCloth and binds it
 * to the dom at the desired target div
 * @param {string} target the DOM id of the target div to bind to
 * @param {object} options an object containing setup options for tableCloth
 */
var tableCloth = function(target,options) {
  // keep track of tableCloth's container
  this.$el = document.getElementById(target);

  // attach the options to the constructed object
  this.options = options;

  // configure base options
  this.options = coreOptions.configure(this.options);

  // attach a top level canvas element to serve as the tableCloth viewport
  coreViewport.attach(this);
}

// if a window object is present, attach tableCloth to it
if (window) {
  window.tableCloth = tableCloth
}

tableCloth.prototype.animateToHeight = function(height,duration) {
  coreViewport.animateToHeight(this, height, duration);
}
