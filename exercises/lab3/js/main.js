var lights = [],
objects = [],
active_object = -1,
mouse_point = {
	x: 0.0,
	y: 0.0,
	z: 0.0
};

// Main function
function main() {
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}

	document.getElementById('bClear').onclick = function(event) {
		event.preventDefault();
		clearCanvas();
		updateList();
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
		/*if (active_object != -1)*/ 
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
		draw_options.draw_surfaces ? draw_options.draw_surfaces = false : draw_options.draw_surfaces = true;
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

	// Ambient toggler
	document.getElementById('bAmbient').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.light_ambient ? draw_options.light_ambient = false : draw_options.light_ambient = true;
		document.getElementById('circle-am').classList.toggle('active');
		draw();
	});

	// Specular toggler
	document.getElementById('bDiffuse').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.light_difuse ? draw_options.light_difuse = false : draw_options.light_difuse = true;
		document.getElementById('circle-di').classList.toggle('active');
		draw();
	});

	// Specular toggler
	document.getElementById('bSpecular').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.light_specular ? draw_options.light_specular = false : draw_options.light_specular = true;
		document.getElementById('circle-sp').classList.toggle('active');
		draw();
	});

	// Smooth shading toggler
	document.getElementById('bSmooth').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.smooth_shading ? draw_options.smooth_shading = false : draw_options.smooth_shading = true;
		document.getElementById('circle-sm').classList.toggle('active');
		draw();
	});

	// Light colors
	document.getElementsByName('color_picker').forEach(function(item, index) {
		item.addEventListener('input', function(e) {
			e.preventDefault();
			let color = hexToRgb(this.value);

			switch (this.id) {
				case "ambientColor":
				draw_options.surface_ka[0] = color.r / 255;
				draw_options.surface_ka[1] = color.g / 255;
				draw_options.surface_ka[2] = color.b / 255;
				break;
				case "diffuseColor":
				draw_options.surface_kd[0] = color.r / 255;
				draw_options.surface_kd[1] = color.g / 255;
				draw_options.surface_kd[2] = color.b / 255;
				break;
				case "specularColor":
				draw_options.surface_ks[0] = color.r / 255;
				draw_options.surface_ks[1] = color.g / 255;
				draw_options.surface_ks[2] = color.b / 255;
				break;
				case "normalsColor":
				draw_options.normals_color[0] = color.r / 255;
				draw_options.normals_color[1] = color.g / 255;
				draw_options.normals_color[2] = color.b / 255;
				break;
				case "skeletonColor":
				draw_options.skeleton_color[0] = color.r / 255;
				draw_options.skeleton_color[1] = color.g / 255;
				draw_options.skeleton_color[2] = color.b / 255;
				break;
				case "pointsColor":
				draw_options.points_color[0] = color.r / 255;
				draw_options.points_color[1] = color.g / 255;
				draw_options.points_color[2] = color.b / 255;
				break;
				default:
				break;
			}

			draw();
		});
	});



	// Ns slider
	document.getElementById('ns').addEventListener('input', function(e) {
		e.preventDefault();
		let val = this.value;
		draw_options.surface_ns = val;
		document.getElementById('ns-val').innerHTML = draw_options.surface_ns;
		draw();
	});

	// Setup ioSOR
	setupIOSOR('fOpen');
	document.getElementById('fOpen').addEventListener('change', function(e) {
		document.getElementById('fLoad').disabled = false;
	});

	document.getElementById('fSave').addEventListener('click', function(e) {
		e.preventDefault();
		saveSOR();
	});

	document.getElementById('fLoad').addEventListener('click', function(e) {
		e.preventDefault();
		readSOR();
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

	// Opacity sliders
	$(document).on('input', '.opacity', function(e) {
		let $li = $(e.target).parent().parent();
		let $label = $li.find('.opacity-val');

		let index = $li.index();
		let val = $(this).val();

		$label.text(val);

		objects[index].opacity = parseFloat(val);
		draw();
	});

	// Get lights
	for (let i = 0; i < draw_options.light_sources.length; i++) {
		lights.push(draw_options.light_sources[i]);
		lights[i].id = hexID();
	}

	draw();
}

// Event handler for mouse click
function click(event) {
	let coords = {};

	// Mouse coordinates
	let x_mouse = event.clientX;
	let y_mouse = event.clientY;

	// Canvas positioning
	let rect = event.target.getBoundingClientRect();

	let s = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2;

	// Draw coordinates
	coords.x = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width / 2) * s;
	coords.y = (canvas.height / 2 - (y_mouse - rect.top)) / (canvas.height / 2) * s;
	coords.z = 0.0;

	let x2 = x_mouse - rect.left,
	y2 = rect.bottom - y_mouse;

	draw(true);

	// Which button was pressed?
	switch (event.button) {
		case 0:
			let isLight = checkForLight(x2, y2);
			if (active_object == -1 && isLight.is) {
				// Pick a light while not making a new line
				let index = isLight.index;
				lights[index].enabled = lights[index].enabled ? false : true;
				draw();
			} else {
				// Not pick a light OR making a new line so basically making a new line
				coords.e = newNode(coords, false);
			}

			break;
		case 2:
			let isObject = checkForObject(x2, y2);
			if (active_object == -1 && isObject.is) {
				// Pick an object while not making a new line
				let index = isObject.index;
				objects[index].picked = objects[index].picked ? false : true;
				draw();
			} else {
				// Not pick an object OR making a new line so basically making a new line
				coords.e = newNode(coords, true);
			}
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

	let s = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2;

	// Draw coordinates
	mouse_point.x = ((x_mouse - rect.left) - canvas.width / 2) / (canvas.width / 2) * s;
	mouse_point.y = (canvas.height / 2 - (y_mouse - rect.top)) / (canvas.height / 2) * s;

	// Draw
	if (active_object != -1)
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

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	draw();
}

// Draw
function draw(withID) {
	// Get rotation matrix and ortho
	let mat = new Matrix4(),
	matOrtho = new Matrix4(),
	matRotateX = new Matrix4(),
	matRotateY = new Matrix4();

	mat.setIdentity();
	matOrtho.setOrtho(draw_options.scale_range[0], draw_options.scale_range[1], draw_options.scale_range[0], draw_options.scale_range[1], draw_options.scale_range[0], draw_options.scale_range[1]);
	matRotateX.setRotate(draw_options.draw_rotation.x, 1, 0, 0);
	matRotateY.setRotate(draw_options.draw_rotation.y, 0, 1, 0);

	// Set Orthoview rotated
	mat.multiply(matRotateX);
	mat.multiply(matRotateY);
	mat.multiply(matOrtho);

	gl.uniformMatrix4fv(u_ProjMatrix, false, mat.elements);

	// if (!withID) 
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Draw light sources:
	for (let i = 0; i < lights.length; i++) {
		if (lights[i].type === 'directional') {
			// Draw an object from 0.0 to light direction
			drawDirectionLight(lights[i], withID);
		} else if (lights[i].type === 'point') {
			drawPointLight(lights[i], 50, withID);
		}
	}

	// Draw each object
	for (let i = 0; i < objects.length; i++) {
		if (objects[i].ended) {
			if (objects[i].visible)
				objects[i].drawObject(withID);
		} else {
			objects[i].drawLine(mouse_point);
		}
	}
}

// Read objects from file
function readSOR() {
	let SORCollection = readFile2();
	objects = [];

	for (let i = 0; i < SORCollection.length; i++) {
		let vertices = SORCollection[i].vertices;
		let indexes = SORCollection[i].indexes;
		console.log(indexes);
		if (vertices.length % (36) != 0) {
			alert('Selected file doesn\'t match vertices (points) format in [' + SORCollection[i].name + '] object. There should be groups of 12 points, each group forming a circle.');
		} else if ((indexes.length - 24 * 3) % (12) != 0) {
			alert('Selected file doesn\'t match indexes (faces) format in [' + SORCollection[i].name + '] object. There should be groups of 4 points, each group forming a face.');
		} else {
			// Retrieve object
			let object = new Obj();
			let j = 0;

			// Get vertices
			for (let k = 0; k < vertices.length; k += 3) {
				object.vertices.push(new Coord(vertices[k], vertices[k + 1], vertices[k + 2]));
			}

			// Get faces
			let face1 = [],
			laterals = [],
			face2 = [];

			// Get fisrt face
			for (j; j < 36; j += 3) {
				let p = new Coord(indexes[j], indexes[j + 1], indexes[j + 2]);
				face1.push(p);
			}

			// Get laterals (made of 4 points each)
			for (j; j < indexes.length - 36; j += 12) {
				let pol = [];

				pol.push(new Coord(indexes[j], indexes[j + 1], indexes[j + 2]));
				pol.push(new Coord(indexes[j + 3], indexes[j + 4], indexes[j + 5]));
				pol.push(new Coord(indexes[j + 6], indexes[j + 7], indexes[j + 8]));
				pol.push(new Coord(indexes[j + 9], indexes[j + 10], indexes[j + 11]));

				laterals.push(pol);
			}

			// Get second face
			for (j; j < indexes.length; j += 3) {
				let p = new Coord(indexes[j], indexes[j + 1], indexes[j + 2]);
				face2.push(p);
			}

			// Push polygons
			object.polygons.push(new Polygon(face1));
			for (let k = 0; k < laterals.length; k++) {
				object.polygons.push(new Polygon(laterals[k]));
			}
			object.polygons.push(new Polygon(face2));

			// Add object
			object.ended = true;
			object.verticesNormal();
			objects.push(object);
			updateList();
		}
	}

	draw();
}

// Save objects to file
function saveSOR() {
	let SORCollection = [];

	if (objects.length > 0) {
		var name = prompt("Please enter a file name.\n\n[Note that only completed objects will be saved]", "object");
		// Each object
		for (let i = 0; i < objects.length; i++) {
			if (objects[i].ended) {
				let sor = new SOR(name + '_' + i, [], []);

				// Push all vertices
				for (let j = 0; j < objects[i].vertices.length; j++) {
					sor.vertices.push(objects[i].vertices[j].x);
					sor.vertices.push(objects[i].vertices[j].y);
					sor.vertices.push(objects[i].vertices[j].z);
				}

				// Get faces (polygons of object)
				for (let j = 0; j < objects[i].polygons.length; j++) {
					// Push each point of polygon: 12 for first and last, 4 for the others.
					for (let k = 0; k < objects[i].polygons[j].elements.length; k++) {
						sor.indexes.push(objects[i].polygons[j].elements[k].x);
						sor.indexes.push(objects[i].polygons[j].elements[k].y);
						sor.indexes.push(objects[i].polygons[j].elements[k].z);
					}
				}

				// Push SOR
				SORCollection.push(sor);
			}
		}

		saveFile2(SORCollection, name);
	} else {
		alert('There aren\'t any objects to be saved. Be sure you draw something and you complete it (right click).\n\n[Note that loaded objects don\'t count.]');
	}
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
		let $li;
		if (objects[i].visible)
			$li = $('<li><label>Object ' + i + '</label><button class="removeList">Remove</button><button class="toggleView">Hide</button></li>');
		else
			$li = $('<li><label>Object ' + i + '</label><button class="removeList">Remove</button><button class="toggleView">Show</button></li>');

		if (draw_options.opacity_enabled) {
			let $div = $('<div><label>Opacity: <span class="opacity-val">1.0</span></label></div>');
			let $slider = $('<input type="range" min="0.0" max="1.0" step="0.1" value="1.0" class="opacity" />');
			
			$div.append($slider);
			$li.append($div);
		} else {
			$li.css('height', '30px');
		}

		$list.append($li);
	}
}

