var isTouch = function(event) {
    if (typeof event.event.touches != "undefined") {
        return true;
    } else {
        return false;
    }
};

paper.TriNodeG = function(x, y, flip, scope, radius, node) {
    this.node = node;

    this.radius = radius;
    this.triangle = new Path.RegularPolygon({
        center: new Point(x, y),
        sides: 3,
        radius: this.radius,
        fillColor: this.node.team,
        strokeColor: "black",
        strokeWidth: 2
    });
    this.flipped = flip;
    if (this.flipped) {
        this.triangle.rotation = 180;
    }
    this.x = x;
    this.y = y;
    this.triangle.gNode = this;
    this.triangle.node = node;
    this.triangle.onMouseDown = function(event) {
        if (isTouch(event)) {
            this.node.scope.touchDown = this;
        }
    }
    this.triangle.onMouseUp = function(event) {
        if ((isTouch(event) || event.event.button == 0) && this.contains(event.point)) {
            if (isTouch(event) && (scope.touchDown != this)) {
                return false;
            }
            if (!this.node.marked) {
                if (this.node.selected) {
                    this.node.deselect();
                } else {
                    this.node.select();
                }
            }
            if (isTouch(event))
                this.gNode.hoverLeave();
        }
    };
    this.triangle.onMouseEnter = function(event) {
        this.gNode.hoverEnter();

    };
    this.triangle.onMouseLeave = function(event) {
        this.gNode.hoverLeave();

    };
    this.select = function() {
        this.triangle.strokeWidth = 5;
    }

    this.deselect = function() {
        this.triangle.strokeWidth = 2;
    }

    this.hoverEnter = function() {
        if (!this.node.marked) {
            this.triangle.fillColor -= 0.25;
        }
    }

    this.hoverLeave = function() {
        if (!this.node.marked) {
            this.triangle.fillColor += 0.25;
        }
    }
    this.updateTeam = function() {
        this.triangle.fillColor = this.node.team;
    }
}