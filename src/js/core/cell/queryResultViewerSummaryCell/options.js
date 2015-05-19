/************************************************************
 * queryResultViewerSummaryCell option processing utilities *
 ************************************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.subCells = (options.subCells === undefined) ? [] : options.subCells;
  options.score = (options.score === undefined) ? Math.random() * 200 - 100 : options.score;

  return options;

  return options;
}

module.exports = {
  configure: configure
}
