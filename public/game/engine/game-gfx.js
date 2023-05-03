import * as THREE from 'three';

const horizontalDistance = 9;
const verticalDistance = 13;
const angle = 0.18 * Math.PI;

const outlineMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000,
	side: THREE.BackSide,
});

const gameGfx = {

	xVector: new THREE.Vector3(1, 0, 0),
	renderer: new THREE.WebGLRenderer({
		antialias: true,
	}),
	scene: null,
	camera: null,

    configure: function(container) {
		this.renderer.shadowMap.enabled = true;
		container.appendChild(this.renderer.domElement);

		window.onresize = () => this.resize();
    },

	start: function() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera();
		this.resize();
	},

	resize: function() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		if (this.camera) {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		}
	},
	
	addObject: function(object) {
		this.scene.add(object.mesh);
		this.addOutline(object.mesh);
	},

	removeObject: function(object) {
		this.scene.remove(object.mesh);
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
		directionalLight.position.set(100, 50, 300);
		directionalLight.castShadow = true;
		this.scene.add(directionalLight);
    },

	resetCamera: function() {
		this.camera.position.set(0, -horizontalDistance, verticalDistance);
		this.camera.quaternion.setFromAxisAngle(this.xVector, angle);
	},

    render: function() {
		this.renderer.render(this.scene, this.camera);
    },

};

export default gameGfx;
