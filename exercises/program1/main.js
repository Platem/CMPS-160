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
		a_Color,
		segments = [],
		active_segment_set = -1,
		mouse_point = {
			x: 0.0,
			y: 0.0,
			z: 0.0
		},
		active_random = false;

function main() {
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}

	// Mouse press event
	canvas.onmousedown = function(event) {
		event.preventDefault();
		if (!active_random) {
			click(event);
		}
	};

	// Mouse move event
	canvas.onmousemove = function(event) {
		event.preventDefault();
		if (!active_random) {
			move(event);
		}
	};

	// Disable context menu
	canvas.oncontextmenu = function(event) {
		return false;
	}
}

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
			coords.e = newPoint(coords, false);
			console.log("Left click detected at [", coords.x, ", ", coords.y, "].");
			break;
		case 2:
			// Right click, blue point
			coords.e = newPoint(coords, true);
			console.log("Right click detected at [", coords.x, ", ", coords.y, "].");
			break;
		default:
			break;
	}

	// If the point ends a polyline print it
	if (coords.e) {
		let str = 'Polyline ended. Points are: ',
				i = 0;
		for (i; i < segments[segments.length - 1].points.length - 1; i++) {
			str += '[' + segments[segments.length - 1].points[i].x + ', ' + segments[segments.length - 1].points[i].y + '], ';
		}
		str += '[' + segments[segments.length - 1].points[i].x + ', ' + segments[segments.length - 1].points[i].y + '].';

		console.log(str);
	}

	// Draw
	draw();
}

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

function newPoint(coords, ends) {
	let first = false;
	// If no active polyline
	if (active_segment_set === -1) {
		// Add new polyline and set active
		segments.push({
			ended: false,
			points: []
		});
		active_segment_set = segments.length - 1;
		first = true;
	}

	// Red by default
	let color = {
		R: 1.0,
		G: 0.0,
		B: 0.0
	}
	// If first or last change to blue
	if (ends || first) {
		color.R = 0.0,
		color.B = 1.0
	}

	// Add point to polyline
	segments[active_segment_set].points.push({
		x: coords.x,
		y: coords.y,
		z: coords.z,
		c: color
	});

	// If last point of polyline
	if (ends && !first) {
		// Finish polyline and set no active one
		segments[active_segment_set].ended = true;
		active_segment_set = -1;
	}

	// Return true if it was an ending point
	return (ends && !first);
}

function drawPolyline(segment_set) {
	// Retrieve vertex set, color set and count
	let vertex_set = [];
	let lines_set = [];
	let vertex_count;
	let lines_count;

	for (vertex_count = 0; vertex_count < segment_set.points.length; vertex_count++) {
		// Vertex and color
		vertex_set.push(segment_set.points[vertex_count].x);
		vertex_set.push(segment_set.points[vertex_count].y);
		vertex_set.push(segment_set.points[vertex_count].z);
		vertex_set.push(segment_set.points[vertex_count].c.R);
		vertex_set.push(segment_set.points[vertex_count].c.G);
		vertex_set.push(segment_set.points[vertex_count].c.B);

		// Lines and grey
		lines_set.push(segment_set.points[vertex_count].x);
		lines_set.push(segment_set.points[vertex_count].y);
		lines_set.push(segment_set.points[vertex_count].z);
		lines_set.push(0.8);
		lines_set.push(0.8);
		lines_set.push(0.8);
	}
	lines_count = vertex_count;

	if (vertex_count > 0) {
		// If polyline is not finished
		if (!segment_set.ended) {
			// Add mouse location
			lines_set.push(mouse_point.x);
			lines_set.push(mouse_point.y);
			lines_set.push(mouse_point.z);
			lines_set.push(0.0);
			lines_set.push(1.0);
			lines_set.push(0.0);
			lines_count++;
		}

		// Write vertex into buffer
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines_set), gl.STATIC_DRAW);

		// Draw lines
		gl.drawArrays(gl.LINE_STRIP, 0, lines_count);

		// Write vertex into buffer
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_set), gl.STATIC_DRAW);
	  
		// Draw points
		gl.drawArrays(gl.POINTS, 0, vertex_count);
	}

	return vertex_count
}

function drawCylinders(segment_set) {
	let circles = calculateCylinders(segment_set);

	// Circles
	for (let i = 0; i < circles.length; i++) {
		let circle_set = [];
		let circle_set_index = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

		for (let j = 0; j < circles[i].length; j++) {
			circle_set.push(circles[i][circle_set_index[j]].x);
			circle_set.push(circles[i][circle_set_index[j]].y);
			circle_set.push(circles[i][circle_set_index[j]].z);
			circle_set.push(1.0);
			circle_set.push(0.0);
			circle_set.push(0.6);
		}

	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circle_set), gl.STATIC_DRAW);
		gl.drawArrays(gl.POINTS, 0, circle_set.length / 6);
	}

	// Lines between circles
	for (let i = 0; i < circles.length - 1; i++) {
		for (let j = 0; j < circles[i].length - 1; j++) {
			let lines_set = [];

			// First
			lines_set.push(circles[i][j].x);
			lines_set.push(circles[i][j].y);
			lines_set.push(circles[i][j].z);
			lines_set.push(0.6);
			lines_set.push(0.0);
			lines_set.push(1.0);

			// Second
			lines_set.push(circles[i][j + 1].x);
			lines_set.push(circles[i][j + 1].y);
			lines_set.push(circles[i][j + 1].z);
			lines_set.push(0.6);
			lines_set.push(0.0);
			lines_set.push(1.0);

			// Third
			lines_set.push(circles[i + 1][j + 1].x);
			lines_set.push(circles[i + 1][j + 1].y);
			lines_set.push(circles[i + 1][j + 1].z);
			lines_set.push(0.6);
			lines_set.push(0.0);
			lines_set.push(1.0);

			// Forth
			lines_set.push(circles[i + 1][j].x);
			lines_set.push(circles[i + 1][j].y);
			lines_set.push(circles[i + 1][j].z);
			lines_set.push(0.6);
			lines_set.push(0.0);
			lines_set.push(1.0);

			// Draw
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines_set), gl.STATIC_DRAW);
			gl.drawArrays(gl.LINE_LOOP, 0, lines_set.length / 6);
		}
	}
}

