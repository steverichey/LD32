// geometry
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x008800});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// lighting
//var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
//light.position.set(0.5, 1, 0.75);
//scene.add(light);

// render loop
function render() {
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
    
    //if (MOUSE.fresh) {
        //camera.lo
    //}
    
	renderer.render(scene, camera);
    MOUSE.fresh = false;
}
