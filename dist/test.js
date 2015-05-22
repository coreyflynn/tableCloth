tc = new tableCloth('target',{cellManager: 'queryResultViewerCellManager'});

// tc.cellFactory.queryResultViewerBodyCell.prototype.click = function(){addAFew(this.options.index + 1)}

var count = 0;
var start = new Date().getTime();
var int = setInterval(function(){
  for (i=0; i < 100; i++) {
    var cell = new tc.cellFactory.queryResultViewerSummaryCell({label: 'cell' + i});
    cell = addSubCells(cell);
    tc.cellManager.addCell(cell);
  }

  count += 1;
  if (count >= 1) {
    clearInterval(int);
    console.info('done adding cells');
    var end = new Date().getTime();
    console.info('time elapsed: ' + (end - start) + 'ms');
  }
},10);

function addSubCells(cell) {
  var cellsToAdd = [];
  for (var i = 0; i < Math.ceil(Math.random()*10); i++) {
    cellsToAdd.push(new tc.cellFactory.queryResultViewerBodyCell({}));
  }
  cell.options.subCells = cellsToAdd;
  return cell;
}
