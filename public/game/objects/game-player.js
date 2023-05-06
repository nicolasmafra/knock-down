import * as THREE from 'three';
import * as CANNON from 'cannon';

import gameEngine from '../engine/game-engine.js';
import gamePhysics from '../engine/game-physics.js';
import gameInput from '../engine/game-input.js';
import gameAudio from '../engine/game-audio.js';

const width = 0.8;
const height = 1.7;
const headRadius = width/2;
const headHeight = 0.6;
const bodyHeight = 1.5;

const moveMagnitude = 20.0;
const moveInitialMagnitude = 50.0;
const jumpMagnitude = 500.0;
const maxSpeed = 10.0;
const minSpeed = 1.0;
const canMoveOnAir = false;

const minZ = -3*height;

const jumpImpulse = new CANNON.Vec3(0, 0, jumpMagnitude);

const headGeometry = new THREE.CylinderGeometry(headRadius, headRadius, headHeight);
const bodyGeometry = new THREE.ConeGeometry(width/2, bodyHeight);

export default class GamePlayer {

  relativeRotation = gameEngine.inverseGeometryRotation;
  bodiesBelow = [];
  fallen = false;
  /** @type CANNON.Body */
  body = null;
  material = new CANNON.Material({
		friction: 0.04,
		restitution: 0.1,
	});
  jumped = false;

  constructor(index, color, x, y) {
    this.index = index;
    this.name = "Jogador" + (index + 1);
    this.input = gameInput.playersInput[index];
    this.#createBody(x, y);
    this.#createMesh(color);

    this.body.addEventListener('collide', (event) => {
      let another = gamePhysics.inContact(event.contact, this.body);
      if (another.userData && another.userData.ignoreContact) return;
      
      if (gamePhysics.bodyIsOver(event.contact, this.body)) {
        this.bodiesBelow.push(another);
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
    this.checkFallingEffect();
    if (this.checkFallen()) {
      return;
    }
    if (this.input) {
      this.#applyInput();
    }
  }

  checkFallingEffect() {
    if (this.fallingEffect) return;
    if (this.body.velocity.z >= 0) return;

    if (this.body.position.z < height/2 - 0.1) {
      return this.#setFallingEffect();
    }
  }

  #setFallingEffect() {
    this.fallingEffect = gameAudio.playEffect('falling');
  }

  #applyInput() {
    this.#fixBodyBelow();
    const horizontalSpeed = this.horizontalSpeed();
    if (this.bodiesBelow.length > 0 || canMoveOnAir) {
      this.#move(horizontalSpeed);
    }
    if (this.bodiesBelow.length > 0 && this.input.jump && !this.jumped) {
      this.#jump();
      this.bodiesBelow = [];
      this.jumped = true;
    } else if (!this.input.jump) {
      this.jumped = false;
    }
    this.clampHorizontalVelocity(horizontalSpeed);
  }

  horizontalSpeed() {
		const x = this.body.velocity.x;
		const y = this.body.velocity.y;
		return Math.sqrt(x*x + y*y);
  }

	clampHorizontalVelocity(horizontalSpeed) {
		if (horizontalSpeed < maxSpeed) return;

		const ratio = horizontalSpeed / maxSpeed;
		this.body.velocity.x /= ratio;
		this.body.velocity.y /= ratio;
	}

  #move(horizontalSpeed) {
    const magnitude = horizontalSpeed < minSpeed ? moveInitialMagnitude : moveMagnitude;
    this.body.pointToLocalFrame
    const x = this.input.move[0] * magnitude;
    const y = this.input.move[1] * magnitude;
    const impulse = new CANNON.Vec3(x, y, 0);
    this.body.applyImpulse(impulse);
  }

  #jump() {
    this.body.applyImpulse(jumpImpulse);
    gameAudio.playEffect('jump');
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
