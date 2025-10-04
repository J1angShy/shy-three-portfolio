// Camera controls and animations
import * as THREE from "three/webgpu";
import TWEEN from "three/addons/libs/tween.module.js";

export class CameraController {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.mouse = new THREE.Vector2();
    this.isHoveringScene = false;
    this.originalCameraPosition = new THREE.Vector3();
    this.hoverCameraOffset = new THREE.Vector3();
    this.isAnimating = false;
  }

  setupMouseControls() {
    this.originalCameraPosition.copy(this.camera.position);

    window.addEventListener("mousemove", (event) => this.onMouseMove(event));
    window.addEventListener("mouseleave", () => this.onMouseLeave());
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.isHoveringScene = true;

    const sensitivity = 0.5;
    this.hoverCameraOffset.x = this.mouse.x * sensitivity;
    this.hoverCameraOffset.y = this.mouse.y * sensitivity * 0.5;
    this.hoverCameraOffset.z = Math.abs(this.mouse.x) * sensitivity * 0.5;
  }

  onMouseLeave() {
    this.isHoveringScene = false;
    this.hoverCameraOffset.set(0, 0, 0);
  }

  update() {
    if (
      !this.isAnimating &&
      (this.isHoveringScene || this.hoverCameraOffset.length() > 0.001)
    ) {
      this.camera.position
        .copy(this.originalCameraPosition)
        .add(this.hoverCameraOffset);
      this.camera.lookAt(this.controls.target);
    }
  }

  animateToTree() {
    this.isAnimating = true;
    this.hoverCameraOffset.set(0, 0, 0);

    const destinationPosition = new THREE.Vector3(3, 4, 2);

    new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: destinationPosition.x,
          y: destinationPosition.y,
          z: destinationPosition.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        this.originalCameraPosition.copy(this.camera.position);
        this.hoverCameraOffset.set(0, 0, 0);
        this.isAnimating = false;
      })
      .start();
  }

  saveCameraParameters() {
    const position = this.camera.position;
    const target = this.controls.target;

    const cameraCode = `// Camera position and lookAt parameters
camera.position.set(${position.x.toFixed(3)}, ${position.y.toFixed(
      3
    )}, ${position.z.toFixed(3)});
controls.target.set(${target.x.toFixed(3)}, ${target.y.toFixed(
      3
    )}, ${target.z.toFixed(3)});
controls.update();`;

    console.log("=== Camera Parameters ===");
    console.log(cameraCode);
    console.log("========================");

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(cameraCode)
        .then(() => {
          console.log("Camera parameters copied to clipboard!");
        })
        .catch((err) => {
          console.log("Failed to copy to clipboard:", err);
        });
    }

    this.showSaveFeedback();
  }

  showSaveFeedback() {
    const feedback = document.createElement("div");
    feedback.textContent = "Camera position saved! (Check console)";
    feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 255, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
        `;
    document.body.appendChild(feedback);

    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 2000);
  }
}
