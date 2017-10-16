// Vertex shader program
let VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'attribute vec4 a_Color;\n' +
	'varying vec4 v_Color;\n' +
	'void main() {\n' +
	'  gl_Position = a_Position;\n' +
	'  v_Color = a_Color;\n' +
	'  gl_PointSize = 5.0;\n' +
	'}\n';

// Fragment shader program
let FSHADER_SOURCE =
	'precision mediump float;\n' +
	'varying vec4 v_Color;\n' +
	'void main() {\n' +
	'  gl_FragColor = v_Color;\n' +
	'}\n';

// Program vars
const FLOAT_BYTES = 4,
	RADIUS = 0.1,
	ROTATION = 10;

let canvas,
	gl,
	a_Position,
	a_Color;

let objects = [],
	active_object = -1,
	mouse_point = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	},
	draw_normals = false;

// Main function
function main() {
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}

	document.getElementById('bRotateL').onclick = function(event) {
		event.preventDefault();
		rotate("left");
	};

	document.getElementById('bRotateR').onclick = function(event) {
		event.preventDefault();
		rotate("right");
	};

	// Mouse press event
	canvas.onmousedown = function(event) {
		event.preventDefault();
		click(event);
	};

	// Mouse move event
	canvas.onmousemove = function(event) {
		event.preventDefault();
		move(event);
	};

	// Disable context menu
	canvas.oncontextmenu = function(event) {
		return false;
	}

	// Draw normals toggler
	document.getElementById('bNormals').addEventListener('click', function(e) {
		e.preventDefault();
		draw_normals ? draw_normals = false : draw_normals = true;
		document.getElementById('circle').classList.toggle('active');
		draw();
	});

	// Setup ioSOR
	setupIOSOR('fOpen');
	document.getElementById('fOpen').addEventListener('change', function(e) {
		document.getElementById('fLoad').disabled = false;
	});

	document.getElementById('fSave').addEventListener('click', function(e) {
		e.preventDefault();
		saveSOR2();
	});

	document.getElementById('fLoad').addEventListener('click', function(e) {
		e.preventDefault();
		readSOR2();
	});
}

// Setup WebGL function
function setup() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return false;
	}

	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return false;
	}

	// Init vertex Buffer
	let vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create the vertex buffer object');
		return false;
	}

	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return false;
	}

	// Assign buffer to a_Position variable
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FLOAT_BYTES * 6, 0);
	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	// Get the storage location of a_Color
	a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if (a_Color < 0) {
		console.log('Failed to get the storage location of a_Color');
		return false;
	}

	// Assign buffer to a_Color variable
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FLOAT_BYTES * 6, FLOAT_BYTES * 3);
	// Enable the assignment to a_Color variable
	gl.enableVertexAttribArray(a_Color);

	// Specify the color for clearing <canvas>
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Everything OK
	return true;
}

function readSOR2() {
	let SORCollection = readFile2();

	for (let i = 0; i < SORCollection.length; i++) {
		let vertices = SORCollection[i].vertices;
		let indexes = SORCollection[i].indexes;

		if (vertices.length % (12 * 3) != 0) {
			alert('Selected file doesn\'t match vertices (points) format in [' + SORCollection[i].name + '] object. There should be groups of 12 points, each group forming a circle.');
		} else if (indexes.length % (4 * 3) != 0) {
			alert('Selected file doesn\'t match indexes (faces) format in [' + SORCollection[i].name + '] object. There should be groups of 4 points, each group forming a face.');
		} else {
			let v = [],
				l = [];

			for (let j = 0; j < vertices.length; j += 3) {
				v.push(vertices[j]);
				v.push(vertices[j + 1]);
				v.push(vertices[j + 2]);
				v.push(0.0);
				v.push(0.0);
				v.push(1.0);
			}

			// Write vertices into buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

			// Draw points
			gl.drawArrays(gl.POINTS, 0, v.length / 6);

			for (let j = 0; j < indexes.length; j += 12) {
				// Point 1
				l.push(indexes[j]);
				l.push(indexes[j + 1]);
				l.push(indexes[j + 2]);
				l.push(0.0);
				l.push(1.0);
				l.push(0.0);

				// Point 2
				l.push(indexes[j + 3]);
				l.push(indexes[j + 4]);
				l.push(indexes[j + 5]);
				l.push(0.0);
				l.push(1.0);
				l.push(0.0);

				// Point 2
				l.push(indexes[j + 6]);
				l.push(indexes[j + 7]);
				l.push(indexes[j + 8]);
				l.push(0.0);
				l.push(1.0);
				l.push(0.0);

				// Point 2
				l.push(indexes[j + 9]);
				l.push(indexes[j + 10]);
				l.push(indexes[j + 11]);
				l.push(0.0);
				l.push(1.0);
				l.push(0.0);
			}

			// Write vertices into buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(l), gl.STATIC_DRAW);

			// Draw points
			gl.drawArrays(gl.LINE_STRIP, 0, l.length / 6);
		}
	}
}

