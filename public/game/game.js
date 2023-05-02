import gameEngine from './engine/game-engine.js';

import GameScenario from './objects/game-scenario.js';
import GamePlayer from './objects/game-player.js';

const game = {

	playerCount: 2,
	players: [],
	scenario: null,

	configure: function() {
		gameEngine.configure();
	},

	start: function() {
		gameEngine.preStart();
		
		this.scenario = new GameScenario();
		this.scenario.addToGame();

		this.createPlayer(0, 0x0000ff, 0, 0);
		if (this.playerCount >= 2) this.createPlayer(1, 0xff00ff, 3, 1);
		if (this.playerCount >= 3) this.createPlayer(2, 0xff0000, -3, -1);
		
		gameEngine.playerCount = this.playerCount;
		gameEngine.players = this.players;
		gameEngine.start();
	},

	createPlayer: function(index, color, x, y) {
		const player = new GamePlayer(index, color, x, y);
		gameEngine.addToGame(player);
		this.players.push(player);
	},
};

export default game;