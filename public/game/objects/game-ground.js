import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../engine/game-physics.js';

export default class GameGround {
  body = null;
  mesh = null;

  constructor(size, position, angle) {
    this.#createBody(size, position);
    this.#createMesh(size);
    if (angle) {
      this.body.quaternion.setFromAxisAngle(gamePhysics.upVector, angle);
      this.body.quaternion.vmult(this.body.position, this.body.position);
    }
  }

  #createBody(size, position) {
    if (!position) position = new CANNON.Vec3();
    
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