function readSOR() {
	let objSOR = readFile();
	let vertices = objSOR.vertices;
	let indexes = objSOR.indexes;
	if (vertices.length % (12 * 3) != 0) {
		alert('Selected file doesn\'t match vertices (points) format. There should be groups of 12 points, each group forming a circle.');
	} else if (indexes.length % (4 * 3) != 0) {
		alert('Selected file doesn\'t match indexes (faces) format. There should be groups of 4 points, each group forming a face.');
	} else {
		let v = [],
			l = [];
		for (let i = 0; i < vertices.length; i += 3) {
			v.push(vertices[i]);
			v.push(vertices[i + 1]);
			v.push(vertices[i + 2]);
			v.push(0.0);
			v.push(0.0);
			v.push(1.0);
		}
		// Write vertices into buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

		// Draw points
		gl.drawArrays(gl.POINTS, 0, v.length / 6);

		for (let i = 0; i < indexes.length; i += 12) {
			// Point 1
			l.push(indexes[i]);
			l.push(indexes[i + 1]);
			l.push(indexes[i + 2]);
			l.push(0.0);
			l.push(1.0);
			l.push(0.0);

			// Point 2
			l.push(indexes[i + 3]);
			l.push(indexes[i + 4]);
			l.push(indexes[i + 5]);
			l.push(0.0);
			l.push(1.0);
			l.push(0.0);

			// Point 2
			l.push(indexes[i + 6]);
			l.push(indexes[i + 7]);
			l.push(indexes[i + 8]);
			l.push(0.0);
			l.push(1.0);
			l.push(0.0);

			// Point 2
			l.push(indexes[i + 9]);
			l.push(indexes[i + 10]);
			l.push(indexes[i + 11]);
			l.push(0.0);
			l.push(1.0);
			l.push(0.0);
		}
		// Write vertices into buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(l), gl.STATIC_DRAW);

		// Draw points
		gl.drawArrays(gl.LINE_STRIP, 0, l.length / 6);
	}
}

function saveSOR2() {
	SORCollection = [];
	if (objects.length > 0) {
		var name = prompt("Please enter a file name.\n\n[Note that only completed objects will be saved]", "object");
		// Each object
		for (let i = 0; i < objects.length; i++) {
			if (objects[i].ended) {
				let pts = [];
				let inds = [];

				// Push points
				for (let j = 0; j < objects[i].nodes.length; j++) {
					for (let k = 0; k < objects[i].nodes[j].circle.length; k++) {
						pts.push(objects[i].nodes[j].circle[k]);
					}
				}

				// Push indexes
				for (let j = 1; j < objects[i].nodes.length; j++) {
					for (let k = 0; k < objects[i].nodes[j].circle.length; k++) {
						if (k == objects[i].nodes[j].circle.length - 1) {
							inds.push(objects[i].nodes[j].circle[k]);
							inds.push(objects[i].nodes[j - 1].circle[k]);
							inds.push(objects[i].nodes[j - 1].circle[0]);
							inds.push(objects[i].nodes[j].circle[0]);
							inds.push(objects[i].nodes[j].circle[k]);
						} else {
							inds.push(objects[i].nodes[j].circle[k]);
							inds.push(objects[i].nodes[j - 1].circle[k]);
							inds.push(objects[i].nodes[j - 1].circle[k + 1]);
							inds.push(objects[i].nodes[j].circle[k + 1]);
							inds.push(objects[i].nodes[j].circle[k]);
						}
					}
				}

				// Create SOR
				let sor = new SOR(name + '_' + i, [], []);
				for (let j = 0; j < pts.length; j++) {
					sor.vertices.push(pts[j].x);
					sor.vertices.push(pts[j].y);
					sor.vertices.push(pts[j].z);
				}

				for (let j = 0; j < inds.length; j++) {
					sor.indexes.push(inds[j].x);
					sor.indexes.push(inds[j].y);
					sor.indexes.push(inds[j].z);
				}
				SORCollection.push(sor);
			}
		}

		saveFile2(SORCollection, name);
	} else {
		alert('There aren\'t any objects to be saved. Be sure you draw something and you complete it (right click).');
	}
}

