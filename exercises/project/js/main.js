$(function() {
	/* Toggle Panels */
	$('.nav-icon').on('click', function(e) {
		let t = $(this).attr('data-toggle');
		$(this).toggleClass('opened');
		$('#' + t).toggleClass('collapsed');
		setTimeout(function() {
			updateCanvas(true);
		}, 0);
	});

	$(window).on('resize', function(e) {
		updateCanvas(true);
	});

	/* Toggle lists on panels */
	$('.header').on('click', function() {
		let $toggled = $('#' + $(this).attr('data-toggle'));
		let side = $toggled.hasClass('left-list') ? 'left' : 'right';

		$toggled.slideToggle(500);
	});

	$('.list').each(function(){
		$(this).slideToggle(500);
	});

	/* Setup */
	if (!setup()) {
		console.log('There was an error in the setup. Exiting now.');
		return;
	}
	updateCanvas(true);
});

function updateCanvas(animate) {
	let webgl = $('#webgl');
	let content = $('#content');
	let opened = 0;
	if (!$('#left-panel').hasClass('collapsed')) opened++;
	if (!$('#right-panel').hasClass('collapsed')) opened++;

	let w = webgl.width();
	let h = webgl.height();

	let W = (content.width() / (3 + opened)) * 3 - 20;
	let H = content.height() - 20;

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