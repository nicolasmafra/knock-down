import * as CANNON from 'cannon';
import * as THREE from 'three';

import gameEngine from '../../engine/game-engine.js';
import gameGfx from '../../engine/game-gfx.js';

import GameGround from '../game-ground.js';

const playerWidth = 0.7;
const playerJumpHeigth = 2.55;

const scenarioRadius = 6;
const angleOffset = Math.PI/2;
const useHalfAngle = true;

const pilarHeight = 0.7*playerJumpHeigth;
const pilarRadius = 1.5*playerWidth;
const wallHoleWidth = 2.0*playerWidth;
const wallHeight = 1.1*playerJumpHeigth;
const wallDepth = 0.5*playerWidth;

export default class CircleScenario {
  grounds = [];

  constructor(n, ice) {

    if (ice) {
      GameGround.setAsIce();
    } else {
      GameGround.setAsGrass();
    }
    const wallInternalRadialDistance = scenarioRadius - wallDepth;
    const wallRadialDistance = scenarioRadius - wallDepth/2;
    const wallWidth = 2*Math.PI*wallInternalRadialDistance/n - wallHoleWidth;
    const indexOffset = useHalfAngle ? 0.5 : 0;

    for (var i = 0; i < n; i++) {
      let angle = angleOffset + (i + indexOffset) * 2*Math.PI/n;
      const rotation = new CANNON.Quaternion().setFromAxisAngle(gameEngine.upVector, angle);
      const position = new CANNON.Vec3(-wallRadialDistance, 0, wallHeight/2);
      rotation.vmult(position, position);
      this.grounds.push(GameGround.createBox(wallDepth, wallWidth, wallHeight, position, rotation));
    }

    this.grounds.push(GameGround.createCylinder(scenarioRadius, 0.2, new CANNON.Vec3(0, 0, 0.1)));
    this.grounds.push(GameGround.createCylinder(pilarRadius, pilarHeight, new CANNON.Vec3(0, 0, pilarHeight/2)));
  }

  addToGame() {
		gameGfx.scene.background = new THREE.Color(0x001030);

    this.grounds.forEach(ground => gameEngine.addToGame(ground));
  }
}
