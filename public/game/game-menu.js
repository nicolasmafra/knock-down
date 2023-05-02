import menuLib from '../libs/menu-lib.js';
import game from './game.js';

const gameMenu = {
    configure: function() {
        menuLib.data = {
            title: "Easy Game dev",
            children: {
                "1-player": {
                    title: "1 Player",
                    action: () => this.playGame(1),
                },
                "2-players": {
                    title: "2 Players",
                    action: () => this.playGame(2),
                },
                "3-players": {
                    title: "3 Players",
                    action: () => this.playGame(3),
                },
            }
        };
    },

    start: function() {
        menuLib.start();
    },

    playGame: function(playerCount) {
        game.playerCount = playerCount;
        menuLib.hide();
        game.start();
    },

    show: function() {
        menuLib.show();
    }
};

export default gameMenu;
