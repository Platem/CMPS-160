var Coord = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.n = [0.0, 0.0, 0.0];

	this.minus = function(coord) {
		return new Coord(this.x - coord.x, this.y - coord.y, this.z - coord.z);
	};

	this.scale = function(s) {
		let _x = this.x * s;
				_y = this.y * s,
				_z = this.z * s;

		return new Coord(_x, _y, _z);
	};

	this.rotate = function(r) {
		let _x = this.x;
				_y = this.y,
				_z = this.z;

		// Rotate around X axis
		let ax = r.x * Math.PI / 180,
				cx = Math.cos(ax),
				sx = Math.sin(ax);
		let _x2 = _x,
				_y2 = _y * cx - _z * sx,
				_z2 = _y * sx + _z * cx;

		// Rotate around Y axis
		let ay = r.y * Math.PI / 180,
				cy = Math.cos(ay),
				sy = Math.sin(ay);
		let _x3 = _x2 * cy + _z2 * sy,
				_y3 = _y2,
				_z3 = - _x2 * sy + _z2 * cy;

		// Rotate around Z axis
		let az = r.z * Math.PI / 180,
				cz = Math.cos(az),
				sz = Math.sin(az);
		let _x4 = _x3 * cz - _y3 * sz,
				_y4 = _x3 * sz + _y3 * cz,
				_z4 = _z3;

		return new Coord(_x4, _y4, _z4);
	};

	this.translate = function(t) {
		let _x = this.x + t.x;
				_y = this.y + t.y,
				_z = this.z + t.z;

		return new Coord(_x, _y, _z);
	};

}

var Node = function(coord) {
	this.point = new Coord(coord.x, coord.y, coord.z);
	this.circle = null;
}

var Line = function() {
	// Array of nodes
	this.nodes = [];
};

var Polygon = function(e, isFirst) {
	// Array of vertices
	this.elements = [];

	this.isFirst = isFirst;

	for (let i = 0; i < e.length; i++) {
		this.elements[i] = e[i];
	}

	this.n = [0.0, 0.0, 0.0];

	this.calcN = function() {
		// Calculate normal if this is a polygon
		if (this.elements.length >= 3) {
			let pA = this.elements[1],
					pB = this.elements[0],
					pC = this.elements[2];


			let v = [pB.x - pA.x, pB.y - pA.y, pB.z - pA.z],
					w = [pC.x - pA.x, pC.y - pA.y, pC.z - pA.z];

			let normal = crossProduct(w, v, true);
			if (this.isFirst) normal = crossProduct(v, w, true);

			this.n[0] = normal[0];
			this.n[1] = normal[1];
			this.n[2] = normal[2];	
		}
	};

	this.calcN();
}

