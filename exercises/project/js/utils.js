function preparePositionBuffer() {
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);
}

function loadArrayToPositionBuffer(array) {
	preparePositionBuffer();
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.DYNAMIC_DRAW);
}

function prepareColorBuffer() {
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(a_Color, 3, gl.UNSIGNED_BYTE, true, 0, 0);
	gl.enableVertexAttribArray(a_Color);
}

function loadArrayToColorBuffer(array) {
	prepareColorBuffer();
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(array), gl.DYNAMIC_DRAW);
}

function prepareNormalBuffer() {
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, true, 0, 0);
	gl.enableVertexAttribArray(a_Normal);
}

function loadArrayToNormalBuffer(array) {
	prepareNormalBuffer();
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.DYNAMIC_DRAW);
}

function prepareTextureBuffer() {
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, true, 0, 0);
	gl.enableVertexAttribArray(a_TexCoord);
}

function loadArrayToTextureBuffer(array, texture) {
	let val = 0.0;
	switch (texture) {
		case 'env':
			val = 1.0;
			break;
		case 'obj_metal_blue':
			val = 2.0;
			break;
		case 'obj_metal_red':
			val = 3.0;
			break;
		case 'obj_metal_green':
			val = 4.0;
			break;
		// case 'obj_wood':
		// 	val = 5.0;
		// 	break;
		default:
			break;
	}
	let u_texture = gl.getUniformLocation(gl.program, 'texture');
	gl.uniform1f(u_texture, val);
	prepareTextureBuffer();
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.DYNAMIC_DRAW);
}

function loadArraysAndDraw(gl, positionArray, colorArray, normalArray, textureArray, draw_mode, nolights, texture) {
	let u_light = gl.getUniformLocation(gl.program, 'doLight');
	if (nolights) {
		gl.uniform1f(u_light, 0.0);
	} else {
		gl.uniform1f(u_light, 1.0);
	}

	loadArrayToPositionBuffer(positionArray);
	loadArrayToColorBuffer(colorArray);
	loadArrayToNormalBuffer(normalArray);
	loadArrayToTextureBuffer(textureArray, texture);
	
	switch(draw_mode) {
		case 'points':
			gl.drawArrays(gl.POINTS, 0, positionArray.length / 3);
			break;
		case 'lines':
			gl.drawArrays(gl.LINES, 0, positionArray.length / 3);
			break;
		case 'line_strip':
			gl.drawArrays(gl.LINE_STRIP, 0, positionArray.length / 3);
			break;
		case 'line_loop':
			gl.drawArrays(gl.LINE_LOOP, 0, positionArray.length / 3);
			break;
		case 'triangles':
			gl.drawArrays(gl.TRIANGLES, 0, positionArray.length / 3);
			break;
		case 'triangle_loop':
			gl.drawArrays(gl.TRIANGLE_LOOP, 0, positionArray.length / 3);
			break;
		default:
			gl.drawArrays(gl.POINTS, 0, positionArray.length / 3);
	}
}

var hexIndex = 0;

function hexID() {
	let text = hexIndex.toString(16).toUpperCase();

  while (text.length < 6) {
  	text = '0' + text;
  }

  text = '#' + text;

  hexIndex++;
  return text;
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16) / 255,
		g: parseInt(result[2], 16) / 255,
		b: parseInt(result[3], 16) / 255
	} : null;
}

// Generate circle with center in n1 perpendicular to n1->n2
function generateCircles(n1, n2) {
	// Get p1
	let p1 = n1.point;

	// Get p2
	let p2 = n2.point;

	// Get vector from p1 to p2
	let v = [p2.x - p1.x,
	p2.y - p1.y,
	p2.z - p1.z];

	// Calculate normal vector
	let n = getPerpendicular(v, RADIUS);

	// Calculate cross vector
	let p = crossProduct(v, n);

	// Get vectors magnitude. Then calculate unit vectors
	let s1 = vectorMagnitude(n),
	s2 = vectorMagnitude(p);

	let u1 = [n[0] / s1, n[1] / s1, n[2] / s1],
	u2 = [p[0] / s2, p[1] / s2, p[2] / s2];

	// Calculate circles
	let circle1 = [],
	circle2 = [];

	for (let i = 0; i < 360; i += 30) {
		let angle = i * Math.PI / 180;
		// Calculate vector direction
		let direction = [RADIUS * (Math.cos(angle) * u1[0] + Math.sin(angle) * u2[0]),
		RADIUS * (Math.cos(angle) * u1[1] + Math.sin(angle) * u2[1]),
		RADIUS * (Math.cos(angle) * u1[2] + Math.sin(angle) * u2[2])
		]
		circle1.push(new Coord(p1.x + direction[0], p1.y + direction[1], p1.z + direction[2], 0.0, 0.0, 1.0));
		circle2.push(new Coord(p2.x + direction[0], p2.y + direction[1], p2.z + direction[2], 0.0, 0.0, 1.0));
	}

	return {
		circle1: circle1,
		circle2: circle2
	};
}

