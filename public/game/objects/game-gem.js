import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../engine/game-physics.js';
import GamePlayer from './game-player.js';

const initialPosition = new CANNON.Vec3(0, 0, 3.0);
const meshRadius = 0.3;
const bodyRadius = 0.5;
const rotationSpeed = 0.05;
const rotation = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rotationSpeed);

export default class GameGem {
  maxTime = 10;
  body = null;
  mesh = null;
  player = null;
  time = 0;
  color = new THREE.Color(0, 0.5, 0.5);

  constructor() {
    this.#createBody();
    this.#createMesh();
  }

  #createMesh() {
    this.mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(meshRadius),
        new THREE.MeshLambertMaterial({ color: this.color })
    );
    this.mesh.castShadow = true;
    this.mesh.userData = this;
  }

  #createBody() {
    this.body = new CANNON.Body({
      shape: new CANNON.Sphere(bodyRadius),
      mass: 1,
      linearDamping: 1.0,
      angularDamping: 1.0,
    });
    this.body.position.copy(initialPosition);
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
      this.body.position.copy(initialPosition);
    }
    const colorIntensity = this.time/this.maxTime;
    this.mesh.material.color.r = colorIntensity;
    this.mesh.material.color.g = (1 - colorIntensity)/2;
    this.mesh.material.color.b = (1 - colorIntensity)/2;
    gamePhysics.updateMesh(this);
  }

  timeIsOver() {
    return this.time >= this.maxTime;
  }

  reset() {
    this.player = null;
    this.time = 0;
  }
}
