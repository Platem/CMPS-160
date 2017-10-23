var Coord = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.r = 0.0;
	this.r = 0.0;
	this.r = 0.0;

	this.n = [0.0, 0.0, 0.0];
}

var Node = function(coord) {
	this.point = new Coord(coord.x, coord.y, coord.z);
	this.circle = null;
}

var Line = function() {
	// Array of nodes
	this.nodes = [];
};

var Polygon = function() {
	this.elements = [];

	this.n = [0.0, 0.0, 0.0];
}

var Obj = function() {
	this.ended = false;
	this.visible = true;

	this.line = new Line();

	this.vertices = [];
	this.polygons = [];

	this.generate = function() {
		this.ended = true;

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

					mid.push(new Coord(pB[0], pB[1], pB[2], 0.0, 0.0, 1.0));
				}

				// Now we have mid circle
				this.line.nodes[i - 1].circle = mid;
			}
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
		}

		// Write vertices into buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		// Draw points
		gl.drawArrays(gl.POINTS, 0, vertices.length / 6);

		vertices = [];
		for (let i = 0; i < this.line.nodes.length; i++) {
			vertices.push(this.line.nodes[i].point.x);
			vertices.push(this.line.nodes[i].point.y);
			vertices.push(this.line.nodes[i].point.z);
			vertices.push(0.6);
			vertices.push(0.6);
			vertices.push(0.6);
		}
		vertices.push(m_point.x);
		vertices.push(m_point.y);
		vertices.push(m_point.z);
		vertices.push(0.0);
		vertices.push(1.0);
		vertices.push(0.0);

		// Write vertices into buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		// Draw lines
		gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 6);
	}
	
	this.drawObject = function() {
		// Draw normals
		if (draw_options.draw_normals) {
			for (let i = 1; i < this.line.nodes.length; i++) {
				for (let j = 0; j < this.line.nodes[i].circle.length; j++) {
					let vertices = [];
					let pA = this.line.nodes[i - 1].circle[j],
							pB,
							pC = this.line.nodes[i].circle[j];

					if (j == this.line.nodes[i].circle.length - 1) {
						pB = this.line.nodes[i - 1].circle[0];
					} else {
						pB = this.line.nodes[i - 1].circle[j + 1];
					}

					let v = [pB.x - pA.x, pB.y - pA.y, pB.z - pA.z];
					let w = [pC.x - pA.x, pC.y - pA.y, pB.z - pC.z];

					let n = crossProduct(v, w, true);

					// pA colored
					vertices.push(pA.x);
					vertices.push(pA.y);
					vertices.push(pA.z);
					vertices.push(1.0);
					vertices.push(0.75);
					vertices.push(0.79);

					// Normal point
					vertices.push(pA.x + n[0] * 0.3);
					vertices.push(pA.y + n[1] * 0.3);
					vertices.push(pA.z + n[2] * 0.3);
					vertices.push(1.0);
					vertices.push(0.75);
					vertices.push(0.79);

					// Write vertices into buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

					// Draw lines
					gl.drawArrays(gl.LINES, 0, vertices.length / 6);

				}
			}
		}

		// Draw surfaces
		if (draw_options.draw_surfaces) {
			let surf1 = [],
					surf2 = [];

			// First circle surface
			// Calculate normal with fisrt 3 points to get color
			let A1 = this.line.nodes[0].circle[1],
					B1 = this.line.nodes[0].circle[0],
					C1 = this.line.nodes[0].circle[2];

			let v1 = [B1.x - A1.x, B1.y - A1.y, B1.z - A1.z];
			let w1 = [C1.x - A1.x, C1.y - A1.y, B1.z - C1.z];

			let n1 = crossProduct(v1, w1, true);

			// Get surface color
			let S1 = Math.min(Math.max(dotProduct(n1, draw_options.light_position), 0.0), 1);

			let Id1 = [draw_options.surface_kd[0] * draw_options.light_position[0] * S1,
								 draw_options.surface_kd[1] * draw_options.light_position[1] * S1,
								 draw_options.surface_kd[2] * draw_options.light_position[2] * S1];

			for (let i = 0; i < this.line.nodes[0].circle.length; i++) {
				surf1.push(this.line.nodes[0].circle[i].x);
				surf1.push(this.line.nodes[0].circle[i].y);
				surf1.push(this.line.nodes[0].circle[i].z);
				surf1.push(Id1[0]);
				surf1.push(Id1[1]);
				surf1.push(Id1[2]);
			}

			// Write vertex into buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(surf1), gl.STATIC_DRAW);

			// Draw points
			gl.drawArrays(gl.TRIANGLE_FAN, 0, surf1.length / 6);

			// Nodes
			for (let i = 1; i < this.line.nodes.length; i++) {
				// Previous faces
				for (let j = 0; j < this.line.nodes[i].circle.length; j++) {
					let vertices = [];
					if (j == this.line.nodes[i].circle.length - 1) {
						// Get normal vector
						let pA = this.line.nodes[i - 1].circle[j],
								pB = this.line.nodes[i - 1].circle[0],
								pC = this.line.nodes[i].circle[j];

						let v = [pB.x - pA.x, pB.y - pA.y, pB.z - pA.z];
						let w = [pC.x - pA.x, pC.y - pA.y, pB.z - pC.z];

						let n = crossProduct(v, w, true);

						// Get surface color
						let S = Math.min(Math.max(dotProduct(n, draw_options.light_position), 0.0), 1);
						let Id = [draw_options.surface_kd[0] * draw_options.light_position[0] * S,
											draw_options.surface_kd[1] * draw_options.light_position[1] * S,
											draw_options.surface_kd[2] * draw_options.light_position[2] * S];
						
						// First
						vertices.push(this.line.nodes[i].circle[j].x);
						vertices.push(this.line.nodes[i].circle[j].y);
						vertices.push(this.line.nodes[i].circle[j].z);
						vertices.push(Id[0]);
						vertices.push(Id[1]);
						vertices.push(Id[2]);

						// Second
						vertices.push(this.line.nodes[i - 1].circle[j].x);
						vertices.push(this.line.nodes[i - 1].circle[j].y);
						vertices.push(this.line.nodes[i - 1].circle[j].z);
						vertices.push(Id[0]);
						vertices.push(Id[1]);
						vertices.push(Id[2]);

						// Third
						vertices.push(this.line.nodes[i - 1].circle[0].x);
						vertices.push(this.line.nodes[i - 1].circle[0].y);
						vertices.push(this.line.nodes[i - 1].circle[0].z);
						vertices.push(Id[0]);
						vertices.push(Id[1]);
						vertices.push(Id[2]);

						// Fourth
						vertices.push(this.line.nodes[i].circle[0].x);
						vertices.push(this.line.nodes[i].circle[0].y);
						vertices.push(this.line.nodes[i].circle[0].z);
						vertices.push(Id[0]);
						vertices.push(Id[1]);
						vertices.push(Id[2]);
					} else {
						// Get normal vector
						let pA = this.line.nodes[i - 1].circle[j],
								pB = this.line.nodes[i - 1].circle[j + 1],
								pC = this.line.nodes[i].circle[j];

						let v = [pB.x - pA.x, pB.y - pA.y, pB.z - pA.z];
						let w = [pC.x - pA.x, pC.y - pA.y, pB.z - pC.z];

						let n = crossProduct(v, w, true);

						// Get surface color
						let S = Math.min(Math.max(dotProduct(n, draw_options.light_position), 0.0), 1);
						let Id = [draw_options.surface_kd[0] * draw_options.light_position[0] * S,
											draw_options.surface_kd[1] * draw_options.light_position[1] * S,
											draw_options.surface_kd[2] * draw_options.light_position[2] * S];
						
						// First
						vertices.push(this.line.nodes[i].circle[j].x);
						vertices.push(this.line.nodes[i].circle[j].y);
						vertices.push(this.line.nodes[i].circle[j].z);
						vertices.push(Id[0]);
						vertices.push(Id[1]);
						vertices.push(Id[2]);

						// Second
						vertices.push(this.line.nodes[i - 1].circle[j].x);
						vertices.push(this.line.nodes[i - 1].circle[j].y);
						vertices.push(this.line.nodes[i - 1].circle[j].z);
						vertices.push(Id[0]);
						vertices.push(Id[1]);
						vertices.push(Id[2]);

						// Third
						vertices.push(this.line.nodes[i - 1].circle[j + 1].x);
						vertices.push(this.line.nodes[i - 1].circle[j + 1].y);
						vertices.push(this.line.nodes[i - 1].circle[j + 1].z);
						vertices.push(Id[0]);
						vertices.push(Id[1]);
						vertices.push(Id[2]);

						// Fourth
						vertices.push(this.line.nodes[i].circle[j + 1].x);
						vertices.push(this.line.nodes[i].circle[j + 1].y);
						vertices.push(this.line.nodes[i].circle[j + 1].z);
						vertices.push(Id[0]);
						vertices.push(Id[1]);
						vertices.push(Id[2]);
					}

					// Write vertex into buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

					// Draw points
					gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 6);
				}
			}

			// Last circle surface
			// Calculate normal with fisrt 3 points to get color
			let A2 = this.line.nodes[this.line.nodes.length - 1].circle[1],
					B2 = this.line.nodes[this.line.nodes.length - 1].circle[0],
					C2 = this.line.nodes[this.line.nodes.length - 1].circle[2];

			let v2 = [B2.x - A2.x, B2.y - A2.y, B2.z - A2.z];
			let w2 = [C2.x - A2.x, C2.y - A2.y, B2.z - C2.z];

			let n2 = crossProduct(w1, v1, true);

			// Get surface color
			let S2 = Math.min(Math.max(dotProduct(n2, draw_options.light_position), 0.0), 1);

			let Id2 = [draw_options.surface_kd[0] * draw_options.light_position[0] * S2,
								 draw_options.surface_kd[1] * draw_options.light_position[1] * S2,
								 draw_options.surface_kd[2] * draw_options.light_position[2] * S2];

			for (let i = 0; i < this.line.nodes[this.line.nodes.length - 1].circle.length; i++) {
				surf2.push(this.line.nodes[this.line.nodes.length - 1].circle[i].x);
				surf2.push(this.line.nodes[this.line.nodes.length - 1].circle[i].y);
				surf2.push(this.line.nodes[this.line.nodes.length - 1].circle[i].z);
				surf2.push(Id1[0]);
				surf2.push(Id1[1]);
				surf2.push(Id1[2]);
			}

			// Write vertex into buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(surf2), gl.STATIC_DRAW);

			// Draw points
			gl.drawArrays(gl.TRIANGLE_FAN, 0, surf2.length / 6);
		}

		// Draw skeleton
		if (draw_options.draw_skeleton) {
			for (let i = 1; i < this.line.nodes.length; i++) {
				for (let j = 0; j < this.line.nodes[i].circle.length; j++) {
					let vertices = [];

					if (j == this.line.nodes[i].circle.length - 1) {
						// First
						vertices.push(this.line.nodes[i].circle[j].x);
						vertices.push(this.line.nodes[i].circle[j].y);
						vertices.push(this.line.nodes[i].circle[j].z);
						vertices.push(0.0);
						vertices.push(0.0);
						vertices.push(1.0);

						// Second
						vertices.push(this.line.nodes[i - 1].circle[j].x);
						vertices.push(this.line.nodes[i - 1].circle[j].y);
						vertices.push(this.line.nodes[i - 1].circle[j].z);
						vertices.push(0.0);
						vertices.push(0.0);
						vertices.push(1.0);

						// Third
						vertices.push(this.line.nodes[i - 1].circle[0].x);
						vertices.push(this.line.nodes[i - 1].circle[0].y);
						vertices.push(this.line.nodes[i - 1].circle[0].z);
						vertices.push(0.0);
						vertices.push(0.0);
						vertices.push(1.0);

						// Fourth
						vertices.push(this.line.nodes[i].circle[0].x);
						vertices.push(this.line.nodes[i].circle[0].y);
						vertices.push(this.line.nodes[i].circle[0].z);
						vertices.push(0.0);
						vertices.push(0.0);
						vertices.push(1.0);
					} else {
						// First
						vertices.push(this.line.nodes[i].circle[j].x);
						vertices.push(this.line.nodes[i].circle[j].y);
						vertices.push(this.line.nodes[i].circle[j].z);
						vertices.push(0.0);
						vertices.push(0.0);
						vertices.push(1.0);

						// Second
						vertices.push(this.line.nodes[i - 1].circle[j].x);
						vertices.push(this.line.nodes[i - 1].circle[j].y);
						vertices.push(this.line.nodes[i - 1].circle[j].z);
						vertices.push(0.0);
						vertices.push(0.0);
						vertices.push(1.0);

						// Third
						vertices.push(this.line.nodes[i - 1].circle[j + 1].x);
						vertices.push(this.line.nodes[i - 1].circle[j + 1].y);
						vertices.push(this.line.nodes[i - 1].circle[j + 1].z);
						vertices.push(0.0);
						vertices.push(0.0);
						vertices.push(1.0);

						// Fourth
						vertices.push(this.line.nodes[i].circle[j + 1].x);
						vertices.push(this.line.nodes[i].circle[j + 1].y);
						vertices.push(this.line.nodes[i].circle[j + 1].z);
						vertices.push(0.0);
						vertices.push(0.0);
						vertices.push(1.0);
					}

					// Write vertex into buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

					// Draw points
					gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 6);
				}
			}		
			for (let i = 0; i < this.line.nodes.length; i++) {
				let vertices = [];
				// Draw mid circle
				for (let j = 0; j < this.line.nodes[i].circle.length; j++) {
					vertices.push(this.line.nodes[i].circle[j].x);
					vertices.push(this.line.nodes[i].circle[j].y);
					vertices.push(this.line.nodes[i].circle[j].z);
					vertices.push(0.0);
					vertices.push(0.0);
					vertices.push(1.0);
				}

				// Write vertices into buffer
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

				// Draw lines
				gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 6);
			}
		}

		// Draw points
		if (draw_options.draw_points) {
			for (let i = 0; i < this.line.nodes.length; i++) {
				let vertices = [];

				for (let j = 0; j < this.line.nodes[i].circle.length; j++) {
					vertices.push(this.line.nodes[i].circle[j].x);
					vertices.push(this.line.nodes[i].circle[j].y);
					vertices.push(this.line.nodes[i].circle[j].z);
					vertices.push(1.0);
					vertices.push(0.0);
					vertices.push(0.0);
				}

				// Write vertices into buffer
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

				// Draw points
				gl.drawArrays(gl.POINTS, 0, vertices.length / 6);
			}
		}
	}
}