function drawDirectionLight(light, withID) {
	let r = 5;
	
	let v1 = [
	light.direction[0] - r / 2,
	light.direction[1] + r / 2,
	light.direction[2] + r / 2
	],
	v2 = [
	light.direction[0] - r / 2,
	light.direction[1] - r / 2,
	light.direction[2] + r / 2
	],
	v3 = [
	light.direction[0] + r / 2,
	light.direction[1] - r / 2,
	light.direction[2] + r / 2
	],
	v4 = [
	light.direction[0] + r / 2,
	light.direction[1] + r / 2,
	light.direction[2] + r / 2
	],
	v5 = [
	0.0 - r / 2,
	0.0 + r / 2,
	0.0 - r / 2
	],
	v6 = [
	0.0 - r / 2,
	0.0 - r / 2,
	0.0 - r / 2
	],
	v7 = [
	0.0 + r / 2,
	0.0 - r / 2,
	0.0 - r / 2
	],
	v8 = [
	0.0 + r / 2,
	0.0 + r / 2,
	0.0 - r / 2
	];

	let color = [];
	if (light.enabled)
		color = [1.0, 0.0, 0.0];
	else
		color = [0.6, 0.6, 0.6];

	if (withID) {
		let c = hexToRgb(light.id)
		color = [c.r, c.g, c.b];
	}

	// Front face
	drawPolygon([v1, v2, v3, v4], color);
	// Back face
	drawPolygon([v8, v7, v6, v5], color);
	// Top face
	drawPolygon([v5, v1, v4, v8], color);
	// Bot face
	drawPolygon([v2, v6, v7, v3], color);
	// Left face
	drawPolygon([v5, v6, v2, v1], color);
	// Right face
	drawPolygon([v4, v3, v7, v8], color);
}

