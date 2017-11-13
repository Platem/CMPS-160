$(function() {
	/* Toggle Panels */
	$('.nav-icon').on('click', function(e) {
		let t = $(this).attr('data-toggle');
		$(this).toggleClass('opened');
		$('#' + t).toggleClass('collapsed');

		updateCanvas();
	});

	$('.nav-icon').each(function() {
		let t = $(this).attr('data-toggle');
		$(this).toggleClass('opened');
		$('#' + t).toggleClass('collapsed');
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