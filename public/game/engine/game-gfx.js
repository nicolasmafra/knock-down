import * as THREE from 'three';

const outlineMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000,
	side: THREE.BackSide,
});

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
    },

	resize: function() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	},
	
	addObject: function(object) {
		this.scene.add(object.mesh);
		this.addOutline(object.mesh);
	},

	addOutline: function(mesh) {
		const outline = new THREE.Mesh(mesh.geometry, outlineMaterial);
		outline.scale.multiplyScalar(1.05);
		mesh.add(outline);
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

	resetCamera: function() {
		this.camera.position.set(0, -8, 9);
		this.camera.lookAt(new THREE.Vector3());
	},

    render: function() {
		this.renderer.render(this.scene, this.camera);
    },

};

export default gameGfx;