function saveSOR() {
	if (objects.length > 0 && objects[0].ended) {
		var name = prompt("Please enter a name.\n\n[Note that only the first drawn object will be saved]", "object");
		let pts = [];
		let ind = []
		for (let i = 0; i < objects[0].nodes.length; i++) {
			for (let j = 0; j < objects[0].nodes[i].circle.length; j++) {
				pts.push(objects[0].nodes[i].circle[j]);
			}
		}
		for (let i = 0; i < objects[0].nodes.length - 1; i++) {
			for (let j = 0; j < objects[0].nodes[i].circle.length; j++) {
				if (j == objects[0].nodes[i].circle.length - 1) {
					ind.push(objects[0].nodes[i].circle[j]);
					ind.push(objects[0].nodes[i].circle[0]);
					ind.push(objects[0].nodes[i + 1].circle[0]);
					ind.push(objects[0].nodes[i + 1].circle[j]);
				} else {
					ind.push(objects[0].nodes[i].circle[j]);
					ind.push(objects[0].nodes[i].circle[j + 1]);
					ind.push(objects[0].nodes[i + 1].circle[j + 1]);
					ind.push(objects[0].nodes[i + 1].circle[j]);
				}
			}
		}

		let sor = new SOR(name, [], []);
		for (let i = 0; i < pts.length; i++) {
			sor.vertices.push(pts[i].x);
			sor.vertices.push(pts[i].y);
			sor.vertices.push(pts[i].z);
		}
		for (let i = 0; i < ind.length; i++) {
			sor.indexes.push(ind[i].x);
			sor.indexes.push(ind[i].y);
			sor.indexes.push(ind[i].z);
		}

		saveFile(sor);
	} else {
		alert('There\'s no object to be saved. Be sure you draw something and you complete it (right click).');
	}
}

// Main draw function
function draw() {
	// Draw each polyline
	for (let i = 0; i < objects.length; i++) {
		if (objects[i].ended) {
			drawObject(objects[i]);
		} else {
			drawLine(objects[i]);
		}
	}

	return objects.length;
}

// Rotates all points
function rotate(side) {
	let oldObjects = objects.splice();

	let M = new Matrix4();
	if (side == "right")
		M.setRotate(ROTATION, 0, 1, 0);
	else if (side == "left")
		M.setRotate(-(ROTATION), 0, 1, 0);
	else
		M.setRotate(0, 0, 1, 0);

	for (let i = 0; i < objects.length; i++) {
		for (let j = 0; j < objects[i].nodes.length; j++) {
			// Transform point
			objects[i].nodes[j].point.x =
				objects[i].nodes[j].point.x * M.elements[0] +
				objects[i].nodes[j].point.y * M.elements[4] +
				objects[i].nodes[j].point.z * M.elements[8] +
				M.elements[12];

			objects[i].nodes[j].point.y =
				objects[i].nodes[j].point.x * M.elements[1] +
				objects[i].nodes[j].point.y * M.elements[5] +
				objects[i].nodes[j].point.z * M.elements[9] +
				M.elements[13];

			objects[i].nodes[j].point.z =
				objects[i].nodes[j].point.x * M.elements[2] +
				objects[i].nodes[j].point.y * M.elements[6] +
				objects[i].nodes[j].point.z * M.elements[10] +
				M.elements[14];

			// Transfrom circle
			for (let k = 0; k < objects[i].nodes[j].circle.length; k++) {
				objects[i].nodes[j].circle[k].x =
					objects[i].nodes[j].circle[k].x * M.elements[0] +
					objects[i].nodes[j].circle[k].y * M.elements[4] +
					objects[i].nodes[j].circle[k].z * M.elements[8] +
					M.elements[12];

				objects[i].nodes[j].circle[k].y =
					objects[i].nodes[j].circle[k].x * M.elements[1] +
					objects[i].nodes[j].circle[k].y * M.elements[5] +
					objects[i].nodes[j].circle[k].z * M.elements[9] +
					M.elements[13];

				objects[i].nodes[j].circle[k].z =
					objects[i].nodes[j].circle[k].x * M.elements[2] +
					objects[i].nodes[j].circle[k].y * M.elements[6] +
					objects[i].nodes[j].circle[k].z * M.elements[10] +
					M.elements[14];
			}
		}
	}

	draw();
}

