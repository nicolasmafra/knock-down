import * as CANNON from 'cannon';
import * as THREE from 'three';

import gameEngine from '../engine/game-engine.js';
import gameGfx from '../engine/game-gfx.js';

import GameGround from './game-ground.js';

const playerWidth = 1.2;
const playerJumpHeigth = 2.55;

const n = 8;
const scenarioRadius = 6;

const wallInternalRadialDistance = scenarioRadius - playerWidth;
const wallRadialDistance = scenarioRadius - playerWidth/2;
const wallWidth = 2*Math.PI*wallInternalRadialDistance/n - playerWidth;
const wallHeight = 1.0*playerJumpHeigth;
const wallDepth = playerWidth;

const pilarHeight = 0.8*playerJumpHeigth;

export default class GameScenario {
  grounds = [];

  constructor() {
    
    for (var i = 0; i < n; i++) {
      let angle = (i+0.5) * 2*Math.PI/n;
      const rotation = new CANNON.Quaternion().setFromAxisAngle(gameEngine.upVector, angle);
      const position = new CANNON.Vec3(-wallRadialDistance, 0, wallHeight/2);
      rotation.vmult(position, position);
      this.grounds.push(new GameGround(
        new CANNON.Box(new CANNON.Vec3(wallDepth/2, wallWidth/2, wallHeight/2)),
        new THREE.BoxGeometry(wallDepth, wallWidth, wallHeight),
        position,
        rotation))
    }

    this.grounds.push(new GameGround(
      new CANNON.Cylinder(scenarioRadius, scenarioRadius, 0.2),
      new THREE.CylinderGeometry(scenarioRadius, scenarioRadius, 0.2),
      new CANNON.Vec3(0, 0, 0.1),
      gameEngine.geometryRotation)
    );
    this.grounds.push(new GameGround(
      new CANNON.Box(new CANNON.Vec3(playerWidth/2, playerWidth/2, pilarHeight/2)),
      new THREE.BoxGeometry(playerWidth, playerWidth, pilarHeight),
      new CANNON.Vec3(0, 0, pilarHeight/2),
      new CANNON.Quaternion().setFromAxisAngle(gameEngine.upVector, Math.PI/4))
    );
  }

  addToGame() {
		gameGfx.scene.background = new THREE.Color("cyan");

    this.grounds.forEach(ground => gameEngine.addToGame(ground));
  }
}
