const game = {

	container: document.getElementsByClassName("game-container")[0],
	fpsElement: null,
	boxElement: null,
	boxPosition: [0,0],

	start: function() {
		menuLib.hide();
        this.container.classList.remove('game-invisible');

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
			let pair = [0,0]
			pair[0] += gamepad.buttons[15].value - gamepad.buttons[14].value + gamepad.axes[0];
			pair[1] += gamepad.buttons[13].value - gamepad.buttons[12].value + gamepad.axes[1];
			
			gamepadProxy.normalizeAxisPair(pair);
			
			this.boxPosition[0] += pair[0];
			this.boxPosition[1] += pair[1];
		}
		this.boxElement.style.left = this.boxPosition[0] + "px";
		this.boxElement.style.top = this.boxPosition[1] + "px";
	},
};

menuData = {
    title: "Easy Game dev",
    children: {
        "play": {
            title: "Play",
            action: () => game.start(),
        },
    }
};

menuLib.component = document.getElementsByClassName("menu-content")[0];
menuLib.show();
