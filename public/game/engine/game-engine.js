import * as CANNON from 'cannon';
import * as THREE from 'three';

import gameGfx from './game-gfx.js';
import gameInput from './game-input.js';
import gamePhysics from './game-physics.js';
import looper from '../../libs/looper.js';
import gameMenu from '../game-menu.js';

const gameEngine = {

	upVector: new CANNON.Vec3(0, 0, 1),
	geometryRotation: new CANNON.Quaternion().setFromVectors(new CANNON.Vec3(0, 1, 0), new CANNON.Vec3(0, 0, 1)),
	inverseGeometryRotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/2),

	container: document.getElementsByClassName('game-container')[0],
	guiElement: document.getElementById('GAME_GUI'),
	score: {},

    playerCount: 1,
	players: [],
	gem: null,
	minPlayerCount: 1,
	running: false,

	configure: function() {
		gameInput.configure();
		looper.saveFpsHistory = true;

		gameGfx.configure(this.container);
	},

	addToGame: function(object) {
		if (object.addToGame) {
			object.addToGame();
			return;
		}
		if (object.body) gamePhysics.world.addBody(object.body);
		if (object.mesh) {
			gamePhysics.updateMesh(object);
			gameGfx.addObject(object);
		}
		if (object.afterAddToGame) {
			object.afterAddToGame();
		}
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
		this.running = true;
	},
	
	update: function(delta) {
		gameInput.listen();

		this.players.forEach(player => player.update());
		this.gem.update();
		if (this.gem.timeIsOver()) {
			this.gameOver(this.gem.player);
			return;
		}

		this.players.forEach(player => {
			if (player.fallen) {
				this.removePlayer(player);
			}
		});
		if (this.players.length < this.minPlayerCount) {
			this.gameOver(this.players.length == 1 ? this.players[0] : null);
			return;
		}

		gamePhysics.update();

		gameGfx.render();
		
		this.updateGui();
	},

	gameOver: function(winner) {
		if (winner) {
			this.showMessage("Winner: " + winner.name);

			if (!this.score[winner.name]) this.score[winner.name] = 0;

			this.score[winner.name]++;
		} else {
			this.showMessage("Draw");
		}
		this.stop();
	},

	updateGui: function() {
		if (looper.ticks % 15 == 0) {
			let text = "";
			//text += "FPS: " + looper.getFpsAverage().toFixed(2) + "<br>";
			for (const [playerName, score] of Object.entries(this.score)) {
				text += playerName + ": " + score + " points<br>";
			}
			if (this.gem.time > 0) {
				text += "Time: " + (this.gem.maxTime - this.gem.time).toFixed(0) + "<br>";
			}
			this.guiElement.innerHTML = text;
		}
	},

	removePlayer: function(player) {
		console.log("Player " + player.index + " fell.");
		if (this.gem.player == player) {
			this.gem.reset();
		}
		this.removeFromGame(player);
		this.players = this.players.filter(p => p != player);
	},

	showMessage: function(message) {
		gameMenu.showMessage(message);
	},

	stop: function() {
		this.running = false;
		//gameMenu.show();
	},
};

export default gameEngine;