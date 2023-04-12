const game = {

	fpsElement: null,
	boxElement: null,
	boxPosition: [0,0],

	start: function() {
		this.fpsElement = document.getElementById('FPS');
		this.boxElement = document.getElementById('box');
		
		gamepadKeyboard.configure();
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.render(delta);
		looper.start();
	},
	
	render: function(delta) {
		this.fpsElement.innerHTML = looper.getFpsAverage().toFixed(1);
		
		const gamepad = gamepadProxy.getGamepads()[0];
		if (gamepad) {
			this.boxPosition[0] += gamepad.buttons[15].value - gamepad.buttons[14].value + gamepad.axes[0];
			this.boxPosition[1] += gamepad.buttons[13].value - gamepad.buttons[12].value + gamepad.axes[1];
		}
		this.boxElement.style.left = this.boxPosition[0] + "px";
		this.boxElement.style.top = this.boxPosition[1] + "px";
	},
};

game.start();
