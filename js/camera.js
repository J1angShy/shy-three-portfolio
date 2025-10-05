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

    // Comment out mouse hover effects to allow OrbitControls to work
    // window.addEventListener("mousemove", (event) => this.onMouseMove(event));
    // window.addEventListener("mouseleave", () => this.onMouseLeave());
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
    // Comment out hover effects to allow OrbitControls to work
    // if (
    //   !this.isAnimating &&
    //   (this.isHoveringScene || this.hoverCameraOffset.length() > 0.001)
    // ) {
    //   this.camera.position
    //     .copy(this.originalCameraPosition)
    //     .add(this.hoverCameraOffset);
    //   this.camera.lookAt(this.controls.target);
    // }
  }

  animateToTree() {
    this.isAnimating = true;
    this.hoverCameraOffset.set(0, 0, 0);

    // Use the specific camera parameters from the console output
    const destinationPosition = new THREE.Vector3(1.359, 2.644, 2.81);
    const destinationTarget = new THREE.Vector3(0.407, 2.644, 2.239);

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
      .start();

    // Animate controls target to the specific lookAt position
    new TWEEN.Tween(this.controls.target)
      .to(
        {
          x: destinationTarget.x,
          y: destinationTarget.y,
          z: destinationTarget.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        this.originalCameraPosition.copy(this.camera.position);
        this.hoverCameraOffset.set(0, 0, 0);
        this.isAnimating = false;
        this.controls.update();
      })
      .start();
  }

  animateToOriginalPosition() {
    this.isAnimating = true;
    this.hoverCameraOffset.set(0, 0, 0);

    // Original camera parameters from core.js
    const originalPosition = new THREE.Vector3(-0.113, 6.808, 10.069);
    const originalTarget = new THREE.Vector3(-0.077, 2.644, -0.398);

    new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: originalPosition.x,
          y: originalPosition.y,
          z: originalPosition.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

    // Animate controls target to the original lookAt position
    new TWEEN.Tween(this.controls.target)
      .to(
        {
          x: originalTarget.x,
          y: originalTarget.y,
          z: originalTarget.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        this.originalCameraPosition.copy(this.camera.position);
        this.hoverCameraOffset.set(0, 0, 0);
        this.isAnimating = false;
        this.controls.update();
      })
      .start();
  }

  loseFocus() {
    this.isAnimating = true;
    this.hoverCameraOffset.set(0, 0, 0);

    // Set camera to lose focus position
    const loseFocusPosition = new THREE.Vector3(0.022, 2.644, 16.425);
    const loseFocusTarget = new THREE.Vector3(-0.047, 2.644, 2.403);

    // Animate camera position
    new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: loseFocusPosition.x,
          y: loseFocusPosition.y,
          z: loseFocusPosition.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

    // Animate controls target
    new TWEEN.Tween(this.controls.target)
      .to(
        {
          x: loseFocusTarget.x,
          y: loseFocusTarget.y,
          z: loseFocusTarget.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        this.originalCameraPosition.copy(this.camera.position);
        this.hoverCameraOffset.set(0, 0, 0);
        this.isAnimating = false;
        this.controls.update();
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
