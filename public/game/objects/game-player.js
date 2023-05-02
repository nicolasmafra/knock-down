import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../game-physics.js';

const width = 0.8;
const height = 1.7;
const moveMagnitude = 40.0;
const jumpMagnitude = 400.0;

const rotationDirection = new CANNON.Vec3(1,0,0);
const rotationAngle = Math.PI/2;
const rotation = new CANNON.Quaternion().setFromAxisAngle(rotationDirection, rotationAngle);

const jumpImpulse = new CANNON.Vec3(0, 0, jumpMagnitude);

const geometry = new THREE.CylinderGeometry(width/2, width/2, height);

export default class GamePlayer {

  bodyBelow = null;

  constructor(input, color, x, y) {
    this.input = input;
    this.#createBody(x, y);
    this.#createMesh(color);

    this.body.addEventListener('collide', (event) => {
      if (gamePhysics.bodyIsOver(event.contact, this.body)) {
        this.bodyBelow = gamePhysics.inContact(event.contact, this.body);
      }
    });
  }

  #createBody(x, y) {
    this.body = new CANNON.Body({
      shape: new CANNON.Cylinder(width/2, width/2, height),
      material: gamePhysics.material,
      fixedRotation: true,
      linearDamping: 0.3,
      mass: 70,
    });
    this.body.quaternion.copy(rotation);
    this.body.position.set(x, y, height);
    this.body.userData = this;
  }

  #createMesh(color) {
    this.mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color })
    );
    this.mesh.userData = this;
  }

  update() {
    this.#fixBodyBelow();
    if (this.bodyBelow) {
      this.#move();
      if (this.input.jump) {
        this.#jump();
      }
    }
  }

  #move() {
    this.body.pointToLocalFrame
    const x = this.input.move[0] * moveMagnitude;
    const y = this.input.move[1] * moveMagnitude;
    const impulse = new CANNON.Vec3(x, y, 0);
    this.body.applyImpulse(impulse);
  }

  #jump() {
    this.bodyBelow = null;
    this.body.applyImpulse(jumpImpulse);
  }

  #fixBodyBelow() {
    if (!this.bodyBelow) {
      return;
    }
    const needBodyBelow = this.input.jump || this.input.move[0] !== 0 || this.input.move[1] !== 0;
    if (!needBodyBelow) {
      return;
    }
    const contact = gamePhysics.findContact(this.body, this.bodyBelow);
    if (!contact || !gamePhysics.bodyIsOver(contact, this.body)) {
      this.bodyBelow = null;
    }
  }

}
