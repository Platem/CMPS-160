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
			RADIUS = 0.1;

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
		};

// Main function
function main() {
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}

	document.getElementById('bRotateL').onclick = function(event) {
		event.preventDefault();
		// rotate("left");
	};

	document.getElementById('bRotateR').onclick = function(event) {
		event.preventDefault();
		// rotate("right");
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
	a_Color = gl.getUniformLocation(gl.program, 'a_Color');
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

// Main draw function
function draw() {
	// Draw each polyline
	for (let i = 0; i < objects.length; i++) {
		drawObject(objects[i]);
	}

	return objects.length;
}

// Rotates all points
function rotate(side) {
	let M = new Matrix4();
	if (side == "right")
		M.setRotate(10, 0, 1, 0);
	else if (side == "left")
		M.setRotate(-10, 0, 1, 0);
	else
		M.setRotate(0, 0, 1, 0);

	for (let i = 0; i < objects.length; i++) {
		for (let j = 0; j < objects[i].nodes.length; j++) {
			// Transform point
			objects[i].nodes[j].point.x = 
				objects[i].nodes[j].point.x * M.elements[0] + 
				objects[i].nodes[j].point.y * M.elements[4] + 
				objects[i].nodes[j].point.z * M.elements[8] + 
				1 * M.elements[12];

			objects[i].nodes[j].point.y = 
				objects[i].nodes[j].point.x * M.elements[1] + 
				objects[i].nodes[j].point.y * M.elements[5] + 
				objects[i].nodes[j].point.z * M.elements[9] + 
				1 * M.elements[13];

			objects[i].nodes[j].point.z = 
				objects[i].nodes[j].point.x * M.elements[2] + 
				objects[i].nodes[j].point.y * M.elements[6] + 
				objects[i].nodes[j].point.z * M.elements[10] + 
				1 * M.elements[15];

			// Transfrom prevCircle
			if (objects[i].nodes[j].prevCircle) {
				for (let k = 0; k < objects[i].nodes[j].prevCircle.length; k++) {
					// Transform point
					objects[i].nodes[j].prevCircle[k].x = 
						objects[i].nodes[j].prevCircle[k].x * M.elements[0] + 
						objects[i].nodes[j].prevCircle[k].y * M.elements[4] + 
						objects[i].nodes[j].prevCircle[k].z * M.elements[8] + 
						1 * M.elements[12];

					objects[i].nodes[j].prevCircle[k].y = 
						objects[i].nodes[j].prevCircle[k].x * M.elements[1] + 
						objects[i].nodes[j].prevCircle[k].y * M.elements[5] + 
						objects[i].nodes[j].prevCircle[k].z * M.elements[9] + 
						1 * M.elements[13];

					objects[i].nodes[j].prevCircle[k].z = 
						objects[i].nodes[j].prevCircle[k].x * M.elements[2] + 
						objects[i].nodes[j].prevCircle[k].y * M.elements[6] + 
						objects[i].nodes[j].prevCircle[k].z * M.elements[10] + 
						1 * M.elements[15];
				}
			}

			// Transform nextCircle
			if (objects[i].nodes[j].nextCircle) {
				for (let k = 0; k < objects[i].nodes[j].nextCircle.length; k++) {
					// Transform point
					objects[i].nodes[j].nextCircle[k].x = 
						objects[i].nodes[j].nextCircle[k].x * M.elements[0] + 
						objects[i].nodes[j].nextCircle[k].y * M.elements[4] + 
						objects[i].nodes[j].nextCircle[k].z * M.elements[8] + 
						1 * M.elements[12];

					objects[i].nodes[j].nextCircle[k].y = 
						objects[i].nodes[j].nextCircle[k].x * M.elements[1] + 
						objects[i].nodes[j].nextCircle[k].y * M.elements[5] + 
						objects[i].nodes[j].nextCircle[k].z * M.elements[9] + 
						1 * M.elements[13];

					objects[i].nodes[j].nextCircle[k].z = 
						objects[i].nodes[j].nextCircle[k].x * M.elements[2] + 
						objects[i].nodes[j].nextCircle[k].y * M.elements[6] + 
						objects[i].nodes[j].nextCircle[k].z * M.elements[10] + 
						1 * M.elements[15];
				}
			}
		}
	}

	console.log("Rotate " + side);
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
	coords.x = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width  / 2);
	coords.y = (canvas.height / 2 - (y_mouse - rect.top)) / (canvas.height / 2);
	coords.z = 0.0;

	// Which button was pressed?
	switch (event.button) {
		case 0:
			// Left click, red point
			coords.e = newNode(coords, false);
			console.log("Left click detected at [", coords.x, ", ", coords.y, "].");
			break;
		case 2:
			// Right click, blue point
			coords.e = newNode(coords, true);
			console.log("Right click detected at [", coords.x, ", ", coords.y, "].");
			break;
		default:
			break;
	}

	// If the point ends a polyline print it
	if (coords.e) {
		let str = 'Object ended. Points are: ',
				i = 0;
		for (i; i < objects[objects.length - 1].nodes.length - 1; i++) {
			str += '[' + objects[objects.length - 1].nodes[i].point.x + ', ' + objects[objects.length - 1].nodes[i].point.y + '], ';
		}
		str += '[' + objects[objects.length - 1].nodes[i].point.x + ', ' + objects[objects.length - 1].nodes[i].point.y + '].';

		console.log(str);
	}

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
	mouse_point.x = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width  / 2);
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
			nodes: []
		});

		active_object = objects.length - 1;
		first = true;
	}

	// Create point
	let point = new Coord(coords.x, coords.y, coords.z, 1.0, 0.0, 0.0);
	// Push to object
	objects[active_object].nodes.push(new Node(point));

	// If is not first, calculate the previous node nextCircle and the current node prevCircle
	if (!first) {
		let index = objects[active_object].nodes.length - 1;
		let prev = objects[active_object].nodes[index - 1];
		let curr = objects[active_object].nodes[index];

		let circles = generateCircles(prev, curr);

		objects[active_object].nodes[index - 1].nextCircle = circles.circle1;
		objects[active_object].nodes[index].prevCircle = circles.circle2;
	}

	// If last point of object
	if (ends && !first) {
		objects[active_object].ended = true;
		active_object = -1;
	}

	return (ends && !first);
}

