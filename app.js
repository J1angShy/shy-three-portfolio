// Main application entry point
import { Core } from "./js/core.js";
import { Lighting } from "./js/lighting.js";
import { Floor } from "./js/floor.js";
import { Tree } from "./js/tree.js";
import { CameraController } from "./js/camera.js";
import { Effects } from "./js/effects.js";
import { PostProcessing } from "./js/postprocessing.js";
import { UI } from "./js/ui.js";
import TWEEN from "./jsm/libs/tween.module.js";

class App {
  constructor() {
    this.core = new Core();
    this.lighting = null;
    this.floor = null;
    this.tree = null;
    this.cameraController = null;
    this.effects = null;
    this.postProcessing = null;
    this.ui = null;
    this.reflection = null;
    this.floorReflection = null;
  }

  async init() {
    // Initialize core Three.js setup
    await this.core.init();

    // Setup lighting
    this.lighting = new Lighting(this.core.scene);
    this.lighting.setupLights();

    // Setup floor
    this.floor = new Floor(this.core.scene);
    const reflection = await this.floor.setupFloor();

    // Store floor reference for potential future use
    this.floorReflection = reflection;

    // Setup tree
    this.tree = new Tree(this.core.scene);
    const treeMesh = this.tree.createTreeMesh();
    treeMesh.castShadow = true;
    treeMesh.receiveShadow = true;
    this.core.scene.add(treeMesh);
    this.tree.startAnimations();

    // Setup camera controller
    this.cameraController = new CameraController(
      this.core.camera,
      this.core.controls
    );
    this.cameraController.setupMouseControls();

    // Setup effects
    this.effects = new Effects(
      this.core.scene,
      this.core.camera,
      this.cameraController
    );

    // Setup post-processing
    this.postProcessing = new PostProcessing(
      this.core.renderer,
      this.core.scene,
      this.core.camera
    );
    this.postProcessing.setup();

    // Store reflection reference for potential future use
    this.reflection = reflection;

    // Ensure post-processing includes the reflection
    this.core.postProcessing = this.postProcessing;

    // Ensure floor reflection is properly integrated
    if (this.floorReflection) {
      this.core.floorReflection = this.floorReflection;
    }

    // Setup UI
    this.ui = new UI(this.cameraController, this.effects);
    this.ui.setupEventListeners();

    // Override core animate to include camera updates and TWEEN
    this.core.animate = () => {
      this.cameraController.update();
      // this.core.controls.update();
      TWEEN.update();
      this.postProcessing.render();
    };

    // Hide loading screen and show content
    this.hideLoadingScreen();
  }

  hideLoadingScreen() {
    this.animateProgressBar();

    // Add a small delay to ensure everything is loaded
    setTimeout(() => {
      const loadingScreen = document.getElementById("loadingScreen");
      const body = document.body;

      // Add fade-out class to loading screen
      loadingScreen.classList.add("fade-out");

      // Add content-loaded class to body to show main content
      body.classList.add("content-loaded");

      // Remove loading screen from DOM after animation
      setTimeout(() => {
        if (loadingScreen && loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, 1000); // Match CSS transition duration
    }, 3000); // 3 second delay to show loading progress
  }

  animateProgressBar() {
    const progressBar = document.querySelector(".progress-bar");
    const progressText = document.querySelector(".progress-text");

    let progress = 0;
    const totalDuration = 2000; // 2 seconds
    const updateInterval = 50; // Update every 50ms
    const increment = 100 / (totalDuration / updateInterval);

    const progressInterval = setInterval(() => {
      progress += increment;

      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }

      progressBar.style.width = progress + "%";
      progressText.textContent = Math.round(progress) + "%";
    }, updateInterval);
  }
}

// Initialize the application
const app = new App();
app.init();
