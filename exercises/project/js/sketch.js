var persp = false,
		move = false;

var mat = new Matrix4()
		matRX = new Matrix4();

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
		// matRX.rotate(1, 1, 0, 0);
	}

	if (persp) {
		mat.setPerspective(100, 1.0, 1, 1000);
		mat.lookAt(0, 0, 500, 0, 0, 0, 0, 500, 0);
	} else {
		mat.setOrtho(	- 500.0, 500.0,
									- 500.0, 500.0,
									- 500.0, 500.0);
		mat.multiply(matRX);
	}

	gl.uniformMatrix4fv(u_MvpMatrix, false, mat.elements);

	//
	Game.drawGame();

	// Call it again
	requestAnimationFrame(drawScene);
}