// Draws an object
function drawObject(obj) {
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

	// Draw object nodes (circles)
	for (let i = 0; i < obj.nodes.length; i++) {

		// If has previous node
		if (obj.nodes[i].prevCircle) {
			// Draw circle points
			let prev_vertices = [];

			for (let j = 0; j < obj.nodes[i].prevCircle.length; j++) {
				prev_vertices.push(obj.nodes[i].prevCircle[j].x);
				prev_vertices.push(obj.nodes[i].prevCircle[j].y);
				prev_vertices.push(obj.nodes[i].prevCircle[j].z);
				prev_vertices.push(obj.nodes[i].prevCircle[j].r);
				prev_vertices.push(obj.nodes[i].prevCircle[j].g);
				prev_vertices.push(obj.nodes[i].prevCircle[j].b);
			}

			// Write vertices into buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(prev_vertices), gl.STATIC_DRAW);

			// Draw points
			gl.drawArrays(gl.POINTS, 0, prev_vertices.length / 6);

			// Draw lines
			gl.drawArrays(gl.LINE_LOOP, 0, prev_vertices.length / 6);

			// And draw skeleton to previous
			for (let j = 0; j < obj.nodes[i].prevCircle.length - 1; j++) {
				let vertices = [];

				// First
				vertices.push(obj.nodes[i].prevCircle[j].x);
				vertices.push(obj.nodes[i].prevCircle[j].y);
				vertices.push(obj.nodes[i].prevCircle[j].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Second
				vertices.push(obj.nodes[i - 1].nextCircle[j].x);
				vertices.push(obj.nodes[i - 1].nextCircle[j].y);
				vertices.push(obj.nodes[i - 1].nextCircle[j].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Third
				vertices.push(obj.nodes[i - 1].nextCircle[j + 1].x);
				vertices.push(obj.nodes[i - 1].nextCircle[j + 1].y);
				vertices.push(obj.nodes[i - 1].nextCircle[j + 1].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Fourth
				vertices.push(obj.nodes[i].prevCircle[j + 1].x);
				vertices.push(obj.nodes[i].prevCircle[j + 1].y);
				vertices.push(obj.nodes[i].prevCircle[j + 1].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Write vertex into buffer
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			  
				// Draw points
				gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 6);
			}
		}

		// If has next node
		if (obj.nodes[i].nextCircle) {
			let next_vertices = [];

			for (let j = 0; j < obj.nodes[i].nextCircle.length; j++) {
				next_vertices.push(obj.nodes[i].nextCircle[j].x);
				next_vertices.push(obj.nodes[i].nextCircle[j].y);
				next_vertices.push(obj.nodes[i].nextCircle[j].z);
				next_vertices.push(obj.nodes[i].nextCircle[j].r);
				next_vertices.push(obj.nodes[i].nextCircle[j].g);
				next_vertices.push(obj.nodes[i].nextCircle[j].b);
			}

			// Write vertices into buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(next_vertices), gl.STATIC_DRAW);

			// Draw lines
			gl.drawArrays(gl.POINTS, 0, next_vertices.length / 6);
			
			// Draw lines
			gl.drawArrays(gl.LINE_LOOP, 0, next_vertices.length / 6);
		}

		// If has both draw cylinder between both circles 
		if (obj.nodes[i].prevCircle && obj.nodes[i].nextCircle) {
			for (let j = 0; j < obj.nodes[i].prevCircle.length - 1; j++) {
				let vertices = [];

				// First
				vertices.push(obj.nodes[i].prevCircle[j].x);
				vertices.push(obj.nodes[i].prevCircle[j].y);
				vertices.push(obj.nodes[i].prevCircle[j].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Second
				vertices.push(obj.nodes[i].prevCircle[j + 1].x);
				vertices.push(obj.nodes[i].prevCircle[j + 1].y);
				vertices.push(obj.nodes[i].prevCircle[j + 1].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Third
				vertices.push(obj.nodes[i].nextCircle[j + 1].x);
				vertices.push(obj.nodes[i].nextCircle[j + 1].y);
				vertices.push(obj.nodes[i].nextCircle[j + 1].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Fourth
				vertices.push(obj.nodes[i].nextCircle[j].x);
				vertices.push(obj.nodes[i].nextCircle[j].y);
				vertices.push(obj.nodes[i].nextCircle[j].z);
				vertices.push(0.0);
				vertices.push(1.0);
				vertices.push(0.0);

				// Write vertex into buffer
			  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			  
				// Draw points
				gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 6);
			}
		}
	}
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
					 0.0];

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
										 RADIUS * (Math.cos(angle) * u1[2] + Math.sin(angle) * u2[2])]
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
	this.nextCircle = null;
	this.prevCircle = null;
}
