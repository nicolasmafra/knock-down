import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class GameGround {
  body = null;
  mesh = null;
  hasOutline = true;
  static color = 0x00ff00;
  static material = new CANNON.Material({
		friction: 0.03,
		restitution: 0.4,
	});

  constructor(shape, geometry, position, rotation) {
    this.#createBody(shape, position);
    this.#createMesh(geometry);
    if (rotation) {
      this.body.quaternion.copy(rotation);
    }
  }

  static setAsGrass() {
    GameGround.color = 0x00ee00;
    GameGround.material.friction = 0.05;
    GameGround.material.restitution = 0.4;
  }

  static setAsIce() {
    GameGround.color = 0xbaf2ef;
    GameGround.material.friction = 0.02;
    GameGround.material.restitution = 0;
  }

  static setAsElastic() {
    GameGround.color = 0xbb8833;
    GameGround.material.friction = 0.05;
    GameGround.material.restitution = 1.0;
  }

  #createBody(shape, position) {
    if (!position) position = new CANNON.Vec3();
    
    this.body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      material: GameGround.material,
    });
    this.body.addShape(shape);
    this.body.position.set(position.x, position.y, position.z);
    this.body.userData = this;
  }

  #createMesh(geometry) {
    this.mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: GameGround.color })
    );
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.userData = this;
  }
}
