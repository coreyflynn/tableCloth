/****************************************
 * cell option processing utilities   *
 **************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.height = (options.height === undefined) ? 25 : options.height;
  options.width = (options.width === undefined) ? 500 : options.width;
  options.bgColor = (options.bgColor === undefined) ? '#EEEEEE' : options.bgColor;
  options.x = (options.x === undefined) ? 0 : options.x;
  options.y = (options.y === undefined) ? 0 : options.y;
  options.index = (options.index === undefined) ? 0 : options.index;

  return options;
}

module.exports = {
  configure: configure
}
