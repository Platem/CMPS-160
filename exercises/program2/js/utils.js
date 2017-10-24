// Generate circle with center in n1 perpendicular to n1->n2
function generateCircles(n1, n2) {
	// Get p1
	let p1 = n1.point;

	// Get p2
	let p2 = n2.point;

	// Get vector from p1 to p2
	let v = [p2.x - p1.x,
	p2.y - p1.y,
	p2.z - p1.z,
	0.0,
	0.0,
	0.0
	];

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

// Reflection of v about w
// r = v - (2(v·w)/|w|^2) * w
function getReflection(v, w) {
	let k = 2 * dotProduct(v, w) / Math.pow(vectorMagnitude(w), 2);

	return [v[0] - k * w[0],
					v[1] - k * w[1],
					v[2] - k * w[2]];
}

// Calculate center of a circle (pA and pB are on oposite sides!)
function circleCenter(pA, pB) {
	let r = [(pB.x - pA.x) / 2, ((pB.y - pA.y) / 2), ((pB.z - pA.z) / 2)];
	return new Coord(pA.x + r[0], pA.y + r[1], pA.z + r[2], 1.0, 0.0, 0.0);
}