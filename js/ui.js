// UI controls and event handlers
export class UI {
  constructor(cameraController, effects) {
    this.cameraController = cameraController;
    this.effects = effects;
  }

  setupEventListeners() {
    // Keyboard events
    window.addEventListener("keydown", (event) => this.onKeyDown(event));

    // Logo click event
    const logo = document.getElementById("logo");
    if (logo) {
      logo.addEventListener("click", () => this.onLogoClick());
    }

    // Button events
    const contactMeBtn = document.getElementById("contactMeBtn");
    if (contactMeBtn) {
      contactMeBtn.addEventListener("click", () => this.onContactMeClick());
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

  onLogoClick() {
    this.effects.hideContactForm();
    this.cameraController.animateToOriginalPosition();
  }

  onContactMeClick() {
    this.effects.extractCubesAndMoveCamera();
  }

  onLoseFocusClick() {
    this.effects.hideContactForm();
    this.cameraController.loseFocus();
  }
}
