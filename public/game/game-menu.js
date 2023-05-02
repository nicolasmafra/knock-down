import menuLib from '../libs/menu-lib.js';
import game from './game.js';

const gameMenu = {
    configure: function() {
        menuLib.stackMin = 1;
        menuLib.data = {
            title: "root",
            children: {
                "visible": {
                    title: "Knock Down",
                    children: {
                        "2-players": {
                            title: "2 Players",
                            action: () => this.playGame(2),
                        },
                        "3-players": {
                            title: "3 Players",
                            action: () => this.playGame(3),
                        },
                        "4-players": {
                            title: "4 Players",
                            action: () => this.playGame(4),
                        },
                    }
                },
                "message": {
                    title: "XXX",
                    children: {
                        "back": {
                            title: "Back",
                            action: () => this.backToMainMenu(),
                        }
                    }
                },
            }
        };
    },

    backToMainMenu: function() {
        menuLib.setCurrentMenu(['visible']);
    },

    start: function() {
        menuLib.start();
        this.backToMainMenu();
    },

    playGame: function(playerCount) {
        game.playerCount = playerCount;
        menuLib.hide();
        game.start();
    },

    show: function() {
        menuLib.show();
    },

    showMessage: function(message) {
        console.log(message);
        menuLib.data.children.message.title = message;
        menuLib.setCurrentMenu(['message']);
        menuLib.show();
    },
};

export default gameMenu;
