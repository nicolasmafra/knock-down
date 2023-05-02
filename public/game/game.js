import gameGfx from './game-gfx.js';
import gameInput from './game-input.js';
import gamePhysics from './game-physics.js';
import looper from '../libs/looper.js';

import GamePlayer from './objects/game-player.js';
import GameGround from './objects/game-ground.js';
import * as THREE from 'three';

const game = {

	container: document.getElementsByClassName('game-container')[0],
	fpsElement: document.getElementById('FPS'),

	playerCount: 2,
	players: [],
	tempMove: [0,0],

	configure: function() {
		gameInput.configure();
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.render(delta);

		gameGfx.configure(this.container);

        gameGfx.addAmbientLight();

        gameGfx.addDirectionalLight();

		gameGfx.resetCamera();
        
		gameGfx.render();

		gamePhysics.configure();
	},

	addToGame: function(object) {
	  gamePhysics.world.addBody(object.body);
	  gameGfx.scene.add(object.mesh);
	},

	start: function() {
		gameInput.start(this.playerCount);

		this.addStaticBlocks();

		this.createPlayer(0, 0x0000ff, 0, 0);
		if (this.playerCount >= 2) this.createPlayer(1, 0xff00ff, 3, 1);
		if (this.playerCount >= 3) this.createPlayer(2, 0xff0000, -3, -1);
		
		looper.start();
	},

	addStaticBlocks: function() {
		this.addToGame(new GameGround(new THREE.Vector3(10, 10, 0.2), new THREE.Vector3(0, 0, 0.1)));
		const wallHeight = 2.0;
		this.addToGame(new GameGround(new THREE.Vector3(1, 10, wallHeight), new THREE.Vector3(-5.5, 0, wallHeight/2)));
		this.addToGame(new GameGround(new THREE.Vector3(1, 10, wallHeight), new THREE.Vector3(5.5, 0, wallHeight/2)));
		this.addToGame(new GameGround(new THREE.Vector3(10, 1, wallHeight), new THREE.Vector3(0, 5.5, wallHeight/2)));
		this.addToGame(new GameGround(new THREE.Vector3(10, 1, wallHeight), new THREE.Vector3(0, -5.5, wallHeight/2)));
	},

	createPlayer: function(index, color, x, y) {
		const player = new GamePlayer(gameInput.playersInput[index], color, x, y);
		this.addToGame(player);
		this.players.push(player);
	},
	
	render: function(delta) {
		gameInput.listen();

		this.players.forEach(player => player.update());

		gamePhysics.update();

		gameGfx.render();
		
		this.updateGui();
	},

	updateGui: function() {
		if (looper.ticks % 15 == 0) {
			this.fpsElement.innerHTML = looper.getFpsAverage().toFixed(2);
		}
	},
};

export default game;