var Game;

$(function() {
	/* Toggle Panels */
	$('.nav-icon').on('click', function(e) {
		let t = $(this).attr('data-toggle');
		$(this).toggleClass('opened');
		$('#' + t).toggleClass('collapsed');
		
		updateCanvas(true);
	});

	let resizetimer;
	$(window).on('resize', function(e) {
		clearInterval(resizetimer);
		resizetimer = setTimeout(function() {
			updateCanvas(true);
		}, 50);
	});

	/* Toggle lists on panels */
	$('.header').on('click', function() {
		let $toggled = $('#' + $(this).attr('data-toggle'));
		let side = $toggled.hasClass('left-list') ? 'left' : 'right';

		$toggled.slideToggle();
	});

	$('.panel').each(function() {
		$(this).toggleClass('collapsed');
	});

	$('.nav-icon').each(function() {
		$(this).toggleClass('opened');
	});

	$('.header').each(function(){
		let $toggled = $('#' + $(this).attr('data-toggle'));
		let side = $toggled.hasClass('left-list') ? 'left' : 'right';

		if (side == 'left')
			$toggled.toggle();
	});



	$(document).keypress(function(e) {
		// console.log(e.which);
		switch (e.which) {
			case 32:
				e.preventDefault();
				move = move ? false : true;
				break;
			case 114:
				e.preventDefault();
				Game = new TicTacToe();
				break;
		}
	});

	$('#webgl').mousemove(function(e) {
		e.preventDefault();
		mouse[0] = event.clientX;
		mouse[1] = event.clientY;
		Game.mousePosition = mouse;
	});

	$('#webgl').click(function(e) {
		e.preventDefault();
		Game.doTurn();

		if (Game.playing == false) {
			let winner = Game.winner;

			if (winner == 0) {
				alert('Cross wins!');
			} else if (winner == 1) {
				alert('Circle wins!');
			} else {
				alert("Is draw!");
			}
		}
	});

	/* Init game */

	/* Setup */
	updateCanvas(true);
	setupScene();
	setTimeout(function() {
		Game = new TicTacToe();
		requestAnimationFrame(drawScene);
	}, 500);
	
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