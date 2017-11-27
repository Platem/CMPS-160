// Program vars
var canvas,
		gl,
		program,
		positionBuffer,
		colorBuffer,
		normalBuffer,
		a_Position,
		vF_Position,
		a_Color,
		a_Normal,
		u_MvpMatrix;

var VSHADER_SOURCE = document.getElementById('vertex-shader').text,
		FSHADER_SOURCE = document.getElementById('fragment-shader').text;

const COLOR_RED = [255, 0, 0];
const COLOR_GREEN = [0, 255, 0];
const COLOR_BLUE = [0, 0, 255];
const COLOR_BLACK = [0, 0, 0];
const COLOR_BROWN = [222, 184, 135];
const COLOR_GRAY = [180, 180, 180];

var USE_FFD = true;
var SHOW_FFD = true;

// Setup WebGL function
function setupGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	gl = WebGLUtils.setupWebGL(canvas, {
		preserveDrawingBuffer: true
	});
	// gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return false;
	}

	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return false;
	}

	/* a_ Position */
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return false;
	}

	/* a_Color */
	a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if (a_Color < 0) {
		console.log('Failed to get the storage location of a_Color');
		return false;
	}

	/* a_Normal */ 
	a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
	if (a_Normal < 0) {
		console.log('Failed to get the storage location of a_Normal');
		return false;
	}

	/* Vertex Buffer */
	positionBuffer = gl.createBuffer();
	if (!positionBuffer) {
		console.log('Failed to create the vertex buffer object');
		return false;
	}

	/* Color Buffer */
	colorBuffer = gl.createBuffer();
	if (!colorBuffer) {
		console.log('Failed to create the color buffer object');
		return false;
	}

	//  Normal Buffer 
	normalBuffer = gl.createBuffer();
	if (!normalBuffer) {
		console.log('Failed to create the normal buffer object');
		return false;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

	/* u_MvpMatrix */
	u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	if (!u_MvpMatrix) { 
		console.log('Failed to get the storage location of u_MvpMatrix');
		return;
	}

	// Specify the color for clearing <canvas>
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	// gl.enable(gl.CULL_FACE);

	// Everything OK
	return true;
}