// Event handler for mouse click
function click(event) {
	let coords = {};

	// Mouse coordinates
	let x_mouse = event.clientX;
	let y_mouse = event.clientY;

	// Canvas positioning
	let rect = event.target.getBoundingClientRect();

	// Draw coordinates
	coords.x = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width / 2);
	coords.y = (canvas.height / 2 - (y_mouse - rect.top)) / (canvas.height / 2);
	coords.z = 0.0;

	// Which button was pressed?
	switch (event.button) {
		case 0:
			// Left click, red point
			coords.e = newNode(coords, false);
			// console.log("Left click detected at [", coords.x, ", ", coords.y, "].");
			break;
		case 2:
			// Right click, blue point
			coords.e = newNode(coords, true);
			// console.log("Right click detected at [", coords.x, ", ", coords.y, "].");
			break;
		default:
			break;
	}

	// If the point ends a polyline print it
	// if (coords.e) {
	// 	let str = 'Object ended. Points are: ',
	// 			i = 0;
	// 	for (i; i < objects[objects.length - 1].nodes.length - 1; i++) {
	// 		str += '[' + objects[objects.length - 1].nodes[i].point.x + ', ' + objects[objects.length - 1].nodes[i].point.y + '], ';
	// 	}
	// 	str += '[' + objects[objects.length - 1].nodes[i].point.x + ', ' + objects[objects.length - 1].nodes[i].point.y + '].';

	// 	console.log(str);
	// }

	// Draw
	draw();
}

// Event handler for mouse move
function move(event) {
	// Mouse coordinates
	let x_mouse = event.clientX;
	let y_mouse = event.clientY;

	// Canvas positioning
	let rect = event.target.getBoundingClientRect();

	// Draw coordinates
	mouse_point.x = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width / 2);
	mouse_point.y = (canvas.height / 2 - (y_mouse - rect.top)) / (canvas.height / 2);

	// Draw
	draw();
}

// Insert new node into active object or create new object
function newNode(coords, ends) {
	let first = false;

	// Check if there's an active object
	if (active_object === -1) {
		objects.push({
			ended: false,
			nodes: [],
			g_points: [],
			g_indexes: []
		});

		active_object = objects.length - 1;
		first = true;
	}

	// Create point
	let point = new Coord(coords.x, coords.y, coords.z, 1.0, 0.0, 0.0);
	// Push to object
	objects[active_object].nodes.push(new Node(point));

	// If last point of object
	if (ends && !first) {
		// Set as finished
		objects[active_object].ended = true;

		// Generate GC
		generateCylinder(objects[active_object]);

		active_object = -1;
	}

	return (ends && !first);
}

// Draws a line
function drawLine(obj) {
	// Draw object nodes (points)
	let node_vertices = [];
	for (let i = 0; i < obj.nodes.length; i++) {
		node_vertices.push(obj.nodes[i].point.x);
		node_vertices.push(obj.nodes[i].point.y);
		node_vertices.push(obj.nodes[i].point.z);
		node_vertices.push(obj.nodes[i].point.r);
		node_vertices.push(obj.nodes[i].point.g);
		node_vertices.push(obj.nodes[i].point.b);
	}

	// Write vertices into buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(node_vertices), gl.STATIC_DRAW);

	// Draw points
	gl.drawArrays(gl.POINTS, 0, node_vertices.length / 6);

	// Draw lines and rubberband
	node_vertices = [];
	for (let i = 0; i < obj.nodes.length; i++) {
		node_vertices.push(obj.nodes[i].point.x);
		node_vertices.push(obj.nodes[i].point.y);
		node_vertices.push(obj.nodes[i].point.z);
		node_vertices.push(0.6);
		node_vertices.push(0.6);
		node_vertices.push(0.6);
	}
	node_vertices.push(mouse_point.x);
	node_vertices.push(mouse_point.y);
	node_vertices.push(mouse_point.z);
	node_vertices.push(0.0);
	node_vertices.push(1.0);
	node_vertices.push(0.0);

	// Write vertices into buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(node_vertices), gl.STATIC_DRAW);

	// Draw lines
	gl.drawArrays(gl.LINE_STRIP, 0, node_vertices.length / 6);
}

