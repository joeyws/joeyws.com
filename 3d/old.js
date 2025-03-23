// https://www.youtube.com/watch?v=xJAfLdUgdc4
// init
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);


// origin
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// grid
const gridHelper = new THREE.GridHelper(15, 50);
scene.add(gridHelper);


// add box
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

function animate( ) {
	
	requestAnimationFrame( animate );
	
	yRotation += 0.005;	
	t += 0.001;
	dx = Math.sin( t )	
	xPosition = x0 + dx;	
 	
	model.rotation.y = yRotation;
	
	model.position.x = xPosition;
	model.position.z = zPosition;
		
	renderer.render( scene, camera );
	
}
renderer.render(scene, camera);