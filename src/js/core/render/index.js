/***********************
 * Rendering utilities *
 ***********************/
var render = {}
render.background = require('./background');
render.rect = require('./rect');
render.roundRect = require('./roundRect');
render.text = require('./text');
render.dashedLine = require('./dashedLine');

module.exports = render;
