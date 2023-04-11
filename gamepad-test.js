const div = document.getElementById('gamepad');

function fillGamedpadDiv() {
	const gamepad = gamepadProxy.getGamepads()[0];
	if (!gamepad) {
		div.innerHTML = 'Connect or press a button on gamepad to see info';
		return;
	}
	div.innerHTML = 'Gamepad id: ' + gamepad.id;
	gamepad.buttons.forEach((button , index) => {
		div.innerHTML += `<br>button ${index}: ${button.value}`;
	});
	gamepad.axes.forEach((axis , index) => {
		div.innerHTML += `<br>axis ${index}: ${axis}`;
	});
}

function loop() {
	
	fillGamedpadDiv();
	
	requestAnimationFrame(() => loop());
};

loop();