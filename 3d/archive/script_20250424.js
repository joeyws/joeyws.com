/*============================================================

INITIALIZING / BUILD SCENE BASICS

============================================================*/


// create full window sized canvas with z-axis pointing up
THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// camera and camera orbit control
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100000);
camera.position.set(0, 16, 16);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// add grid on base
var grid = new THREE.GridHelper(40, 40, 0xffffff, 0xffffff);
grid.material.opacity = 0.15;
grid.material.transparent = true;
grid.geometry.rotateX(Math.PI / 2);
var gridVector = new THREE.Vector3(0, 0, 1);
grid.lookAt(gridVector);
scene.add(grid);

// add origin lines
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// add light
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// add group for user's geometry objects
const group = new THREE.Group();
scene.add(group);


/*============================================================

GET USER INPUT AND TRANSLATE TO THREE.JS GEOMETRY FUNCTIONS

============================================================*/


// get user input on input change
var userInput = document.getElementById("userinput");
userInput.addEventListener("input", updateUserInput);
function updateUserInput() {
	removeObjects(group);
	parseAndDraw(userInput.value);
};
updateUserInput();

// parse: translate input to geometry drawing functions
function parseAndDraw(input) {
    const inputWithDelimiters = input.trim().replace(/(\r\n|\n|\t|\r)/gm, "").replace(/(\b(?:POINT|LINESTRING|POLYGON|POLYHEDRALSURFACE|TIN) Z\b)/g, '\n$1');
    const lines = inputWithDelimiters.split('\n').filter(line => line.trim() !== '');
	lines.forEach(line => {
        const match = line.match(/([A-Za-z]+ Z)\s*\((.*)\)/);
        if (match) {
            const type = match[1].trim();
            const coords = match[2].trim();
            switch (type) {
                case 'POINT Z':
                    const pointCoords = coords;
                    drawPoint(pointCoords);
					break;
                case 'LINESTRING Z':
                    const linestringCoords = coords.split(',').map(coord => coord.trim());
                    drawLinestring(...linestringCoords);
                    break;
                case 'POLYGON Z':
                    const polygonCoords = coords.replace(/[()]/g, '').split(',').map(coord => coord.trim());
                    drawPolygon(...polygonCoords);
					break;
                case 'POLYHEDRALSURFACE Z':
					const polyhedralsurfaceCoords = coords.trim().split(")), ((").map(coord => coord.trim().replace(/\(\(/g, "").replace(/\)\)/g, ""));
					polyhedralsurfaceCoords.forEach((element) => drawMesh(element));
                    break;
                case 'TIN Z':
					const tinCoords = coords.trim().split(")), ((").map(coord => coord.trim().replace(/\(\(/g, "").replace(/\)\)/g, ""));
					tinCoords.forEach((element) => drawMesh(element));
                    break;
                default:
                    alert("Unknown type");
            }
        }
    });
}


/*============================================================

GEOMETRIES FUNCTIONS

============================================================*/


// point
// drawPoint("1 2 2");
function drawPoint(...coordinates) {
	if (coordinates.length !== 1) {
	  console.error("Enter coordinates for point.");
	  return;
	}
	const coords = coordinates[0].split(' ').map(Number);
	if (coords.length !== 3) {
		console.error("A point needs 3 coordinates.");
		return;
	}
	const point = new THREE.Vector3(coords[0], coords[1], coords[2]);
	const material = new THREE.PointsMaterial({color:0xff0000, size:5, sizeAttenuation:false});
	const geometry = new THREE.BufferGeometry().setFromPoints([point]);
	const pointObject = new THREE.Points(geometry, material);
	group.add(pointObject);
}

// linestring
// drawLinestring("3 1 0","1 3 2","4 4 1");
function drawLinestring(...points) {
	points = points.map(p => {
		const coords = p.split(' ').map(Number);
		return new THREE.Vector3(coords[0], coords[1], coords[2]);
	});
	const geometry = new THREE.BufferGeometry().setFromPoints(points);
	const material = new THREE.LineBasicMaterial({color:0xffff00});
	const line = new THREE.Line(geometry, material);
	group.add(line);
}

// polygon
// drawPolygon("0 0 0, 0 1 0, 1 0 0, 0 0 0");
function drawPolygon(...points) {
    const vertices = points.map(point => {
        const [x, y, z] = point.split(' ').map(Number);
        return new THREE.Vector3(x, y, z);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const material = new THREE.LineBasicMaterial({color:0xff00ff});
    const line = new THREE.Line(geometry, material);
    group.add(line);
}

// polyhedron/tin
// drawMesh("0 0 0, 0 1 0, 1 0 0, 0 0 0","0 0 0, 1 0 0, 0 0 1, 0 0 0","0 0 0, 0 0 1, 0 1 0, 0 0 0","1 0 0, 0 1 0, 0 0 1, 1 0 0");
function drawMesh(...polygons) {
	polygons.forEach(polygon => {
		const points = polygon.split(',').map(point => point.trim());
		drawPolygon(...points);
	});
}


/*============================================================

OTHER

============================================================*/


// keyboard control
document.onkeypress = function (e) {
	if (!(document.activeElement === userInput)) {
		//alert(event.which);
		switch(event.which) {
			case 99: centerGeometries(); break; // c
			case 103: toggleGrid(); break; // g
			case 111: goToOrigin(); break; // o
			default: return;
		}
	}
};

// go to origin
function goToOrigin() {
	camera.lookAt(scene.position);
    controls.target.set(0, 0, 0);
}

// go to center of all objects
function centerGeometries() {
	const boundingBox = new THREE.Box3().setFromObject(group);
	const center = new THREE.Vector3();
	boundingBox.getCenter(center);
	const size = new THREE.Vector3();
	boundingBox.getSize(size);
	const maxSize = Math.max(size.x, size.y, size.z);
	const distance = maxSize / (2 * Math.tan(Math.PI * camera.fov / 360));
	camera.position.copy(center).z += distance;
	camera.position.copy(center).y += 2*distance;
	camera.lookAt(center);
	controls.target.copy(center);
}

// toggle grid/axes
let gridVisible = true;
function toggleGrid() {
	gridVisible = !gridVisible;
	grid.visible = gridVisible;
	axesHelper.visible = gridVisible;
}

// remove all objects
function removeObjects(group) {
    while (group.children.length > 0) {
        const child = group.children[0];
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach((mat) => mat.dispose());
            } else {
                child.material.dispose();
            }
        }
        group.remove(child);
    }
}

// on window resize: resize canvas to full window size
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.updateProjectionMatrix();
}

// always render
render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}