// Program vars
var canvas,
		gl,
		program,

		positionBuffer,
		colorBuffer,
		normalBuffer,
		textureBuffer,

		a_Position,
		a_Color,
		a_Normal,
		a_TexCoord,
		u_MvpMatrix,

		u_envTexture,
		u_objTexture_metal_blue,
		u_objTexture_metal_red,
		u_objTexture_metal_green,
		u_objTexture_wood,
		u_objTexture_wood_2,

		img_env,
		img_metal_blue,
		img_metal_red,
		img_metal_green,
		img_wood;

var VSHADER_SOURCE = document.getElementById('vertex-shader').text,
		FSHADER_SOURCE = document.getElementById('fragment-shader').text;

const COLOR_RED = [255, 0, 0];
const COLOR_GREEN = [0, 255, 0];
const COLOR_BLUE = [0, 0, 255];
const COLOR_BLACK = [0, 0, 0];
const COLOR_BROWN = [222, 184, 135];
const COLOR_GRAY = [180, 180, 180];
const COLOR_MAGENTA = [255, 0, 255];

const ENV_TEX = [/*'env-field.png', */'env-grass.jpg', 'env-mountains.jpg', 'env-museum.jpg'];
const OBJ_TEX = {
	metal_blue: 'obj-metal-blue.png',
	metal_red: 'obj-metal-red.png',
	metal_green: 'obj-metal-green.png',
	wood: 'obj-wood.jpg',
	wood_2: 'obj-wood-2.jpg'
};

var USE_FFD = true;
var USE_TEX = true;
var SHOW_FFD = false;
var USE_LIGHT = true;

// Setup WebGL function
function setupGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	gl = WebGLUtils.setupWebGL(canvas, {
		preserveDrawingBuffer: true
	});
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

	/* a_TexCoord */ 
	a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
	if (a_TexCoord < 0) {
		console.log('Failed to get the storage location of a_TexCoord');
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

	// Texture Buffer
	textureBuffer = gl.createBuffer();
	if (!textureBuffer) {
		console.log('Failed to create the texture buffer object');
		return false;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

	/* u_MvpMatrix */
	u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	if (!u_MvpMatrix) { 
		console.log('Failed to get the storage location of u_MvpMatrix');
		return;
	}

	// Textures uniforms
	u_envTexture = gl.getUniformLocation(gl.program, 'u_envTexture');
	gl.uniform1i(u_envTexture, 0);
	u_objTexture_metal_blue = gl.getUniformLocation(gl.program, 'u_objTexture_metal_blue');
	gl.uniform1i(u_objTexture_metal_blue, 1);
	u_objTexture_metal_red = gl.getUniformLocation(gl.program, 'u_objTexture_metal_red');
	gl.uniform1i(u_objTexture_metal_red, 2);
	u_objTexture_metal_green = gl.getUniformLocation(gl.program, 'u_objTexture_metal_green');
	gl.uniform1i(u_objTexture_metal_green, 3);
	u_objTexture_wood = gl.getUniformLocation(gl.program, 'u_objTexture_wood');
	gl.uniform1i(u_objTexture_wood, 4);
	u_objTexture_wood_2 = gl.getUniformLocation(gl.program, 'u_objTexture_wood_2');
	gl.uniform1i(u_objTexture_wood_2, 5);

	for (let i = 1; i < 7; i++) loadTexture(i, true);

	loadImages();

	// Specify the color for clearing <canvas>
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	// gl.enable(gl.CULL_FACE);

	// Everything OK
	return true;
}


function loadImages() {
	img_env = new Image();
	img_env.src = 'img/' + ENV_TEX[0];
	img_env.onload = function() {
		loadTexture(1);
	};

	img_metal_blue = new Image();
	img_metal_blue.src = 'img/' + OBJ_TEX.metal_blue;
	img_metal_blue.onload = function() {
		loadTexture(2);
	};

	img_metal_red = new Image();
	img_metal_red.src = 'img/' + OBJ_TEX.metal_red;
	img_metal_red.onload = function() {
		loadTexture(3);
	};

	img_metal_green = new Image();
	img_metal_green.src = 'img/' + OBJ_TEX.metal_green;
	img_metal_green.onload = function() {
		loadTexture(4);
	};

	img_wood = new Image();
	img_wood.src = 'img/' + OBJ_TEX.wood;
	img_wood.onload = function() {
		loadTexture(5);
	};

	img_wood_2 = new Image();
	img_wood_2.src = 'img/' + OBJ_TEX.wood_2;
	img_wood_2.onload = function() {
		loadTexture(6);
	};
}

function loadTexture(text, withBlueColor) {
	let tex = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + (text - 1));
	gl.bindTexture(gl.TEXTURE_2D, tex);

	if (withBlueColor) {
  	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		switch (text) {
			case 1:
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_env);
				break;
			case 2:
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_metal_blue);
				break;
			case 3:
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_metal_red);
				break;
			case 4:
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_metal_green);
				break;
			case 5:
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_wood);
				break;
			case 6:
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_wood_2);
				break;
		}
	}

}
