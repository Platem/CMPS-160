var Table = function(_center, _normal) {
	this.reset = function() {
		this.center = this.original.center;
		this.normal = this.original.normal;

		this.generateVertices();
	}

	this.generateVertices = function() {
		this.box = [];
		this.boxNormals = [];
		this.ribbons = [];
		this.ribbonsNormals = [];

		// Back face
		this.box.push([-240, 240, 0]);
		this.box.push([-240, -240, 0]);
		this.box.push([240, -240, 0]);
		this.box.push([240, -240, 0]);
		this.box.push([240, 240, 0]);
		this.box.push([-240, 240, 0]);
		this.boxNormals.push([0.0, 0.0, -1.0]);
		this.boxNormals.push([0.0, 0.0, -1.0]);
		this.boxNormals.push([0.0, 0.0, -1.0]);
		this.boxNormals.push([0.0, 0.0, -1.0]);
		this.boxNormals.push([0.0, 0.0, -1.0]);
		this.boxNormals.push([0.0, 0.0, -1.0]);

		// Left border
		this.box.push([-240, 240, 0]);
		this.box.push([-240, -240, 0]);
		this.box.push([-240, -240, 50]);
		this.box.push([-240, 240, 0]);
		this.box.push([-240, -240, 50]);
		this.box.push([-240, 240, 50]);
		this.boxNormals.push([-1.0, 0.0, 0.0]);
		this.boxNormals.push([-1.0, 0.0, 0.0]);
		this.boxNormals.push([-1.0, 0.0, 0.0]);
		this.boxNormals.push([-1.0, 0.0, 0.0]);
		this.boxNormals.push([-1.0, 0.0, 0.0]);
		this.boxNormals.push([-1.0, 0.0, 0.0]);

		// Right Border
		this.box.push([240, -240, 0]);
		this.box.push([240, 240, 0]);
		this.box.push([240, 240, 50]);
		this.box.push([240, -240, 0]);
		this.box.push([240, 240, 50]);
		this.box.push([240, -240, 50]);
		this.boxNormals.push([1.0, 0.0, 0.0]);
		this.boxNormals.push([1.0, 0.0, 0.0]);
		this.boxNormals.push([1.0, 0.0, 0.0]);
		this.boxNormals.push([1.0, 0.0, 0.0]);
		this.boxNormals.push([1.0, 0.0, 0.0]);
		this.boxNormals.push([1.0, 0.0, 0.0]);

		// Top border
		this.box.push([-240, 240, 0]);
		this.box.push([-240, 240, 50]);
		this.box.push([240, 240, 50]);
		this.box.push([240, 240, 50]);
		this.box.push([240, 240, 0]);
		this.box.push([-240, 240, 0]);
		this.boxNormals.push([0.0, 1.0, 0.0]);
		this.boxNormals.push([0.0, 1.0, 0.0]);
		this.boxNormals.push([0.0, 1.0, 0.0]);
		this.boxNormals.push([0.0, 1.0, 0.0]);
		this.boxNormals.push([0.0, 1.0, 0.0]);
		this.boxNormals.push([0.0, 1.0, 0.0]);

		// Bottom border
		this.box.push([-240, -240, 50]);
		this.box.push([-240, -240, 0]);
		this.box.push([240, -240, 0]);
		this.box.push([240, -240, 0]);
		this.box.push([240, -240, 50]);
		this.box.push([-240, -240, 50]);
		this.boxNormals.push([0.0, -1.0, 0.0]);
		this.boxNormals.push([0.0, -1.0, 0.0]);
		this.boxNormals.push([0.0, -1.0, 0.0]);
		this.boxNormals.push([0.0, -1.0, 0.0]);
		this.boxNormals.push([0.0, -1.0, 0.0]);
		this.boxNormals.push([0.0, -1.0, 0.0]);

		// Front face
		this.box.push([-240, 240, 50]);
		this.box.push([-240, -240, 50]);
		this.box.push([240, -240, 50]);
		this.box.push([240, -240, 50]);
		this.box.push([240, 240, 50]);
		this.box.push([-240, 240, 50]);
		this.boxNormals.push([0.0, 0.0, 1.0]);
		this.boxNormals.push([0.0, 0.0, 1.0]);
		this.boxNormals.push([0.0, 0.0, 1.0]);
		this.boxNormals.push([0.0, 0.0, 1.0]);
		this.boxNormals.push([0.0, 0.0, 1.0]);
		this.boxNormals.push([0.0, 0.0, 1.0]);

		// Upper horizontal ribbon
			// Left
			this.ribbons.push([-240, 90, 50]);
			this.ribbons.push([-240, 70, 50]);
			this.ribbons.push([-240, 70, 70]);
			this.ribbons.push([-240, 70, 70]);
			this.ribbons.push([-240, 90, 70]);
			this.ribbons.push([-240, 90, 50]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);

			// Right
			this.ribbons.push([240, 90, 50]);
			this.ribbons.push([240, 90, 70]);
			this.ribbons.push([240, 70, 70]);
			this.ribbons.push([240, 70, 70]);
			this.ribbons.push([240, 70, 50]);
			this.ribbons.push([240, 90, 50]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);

			// Back
			this.ribbons.push([-240, 90, 50]);
			this.ribbons.push([240, 90, 50]);
			this.ribbons.push([240, 70, 50]);
			this.ribbons.push([240, 70, 50]);
			this.ribbons.push([-240, 70, 50]);
			this.ribbons.push([-240, 90, 50]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);

			// Front
			this.ribbons.push([-240, 90, 70]);
			this.ribbons.push([240, 90, 70]);
			this.ribbons.push([240, 70, 70]);
			this.ribbons.push([240, 70, 70]);
			this.ribbons.push([-240, 70, 70]);
			this.ribbons.push([-240, 90, 70]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);

			// Top
			this.ribbons.push([-240, 90, 50]);
			this.ribbons.push([-240, 90, 70]);
			this.ribbons.push([240, 90, 70]);
			this.ribbons.push([240, 90, 70]);
			this.ribbons.push([240, 90, 50]);
			this.ribbons.push([-240, 90, 50]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);

			// Bottom
			this.ribbons.push([-240, 70, 50]);
			this.ribbons.push([-240, 70, 70]);
			this.ribbons.push([240, 70, 70]);
			this.ribbons.push([240, 70, 70]);
			this.ribbons.push([240, 70, 50]);
			this.ribbons.push([-240, 70, 50]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);

		// Lower horizontal ribbon
			// Left
			this.ribbons.push([-240, -90, 50]);
			this.ribbons.push([-240, -70, 50]);
			this.ribbons.push([-240, -70, 70]);
			this.ribbons.push([-240, -70, 70]);
			this.ribbons.push([-240, -90, 70]);
			this.ribbons.push([-240, -90, 50]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);

			// Right
			this.ribbons.push([240, -90, 50]);
			this.ribbons.push([240, -90, 70]);
			this.ribbons.push([240, -70, 70]);
			this.ribbons.push([240, -70, 70]);
			this.ribbons.push([240, -70, 50]);
			this.ribbons.push([240, -90, 50]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);

			// Back
			this.ribbons.push([-240, -90, 50]);
			this.ribbons.push([240, -90, 50]);
			this.ribbons.push([240, -70, 50]);
			this.ribbons.push([240, -70, 50]);
			this.ribbons.push([-240, -70, 50]);
			this.ribbons.push([-240, -90, 50]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);
			this.ribbonsNormals.push([0.0, 0.0, -1.0]);

			// Front
			this.ribbons.push([-240, -90, 70]);
			this.ribbons.push([240, -90, 70]);
			this.ribbons.push([240, -70, 70]);
			this.ribbons.push([240, -70, 70]);
			this.ribbons.push([-240, -70, 70]);
			this.ribbons.push([-240, -90, 70]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);

			// Top
			this.ribbons.push([-240, -90, 50]);
			this.ribbons.push([-240, -90, 70]);
			this.ribbons.push([240, -90, 70]);
			this.ribbons.push([240, -90, 70]);
			this.ribbons.push([240, -90, 50]);
			this.ribbons.push([-240, -90, 50]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);

			// Bottom
			this.ribbons.push([-240, -70, 50]);
			this.ribbons.push([-240, -70, 70]);
			this.ribbons.push([240, -70, 70]);
			this.ribbons.push([240, -70, 70]);
			this.ribbons.push([240, -70, 50]);
			this.ribbons.push([-240, -70, 50]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);

		// Left vertical ribbon
			// Left
			this.ribbons.push([-90, 240, 50]);
			this.ribbons.push([-90, -240, 50]);
			this.ribbons.push([-90, -240, 70]);
			this.ribbons.push([-90, -240, 70]);
			this.ribbons.push([-90, 240, 70]);
			this.ribbons.push([-90, 240, 50]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);

			// Right
			this.ribbons.push([-70, 240, 50]);
			this.ribbons.push([-70, 240, 70]);
			this.ribbons.push([-70, -240, 70]);
			this.ribbons.push([-70, -240, 70]);
			this.ribbons.push([-70, -240, 50]);
			this.ribbons.push([-70, 240, 50]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);

			// Top
			this.ribbons.push([-90, 240, 50]);
			this.ribbons.push([-90, 240, 70]);
			this.ribbons.push([-70, 240, 70]);
			this.ribbons.push([-70, 240, 70]);
			this.ribbons.push([-70, 240, 50]);
			this.ribbons.push([-90, 240, 50]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);

			// Bottom
			this.ribbons.push([-90, -240, 50]);
			this.ribbons.push([-70, -240, 50]);
			this.ribbons.push([-70, -240, 70]);
			this.ribbons.push([-70, -240, 70]);
			this.ribbons.push([-90, -240, 70]);
			this.ribbons.push([-90, -240, 50]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);

			// Front
			this.ribbons.push([-90, 240, 70]);
			this.ribbons.push([-90, -240, 70]);
			this.ribbons.push([-70, -240, 70]);
			this.ribbons.push([-70, -240, 70]);
			this.ribbons.push([-70, 240, 70]);
			this.ribbons.push([-90, 240, 70]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);

		// Right vertical ribbon
			// Left
			this.ribbons.push([90, 240, 50]);
			this.ribbons.push([90, -240, 50]);
			this.ribbons.push([90, -240, 70]);
			this.ribbons.push([90, -240, 70]);
			this.ribbons.push([90, 240, 70]);
			this.ribbons.push([90, 240, 50]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([-1.0, 0.0, 0.0]);

			// Right
			this.ribbons.push([70, 240, 50]);
			this.ribbons.push([70, 240, 70]);
			this.ribbons.push([70, -240, 70]);
			this.ribbons.push([70, -240, 70]);
			this.ribbons.push([70, -240, 50]);
			this.ribbons.push([70, 240, 50]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);
			this.ribbonsNormals.push([1.0, 0.0, 0.0]);

			// Top
			this.ribbons.push([90, 240, 50]);
			this.ribbons.push([90, 240, 70]);
			this.ribbons.push([70, 240, 70]);
			this.ribbons.push([70, 240, 70]);
			this.ribbons.push([70, 240, 50]);
			this.ribbons.push([90, 240, 50]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);
			this.ribbonsNormals.push([0.0, 1.0, 0.0]);

			// Bottom
			this.ribbons.push([90, -240, 50]);
			this.ribbons.push([70, -240, 50]);
			this.ribbons.push([70, -240, 70]);
			this.ribbons.push([70, -240, 70]);
			this.ribbons.push([90, -240, 70]);
			this.ribbons.push([90, -240, 50]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);
			this.ribbonsNormals.push([0.0, -1.0, 0.0]);

			// Front
			this.ribbons.push([90, 240, 70]);
			this.ribbons.push([90, -240, 70]);
			this.ribbons.push([70, -240, 70]);
			this.ribbons.push([70, -240, 70]);
			this.ribbons.push([70, 240, 70]);
			this.ribbons.push([90, 240, 70]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
			this.ribbonsNormals.push([0.0, 0.0, 1.0]);
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

		// Transform box
		for (let i = 0; i < this.box.length; i++) {
			let pa = this.box[i];
			let n = this.boxNormals[i];
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
			this.box[i] = [pat[0], pat[1], pat[2]];
			this.boxNormals[i] = [pbt[0] - pat[0], pbt[1] - pat[1], pbt[2] - pat[2]];
		}

		// Transform ribbons
		for (let i = 0; i < this.ribbons.length; i++) {
			let pa = this.ribbons[i];
			let n = this.ribbonsNormals[i];
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
			this.ribbons[i] = [pat[0], pat[1], pat[2]];
			this.ribbonsNormals[i] = [pbt[0] - pat[0], pbt[1] - pat[1], pbt[2] - pat[2]];
		}

		// Transform center and normal
		let c = this.center;
		let n = [this.center[0] + this.normal[0], this.center[1] + this.normal[1], this.center[2] + this.normal[2]];
		this.normal = rotatePointAboutPoint(n, c, this.transform.rotate[0], this.transform.rotate[1], this.transform.rotate[2]);
		this.center = [c[0] + this.transform.translate[0], c[1] + this.transform.translate[1], c[2] + this.transform.translate[2]];
	}

	this.drawObj = function() {
		let v = [];
		let c = [];
		let n = [];

		for (let i = 0; i < this.box.length; i++) {
			v.push(this.box[i][0]);
			v.push(this.box[i][1]);
			v.push(this.box[i][2]);

			c.push(COLOR_BROWN[0]);
			c.push(COLOR_BROWN[1]);
			c.push(COLOR_BROWN[2]);

			n.push(this.boxNormals[i][0]);
			n.push(this.boxNormals[i][1]);
			n.push(this.boxNormals[i][2]);
		}

		for (let i = 0; i < this.ribbons.length; i++) {
			v.push(this.ribbons[i][0]);
			v.push(this.ribbons[i][1]);
			v.push(this.ribbons[i][2]);

			c.push(COLOR_BLACK[0] + 100);
			c.push(COLOR_BLACK[1] + 100);
			c.push(COLOR_BLACK[2] + 100);

			n.push(this.ribbonsNormals[i][0]);
			n.push(this.ribbonsNormals[i][1]);
			n.push(this.ribbonsNormals[i][2]);
		}

		loadArraysAndDraw(gl, v, c, n, 'triangles');
	}

	this.box = [];
	this.boxNormals = [];
	this.ribbons = [];
	this.ribbonsNormals = [];

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
	
	this.generateVertices();
}