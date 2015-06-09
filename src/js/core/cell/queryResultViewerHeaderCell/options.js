/***********************************************************
 * queryResultViewerHeaderCell option processing utilities *
 ***********************************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.height = (options.height === undefined) ? 25 : options.height;
  options.bgColor = (options.bgColor === undefined) ? '#DDDDDD' : options.bgColor;
  options.summaryScores = (options.summaryScores === undefined) ? [] : options.summaryScores;
  options.summaryPct = (options.summaryPct === undefined) ? 0 : options.summaryPct;
  options.filters = (options.filters === undefined) ? [] : options.filters;
  options.binSize = (options.binSize === undefined) ? 4 : options.binSize;
  options.binColor = (options.binColor === undefined) ? '#f47222' : options.binColor;

  return options;
}

module.exports = {
  configure: configure
};
