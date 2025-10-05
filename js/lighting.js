// Lighting setup and management
import * as THREE from "three/webgpu";

export class Lighting {
  constructor(scene) {
    this.scene = scene;
  }

  setupLights() {
    this.setupAmbientLight();
    this.setupMainTreeLight();
    this.setupSecondaryLights();
    this.setupAccentLights();
    this.setupAtmosphericLights();
    this.setupLightBeam();
  }

  setupAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0x202020, 0.1);
    this.scene.add(ambientLight);
  }

  setupMainTreeLight() {
    const mainTreeLight = new THREE.SpotLight(
      0xffffff,
      15,
      20,
      Math.PI / 6,
      0.1,
      3
    );
    mainTreeLight.position.set(0, 8, 4);
    mainTreeLight.target.position.set(0, 2, 0);
    mainTreeLight.castShadow = true;
    mainTreeLight.shadow.mapSize.width = 2048;
    mainTreeLight.shadow.mapSize.height = 2048;
    mainTreeLight.shadow.camera.near = 0.5;
    mainTreeLight.shadow.camera.far = 20;
    this.scene.add(mainTreeLight);
    this.scene.add(mainTreeLight.target);
  }

  setupSecondaryLights() {
    const treeLight1 = new THREE.PointLight(0xffe6cc, 12, 8);
    treeLight1.position.set(3, 3, 2);
    this.scene.add(treeLight1);

    const treeLight2 = new THREE.PointLight(0xe6f3ff, 10, 8);
    treeLight2.position.set(-3, 4, 1);
    this.scene.add(treeLight2);

    const treeLight3 = new THREE.PointLight(0xfff0e6, 8, 6);
    treeLight3.position.set(0, 6, -2);
    this.scene.add(treeLight3);
  }

  setupAccentLights() {
    const accentLight2 = new THREE.PointLight(0x87ceeb, 5, 5);
    accentLight2.position.set(-2, 2, 2);
    this.scene.add(accentLight2);

    //light shooting from the right side of the tree
    const rimLight = new THREE.DirectionalLight(0x404040, 3);
    rimLight.position.set(5, 3, 5);
    this.scene.add(rimLight);
  }

  setupAtmosphericLights() {
    //light in the middle of the tree
    const treeAtmosphereLight = new THREE.PointLight(0x4a90e2, 8, 12);
    treeAtmosphereLight.position.set(0, 3, 0);
    this.scene.add(treeAtmosphereLight);

    const groundLight = new THREE.SpotLight(
      0x2c5aa0,
      6,
      15,
      Math.PI / 3,
      0.3,
      2
    );
    groundLight.position.set(0, 4, 0);
    groundLight.target.position.set(0, 0, 0);
    groundLight.castShadow = true;
    this.scene.add(groundLight);
    this.scene.add(groundLight.target);
  }

  setupLightBeam() {
    // Create a dramatic light beam shooting from behind the tree to the ground in front
    // const lightBeam = new THREE.SpotLight(
    //   0xff6b35, // Orange/amber color
    //   15, // High intensity
    //   30, // Long distance
    //   Math.PI / 4, // Wider angle for broader beam
    //   0.1, // Sharp falloff
    //   2 // Sharp decay
    // );

    // // Position the light behind the tree, shooting forward
    // lightBeam.position.set(0, 4, -8);

    // // Target the ground in front of the tree
    // lightBeam.target.position.set(0, 0, 3);

    // // Enable shadows for dramatic effect
    // lightBeam.castShadow = true;
    // lightBeam.shadow.mapSize.width = 4096;
    // lightBeam.shadow.mapSize.height = 4096;
    // lightBeam.shadow.camera.near = 1;
    // lightBeam.shadow.camera.far = 50;
    // lightBeam.shadow.camera.fov = 30;

    // // Add the light and its target to the scene
    // this.scene.add(lightBeam);
    // this.scene.add(lightBeam.target);

    // Add a secondary beam for more dramatic effect
    const lightBeam2 = new THREE.SpotLight(
      0x87ceeb, // Sky blue color
      15,
      25,
      Math.PI / 2,
      0.2,
      1.5
    );

    lightBeam2.position.set(-2, 3, -6);
    lightBeam2.target.position.set(1, 0, 2);
    lightBeam2.castShadow = true;
    lightBeam2.shadow.mapSize.width = 2048;
    lightBeam2.shadow.mapSize.height = 2048;

    this.scene.add(lightBeam2);
    this.scene.add(lightBeam2.target);

    // Add a third beam for extra drama
    const lightBeam3 = new THREE.SpotLight(
      0xff1493, // Deep pink color
      12,
      20,
      Math.PI / 6,
      0.15,
      1.8
    );

    lightBeam3.position.set(2, 5, -7);
    lightBeam3.target.position.set(-1, 0, 4);
    lightBeam3.castShadow = true;

    this.scene.add(lightBeam3);
    this.scene.add(lightBeam3.target);
  }
}