// Draws an object
function drawObject(obj) {
	for (let i = 1; i < obj.nodes.length; i++) {
		for (let j = 0; j < obj.nodes[i].circle.length; j++) {
			let vertices = [];
			if (j == obj.nodes[i].circle.length - 1) {
				// First
				vertices.push(obj.nodes[i].circle[j].x);
				vertices.push(obj.nodes[i].circle[j].y);
				vertices.push(obj.nodes[i].circle[j].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Second
				vertices.push(obj.nodes[i - 1].circle[j].x);
				vertices.push(obj.nodes[i - 1].circle[j].y);
				vertices.push(obj.nodes[i - 1].circle[j].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				if (draw_normals) {
					// Second colored
					vertices.push(obj.nodes[i - 1].circle[j].x);
					vertices.push(obj.nodes[i - 1].circle[j].y);
					vertices.push(obj.nodes[i - 1].circle[j].z);
					vertices.push(1.0);
					vertices.push(0.75);
					vertices.push(0.79);
					// Get normal vector
					let pA = obj.nodes[i - 1].circle[j],
						pB = obj.nodes[i - 1].circle[0],
						pC = obj.nodes[i].circle[j];

					let v = [pB.x - pA.x, pB.y - pA.y, pB.z - pB.z];
					let w = [pC.x - pA.x, pC.y - pA.y, pB.z - pC.z];

					let n = crossProduct(v, w);

					// Push point
					vertices.push(pA.x - n[0]*2);
					vertices.push(pA.y - n[1]*2);
					vertices.push(pA.z - n[2]*2);
					vertices.push(1.0);
					vertices.push(0.75);
					vertices.push(0.79);

					// Second colored
					vertices.push(obj.nodes[i - 1].circle[j].x);
					vertices.push(obj.nodes[i - 1].circle[j].y);
					vertices.push(obj.nodes[i - 1].circle[j].z);
					vertices.push(1.0);
					vertices.push(0.75);
					vertices.push(0.79);

					// Back to second
					vertices.push(obj.nodes[i - 1].circle[j].x);
					vertices.push(obj.nodes[i - 1].circle[j].y);
					vertices.push(obj.nodes[i - 1].circle[j].z);
					vertices.push(0.0);
					vertices.push(1.0);
					vertices.push(0.0);
				}

				// Third
				vertices.push(obj.nodes[i - 1].circle[0].x);
				vertices.push(obj.nodes[i - 1].circle[0].y);
				vertices.push(obj.nodes[i - 1].circle[0].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Fourth
				vertices.push(obj.nodes[i].circle[0].x);
				vertices.push(obj.nodes[i].circle[0].y);
				vertices.push(obj.nodes[i].circle[0].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

			} else {
				// First
				vertices.push(obj.nodes[i].circle[j].x);
				vertices.push(obj.nodes[i].circle[j].y);
				vertices.push(obj.nodes[i].circle[j].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Second
				vertices.push(obj.nodes[i - 1].circle[j].x);
				vertices.push(obj.nodes[i - 1].circle[j].y);
				vertices.push(obj.nodes[i - 1].circle[j].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				if (draw_normals) { 
					// Second colored
					vertices.push(obj.nodes[i - 1].circle[j].x);
					vertices.push(obj.nodes[i - 1].circle[j].y);
					vertices.push(obj.nodes[i - 1].circle[j].z);
					vertices.push(1.0);
					vertices.push(0.75);
					vertices.push(0.79);

					// Get normal vector
					let pA = obj.nodes[i - 1].circle[j],
						pB = obj.nodes[i - 1].circle[j + 1],
						pC = obj.nodes[i].circle[j];

					let v = [pB.x - pA.x, pB.y - pA.y, pB.z - pB.z];
					let w = [pC.x - pA.x, pC.y - pA.y, pB.z - pC.z];

					let n = crossProduct(v, w);

					// Push point
					vertices.push(pA.x - n[0]*2);
					vertices.push(pA.y - n[1]*2);
					vertices.push(pA.z - n[2]*2);
					vertices.push(1.0);
					vertices.push(0.75);
					vertices.push(0.79);

					// Second colored
					vertices.push(obj.nodes[i - 1].circle[j].x);
					vertices.push(obj.nodes[i - 1].circle[j].y);
					vertices.push(obj.nodes[i - 1].circle[j].z);
					vertices.push(1.0);
					vertices.push(0.75);
					vertices.push(0.79);

					// Back to second
					vertices.push(obj.nodes[i - 1].circle[j].x);
					vertices.push(obj.nodes[i - 1].circle[j].y);
					vertices.push(obj.nodes[i - 1].circle[j].z);
					vertices.push(0.0);
					vertices.push(1.0);
					vertices.push(0.0);
				}

				// Third
				vertices.push(obj.nodes[i - 1].circle[j + 1].x);
				vertices.push(obj.nodes[i - 1].circle[j + 1].y);
				vertices.push(obj.nodes[i - 1].circle[j + 1].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Fourth
				vertices.push(obj.nodes[i].circle[j + 1].x);
				vertices.push(obj.nodes[i].circle[j + 1].y);
				vertices.push(obj.nodes[i].circle[j + 1].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

			}

			// Write vertex into buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

			// Draw points
			gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 6);
		}
	}

	// Draw object nodes (circles)
	for (let i = 0; i < obj.nodes.length; i++) {
		let mid_vertices = [];
		// Draw mid circle
		for (let j = 0; j < obj.nodes[i].circle.length; j++) {
			mid_vertices.push(obj.nodes[i].circle[j].x);
			mid_vertices.push(obj.nodes[i].circle[j].y);
			mid_vertices.push(obj.nodes[i].circle[j].z);
			mid_vertices.push(obj.nodes[i].circle[j].r);
			mid_vertices.push(obj.nodes[i].circle[j].g);
			mid_vertices.push(obj.nodes[i].circle[j].b);
		}

		// Write vertices into buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mid_vertices), gl.STATIC_DRAW);

		// Draw points
		gl.drawArrays(gl.POINTS, 0, mid_vertices.length / 6);

		// Draw lines
		gl.drawArrays(gl.LINE_LOOP, 0, mid_vertices.length / 6);
	}
}

// Generate Cylinder
function generateCylinder(obj) {
	// Each node (starting from the second one)
	for (let i = 1; i < obj.nodes.length; i++) {
		if (i == 1) {
			// It's the second one, just generate the first one circle
			obj.nodes[i - 1].circle = generateCircles(obj.nodes[i - 1], obj.nodes[i]).circle1;
		} else {
			// It's third or more, generate previous circle having in mind current circle and 2 previous
			let A = obj.nodes[i - 2],
				B = obj.nodes[i - 1],
				C = obj.nodes[i];

			// Get cylinder (circles) related to each line
			let circleAB = generateCircles(A, B).circle1;
			let circleBC = generateCircles(B, C).circle1;

			// Get directions
			let dirAB = [B.point.x - A.point.x,
				B.point.y - A.point.y,
				B.point.z - A.point.z
			];

			let dirBC = [C.point.x - B.point.x,
				C.point.y - B.point.y,
				C.point.z - B.point.z
			];

			let mid = [];

			// For each point
			for (let j = 0; j < circleAB.length; j++) {
				// Get points in edges
				let pA = circleAB[j];
				let pC = circleBC[j];

				let dirCA = [pA.x - pC.x,
					pA.y - pC.y,
					pA.z - pC.z
				];

				/* 			pB = pA + dirAB * h1
				 * 			pB = pC + dirBC * h2 			(h2 < 0)
				 *
				 * 			--					      --   --  --   --       --
				 * 			|-dirAB.x 	dirBC.x| · | h1 | = | dirCA.x |
				 * 			|-dirAB.y 	dirBC.y|	 | h2 |   | dirCA.y |
				 * 			--					      --   --  --   --       --
				 *
				 *      |dirCA.x 		dirBC.x|						 |-dirAB.x 		dirCA.x|
				 *      |dirCA.y 		dirBC.y|						 |-dirAB.y 		dirCA.y|
				 * x = ----------------------, 			y = ----------------------
				 *      |-dirAB.x 	dirBC.x|						 |-dirAB.x 		dirBC.x|
				 *      |-dirAB.y 	dirBC.y|						 |-dirAB.y 		dirBC.y|
				 *
				 * x = det1 / detA , y = det2 / detA
				 */
				let det1 = (dirCA[0] * dirBC[1]) - (dirCA[1] * dirBC[0]);
				let det2 = (-dirAB[0] * dirCA[1]) - (-dirAB[1] * dirCA[0]);
				let detA = (-dirAB[0] * dirBC[1]) - (-dirAB[1] * dirBC[0]);

				let h1 = det1 / detA;
				let h2 = det2 / detA;

				let pB = [pA.x + dirAB[0] * h1,
					pA.y + dirAB[1] * h1,
					pA.z + dirAB[2] * h1
				];

				mid.push(new Coord(pB[0], pB[1], pB[2], 0.0, 0.0, 1.0));
			}

			// Now we have mid circle
			obj.nodes[i - 1].circle = mid;
		}
	}

	// Generate last circle
	let circle = generateCircles(obj.nodes[obj.nodes.length - 2], obj.nodes[obj.nodes.length - 1]).circle2;
	obj.nodes[obj.nodes.length - 1].circle = circle;
}

// Generate circle with center in n1 perpendicular to n1->n2
function generateCircles(n1, n2) {
	// Get p1
	let p1 = n1.point;

	// Get p2
	let p2 = n2.point;

	// Get vector from p1 to p2
	let v = [p2.x - p1.x,
		p2.y - p1.y,
		p2.z - p1.z,
		0.0,
		0.0,
		0.0
	];

	// Calculate normal vector
	let n = getPerpendicular(v, RADIUS);

	// Calculate cross vector
	let p = crossProduct(v, n);

	// Get vectors magnitude. Then calculate unit vectors
	let s1 = vectorMagnitude(n),
		s2 = vectorMagnitude(p);

	let u1 = [n[0] / s1, n[1] / s1, n[2] / s1],
		u2 = [p[0] / s2, p[1] / s2, p[2] / s2];

	// Calculate circles
	let circle1 = [],
		circle2 = [];

	for (let i = 0; i < 360; i += 30) {
		let angle = i * Math.PI / 180;
		// Calculate vector direction
		let direction = [RADIUS * (Math.cos(angle) * u1[0] + Math.sin(angle) * u2[0]),
			RADIUS * (Math.cos(angle) * u1[1] + Math.sin(angle) * u2[1]),
			RADIUS * (Math.cos(angle) * u1[2] + Math.sin(angle) * u2[2])
		]
		circle1.push(new Coord(p1.x + direction[0], p1.y + direction[1], p1.z + direction[2], 0.0, 0.0, 1.0));
		circle2.push(new Coord(p2.x + direction[0], p2.y + direction[1], p2.z + direction[2], 0.0, 0.0, 1.0));
	}

	return {
		circle1: circle1,
		circle2: circle2
	};
}

// Return perpendicular to a vector with length
function getPerpendicular(vector, length) {
	if (!length)
		length = 1;
	if (vector[0] == 0 && vector[1] == 0) {
		if (vector[2] == 0) {
			// vector is [0, 0, 0]
			return null;
		} else {
			// vector is [0, 0, z]
			return [0, length, 0];
		}
	} else {
		// vector is [x, 0, 0] || [0, y, 0] || [x, y, 0] || [x, 0, z] || [0, y, z] || [x, y, z]
		let l = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
		return [(vector[1] * length) / l, (-vector[0] * length) / l, 0];
	}
}

// Calculate dot product of two vectors
function dotProduct(v1, v2) {

	return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

// Calculate cross product of two vectors
function crossProduct(v1, v2) {

	return [(v1[1] * v2[2] - v2[1] * v1[2]), -(v1[0] * v2[2] - v2[0] * v1[2]), (v1[0] * v2[1] - v2[0] * v1[1])];
}

// Calculate magnitude of vector
function vectorMagnitude(v) {
	let s = 0;

	for (let i = 0; i < v.length; i++) {
		s += Math.pow(v[i], 2);
	}

	return Math.sqrt(s);
}

// Clear canvas
function clearCanvas() {
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Coord object
function Coord(x, y, z, r, g, b) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.r = r;
	this.g = g;
	this.b = b;
}

// Node object
function Node(coord) {
	this.point = coord;
	this.circle = null;
}