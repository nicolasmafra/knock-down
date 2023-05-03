import * as CANNON from 'cannon';
import * as THREE from 'three';

import gameEngine from '../engine/game-engine.js';
import gameGfx from '../engine/game-gfx.js';

import GameGround from './game-ground.js';

const playerWidth = 1.2;
const playerJumpHeigth = 1.0;
const scenarioWidth = 10;
const wallWidth = scenarioWidth/2 - playerWidth;
const wallHeight = 2*playerJumpHeigth;
const wallDepth = 1;
const wallDistance = wallWidth/2 + playerWidth/2;
const n = 4;
const wallRadialDistance = n*scenarioWidth/8 + wallDepth/2;

export default class GameScenario {
  grounds = [];

  constructor() {
    
    for (var i = 0; i < 8; i++) {
      let angle = (i+0.5) * 2*Math.PI/n;
      this.#addWallsAtAngle(angle);
    }

    this.grounds.push(new GameGround(
      new CANNON.Vec3(playerWidth, playerWidth, playerJumpHeigth),
      new CANNON.Vec3(0, 0, playerJumpHeigth/2),
      Math.PI/4)
    );
  }

  #addWallsAtAngle(angle) {

    const groundWidth = 0.3*scenarioWidth;
    const groundLength = scenarioWidth - groundWidth;
    this.#createGround(angle,
      new CANNON.Vec3(groundWidth, groundLength, 0.2),
      new CANNON.Vec3(-scenarioWidth/2 + groundWidth/2, -scenarioWidth/2 + groundLength/2, 0.1)
    );
    this.#createGround(angle,
      new CANNON.Vec3(wallDepth, wallWidth, wallHeight),
      new CANNON.Vec3(-wallRadialDistance, wallDistance, wallHeight/2)
    );
    this.#createGround(angle,
      new CANNON.Vec3(wallDepth, wallWidth, wallHeight),
      new CANNON.Vec3(-wallRadialDistance, -wallDistance, wallHeight/2)
    );
  }

  #createGround(angle, size, position) {
    const ground = new GameGround(size, position, angle);
    this.grounds.push(ground);
  }

  addToGame() {
		gameGfx.scene.background = new THREE.Color("cyan");

    this.grounds.forEach(ground => gameEngine.addToGame(ground));
  }
}
