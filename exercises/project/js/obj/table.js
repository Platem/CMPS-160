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
		this.tableZones = [];

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

		// Table zones
		let table_0_0 = [];
			table_0_0.push([-240, 240, 51]);
			table_0_0.push([-240, 91, 51]);
			table_0_0.push([-91, 240, 51]);
			table_0_0.push([-91, 240, 51]);
			table_0_0.push([-240, 91, 51]);
			table_0_0.push([-91, 91, 51]);
			table_0_0.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_0_0);

		let table_0_1 = [];
			table_0_1.push([-69, 240, 51]);
			table_0_1.push([-69, 91, 51]);
			table_0_1.push([69, 91, 51]);
			table_0_1.push([69, 91, 51]);
			table_0_1.push([69, 240, 51]);
			table_0_1.push([-69, 240, 51]);
			table_0_1.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_0_1);

		let table_0_2 = [];
			table_0_2.push([240, 91, 51]);
			table_0_2.push([240, 240, 51]);
			table_0_2.push([91, 240, 51]);
			table_0_2.push([240, 91, 51]);
			table_0_2.push([91, 240, 51]);
			table_0_2.push([91, 91, 51]);
			table_0_2.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_0_2);

		let table_1_0 = [];
			table_1_0.push([-240, 69, 51]);
			table_1_0.push([-240, -69, 51]);
			table_1_0.push([-91, 69, 51]);
			table_1_0.push([-91, 69, 51]);
			table_1_0.push([-240, -69, 51]);
			table_1_0.push([-91, -69, 51]);
			table_1_0.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_1_0);

		let table_1_1 = [];
			table_1_1.push([-69, 69, 51]);
			table_1_1.push([-69, -69, 51]);
			table_1_1.push([69, -69, 51]);
			table_1_1.push([69, -69, 51]);
			table_1_1.push([69, 69, 51]);
			table_1_1.push([-69, 69, 51]);
			table_1_1.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_1_1);

		let table_1_2 = [];
			table_1_2.push([240, -69, 51]);
			table_1_2.push([240, 69, 51]);
			table_1_2.push([91, 69, 51]);
			table_1_2.push([240, -69, 51]);
			table_1_2.push([91, 69, 51]);
			table_1_2.push([91, -69, 51]);
			table_1_2.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_1_2);

		let table_2_0 = [];
			table_2_0.push([-240, -91, 51]);
			table_2_0.push([-240, -240, 51]);
			table_2_0.push([-91, -91, 51]);
			table_2_0.push([-91, -91, 51]);
			table_2_0.push([-240, -240, 51]);
			table_2_0.push([-91, -240, 51]);
			table_2_0.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_2_0);

		let table_2_1 = [];
			table_2_1.push([-69, -91, 51]);
			table_2_1.push([-69, -240, 51]);
			table_2_1.push([69, -240, 51]);
			table_2_1.push([69, -240, 51]);
			table_2_1.push([69, -91, 51]);
			table_2_1.push([-69, -91, 51]);
			table_2_1.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_2_1);

		let table_2_2 = [];
			table_2_2.push([240, -240, 51]);
			table_2_2.push([240, -91, 51]);
			table_2_2.push([91, -91, 51]);
			table_2_2.push([240, -240, 51]);
			table_2_2.push([91, -91, 51]);
			table_2_2.push([91, -240, 51]);
			table_2_2.normal = [0.0, 0.0, 1.0];
		this.tableZones.push(table_2_2);
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

		// Transform zones 
		for (let i = 0; i < this.tableZones.length; i++) {
			for (let j = 0; j < this.tableZones[i].length; j++) {
				let pa = this.tableZones[i][j];
				let n = this.tableZones[i].normal;
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

				this.tableZones[i][j][0] = pat[0];
				this.tableZones[i][j][1] = pat[1];
				this.tableZones[i][j][2] = pat[2];
				if (j == 0)
					this.tableZones[i].normal = [pbt[0] - pat[0], pbt[1] - pat[1], pbt[2] - pat[2]];
			}
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

	this.drawZones = function(withID) {
		/* 
		 * IDS:
		 * i\j	0			1			2
		 * -------------------------
		 * 0|		250		25		50		|
		 * 1|		75		100		125		|
		 * 2|		150		175		200		|
		 * -------------------------
		 */
		let v = [];
		let c = [];
		let n = [];

		for (let i = 0; i < this.tableZones.length; i++) {
			for (let j = 0; j < this.tableZones[i].length; j++) {
				if (withID) {
					v.push(this.tableZones[i][j][0]);
					v.push(this.tableZones[i][j][1]);
					v.push(this.tableZones[i][j][2] - 1);
				} else {
					v.push(this.tableZones[i][j][0]);
					v.push(this.tableZones[i][j][1]);
					v.push(this.tableZones[i][j][2]);
				}
				

				if (withID) {
					switch (i) {
						case 0:
							c.push(250);
							c.push(250);
							c.push(250);
							break;
						case 1:
							c.push(25);
							c.push(25);
							c.push(25);
							break;
						case 2:
							c.push(50);
							c.push(50);
							c.push(50);
							break;
						case 3:
							c.push(75);
							c.push(75);
							c.push(75);
							break;
						case 4:
							c.push(100);
							c.push(100);
							c.push(100);
							break;
						case 5:
							c.push(125);
							c.push(125);
							c.push(125);
							break;
						case 6:
							c.push(150);
							c.push(150);
							c.push(150);
							break;
						case 7:
							c.push(175);
							c.push(175);
							c.push(175);
							break;
						case 8:
							c.push(200);
							c.push(200);
							c.push(200);
							break;
						default:
							c.push(COLOR_BROWN[0]);
							c.push(COLOR_BROWN[1]);
							c.push(COLOR_BROWN[2]);
							break;
					}
				} else {
					c.push(COLOR_BROWN[0]);
					c.push(COLOR_BROWN[1]);
					c.push(COLOR_BROWN[2]);
				}

				n.push(1.0);
				n.push(1.0);
				n.push(1.0);
			}
		}

		if (withID)
			loadArraysAndDraw(gl, v, c, n, 'triangles', true);
		else
			loadArraysAndDraw(gl, v, c, n, 'triangles');
	}

	this.checkForTableZone = function(mouse, log) {
		let rect = canvas.getBoundingClientRect();
		let cx = mouse[0] - rect.left;
		let cy = rect.bottom - mouse[1];
		let pixels = new Uint8Array(4);

		this.drawZones(true);

		gl.readPixels(cx, cy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

		this.drawZones(false);

		if (log) console.log(cx, cy, pixels);

		if (pixels[0] == 250 && pixels[1] == 250 && pixels[2] == 250) {
			// 0, 0
			return [0, 0];
		} else if (pixels[0] == 25 && pixels[1] == 25 && pixels[2] == 25) {
			// 0, 1
			return [0, 1];
		} else if (pixels[0] == 50 && pixels[1] == 50 && pixels[2] == 50) {
			// 0, 2
			return [0, 2];
		} else if (pixels[0] == 75 && pixels[1] == 75 && pixels[2] == 75) {
			// 1, 0
			return [1, 0];
		} else if (pixels[0] == 100 && pixels[1] == 100 && pixels[2] == 100) {
			// 1, 1
			return [1, 1];
		} else if (pixels[0] == 125 && pixels[1] == 125 && pixels[2] == 125) {
			// 1, 2
			return [1, 2];
		} else if (pixels[0] == 150 && pixels[1] == 150 && pixels[2] == 150) {
			// 2, 0
			return [2, 0];
		} else if (pixels[0] == 175 && pixels[1] == 175 && pixels[2] == 175) {
			// 2, 1
			return [2, 1];
		} else if (pixels[0] == 200 && pixels[1] == 200 && pixels[2] == 200) {
			// 2, 2
			return [2, 2];
		} else {
			return null;
		}
	}

	this.box = [];
	this.boxNormals = [];
	this.ribbons = [];
	this.ribbonsNormals = [];
	this.tableZones = [];

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