import * as THREE from 'three';
import * as CANNON from 'cannon';

import gameEngine from '../engine/game-engine.js';
import gamePhysics from '../engine/game-physics.js';
import gameInput from '../engine/game-input.js';

const width = 0.8;
const height = 1.7;
const headRadius = width/2;
const headHeight = 0.6;
const bodyHeight = 1.5;
const moveMagnitude = 20.0;
const jumpMagnitude = 500.0;
const minZ = -3*height;
const maxSpeed = 10.0;
const canMoveOnAir = false;

const jumpImpulse = new CANNON.Vec3(0, 0, jumpMagnitude);

const headGeometry = new THREE.CylinderGeometry(headRadius, headRadius, headHeight);
const bodyGeometry = new THREE.ConeGeometry(width/2, bodyHeight);

export default class GamePlayer {

  relativeRotation = gameEngine.inverseGeometryRotation;
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
    this.body.quaternion.copy(gameEngine.geometryRotation);
    this.body.position.set(x, y, height);
    this.body.userData = this;
  }

  #createMesh(color) {
    const material = new THREE.MeshStandardMaterial({ color });

    const head = new THREE.Mesh(headGeometry, material);
    head.castShadow = true;
    head.position.z = height/2 - headRadius;
    head.quaternion.copy(gameEngine.geometryRotation);

    const body = new THREE.Mesh(bodyGeometry, material);
    body.castShadow = true;
    body.position.z = -height/2 + bodyHeight/2;
    body.quaternion.copy(gameEngine.geometryRotation);

    this.mesh = new THREE.Mesh();
    this.mesh.add(head);
    this.mesh.add(body);
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
