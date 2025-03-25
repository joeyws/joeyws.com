/*============================================================
INITIALIZING
============================================================*/


// create full window sized canvas with z-axis pointing up
THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// camera and camera orbit control
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 10, 10);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// add grid on base
var grid = new THREE.GridHelper(10, 10, 0x333333, 0x333333);
grid.geometry.rotateX(Math.PI / 2);
var gridVector = new THREE.Vector3(0, 0, 1);
grid.lookAt(gridVector);
scene.add(grid);

// add origin lines
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


/*============================================================
GET USER INPUT AND TRANSLATE TO THREE.JS GEOMETRY FUNCTIONS
============================================================*/

// get user input on input change
var userInput = document.getElementById("userinput");
userInput.addEventListener("input", updateUserInput);
function updateUserInput() {
	alert("Value changed.");
};

// splitting single wkt geometries and put them into list as an item each
/*

POINT Z	(1 2 2)
LINESTRING Z (3 1 0, 1 3 2, 4 4 1)
POLYGON Z ((0 0 0, 2 0 0, 2 2 0, 0 2 0, 0 0 0))
POLYHEDRALSURFACE Z	(((0 0 0, 0 1 0, 1 0 0, 0 0 0 )),
	((0 0 0, 1 0 0, 0 0 1, 0 0 0 )),
	((0 0 0, 0 0 1, 0 1 0, 0 0 0 )),
	((1 0 0, 0 1 0, 0 0 1, 1 0 0 )))
TIN Z (((0 0 0, 1 0 1, 0 1 2, 0 0 0)),
	((1 0 1, 1 1 2, 0 1 2, 1 0 1)),
	((1 0 1, 2 0 0, 1 1 2, 1 0 1)))


// switch case: translate wkt to functions
for (String s : myStringArray) {
    switch(expression) {
		case point:
			drawPoint(x, y, z);
			break;
		case linestring:
			drawLinestring();
			break;
		case polygon:
			drawPolygon();
			break;
		case polyhedralsurface:
			drawPolyhedralsurface();
			break;
		case tin:
			drawTin();
			break;
	}
}

*/


/*============================================================
CREATING GEOMETRIES FUNCTIONS
============================================================*/


// point
function drawPoint(x, y, z) {

}
var ptGeometry = new THREE.Geometry();
ptGeometry.vertices.push(new THREE.Vector3(1, 1, 2));
var ptMaterial = new THREE.PointsMaterial({size:8, sizeAttenuation:false, color:0xffffff});
var pt = new THREE.Points(ptGeometry, ptMaterial);
scene.add(pt);

// linestring
function drawLinestring() {

}
const lnMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
const lnPoints = [];
lnPoints.push(new THREE.Vector3(3, 1, 0));
lnPoints.push(new THREE.Vector3(1, 3, 2));
lnPoints.push(new THREE.Vector3(4, 4, 1));
const lnGeometry = new THREE.BufferGeometry().setFromPoints(lnPoints);
const ln = new THREE.Line(lnGeometry, lnMaterial);
scene.add(ln);

// polygon
function drawPolygon() {

}
const pgVertices = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, 0, 0),
    new THREE.Vector3(2, 2, 0)
];
const pgGeometry = new THREE.BufferGeometry();
const pgPositions = new Float32Array([
    pgVertices[0].x, pgVertices[0].y, pgVertices[0].z,
    pgVertices[1].x, pgVertices[1].y, pgVertices[1].z,
    pgVertices[2].x, pgVertices[2].y, pgVertices[2].z
]);
pgGeometry.setAttribute('position', new THREE.BufferAttribute(pgPositions, 3));
const pgMaterial = new THREE.MeshBasicMaterial({color:0xffffff});
const pg = new THREE.Mesh(pgGeometry, pgMaterial);
scene.add(pg);

// polyhedralsurface
function drawPolyhedralsurface() {
	// loop, draw single polygons drawPolygon();
}

// tin
function drawTin() {
	// loop, draw single polygons drawPolygon();
}


/*============================================================
OTHER
============================================================*/


// on keypress: add functions
document.onkeypress = function (e) {
	if (!(document.activeElement === userInput)) {
		switch(event.keyCode) {
			case 99: centerScene(); break; // c
			default: return;
		}
	}
};
function centerScene() {
	camera.lookAt(scene.position);
    controls.target.set(0, 0, 0);
}

// focus textarea
//userInput.focus();

// on window resize: resize canvas to full window size
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.updateProjectionMatrix();
}

// render
render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}