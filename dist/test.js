'use strict';
var tc = new tableCloth('target', {cellManager: 'queryResultViewerCellManager'});

var start = new Date().getTime();
var cells = [];
for (var i=0; i < 1000; i++) {
  var cell = new tc.cellFactory.queryResultViewerSummaryCell({label: 'cell' + i});
  cell = addSubCells(cell);
  cells.push(cell);
  // tc.cellManager.addCell(cell);
}

tc.cellManager.addHeaderCell(new tc.cellFactory.queryResultViewerHeaderCell(
  {
    title: 'Summary',
    filters: [{pertType: 'CP'}]
  }
));
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
