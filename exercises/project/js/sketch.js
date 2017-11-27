var mouse = [0.0, 0.0];

var persp = true,
		move = false;

var mat = new Matrix4()
		matRX = new Matrix4();

let eye = [0, 0, 500];
let lookat = [0, 0, 0];
let up = [0, 1, 0];

var setupScene = function() {
	if (!setupGL()) {
		console.log('There was an error in the WebGL setup. Exiting now.');
		return;
	}
	mat.setIdentity();
	matRX.setRotate(-60, 0, 1, 0);
}

var drawScene = function() {
	resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Set matrix
	mat.setIdentity();
	if (move) {
		matRX.rotate(1, 0, 1, 0);

		eye = rotatePointAboutPoint(eye, lookat, false, 1, false);
	}

	if (persp) {
		mat.setPerspective(100, 1.0, 1, 1000);
		mat.lookAt(eye[0], eye[1], eye[2], lookat[0], lookat[1], lookat[2], up[0], up[1], up[2]);
	} else {
		mat.setOrtho(	- 500.0, 500.0,
									- 500.0, 500.0,
									- 500.0, 500.0);
		mat.multiply(matRX);
	}

	gl.uniformMatrix4fv(u_MvpMatrix, false, mat.elements);

	//
	Game.drawGame(mouse);

	// Call it again
	requestAnimationFrame(drawScene);
}
