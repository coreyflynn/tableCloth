tc = new tableCloth('target',{});

// tc.cellFactory.basicCell.prototype.click = function(){addAFew(this.options.index + 1)}

var colors = ['red','green','blue','orange','yellow'];
var count = 0;
var int = setInterval(function(){
  for (i=0; i < 100; i++) {
    var color = colors[Math.floor(Math.random()*colors.length)];
    tc.cellManager.addCell(new tc.cellFactory.basicCell({bgColor: color}));
  }

  count += 1;
  if (count >= 10) {
    clearInterval(int);
  }
},100);

function addAFew(index) {
  var cellsToAdd = [];
  for (var i = 0; i < 5; i++) {
    var color = colors[Math.floor(Math.random()*colors.length)];
    cellsToAdd.push(new tc.cellFactory.basicCell({height: 0, bgColor: color}));
  }
  cellsToAdd.forEach(function(cell) {
    tc.cellManager.addCellAtIndex(cell,index);
    cell.animateToHeight(tc,24,600);
  });
}
