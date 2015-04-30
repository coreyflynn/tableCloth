/*******************************
 * option processing utilities *
 *******************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.height = (options.height === undefined) ? 500 : options.height;
  options.width = (options.width === undefined) ? 500 : options.width;
  options.bgColor = (options.bgColor === undefined) ? '#EEEEEE' : options.bgColor;
  options.fillContainer = (options.fillContainer === undefined) ? true : options.fillContainer;

  return options;
}

module.exports = {
  configure: configure
}
