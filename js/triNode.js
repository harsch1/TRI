paper.TriNode = function (scope, xIndex, yIndex) {
    this.marked = false;
    this.neighbours = [];
    this.team = "white";
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.scope = scope;
    this.selected = false;

    this.select = function() {
        this.selected = true;
        if (scope.selected != "") {
            scope.selected.selected = false;
            for (gNode of scope.getTris(scope.selected.xIndex, scope.selected.yIndex)) {
                gNode.deselect();
            }
        }
        this.scope.select(this);
        for (gNode of scope.getTris(scope.selected.xIndex, scope.selected.yIndex)) {
            gNode.select();
        }
    }

    this.deselect = function() {
        this.selected = false;
        if (scope.selected.xIndex == this.xIndex && scope.selected.yIndex == this.yIndex) {
            for (gNode of scope.getTris(scope.selected.xIndex, scope.selected.yIndex)) {
                gNode.deselect();
            }
            this.scope.select("");
        }
    }
}