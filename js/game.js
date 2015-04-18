var FOV = 75;
var CANVAS_SIZE = {get width(){return window.innerWidth}, get height(){return window.innerHeight}};
var RATIO = {get ratio() {return CANVAS_SIZE.width / CANVAS_SIZE.height}};
var CLIP = {near: 0.1, far: 1000};
var INPUT = {A: false, W: false, S: false, D: false};
var MOUSE = {x: 0.0, y: 0.0, delta: {x: 0, y: 0}, fresh: false};

// create a scene
var scene = new THREE.Scene();
// create a camera; FOV, aspect ratio, near clip, far clip
var camera = new THREE.PerspectiveCamera(FOV, RATIO.ratio, CLIP.near, CLIP.far);

// create a renderer
var renderer = new THREE.WebGLRenderer();
// duh
renderer.setSize(CANVAS_SIZE.width, CANVAS_SIZE.height);
// add the canvas to the DOM
document.body.appendChild(renderer.domElement);

// geometry
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x008800 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// lighting
var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
light.position.set(0.5, 1, 0.75);
scene.add(light);

camera.position.z = 5;

// window resize handling
function resize() {
    camera.aspect = RATIO.ratio;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

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

// render looooooooop
function render() {
	requestAnimationFrame( render );
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    if (INPUT.A)
        camera.position.x -= 0.1;
    
    if (INPUT.W)
        camera.position.z -= 0.1;
    
    if (INPUT.D)
        camera.position.x += 0.1;
    
    if (INPUT.S)
        camera.position.z += 0.1;
    
    if (MOUSE.fresh) {
        camera.lo
    }
    
	renderer.render( scene, camera );
    MOUSE.fresh = false;
}

// begin input processing
// modern browsers
if (typeof window.addEventListener !== "undefined") {
    window.addEventListener("keydown", keydown, false);
    window.addEventListener("keyup", keyup, false);
    window.addEventListener("mousemove", mousemove, false);
    window.addEventListener("resize", resize, false );
// ie <= 8
} else if (typeof window.attachEvent !== "undefined") {
    window.attachEvent("onkeydown", keydown);
    window.attachEvent("onkeyup", keydown);
    window.attachEvent("onmousemove", keydown);
    window.addEventListener("onresize", resize, false );
}

// begin render loop
render();