// Return perpendicular to a vector with length
function getPerpendicular(vector, length) {
	if (!length)
		length = 1;
	if (vector[0] == 0 && vector[1] == 0) {
		if (vector[2] == 0) {
			// vector is [0, 0, 0]
			return null;
		} else {
			// vector is [0, 0, z]
			return [0, length, 0];
		}
	} else {
		// vector is [x, 0, 0] || [0, y, 0] || [x, y, 0] || [x, 0, z] || [0, y, z] || [x, y, z]
		let l = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
		return [(vector[1] * length) / l, (-vector[0] * length) / l, 0];
	}
}

// Calculate dot product of two vectors
function dotProduct(v1, v2) {

	return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

// Calculate cross product of two vectors
function crossProduct(v1, v2, normal) {
	let ret = [(v1[1] * v2[2] - v2[1] * v1[2]), -(v1[0] * v2[2] - v2[0] * v1[2]), (v1[0] * v2[1] - v2[0] * v1[1])];
	if (normal) {
		let l = Math.sqrt(Math.pow(ret[0], 2) + Math.pow(ret[1], 2) + Math.pow(ret[2], 2));
		ret[0] = ret[0] / l;
		ret[1] = ret[1] / l;
		ret[2] = ret[2] / l;
	}
	return ret;
}

// Calculate magnitude of vector
function vectorMagnitude(v) {
	let s = 0;

	for (let i = 0; i < v.length; i++) {
		s += Math.pow(v[i], 2);
	}

	return Math.sqrt(s);
}

// Calc unit vector
function normalizeVector(v) {
	let l = vectorMagnitude(v);
	return [v[0] / l, v[1] / l, v[2] / l];
}

// Calculate angle between two vectors
function getAngle(v1, v2, degrees) {
	let l1 = vectorMagnitude(v1);
	let l2 = vectorMagnitude(v2);
	let d = dotProduct(v1, v2);
	let cos = d / (l1 * l2);
	if (degrees)
		return Math.acos(cos) * 180 / Math.PI;
	else
		return Math.acos(cos);
}

// Calculate center of a circle (pA and pB are on oposite sides!)
function circleCenter(pA, pB) {
	let r = [(pB.x - pA.x) / 2, ((pB.y - pA.y) / 2), ((pB.z - pA.z) / 2)];
	return new Coord(pA.x + r[0], pA.y + r[1], pA.z + r[2], 1.0, 0.0, 0.0);
}

function rotatePointAboutPoint(pA, pB, angleX, angleY, angleZ) {
	let ret = [pA[0], pA[1], pA[2]];

	// console.log(ret);
	// console.log(pB);

	// First translate pA as to put pB in the origin
	ret[0] = ret[0] - pB[0];
	ret[1] = ret[1] - pB[1];
	ret[2] = ret[2] - pB[2];

	if (angleX) {
		let a = ret[0];
		let b = ret[1];
		let c = ret[2];
		// Rotate around X axis
		let aX = Math.PI * angleX / 180;
		ret[0] = a;
		ret[1] = b * Math.cos(aX) - c * Math.sin(aX); 
		ret[2] = b * Math.sin(aX) + c * Math.cos(aX);
	}

	if (angleY) {
		let a = ret[0];
		let b = ret[1];
		let c = ret[2];
		// Rotate around Y axis
		let aY = Math.PI * angleY / 180;
		ret[0] = a * Math.cos(aY) + c * Math.sin(aY); 
		ret[1] = b;
		ret[2] = - a * Math.sin(aY) + c * Math.cos(aY);
	}

	if (angleZ) {
		let a = ret[0];
		let b = ret[1];
		let c = ret[2];
		// Rotate around Z axis
		let aZ = Math.PI * angleZ / 180;
		ret[0] = a * Math.cos(aZ) - b * Math.sin(aZ);
		ret[1] = a * Math.sin(aZ) + b * Math.cos(aZ);
		ret[2] = c;
	}

	// Then translate back
	ret[0] = ret[0] + pB[0];
	ret[1] = ret[1] + pB[1];
	ret[2] = ret[2] + pB[2];

	// console.log(ret);
	// console.log('---');
	return ret;
}
/**
 * Resize a canvas to match the size its displayed.
 * @param {HTMLCanvasElement} canvas The canvas to resize.
 * @param {number} [multiplier] amount to multiply by.
 *    Pass in window.devicePixelRatio for native pixels.
 * @return {boolean} true if the canvas was resized.
 * @memberOf module:webgl-utils
 */
function resizeCanvasToDisplaySize(canvas, multiplier) {
	multiplier = multiplier || 1;
	var width  = canvas.clientWidth  * multiplier | 0;
	var height = canvas.clientHeight * multiplier | 0;
	if (canvas.width !== width ||  canvas.height !== height) {
		canvas.width  = width;
		canvas.height = height;
		return true;
	}
	return false;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}