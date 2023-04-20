import { gamepadKeyboard } from '../libs/gamepad-keyboard.js';
import { gamepadProxy } from '../libs/gamepad-proxy.js';
import looper from '../libs/looper.js';
import * as THREE from 'three';

const game = {

	container: document.getElementsByClassName('game-container')[0],
	fpsElement: document.getElementById('FPS'),

	renderer: new THREE.WebGLRenderer(),
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(),

	box: null,
	boxMove: [0,0],
	boxSpeed: 0.1,

	configure: function() {
		gamepadKeyboard.configure();
		gamepadProxy.additionalGamepads.push(gamepadKeyboard.getGamepad());
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.render(delta);

		this.resize();
		window.onresize = () => this.resize();

		this.container.appendChild(this.renderer.domElement);
	},

	resize: function() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	},

	start: function() {
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
		this.box = new THREE.Mesh(geometry, material);
		this.scene.add(this.box);

		this.scene.background = new THREE.Color("green");
		this.camera.position.z = 5;
		
		looper.start();
	},
	
	render: function(delta) {
		this.updateGui();
		this.moveBox();
		this.renderer.render(this.scene, this.camera);
	},

	updateGui: function() {
		if (looper.ticks % 15 == 0) {
			this.fpsElement.innerHTML = looper.getFpsAverage().toFixed(2);
		}
	},

	moveBox: function() {
		this.boxMove[0] = 0;
		this.boxMove[1] = 0;
		
		const gamepad = gamepadProxy.getGamepads()[0];
		if (gamepad) {
			this.boxMove[0] += gamepad.buttons[15].value - gamepad.buttons[14].value + gamepad.axes[0];
			this.boxMove[1] -= gamepad.buttons[13].value - gamepad.buttons[12].value + gamepad.axes[1];
			
			gamepadProxy.normalizeAxisPair(this.boxMove);
			
			this.box.position.x += this.boxSpeed * this.boxMove[0];
			this.box.position.y += this.boxSpeed * this.boxMove[1];
		}
	},
};

export default game;