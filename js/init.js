var FOV = 75;
var CANVAS_SIZE = {get width(){return window.innerWidth}, get height(){return window.innerHeight}};
var RATIO = {get ratio() {return CANVAS_SIZE.width / CANVAS_SIZE.height}};
var CLIP = {near: 0.1, far: 1000};

// debug
var debugelement = document.querySelector("#debug");

// helper methods
function trace(text) {
    if (typeof text === "string") {
        debugelement.innerHTML = text;
    }
}

function round(number) {
    if (typeof number === "number") {
        return number.toFixed(2);
    }
}

function randomGreen() {
    return randomColor();
}

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

// lighting
scene.add( new THREE.AmbientLight( 0x505050 ) );

var light = new THREE.SpotLight( 0xffffff, 1.5 );
light.position.set( 0, 500, 2000 );
light.castShadow = true;

light.shadowCameraNear = 200;
light.shadowCameraFar = camera.far;
light.shadowCameraFov = 50;

light.shadowBias = -0.00022;
light.shadowDarkness = 0.5;

light.shadowMapWidth = 2048;
light.shadowMapHeight = 2048;

scene.add( light );

// window resize handling
function resize() {
    camera.aspect = RATIO.ratio;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// modern browsers
if (typeof window.addEventListener !== "undefined") {
    window.addEventListener("resize", resize, false);
// ie <= 8
} else if (typeof window.attachEvent !== "undefined") {
    window.addEventListener("onresize", resize);
}

function requestRender() {
    requestAnimationFrame(requestRender);
    render();
}

requestRender();
