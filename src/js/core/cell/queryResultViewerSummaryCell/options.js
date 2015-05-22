/************************************************************
 * queryResultViewerSummaryCell option processing utilities *
 ************************************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.type = (options.type === undefined) ? 'CP' : options.type;
  options.subCells = (options.subCells === undefined) ? [] : options.subCells;
  options.score = (options.score === undefined) ? Math.random() * 200 - 100 : options.score;
  options.state = (options.state === undefined) ? 'closed' : options.state;

  return options;
}

module.exports = {
  configure: configure
}
