(function() {
var camera, scene, renderer, geometry, material, mesh, controls, raycaster, cannon;
var objects = [];

var blocker = document.getElementById("blocker");
var instructions = document.getElementById("instructions");

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;

if (havePointerLock) {
    var element = document.body;

    var pointerlockchange = function (event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = "none";
        } else {
            controls.enabled = false;
            blocker.style.display = "-webkit-box";
            blocker.style.display = "-moz-box";
            blocker.style.display = "box";
            instructions.style.display = "";
        }
    }
    
    var pointerlockerror = function ( event ) {
        instructions.style.display = "";
    }
    
    document.addEventListener( "pointerlockchange", pointerlockchange, false );
    document.addEventListener( "mozpointerlockchange", pointerlockchange, false );
    document.addEventListener( "webkitpointerlockchange", pointerlockchange, false );

    document.addEventListener( "pointerlockerror", pointerlockerror, false );
    document.addEventListener( "mozpointerlockerror", pointerlockerror, false );
    document.addEventListener( "webkitpointerlockerror", pointerlockerror, false );

    instructions.addEventListener( "click", function ( event ) {
        instructions.style.display = "none";
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {
            var fullscreenchange = function ( event ) {
                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
                    document.removeEventListener( "fullscreenchange", fullscreenchange );
                    document.removeEventListener( "mozfullscreenchange", fullscreenchange );
                    element.requestPointerLock();
                }
            }

            document.addEventListener( "fullscreenchange", fullscreenchange, false );
            document.addEventListener( "mozfullscreenchange", fullscreenchange, false );
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();
        } else {
            element.requestPointerLock();
        }
    }, false );
} else {
    instructions.innerHTML = "Your browser doesn\"t seem to support Pointer Lock API";
}

init();
animate();

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 750);

    scene.add(new THREE.AmbientLight(0x505050));

    var light = new THREE.SpotLight(0x505050, 1.5);
    light.position.set(0, 500, 2000);
    light.castShadow = true;
    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;
    light.shadowBias = -0.00022;
    light.shadowDarkness = 0.5;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    scene.add(light);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    var onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
            case 87: // up
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true; break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
        }
    };

    var onKeyUp = function(event) {
        switch(event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

    // floor
    geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    for (var i = 0, l = geometry.faces.length; i < l; i ++) {
        var face = geometry.faces[i];
        face.color = new THREE.Color().setHSL(rand(0.25, 0.35), rand(0.7, 0.8), rand(0.5, 0.6));
    }

    material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // stars maybe
    geometry = new THREE.IcosahedronGeometry();
    material = new THREE.MeshBasicMaterial({color: 0xdfdfdf});
    
    for (var xpos = 0; xpos < 50; xpos++) {
        for (var ypos = 0; ypos < 50; ypos++) {
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = rand(-1000, 1000);
            mesh.position.y = 200;
            mesh.position.z = rand(-1000, 1000);
            scene.add(mesh);
        }
    }
    
    // cannon
    console.log("about to load cannon model");
    var loader = new THREE.JSONLoader();
    loader.load("models/cannon.json", function(geometry) {
        console.log("loaded json");
        var cannon_mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading, overdraw: 0.5}));
        scene.add(cannon_mesh);
        cannon_mesh.y = 50;
    });

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );

    if (controlsEnabled) {
        // cannon stuff
        if (typeof cannon !== "undefined") {
            var camobj = controls.getObject();
            cannon.position.x = camobj.position.x;
            cannon.position.z = camobj.position.z;
            cannon.rotation.x = camobj.rotation.x;
            cannon.rotation.y = camobj.rotation.y;
            cannon.rotation.z = camobj.rotation.z;
        }
        
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if (moveForward) velocity.z -= 400.0 * delta;
        if (moveBackward) velocity.z += 400.0 * delta;
        if (moveLeft) velocity.x -= 400.0 * delta;
        if (moveRight) velocity.x += 400.0 * delta;

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
        }

        prevTime = time;
    }

    renderer.render( scene, camera );
}
}).call(this);
