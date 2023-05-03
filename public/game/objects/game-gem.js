import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../engine/game-physics.js';
import GamePlayer from './game-player.js';

const initialPositionZ = 3.0;
const radius = 0.3;
const rotationSpeed = 0.05;
const rotation = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rotationSpeed);

export default class GameGem {
  maxTime = 10;
  body = null;
  mesh = null;
  player = null;
  time = 0;

  constructor() {
    this.#createBody();
    this.#createMesh();
  }

  #createMesh() {
    this.mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(radius),
        new THREE.MeshLambertMaterial({ color: 0xffffdd })
    );
    this.mesh.castShadow = true;
    this.mesh.userData = this;
  }

  #createBody() {
    this.body = new CANNON.Body({
      shape: new CANNON.Sphere(radius),
      mass: 1,
      linearDamping: 1.0,
    });
    this.body.position.set(0, 0, initialPositionZ);
    this.body.userData = this;
  }

  afterAddToGame() {
    this.body.addEventListener('collide', (event) => {
      let object = gamePhysics.inContact(event.contact, this.body);
      if (object.userData instanceof GamePlayer) {
        this.player = object.userData;
        this.time = 0;
      }
    });
  }

  update() {
    this.body.quaternion.mult(rotation, this.body.quaternion);
    if (this.player != null) {
      this.body.position.copy(this.player.mesh.position);
      this.body.position.z += 1.8;
      this.time += gamePhysics.timeUnit;
    } else {
      this.body.position.z = initialPositionZ;
    }
    gamePhysics.updateMesh(this);
  }

  timeIsOver() {
    return this.time >= this.maxTime;
  }
}
