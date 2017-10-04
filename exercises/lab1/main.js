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
let canvas,
	gl,
	a_Position,
	a_Color,
	polylines = [],
	active_polyline = -1,
	mouse_point = {
		x: 0.0,
		y: 0.0
	},
	active_random;

function main() {
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}

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
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * 5, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

	// Get the storage location of a_Color
	a_Color = gl.getUniformLocation(gl.program, 'a_Color');
	if (a_Color < 0) {
		console.log('Failed to get the storage location of a_Color');
		return false;
	}

	// Assign buffer to a_Color variable
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 4 * 5, 4 * 2);
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
	if (coords.e) {
		let str = 'Polyline ended. Points are: ',
				i = 0;
		for (i; i < polylines[polylines.length - 1].points.length - 1; i++) {
			str += '[' + polylines[polylines.length - 1].points[i].x + ', ' + polylines[polylines.length - 1].points[i].y + '], ';
		}
		str += '[' + polylines[polylines.length - 1].points[i].x + ', ' + polylines[polylines.length - 1].points[i].y + '].';

		console.log(str);
	}

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
	if (active_polyline === -1) {
		// Add new polyline and set active
		polylines.push({
			ended: false,
			points: []
		});
		active_polyline = polylines.length - 1;
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
	polylines[active_polyline].points.push({
		x: coords.x,
		y: coords.y,
		c: color
	});

	// If last point of polyline
	if (ends && !first) {
		// Finish polyline and set no active one
		polylines[active_polyline].ended = true;
		active_polyline = -1;
	}

	return (ends && !first);
}

function drawPolyline(lineObj) {
	// Retrieve vertex set, color set and count
	let vertex_set = [];
	let lines_set = [];
	let vertex_count;
	let lines_count;

	for (vertex_count = 0; vertex_count < lineObj.points.length; vertex_count++) {
		vertex_set.push(lineObj.points[vertex_count].x);
		vertex_set.push(lineObj.points[vertex_count].y);
		vertex_set.push(lineObj.points[vertex_count].c.R);
		vertex_set.push(lineObj.points[vertex_count].c.G);
		vertex_set.push(lineObj.points[vertex_count].c.B);

		lines_set.push(lineObj.points[vertex_count].x);
		lines_set.push(lineObj.points[vertex_count].y);
		lines_set.push(0.8);
		lines_set.push(0.8);
		lines_set.push(0.8);
	}
	lines_count = vertex_count;

	if (vertex_count > 0) {
		// If polyline is not finished
		if (!lineObj.ended) {
			// Add mouse location
			lines_set.push(mouse_point.x);
			lines_set.push(mouse_point.y);
			lines_set.push(0.0);
			lines_set.push(1.0);
			lines_set.push(0.0);
			lines_count++;
		} else {

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

function draw() {
	for (let i = 0; i < polylines.length; i++) {
		drawPolyline(polylines[i]);
	}

	return polylines.length;
}

function startRandom() {
	console.log("Starting random points.")

	mouse_point.x = (Math.random() * 2) - 1;
	mouse_point.y = (Math.random() * 2) - 1;

	active_random = setInterval( function() {
		let right = !(Math.random() < 0.7); // true if random number >= 0.7

		if (right) {
			console.log("Right click detected at [", mouse_point.x, ", ", mouse_point.y, "].");
		} else {
			console.log("Left click detected at [", mouse_point.x, ", ", mouse_point.y, "].");
		}

		let e = newPoint({
			x: mouse_point.x,
			y: mouse_point.y
		}, right);

		if (e) {
			let str = 'Polyline ended. Points are: ',
					i = 0;
			for (i; i < polylines[polylines.length - 1].points.length - 1; i++) {
				str += '[' + polylines[polylines.length - 1].points[i].x + ', ' + polylines[polylines.length - 1].points[i].y + '], ';
			}
			str += '[' + polylines[polylines.length - 1].points[i].x + ', ' + polylines[polylines.length - 1].points[i].y + '].';

			console.log(str);
		}

		draw()

		mouse_point.x = (Math.random() * 2) - 1;
		mouse_point.y = (Math.random() * 2) - 1;

		setTimeout(function() {
			draw();
		}, 800);

	}, 1600);

	document.getElementById('rdstart').disabled = true;
	document.getElementById('rdstop').disabled = false;


}

function stopRandom() {
	console.log("Stoping random points.")

	clearInterval(active_random);

	document.getElementById('rdstart').disabled = false;
	document.getElementById('rdstop').disabled = true;
}

function clearCanvas() {
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
