paper.boardheight = 640;
paper.boardwidth = 750;
paper.turnColor = 'red';
paper.width = 16;
paper.height = 8;
width = paper.width;
height = paper.height;

paper.selected = "";
paper.nodeGrid = new Array(width);
paper.triGrid = new Array(width);
for (var i = 0; i < width; i++) {
    paper.nodeGrid[i] = new Array(height);
    paper.triGrid[i] = new Array(height);
    for (var j = 0; j < height; j++) {
        paper.triGrid[i][j] = [];
    }
}

paper.processMove = function() {
	paper.selected.team = paper.turnColor;
	paper.selected.marked = true;
	for (gNode of paper.getTris(paper.selected.xIndex, paper.selected.yIndex)) {
		gNode.updateTeam();
	}
	paper.selected.deselect();
	if (paper.turnColor == 'red') {
		paper.turnColor = 'blue';
	} else {
		paper.turnColor = 'red';
	}
	paper.turnMarker.fillColor = paper.turnColor;
};

paper.getTris = function(x, y) {
    return paper.triGrid[x][y];
};