function calculateCylinders(segment_set) {
	let circles = [];

	for (let i = 0; i < segment_set.points.length - 1; i++) {
		// Get p1
		let p1 = {
			x: segment_set.points[i].x,
			y: segment_set.points[i].y,
			z: segment_set.points[i].z
		};

		// Get p2
		let p2 = {
			x: segment_set.points[i + 1].x,
			y: segment_set.points[i + 1].y,
			z: segment_set.points[i + 1].z
		};

		// Get vector from p1 to p2
		let v = [
			p2.x - p1.x,
			p2.y - p1.y,
			p2.z - p1.z
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
											 RADIUS * (Math.cos(angle) * u1[2] + Math.sin(angle) * u2[2])]
			circle1.push({
				x: p1.x + direction[0],
				y: p1.y + direction[1],
				z: p1.z + direction[2]
			});

			circle2.push({
				x: p2.x + direction[0],
				y: p2.y + direction[1],
				z: p2.z + direction[2]
			});
		}

		circles.push(circle1);
		circles.push(circle2);
	}

	return circles;
}

function draw() {
	// Draw each polyline
	for (let i = 0; i < segments.length; i++) {
		drawPolyline(segments[i]);
		drawCylinders(segments[i]);
	}

	return segments.length;
}

function startRandom() {
	console.log("Starting random points.")

	// Set first point to start
	mouse_point.x = (Math.random().toFixed(2) * 2) - 1;
	mouse_point.y = (Math.random().toFixed(2) * 2) - 1;

	// Start loop
	active_random = setInterval( function() {
		// Right click or left click
		let right = !(Math.random() < 0.7); // true if random number >= 0.7
		// Log it
		if (right) {
			console.log("Right click detected at [", mouse_point.x, ", ", mouse_point.y, "].");
		} else {
			console.log("Left click detected at [", mouse_point.x, ", ", mouse_point.y, "].");
		}

		// Add the point. Does it finish a polyline?
		let ends = newPoint({
			x: mouse_point.x,
			y: mouse_point.y,
			z: 0.0
		}, right);

		// If it ends print it.
		if (ends) {
			let str = 'Polyline ended. Points are: ',
					i = 0;
			for (i; i < segments[segments.length - 1].points.length - 1; i++) {
				str += '[' + segments[segments.length - 1].points[i].x + ', ' + segments[segments.length - 1].points[i].y + '], ';
			}
			str += '[' + segments[segments.length - 1].points[i].x + ', ' + segments[segments.length - 1].points[i].y + '].';

			console.log(str);
		}

		// Always draw
		draw();

		// Save the point
		let previous_mouse_point = {
			x: mouse_point.x,
			y: mouse_point.y,
			z: mouse_point.z
		};
		//console.log("Previous mouse point: ", previous_mouse_point);

		// Set a new point
		let next_mouse_point = {
			x: (Math.random().toFixed(2) * 2) - 1,
			y: (Math.random().toFixed(2) * 2) - 1,
			z: 0.0
		};
		//console.log("Next mouse point: ", next_mouse_point);

		// Calculate the difference
		let diff = {
			x: next_mouse_point.x - mouse_point.x,
			y: next_mouse_point.y - mouse_point.y,
			z: next_mouse_point.z - mouse_point.z
		};
		//console.log("diff: ", diff);
		
		// We will move the mouse 1000 points between them
		for (let j = 1; j < 500; j++) {
			setTimeout(function() {
				// Move the mouse
				mouse_point.x = previous_mouse_point.x + (diff.x / 500) * j;
				mouse_point.y = previous_mouse_point.y + (diff.y / 500) * j;

				// Draw it
				draw();
			}, 10);
		}

		// Update mouse to real point
		mouse_point.x = next_mouse_point.x;
		mouse_point.y = next_mouse_point.y;

	}, 500);

	document.getElementById('rdstart').disabled = true;
	document.getElementById('rdstop').disabled = false;
}

function stopRandom() {
	console.log("Stoping random points.")

	clearInterval(active_random);
	active_random = false;

	document.getElementById('rdstart').disabled = false;
	document.getElementById('rdstop').disabled = true;
}

function clearCanvas() {
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

function getAngledAndPerpendicular(angled, angle, perpendicular, length) {
	let a = angle * Math.PI / 180;
	let a_length = Math.sqrt( Math.pow(angled[0], 2) + Math.pow([1], 2) + Math.pow([2], 2) );

}

function dotProduct(v1, v2) {
	return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function crossProduct(v1, v2) {
	return [(v1[1] * v2[2] - v2[1] * v1[2]), -(v1[0] * v2[2] - v2[0] * v1[2]), (v1[0] * v2[1] - v2[0] * v1[1])];
}

function vectorMagnitude(v) {
	let s = 0;

	for (let i = 0; i < v.length; i++) {
		s += Math.pow(v[i], 2);
	}

	return Math.sqrt(s);
}
