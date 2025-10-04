// UI controls and event handlers
export class UI {
  constructor(cameraController, effects) {
    this.cameraController = cameraController;
    this.effects = effects;
  }

  setupEventListeners() {
    // Keyboard events
    window.addEventListener("keydown", (event) => this.onKeyDown(event));

    // Button events
    const moveRightBtn = document.getElementById("moveRightBtn");
    if (moveRightBtn) {
      moveRightBtn.addEventListener("click", () => this.onMoveRightClick());
    }

    // Lose Focus button
    const loseFocusBtn = document.getElementById("loseFocusBtn");
    if (loseFocusBtn) {
      loseFocusBtn.addEventListener("click", () => this.onLoseFocusClick());
    }
  }

  onKeyDown(event) {
    if (event.key.toLowerCase() === "s") {
      this.cameraController.saveCameraParameters();
    }
  }

  onMoveRightClick() {
    this.effects.extractCubesAndMoveCamera();
  }

  onLoseFocusClick() {
    this.cameraController.loseFocus();
  }
}
