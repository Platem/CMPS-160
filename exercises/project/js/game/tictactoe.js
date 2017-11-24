var TicTacToe = function() {
	/* Game Functions */
	this.reset = function() {
		this.board = [[-1, -1, -1],
									[-1, -1, -1],
									[-1, -1, -1]];

		this.playing = false;
		this.turn = -1;	// 0 for cross, 1 for circle

		this.tableObj().reset();

		for (let cross of this.crossObj) {
			cross.reset();
		}

		for (let circle of this.circleObj) {
			circle.reset();
		}
	};

	this.drawGame = function() {

		this.circleObj[0].drawObj();

	}

	/* Game setup */
	this.board = [[-1, -1, -1],		//-1 not set. 0 cross, 1 circle
								[-1, -1, -1],
								[-1, -1, -1]];

	this.playing = false;
	this.turn = -1;	// 0 for cross, 1 for circle

	this.tableObj = 	new Table();
	this.crossObj =  [new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0])];
	this.circleObj = [new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0])];
}
