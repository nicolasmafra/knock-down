const keyboardSchema = {
	buttons: [
		'Z',
		'X',
		'A',
		'S',
		'D',
		'C',
		'F',
		'V',
		'Shift',
		'Enter',
		'G',
		'B',
		'ArrowUp',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
	],
};

const gamepadKeyboard = {
	
	state: {
		id: "Keyboard",
		buttons: [],
		axes: [0,0],
	},
	
	getGamepad: function() {
		return this.state.buttons.length == 0 ? null : this.state;
	},
	
	configure: function() {
		keyboardSchema.buttons.forEach(x => this.state.buttons.push({
			pressed: false,
			touched: false,
			value: 0,
		}));
		document.addEventListener("keydown", event => this.onkeydown(event), false);
		document.addEventListener("keyup", event => this.onkeyup(event), false);
	},
	
	onkeydown: function(event) {
		let index = keyboardSchema.buttons.findIndex(key => key.toUpperCase() == event.key.toUpperCase());
		
		if (index < 0) {
			return;
		}
		let button = this.state.buttons[index];
		button.pressed = true;
		button.touched = true;
		button.value = 1;
	},
	
	onkeyup: function(event) {
		let index = keyboardSchema.buttons.findIndex(key => key.toUpperCase() == event.key.toUpperCase());
		
		if (index < 0) {
			return;
		}
		let button = this.state.buttons[index];
		button.pressed = false;
		button.touched = false;
		button.value = 0;
	},
};