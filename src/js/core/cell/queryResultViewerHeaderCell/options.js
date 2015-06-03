/***********************************************************
 * queryResultViewerHeaderCell option processing utilities *
 ***********************************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.height = (options.height === undefined) ? 50 : options.height;

  return options;
}

module.exports = {
  configure: configure
}
