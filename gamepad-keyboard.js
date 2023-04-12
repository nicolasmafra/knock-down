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
	mouseState: null,
	
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
		document.addEventListener("mousedown", event => this.onMouseStateChange(event));
		document.addEventListener("mouseup", event => this.onMouseStateChange(event));
		document.addEventListener("mousemove", event => this.onmousemove(event));
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
	
	onMouseStateChange: function(event) {
		var flags = event.buttons !== undefined ? event.buttons : event.which;
		this.mouseState = (flags & 1) === 1;
		this.onmousemove(event);
	},
	
	onmousemove: function(event) {
		if (this.mouseState) {
			this.state.axes[0] = -1 + 2* event.pageX / window.innerWidth;
			this.state.axes[1] = -1 + 2* event.pageY / window.innerHeight;
		} else {
			this.state.axes[0] = 0;
			this.state.axes[1] = 0;
		}
	},
};