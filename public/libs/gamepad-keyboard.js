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
		'Escape',
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
	isMouseRelative: true,
	mouseStartPosition: [0,0],
	
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
		this.mouseStartPosition[0] = event.pageX;
		this.mouseStartPosition[1] = event.pageY;
		this.onmousemove(event);
	},
	
	onmousemove: function(event) {
		if (!this.mouseState) {
			this.state.axes[0] = 0;
			this.state.axes[1] = 0;
			return;
		}
		let size = Math.min(window.innerWidth, window.innerHeight);
		if (this.isMouseRelative) {
			this.state.axes[0] = 2*(event.pageX - this.mouseStartPosition[0]) / size;
			this.state.axes[1] = 2*(event.pageY - this.mouseStartPosition[1]) / size;
		} else {
			this.state.axes[0] = -1 + 2* event.pageX / size;
			this.state.axes[1] = -1 + 2* event.pageY / size;
		}
	},
};

export { keyboardSchema, gamepadKeyboard }