function drawPointLight(light, r, withID) {
	let v1 = [
	light.point[0] - r / 2,
	light.point[1] + r / 2,
	light.point[2] + r / 2
	],
	v2 = [
	light.point[0] - r / 2,
	light.point[1] - r / 2,
	light.point[2] + r / 2
	],
	v3 = [
	light.point[0] + r / 2,
	light.point[1] - r / 2,
	light.point[2] + r / 2
	],
	v4 = [
	light.point[0] + r / 2,
	light.point[1] + r / 2,
	light.point[2] + r / 2
	],
	v5 = [
	light.point[0] - r / 2,
	light.point[1] + r / 2,
	light.point[2] - r / 2
	],
	v6 = [
	light.point[0] - r / 2,
	light.point[1] - r / 2,
	light.point[2] - r / 2
	],
	v7 = [
	light.point[0] + r / 2,
	light.point[1] - r / 2,
	light.point[2] - r / 2
	],
	v8 = [
	light.point[0] + r / 2,
	light.point[1] + r / 2,
	light.point[2] - r / 2
	];

	let color = [];
	if (light.enabled)
		color = light.color;
	else
		color = [0.6, 0.6, 0.6];

	if (withID) {
		let c = hexToRgb(light.id)
		color = [c.r, c.g, c.b];
	}

	// Front face
	drawPolygon([v1, v2, v3, v4], color);
	// Back face
	drawPolygon([v8, v7, v6, v5], color);
	// Top face
	drawPolygon([v5, v1, v4, v8], color);
	// Bot face
	drawPolygon([v2, v6, v7, v3], color);
	// Left face
	drawPolygon([v5, v6, v2, v1], color);
	// Right face
	drawPolygon([v4, v3, v7, v8], color);
}

