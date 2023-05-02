import gameGfx from './game-gfx.js';
import gameInput from './game-input.js';
import gamePhysics from './game-physics.js';
import looper from '../../libs/looper.js';

const gameEngine = {

	container: document.getElementsByClassName('game-container')[0],
	fpsElement: document.getElementById('FPS'),

    playerCount: 1,
	players: [],

	configure: function() {
		gameInput.configure();
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.update(delta);
        looper.exceptionFunction = (e) => alert("Error: " + e.message);

		gameGfx.configure(this.container);

        gameGfx.addAmbientLight();

        gameGfx.addDirectionalLight();

		gameGfx.resetCamera();
        
		gameGfx.render();

		gamePhysics.configure();
	},

	addToGame: function(object) {
		if (object.addToGame) {
			object.addToGame();
			return;
		}
		if (object.body) gamePhysics.world.addBody(object.body);
		if (object.mesh) gameGfx.addObject(object);
	},

	preStart: function() {
		gameInput.start(this.playerCount);
	},

	start: function() {
		looper.start();
	},
	
	update: function(delta) {
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

export default gameEngine;