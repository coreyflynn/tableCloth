/***********************************************************
 * queryResultViewerHeaderCell option processing utilities *
 ***********************************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.height = (options.height === undefined) ? 50 : options.height;
  options.summaryScores = (options.summaryScores === undefined) ? [] : options.summaryScores;
  options.summaryPct = (options.summaryPct === undefined) ? 0 : options.summaryPct;

  return options;
}

module.exports = {
  configure: configure
}
