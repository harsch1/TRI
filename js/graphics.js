var radius = 50;
var rwidth = 50;
var rheight = rwidth * 1.6;
var flip = true;
var keyScrollSpeed = 20;
var red = new Color("#ff0000");
paper.blue = new Color(74 / 255, 169 / 255, 247 / 255, 1);


paper.isTouch = function(event) {
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

//init

var triList = [];

//render triangles
for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
        //center
        var node = new TriNode(paper, i, j);
        var gNode = new TriNodeG(
            rwidth * i,
            5 + rheight * j,
            flip, paper, radius, node);
        paper.nodeGrid[i][j] = node;
        paper.triGrid[i][j].push(gNode)
        triList.push(gNode);

        //left
        gNode = new TriNodeG(
            rwidth * i - (rwidth * width),
            5 + rheight * j,
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //right
        gNode = new TriNodeG(
            rwidth * i + (rwidth * width),
            5 + rheight * j,
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //top
        gNode = new TriNodeG(
            rwidth * i,
            5 + rheight * j - (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //top right
        gNode = new TriNodeG(
            rwidth * i + (rwidth * width),
            5 + rheight * j - (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //top left
        gNode = new TriNodeG(
            rwidth * i - (rwidth * width),
            5 + rheight * j - (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //bottom
        gNode = new TriNodeG(
            rwidth * i,
            5 + rheight * j + (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //bottom right
        gNode = new TriNodeG(
            rwidth * i + (rwidth * width),
            5 + rheight * j + (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);

        //bottom left
        gNode = new TriNodeG(
            rwidth * i - (rwidth * width),
            5 + rheight * j + (rheight * height),
            flip, paper, radius, node);
        paper.triGrid[i][j].push(gNode);
        triList.push(gNode);
        if (j < 3) {
            //bottom x2
            gNode = new TriNodeG(
                rwidth * i,
                5 + rheight * j + 2 * (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

            //bottom x2 right
            gNode = new TriNodeG(
                rwidth * i + (rwidth * width),
                5 + rheight * j + 2 * (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

            //bottom x2 left
            gNode = new TriNodeG(
                rwidth * i - (rwidth * width),
                5 + rheight * j + 2 * (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);
        }
        if (i > width - 2) {

            //left x2
            gNode = new TriNodeG(
                rwidth * i - 2 * (rwidth * width),
                5 + rheight * j,
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

            //bottom left x2
            gNode = new TriNodeG(
                rwidth * i - 2 * (rwidth * width),
                5 + rheight * j + (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

            //top left x2
            gNode = new TriNodeG(
                rwidth * i - 2 * (rwidth * width),
                5 + rheight * j - (rheight * height),
                flip, paper, radius, node);
            paper.triGrid[i][j].push(gNode);
            triList.push(gNode);

        }

        flip = !flip;

    }
    flip = !flip;
}
paper.menuGroup.bringToFront();
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
    if (view.dragging || (paper.isTouch(event) && event.event.touches.length == 2)) {
        view.center += event.delta / dragScale;
        rect.position += event.delta / dragScale;
        paper.menuGroup.position += event.delta / dragScale;
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
            transform = new Point(0, -1*keyScrollSpeed);
        }
        if (event.key == "s") {
            transform = new Point(0, keyScrollSpeed);
        }
        if (event.key == "a") {
            transform = new Point(-1*keyScrollSpeed, 0);
        }
        if (event.key == "d") {
            transform = new Point(keyScrollSpeed, 0);
        }
        event.delta = transform;
        view.onMouseDrag(event);
    }
}