
var enabledColor = "#d6d6d6";
var disabledColor = "#666666";
paper.turnColor = 'red';
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
    if (submitButton.hoverable && !paper.isTouch(event)) {
        submitButton.fillColor -= 0.1;
    }
};
submitButton.onMouseLeave = function(event) {
    if (submitButton.hoverable && !paper.isTouch(event)) {
        submitButton.fillColor = enabledColor;
    }
    if (paper.isTouch(event) && submitButton.touchDown) {
        submitButton.touchDown = false;
        submitButton.fillColor = enabledColor;
    }
};
submitButton.onMouseDown = function(event) {
    if (submitButton.hoverable) {
        submitButton.fillColor += 0.15;
    }
    if (paper.isTouch(event)) {
        submitButton.touchDown = true;
    }
};
submitButton.onMouseUp = function(event) {
    if (submitButton.hoverable) {
        if (paper.isTouch(event)) {
            if (!submitButton.touchDown) {
                return;
            } else {
                submitButton.touchDown = false;
            }
        }
        submitButton.fillColor = enabledColor;
        paper.processMove();
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
paper.turnMarker.fillColor = paper.turnColor;
paper.menuGroup = new Group([menu, menuText, submitButton, submitText, paper.turnMarker]);

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