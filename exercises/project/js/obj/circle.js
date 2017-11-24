var Circle = function(_center, _normal) {
	/* Object funcitons */
	this.reset = function() {
		this.center = this.original.center;
		this.normal = this.original.normal;

		this.regenerate();
	}

	this.generate = function() {
		let circlePoints = [],
				radius = 250;
				totalPoints = 360;

		// First point just add radius to center y
		circlePoints.push([this.center[0], this.center[1] + radius, this.center[2]]);

		for (let i = 1; i < totalPoints; i++) {
			let newPoint = rotatePointAboutPoint(circlePoints[i - 1], this.center, false, false, 360 / totalPoints);
			circlePoints.push(newPoint);
		}

		this.vertices = circlePoints;
	}

	this.regenerate = function() {

	}

	this.drawObj = function() {
		let v = [];
		let c = [];
		let n = [];

		loadArraysAndDraw(gl, this.center, [255, 0, 0], this.normal, 'points');

		for (vertex of this.vertices) {
			v.push(vertex[0]);
			v.push(vertex[1]);
			v.push(vertex[2]);

			c.push(0);
			c.push(0);
			c.push(255);

			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
		}

		loadArraysAndDraw(gl, v, c, n, 'line_loop');
	}

	/* Object Setup */
	this.vertices = [];

	this.original = {
		center: _center,
		normal: _normal
	};

	this.center = this.original.center;
	this.normal = this.original.normal;

	this.generate();
}