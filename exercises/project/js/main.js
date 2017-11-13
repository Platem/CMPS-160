$(function() {
	/* Toggle Panels */
	$('.nav-icon').on('click', function(e) {
		let t = $(this).attr('data-toggle');
		$(this).toggleClass('opened');
		$('#' + t).toggleClass('collapsed');

		if (t == 'left-panel') {
			$('#page').toggleClass('left-opened');
		} else if (t == 'right-panel') {
			$('#page').toggleClass('right-opened');
		}

		updateCanvas();
	});
	$(window).on('resize', function () {
		updateCanvas();
	});

	updateCanvas();
});

function updateCanvas() {
	let webgl = $('#webgl');
	let canvas = $('#canvas');

	let w = webgl.width();
	let h = webgl.height();
	let W = canvas.width() - 20;
	let H = canvas.height() - 20;

	let ratio = W / w;

	if (h * ratio > H)
		ratio = H / h;

	webgl.width(w * ratio);
	webgl.height(h * ratio);
}