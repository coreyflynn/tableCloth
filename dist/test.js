tc = new tableCloth('target',{cellManager: 'queryResultViewerCellManager'});

tc.cellFactory.queryResultViewerBodyCell.prototype.click = function(){addAFew(this.options.index + 1)}

var colors = ['red','green','blue','orange','yellow'];
var count = 0;
var start = new Date().getTime();
var int = setInterval(function(){
  for (i=0; i < 100; i++) {
    var color = colors[Math.floor(Math.random()*colors.length)];
    tc.cellManager.addCell(new tc.cellFactory.queryResultViewerBodyCell({bgColor: color, label: 'cell' + i}));
  }

  count += 1;
  if (count >= 1) {
    clearInterval(int);
    console.info('done adding cells');
    var end = new Date().getTime();
    console.info('time elapsed: ' + (end - start) + 'ms');
  }
},100);

function addAFew(index) {
  var cellsToAdd = [];
  for (var i = 0; i < 5; i++) {
    var color = colors[Math.floor(Math.random()*colors.length)];
    cellsToAdd.push(new tc.cellFactory.basicCell({bgColor: color}));
  }
  cellsToAdd.forEach(function(cell) {
    tc.cellManager.addCellAtIndex(cell,index,600);
  });
}
