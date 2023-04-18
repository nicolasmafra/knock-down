import menuLib from '../libs/menu-lib.js';
import game from './game.js';

const gameMenu = {
    configure: function() {
        menuLib.data = {
            title: "Easy Game dev",
            children: {
                "play": {
                    title: "Play Game",
                    action: () => this.playGame(),
                },
            }
        };
    },

    start: function() {
        menuLib.start();
    },

    playGame: function() {
        menuLib.hide();
        game.start();
    },
};

export default gameMenu;
