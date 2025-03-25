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

// add light
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);


/*============================================================
GET USER INPUT AND TRANSLATE TO THREE.JS GEOMETRY FUNCTIONS
============================================================*/


// get user input on input change
var userInput = document.getElementById("userinput");
userInput.addEventListener("input", updateUserInput);
function updateUserInput() {
	clearScene(scene);
	parseAndDraw(userInput.value);
};

// parsing
function parseAndDraw(input) {
	const lines = input.trim().split('\n');
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
					const lineCoords = coords.split(',').map(coord => coord.trim());
					drawLinestring(...lineCoords);
					break;
				case 'POLYGON Z':
					const polygonCoords = coords.replace(/[()]/g, '').split(',').map(coord => coord.trim());
					drawPolygon(...polygonCoords);
					break;
				case 'POLYHEDRALSURFACE Z':
					const polyhedronCoords = coords.split('),').map(mesh => mesh.trim().replace(/[()]/g, ''));
					polyhedronCoords.forEach(mesh => drawMesh(...mesh.split(',').map(coord => coord.trim())));
					break;
				case 'TIN Z':
					const tinCoords = coords.split('),').map(mesh => mesh.trim().replace(/[()]/g, ''));
					tinCoords.forEach(mesh => drawMesh(...mesh.split(',').map(coord => coord.trim())));
					break;
				default:
					alert("Unknown type");
			}
		}
	});
}


/*============================================================
CREATING GEOMETRIES FUNCTIONS
============================================================*/


// point
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
	const material = new THREE.PointsMaterial({color:0xff0000, size:.2});
	const geometry = new THREE.BufferGeometry().setFromPoints([point]);
	const pointObject = new THREE.Points(geometry, material);
	scene.add(pointObject);
}
drawPoint("1 2 2");

// linestring
function drawLinestring(...points) {
	if (points.length < 2) {
		console.error("You need at least 2 points to draw a line.");
		return;
	}
	points = points.map(p => {
		const coords = p.split(' ').map(Number);
		return new THREE.Vector3(coords[0], coords[1], coords[2]);
	});
	const geometry = new THREE.BufferGeometry().setFromPoints(points);
	const material = new THREE.LineBasicMaterial({color: 0xffff00});
	const line = new THREE.Line(geometry, material);
	scene.add(line);
}
drawLinestring("3 1 0","1 3 2","4 4 1");

// polygon
function drawPolygon(...points) {
	if (points.length < 3) {
		alert("You need at least 3 points to draw a polygon.");
		return;
	}
	const shape = new THREE.Shape();
	points = points.map(p => {
	  const coords = p.split(' ').map(Number);
	  return new THREE.Vector3(coords[0], coords[1], coords[2]);
	});
	shape.moveTo(points[0].x, points[0].y);
	for (let i = 1; i < points.length; i++) {
	  shape.lineTo(points[i].x, points[i].y);
	}
	shape.closePath();
	const geometry = new THREE.ShapeGeometry(shape);
	const material = new THREE.MeshBasicMaterial({color:0x999999, side:THREE.DoubleSide});
	const polygon = new THREE.Mesh(geometry, material);
	scene.add(polygon);
}
drawPolygon("0 2 0","2 2 0","2 4 0","0 2 0");

// polyhedral surface / tin
function drawMesh(...faces) {
    const parseVertices = (str) => {
        return str.split(',').map(v => {
            const coords = v.trim().split(' ').map(Number);
            return new THREE.Vector3(...coords);
        });
    };
    const geometry = new THREE.Geometry();
    let faceOffset = 0;
    faces.forEach(face => {
        const verticesArray = parseVertices(face);
        geometry.vertices.push(...verticesArray);
        for (let i = 1; i < verticesArray.length - 1; i++) {
            geometry.faces.push(new THREE.Face3(
                faceOffset, faceOffset + i, faceOffset + i + 1
            ));
        }
        faceOffset += verticesArray.length;
    });
    const material = new THREE.MeshLambertMaterial({color:0xff00ff, side:THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}
drawMesh("0 0 0, 2 0 0, 2 2 0, 0 0 0","0 0 0, 0 1 0, 1 0 0, 0 0 0","0 0 0, 1 0 0, 0 0 1, 0 0 0","0 0 0, 0 0 1, 0 1 0, 0 0 0","1 0 0, 0 1 0, 0 0 1, 1 0 0");


/*============================================================
OTHER
============================================================*/


// keyboard control
document.onkeypress = function (e) {
	if (!(document.activeElement === userInput)) {
		//alert(event.which);
		switch(event.which) {
			case 111: goToOrigin(); break; // c
			case 103: toggleGrid(); break; // g
			default: return;
		}
	}
};
// go to origin
function goToOrigin() {
	camera.lookAt(scene.position);
    controls.target.set(0, 0, 0);
}
// toggle grid/axes
let gridVisible = true;
function toggleGrid() {
	gridVisible = !gridVisible; // Umkehren des Sichtbarkeitsstatus
	grid.visible = gridVisible;
	axesHelper.visible = gridVisible;
}

// remove all objects in scene
function clearScene(scene) {
    while (scene.children.length > 0) {
        const object = scene.children[0];
        if (object !== grid && object !== axesHelper) {
			if (object.geometry) object.geometry.dispose();
			if (object.material) {
				if (Array.isArray(object.material)) {
					object.material.forEach(mat => mat.dispose());
				} else {
					object.material.dispose();
				}
			}
			scene.remove(object);
		}
        /* if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose());
            } else {
                object.material.dispose();
            }
        } */
        scene.remove(object);
    }
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