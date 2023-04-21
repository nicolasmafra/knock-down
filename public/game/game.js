import gameGfx from './game-gfx.js';
import gameInput from './game-input.js';
import gamePhysics from './game-physics.js';
import looper from '../libs/looper.js';
import * as THREE from 'three';

const game = {

	container: document.getElementsByClassName('game-container')[0],
	fpsElement: document.getElementById('FPS'),

	playerCount: 2,
	boxes: [],
	tempMove: [0,0],
	boxAcceleration: 10.0,
	boxJumpSpeed: 4.5,

	configure: function() {
		gameInput.configure();
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.render(delta);

		gameGfx.configure(this.container);

        gameGfx.addAmbientLight();

        gameGfx.addDirectionalLight();

		gameGfx.camera.position.set(0, -8, 9);
		gameGfx.camera.lookAt(new THREE.Vector3());
        
		gameGfx.render();
	},

	start: function() {
		gameInput.start(this.playerCount);

		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(10, 10),
			new THREE.MeshLambertMaterial({ color: 0x00ff00 })
		);
		gameGfx.scene.add(plane);

		this.createBox(0x0000ff, 0, 0);
		if (this.playerCount >= 2) this.createBox(0xff00ff, 3, 1);
		if (this.playerCount >= 3) this.createBox(0xff0000, -3, -1);
		
		looper.start();
	},

	createBox: function(color, x, y) {
		if (!this.boxGeometry) {
			this.boxGeometry = new THREE.BoxGeometry( 0.8, 0.8, 1.7 );
		}
		const box = new THREE.Mesh(
			this.boxGeometry,
			new THREE.MeshLambertMaterial({ color })
		);
		box.position.set(x, y, 0.5);
		box.userData = {
			velocity: new THREE.Vector3()
		};
		gameGfx.scene.add(box);

		this.boxes.push(box);
	},
	
	render: function(delta) {
		this.updateGui();

		gameInput.listen();
		this.boxes.forEach((box, i) => this.moveBox(box, gameInput.playersInput[i]));

		gameGfx.render();
	},

	updateGui: function() {
		if (looper.ticks % 15 == 0) {
			this.fpsElement.innerHTML = looper.getFpsAverage().toFixed(2);
		}
	},

	moveBox: function(box, input) {

		gamePhysics.applyInertia(box);

		gamePhysics.applyGround(box, () => {
			box.userData.velocity.x += input.move[0] * this.boxAcceleration * gamePhysics.timeUnit;
			box.userData.velocity.y += input.move[1] * this.boxAcceleration * gamePhysics.timeUnit;
			box.userData.velocity.z = input.jump ? this.boxJumpSpeed : 0;
		});

		gamePhysics.clampHorizontal(box, -5, 5);
	},
};

export default game;