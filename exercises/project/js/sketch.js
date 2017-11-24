var setupScene = function() {
	if (!setupGL()) {
		console.log('There was an error in the WebGL setup. Exiting now.');
		return;
	}
}

var drawScene = function() {
	resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Set matrix
	let mat = new Matrix4();

	mat.setIdentity();
	mat.setOrtho(	- 500.0, 500.0,
								- 500.0, 500.0,
								- 500.0, 500.0);

	gl.uniformMatrix4fv(u_MvpMatrix, false, mat.elements);

	//
	Game.drawGame();

	// Call it again
	requestAnimationFrame(drawScene);
}
