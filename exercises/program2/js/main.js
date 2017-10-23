var objects = [],
		active_object = -1,
		mouse_point = {
			x: 0.0,
			y: 0.0,
			z: 0.0
		};

function main() {
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}

	document.getElementById('bClear').onclick = function(event) {
		event.preventDefault();
		clearCanvas();
	};

	// Rotation
	document.getElementById('bRotateL').onclick = function(event) {
		event.preventDefault();
		rotate("left");
	};

	document.getElementById('bRotateR').onclick = function(event) {
		event.preventDefault();
		rotate("right");
	};

	document.getElementById('bRotateU').onclick = function(event) {
		event.preventDefault();
		rotate("up");
	};

	document.getElementById('bRotateD').onclick = function(event) {
		event.preventDefault();
		rotate("down");
	};

	document.addEventListener("keydown", function(e) {
		switch(e.keyCode) {
			case 37:
				rotate('left');
				break;
			case 39:
				rotate('right');
				break;
			case 38:
				rotate('up');
				break;
			case 40:
				rotate('down');
				break;
			case 13:
				rotate('clear');
				break;
		}
	});

	document.getElementById('bRotateC').onclick = function(event) {
		event.preventDefault();
		rotate("clear");
	};


	// Mouse press event
	canvas.onmousedown = function(event) {
		event.preventDefault();
		click(event);
	};

	// Mouse move event
	canvas.onmousemove = function(event) {
		event.preventDefault();
		move(event);
	};

	// Disable context menu
	canvas.oncontextmenu = function(event) {
		return false;
	}

	// Draw normals toggler
	document.getElementById('bNormals').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.draw_normals ? draw_options.draw_normals = false : draw_options.draw_normals = true;
		document.getElementById('circle-n').classList.toggle('active');
		draw();
	});

	// Draw skeleton toggler
	document.getElementById('bSkeleton').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.draw_skeleton ? draw_options.draw_skeleton = false : draw_options.draw_skeleton = true;
		document.getElementById('circle-sk').classList.toggle('active');
		draw();
	});

	// Draw surface toggler
	document.getElementById('bSurface').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.draw_surface ? draw_options.draw_surface = false : draw_options.draw_surface = true;
		document.getElementById('circle-s').classList.toggle('active');
		draw();
	});

	// Draw points toggler
	document.getElementById('bPoints').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.draw_points ? draw_options.draw_points = false : draw_options.draw_points = true;
		document.getElementById('circle-p').classList.toggle('active');
		draw();
	});

	// Setup ioSOR
	setupIOSOR('fOpen');
	document.getElementById('fOpen').addEventListener('change', function(e) {
		document.getElementById('fLoad').disabled = false;
	});

	document.getElementById('fSave').addEventListener('click', function(e) {
		e.preventDefault();
		saveSOR2();
	});

	document.getElementById('fLoad').addEventListener('click', function(e) {
		e.preventDefault();
		readSOR2();
	});

	// List
	$(document).on('click', '.removeList', function(e) {
		e.preventDefault();
		let $li = $(e.target).parent();
		let index = $li.index();
		objects.splice(index, 1);
		updateList();
		draw();
	});

	$(document).on('click', '.toggleView', function(e) {
		e.preventDefault();
		let $li = $(e.target).parent();
		let index = $li.index();

		if (objects[index].visible) {
		 objects[index].visible = false;
		 $(e.target).text('Show');
		} else {
			objects[index].visible = true;
		 $(e.target).text('Hide');
		}
		draw();
	});
}

// Event handler for mouse click
function click(event) {
	let coords = {};

	// Mouse coordinates
	let x_mouse = event.clientX;
	let y_mouse = event.clientY;

	// Canvas positioning
	let rect = event.target.getBoundingClientRect();

	// Draw coordinates
	coords.x = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width / 2);
	coords.y = (canvas.height / 2 - (y_mouse - rect.top)) / (canvas.height / 2);
	coords.z = 0.0;

	// Which button was pressed?
	switch (event.button) {
		case 0:
			coords.e = newNode(coords, false);
			break;
			case 2:
			coords.e = newNode(coords, true);
			break;
			default:
			break;
		}

	// Draw
	draw();
}

// Event handler for mouse move
function move(event) {
	// Mouse coordinates
	let x_mouse = event.clientX;
	let y_mouse = event.clientY;

	// Canvas positioning
	let rect = event.target.getBoundingClientRect();

	// Draw coordinates
	mouse_point.x = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width / 2);
	mouse_point.y = (canvas.height / 2 - (y_mouse - rect.top)) / (canvas.height / 2);

	// Draw
	draw();
}

// Insert new node into active object or create new object
function newNode(coords, ends) {
	let first = false;

	// Check if there's an active object
	if (active_object === -1) {
		objects.push(new Obj());

		updateList();

		active_object = objects.length - 1;
		first = true;
	}

	// Push to object
	objects[active_object].line.nodes.push(new Node(coords));

	// If last point of object
	if (ends && !first) {
		// Generate GC
		objects[active_object].generate();
		// No active object
		active_object = -1;
	}

	return (ends && !first);
}

// Rotates all points
function rotate(side) {
	if (side == "right")
		draw_options.draw_rotation.y -= 10.0;
	else if (side == "left")
		draw_options.draw_rotation.y += 10.0;
	else if (side == "up")
		draw_options.draw_rotation.x += 10.0;
	else if (side == "down")
		draw_options.draw_rotation.x -= 10.0;
	else if (side == "clear") {
		draw_options.draw_rotation.x = 0.0;
		draw_options.draw_rotation.y = 0.0;
	}

	draw();
}

// Draw
function draw() {
	// Get rotation matrix and ortho
	let mat = new Matrix4(),
			matOrtho = new Matrix4(),
			matRotateX = new Matrix4(),
			matRotateY = new Matrix4();

	mat.setIdentity();
	matOrtho.setOrtho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
	matRotateX.setRotate(draw_options.draw_rotation.x, 1, 0, 0);
	matRotateY.setRotate(draw_options.draw_rotation.y, 0, 1, 0);

	// Set Orthoview rotated
	mat.multiply(matRotateX);
	mat.multiply(matRotateY);
	mat.multiply(matOrtho);

	gl.uniformMatrix4fv(u_ProjMatrix, false, mat.elements);

	// Clear
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw each polyline
	for (let i = 0; i < objects.length; i++) {
		if (objects[i].ended) {
			if (objects[i].visible)
				objects[i].drawObject();
		} else {
			objects[i].drawLine(mouse_point);
		}
	}

	return objects.length;
}

// Clear canvas
function clearCanvas() {
	objects = [];
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Remove from list
function updateList() {
	let $list = $('#list ul');
	$list.empty();

	for (let i = 0; i < objects.length; i++) {
		let $li = $('<li><label>Object ' + i + '</label><button class="removeList">Remove</button><button class="toggleView">Hide</button></li>');
		$list.append($li);
	}
}



