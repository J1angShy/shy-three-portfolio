// Visual effects and cube animations
import * as THREE from "three/webgpu";
import TWEEN from "three/addons/libs/tween.module.js";

export class Effects {
  constructor(scene, camera, cameraController) {
    this.scene = scene;
    this.camera = camera;
    this.cameraController = cameraController;
  }

  extractCubesAndMoveCamera() {
    // Just move the camera without creating flying cubes
    this.cameraController.animateToTree();
  }

  animateCubes(cubes) {
    cubes.forEach((cube, index) => {
      const targetX = 6 + Math.random() * 2;
      const targetY = 1 + Math.random() * 3;
      const targetZ = (Math.random() - 0.5) * 2;

      const scatterX = cube.position.x + (Math.random() - 0.5) * 2;
      const scatterY = cube.position.y + (Math.random() - 0.5) * 2;
      const scatterZ = cube.position.z + (Math.random() - 0.5) * 2;

      new TWEEN.Tween(cube.position)
        .to({ x: scatterX, y: scatterY, z: scatterZ }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      new TWEEN.Tween(cube.rotation)
        .to({ x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      setTimeout(() => {
        new TWEEN.Tween(cube.position)
          .to({ x: targetX, y: targetY, z: targetZ }, 2000)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();

        new TWEEN.Tween(cube.rotation)
          .to({ x: 0, y: 0, z: 0 }, 2000)
          .easing(TWEEN.Easing.Cubic.InOut)
          .start();
      }, 500);
    });
  }
}
