import * as THREE from 'three';
import * as CANNON from 'cannon';
import gamePhysics from '../engine/game-physics.js';
import GamePlayer from './game-player.js';
import gameEngine from '../engine/game-engine.js';

const radius = 0.08;
const height = 0.2;
const speed = 30;
const minZ = -3*height;

const recoilFactor = 0.5;

const shape = new CANNON.Cylinder(radius, radius, height);
const geometry = new THREE.CylinderGeometry(radius, radius, height);
const material = new THREE.MeshLambertMaterial({ color: 0x111111 });

export default class GameBullet {
  static bulletRadius = height/2; 
  material = new CANNON.Material({
    friction: 0.01,
    restitution: 0,
  });
  maxTime = 2.0;
  /** @type CANNON.Body */
  body = null;
  mesh = null;
  shooterPlayer = null;
  time = 0;

  constructor(shooterPlayer, position, angle) {

    this.shooterPlayer = shooterPlayer;
    this.#createBody();
    this.#createMesh();

    this.body.position.copy(position);
    const rotation = new CANNON.Quaternion().setFromAxisAngle(gameEngine.upVector, angle - Math.PI/2);
    this.body.quaternion.mult(rotation, this.body.quaternion);
    this.body.velocity.x = shooterPlayer.body.velocity.x + speed*Math.cos(angle);
    this.body.velocity.y = shooterPlayer.body.velocity.y + speed*Math.sin(angle);
  }

  #createMesh() {
    this.mesh = new THREE.Mesh(
        geometry,
        material
    );
    this.mesh.userData = this;
  }

  #createBody() {
    this.body = new CANNON.Body({
      shape,
      mass: 10,
      linearDamping: 0,
      angularDamping: 0,
    });
    this.body.userData = this;
  }

  afterAddToGame() {
    this.body.addEventListener('collide', (event) => {
      let object = gamePhysics.inContact(event.contact, this.body);
      if (object.userData instanceof GamePlayer && object.userData != this.shooterPlayer) {
        object.userData.receiveBullet(this);
        gameEngine.removeFromGame(this);
      }
    });
  }

  /**
   * @param {GamePlayer} player
   * @param {number} angle 
   */
  static spawn(player, angle, position) {
    const bullet = new GameBullet(player, position, angle);
    gameEngine.addToGame(bullet);
    player.body.applyImpulse(bullet.body.velocity.scale(-recoilFactor*bullet.body.mass));
  }

  update() {
    gamePhysics.updateMesh(this);
    this.time += gamePhysics.timeUnit;
    if (this.time >= this.maxTime || this.body.position.z < minZ) {
        gameEngine.removeFromGame(this);
    }
  }
}
