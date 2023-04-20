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

	playerCount: 2,
	boxes: [],
	tempMove: [0,0],
	boxSpeed: 0.1,

	configure: function() {
		gamepadKeyboard.configure();
		gamepadProxy.additionalGamepads.push(gamepadKeyboard.getGamepad());
		looper.saveFpsHistory = true;
		looper.renderFunction = (delta) => this.render(delta);

		this.resize();
		window.onresize = () => this.resize();

		this.scene.background = new THREE.Color("cyan");

		const ambientlLight = new THREE.AmbientLight(0xffffff, 0.3);
		this.scene.add(ambientlLight);

		const directionalLight = new THREE.DirectionalLight(0xffffdd, 0.6);
		directionalLight.position.set(0, 0.5, 1);
		this.scene.add(directionalLight);

		this.camera.position.set(0, -4, 6);
		this.camera.lookAt(new THREE.Vector3());

		this.container.appendChild(this.renderer.domElement);
		this.renderer.render(this.scene, this.camera);
	},

	resize: function() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	},

	start: function() {
		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(7, 4),
			new THREE.MeshLambertMaterial({ color: 0x00ff00 })
		);
		this.scene.add(plane);

		this.createBox(0x0000ff, 0, 0);
		if (this.playerCount >= 2) this.createBox(0xff00ff, 3, 1);
		if (this.playerCount >= 3) this.createBox(0xff0000, -3, -1);
		
		looper.start();
	},

	createBox: function(color, x, y) {
		if (!this.boxGeometry) {
			this.boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, 1 );
		}
		const box = new THREE.Mesh(
			this.boxGeometry,
			new THREE.MeshLambertMaterial({ color })
		);
		box.position.set(x, y, 0.5);
		this.scene.add(box);

		this.boxes.push(box);
	},
	
	render: function(delta) {
		this.updateGui();

		this.boxes.forEach((box, i) => this.moveBox(box, i));

		this.renderer.render(this.scene, this.camera);
	},

	updateGui: function() {
		if (looper.ticks % 15 == 0) {
			this.fpsElement.innerHTML = looper.getFpsAverage().toFixed(2);
		}
	},

	moveBox: function(box, gamepadIndex) {
		this.tempMove[0] = 0;
		this.tempMove[1] = 0;
		
		const gamepad = gamepadProxy.getGamepads()[gamepadIndex];
		if (gamepad) {
			this.tempMove[0] += gamepad.buttons[15].value - gamepad.buttons[14].value + gamepad.axes[0];
			this.tempMove[1] -= gamepad.buttons[13].value - gamepad.buttons[12].value + gamepad.axes[1];
			
			gamepadProxy.normalizeAxisPair(this.tempMove);
			
			box.position.x += this.boxSpeed * this.tempMove[0];
			box.position.y += this.boxSpeed * this.tempMove[1];
		}
	},
};

export default game;