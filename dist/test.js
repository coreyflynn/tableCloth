tc = new tableCloth('target',{});

var colors = ['red','green','blue','orange','yellow'];
var count = 0;
var int = setInterval(function(){
  for (i=0; i < 100; i++) {
    var color = colors[Math.floor(Math.random()*colors.length)];
    tc.cellManager.addCell(new tc.cellFactory.basicCell({bgColor: color}));
  }

  count += 1;
  if (count >= 1000) {
    clearInterval(int);
  }
},100);

function addAFew() {
  var cellsToAdd = [];
  for (var i = 0; i < 5; i++) {
    var color = colors[Math.floor(Math.random()*colors.length)];
    cellsToAdd.push(new tc.cellFactory.basicCell({height: 0, bgColor: color}));
  }
  cellsToAdd.forEach(function(cell) {
    tc.cellManager.addCellAtIndex(cell,2);
    cell.animateToHeight(tc,24,300);
  });
}
