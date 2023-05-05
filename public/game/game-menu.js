import menuLib from '../libs/menu-lib.js';
import game from './game.js';

const gameMenu = {
    configure: function() {
        menuLib.stackMin = 1;
        menuLib.data = {
            title: "root",
            children: {
                "main": {
                    title: "Bem vindo ao Knock Down",
                    children: {
                        "2-players": {
                            title: "2 Players",
                            action: () => this.selectPlayerCount(2),
                        },
                        "3-players": {
                            title: "3 Players",
                            action: () => this.selectPlayerCount(3),
                        },
                        "4-players": {
                            title: "4 Players",
                            action: () => this.selectPlayerCount(4),
                        },
                    }
                },
                "message": {
                    title: "XXX",
                    children: {
                        "again": {
                            title: "Novamente",
                            action: () => this.playGame(),
                        },
                        "back": {
                            title: "Voltar",
                            action: () => menuLib.setCurrentMenu(['select-scenario']),
                        }
                    }
                },
                "select-scenario": {
                    title: "Selecione o cenário",
                    children: {
                        "size-x": {
                            title: "Aleatório",
                            action: () => this.selectScenarioSize(-1),
                        },
                        "size-4": {
                            title: "Quadrado",
                            action: () => this.selectScenarioSize(4),
                        },
                        "size-6": {
                            title: "Hexágono",
                            action: () => this.selectScenarioSize(6),
                        },
                        "size-8": {
                            title: "Octágono",
                            action: () => this.selectScenarioSize(8),
                        },
                        "back": {
                            title: "Voltar",
                            action: () => this.backToMainMenu(),
                        }
                    }
                },
            }
        };
    },

    backToMainMenu: function() {
        menuLib.setCurrentMenu(['main']);
    },

    start: function() {
        menuLib.start();
        this.backToMainMenu();
    },

    selectPlayerCount: function(playerCount) {
        game.playerCount = playerCount;
        menuLib.setCurrentMenu(['select-scenario']);
    },

    selectScenarioSize: function(n) {
        if (n < 0) {
            let items = [4,6,8];
            n = items[Math.floor(Math.random()*items.length)];
        }
        game.scenarioSize = n;
        this.playGame();
    },

    playGame: function() {
        menuLib.hide();
        game.start();
    },

    show: function() {
        menuLib.show();
    },

    showMessage: function(message) {
        menuLib.selected = -1;
        menuLib.data.children.message.title = message;
        menuLib.setCurrentMenu(['message']);
        menuLib.show();
    },
};

export default gameMenu;
