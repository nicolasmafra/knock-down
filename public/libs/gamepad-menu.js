import menuLib from './menu-lib.js';
import { gamepadProxy } from './gamepad-proxy.js';

export default {
    inAction: false,
    checkMenuInput: function() {
        let inActionNow = false;
        gamepadProxy.getGamepads().forEach(gamepad => {
            if (gamepad.axes[1] > 0.5) {
                if (!this.inAction) menuLib.moveDown();
                inActionNow = true;
            }
            if (gamepad.axes[1] < -0.5) {
                if (!this.inAction) menuLib.moveUp();
                inActionNow = true;
            }
            if (gamepad.buttons[0].value >= 1) {
                if (!this.inAction) menuLib.select();
                inActionNow = true;
            }
            if (gamepad.buttons[1].value >= 1) {
                if (!this.inAction) menuLib.back();
                inActionNow = true;
            }
        });
        this.inAction = inActionNow;
    },
};