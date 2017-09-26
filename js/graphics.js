var radius = 50;
var rheight = radius * 1.6;
var flip = true;
var enabledColor = "#d6d6d6";
var disabledColor = "#666666";
var red = new Color("#ff0000");
var blue = new Color(74 / 255, 169 / 255, 247 / 255, 1);


var isTouch = function(event) {
    if (typeof event.event.touches != "undefined") {
        return true;
    } else {
        return false;
    }
};

var rect = new Path.Rectangle({
    point: [0, 0],
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
        fontFamily: "Century Gothic, CenturyGothic, AppleGothic, sans-serif",
        fontWeight: "bold"
    });

    var submitButton = new Path.Rectangle({
        rectangle: new Path.Rectangle({
            point: [790, 550],
            size: [225, 75]
        }),
        radius: new Size(20, 20),
        strokeColor: "grey",
        fillColor: enabledColor,
        strokeWidth: 3,
        hoverable: false,
        touchDown: false
    });
    var submitText = new PointText({
        point: [submitButton.position.x, submitButton.position.y + 10],
        justification: "center",
        fillColor: "grey",
        content: "SUBMIT TURN",
        fontSize: 25,
        fontFamily: "Century Gothic, CenturyGothic, AppleGothic, sans-serif",
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
            submitButton.fillColor = enabledColor;
        }
        if (isTouch(event) && submitButton.touchDown) {
            submitButton.touchDown = false;
            submitButton.fillColor = enabledColor;
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
            submitButton.fillColor = enabledColor;
            processMove();
        }
    };

    paper.turnMarker = new Path.Rectangle({
        rectangle: new Path.Rectangle({
            point: [850, 250],
            size: [74, 75]
        }),
        radius: new Size(20, 20),
        strokeColor: "black",
        strokeWidth: 3
    });
    paper.turnMarker.fillColor = turnColor;
    var menuGroup = new Group([menu, menuText, submitButton, submitText, paper.turnMarker]);
}

touchDown = "";

paper.select = function(x) {
    if (x == "") {
        submitText.fillColor = "grey";
        submitButton.strokeColor = "grey";
        submitButton.fillColor = enabledColor;
        submitButton.hoverable = false;
    } else {
        submitText.fillColor = "black";
        submitButton.strokeColor = "black";
        submitButton.fillColor = enabledColor;
        submitButton.hoverable = true;
    }
    paper.selected = x;
};

//init

var triList = [];

//render triangles
for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
        //center
        var node = new TriNode(paper, i, j);
        var gNode = new TriNodeG(
            radius * i,
            5 + rheight * j,
            flip, paper, radius, node);
        paper.nodeGrid[i][j] = node;
        paper.triGrid[i][j].push(gNode)
        triList.push(gNode);

        //left
        gNode = new TriNodeG(
            radius * i - (radius * width),
            5 + rheight * j,
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //right
        gNode = new TriNodeG(
            radius * i + (radius * width),
            5 + rheight * j,
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //top
        gNode = new TriNodeG(
            radius * i,
            5 + rheight * j - (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //top right
        gNode = new TriNodeG(
            radius * i + (radius * width),
            5 + rheight * j - (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //top left
        gNode = new TriNodeG(
            radius * i - (radius * width),
            5 + rheight * j - (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //bottom
        gNode = new TriNodeG(
            radius * i,
            5 + rheight * j + (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //bottom right
        gNode = new TriNodeG(
            radius * i + (radius * width),
            5 + rheight * j + (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //bottom left
        gNode = new TriNodeG(
            radius * i - (radius * width),
            5 + rheight * j + (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);
        if (j < 3) {
            //bottom x2
            gNode = new TriNodeG(
                radius * i,
                5 + rheight * j + 2 * (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

            //bottom x2 right
            gNode = new TriNodeG(
                radius * i + (radius * width),
                5 + rheight * j + 2 * (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

            //bottom x2 left
            gNode = new TriNodeG(
                radius * i - (radius * width),
                5 + rheight * j + 2 * (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);
        }
        if (i > width - 2) {

            //left x2
            gNode = new TriNodeG(
                radius * i - 2 * (radius * width),
                5 + rheight * j,
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

            //bottom left x2
            gNode = new TriNodeG(
                radius * i - 2 * (radius * width),
                5 + rheight * j + (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

            //top left x2
            gNode = new TriNodeG(
                radius * i - 2 * (radius * width),
                5 + rheight * j - (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

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