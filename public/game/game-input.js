import { gamepadKeyboard } from '../libs/gamepad-keyboard.js';
import { gamepadProxy } from '../libs/gamepad-proxy.js';

const gameInput = {

    playersInput: [
        {
            move: [0,0]
        }
    ],

	configure: function() {
		gamepadKeyboard.configure();
		gamepadProxy.additionalGamepads.push(gamepadKeyboard.getGamepad());
    },

    start: function(playerCount) {
        this.playersInput = [];
        for (var i = 0; i < playerCount; i++) {
            this.playersInput.push({
                move: [ 0, 0 ]
            });
        }
    },

	listen: function() {
        const gamepads = gamepadProxy.getGamepads();
        this.playersInput.forEach((input, i) => {
            let gamepad = gamepads[i];
            this.listenInput(input, gamepad);
        });
	},

    listenInput(input, gamepad) {
        input.move[0] = 0;
        input.move[1] = 0;

        if (gamepad) {
            input.move[0] += gamepad.buttons[15].value - gamepad.buttons[14].value + gamepad.axes[0];
            input.move[1] -= gamepad.buttons[13].value - gamepad.buttons[12].value + gamepad.axes[1];
            
            gamepadProxy.normalizeAxisPair(input.move);
        }
    },

};

export default gameInput;