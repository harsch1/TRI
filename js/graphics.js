var boardheight = 640;
var boardwidth = 750;

var radius = 50;
var rheight = radius * 1.6;
var flip = true;
var width = 16;
var height = 8;
var enabledColor = "#d6d6d6";
var disabledColor = "#666666";
var red = new Color("#ff0000");
var blue = new Color(74 / 255, 169 / 255, 247 / 255, 1);

var startColor = red;

var isTouch = function(event) {
    if (typeof event.event.touches != "undefined") {
        return true;
    } else {
        return false;
    }
};

var rect = new Path.Rectangle({
    point: [0, 0],
    // size: [view.size.width, view.size.height]
    size: [boardwidth, boardheight + 5]
});
rect.sendToBack();
rect.fillColor = "lightgrey";

{ //Menu
    var menu = new Path.Rectangle({
        point: [750, -10],
        size: [310, 660],
        strokeColor: "black",
        strokeWidth: 3
    });
    menu.fillColor = "white";

    var menuText = new PointText({
        point: [900, 50],
        justification: "center",
        fillColor: "black",
        content: "MENU",
        fontSize: 16,
        fontFamily: "Century Gothic",
        fontWeight: "bold"
    });

    var submitButton = new Path.Rectangle({
        rectangle: new Path.Rectangle({
            point: [790, 550],
            size: [225, 75]
        }),
        radius: new Size(20, 20),
        strokeColor: "black",
        fillColor: disabledColor,
        strokeWidth: 3,
        hoverable: false,
        touchDown: false
    });
    var submitText = new PointText({
        point: [submitButton.position.x, submitButton.position.y + 10],
        justification: "center",
        fillColor: "white",
        content: "SUBMIT TURN",
        fontSize: 25,
        fontFamily: "Century Gothic",
        locked: true
            // fontWeight: "bold"
    });
    submitButton.onMouseEnter = function(event) {
        if (submitButton.hoverable && !isTouch(event)) {
            submitButton.fillColor -= 0.1;
        }
    };
    submitButton.onMouseLeave = function(event) {
        if (submitButton.hoverable && !isTouch(event)) {
            submitButton.fillColor += 0.1;
        }
        if (isTouch(event) && submitButton.touchDown) {
            submitButton.touchDown = false;
            submitButton.fillColor -= 0.15;
        }
    };
    submitButton.onMouseDown = function(event) {
        if (submitButton.hoverable) {
            submitButton.fillColor += 0.15;
        }
        if (isTouch(event)) {
            submitButton.touchDown = true;
        }
    };
    submitButton.onMouseUp = function(event) {
        if (submitButton.hoverable) {
            if (isTouch(event)) {
                if (!submitButton.touchDown) {
                    return;
                } else {
                    submitButton.touchDown = false;
                }
            }
            submitButton.fillColor -= 0.15;
            console.log(master.selected.xIndex + "," + master.selected.yIndex);
            master.processMove();
        }
    };

    var turnMarker = new Path.Rectangle({
        rectangle: new Path.Rectangle({
            point: [850, 250],
            size: [74, 75]
        }),
        radius: new Size(20, 20),
        strokeColor: "black",
        strokeWidth: 3
    });
    turnMarker.fillColor = startColor;
    var menuGroup = new Group([menu, menuText, submitButton, submitText, turnMarker]);
}
var master = new Object();
master.selected = "";
master.triGrid;
master.touchDown = "";

master.getNodes = function(x, y) {
    return master.triGrid[x][y];
};
master.select = function(x) {
    if (x == "") {
        submitText.fillColor = "white";
        submitButton.fillColor = disabledColor;
        submitButton.hoverable = false;
    } else {
        submitText.fillColor = "black";
        submitButton.fillColor = enabledColor;
        submitButton.hoverable = true;
    }
    master.selected = x;
};

class TriNode {
    constructor(x, y, flip, master, radius, xIndex, yIndex) {
        this.marked = false;
        this.neighbours = [];
        this.team = "white";
        this.radius = radius;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.triangle = new Path.RegularPolygon({
            center: new Point(x, y),
            sides: 3,
            radius: this.radius,
            fillColor: this.team,
            strokeColor: "black",
            strokeWidth: 2
        });
        this.master = master;
        this.flipped = flip;
        if (this.flipped) {
            this.triangle.rotation = 180;
        }
        this.selected = false;
        this.x = x;
        this.y = y;
        this.triangle.node = this;
        this.triangle.onMouseDown = function(event) {
            if (isTouch(event)) {
                this.node.master.touchDown = this;
            }
        }
        this.triangle.onMouseUp = function(event) {
            if ((isTouch(event) || event.event.button == 0) && this.contains(event.point)) {
                if (isTouch(event) && (master.touchDown != this)) {
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
                    this.node.hoverLeave();
            }
        };
        this.triangle.onMouseEnter = function(event) {
            this.node.hoverEnter();

        };
        this.triangle.onMouseLeave = function(event) {
            this.node.hoverLeave();

        };
    }
    select() {
        this.selected = true;
        this.triangle.strokeWidth = 5;
        if (master.selected != "") {
            for (node of master.getNodes(master.selected.xIndex, master.selected.yIndex)) {
                node.deselect();
            }
        }
        master.select(this);
        for (node of master.getNodes(master.selected.xIndex, master.selected.yIndex)) {
            node.triangle.strokeWidth = 5;
            node.selected = true;
        }
    }

    deselect() {
        this.selected = false;
        this.triangle.strokeWidth = 2;
        if (master.selected.xIndex == this.xIndex && master.selected.yIndex == this.yIndex) {
            for (node of master.getNodes(master.selected.xIndex, master.selected.yIndex)) {
                node.triangle.strokeWidth = 2;
                node.selected = false;
            }
            master.select("");
        }
    }

    hoverEnter() {
        if (!this.marked) {
            this.triangle.fillColor -= 0.25;
        }
    }

    hoverLeave() {
        if (!this.marked) {
            this.triangle.fillColor += 0.25;
        }
    }
}
//init
master.triGrid = new Array(width);
for (var i = 0; i < width; i++) {
    master.triGrid[i] = new Array(height);
    for (var j = 0; j < height; j++) {
        master.triGrid[i][j] = [];
    }
}

var triList = [];

//render triangles
for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
        //center
        var node = new TriNode(
            radius * i,
            5 + rheight * j,
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);

