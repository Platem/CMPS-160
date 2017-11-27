var TicTacToe = function() {
	/* Game Functions */
	this.reset = function() {
		this.board = [[-1, -1, -1],
									[-1, -1, -1],
									[-1, -1, -1]];

		this.playing = false;
		this.turn = 0;	// 0 for cross, 1 for circle
		this.nextCross = 0;
		this.nextCircle = 0;
		this.winner = null;

		this.tableObj.reset();

		for (let cross of this.crossObj) {
			cross.reset();
		}

		for (let circle of this.circleObj) {
			circle.reset();
		}

	};

	this.drawGame = function(mouse) {
		this.tableObj.drawObj();

		if (this.turn != -1 && this.playing) {
			let zone = this.tableObj.checkForTableZone(this.mousePosition);
			this.zoneHover = zone;

			if (this.zoneHover && this.board[this.zoneHover[0]][this.zoneHover[1]] == -1) {
				// Is a free zone
				if (this.turn == 0) {
					this.crossGuide.setZone(this.zoneHover);
					this.crossGuide.drawObj();
				} else if (this.turn == 1) {
					this.circleGuide.setZone(this.zoneHover);
					this.circleGuide.drawObj();
				}
			}
		}

		for (let i = 0; i < this.nextCross; i++) {
			this.crossObj[i].drawObj();
		}

		for (let i = 0; i < this.nextCircle; i++) {
			this.circleObj[i].drawObj();
		}

	}

	this.doTurn = function() {
		if (this.playing && this.zoneHover && this.board[this.zoneHover[0]][this.zoneHover[1]] == -1) {
			// Update board
			this.board[this.zoneHover[0]][this.zoneHover[1]] = this.turn;

			// Update objects
			if (this.turn == 0) {
				this.crossObj[this.nextCross].setZone(this.zoneHover);
				this.crossObj[this.nextCross].zone = this.zoneHover;
				this.nextCross++;
			} else if (this.turn == 1) {
				this.circleObj[this.nextCircle].setZone(this.zoneHover);
				this.circleObj[this.nextCircle].zone = this.zoneHover;
				this.nextCircle++;
			}

			// Update turn
			if 			(this.turn == 1) this.turn = 0;
			else if (this.turn == 0) this.turn = 1;

			// Check Board
			this.doCheck();
		}
	}

	this.doCheck = function() {
		if (this.board[0][0] != -1) {
			// row0
			if (this.board[0][0] == this.board[0][1] && this.board[0][1] == this.board[0][2]) {
				this.endGame({
					winner: this.board[0][0],
					winnerPositions: [[0, 0], [0, 1], [0, 2]]
				});
				return;
			}

			// col0
			if (this.board[0][0] == this.board[1][0] && this.board[1][0] == this.board[2][0]) {
				this.endGame({
					winner: this.board[0][0],
					winnerPositions: [[0, 0], [1, 0], [2, 0]]
				});
				return;
			}

			// dia0
			if (this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
				this.endGame({
					winner: this.board[0][0],
					winnerPositions: [[0, 0], [1, 1], [2, 2]]
				});
				return;
			}
		}

		if (this.board[1][0] != -1) {
			// row1
			if (this.board[1][0] == this.board[1][1] && this.board[1][1] == this.board[1][2]) {
				this.endGame({
					winner: this.board[1][0],
					winnerPositions: [[1, 0], [1, 1], [1, 2]]
				});
				return;
			}
		}

		if (this.board[2][0] != -1) {
			// row2
			if (this.board[2][0] == this.board[2][1] && this.board[2][1] == this.board[2][2]) {
				this.endGame({
					winner: this.board[2][0],
					winnerPositions: [[2, 0], [2, 1], [2, 2]]
				});
				return;
			}

			// dia1
			if (this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]) {
				this.endGame({
					winner: this.board[2][0],
					winnerPositions: [[2, 0], [1, 1], [0, 2]]
				});
				return;
			}
		}

		if (this.board[0][1] != -1) {
			// col1
			if (this.board[0][1] == this.board[1][1] && this.board[1][1] == this.board[2][1]) {
				this.endGame({
					winner: this.board[0][1],
					winnerPositions: [[0, 1], [1, 1], [2, 1]]
				});
				return;
			}
		}

		if (this.board[0][2] != -1) {
			// col2
			if (this.board[0][2] == this.board[1][2] && this.board[1][2] == this.board[2][2]) {
				this.endGame({
					winner: this.board[0][2],
					winnerPositions: [[0, 2], [1, 2], [2, 2]]
				});
				return;
			}
		}

		if (this.nextCircle > 3 && this.nextCross > 4) {
			// Draw
			this.endGame({
				winner: null,
				winnerPositions: null
			});
		}
	}

	this.endGame = function(opts) {
		this.playing = false;
		this.winner = opts.winner;
		this.winnerPositions = opts.winnerPositions;

		if (this.winner == 0) {
			let w0 = this.winnerPositions[0];
			let w1 = this.winnerPositions[1];
			let w2 = this.winnerPositions[2];

			for (let i = 0; i < this.nextCross; i++) {
				let z = this.crossObj[i].zone;

				if (z) {
					if ((z[0] == w0[0] && z[1] == w0[1]) || 
							(z[0] == w1[0] && z[1] == w1[1]) || 
							(z[0] == w2[0] && z[1] == w2[1])) {
						this.crossObj[i].isWinner = true;
					}
				}
			}
		} else if (this.winner == 1) {
			let w0 = this.winnerPositions[0];
			let w1 = this.winnerPositions[1];
			let w2 = this.winnerPositions[2];

			for (let i = 0; i < this.nextCircle; i++) {
				let z = this.circleObj[i].zone;

				if (z) {
					if ((z[0] == w0[0] && z[1] == w0[1]) || 
							(z[0] == w1[0] && z[1] == w1[1]) || 
							(z[0] == w2[0] && z[1] == w2[1])) {
						this.circleObj[i].isWinner = true;
					}
				}
			}
		}
	}

	/* Game setup */
	this.board = [[-1, -1, -1],		//-1 not set. 0 cross, 1 circle
								[-1, -1, -1],
								[-1, -1, -1]];

	this.playing = true;
	this.turn = 0;	// 0 for cross, 1 for circle
	this.nextCross = 0;
	this.nextCircle = 0;
	this.mousePosition = [0.0, 0.0];
	this.zoneHover = null;
	this.winner = null;
	this.winnerPositions = null;

	/* Create objs */
	this.tableObj = 	new Table( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]);

	this.crossObj =  [new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0])];
	this.crossGuide = new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0], true);

	this.circleObj = [new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0])];
	this.circleGuide= new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0], true);

	/* Setup objs */
	this.tableObj.addTransform('rotate', [-40, 0, 0])
	this.tableObj.applyTransform();

	for (let cross of this.crossObj) {
		cross.addTransform('scale', -0.85);
		cross.addTransform('rotate', [-40, 0, 0]);
		cross.applyTransform();
	}
	this.crossGuide.addTransform('scale', -0.85);
	this.crossGuide.addTransform('rotate', [-40, 0, 0]);
	this.crossGuide.applyTransform();

	for (let cir of this.circleObj) {
		cir.addTransform('scale', -0.85);
		cir.addTransform('rotate', [-40, 0, 0]);
		cir.applyTransform();
	}
	this.circleGuide.addTransform('scale', -0.85);
	this.circleGuide.addTransform('rotate', [-40, 0, 0]);
	this.circleGuide.applyTransform();
}

/*
	Object positions:
		Top left: 			addTransform('translate',[-165, 165, -50]);
		Top center: 		addTransform('translate',[0, 165, -50]);
		Top right: 			addTransform('translate',[165, 165, -50]);
	
		Center left: 		addTransform('translate',[-165, 40, 60]);
		Center center: 	addTransform('translate',[0, 40, 60]);
		Center right: 	addTransform('translate',[165, 40, 60]);
	
		Bottom left: 		addTransform('translate',[-165, -90, 165]);
		Bottom center: 	addTransform('translate',[0, -90, 165]);
		Bottom right: 	addTransform('translate',[165, -90, 165]);

*/	