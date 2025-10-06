// Tree generation and management
import * as THREE from "three/webgpu";
import {
  abs,
  blendOverlay,
  color,
  float,
  Fn,
  instancedBufferAttribute,
  materialColor,
  max,
  normalWorldGeometry,
  pass,
  positionGeometry,
  positionLocal,
  pow2,
  reflector,
  screenUV,
  sin,
  sub,
  texture,
  time,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";
import TWEEN from "../jsm/libs/tween.module.js";

export class Tree {
  constructor(scene) {
    this.scene = scene;
    this.uniformEffector1 = uniform(-0.2);
    this.uniformEffector2 = uniform(-0.2);
    this.uniformEffector3 = uniform(-0.2);
    this.TREE_SEED = 45;
    this.TREE_PARAMS = {
      maxSteps: 4,
      lengthMult: 0.85,
      branchCount: 6,
      initialLength: 27,
      initialAngle: Math.PI * 0.5,
    };
    this.seedCounter = 0;
  }

  createTreeMesh() {
    const maxSteps = this.TREE_PARAMS.maxSteps;
    const lengthMult = this.TREE_PARAMS.lengthMult;

    const positions = [];
    const normals = [];
    const colors = [];
    const data = [];

    let instanceCount = 0;

    const newPosition = new THREE.Vector3();
    const position = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const color = new THREE.Color();

    const createTreePart = (angle, x, y, z, length, count) => {
      const branchSeed = this.getNextSeed();
      if (this.seededRandom(branchSeed) > (maxSteps / count) * 0.25) return;

      if (count < maxSteps) {
        const newLength = length * lengthMult;
        const newX = x + Math.cos(angle) * length;
        const newY = y + Math.sin(angle) * length;
        const countSq = Math.min(2.0, count * count);
        const newZ =
          z +
          (this.seededRandom(this.getNextSeed()) * countSq - countSq / 4) *
            length *
            0.5;

        let size = 30 - count * 8;
        if (size > 25) size = 25;
        if (size < 10) size = 10;

        size = size / 100;
        const subSteps = 60;

        for (let i = 0; i < subSteps; i++) {
          instanceCount++;

          const percent = i / subSteps;
          const extra = 1 / maxSteps;

          newPosition
            .set(x, y, z)
            .lerp(new THREE.Vector3(newX, newY, newZ), percent);
          position.copy(newPosition);

          const posSeed = this.getNextSeed();
          position.x += this.seededRandom(posSeed) * size * 3;
          position.y += this.seededRandom(posSeed + 1) * size * 2;
          position.z += this.seededRandom(posSeed + 2) * size * 2;

          positions.push(position.x, position.y, position.z);

          const scale = this.seededRandom(this.getNextSeed()) + 5;

          normal.copy(position).sub(newPosition).normalize();
          normals.push(normal.x, normal.y, normal.z);

          const colorSeed = this.getNextSeed();
          color.setHSL(
            (count / maxSteps) * 0.5 + this.seededRandom(colorSeed) * 0.05,
            0.75,
            0.6 + this.seededRandom(colorSeed + 1) * 0.1
          );
          colors.push(color.r, color.g, color.b);

          const instanceSize = size * scale;
          const instanceTime = count / maxSteps + percent * extra;
          const instanceSeed = this.seededRandom(this.getNextSeed());

          data.push(instanceSize, instanceTime, instanceSeed);
        }

        for (let i = 0; i < this.TREE_PARAMS.branchCount; i++) {
          createTreePart(
            angle + this.seededRandom(this.getNextSeed()),
            newX,
            newY,
            newZ,
            newLength + this.seededRandom(this.getNextSeed()),
            count + 1
          );
        }
      }
    };

    const angle = this.TREE_PARAMS.initialAngle;
    createTreePart(angle, 0, 0, 0, this.TREE_PARAMS.initialLength, 0);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardNodeMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(0.06);
    mesh.count = instanceCount;
    mesh.frustumCulled = false;

    const attributePosition = new THREE.InstancedBufferAttribute(
      new Float32Array(positions),
      3
    );
    const attributeNormal = new THREE.InstancedBufferAttribute(
      new Float32Array(normals),
      3
    );
    const attributeColor = new THREE.InstancedBufferAttribute(
      new Float32Array(colors),
      3
    );
    const attributeData = new THREE.InstancedBufferAttribute(
      new Float32Array(data),
      3
    );

    const instancePosition = instancedBufferAttribute(attributePosition);
    const instanceNormal = instancedBufferAttribute(attributeNormal);
    const instanceColor = instancedBufferAttribute(attributeColor);
    const instanceData = instancedBufferAttribute(attributeData);

    material.positionNode = Fn(() => {
      const instanceSize = instanceData.x;
      const instanceTime = instanceData.y;
      const instanceSeed = instanceData.z;

      const dif1 = abs(instanceTime.sub(this.uniformEffector1)).toConst();
      let effect = dif1
        .lessThanEqual(0.15)
        .select(sub(0.15, dif1).mul(sub(1.7, instanceTime).mul(10)), float(0));

      const dif2 = abs(instanceTime.sub(this.uniformEffector2)).toConst();
      effect = dif2
        .lessThanEqual(0.15)
        .select(sub(0.15, dif2).mul(sub(1.7, instanceTime).mul(10)), effect);

      const transitionFactor = float(1.0)
        .sub(dif1.div(0.25))
        .clamp(0, 1)
        .add(float(1.0).sub(dif2.div(0.25)).clamp(0, 1))
        .div(2)
        .clamp(0, 1);

      const smoothEffect = effect.mul(transitionFactor);

      let animated = positionLocal.add(instancePosition).toVar();
      const direction = positionGeometry.normalize().toConst();

      animated = animated.add(direction.mul(smoothEffect.add(instanceSize)));
      animated = animated.sub(direction.mul(smoothEffect));
      animated = animated.add(instanceNormal.mul(smoothEffect.mul(1.5)));
      animated = animated.add(
        instanceNormal.mul(abs(sin(time.add(instanceSeed.mul(2))).mul(1.5)))
      );

      return animated;
    })();

    const squareEdge = Fn(() => {
      const pos = uv().sub(vec2(0.5, 0.5));
      const squareDistance = max(abs(pos.x), abs(pos.y));
      return squareDistance.div(0.5).clamp(0.85, 1).sub(0.5).mul(2.0);
    })();

    material.colorNode = Fn(() => {
      return squareEdge.sub(instanceColor);
    })();

    material.emissiveNode = Fn(() => {
      const instanceTime = instanceData.y;

      const dif1 = abs(instanceTime.sub(this.uniformEffector1)).toConst();
      const effect1 = dif1
        .lessThanEqual(0.15)
        .select(sub(0.15, dif1).mul(sub(1.7, instanceTime).mul(10)), float(0));

      const dif2 = abs(instanceTime.sub(this.uniformEffector2)).toConst();
      const effect2 = dif2
        .lessThanEqual(0.15)
        .select(sub(0.15, dif2).mul(sub(1.7, instanceTime).mul(10)), effect1);

      const topFadeFactor = float(1.0).sub(instanceTime.mul(0.7)).clamp(0, 1);
      const finalEffect1 = effect1.mul(topFadeFactor);
      const finalEffect2 = effect2.mul(topFadeFactor);

      const cycleTime = time.mul(0.3);
      const cyclePhase = cycleTime.mod(3);

      const color1 = vec3(finalEffect1, finalEffect2, 0);
      const color2 = vec3(0, finalEffect1, finalEffect2);
      const color3 = vec3(finalEffect1, 0, finalEffect2);

      let finalColor;

      if (cyclePhase.lessThan(1)) {
        const t = cyclePhase;
        finalColor = color1.mul(float(1).sub(t)).add(color2.mul(t));
      } else if (cyclePhase.lessThan(2)) {
        const t = cyclePhase.sub(1);
        finalColor = color2.mul(float(1).sub(t)).add(color3.mul(t));
      } else {
        const t = cyclePhase.sub(2);
        finalColor = color3.mul(float(1).sub(t)).add(color1.mul(t));
      }

      const glowIntensity = sin(time.mul(1.5)).mul(0.2).add(0.8);
      const outerGlow = finalColor.mul(glowIntensity).mul(0.6);
      const combinedGlow = finalColor.add(outerGlow);

      return pow2(combinedGlow).mul(instanceColor);
    })();

    return mesh;
  }

  startAnimations() {
    new TWEEN.Tween(this.uniformEffector1)
      .to({ value: 1.1 }, 3000)
      .delay(0)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();

    new TWEEN.Tween(this.uniformEffector2)
      .to({ value: 1.2 }, 3000)
      .delay(3000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();

    new TWEEN.Tween(this.uniformEffector3)
      .to({ value: 1.3 }, 2000)
      .delay(6000)
      .repeat(Infinity)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .start();
  }

  seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return (x - Math.floor(x)) * 2.0 - 1.0;
  }

  getNextSeed() {
    return this.TREE_SEED + this.seedCounter++;
  }
}