function drawPolygon(points, color) {
	let v = [];
	for (let i = 0; i < points.length; i++) {
		v.push(points[i][0]);
		v.push(points[i][1]);
		v.push(points[i][2]);
		v.push(color[0]);
		v.push(color[1]);
		v.push(color[2]);

		if (draw_options.opacity_enabled) v.push(1.0);
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
};

function checkForLight(x, y) {
	let pixels = new Uint8Array(4);
	gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	let is = false;
	let index = -1;

	out: for (let i = 0; i < lights.length; i++) {
		let id = hexToRgb(lights[i].id);
		if ((pixels[0] / 255) == id.r && (pixels[1] / 255) == id.g && (pixels[2] / 255) == id.b) {
			index = i;
			is = true;
			break out;
		}
	}

	return {
		is: is,
		index: index
	}
}

function checkForObject(x, y) {
	let pixels = new Uint8Array(4);
	gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	let is = false;
	let index = -1;

	out: for (let i = 0; i < objects.length; i++) {
		let id = hexToRgb(objects[i].id);
		if ((pixels[0] / 255) == id.r && (pixels[1] / 255) == id.g && (pixels[2] / 255) == id.b) {
			index = i;
			is = true;
			break out;
		}
	}

	return {
		is: is,
		index: index
	}
}