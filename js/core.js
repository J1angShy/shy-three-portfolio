// Core Three.js setup and initialization
import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import TWEEN from "three/addons/libs/tween.module.js";

export class Core {
  constructor() {
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.controls = null;
    this.postProcessing = null;
  }

  async init() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.25,
      30
    );
    this.camera.position.set(-6.277, 4.338, 8.853);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera.lookAt(-0.077, 2.644, -0.398);

    this.setupRenderer();
    this.setupControls();
    this.setupEventListeners();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGPURenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(() => this.animate());
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(this.renderer.domElement);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 1;
    this.controls.maxDistance = 15;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotateSpeed = 1;
    this.controls.target.set(-0.077, 2.644, -0.398);

    // Enable all controls for interaction
    this.controls.enablePan = true;
    this.controls.enableRotate = true;
    this.controls.enableZoom = true;

    // Enhanced panning settings for better left-right movement
    this.controls.panSpeed = 1.0;
    this.controls.screenSpacePanning = false; // Allow free panning in 3D space
    this.controls.keyPanSpeed = 7.0; // Keyboard panning speed

    // Optional: Enable auto-rotation (comment out if you don't want it)
    // this.controls.autoRotate = true;

    this.controls.update();
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.onWindowResize());
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.controls.update();
    TWEEN.update();
    if (this.postProcessing) {
      this.postProcessing.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
