import gameGfx from './game-gfx.js';
import gameInput from './game-input.js';
import gamePhysics from './game-physics.js';
import looper from '../../libs/looper.js';
import gameMenu from '../game-menu.js';

const gameEngine = {

	container: document.getElementsByClassName('game-container')[0],
	fpsElement: document.getElementById('FPS'),

    playerCount: 1,
	players: [],
	minPlayerCount: 1,

	configure: function() {
		gameInput.configure();
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.update(delta);
        looper.exceptionFunction = (e) => alert("Error: " + e.message);

		gameGfx.configure(this.container);
	},

	addToGame: function(object) {
		if (object.addToGame) {
			object.addToGame();
			return;
		}
		if (object.body) gamePhysics.world.addBody(object.body);
		if (object.mesh) gameGfx.addObject(object);
	},

	removeFromGame: function(object) {
		if (object.body) gamePhysics.world.removeBody(object.body);
		if (object.mesh) gameGfx.removeObject(object);
	},

	preStart: function() {
		gameGfx.start();
		gamePhysics.start();
		gameInput.start(this.playerCount);

        gameGfx.addAmbientLight();

        gameGfx.addDirectionalLight();

		gameGfx.resetCamera();
        
		gameGfx.render();
	},

	start: function() {
		this.minPlayerCount = this.playerCount == 1 ? 1 : 2;
		looper.start();
	},
	
	update: function(delta) {
		gameInput.listen();

		this.players.forEach(player => player.update());

		this.players.forEach(player => {
			if (player.fallen) {
				this.removePlayer(player);
			}
		});
		if (this.players.length < this.minPlayerCount) {
			this.stop();
			return;
		}

		gamePhysics.update();

		gameGfx.render();
		
		this.updateGui();
	},

	updateGui: function() {
		if (looper.ticks % 15 == 0) {
			this.fpsElement.innerHTML = looper.getFpsAverage().toFixed(2);
		}
	},

	removePlayer: function(player) {
		console.log("Player " + player.index + " falled.");
		this.removeFromGame(player);
		this.players = this.players.filter(p => p != player);
	},

	stop: function() {
		looper.stop();
		gameMenu.show();
	},
};

export default gameEngine;