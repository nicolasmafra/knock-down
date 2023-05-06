import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../engine/game-physics.js';

export default class GameGround {
  body = null;
  mesh = null;
  hasOutline = true;
  static color = 0x00ff00;

  constructor(shape, geometry, position, rotation) {
    this.#createBody(shape, position);
    this.#createMesh(geometry);
    if (rotation) {
      this.body.quaternion.copy(rotation);
    }
  }

  #createBody(shape, position) {
    if (!position) position = new CANNON.Vec3();
    
    this.body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      material: gamePhysics.material,
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