        //left
        node = new TriNode(
            radius * i - (radius * width),
            5 + rheight * j,
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);

        //right
        node = new TriNode(
            radius * i + (radius * width),
            5 + rheight * j,
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);

        //top
        node = new TriNode(
            radius * i,
            5 + rheight * j - (rheight * height),
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);

        //top right
        node = new TriNode(
            radius * i + (radius * width),
            5 + rheight * j - (rheight * height),
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);

        //top left
        node = new TriNode(
            radius * i - (radius * width),
            5 + rheight * j - (rheight * height),
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);

        //bottom
        node = new TriNode(
            radius * i,
            5 + rheight * j + (rheight * height),
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);

        //bottom right
        node = new TriNode(
            radius * i + (radius * width),
            5 + rheight * j + (rheight * height),
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);

        //bottom left
        node = new TriNode(
            radius * i - (radius * width),
            5 + rheight * j + (rheight * height),
            flip, master, radius, i, j);
        master.triGrid[i][j].push(node);
        triList.push(node);
        if (j < 3) {
            //bottom x2
            node = new TriNode(
                radius * i,
                5 + rheight * j + 2 * (rheight * height),
                flip, master, radius, i, j);
            master.triGrid[i][j].push(node);
            triList.push(node);

            //bottom x2 right
            node = new TriNode(
                radius * i + (radius * width),
                5 + rheight * j + 2 * (rheight * height),
                flip, master, radius, i, j);
            master.triGrid[i][j].push(node);
            triList.push(node);

            //bottom x2 left
            node = new TriNode(
                radius * i - (radius * width),
                5 + rheight * j + 2 * (rheight * height),
                flip, master, radius, i, j);
            master.triGrid[i][j].push(node);
            triList.push(node);
        }
        if (i > width - 2) {

            //left x2
            node = new TriNode(
                radius * i - 2 * (radius * width),
                5 + rheight * j,
                flip, master, radius, i, j);
            master.triGrid[i][j].push(node);
            triList.push(node);

            //bottom left x2
            node = new TriNode(
                radius * i - 2 * (radius * width),
                5 + rheight * j + (rheight * height),
                flip, master, radius, i, j);
            master.triGrid[i][j].push(node);
            triList.push(node);

            //top left x2
            node = new TriNode(
                radius * i - 2 * (radius * width),
                5 + rheight * j - (rheight * height),
                flip, master, radius, i, j);
            master.triGrid[i][j].push(node);
            triList.push(node);

        }

        flip = !flip;

    }
    flip = !flip;
}
menuGroup.bringToFront();
var startCorner = view.bounds.point;

view.onMouseDown = function(event) {
    if (event.event.button == 2) {
        event.stopPropagation();
        view.dragging = true;
    }
}
view.onMouseUp = function(event) {
    if (event.event.button == 2) {
        event.stopPropagation();
        view.dragging = false;
    }
}
view.onMouseDrag = function(event) {
    var dragScale = 2.2;
    if (view.dragging || (isTouch(event) && event.event.touches.length == 2)) {
        view.center += event.delta / dragScale;
        rect.position += event.delta / dragScale;
        menuGroup.position += event.delta / dragScale;
        //too far right
        if (startCorner.x - view.bounds.point.x > radius * width) {
            var correction = radius * width;
            for (tri of triList) {
                tri.triangle.translate(new Point(-correction, 0));
            }
            startCorner.x = view.bounds.point.x;
        }
        //too far left
        if (startCorner.x - view.bounds.point.x < -radius * width) {
            var correction = radius * width;
            for (tri of triList) {
                tri.triangle.translate(new Point(correction, 0));
            }
            startCorner.x = view.bounds.point.x;
        }
        //too far up
        if (startCorner.y - view.bounds.point.y > rheight * height) {
            var correction = rheight * height;
            for (tri of triList) {
                tri.triangle.translate(new Point(0, -correction));
            }
            startCorner.y = view.bounds.point.y;
        }
        //too far down
        if (startCorner.y - view.bounds.point.y < -rheight * height) {
            var correction = rheight * height;
            for (tri of triList) {
                tri.triangle.translate(new Point(0, correction));
            }
            startCorner.y = view.bounds.point.y;
        }
    }
}
view.onMouseLeave = function(event) {
    if (view.dragging) {
        view.dragging = false;
    }
}
view.onKeyDown = function(event) {
    if (event.key == "w" || event.key == "s" || event.key == "a" || event.key == "d") {
        if (!view.dragging) view.dragging = true;
        var transform = new Point(0, 0);
        if (event.key == "w") {
            transform = new Point(0, -10);
        }
        if (event.key == "s") {
            transform = new Point(0, 10);
        }
        if (event.key == "a") {
            transform = new Point(-10, 0);
        }
        if (event.key == "d") {
            transform = new Point(10, 0);
        }
        event.delta = transform;
        view.onMouseDrag(event);
    }
}

master.processMove = new function() {
    
}