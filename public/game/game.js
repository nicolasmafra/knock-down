import looper from '../../libs/looper.js';
import gameEngine from './engine/game-engine.js';
import gamepadMenu from '../libs/gamepad-menu.js';

import GameScenario from './objects/game-scenario.js';
import GamePlayer from './objects/game-player.js';
import GameGem from './objects/game-gem.js';

const game = {

	playerCount: 2,
	players: [],
	scenario: null,
	gem: null,

	configure: function() {
		gameEngine.configure();
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.update(delta);
        looper.exceptionFunction = (e) => this.showMessage("Error: " + e.message);
		looper.start();
	},

	start: function() {
		gameEngine.playerCount = this.playerCount;
		gameEngine.preStart();
		
		this.scenario = new GameScenario();
		gameEngine.addToGame(this.scenario);

		this.players = [];
		this.createPlayer(0, 0x0000ff, -3, -3);
		if (this.playerCount >= 2) this.createPlayer(1, 0xff00ff, 3, 3);
		if (this.playerCount >= 3) this.createPlayer(2, 0xff0000, -3, 3);
		if (this.playerCount >= 4) this.createPlayer(2, 0xffff00, 3, -3);

		this.gem = new GameGem();
		gameEngine.addToGame(this.gem);
		
		gameEngine.gem = this.gem;
		gameEngine.players = this.players;
		gameEngine.start();
	},

	update: function(delta) {
		gamepadMenu.checkMenuInput();
		if (gameEngine.running) {
			gameEngine.update(delta);
		}
	},

	createPlayer: function(index, color, x, y) {
		const player = new GamePlayer(index, color, x, y);
		gameEngine.addToGame(player);
		this.players.push(player);
	},
};

export default game;