var Env = function() {
	this.drawObj = function() {

	};
	
	this.triangles = [
		// Back
		-500, 500, -500,
		-500, -500, -500,
		500, -500, -500,
		500, -500, -500,
		500, 500, -500,
		-500, 500, -500,

		// Front
		500, 500, 500,
		500, -500, 500,
		-500, -500, 500,
		-500, -500, 500,
		-500, 500, 500,
		500, 500, 500,

		// Left
		-500, 500, 500,
		-500, -500, 500,
		-500, -500, -500,
		-500, -500, -500,
		-500, 500, -500,
		-500, 500, 500,

		// Right
		500, 500, -500,
		500, -500, -500,
		500, -500, 500,
		500, -500, 500,
		500, 500, 500,
		500, 500, -500,

		// Up
		-500, 500, 500,
		-500, 500, -500,
		500, 500, -500,
		500, 500, -500,
		500, 500, 500,
		-500, 500, 500,

		// Down
		-500, -500, -500,
		-500, -500, 500,
		500, -500, 500,
		500, -500, 500,
		500, -500, -500,
		-500, -500, -500
	];

	this.texCoords = [

	];
}