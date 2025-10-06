// Camera controls and animations
import * as THREE from "three/webgpu";
import TWEEN from "../jsm/libs/tween.module.js";

export class CameraController {
  constructor(camera, controls, effects) {
    this.camera = camera;
    this.controls = controls;
    this.effects = effects;
    this.mouse = new THREE.Vector2();
    this.isHoveringScene = false;
    this.originalCameraPosition = new THREE.Vector3();
    this.hoverCameraOffset = new THREE.Vector3();
    this.isAnimating = false;
    this.isInContactMeState = false; // Track contactMe state
  }

  setupMouseControls() {
    this.originalCameraPosition.copy(this.camera.position);

    // Mouse hover effects for interactive camera movement
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
    // Mouse hover effects for interactive camera movement
    // Disable hover effects when in contactMe state
    if (
      !this.isAnimating &&
      !this.isInContactMeState &&
      (this.isHoveringScene || this.hoverCameraOffset.length() > 0.001)
    ) {
      this.camera.position
        .copy(this.originalCameraPosition)
        .add(this.hoverCameraOffset);
      // Look at a default target point since we don't have controls.target
      this.camera.lookAt(-0.077, 2.644, -0.398);
    }
  }

  animateToTree() {
    this.isAnimating = true;
    this.hoverCameraOffset.set(0, 0, 0);
    // Remove active class from loseFocusBtn
    const loseFocusBtn = document.getElementById("loseFocusBtn");
    if (loseFocusBtn) {
      loseFocusBtn.classList.remove("active");
    }

    // Get current camera position and create a smooth lookAt target
    const currentPosition = this.camera.position.clone();
    const destinationPosition = new THREE.Vector3(1.359, 2.644, 2.81);
    const destinationTarget = new THREE.Vector3(0.407, 2.644, 2.239);

    // Create a smooth lookAt target that starts from current direction
    const currentLookAt = new THREE.Vector3();
    this.camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(this.camera.position);

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
      .onUpdate(() => {
        // Smoothly interpolate the lookAt target during animation
        const progress =
          this.camera.position.distanceTo(currentPosition) /
          currentPosition.distanceTo(destinationPosition);
        const smoothTarget = new THREE.Vector3().lerpVectors(
          currentLookAt,
          destinationTarget,
          progress
        );
        this.camera.lookAt(smoothTarget);
      })
      .onComplete(() => {
        this.originalCameraPosition.copy(this.camera.position);
        this.hoverCameraOffset.set(0, 0, 0);
        this.isAnimating = false;
        // Final lookAt to ensure correct orientation
        this.camera.lookAt(destinationTarget);
        // Set contactMe state to disable hover effects
        this.isInContactMeState = true;
        // Add active class to contactMeBtn
        const contactMeBtn = document.getElementById("contactMeBtn");
        if (contactMeBtn) {
          contactMeBtn.classList.add("active");
        }
      })
      .start();
  }

  animateToOriginalPosition() {
    this.isAnimating = true;
    this.hoverCameraOffset.set(0, 0, 0);
    this.isInContactMeState = false; // Reset contactMe state
    // Remove active class from contactMeBtn
    const contactMeBtn = document.getElementById("contactMeBtn");
    if (contactMeBtn) {
      contactMeBtn.classList.remove("active");
    }
    // Remove active class from loseFocusBtn
    const loseFocusBtn = document.getElementById("loseFocusBtn");
    if (loseFocusBtn) {
      loseFocusBtn.classList.remove("active");
    }

    // Get current camera position and create a smooth lookAt target
    const currentPosition = this.camera.position.clone();
    const originalPosition = new THREE.Vector3(-6.277, 4.338, 8.853);
    const originalTarget = new THREE.Vector3(-0.077, 2.644, -0.398);

    // Create a smooth lookAt target that starts from current direction
    const currentLookAt = new THREE.Vector3();
    this.camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(this.camera.position);

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
      .onUpdate(() => {
        // Smoothly interpolate the lookAt target during animation
        const progress =
          this.camera.position.distanceTo(currentPosition) /
          currentPosition.distanceTo(originalPosition);
        const smoothTarget = new THREE.Vector3().lerpVectors(
          currentLookAt,
          originalTarget,
          progress
        );
        this.camera.lookAt(smoothTarget);
      })
      .onComplete(() => {
        this.originalCameraPosition.copy(this.camera.position);
        this.hoverCameraOffset.set(0, 0, 0);
        this.isAnimating = false;
        // Final lookAt to ensure correct orientation
        this.camera.lookAt(originalTarget);
        // Show text content back when returning to original position
        if (this.effects) {
          this.effects.showTextContent();
        }
      })
      .start();
  }

  loseFocus() {
    this.isAnimating = true;
    this.hoverCameraOffset.set(0, 0, 0);
    this.isInContactMeState = false; // Reset contactMe state

    // Get current camera position and create a smooth lookAt target
    const currentPosition = this.camera.position.clone();
    const loseFocusPosition = new THREE.Vector3(0.022, 2.644, 16.425);
    const loseFocusTarget = new THREE.Vector3(-0.047, 2.644, 2.403);

    // Create a smooth lookAt target that starts from current direction
    const currentLookAt = new THREE.Vector3();
    this.camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(this.camera.position);

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
      .onUpdate(() => {
        // Smoothly interpolate the lookAt target during animation
        const progress =
          this.camera.position.distanceTo(currentPosition) /
          currentPosition.distanceTo(loseFocusPosition);
        const smoothTarget = new THREE.Vector3().lerpVectors(
          currentLookAt,
          loseFocusTarget,
          progress
        );
        this.camera.lookAt(smoothTarget);
      })
      .onComplete(() => {
        this.originalCameraPosition.copy(this.camera.position);
        this.hoverCameraOffset.set(0, 0, 0);
        this.isAnimating = false;
        // Final lookAt to ensure correct orientation
        this.camera.lookAt(loseFocusTarget);
        // Add active class to loseFocusBtn
        const loseFocusBtn = document.getElementById("loseFocusBtn");
        if (loseFocusBtn) {
          loseFocusBtn.classList.add("active");
        }
      })
      .start();
  }

  saveCameraParameters() {
    const position = this.camera.position;
    // Since we don't have controls.target, we'll use a default target point
    const target = new THREE.Vector3(-0.077, 2.644, -0.398);

    const cameraCode = `// Camera position and lookAt parameters
camera.position.set(${position.x.toFixed(3)}, ${position.y.toFixed(
      3
    )}, ${position.z.toFixed(3)});
camera.lookAt(${target.x.toFixed(3)}, ${target.y.toFixed(
      3
    )}, ${target.z.toFixed(3)});`;

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
