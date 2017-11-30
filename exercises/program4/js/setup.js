// Vertex shader program
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Color;\n' +
'attribute vec2 a_TexCoord;\n' +
'uniform mat4 u_ProjMatrix;\n' +
'varying vec4 v_Color;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'  gl_Position = u_ProjMatrix * a_Position;\n' +
'  v_Color = a_Color;\n' +
'  v_TexCoord = a_TexCoord;\n' +
'  gl_PointSize = 5.0;\n' +
'}\n';

// Fragment shader program
var FSHADER_SOURCE =
'precision mediump float;\n' +
'varying vec4 v_Color;\n' +
'varying vec2 v_TexCoord;\n' +
'uniform sampler2D u_texture;\n' +
'uniform float u_useTex;\n' +
'uniform float u_mixTexColors;\n' +
'void main() {\n' +
'  if (u_useTex == 1.0) {\n' +
'    if (u_mixTexColors == 1.0) {\n' +
'      gl_FragColor = texture2D(u_texture, v_TexCoord) * v_Color;\n' +
'    } else {\n' +
'      gl_FragColor = texture2D(u_texture, v_TexCoord) + v_Color;\n' +
'    }\n' +
'  } else {\n' +
'    gl_FragColor = v_Color;\n' +
'  }\n' +
'}\n';

var textures = ['Outline', 'Pentagon', 'Rice'];

// Program vars
const FLOAT_BYTES = 4,
			RADIUS = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) * 0.05;

var canvas,
		gl,
		a_Position,
		a_Color,
		a_TexCoord,
		u_ProjMatrix,
		u_useTex,
		u_mixTexColors,
		u_texture,
		texture,
		image;

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
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FLOAT_BYTES * 9, 0);
	} else {
		// Assign buffer to a_Position variable
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FLOAT_BYTES * 8, 0);
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
		gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FLOAT_BYTES * 9, FLOAT_BYTES * 3);
	} else {
		// Assign buffer to a_Color variable
		gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FLOAT_BYTES * 8, FLOAT_BYTES * 3);
	}

	// Enable the assignment to a_Color variable
	gl.enableVertexAttribArray(a_Color);

	// Get the storage location of a_Color
	a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
	if (a_TexCoord < 0) {
		console.log('Failed to get the storage location of a_TexCoord');
		return false;
	}

	if (draw_options.opacity_enabled) {
		// Assign buffer to a_TexCoord variable
		gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOAT_BYTES * 9, FLOAT_BYTES * 7);
	} else {
		// Assign buffer to a_TexCoord variable
		gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FLOAT_BYTES * 8, FLOAT_BYTES * 6);
	}

	// Enable the assignment to a_TexCoord variable
	gl.enableVertexAttribArray(a_TexCoord);

	// Get the storage location of u_texture
	u_texture = gl.getUniformLocation(gl.program, 'u_texture');
	if (u_texture < 0) {
		console.log('Failed to get the storage location of u_texture');
		return false;
	}
	// Enable the assignment to u_texture variable
	gl.enableVertexAttribArray(u_texture);

	// Get the storage location of u_useTex
	u_useTex = gl.getUniformLocation(gl.program, 'u_useTex');
	if (u_useTex < 0) {
		console.log('Failed to get the storage location of u_useTex');
		return false;
	}

	// Get the storage location of u_mixTexColors
	u_mixTexColors = gl.getUniformLocation(gl.program, 'u_mixTexColors');
	if (u_mixTexColors < 0) {
		console.log('Failed to get the storage location of u_mixTexColors');
		return false;
	}

	// Init texture
	texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

	image = new Image();

	image.addEventListener('load', function() {
		// console.log('loading texture');
		// Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			// Yes, it's a power of 2. Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			// No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}

  	gl.uniform1i(u_texture, 0);
		draw();
	});

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

function toggleTexture() {
	let index = -1, 
			name = "";

	if (image.src != "") {
		let n = image.src.split('/');
		name = n[n.length - 1].split('.')[0];
		index = textures.indexOf(name);
	}

	index = (index + 1) % textures.length;
	name = textures[index];
	image.src = 'img/tex/' + name + '.png';
	$('#bTextureT').text(name + ' texture');
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
