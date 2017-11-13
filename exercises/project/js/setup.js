// Vertex shader program
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Color;\n' +
'uniform mat4 u_ProjMatrix;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_Position = u_ProjMatrix * a_Position;\n' +
'  v_Color = a_Color;\n' +
'  gl_PointSize = 5.0;\n' +
'}\n';

// Fragment shader program
var FSHADER_SOURCE =
'precision mediump float;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_FragColor = v_Color;\n' +
'}\n';

// Program vars
const FLOAT_BYTES = 4,
			RADIUS = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) * 0.05;

var canvas,
		gl,
		a_Position,
		u_ProjMatrix,
		a_Color;

// Setup WebGL function
function setup() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	// gl = getWebGLContext(canvas);
	gl = WebGLUtils.setupWebGL(canvas, {
		preserveDrawingBuffer: true}
	);
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

	if (draw_options.opacity_enabled) {
		// Assign buffer to a_Position variable
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FLOAT_BYTES * 7, 0);
	} else {
		// Assign buffer to a_Position variable
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FLOAT_BYTES * 6, 0);
	}

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	// Get the storage location of a_Color
	a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if (a_Color < 0) {
		console.log('Failed to get the storage location of a_Color');
		return false;
	}

	if (draw_options.opacity_enabled) {
		// Assign buffer to a_Color variable
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FLOAT_BYTES * 7, FLOAT_BYTES * 3);
	} else {
		// Assign buffer to a_Color variable
		gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FLOAT_BYTES * 6, FLOAT_BYTES * 3);
	}

	// Enable the assignment to a_Color variable
	gl.enableVertexAttribArray(a_Color);

	// Get the storage location of u_ProjMatrix
	u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
	if (!u_ProjMatrix) { 
		console.log('Failed to get the storage location of u_ProjMatrix');
		return;
	}

	// Specify the color for clearing <canvas>
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Everything OK
	return true;
}
