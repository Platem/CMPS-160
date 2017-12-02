var Cross = function(_center, _normal, _isGuide) {
	this.reset = function() {
		this.isWinner = false;
		this.zone = null;
		this.ffd.p = [-500, -500, -500];
		this.ffd.s = [1000, 0, 0];
		this.ffd.t = [0, 1000, 0];
		this.ffd.u = [0, 0, 1000];

		if (!USE_FFD)
			this.generateVertices();
	}

	this.generateSkeleton = function() {
		let circles = [],
				radius = 350;
				points = 120,
				a = 45;

		let p = [0, radius, 0];

		circles.push({
			center: rotatePointAboutPoint(p, [0, 0, 0], false, false, a),
			circle: []
		});
		circles.push({
			center: rotatePointAboutPoint(p, [0, 0, 0], false, false, a + 180),
			circle: []
		});
		circles.push({
			center: rotatePointAboutPoint(p, [0, 0, 0], false, false, (180 - a)),
			circle: []
		});
		circles.push({
			center: rotatePointAboutPoint(p, [0, 0, 0], false, false, (180 - a) + 180),
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
		this.verticesProportion = [];

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

				/*
				 *  p  =  p0  + px *  s   + py *  t   + pz *  u
				 *  p  -  p0  = px *  s   + py *  t   + pz *  u
				 *
				 * |x| - |x0| = px * |s0| + py * |t0| + pz * |u0|
				 * |y| - |y0| = px * |s1| + py * |t1| + pz * |u1|
				 * |z| - |z0| = px * |s2| + py * |t2| + pz * |u2|
				 *
				 * |x  -  x0|   |s0  t0  u0|   |px|
				 * |y  -  y0| = |s1  t1  u1| * |py|
				 * |z  -  z0|   |s2  t2  u1|   |pz|
				 *
				 * |px|   |s0  t0  u0| -1   |x  -  x0|
				 * |py| = |s1  t1  u1|    * |y  -  y0|
				 * |pz|   |s2  t2  u1|      |z  -  z0|
				 *
				 *
				 * proportion = Mat^-1 * (p - p0)
				 * x = M^-1 * b
				 *
				 */

				let b = [point[0] - this.ffd.p[0],
								 point[1] - this.ffd.p[1],
								 point[2] - this.ffd.p[2]];
				let x = [this.ffd.mat.elements[0] * b[0] + this.ffd.mat.elements[1] * b[1] + this.ffd.mat.elements[2]  * b[2],
								 this.ffd.mat.elements[4] * b[0] + this.ffd.mat.elements[5] * b[1] + this.ffd.mat.elements[6]  * b[2],
								 this.ffd.mat.elements[8] * b[0] + this.ffd.mat.elements[9] * b[1] + this.ffd.mat.elements[10] * b[2]];

				let b2 = [point[0] + point.normal[0] - this.ffd.p[0],
								  point[1] + point.normal[1] - this.ffd.p[1],
								  point[2] + point.normal[2] - this.ffd.p[2]];
				let x2 = [this.ffd.mat.elements[0] * b2[0] + this.ffd.mat.elements[1] * b2[1] + this.ffd.mat.elements[2]  * b2[2],
								  this.ffd.mat.elements[4] * b2[0] + this.ffd.mat.elements[5] * b2[1] + this.ffd.mat.elements[6]  * b2[2],
								  this.ffd.mat.elements[8] * b2[0] + this.ffd.mat.elements[9] * b2[1] + this.ffd.mat.elements[10] * b2[2]];

				x.normal = x2;

				this.verticesProportion.push(x);
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

		// Update ffd.s
			let ps = [this.ffd.p[0] + this.ffd.s[0],
								this.ffd.p[1] + this.ffd.s[1],
								this.ffd.p[2] + this.ffd.s[2]];
			let pss = [ps[0] * this.transform.scale, ps[1] * this.transform.scale, ps[2] * this.transform.scale];
			let psr = rotatePointAboutPoint(pss, [0, 0, 0], this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);
			let pst = [psr[0] + this.transform.translate[0], psr[1] + this.transform.translate[1], psr[2] + this.transform.translate[2]];

		// Update ffd.t
			let pt = [this.ffd.p[0] + this.ffd.t[0],
								this.ffd.p[1] + this.ffd.t[1],
								this.ffd.p[2] + this.ffd.t[2]];
			let pts = [pt[0] * this.transform.scale, pt[1] * this.transform.scale, pt[2] * this.transform.scale];
			let ptr = rotatePointAboutPoint(pts, [0, 0, 0], this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);
			let ptt = [ptr[0] + this.transform.translate[0], ptr[1] + this.transform.translate[1], ptr[2] + this.transform.translate[2]];

		// Update ffd.u
			let pu = [this.ffd.p[0] + this.ffd.u[0],
								this.ffd.p[1] + this.ffd.u[1],
								this.ffd.p[2] + this.ffd.u[2]];
			let pus = [pu[0] * this.transform.scale, pu[1] * this.transform.scale, pu[2] * this.transform.scale];
			let pur = rotatePointAboutPoint(pus, [0, 0, 0], this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);
			let put = [pur[0] + this.transform.translate[0], pur[1] + this.transform.translate[1], pur[2] + this.transform.translate[2]];

		// Update ffd.p
			let pp = [this.ffd.p[0],
								this.ffd.p[1],
								this.ffd.p[2]];
			let pps = [pp[0] * this.transform.scale, pp[1] * this.transform.scale, pp[2] * this.transform.scale];
			let ppr = rotatePointAboutPoint(pps, [0, 0, 0], this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);
			let ppt = [ppr[0] + this.transform.translate[0], ppr[1] + this.transform.translate[1], ppr[2] + this.transform.translate[2]];
			this.ffd.p[0] = ppt[0];
			this.ffd.p[1] = ppt[1];
			this.ffd.p[2] = ppt[2];

			this.ffd.s[0] = pst[0] - this.ffd.p[0];
			this.ffd.s[1] = pst[1] - this.ffd.p[1];
			this.ffd.s[2] = pst[2] - this.ffd.p[2];

			this.ffd.t[0] = ptt[0] - this.ffd.p[0];
			this.ffd.t[1] = ptt[1] - this.ffd.p[1];
			this.ffd.t[2] = ptt[2] - this.ffd.p[2];

			this.ffd.u[0] = put[0] - this.ffd.p[0];
			this.ffd.u[1] = put[1] - this.ffd.p[1];
			this.ffd.u[2] = put[2] - this.ffd.p[2];

		// Update ffd.mat
		this.ffd.mat.setInverseOf({
			elements: [this.ffd.s[0], this.ffd.s[1], this.ffd.s[2], 0,
								 this.ffd.t[0], this.ffd.t[1], this.ffd.t[2], 0,
								 this.ffd.u[0], this.ffd.u[1], this.ffd.u[2], 0,
								 0						, 0						 , 0						, 1]
		});
		
		if (!USE_FFD) {
			for (let i = 0; i < this.vertices.length; i++) {
				let pa = this.vertices[i];
				let n = this.vertices[i].normal;
				let pb = [pa[0] + n[0], pa[1] + n[1], pa[2] + n[2]];

				// Scale
				let pas = [pa[0] * this.transform.scale, pa[1] * this.transform.scale, pa[2] * this.transform.scale];
				let pbs = [pb[0] * this.transform.scale, pb[1] * this.transform.scale, pb[2] * this.transform.scale];

				// Rotate
				let par = rotatePointAboutPoint(pas, [0, 0, 0], this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);
				let pbr = rotatePointAboutPoint(pbs, [0, 0, 0], this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);

				// Translate
				let pat = [par[0] + this.transform.translate[0], par[1] + this.transform.translate[1], par[2] + this.transform.translate[2]];
				let pbt = [pbr[0] + this.transform.translate[0], pbr[1] + this.transform.translate[1], pbr[2] + this.transform.translate[2]];

				// Update
				this.vertices[i] = [pat[0], pat[1], pat[2]];
				this.vertices[i].normal = [pbt[0] - pat[0], pbt[1] - pat[1], pbt[2] - pat[2]];
			}
		} else {
			// for (let i = 0; i < this.vertices.length; i++) {
			// 	let pa = this.vertices[i];
			// 	let prop = this.verticesProportion[i];
			// 	let pn = prop.normal;

			// 	let xa = this.ffd.p[0] + prop[0] * this.ffd.s[0] + prop[1] * this.ffd.t[0] + prop[2] * this.ffd.u[0];
			// 	let ya = this.ffd.p[1] + prop[0] * this.ffd.s[1] + prop[1] * this.ffd.t[1] + prop[2] * this.ffd.u[1];
			// 	let za = this.ffd.p[2] + prop[0] * this.ffd.s[2] + prop[1] * this.ffd.t[2] + prop[2] * this.ffd.u[2];

			// 	let xn = this.ffd.p[0] + pn[0] * this.ffd.s[0] + pn[1] * this.ffd.t[0] + pn[2] * this.ffd.u[0];
			// 	let yn = this.ffd.p[1] + pn[0] * this.ffd.s[1] + pn[1] * this.ffd.t[1] + pn[2] * this.ffd.u[1];
			// 	let zn = this.ffd.p[2] + pn[0] * this.ffd.s[2] + pn[1] * this.ffd.t[2] + pn[2] * this.ffd.u[2];

			// 	this.vertices[i] = [xa[0], ya[1], za[2]];
			// 	this.vertices[i].normal = [xn - xa, yn - ya, zn - za];
			// }
		}
	}

	/*
	Object positions:
		i, j
	---------
		0, 0: 	addTransform('translate',[-165, 165, -50]);
		0, 1: 	addTransform('translate',[0, 165, -50]);
		0, 2: 	addTransform('translate',[165, 165, -50]);
	
		1, 0: 	addTransform('translate',[-165, 40, 60]);
		1, 1: 	addTransform('translate',[0, 40, 60]);
		1, 2: 	addTransform('translate',[165, 40, 60]);
	
		2, 0: 	addTransform('translate',[-165, -90, 165]);
		2, 1: 	addTransform('translate',[0, -90, 165]);
		2, 2: 	addTransform('translate',[165, -90, 165]);
	*/	
	this.setZone = function(_zone) {
		this.transform.translate = [0.0, 0.0, 0.0];
		if (_zone) {
			this.zone = _zone;
		}

		let x = 0, y = 0, z = 0;

		if 			(_zone[0] == 0) { y = 165; z = -50;}
		else if (_zone[0] == 1) { y = 40;	z = 60;	}
		else if (_zone[0] == 2) { y = -90;	z = 165;}

		if 			(_zone[1] == 0) 	 x = -165;
		else if (_zone[1] == 1)	 x = 0;
		else if (_zone[1] == 2)	 x = 165;

		this.addTransform('translate',[x, y, z]);
		this.applyTransform();
	}

	this.drawObj = function() {
		let v = [];
		let c = [];
		let n = [];
		let t = [];

		// // Center
		// loadArraysAndDraw(gl, [0, 0, 0], COLOR_RED, this.normal, 'points');

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
		t = [];
		// Triangles
		if (USE_FFD) {
			for (let i = 0; i < this.verticesProportion.length; i++) {
				let prop = this.verticesProportion[i];
				let x = this.ffd.p[0] + prop[0] * this.ffd.s[0] + prop[1] * this.ffd.t[0] + prop[2] * this.ffd.u[0];
				let y = this.ffd.p[1] + prop[0] * this.ffd.s[1] + prop[1] * this.ffd.t[1] + prop[2] * this.ffd.u[1];
				let z = this.ffd.p[2] + prop[0] * this.ffd.s[2] + prop[1] * this.ffd.t[2] + prop[2] * this.ffd.u[2];

				let xn = this.ffd.p[0] + prop.normal[0] * this.ffd.s[0] + prop.normal[1] * this.ffd.t[0] + prop.normal[2] * this.ffd.u[0];
				let yn = this.ffd.p[1] + prop.normal[0] * this.ffd.s[1] + prop.normal[1] * this.ffd.t[1] + prop.normal[2] * this.ffd.u[1];
				let zn = this.ffd.p[2] + prop.normal[0] * this.ffd.s[2] + prop.normal[1] * this.ffd.t[2] + prop.normal[2] * this.ffd.u[2];

				v.push(x);
				v.push(y);
				v.push(z);

				if (this.isGuide) {
					c.push(COLOR_GRAY[0]);
					c.push(COLOR_GRAY[1]);
					c.push(COLOR_GRAY[2]);
				} else if (this.isWinner) {
					c.push(COLOR_GREEN[0]);
					c.push(COLOR_GREEN[1]);
					c.push(COLOR_GREEN[2]);
				} else {
					c.push(COLOR_RED[0]);
					c.push(COLOR_RED[1]);
					c.push(COLOR_RED[2]);
				}

				n.push(xn - x);
				n.push(yn - y);
				n.push(zn - z);

				t.push((x + 500) / 1000);
				t.push((y + 500) / 1000);
			}
		} else {
			for (let i = 0; i < this.vertices.length; i++) {
				let vertex = this.vertices[i];
				v.push(vertex[0]);
				v.push(vertex[1]);
				v.push(vertex[2]);

				if (this.isGuide) {
					c.push(COLOR_GRAY[0]);
					c.push(COLOR_GRAY[1]);
					c.push(COLOR_GRAY[2]);
				} else if (this.isWinner) {
					c.push(COLOR_GREEN[0]);
					c.push(COLOR_GREEN[1]);
					c.push(COLOR_GREEN[2]);
				} else {
					c.push(COLOR_RED[0]);
					c.push(COLOR_RED[1]);
					c.push(COLOR_RED[2]);
				}

				n.push(vertex.normal[0]);
				n.push(vertex.normal[1]);
				n.push(vertex.normal[2]);

				t.push((vertex[0] + 500) / 1000);
				t.push((vertex[1] + 500) / 1000);
			}
		}	

		if (this.isGuide) {
			loadArraysAndDraw(gl, v, c, n, t, 'triangles', true, false);
		} else if (this.isWinner) {
			loadArraysAndDraw(gl, v, c, n, t, 'triangles', false, 'obj_metal_green');
		}	else {
			loadArraysAndDraw(gl, v, c, n, t, 'triangles', false, 'obj_metal_red');
		}

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

		v = [];
		c = [];
		n = [];
		t = [];
		if (SHOW_FFD) {
			v.push(this.ffd.p[0]);
			v.push(this.ffd.p[1]);
			v.push(this.ffd.p[2]);
			v.push(this.ffd.p[0] + this.ffd.s[0]);
			v.push(this.ffd.p[1] + this.ffd.s[1]);
			v.push(this.ffd.p[2] + this.ffd.s[2]);

			c.push(COLOR_BLACK[0]);
			c.push(COLOR_BLACK[1]);
			c.push(COLOR_BLACK[2]);
			c.push(COLOR_BLACK[0]);
			c.push(COLOR_BLACK[1]);
			c.push(COLOR_BLACK[2]);

			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);

			t.push(0.5);
			t.push(0.5);
			t.push(0.5);
			t.push(0.5);

			v.push(this.ffd.p[0]);
			v.push(this.ffd.p[1]);
			v.push(this.ffd.p[2]);
			v.push(this.ffd.p[0] + this.ffd.t[0]);
			v.push(this.ffd.p[1] + this.ffd.t[1]);
			v.push(this.ffd.p[2] + this.ffd.t[2]);

			c.push(COLOR_BLACK[0]);
			c.push(COLOR_BLACK[1]);
			c.push(COLOR_BLACK[2]);
			c.push(COLOR_BLACK[0]);
			c.push(COLOR_BLACK[1]);
			c.push(COLOR_BLACK[2]);

			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);

			t.push(0.5);
			t.push(0.5);
			t.push(0.5);
			t.push(0.5);

			v.push(this.ffd.p[0]);
			v.push(this.ffd.p[1]);
			v.push(this.ffd.p[2]);
			v.push(this.ffd.p[0] + this.ffd.u[0]);
			v.push(this.ffd.p[1] + this.ffd.u[1]);
			v.push(this.ffd.p[2] + this.ffd.u[2]);

			c.push(COLOR_BLACK[0]);
			c.push(COLOR_BLACK[1]);
			c.push(COLOR_BLACK[2]);
			c.push(COLOR_BLACK[0]);
			c.push(COLOR_BLACK[1]);
			c.push(COLOR_BLACK[2]);

			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);
			n.push(1.0);

			t.push(0.5);
			t.push(0.5);
			t.push(0.5);
			t.push(0.5);

			loadArraysAndDraw(gl, v, c, n, t, 'lines');
		}
	}

	this.skeleton = [];
	this.vertices = [];
	this.verticesProportion = [];

	this.isGuide = _isGuide;
	this.isWinner = false;
	this.zone = null;
	this.ffd = {
		p: [-500, -500, -500],
		s: [1000, 0, 0],
		t: [0, 1000, 0],
		u: [0, 0, 1000],
		mat: new Matrix4()
	};
	this.ffd.mat.setInverseOf({
		elements: [this.ffd.s[0], this.ffd.s[1], this.ffd.s[2], 0,
							 this.ffd.t[0], this.ffd.t[1], this.ffd.t[2], 0,
							 this.ffd.u[0], this.ffd.u[1], this.ffd.u[2], 0,
							 0						, 0						 , 0						, 1]
	});

	this.transform = {
		translate: [0.0, 0.0, 0.0],
		rotate: [0.0, 0.0, 0.0],
		scale: 1.0
	};

	this.generateSkeleton();
	this.generateVertices();
}