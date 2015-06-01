tc = new tableCloth('target',{cellManager: 'queryResultViewerCellManager'});

// tc.cellFactory.queryResultViewerBodyCell.prototype.click = function(){addAFew(this.options.index + 1)}

var count = 0;
var start = new Date().getTime();
var cells = [];
for (i=0; i < 10000; i++) {
  var cell = new tc.cellFactory.queryResultViewerSummaryCell({label: 'cell' + i});
  cell = addSubCells(cell);
  cells.push(cell);
  // tc.cellManager.addCell(cell);
}

tc.cellManager.addCells(cells);
var end = new Date().getTime();
console.info('time elapsed: ' + (end - start) + 'ms');

function addSubCells(cell) {
  var cellsToAdd = [];
  for (var i = 0; i < Math.ceil(Math.random()*10); i++) {
    cellsToAdd.push(new tc.cellFactory.queryResultViewerBodyCell({}));
  }
  cell.options.subCells = cellsToAdd;
  return cell;
}
