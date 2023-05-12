import looper from '../libs/looper.js';
import gameEngine from './engine/game-engine.js';
import gamepadMenu from '../libs/gamepad-menu.js';
import gameAudio from './engine/game-audio.js';
import gameMenu from './game-menu.js';

import GamePlayer from './objects/game-player.js';
import GameGem from './objects/game-gem.js';

const game = {

	playerCount: 2,
	players: [],
	scenario: null,
	gem: null,
	running: false,

	configure: function() {
		gameEngine.configure();
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.update(delta);
        looper.exceptionFunction = (e) => gameMenu.showError("Error: " + e.message);
		looper.start();
	},

	prestart: function() {
		gameAudio.configure();
	},

	start: function() {
		gameAudio.stopEffects();
		gameAudio.playMusic();
		this.running = true;
		gameEngine.playerCount = this.playerCount;
		gameEngine.preStart();
		
		gameEngine.addToGame(this.scenario);

		this.players = [];
		this.createPlayer(0, 0x0000ff, -3, -3);
		if (this.playerCount >= 2) this.createPlayer(1, 0xff00ff, 3, 3);
		if (this.playerCount >= 3) this.createPlayer(2, 0xff0000, -3, 3);
		if (this.playerCount >= 4) this.createPlayer(2, 0xffff00, 3, -3);

		this.gem = new GameGem(this.scenario.gemInitialPosition);
		gameEngine.addToGame(this.gem);
		
		gameEngine.gem = this.gem;
		gameEngine.players = this.players;
		gameEngine.start();
	},

	resume: function() {
		this.running = true;
		gameEngine.resume();
	},

	update: function(delta) {
		gamepadMenu.checkMenuInput();
		if (gameEngine.running) {
			gameEngine.update(delta);
		}
		if (!gameEngine.running && this.running) {
			this.onPause();
		}
		this.running = gameEngine.running;
	},

	onPause: function() {
		gameAudio.pauseMusic();
	},

	createPlayer: function(index, color, x, y) {
		const player = new GamePlayer(index, color, x, y);
		gameEngine.addToGame(player);
		this.players.push(player);
	},
};

export default game;