var FOV = 75;
var CANVAS_SIZE = {get width(){return window.innerWidth}, get height(){return window.innerHeight}};
var RATIO = {get ratio() {return CANVAS_SIZE.width / CANVAS_SIZE.height}};
var CLIP = {near: 0.1, far: 1000};

// create a scene
var scene = new THREE.Scene();
// create a camera; FOV, aspect ratio, near clip, far clip
var camera = new THREE.PerspectiveCamera(FOV, RATIO.ratio, CLIP.near, CLIP.far);
camera.position.z = 5;

// create a renderer
var renderer = new THREE.WebGLRenderer();
// duh
renderer.setSize(CANVAS_SIZE.width, CANVAS_SIZE.height);
// add the canvas to the DOM
document.body.appendChild(renderer.domElement);

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
