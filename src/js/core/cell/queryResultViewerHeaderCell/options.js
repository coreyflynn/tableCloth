/***********************************************************
 * queryResultViewerHeaderCell option processing utilities *
 ***********************************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.height = (options.height === undefined) ? 25 : options.height;
  options.summaryScores = (options.summaryScores === undefined) ? [] : options.summaryScores;
  options.summaryPct = (options.summaryPct === undefined) ? 0 : options.summaryPct;
  options.filters = (options.filters === undefined) ? [] : options.filters;
  options.binSize = (options.binSize === undefined) ? 10 : options.binSize;

  return options;
}

module.exports = {
  configure: configure
}
