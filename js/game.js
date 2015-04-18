// camera init
camera.position.y = 1;
camera.position.z = 5;

// geometry
var geom_box = new THREE.BoxGeometry(1, 1, 1);
var geom_plane = new THREE.PlaneGeometry(2, 2);

// materials
var mat_box = new THREE.MeshLambertMaterial({color: randomColor()});

// meshes
var mesh_cube = new THREE.Mesh(geom_box, mat_box);

for (var i = -40; i < 40; i += 2) {
    for (var o = -40; o < 40; o += 2) {
        var mat_plane = new THREE.MeshBasicMaterial( {color: randomGreen()});
        var mesh_plane = new THREE.Mesh(geom_plane, mat_plane);
        mesh_plane.position.x = i;
        mesh_plane.position.z = o;
        mesh_plane.rotation.x = -(Math.PI / 2);
        scene.add(mesh_plane);
    }
}

// tweaking positions
mesh_cube.position.y += 1;

// add meshes to scene
scene.add(mesh_cube);

// render loop
function render() {
	mesh_cube.rotation.x += 0.01;
    mesh_cube.rotation.y += 0.01;
    
    if (INPUT.A)
        camera.position.x -= 0.1;
    
    if (INPUT.W)
        camera.position.z -= 0.1;
    
    if (INPUT.D)
        camera.position.x += 0.1;
    
    if (INPUT.S)
        camera.position.z += 0.1;
    
    //if (MOUSE.fresh) {
        //camera.lo
    //}
    
    trace("pos: " + round(camera.position.x) + ", " + round(camera.position.y) + ", " + round(camera.position.z));
    
	renderer.render(scene, camera);
    MOUSE.fresh = false;
}
