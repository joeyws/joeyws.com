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

// add group for objects
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

// parsing
/* function parseAndDraw(input) {
    // Füge ein Trennzeichen zwischen den Geometrietypen ein, ohne Zeilenumbrüche.
    const inputWithDelimiters = input.trim().replace(/(\r\n|\n|\t|\r)/gm, "").replace(/(\b(?:POINT|LINESTRING|POLYGON|POLYHEDRALSURFACE|TIN) Z\b)/g,'\n$1');
	alert(inputWithDelimiters);
} */
function parseAndDraw(input) {
    // Entfernen von Leerzeichen und Zeilenumbrüchen an den Rändern und dann in einzelne Befehle aufteilen
    const inputWithDelimiters = input.trim().replace(/(\r\n|\n|\t|\r)/gm, "").replace(/(\b(?:POINT|LINESTRING|POLYGON|POLYHEDRALSURFACE|TIN) Z\b)/g, '\n$1');
    const lines = inputWithDelimiters.split('\n').filter(line => line.trim() !== ''); // Trennt nach den Zeilenumbrüchen und entfernt leere Zeilen
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
					const polyhedralsurfaceMeshCoords = coords.trim().split(")), ((").map(coord => coord.trim().replace(/\(\(/g, "").replace(/\)\)/g, ""));
					polyhedralsurfaceMeshCoords.forEach((element) => drawMesh(element));
                    break;
                case 'TIN Z':
					const tinMeshCoords = coords.trim().split(")), ((").map(coord => coord.trim().replace(/\(\(/g, "").replace(/\)\)/g, ""));
					tinMeshCoords.forEach((element) => drawMesh(element));
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
	group.add(pointObject);
}
//drawPoint("1 2 2");

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
	group.add(line);
}
//drawLinestring("3 1 0","1 3 2","4 4 1");

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
	group.add(polygon);
}
//drawPolygon("0 0 0","2 0 0","2 2 0","0 2 0","0 0 0");

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
    group.add(mesh);
}
//drawMesh("0 0 0, 0 1 0, 1 0 0, 0 0 0","0 0 0, 1 0 0, 0 0 1, 0 0 0","0 0 0, 0 0 1, 0 1 0, 0 0 0","1 0 0, 0 1 0, 0 0 1, 1 0 0");


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

// render
render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}