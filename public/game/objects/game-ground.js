import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../engine/game-physics.js';

export default class GameGround {
  body = null;
  mesh = null;
  hasOutline = true;

  constructor(shape, geometry, position, rotation) {
    this.#createBody(shape, position);
    this.#createMesh(geometry);
    if (rotation) {
      this.body.quaternion.copy(rotation);
      //this.body.quaternion.vmult(this.body.position, this.body.position);
    }
  }

  #createBody(shape, position) {
    if (!position) position = new CANNON.Vec3();
    
    this.body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      material: gamePhysics.material,
    });
    //const shape = new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/2, size.z/2));
    this.body.addShape(shape);
    this.body.position.set(position.x, position.y, position.z);
    this.body.userData = this;
  }

  #createMesh(geometry) {
    this.mesh = new THREE.Mesh(
      geometry,//new THREE.BoxGeometry(size.x, size.y, size.z),
        new THREE.MeshLambertMaterial({ color: 0x00ff00 })
    );
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.userData = this;
  }
}
