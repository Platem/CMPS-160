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
		this.crossObj[0].drawObj();

		this.tableObj.drawObj();
	}

	/* Game setup */
	this.board = [[-1, -1, -1],		//-1 not set. 0 cross, 1 circle
								[-1, -1, -1],
								[-1, -1, -1]];

	this.playing = false;
	this.turn = -1;	// 0 for cross, 1 for circle

	this.tableObj = 	new Table( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]);
	this.tableObj.addTransform('rotate', [-40, 0, 0])
	this.tableObj.applyTransform();

	this.crossObj =  [new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Cross( [0.0, 0.0, 0.0], [0.0, 0.0, 1.0])];

	this.circleObj = [new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0]), 
										new Circle([0.0, 0.0, 0.0], [0.0, 0.0, 1.0])];

	this.crossObj[0].addTransform('scale', -0.85);
	this.crossObj[0].addTransform('rotate', [-40, 0, 0])

	this.crossObj[0].addTransform('translate',[-165, -90, 165]);

	this.crossObj[0].applyTransform();
}

/*
	Object positions:
		Top left: 			addTransform('translate',[-165, 165, -50]);
		Top center: 		addTransform('translate',[0, 165, -50]);
		Top right: 			addTransform('translate',[165, 165, -50]);
	
		Center left: 		addTransform('translate',[-165, 40, 60]);
		Center center: 	addTransform('translate',[0, 40, 60]);
		Center right: 	addTransform('translate',[165, 40, 60]);
	
		Bottom left: 		addTransform('translate',[-165, -90, 160]);
		Bottom center: 	addTransform('translate',[0, -90, 160]);
		Bottom right: 	addTransform('translate',[165, -90, 160]);

*/	