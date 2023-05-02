import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../game-physics.js';

export default class GameGround {
  body = null;
  mesh = null;

  constructor(size, position) {
    this.#createBody(size, position);
    this.#createMesh(size);
    gamePhysics.updateMesh(this);
  }

  #createBody(size, position) {
    this.body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      material: gamePhysics.material,
    });
    const shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
    this.body.addShape(shape);
    this.body.position.set(position.x, position.y, position.z);
    this.body.userData = this;
  }

  #createMesh(size) {
    this.mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, size.z),
        new THREE.MeshLambertMaterial({ color: 0x00ff00 })
    );
    this.mesh.userData = this;
  }
}
