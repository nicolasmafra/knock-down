import * as THREE from 'three';
import * as CANNON from 'cannon';

import gamePhysics from '../engine/game-physics.js';
import gameInput from '../engine/game-input.js';

const width = 0.8;
const height = 1.7;
const moveMagnitude = 20.0;
const jumpMagnitude = 450.0;
const minZ = -3*height;
const maxSpeed = 10.0;
const canMoveOnAir = false;

const rotationDirection = new CANNON.Vec3(1,0,0);
const rotationAngle = Math.PI/2;
const rotation = new CANNON.Quaternion().setFromAxisAngle(rotationDirection, rotationAngle);

const jumpImpulse = new CANNON.Vec3(0, 0, jumpMagnitude);

const geometry = new THREE.CylinderGeometry(width/2, width/2, height);

export default class GamePlayer {

  bodiesBelow = [];
  fallen = false;

  constructor(index, color, x, y) {
    this.index = index;
    this.name = "Player" + (index + 1);
    this.input = gameInput.playersInput[index];
    this.#createBody(x, y);
    this.#createMesh(color);

    this.body.addEventListener('collide', (event) => {
      if (gamePhysics.bodyIsOver(event.contact, this.body)) {
        this.bodiesBelow.push(gamePhysics.inContact(event.contact, this.body));
      }
    });
  }

  #createBody(x, y) {
    this.body = new CANNON.Body({
      shape: new CANNON.Cylinder(width/2, width/2, height),
      material: gamePhysics.material,
      fixedRotation: true,
      linearDamping: 0.05,
      mass: 70,
    });
    this.body.quaternion.copy(rotation);
    this.body.position.set(x, y, height);
    this.body.userData = this;
  }

  #createMesh(color) {
    this.mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color })
    );
    this.mesh.castShadow = true;
    this.mesh.userData = this;
  }

  update() {
    if (this.checkFallen()) {
      return;
    }
    if (this.input) {
      this.#applyInput();
    }
  }

  #applyInput() {
    this.#fixBodyBelow();
    if (this.bodiesBelow.length > 0 || canMoveOnAir) {
      this.#move();
    }
    if (this.bodiesBelow.length > 0 && this.input.jump) {
      this.#jump();
      this.bodiesBelow = [];
    }
    gamePhysics.clampHorizontalVelocity(this.body, maxSpeed);
  }

  #move() {
    this.body.pointToLocalFrame
    const x = this.input.move[0] * moveMagnitude;
    const y = this.input.move[1] * moveMagnitude;
    const impulse = new CANNON.Vec3(x, y, 0);
    this.body.applyImpulse(impulse);
  }

  #jump() {
    this.body.applyImpulse(jumpImpulse);
  }

  checkFallen() {
    if (this.fallen) {
      return true;
    }
    if (this.body.position.z < minZ) {
      this.fallen = true;
    }
    return this.fallen;
  }

  #fixBodyBelow() {
    if (this.bodiesBelow.length == 0) {
      return;
    }
    let needBodyBelow = this.input.jump;
    if (!canMoveOnAir) needBodyBelow |= this.input.move[0] !== 0 || this.input.move[1] !== 0;

    if (!needBodyBelow) {
      return;
    }

    this.bodiesBelow = this.bodiesBelow.filter(bodyBelow => {
      const contact = gamePhysics.findContact(this.body, bodyBelow);
      return contact && gamePhysics.bodyIsOver(contact, this.body);
    });
  }

}
