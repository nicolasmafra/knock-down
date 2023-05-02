import * as CANNON from 'cannon';
import * as THREE from 'three';

import gameEngine from '../engine/game-engine.js';
import gameGfx from '../engine/game-gfx.js';

import GameGround from './game-ground.js';

const playerWidth = 1.5;
const scenarioWidth = 10;
const wallWidth = scenarioWidth/2 - playerWidth;
const wallHeight = 2.0;
const wallDepth = 1;
const wallDistance = wallWidth/2 + playerWidth/2;
const Z_AXIS = new CANNON.Vec3(0, 0, 1);

export default class GameScenario {
  grounds = [];

  constructor() {
    this.grounds.push(new GameGround(new CANNON.Vec3(scenarioWidth, scenarioWidth, 0.2)));
    
    const direction = new CANNON.Quaternion();
    for (var i = 0; i < 4; i++) {
      direction.setFromAxisAngle(Z_AXIS, i * Math.PI/2);
      this.#addWallsAtDirection(direction);
    }

    this.grounds.push(new GameGround(new CANNON.Vec3(playerWidth, playerWidth, 1)));
  }

  #addWallsAtDirection(direction) {

    this.#createGround(direction,
      new CANNON.Vec3(wallDepth, wallWidth, wallHeight),
      new CANNON.Vec3(-wallDepth/2-scenarioWidth/2, wallDistance, wallHeight/2)
    );
    this.#createGround(direction,
      new CANNON.Vec3(wallDepth, wallWidth, wallHeight),
      new CANNON.Vec3(-wallDepth/2-scenarioWidth/2, -wallDistance, wallHeight/2)
    );
  }

  #createGround(direction, size, position) {
    direction.vmult(position, position);
    direction.vmult(size, size);
    if (size.x < 0) size.x *= -1;
    if (size.y < 0) size.y *= -1;

    const ground = new GameGround(size, position);
    this.grounds.push(ground);
  }

  addToGame() {
		gameGfx.scene.background = new THREE.Color("cyan");

    this.grounds.forEach(ground => gameEngine.addToGame(ground));
  }
}
