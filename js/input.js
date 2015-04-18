var INPUT = {A: false, W: false, S: false, D: false};
var MOUSE = {x: 0.0, y: 0.0, delta: {x: 0, y: 0}, fresh: false};

// input loop
function keydown(event) {
    event = event || window.event;
    var key = event.keyCode || event.which;

    switch (key) {
        case 65:
            INPUT.A = true;
            break;
        case 87:
            INPUT.W = true;
            break;
        case 68:
            INPUT.D = true;
            break;
        case 83:
            INPUT.S = true;
            break;
    }
}

function keyup(event) {
    event = event || window.event;
    var key = event.keyCode || event.which;

    switch (key) {
        case 65:
            INPUT.A = false;
            break;
        case 87:
            INPUT.W = false;
            break;
        case 68:
            INPUT.D = false;
            break;
        case 83:
            INPUT.S = false;
            break;
    }
}

function mousemove(event) {
    event = event || window.event;
    event.preventDefault();
    
    var newx = event.clientX / CANVAS_SIZE.width;
    var newy = event.clientY / CANVAS_SIZE.height;
    
    MOUSE.delta.x = newx - MOUSE.x;
    MOUSE.delta.y = newy - MOUSE.y;
    MOUSE.x = newx;
    MOUSE.y = newy;
    MOUSE.fresh = true;
}

// begin input processing
// modern browsers
if (typeof window.addEventListener !== "undefined") {
    window.addEventListener("keydown", keydown, false);
    window.addEventListener("keyup", keyup, false);
    window.addEventListener("mousemove", mousemove, false);
// ie <= 8
} else if (typeof window.attachEvent !== "undefined") {
    window.attachEvent("onkeydown", keydown);
    window.attachEvent("onkeyup", keydown);
    window.attachEvent("onmousemove", keydown);
}
