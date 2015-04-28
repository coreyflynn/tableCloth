tc = new tableCloth('target',{});

var colors = ['red','green','blue','orange','yellow'];
for (i=0; i < 100; i++) {
  var color = colors[Math.floor(Math.random()*colors.length)];
  tc.cellManager.addCell(new tc.cellFactory.basicCell({bgColor: color}));
}
