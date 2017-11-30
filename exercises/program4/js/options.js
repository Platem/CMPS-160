var draw_options = {
	draw_normals: false,
	draw_skeleton: false,
	draw_surfaces: true,
	draw_points: false,

	draw_rotation: {
		x: 0.0,
		y: 0.0,
		z: 0.0	
	},

	draw_translate: {
		x: 0.0,
		y: 0.0,
		z: 0.0
	},

	useTexture: false,
	mixTexColors: false,

	scale_range: [-500, 500],

	viewer: {
		position: [0.0, 0.0, 500.0],
		center: [0.0, 0.0, 0.0],
		up: [0.0, 500.0, 0.0]
	},

	orthographic: {
		left: -500,
		right: 500,
		bottom: -500,
		top: 500,
		near: -500,
		far: 500
	},

	perspective: {
		enabled: false,
		fovy: 100,
		aspect: 1,
		near: 1,
		far: 1000
	},

	light_sources: [{
		id: "",
		type: "directional",
		point: [500.0, 500.0, 500.0],
		direction: [500.0, 500.0, 500.0],
		color: [1.0, 1.0, 1.0],
		enabled: true
	}, {
		id: "",
		type: "point",
		direction: [0.0, 500.0, 0.0],
		point: [0.0, 500.0, 0.0],
		color: [1.0, 1.0, 0.0],
		enabled: true
	}],

	light_ambient: true,
	light_difuse: true,
	light_specular: false,

	smooth_shading: false,

	surface_ka: [0.0, 0.0, 0.2],
	surface_kd: [1.0, 0.0, 0.0],
	surface_ks: [0.0, 1.0, 0.0],
	surface_ns: 20.0,

	normals_color: [1.0, 0.79, 0.79],
	points_color: [0.0, 0.0, 1.0],
	skeleton_color: [0.0, 0.0, 1.0],

	opacity_enabled: true
};