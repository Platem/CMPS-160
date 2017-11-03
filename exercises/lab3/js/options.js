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

	scale_range: [-500, 500],

	viewer: {
		position: [0.0, 0.0, 500.0],
		center: [0.0, 0.0, 0.0],
		up: [0.0, 500.0, 0.0]
	},

	perspective: {
		enabled: true,
		fovy: 100,
		aspect: 1,
		near: 500,
		far: 1
	},

	light_sources: [{
		id: "",
		type: "directional",
		direction: [500.0, 500.0, 500.0],
		color: [1.0, 1.0, 1.0],
		enabled: true
	}, {
		id: "",
		type: "point",
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