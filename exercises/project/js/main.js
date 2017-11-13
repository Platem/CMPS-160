let resizeTimer;

$(function() {
	/* Toggle Panels */
	$('.nav-icon').on('click', function(e) {
		let t = $(this).attr('data-toggle');
		$(this).toggleClass('opened');
		$('#' + t).toggleClass('collapsed');
		setTimeout(function() {
			updateCanvas(true);
		}, 500);
	});

	$(window).on('resize', function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			updateCanvas(true);
		}, 250);
	});

	updateCanvas(true);
});

function updateCanvas(animate) {
	let webgl = $('#webgl');
	let canvas = $('#canvas');

	let w = webgl.width();
	let h = webgl.height();

	let W = canvas.width() - 20;
	let H = canvas.height() - 20;

	if (W > H) {
		if (animate) {
			webgl.animate({
				width: H,
				height: H
			}, 500);
		} else {
			webgl.width(H);
			webgl.height(H);
		}
	} else if (W < H) {
		if (animate) {
			webgl.animate({
				width: W,
				height: W
			}, 500);
		} else {
			webgl.width(W);
			webgl.height(W);
		}
	}
}