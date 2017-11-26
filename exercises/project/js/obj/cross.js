var Cross = function(_center, _normal) {
	this.reset = function() {
		this.center = this.original.center;
		this.normal = this.original.normal;

		this.generateVertices();
	}

	this.generateSkeleton = function() {
		let circles = [],
				radius = 350;
				points = 120,
				a = 45;

		let p = [this.center[0], this.center[1] + radius, this.center[2]];

		circles.push({
			center: rotatePointAboutPoint(p, this.center, false, false, a),
			circle: []
		});
		circles.push({
			center: rotatePointAboutPoint(p, this.center, false, false, a + 180),
			circle: []
		});
		circles.push({
			center: rotatePointAboutPoint(p, this.center, false, false, (180 - a)),
			circle: []
		});
		circles.push({
			center: rotatePointAboutPoint(p, this.center, false, false, (180 - a) + 180),
			circle: []
		});

		for (let i = 0; i < circles.length; i++) {
			let v = [];
			let c = circles[i].center;
			let ax = 360 / points;

			let sin = c[0] / radius;
			if (sin < -1.0) sin = -1.0;
			if (sin > 1.0) sin = 1.0;

			let az = Math.asin(sin) * 180 / Math.PI;
			if (c[1] < 0) {
				az = - az;
			}
			az = ((360 - az) % 360) - 90;

			v.push([c[0], c[1] + radius/3, c[2]]);
			v[0].index = 0;

			for (let j = 1; j < points; j++) {
				let newPoint = rotatePointAboutPoint(v[j - 1], c, ax, false, false);
				v.push(newPoint);
			}

			for (let j = 0; j < v.length; j++) {
				let p = rotatePointAboutPoint(v[j], c, false, false, az);
				v[j] = p;

				let n = normalizeVector([p[0] - c[0], p[1] - c[1], p[2] - c[2]]);
				v[j].index = j;
				v[j].normal = n;
			}

			circles[i].circle = v;
		}

		this.skeleton = circles;
	}

	this.generateVertices = function() {
		let triangles = [];
		this.vertices = [];

		triangles.push([this.skeleton[1].circle[this.skeleton[1].circle.length - 1], this.skeleton[1].circle[0], this.skeleton[0].circle[this.skeleton[0].circle.length - 1]]);
		triangles.push([this.skeleton[1].circle[0], this.skeleton[0].circle[0], this.skeleton[0].circle[this.skeleton[0].circle.length - 1]]);

		triangles.push([this.skeleton[3].circle[this.skeleton[3].circle.length - 1], this.skeleton[3].circle[0], this.skeleton[2].circle[this.skeleton[2].circle.length - 1]]);
		triangles.push([this.skeleton[3].circle[0], this.skeleton[2].circle[0], this.skeleton[2].circle[this.skeleton[2].circle.length - 1]]);

		for (let j = 1; j < this.skeleton[0].circle.length; j++) {
			triangles.push([this.skeleton[1].circle[j - 1], this.skeleton[1].circle[j], this.skeleton[0].circle[j - 1]]);
			triangles.push([this.skeleton[1].circle[j], this.skeleton[0].circle[j], this.skeleton[0].circle[j - 1]]);

			triangles.push([this.skeleton[3].circle[j - 1], this.skeleton[3].circle[j], this.skeleton[2].circle[j - 1]]);
			triangles.push([this.skeleton[3].circle[j], this.skeleton[2].circle[j], this.skeleton[2].circle[j - 1]]);
		}

		for (let i = 0; i < this.skeleton.length; i++) {
			let h = Math.floor(this.skeleton[i].circle.length / 2);
			triangles.push([this.skeleton[i].circle[this.skeleton[i].circle.length - 1], this.skeleton[i].circle[0], this.skeleton[i].circle[h]]);

			for (let j = 1; j < this.skeleton[i].circle.length; j++) {
				triangles.push([this.skeleton[i].circle[j - 1], this.skeleton[i].circle[j], this.skeleton[i].circle[(j + h) % this.skeleton[i].circle.length]]);
			}
		}

		for (let tri of triangles) {
			for (let point of tri) {
				this.vertices.push(point);
			}
		}
	}

	this.addTransform = function(type, opts) {
		switch (type) {
			case 'translate':
				this.transform.translate[0] += opts[0];
				this.transform.translate[1] += opts[1];
				this.transform.translate[2] += opts[2];
				break;
			case 'rotate':
				this.transform.rotate[0] += opts[0];
				this.transform.rotate[1] += opts[1];
				this.transform.rotate[2] += opts[2];
				break;
			case 'scale':
				this.transform.scale += opts;
				if (this.transform.scale < 0) this.transform.scale = 0;
				break;
			default:
				break;
		}
	}

	this.applyTransform = function() {
		this.reset();

		for (let i = 0; i < this.vertices.length; i++) {
			let pa = this.vertices[i];
			let n = this.vertices[i].normal;
			let pb = [pa[0] + n[0], pa[1] + n[1], pa[2] + n[2]];

			// Scale
			let pas = [pa[0] * this.transform.scale, pa[1] * this.transform.scale, pa[2] * this.transform.scale];
			let pbs = [pb[0] * this.transform.scale, pb[1] * this.transform.scale, pb[2] * this.transform.scale];

			// Rotate
			let par = rotatePointAboutPoint(pas, this.center, this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);
			let pbr = rotatePointAboutPoint(pbs, this.center, this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);

			// Translate
			let pat = [par[0] + this.transform.translate[0], par[1] + this.transform.translate[1], par[2] + this.transform.translate[2]];
			let pbt = [pbr[0] + this.transform.translate[0], pbr[1] + this.transform.translate[1], pbr[2] + this.transform.translate[2]];

			// Update
			this.vertices[i] = [pat[0], pat[1], pat[2]];
			this.vertices[i].normal = [pbt[0] - pat[0], pbt[1] - pat[1], pbt[2] - pat[2]];
		}
	}

	this.drawObj = function() {
		let v = [];
		let c = [];
		let n = [];

		// // Center
		// loadArraysAndDraw(gl, this.center, COLOR_RED, this.normal, 'points');

		// // Skeleton
		// for (let vertex of this.skeleton) {
		// 	v.push(vertex.center[0]);
		// 	v.push(vertex.center[1]);
		// 	v.push(vertex.center[2]);

		// 	c.push(COLOR_BLUE[0]);
		// 	c.push(COLOR_BLUE[1]);
		// 	c.push(COLOR_BLUE[2]);

		// 	n.push(1.0);
		// 	n.push(1.0);
		// 	n.push(1.0);
		// }
		// loadArraysAndDraw(gl, v, c, n, 'lines');

		v = [];
		c = [];
		n = [];
		// Triangles
		for (let vertex of this.vertices) {
			v.push(vertex[0]);
			v.push(vertex[1]);
			v.push(vertex[2]);

			c.push(COLOR_RED[0]);
			c.push(COLOR_RED[1]);
			c.push(COLOR_RED[2]);

			n.push(vertex.normal[0]);
			n.push(vertex.normal[1]);
			n.push(vertex.normal[2]);
		}

		loadArraysAndDraw(gl, v, c, n, 'triangles');

		// Circles
		// for (let vertex of this.skeleton) {
		// 	v = [];
		// 	c = [];
		// 	n = [];

		// 	// let color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
		// 	let color = COLOR_BLACK;

		// 	for (let point of vertex.circle) {
		// 		v.push(point[0]);
		// 		v.push(point[1]);
		// 		v.push(point[2]);

		// 		c.push(color[0]);
		// 		c.push(color[1]);
		// 		c.push(color[2]);

		// 		n.push(point.normal[0]);
		// 		n.push(point.normal[1]);
		// 		n.push(point.normal[2]);
		// 	}

		// 	loadArraysAndDraw(gl, v, c, n, 'line_loop');
		// }
	}

	this.skeleton = [];
	this.vertices = [];

	this.original = {
		center: _center,
		normal: _normal
	};

	this.center = this.original.center;
	this.normal = this.original.normal;

	this.transform = {
		translate: [0.0, 0.0, 0.0],
		rotate: [0.0, 0.0, 0.0],
		scale: 1.0
	};

	this.generateSkeleton();
	this.generateVertices();
}