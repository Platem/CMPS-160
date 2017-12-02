var mouse = [0.0, 0.0];

var move = false;

var mat = new Matrix4();

let eye = [0, 0, 500];
let lookat = [0, 0, 0];
let up = [0, 1, 0];

var setupScene = function() {
	if (!setupGL()) {
		console.log('There was an error in the WebGL setup. Exiting now.');
		return;
	}
	mat.setIdentity();
	mat.setPerspective(100, 1.0, 1, 1500);
	mat.lookAt(eye[0], eye[1], eye[2], lookat[0], lookat[1], lookat[2], up[0], up[1], up[2]);
}

let then = 0;
let speed = 60;

var drawScene = function(now) {
	resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	now *= .001;
	let deltaTime = now - then;
	then = now;

	gl.uniformMatrix4fv(u_MvpMatrix, false, mat.elements);

	if (move) {
		eye = rotatePointAboutPoint(eye, lookat, false, speed * deltaTime, false);
		mat.setPerspective(100, 1.0, 1, 1500);
		mat.lookAt(eye[0], eye[1], eye[2], lookat[0], lookat[1], lookat[2], up[0], up[1], up[2]);
	}

	Game.drawGame(mouse);

	// Call it again
	requestAnimationFrame(drawScene);
}
