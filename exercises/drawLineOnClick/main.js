// Vertex shader program
let VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'void main() {\n' +
	'  gl_Position = a_Position;\n' +
	'  gl_PointSize = 10.0;\n' +
	'}\n';

// Fragment shader program
let FSHADER_SOURCE =
	'precision mediump float;\n' +
	'uniform vec4 u_FragColor;\n' +  // uniform変数
	'void main() {\n' +
	'  gl_FragColor = u_FragColor;\n' +
	'}\n';

// Program vars
let canvas,
	gl,
	a_position,
	u_FragColor,
	drawing_points;

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

	// Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return false;
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}

	// Specify the color for clearing <canvas>
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// Clear <canvas>
	clear();

	// Everything OK
	return true;
}

function click(event) {

	switch (event.button) {
		case 0:
			// Left click
			newPoint(event, "RED");
			leftClick(event);
			break;
		case 2:
			// Right click
			newPoint(event, "BLUE");
			rightClick(event);
			break;
		default:
			break;
	}
}

function leftClick(event) {
	console.log("Left click detected at [", event.clientX, ", ", event.clientY, "].");

	//drawPoints();
	drawLines();
}

function rightClick(event) {
	console.log("Right click detected at [", event.clientX, ", ", event.clientY, "].");

	//drawPoints();
	drawLines();
}

function newPoint(event, color) {
	// Mouse coordinates
	let x_mouse = event.clientX;
	let y_mouse = event.clientY;

	// Canvas positioning
	let rect = event.target.getBoundingClientRect();

	// Draw coordinates
	let x_draw = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width  / 2);
	let y_draw = (canvas.height / 2 - (y_mouse - rect.top)) / (canvas.height / 2);
	
	// Set color
	let r, g, b;
	if (color === "RED") {
		r = 1.0;
		g = 0.0;
		b = 0.0;
	} else if (color === "BLUE") {
		r = 0.0;
		g = 0.0;
		b = 1.0;
	}

	// Push point to array
	drawing_points.push({
		x: x_draw,
		y: y_draw,
		c: {
			R: r,
			G: g,
			B: b,
			a: 1.0
		}
	});
}

function drawPoints() {
	// Draw the points
	for (let i = 0; i < drawing_points.length; i++) {
		// Pass vertex position to attribute variable
		gl.vertexAttrib3f(a_Position, drawing_points[i].x, drawing_points[i].y, 0.0);

		// Set the color
		gl.uniform4f(u_FragColor, drawing_points[i].c.R, drawing_points[i].c.G, drawing_points[i].c.B, drawing_points[i].c.a);

		// Draw a point
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}

function drawLines() {
	// Retrieve vertex set and count
	let vertex_set = [];
	let vertex_count = 0;
	for (let i = 0; i < drawing_points.length; i++) {
		vertex_set.push(drawing_points[i].x);
		vertex_set.push(drawing_points[i].y);
		vertex_count++;
	}

	// Create a buffer object
	let vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	// Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, vertex_set, gl.STATIC_DRAW);

	// Assign the buffer object to a_Position variable
  	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	// Draw the lines
  	gl.drawArrays(gl.LINE_STRIP, 0, vertex_count);
}

function clear() {
	// Empty array
	drawing_points = [];

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
