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
    const treeMesh = this.scene.children.find(
      (child) => child.isMesh && child.geometry.type === "BoxGeometry"
    );
    if (!treeMesh) return;

    const extractedCubes = [];
    const cubeCount = 50;

    for (let i = 0; i < cubeCount; i++) {
      const cubeGeometry = new THREE.BoxGeometry(1.3, 1.3, 1.3);
      const cubeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.1, 0.8, 0.7),
        emissive: new THREE.Color().setHSL(Math.random() * 0.3 + 0.1, 0.6, 0.3),
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      cube.position.set(
        (Math.random() - 0.5) * 3,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 3
      );
      cube.scale.setScalar(0.1);
      cube.castShadow = true;
      cube.receiveShadow = true;

      this.scene.add(cube);
      extractedCubes.push(cube);
    }

    this.animateCubes(extractedCubes);
    setTimeout(() => {
      this.cameraController.animateToTree();
    }, 300);
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
