// Vertex shader program
let VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'void main() {\n' +
	'  gl_Position = a_Position;\n' +
	'  gl_PointSize = 10.0;\n' +
	'}\n';

// Fragment shader program
let FSHADER_SOURCE =
	'void main() {\n' +
	'  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
	'}\n';

// Program vars
let canvas,
	keepPointsCheck,
	gl,
	a_position,
	drawing_points;

function main() {
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}

	// Register function (event handler) to be called on a mouse press
	canvas.onmousedown = function(e) {
		drawPointOnClick(e, keepPointsCheck.checked);
	};
}

function setup() {
	// Retrieve <canvas> and checkbox elements
	canvas = document.getElementById('webgl');
	keepPointsCheck = document.getElementById('keepPoints');

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

	// Specify the color for clearing <canvas>
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// Clear <canvas>
	clear();

	// Everything OK
	return true;
}

function drawPointOnClick(event, keepPoints) {
	// Mouse coordinates
	let x = event.clientX;
	let y = event.clientY;

	// Canvas positioning
	let rect = event.target.getBoundingClientRect();

	// Draw coordinates
	let x_draw = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	let y_draw = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

	// Draw the point
	if (keepPoints) {
		// Push points to array
		drawing_points.push(x_draw);
		drawing_points.push(y_draw);
		drawPoints(drawing_points);
	} else {
		clear();
		drawPoint(x_draw, y_draw)
	}
}

function drawPoint(x, y) {
	// Pass vertex position to attribute variable
	gl.vertexAttrib3f(a_Position, x, y, 0.0);

	// Draw a point
	gl.drawArrays(gl.POINTS, 0, 1);
}

function drawPoints(arr) {
	for(var i = 0; i < arr.length; i += 2) {
		drawPoint(arr[i], arr[i+1]);
	}
}

function clear() {
	// Empty array
	drawing_points = [];

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
