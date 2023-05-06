import menuLib from '../libs/menu-lib.js';
import game from './game.js';

import CircleScenario from './objects/scenarios/CircleScenario.js';
import IslandScenario from './objects/scenarios/IslandScenario.js';

const gameMenu = {
    configure: function() {
        menuLib.stackMin = 1;
        menuLib.data = {
            title: "root",
            children: {
                "welcome": {
                    title: "Bem vindo ao Knock Down",
                    children: {
                        "start": {
                            title: "Iniciar",
                            action: () => this.prestart(),
                        }
                    }
                },
                "main": {
                    title: "Quantas pessoas irão jogar?",
                    children: {
                        "2-players": {
                            title: "2 Jogadores",
                            action: () => this.selectPlayerCount(2),
                        },
                        "3-players": {
                            title: "3 Jogadores",
                            action: () => this.selectPlayerCount(3),
                        },
                        "4-players": {
                            title: "4 Jogadores",
                            action: () => this.selectPlayerCount(4),
                        },
                    }
                },
                "gameOver": {
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
                "error": {
                    title: "XXX"
                },
                "pause": {
                    title: "Pausa",
                    children: {
                        "continue": {
                            title: "Continuar",
                            action: () => this.resumeGame(),
                        },
                        "giveup": {
                            title: "Abandonar",
                            action: () => menuLib.setCurrentMenu(['select-scenario']),
                        }
                    }
                },
                "select-scenario": {
                    title: "Selecione o cenário",
                    children: {
                        "circle4grass": {
                            title: "Quadrado",
                            action: () => this.selectCircleScenario(4, false),
                        },
                        "circle8ice": {
                            title: "Pista de gelo",
                            action: () => this.selectCircleScenario(8, true),
                        },
                        "island4": {
                            title: "Ilhas",
                            action: () => this.selectIslandScenario(),
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

    prestart: function() {
        game.prestart();
        this.backToMainMenu();
    },

    backToMainMenu: function() {
        menuLib.setCurrentMenu(['main']);
    },

    start: function() {
        menuLib.start();
        menuLib.setCurrentMenu(['welcome']);
    },

    selectPlayerCount: function(playerCount) {
        game.playerCount = playerCount;
        menuLib.setCurrentMenu(['select-scenario']);
    },

    selectCircleScenario: function(n, ice) {
		game.scenario = new CircleScenario(n, ice);
        this.playGame();
    },

    selectIslandScenario: function(n) {
		game.scenario = new IslandScenario();
        this.playGame();
    },

    playGame: function() {
        menuLib.hide();
        game.start();
    },

    resumeGame: function() {
        menuLib.hide();
        game.resume();
    },

    show: function() {
        menuLib.show();
    },

    showMessage: function(message) {
        menuLib.selected = -1;
        menuLib.data.children.gameOver.title = message;
        menuLib.setCurrentMenu(['gameOver']);
        menuLib.show();
    },

    showError: function(message) {
        menuLib.data.children.error.title = message;
        menuLib.setCurrentMenu(['error']);
        menuLib.show();
    },

    pause: function() {
        menuLib.selected = -1;
        menuLib.setCurrentMenu(['pause']);
        menuLib.show();
    },
};

export default gameMenu;
