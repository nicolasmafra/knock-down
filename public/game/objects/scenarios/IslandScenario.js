import * as CANNON from 'cannon';
import * as THREE from 'three';

import gameEngine from '../../engine/game-engine.js';
import gameGfx from '../../engine/game-gfx.js';

import GameGround from '../game-ground.js';

const playerWidth = 0.7;
const playerJumpHeigth = 2.55;

const islandRadius = 2.5*playerWidth;
const n = 4;
const islandDistance = 2*islandRadius + 1.5*playerWidth;
const yDistance = 3;

export default class IslandScenario {
  grounds = [];
  gemInitialPosition = new CANNON.Vec3(0, 0, playerJumpHeigth);

  constructor() {

    GameGround.setAsGrass();
    this.#placeLineOfIslands(yDistance);
    this.#placeLineOfIslands(-yDistance);

    this.grounds.push(new GameGround(
      new CANNON.Cylinder(islandRadius, islandRadius, 0.2),
      new THREE.CylinderGeometry(islandRadius, islandRadius, 0.2),
      new CANNON.Vec3(0, 0, 0.1),
      gameEngine.geometryRotation)
    );
  }

  #placeLineOfIslands(y) {
    const totalSpace = (n-1) * islandDistance;

    for (var i = 0; i < n; i++) {
      const x = -totalSpace/2 + i * islandDistance;
      const position = new CANNON.Vec3(x, y, 0.1);
      this.grounds.push(new GameGround(
        new CANNON.Cylinder(islandRadius, islandRadius, 0.2),
        new THREE.CylinderGeometry(islandRadius, islandRadius, 0.2),
        position,
        gameEngine.geometryRotation)
      );
    }
  }

  addToGame() {
		gameGfx.scene.background = new THREE.Color("cyan");

    this.grounds.forEach(ground => gameEngine.addToGame(ground));
  }
}