var Obj = function() {
	this.id = hexID();

	this.ended = false;
	this.visible = true;
	this.picked = false;
	this.opacity = 1.0;

	this.center = new Coord(0.0, 0.0, 0.0);
	this.translation = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	};
	this.scale = 1.0;
	this.rotation = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	};

	this.raw = {
		center: new Coord(0.0, 0.0, 0.0),
		polygons: [],
		vertices: []
	};

	this.line = new Line();

	this.vertices = [];
	this.polygons = [];

	this.generate = function() {
		// Each node of the line (starting from second)
		for (let i = 1; i <= this.line.nodes.length; i++) {
			if (i == 1) {
				// It's the second one, just generate the first one circle
				this.line.nodes[i - 1].circle =
					generateCircles(this.line.nodes[i - 1], this.line.nodes[i]).circle1;
			} else if (i == this.line.nodes.length) {
				// It's the last circle
				this.line.nodes[i - 1].circle = 
					generateCircles(this.line.nodes[i - 2], this.line.nodes[i - 1]).circle2;
			} else {
				// It's third or more, generate previous circle having in mind current circle and 2 previous
				let A = this.line.nodes[i - 2],
						B = this.line.nodes[i - 1],
						C = this.line.nodes[i];

				// Get cylinder (circles) related to each line
				let circleAB = generateCircles(A, B).circle1;
				let circleBC = generateCircles(B, C).circle1;

				// Get directions
				let dirAB = [B.point.x - A.point.x,
										 B.point.y - A.point.y,
										 B.point.z - A.point.z];

				let dirBC = [C.point.x - B.point.x,
										 C.point.y - B.point.y,
										 C.point.z - B.point.z];

				let mid = [];

				// For each point
				for (let j = 0; j < circleAB.length; j++) {
					// Get points in edges
					let pA = circleAB[j];
					let pC = circleBC[j];

					let dirCA = [pA.x - pC.x,
											 pA.y - pC.y,
											 pA.z - pC.z];

					/* 			pB = pA + dirAB * h1
					* 			pB = pC + dirBC * h2 			(h2 < 0)
					*
					* 			--					      --   --  --   --       --
					* 			|-dirAB.x 	dirBC.x| · | h1 | = | dirCA.x |
					* 			|-dirAB.y 	dirBC.y|	 | h2 |   | dirCA.y |
					* 			--					      --   --  --   --       --
					*
					*      |dirCA.x 		dirBC.x|						 |-dirAB.x 		dirCA.x|
					*      |dirCA.y 		dirBC.y|						 |-dirAB.y 		dirCA.y|
					* x = ----------------------, 			y = ----------------------
					*      |-dirAB.x 	dirBC.x|						 |-dirAB.x 		dirBC.x|
					*      |-dirAB.y 	dirBC.y|						 |-dirAB.y 		dirBC.y|
					*
					* x = det1 / detA , y = det2 / detA
					*/
					let det1 = (dirCA[0] * dirBC[1]) - (dirCA[1] * dirBC[0]);
					let det2 = (-dirAB[0] * dirCA[1]) - (-dirAB[1] * dirCA[0]);
					let detA = (-dirAB[0] * dirBC[1]) - (-dirAB[1] * dirBC[0]);

					let h1 = det1 / detA;
					let h2 = det2 / detA;

					let pB = [pA.x + dirAB[0] * h1,
					pA.y + dirAB[1] * h1,
					pA.z + dirAB[2] * h1
					];

					mid.push(new Coord(pB[0], pB[1], pB[2]));
				}

				// Now we have mid circle
				this.line.nodes[i - 1].circle = mid;
			}
		}

		this.ended = true;
		this.setVertices();
		this.setPolygons();

		this.generateRaw();
	};

	this.generateRaw = function() {
		for (let i = 0; i < this.vertices.length; i++) {
			let x = this.vertices[i].x - this.center.x,
					y = this.vertices[i].y - this.center.y,
					z = this.vertices[i].z - this.center.z;
			this.raw.vertices.push(new Coord(x, y, z));
		}

		for (let i = 0; i < this.polygons.length; i++) {
			let p = [];
			for (let j = 0; j < this.polygons[i].elements.length; j++) {
				let x = this.polygons[i].elements[j].x - this.center.x,
						y = this.polygons[i].elements[j].y - this.center.y,
						z = this.polygons[i].elements[j].z - this.center.z;
				let a = new Coord(x, y, z);
				p.push(a);
			}
			this.raw.polygons.push(new Polygon(p));
		}
	};

	this.update = function() {
		// Regenerate polygons applying transformations
		for (let i = 0; i < this.polygons.length; i++) {
			for (let j = 0; j < this.polygons[i].elements.length; j++) {
				// Each element get raw and draw version
				let raw = this.raw.polygons[i].elements[j];
				let draw = this.polygons[i].elements[j];

				let index = this.searchVertexIndex(draw);

				// Apply transformations to raw and update polygon element and vertex associated
				let p = raw.scale(this.scale).rotate(this.rotation).translate(this.translation);
				draw.x = p.x;
				draw.y = p.y;
				draw.z = p.z;

				if (index > -1) {
					this.vertices[index].x = p.x;
					this.vertices[index].y = p.y;
					this.vertices[index].z = p.z;
					this.vertices.n = [0.0, 0.0, 0.0];
				} else {
					console.log("index: ", index, "raw: ", raw, "draw: ", draw, "p: ", p);
				}
			}
			if (i == 0)
				this.polygons[i].calcN(true);
			else
				this.polygons[i].calcN();
		}

		let craw = this.raw.center,
				cdraw = this.center,
				c = craw.scale(this.scale).rotate(this.rotation).translate(this.translation);
		cdraw.x = c.x;
		cdraw.y = c.y;
		cdraw.z = c.z;

		this.verticesNormal();
	};

	this.doScale = function(s) {
		this.scale += s;
		this.scale = Math.max(this.scale, 0);
		this.update();
	};

	this.doRotate = function(rot) {
		this.rotation.x += rot.x;
		this.rotation.y += rot.y;
		this.rotation.z += rot.z;
		this.update();
	};

	this.doTranslate = function(trans) {
		this.translation.x += trans.x;
		this.translation.y += trans.y;
		this.translation.z += trans.z;
		this.update();
	};

	this.setVertices = function() {
		if (this.ended) {
			let c = [0.0, 0.0, 0.0];
			// Simply add every point in nodes circles
			for (let i = 0; i < this.line.nodes.length; i++) {
				for (let j = 0; j < this.line.nodes[i].circle.length; j++) {
					this.vertices.push(this.line.nodes[i].circle[j]);

					c[0] += this.line.nodes[i].circle[j].x;
					c[1] += this.line.nodes[i].circle[j].y;
					c[2] += this.line.nodes[i].circle[j].z;
				}
			}

			// Set world center
			this.center.x = c[0] / this.vertices.length;
			this.center.y = c[1] / this.vertices.length;
			this.center.z = 0.0;

			this.translation.x = this.center.x;
			this.translation.y = this.center.y;
			this.translation.z = this.center.z;
		}
	};

	this.verticesNormal = function() {
		for (let i = 0; i < this.polygons.length; i++) {
			for (let j = 0; j < this.polygons[i].elements.length; j++) {
				let index = this.searchVertexIndex(this.polygons[i].elements[j]);
				if (index > -1) {
					// console.log(index);
					this.vertices[index].n[0] += this.polygons[i].n[0];
					this.vertices[index].n[1] += this.polygons[i].n[1];
					this.vertices[index].n[2] += this.polygons[i].n[2];
				} else {
					console.log(this.polygons[i].elements[j]);
				}
			}
		}
	};

	this.setPolygons = function() {
		if (this.ended) {
			// Create polygon for first face
			let pol1 = [];

			for (let i = 0; i < this.line.nodes[0].circle.length; i++) {
				pol1.push(this.line.nodes[0].circle[i]);
			}

			this.polygons.push(new Polygon(pol1, true));

			// Create polygon for every middle face (12 x node)
			for (let i = 1; i < this.line.nodes.length; i++) {
				for (let j = 0; j < this.line.nodes[i].circle.length; j++) {
					let pA = this.line.nodes[i].circle[j],
							pB = this.line.nodes[i - 1].circle[j],
							pC, pD;

					if (j == this.line.nodes[i].circle.length - 1) {
						pC = this.line.nodes[i - 1].circle[0];
						pD = this.line.nodes[i].circle[0];
					} else {
						pC = this.line.nodes[i - 1].circle[j + 1];
						pD = this.line.nodes[i].circle[j + 1];
					}

					let pol = new Polygon([pA, pB, pC, pD]);

					// Update pA normal
					this.line.nodes[i].circle[j].n[0] += pol.n[0];
					this.line.nodes[i].circle[j].n[1] += pol.n[1];
					this.line.nodes[i].circle[j].n[2] += pol.n[2];
					// Update pB normal
					this.line.nodes[i - 1].circle[j].n[0] += pol.n[0];
					this.line.nodes[i - 1].circle[j].n[1] += pol.n[1];
					this.line.nodes[i - 1].circle[j].n[2] += pol.n[2];

					if (j == this.line.nodes[i].circle.length - 1) {
						// Update pC normal
						this.line.nodes[i - 1].circle[0].n[0] += pol.n[0];
						this.line.nodes[i - 1].circle[0].n[1] += pol.n[1];
						this.line.nodes[i - 1].circle[0].n[2] += pol.n[2];
						// Update pD normal
						this.line.nodes[i].circle[0].n[0] += pol.n[0];
						this.line.nodes[i].circle[0].n[1] += pol.n[1];
						this.line.nodes[i].circle[0].n[2] += pol.n[2];
					} else {
						// Update pC normal
						this.line.nodes[i - 1].circle[j + 1].n[0] += pol.n[0];
						this.line.nodes[i - 1].circle[j + 1].n[1] += pol.n[1];
						this.line.nodes[i - 1].circle[j + 1].n[2] += pol.n[2];
						// Update pD normal
						this.line.nodes[i].circle[j + 1].n[0] += pol.n[0];
						this.line.nodes[i].circle[j + 1].n[1] += pol.n[1];
						this.line.nodes[i].circle[j + 1].n[2] += pol.n[2];
					}

					// Add polygon
					this.polygons.push(pol);
				}
			}

			// Create polygon with last face
			let pol2 = [];
			
			for (let i = 0; i < this.line.nodes[this.line.nodes.length - 1].circle.length; i++) {
				pol2.push(this.line.nodes[this.line.nodes.length - 1].circle[i]);
			}

			this.polygons.push(new Polygon(pol2));
		}
	};

	this.drawLine = function(m_point) {
		let vertices = [];

		for (let i = 0; i < this.line.nodes.length; i++) {
			vertices.push(this.line.nodes[i].point.x);
			vertices.push(this.line.nodes[i].point.y);
			vertices.push(this.line.nodes[i].point.z);
			vertices.push(1.0);
			vertices.push(0.0);
			vertices.push(0.0);
			if (draw_options.opacity_enabled) vertices.push(1.0);
		}

		// Write vertices into buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		// Draw points
		if (draw_options.opacity_enabled) {
			gl.drawArrays(gl.POINTS, 0, vertices.length / 7);
		} else {
			gl.drawArrays(gl.POINTS, 0, vertices.length / 6);
		}

		vertices = [];
		for (let i = 0; i < this.line.nodes.length; i++) {
			vertices.push(this.line.nodes[i].point.x);
			vertices.push(this.line.nodes[i].point.y);
			vertices.push(this.line.nodes[i].point.z);
			vertices.push(0.6);
			vertices.push(0.6);
			vertices.push(0.6);
			if (draw_options.opacity_enabled) vertices.push(1.0);
		}
		vertices.push(m_point.x);
		vertices.push(m_point.y);
		vertices.push(m_point.z);
		vertices.push(0.0);
		vertices.push(1.0);
		vertices.push(0.0);
		if (draw_options.opacity_enabled) vertices.push(1.0);

		// Write vertices into buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		if (draw_options.opacity_enabled) {
			// Draw lines
			gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 7);
		} else {
			// Draw lines
			gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 6);
		}
	};

	this.searchVertexIndex = function(v) {
		for (let i = 0; i < this.vertices.length; i++) {
			if (this.vertices[i].x == v.x && this.vertices[i].y == v.y && this.vertices[i].z == v.z)
				return i;
		}
		return -1;
	};
	
	this.drawObject = function(withID) {
		if (withID) {
			// Draw only surfaces with ID as color
			let color = hexToRgb(this.id);
			for (let i = 0; i < this.polygons.length; i++) {
					let v = [];

					for (let j = 0; j < this.polygons[i].elements.length; j++) {
						let index = this.searchVertexIndex(this.polygons[i].elements[j]);
						let vertex = this.vertices[index];

						v.push(vertex.x);
						v.push(vertex.y);
						v.push(vertex.z);
						v.push(color.r);
						v.push(color.g);
						v.push(color.b);
						if (draw_options.opacity_enabled) v.push(this.opacity);
					}

					// Write vertices into buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

					if (draw_options.opacity_enabled) {
						// Draw points
						gl.drawArrays(gl.TRIANGLE_FAN, 0, v.length / 7);
					} else {
						// Draw points
						gl.drawArrays(gl.TRIANGLE_FAN, 0, v.length / 6);
					}
				}
		} else {
			// Draw normals
			if (draw_options.draw_normals) {
				for (let i = 0; i < this.polygons.length; i++) {
					for (let j = 0; j < this.polygons[i].elements.length; j++) {
						let vertices = [];

						let pA = this.polygons[i].elements[j];
						let n = this.polygons[i].n;

						// pA colored
						vertices.push(pA.x);
						vertices.push(pA.y);
						vertices.push(pA.z);
						vertices.push(draw_options.normals_color[0]);
						vertices.push(draw_options.normals_color[1]);
						vertices.push(draw_options.normals_color[2]);
						if (draw_options.opacity_enabled) vertices.push(1.0);

						// Normal point
						vertices.push(pA.x + n[0] * 50);
						vertices.push(pA.y + n[1] * 50);
						vertices.push(pA.z + n[2] * 50);
						vertices.push(draw_options.normals_color[0]);
						vertices.push(draw_options.normals_color[1]);
						vertices.push(draw_options.normals_color[2]);
						if (draw_options.opacity_enabled) vertices.push(1.0);

						// Write vertices into buffer
						gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

						if (draw_options.opacity_enabled) {
							gl.drawArrays(gl.LINES, 0, vertices.length / 7);
						} else {
							// Draw lines
							gl.drawArrays(gl.LINES, 0, vertices.length / 6);
						}
					}
				}

				for (let i = 0; i < this.vertices.length; i++) {
					let vertices = [];

					let pA = this.vertices[i];
					let n = this.vertices[i].n;

					// pA colored
					vertices.push(pA.x);
					vertices.push(pA.y);
					vertices.push(pA.z);
					vertices.push(draw_options.normals_color[0]);
					vertices.push(draw_options.normals_color[1]);
					vertices.push(draw_options.normals_color[2]);
					if (draw_options.opacity_enabled) vertices.push(1.0);

					// Normal point
					vertices.push(pA.x + n[0] * 50);
					vertices.push(pA.y + n[1] * 50);
					vertices.push(pA.z + n[2] * 50);
					vertices.push(draw_options.normals_color[0]);
					vertices.push(draw_options.normals_color[1]);
					vertices.push(draw_options.normals_color[2]);
					if (draw_options.opacity_enabled) vertices.push(1.0);

					// Write vertices into buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

					if (draw_options.opacity_enabled) {
						gl.drawArrays(gl.LINES, 0, vertices.length / 7);
					} else {
						// Draw lines
						gl.drawArrays(gl.LINES, 0, vertices.length / 6);
					}
				}
			}

			// Draw polygons
			if (draw_options.draw_surfaces) {
				for (let i = 0; i < this.polygons.length; i++) {
					let v = [];

					for (let j = 0; j < this.polygons[i].elements.length; j++) {
						let index = this.searchVertexIndex(this.polygons[i].elements[j]);
						let vertex = this.vertices[index];

						// Calc light
						let I = [0.0, 0.0, 0.0];
						let normal = vertex.n;

						// If smooth shading is not enable then normal of the polygon is used
						if (!draw_options.smooth_shading) {
							normal = this.polygons[i].n;
						}

						for (let j = 0; j < lights.length; j++) {
							if (lights[j].enabled) {

								let light_direction = [];

								if (lights[j].type === "directional") {
									light_direction[0] = lights[j].direction[0];
									light_direction[1] = lights[j].direction[1];
									light_direction[2] = lights[j].direction[2];
								} else if (lights[j].type === "point") {
									light_direction[0] = lights[j].point[0] - vertex.x;
									light_direction[1] = lights[j].point[1] - vertex.y;
									light_direction[2] = lights[j].point[2] - vertex.z;
								} else {
									light_direction = [0, 0, 0];
								}


								if (draw_options.light_ambient) {
									let Ia = [];

									if (this.picked) {
										Ia = [0.5 * lights[j].color[0],
													0.5 * lights[j].color[1],
													0.5 * lights[j].color[2]];
									} else {
										Ia = [draw_options.surface_ka[0] * lights[j].color[0],
													draw_options.surface_ka[1] * lights[j].color[1],
													draw_options.surface_ka[2] * lights[j].color[2]];
									}

									I[0] += Ia[0];
									I[1] += Ia[1];
									I[2] += Ia[2];
								}

								if (draw_options.light_difuse) {
									let S = Math.min(dotProduct(normalizeVector(normal), normalizeVector(light_direction)), 1.0);

									let Id = [draw_options.surface_kd[0] * lights[j].color[0] * S,
														draw_options.surface_kd[1] * lights[j].color[1] * S,
														draw_options.surface_kd[2] * lights[j].color[2] * S];

									I[0] += Id[0];
									I[1] += Id[1];
									I[2] += Id[2];
								}

								if (draw_options.light_specular) {
									// Get reflection: r = 2 * (n · l) * n - l
									let _n = normalizeVector(normal);
									let _l = normalizeVector(light_direction);
									let k = 2 * dotProduct(_n, _l);

									let r = [k * _n[0] - _l[0],
													 k * _n[1] - _l[1],
													 k * _n[2] - _l[2],];

									// Get angle
									let a = getAngle(draw_options.viewer.position, r, false);

									// Get light
									let S = 0.0;

									if (a > 0 && a < Math.PI / 2 && k > 0) { // This can be only k > 0
										S = Math.min(Math.pow(Math.cos(a), draw_options.surface_ns), 1.0);
									}

									let Is = [draw_options.surface_ks[0] * lights[j].color[0] * S,
														draw_options.surface_ks[1] * lights[j].color[1] * S,
														draw_options.surface_ks[2] * lights[j].color[2] * S];

									I[0] += Is[0];
									I[1] += Is[1];
									I[2] += Is[2];
								}
							}
						}

						// Check light values
						I[0] = Math.min(Math.max(I[0], 0.0), 1.0);
						I[1] = Math.min(Math.max(I[1], 0.0), 1.0);
						I[2] = Math.min(Math.max(I[2], 0.0), 1.0);

						// Push vertex
						v.push(vertex.x);
						v.push(vertex.y);
						v.push(vertex.z);
						v.push(I[0]);
						v.push(I[1]);
						v.push(I[2]);
						if (draw_options.opacity_enabled) v.push(this.opacity);
					}

					// Write vertices into buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

					if (draw_options.opacity_enabled) {
						// Draw points
						gl.drawArrays(gl.TRIANGLE_FAN, 0, v.length / 7);
					} else {
						// Draw points
						gl.drawArrays(gl.TRIANGLE_FAN, 0, v.length / 6);
					}
				}
			}

			// Draw polygons border
			if (draw_options.draw_skeleton) {
				for (let i = 0; i < this.polygons.length; i++) {
					let v = [];

					for (let j = 0; j < this.polygons[i].elements.length; j++) {
						v.push(this.polygons[i].elements[j].x);
						v.push(this.polygons[i].elements[j].y);
						v.push(this.polygons[i].elements[j].z);
						v.push(draw_options.skeleton_color[0]);
						v.push(draw_options.skeleton_color[1]);
						v.push(draw_options.skeleton_color[2]);
						if (draw_options.opacity_enabled) v.push(1.0);
					}

					// Write vertices into buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

					if (draw_options.opacity_enabled) {
						// Draw points
						gl.drawArrays(gl.LINE_LOOP, 0, v.length / 7);
					} else {
						// Draw points
						gl.drawArrays(gl.LINE_LOOP, 0, v.length / 6);
					}
				}
			}

			// Draw vertices
			if (draw_options.draw_points) {
				let v = [];

				for (let i = 0; i < this.vertices.length; i++) {
					v.push(this.vertices[i].x);
					v.push(this.vertices[i].y);
					v.push(this.vertices[i].z);
					v.push(draw_options.points_color[0]);
					v.push(draw_options.points_color[1]);
					v.push(draw_options.points_color[2]);
					if (draw_options.opacity_enabled) v.push(1.0);
				}

				// Write vertices into buffer
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

				if (draw_options.opacity_enabled) {
					// Draw points
					gl.drawArrays(gl.POINTS, 0, v.length / 7);
				} else {
					// Draw points
					gl.drawArrays(gl.POINTS, 0, v.length / 6);
				}
			}
		}
	};
}
