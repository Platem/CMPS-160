var lights = [],
	objects = [],
	active_object = -1,
	picked_object = -1,
	slideInterval = null,
	outing = false,
	mouse = {
		active: false,
		button: -1,
		down: {
			x: null,
			y: null,
			light: -1,
			object: -1
		},
		last_step: {
			x: null,
			y: null
		},
		step: {
			x: null,
			y: null
		},
		up: {
			x: null,
			y: null,
			light: -1,
			object: -1
		}
	};

// Main function
function main() {
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}

	// Lights
	document.getElementById('bAddLight').onclick = function(event) {
		event.preventDefault();
		lights.push({
			id: hexID(),
			type: "point",
			point: [0.0, 0.0, 0.0],
			direction: [0.0, 0.0, 0.0],
			color: [1.0, 1.0, 1.0],
			enabled: true
		});
		updateLightList();
		draw();
	};

	$(document).on('click', '.toggleLightType', function(e) {
		e.preventDefault();
		let $li = $(e.target).parent();
		let index = $li.index();

		let t = lights[index].type;
		if (t === 'point') lights[index].type = 'directional';
		else if (t === 'directional') lights[index].type = 'point';

		updateLightList();
		draw();
	});

	$(document).on('click', '.removeLightList', function(e) {
		e.preventDefault();
		let $li = $(e.target).parent();
		let index = $li.index();
		lights.splice(index, 1);

		updateLightList();
		draw();
	});

	$(document).on('click', '.toggleLightView', function(e) {
		e.preventDefault();
		let $li = $(e.target).parent();
		let index = $li.index();
		lights[index].enabled = lights[index].enabled ? false : true;

		updateLightList();
		draw();
	});

	$(document).on('click', '.bUpdate', function(e) {
		e.preventDefault();
		let $li = $(e.target).parent().parent().parent(),
			index = $li.index(),
			valx = parseInt($li.find('input[data-c="x"]').val()),
			valy = parseInt($li.find('input[data-c="y"]').val()),
			valz = parseInt($li.find('input[data-c="z"]').val());

		lights[index].point[0] = valx;
		lights[index].direction[0] = valx;
		lights[index].point[1] = valy;
		lights[index].direction[1] = valy;
		lights[index].point[2] = valz;
		lights[index].direction[2] = valz;

		updateLightList();
		draw();
	});

	// Clear
	document.getElementById('bClear').onclick = function(event) {
		event.preventDefault();
		clearCanvas();
		updateList();
	};

	// Rotation
	document.getElementById('bRotateL').onclick = function(event) {
		event.preventDefault();
		rotateView("left");
	};

	document.getElementById('bRotateR').onclick = function(event) {
		event.preventDefault();
		rotateView("right");
	};

	document.getElementById('bRotateU').onclick = function(event) {
		event.preventDefault();
		rotateView("up");
	};

	document.getElementById('bRotateD').onclick = function(event) {
		event.preventDefault();
		rotateView("down");
	};

	document.addEventListener("keydown", function(e) {
		switch (e.keyCode) {
			case 79: // Toggle inout
				e.preventDefault();
				outing ? outing = false : outing = true;
				if (outing) {
					$('#webgl').css('cursor', 'crosshair');
				} else {
					$('#webgl').css('cursor', 'auto');
				}
				break;
			case 27:
				e.preventDefault();
				if (slideInterval) {
					stopSlideShow();
				}
				break;
			case 37:
				e.preventDefault();
				rotateView('left');
				break;
			case 39:
				e.preventDefault();
				rotateView('right');
				break;
			case 38:
				e.preventDefault();
				rotateView('up');
				break;
			case 40:
				e.preventDefault();
				rotateView('down');
				break;
			case 13:
				e.preventDefault();
				rotateView('clear');
				break;
			case 65:
				e.preventDefault();
				moveView('right');
				break;
			case 68:
				e.preventDefault();
				moveView('left');
				break;
			case 87:
				e.preventDefault();
				moveView('down');
				break;
			case 83:
				e.preventDefault();
				moveView('up');
				break;
			case 32:
				e.preventDefault();
				moveView('clear');
				break;
		}
	});

	document.getElementById('bRotateC').onclick = function(event) {
		event.preventDefault();
		rotateView("clear");
	};

	// Mouse press event
	canvas.onmousedown = function(event) {
		event.preventDefault();

		if (mouse.button == -1) {
			let rect = event.target.getBoundingClientRect();
			let s = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2;
			let x2 = event.clientX - rect.left + draw_options.draw_translate.x,
					y2 = rect.bottom - event.clientY + draw_options.draw_translate.y;

			draw(true);
			let isLight = checkForLight(x2, y2);
			let isObject = checkForObject(x2, y2);
			draw();

			mouse.button = event.button;
			mouse.down.x = ((event.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2) * s;
			mouse.down.y = (canvas.height / 2 - (event.clientY - rect.top)) / (canvas.height / 2) * s;
			mouse.down.light = isLight.index;
			mouse.down.object = isObject.index;
		}
	};

	// Mouse move event
	canvas.onmousemove = function(event) {
		event.preventDefault();
		let rect = event.target.getBoundingClientRect();
		let s = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2;

		mouse.last_step.x = mouse.step.x;
		mouse.last_step.y = mouse.step.y;

		mouse.step.x = ((event.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2) * s;
		mouse.step.x -= draw_options.draw_translate.x * s;
		mouse.step.y = (canvas.height / 2 - (event.clientY - rect.top)) / (canvas.height / 2) * s;
		mouse.step.y -= draw_options.draw_translate.y * s;

		if (!mouse.active && mouse.button != -1) {
			let diff_x = Math.abs(mouse.step.x - mouse.down.x);
			let diff_y = Math.abs(mouse.step.y - mouse.down.y);

			if (diff_x > 10 || diff_y > 0) {
				mouse.active = true;
				$('#webgl').css('cursor', 'move');
			}
		}

		if (active_object != -1 || mouse.active) {
			move();
		}
	};

	// Mouse release event
	canvas.onmouseup = function(event) {
		event.preventDefault();

		if (event.button == mouse.button) {
			let rect = event.target.getBoundingClientRect();
			let s = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2;

			let x2 = event.clientX - rect.left + draw_options.draw_translate.x,
					y2 = rect.bottom - event.clientY + draw_options.draw_translate.y;

			draw(true);
			let isLight = checkForLight(x2, y2);
			let isObject = checkForObject(x2, y2);
			draw();

			mouse.up.x = ((event.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2) * s;
			mouse.up.y = (canvas.height / 2 - (event.clientY - rect.top)) / (canvas.height / 2) * s;
			mouse.up.light = isLight.index;
			mouse.up.object = isObject.index;

			click(event);

			$('#webgl').css('cursor', 'auto');
			mouse.active = false;
			mouse.button = -1;
			mouse.down.x = null;
			mouse.down.y = null;
			mouse.down.light = -1;
			mouse.down.object = -1;
			mouse.up.x = null;
			mouse.up.y = null;
			mouse.up.light = -1;
			mouse.up.object = -1;
			draw();
		}
	};

	// Mouse move event
	canvas.onwheel = function(event) {
		event.preventDefault();
		if (picked_object > -1) {
			// Scale object
			transform(event);
		} else if (outing) {
			// Move camera
			draw_options.viewer.position[2] += event.deltaY / 10;
			draw_options.orthographic.near += event.deltaY / 10;
			draw_options.orthographic.far += event.deltaY / 10;
		} else {
			// Zoom
			let val = draw_options.perspective.fovy + event.deltaY / 5;
			if (val < 1) val = 1;
			if (val > 179) val = 179;
			draw_options.perspective.fovy = Math.floor(val);
			document.getElementById('p-fovy-val').innerHTML = draw_options.perspective.fovy;
			document.getElementById('p-fovy').value = draw_options.perspective.fovy;
		}
		draw();
	};

	canvas.ondblclick = function(event){
		if (picked_object > -1) {
			objects[picked_object].picked = false;
			picked_object = -1;
		};

		let rect = event.target.getBoundingClientRect();
		let s = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2;

		let x2 = event.clientX - rect.left,
			y2 = rect.bottom - event.clientY;

		draw(true);
		let isObject = checkForObject(x2, y2);
		draw();

		if (isObject.is) {
			let center = objects[isObject.index].center;
			startSlideShow(center, true);
		}
	};

	// Disable context menu
	canvas.oncontextmenu = function(event) {
		return false;
	}

	// View perspective
	document.getElementById('bPerspective').addEventListener('click', function(e) {
		e.preventDefault();
		draw_options.perspective.enabled ? draw_options.perspective.enabled = false : draw_options.perspective.enabled = true;
		document.getElementById('circle-pers').classList.toggle('active');
		draw();
	});

	document.getElementById('p-fovy').addEventListener('input', function(e) {
		e.preventDefault();
		let val = this.value;
		draw_options.perspective.fovy = val;
		document.getElementById('p-fovy-val').innerHTML = draw_options.perspective.fovy;
		draw();
	});

	document.getElementById('p-aspect').addEventListener('input', function(e) {
		e.preventDefault();
		let val = this.value;
		draw_options.perspective.aspect = val;
		document.getElementById('p-aspect-val').innerHTML = draw_options.perspective.aspect;
		draw();
	});

	document.getElementById('p-far').addEventListener('input', function(e) {
		e.preventDefault();
		let val = parseInt(this.value);

		let near = parseInt(document.getElementById('p-near').value);

		if (val <= near) val = near + 1;

		draw_options.perspective.far = val;
		document.getElementById('p-far-val').innerHTML = draw_options.perspective.far;
		draw();
	});

	document.getElementById('p-near').addEventListener('input', function(e) {
		e.preventDefault();
		let val = parseInt(this.value);

		let far = parseInt(document.getElementById('p-far').value);

		if (val >= far) val = far - 1;

		draw_options.perspective.near = val;
		document.getElementById('p-near-val').innerHTML = draw_options.perspective.near;
		draw();
	});

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
		if (picked_object == index) picked_object = -1;
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

	updateLightList();

	draw();
}

// Apply transformation to object
function transform(event) {
	if (mouse.button != -1 || !event) {
		// Translating or rotating
		let moved = {
			x: mouse.step.x - mouse.last_step.x,
			y: mouse.step.y - mouse.last_step.y
		}
		switch (mouse.button) {
			// Left button
			case 0:
				objects[picked_object].doTranslate({
					x: moved.x,
					y: moved.y,
					z: 0.0
				});
				break;

				// Middle button
			case 1:
				objects[picked_object].doTranslate({
					x: 0.0,
					y: 0.0,
					z: moved.y
				});
				break;

				// Right button
			case 2:
				let hor = Math.abs((moved.x / moved.y)) > 10;
				let vert = Math.abs((moved.y / moved.x)) > 10;

				if (hor) {
					objects[picked_object].doRotate({
						x: moved.x,
						y: 0.0,
						z: 0.0
					});
				} else if (vert) {
					objects[picked_object].doRotate({
						x: 0.0,
						y: 0.0,
						z: moved.y
					});
				}
				break;
		}
	} else {
		objects[picked_object].doScale(event.deltaY * (0.05));
	}
	draw();
}

// Event handler for mouse click
function click(event) {
	if (active_object != -1) {
		switch (mouse.button) {
			case 0:
				newNode({
					x: mouse.up.x - draw_options.draw_translate.x * (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2,
					y: mouse.up.y - draw_options.draw_translate.y * (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2,
					z: 0.0
				}, false);
				break;

			case 1:
				break;

			case 2:
				newNode({
					x: mouse.up.x - draw_options.draw_translate.x * (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2,
					y: mouse.up.y - draw_options.draw_translate.y * (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2,
					z: 0.0
				}, true);
				break;

			default:
				break;
		}
	} else {
		if (mouse.active) {

		} else {
			switch (mouse.button) {
				case 0:
					if (mouse.up.light > -1) {
						// Toggle light
						lights[mouse.up.light].enabled = lights[mouse.up.light].enabled ? false : true;
						updateLightList();
						draw();
					} else if (mouse.up.object > -1) {
						// Pick object
						if (picked_object > -1) {
							objects[picked_object].picked = false;
							picked_object = -1;
						}
						objects[mouse.up.object].picked = true;
						picked_object = mouse.up.object;
						$('#webgl').css('cursor', 'grab');
					} else {
						// Unpick object or start new
						if (picked_object > -1) {
							objects[picked_object].picked = false;
							picked_object = -1;
							$('#webgl').css('cursor', 'auto');
						} else {
							newNode({
								x: mouse.up.x - draw_options.draw_translate.x * (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2,
								y: mouse.up.y - draw_options.draw_translate.y * (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2,
								z: 0.0
							}, true);
						}
					}
					break;

				case 1:
					// Toggle in/out mode
					outing ? outing = false : outing = true;
					if (outing) {
						$('#webgl').css('cursor', 'crosshair');
					} else {
						$('#webgl').css('cursor', 'auto');
					}
					break;

				case 2:
					// Unpick object or start new
					if (picked_object > -1) {
						// objects[picked_object].picked = false;
						// picked_object = -1;
						let center = objects[picked_object].center;
						startSlideShow(center, false);
					} else {
						newNode({
							x: mouse.up.x - draw_options.draw_translate.x * (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2,
							y: mouse.up.y - draw_options.draw_translate.y * (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2,
							z: 0.0
						}, true);
					}
					break;

				default:
					break;
			}
		}
	}
}

// Event handler for mouse move
function move(event) {
	if (active_object != -1) {
		draw();
	} else {
		if (mouse.active) {
			if (picked_object > -1) {
				transform(event);
			} else {
				if (mouse.down.light == -1 && mouse.down.object == -1) {
					// Panning here
					let deltax = mouse.step.x - mouse.last_step.x;
					let deltay = mouse.step.y - mouse.last_step.y;
					let s = (Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2;

					draw_options.draw_translate.x += deltax / s;
					draw_options.draw_translate.y += deltay / s;

					draw_options.viewer.position[0] -= deltax;
					draw_options.viewer.position[1] -= deltay;
					draw_options.viewer.center[0] -= deltax;
					draw_options.viewer.center[1] -= deltay;
					draw();
				}
			}
		}
	}
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

	if (!first) {
		let pA = objects[active_object].line.nodes[objects[active_object].line.nodes.length - 1].point;

		if (Math.abs(pA.x - coords.x) < 1 || Math.abs(pA.y - coords.y) < 1 /*|| Math.abs(pA.z - coords.z) < 1*/ ) return;
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
function rotateView(side) {
	if (side == "right") {
		draw_options.draw_rotation.y -= 10.0;

		let p = rotatePointAboutPoint(draw_options.viewer.position, draw_options.viewer.center, 0.0, 10.0);

		draw_options.viewer.position[0] = p[0];
		draw_options.viewer.position[1] = p[1];
		draw_options.viewer.position[2] = p[2];
	} else if (side == "left") {
		draw_options.draw_rotation.y += 10.0;

		let p = rotatePointAboutPoint(draw_options.viewer.position, draw_options.viewer.center, 0.0, -10.0);

		draw_options.viewer.position[0] = p[0];
		draw_options.viewer.position[1] = p[1];
		draw_options.viewer.position[2] = p[2];
	} else if (side == "up") {
		draw_options.draw_rotation.x += 10.0;

		let p = rotatePointAboutPoint(draw_options.viewer.position, draw_options.viewer.center, 10.0, 0.0);

		draw_options.viewer.position[0] = p[0];
		draw_options.viewer.position[1] = p[1];
		draw_options.viewer.position[2] = p[2];
	} else if (side == "down") {
		draw_options.draw_rotation.x -= 10.0;

		let p = rotatePointAboutPoint(draw_options.viewer.position, draw_options.viewer.center, -10.0, 0.0);

		draw_options.viewer.position[0] = p[0];
		draw_options.viewer.position[1] = p[1];
		draw_options.viewer.position[2] = p[2];
	} else if (side == "clear") {
		draw_options.draw_rotation.x = 0.0;
		draw_options.draw_rotation.y = 0.0;

		draw_options.viewer.position = [0.0, 0.0, 500];
	}

	draw();
}


function moveView(side) {
	if (side == "right") {
		draw_options.draw_translate.x += 0.1;

		draw_options.viewer.position[0] += 10.0;
		draw_options.viewer.center[0] += 10.0;
	} else if (side == "left") {
		draw_options.draw_translate.x -= 0.1;

		draw_options.viewer.position[0] -= 10.0;
		draw_options.viewer.center[0] -= 10.0;
	} else if (side == "up") {
		draw_options.draw_translate.y += 0.1;

		draw_options.viewer.position[1] += 10.0;
		draw_options.viewer.center[1] += 10.0;
	} else if (side == "down") {
		draw_options.draw_translate.y -= 0.1;

		draw_options.viewer.position[1] -= 10.0;
		draw_options.viewer.center[1] -= 10.0;
	} else if (side == "clear") {
		draw_options.draw_translate.x = 0.0;
		draw_options.draw_translate.y = 0.0;

		draw_options.viewer.position = [0.0, 0.0, 500];
		draw_options.viewer.center = [0.0, 0.0, 0.0];
	}

	draw();
}

// Draw
function draw(withID) {
	// Get rotation/translation matrix and ortho/persp
	let mat = new Matrix4(),
		matPersp = new Matrix4(),
		matOrtho = new Matrix4(),
		matRotateX = new Matrix4(),
		matRotateY = new Matrix4(),
		matTranslate = new Matrix4();

	mat.setIdentity();
	if (draw_options.perspective.enabled) {
		matPersp.setPerspective(draw_options.perspective.fovy, draw_options.perspective.aspect, draw_options.perspective.near, draw_options.perspective.far);
		matPersp.lookAt(draw_options.viewer.position[0], draw_options.viewer.position[1], draw_options.viewer.position[2],
			draw_options.viewer.center[0], draw_options.viewer.center[1], draw_options.viewer.center[2],
			draw_options.viewer.up[0], draw_options.viewer.up[1], draw_options.viewer.up[2]);
	} else {
		matOrtho.setOrtho(draw_options.orthographic.left, draw_options.orthographic.right, 
											draw_options.orthographic.bottom, draw_options.orthographic.top, 
											draw_options.orthographic.near, draw_options.orthographic.far);
		matRotateX.setRotate(draw_options.draw_rotation.x, 1, 0, 0);
		matRotateY.setRotate(draw_options.draw_rotation.y, 0, 1, 0);
		matTranslate.setTranslate(draw_options.draw_translate.x, draw_options.draw_translate.y, draw_options.draw_translate.z);
	}

	if (draw_options.perspective.enabled) {
		mat.multiply(matPersp);
	} else {
		mat.multiply(matRotateX);
		mat.multiply(matRotateY);
		mat.multiply(matTranslate);
		mat.multiply(matOrtho);
	}

	gl.uniformMatrix4fv(u_ProjMatrix, false, mat.elements);

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
			objects[i].drawLine({
				x: mouse.step.x,
				y: mouse.step.y,
				z: 0.0
			});
		}
	}
}

function startSlideShow(center, shouldLookAround) {
	// Save viewer
	draw_options.save_viewer = {
		position: [draw_options.viewer.position[0],
							 draw_options.viewer.position[1],
							 draw_options.viewer.position[2]],
		center: 	[draw_options.viewer.center[0],
							 draw_options.viewer.center[1],
							 draw_options.viewer.center[2]]
	};
	let offset = [0.0, 0.0, 0.0];

	if (shouldLookAround) {
		// Looking around
		offset[0] = draw_options.viewer.position[0] - center.x;
		offset[1] = draw_options.viewer.position[1] - center.y;
		offset[2] = draw_options.viewer.position[2] - center.z;
	} else {
		// Examining
		offset[0] = draw_options.viewer.center[0] - center.x;
		offset[1] = draw_options.viewer.center[1] - center.y;
		offset[2] = draw_options.viewer.center[2] - center.z;
	}

	// Translate viewer (lookfrom) and center (lookat) by offset
	draw_options.viewer.position[0] -= offset[0];
	draw_options.viewer.position[1] -= offset[1];
	draw_options.viewer.position[2] -= offset[2];
	draw_options.viewer.center[0] -= offset[0];
	draw_options.viewer.center[1] -= offset[1];
	draw_options.viewer.center[2] -= offset[2];

	draw_options.draw_translate.x -= center.x / ((Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2);
	draw_options.draw_translate.y -= center.y / ((Math.abs(draw_options.scale_range[0]) + Math.abs(draw_options.scale_range[1])) / 2);

	if (picked_object > -1) {
		objects[picked_object].picked = false;
		picked_object = -1;
	}

	slideInterval = setInterval(function() {
		if (shouldLookAround) {
			let p = rotatePointAboutPoint(draw_options.viewer.center, draw_options.viewer.position, 0, 2);
			draw_options.viewer.center[0] = p[0];
			draw_options.viewer.center[1] = p[1];
			draw_options.viewer.center[2] = p[2];
			draw_options.draw_rotation.y += 2;
		} else {
			let p = rotatePointAboutPoint(draw_options.viewer.position, draw_options.viewer.center, 0, 2);
			draw_options.viewer.position[0] = p[0];
			draw_options.viewer.position[1] = p[1];
			draw_options.viewer.position[2] = p[2];
			draw_options.draw_rotation.y += 2;
		}
		draw();
	}, 10);
}

function stopSlideShow() {
	clearInterval(slideInterval);
	slideInterval = null;
	draw_options.viewer.position[0] = draw_options.save_viewer.position[0];
	draw_options.viewer.position[1] = draw_options.save_viewer.position[1];
	draw_options.viewer.position[2] = draw_options.save_viewer.position[2];
	draw_options.viewer.center[0] = draw_options.save_viewer.center[0];
	draw_options.viewer.center[1] = draw_options.save_viewer.center[1];
	draw_options.viewer.center[2] = draw_options.save_viewer.center[2];
	draw_options.draw_translate.x = 0.0;
	draw_options.draw_translate.y = 0.0;
	draw_options.draw_translate.z = 0.0;
	draw_options.draw_rotation.y = 0;
	draw_options.save_viewer = null;
	draw();
}

// Read objects from file
function readSOR() {
	let SORCollection = readFile2();
	objects = [];

	for (let i = 0; i < SORCollection.length; i++) {
		let vertices = SORCollection[i].vertices;
		let indexes = SORCollection[i].indexes;
		// console.log(indexes);
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
			object.generateRaw();
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
	let $list = $('#list ul.objects');
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

function updateLightList() {
	let $list = $('#list ul.lights');
	$list.empty();

	for (let i = 0; i < lights.length; i++) {
		let $li;
		if (lights[i].enabled)
			$li = $('<li><label>Light ' + i + '</label><button class="removeLightList">Remove</button><button class="toggleLightView">ON</button></li>');
		else
			$li = $('<li><label>Light ' + i + '</label><button class="removeLightList">Remove</button><button class="toggleLightView">OFF</button></li>');

		if (lights[i].type === 'directional') {
			let $but = $('<button class="toggleLightType">Directional</button>');

			$li.append($but);
		} else if (lights[i].type === 'point') {
			let $but = $('<button class="toggleLightType">Point</button>');

			$li.append($but);
		}

		let $form = $('<form><div><label for="">x:</label><input type="number" class="light-value" data-c="x" value="' + lights[i].point[0] + '"/></div><div><label for="">y:</label><input type="number" class="light-value" data-c="y" value="' + lights[i].point[1] + '"/></div><div><label for="">z:</label><input type="number" class="light-value" data-c="z" value="' + lights[i].point[2] + '"/></div><div><button class="bUpdate">Update</button></div></form>');

		$li.append($form);
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
		color = [1.0, 1.0, 0.0];
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
}

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