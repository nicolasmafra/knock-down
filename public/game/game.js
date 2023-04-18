import { gamepadKeyboard } from '../libs/gamepad-keyboard.js';
import { gamepadProxy } from '../libs/gamepad-proxy.js';
import looper from '../libs/looper.js';

const game = {

	fpsElement: document.getElementById('FPS'),
	boxElement: document.getElementById('box'),

	boxPosition: [0,0],
	boxMove: [0,0],
	boxSpeed: 3,

	configure: function() {
		gamepadKeyboard.configure();
		gamepadProxy.additionalGamepads.push(gamepadKeyboard.getGamepad());
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.render(delta);
	},

	start: function() {
		this.boxPosition = [
			window.innerWidth/2,
			window.innerHeight/2,
		];
		
		looper.start();
	},
	
	render: function(delta) {
		this.updateGui();
		this.moveBox();
	},

	updateGui: function() {
		if (looper.ticks % 15 == 0) {
			this.fpsElement.innerHTML = looper.getFpsAverage().toFixed(2);
		}
	},

	moveBox: function() {
		this.boxMove[0] = 0;
		this.boxMove[1] = 0;
		
		const gamepad = gamepadProxy.getGamepads()[0];
		if (gamepad) {
			this.boxMove[0] += gamepad.buttons[15].value - gamepad.buttons[14].value + gamepad.axes[0];
			this.boxMove[1] += gamepad.buttons[13].value - gamepad.buttons[12].value + gamepad.axes[1];
			
			gamepadProxy.normalizeAxisPair(this.boxMove);
			
			this.boxPosition[0] += this.boxSpeed * this.boxMove[0];
			this.boxPosition[1] += this.boxSpeed * this.boxMove[1];
			
			this.boxElement.style.left = this.boxPosition[0] + "px";
			this.boxElement.style.top = this.boxPosition[1] + "px";
		}
	},
};

export default game;