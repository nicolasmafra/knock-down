import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../engine/game-physics.js';
import gameAudio from '../engine/game-audio.js';
import GamePlayer from './game-player.js';

const meshRadius = 0.3;
const bodyRadius = 0.5;
const rotationSpeed = 0.05;
const rotation = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rotationSpeed);

export default class GameGem {
  initialPosition = new CANNON.Vec3(0, 0, 5.0);
  ignoreContact = true;
  maxTime = 15;
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
      mass: 0.001,
      linearDamping: 1.0,
      angularDamping: 1.0,
    });
    this.body.position.copy(this.initialPosition);
    this.body.userData = this;
  }

  afterAddToGame() {
    this.body.addEventListener('collide', (event) => {
      let object = gamePhysics.inContact(event.contact, this.body);
      if (object.userData instanceof GamePlayer) {
        this.playerPickup(object.userData);
      }
    });
  }

  playerPickup(player) {
    this.player = player;
    this.time = 0;
    gameAudio.playEffect('gem');
    gameAudio.playEffect('clock');
  }

  update() {
    this.body.quaternion.mult(rotation, this.body.quaternion);
    if (this.player != null) {
      this.body.position.copy(this.player.mesh.position);
      this.body.position.z += 1.8;
      this.time += gamePhysics.timeUnit;
    } else {
      this.body.position.copy(this.initialPosition);
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
