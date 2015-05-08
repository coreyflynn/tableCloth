/*********************************************************
 * queryResultViewerBodyCell option processing utilities *
 *********************************************************/

function configure(options) {
  options = (options === undefined) ? {} : options;
  options.cellID = (options.cellID === undefined) ? 'CellLine' : options.cellID;
  options.score = (options.score === undefined) ? Math.random() * 200 - 100 : options.score;
  options.cellColor = (options.cellColor === undefined) ? '#f47222' : options.cellColor;

  return options;
}

module.exports = {
  configure: configure
}
