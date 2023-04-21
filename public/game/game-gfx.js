import * as THREE from 'three';

const gameGfx = {

	renderer: new THREE.WebGLRenderer({
		antialias: true,
	}),
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(),

    configure: function(container) {
		container.appendChild(this.renderer.domElement);

		this.resize();
		window.onresize = () => this.resize();

		this.scene.background = new THREE.Color("cyan");
    },

	resize: function() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	},

    addAmbientLight: function() {
		const ambientlLight = new THREE.AmbientLight(0xffffff, 0.3);
		this.scene.add(ambientlLight);
    },

    addDirectionalLight: function() {
		const directionalLight = new THREE.DirectionalLight(0xffffdd, 0.6);
		directionalLight.position.set(0, 0.5, 1);
		this.scene.add(directionalLight);
    },

    render: function() {
		this.renderer.render(this.scene, this.camera);
    },

};

export default gameGfx;
