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
    // Check if contact form is already displayed
    const existingForm = document.getElementById("contactForm");
    if (existingForm) {
      // Form is already displayed, do nothing
      return;
    }

    // Hide all HTML content gradually
    this.hideHtmlContent();

    // Move the camera
    this.cameraController.animateToTree();

    // Show content back after transition ends
    setTimeout(() => {
      this.showHtmlContent();
    }, 2500); // Slightly longer than camera animation duration
  }

  hideContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.style.transition = "opacity 0.3s ease-out";
      contactForm.style.opacity = "0";
      setTimeout(() => {
        if (contactForm && contactForm.parentNode) {
          contactForm.parentNode.removeChild(contactForm);
        }
      }, 300);
    }
  }

  hideHtmlContent() {
    const htmlElements = [
      document.getElementById("logo"),
      document.getElementById("info"),
      document.getElementById("moveRightBtn"),
      document.getElementById("loseFocusBtn"),
    ];

    htmlElements.forEach((element) => {
      if (element) {
        element.style.transition = "opacity 0.5s ease-out";
        element.style.opacity = "0";
        // Hide pointer events to prevent interaction
        element.style.pointerEvents = "none";
      }
    });
  }

  showHtmlContent() {
    const htmlElements = [
      document.getElementById("logo"),
      document.getElementById("info"),
      document.getElementById("moveRightBtn"),
      document.getElementById("loseFocusBtn"),
    ];

    // Show all HTML elements at the same time
    htmlElements.forEach((element) => {
      if (element) {
        element.style.transition = "opacity 0.1s ease-in";
        element.style.opacity = "1";
        element.style.pointerEvents = "auto";
      }
    });

    // Show contact form at the same time as other elements
    this.createContactForm();
  }

  createContactForm() {
    // Remove existing contact form if it exists
    const existingForm = document.getElementById("contactForm");
    if (existingForm) {
      existingForm.remove();
    }

    // Create contact form container
    const contactForm = document.createElement("div");
    contactForm.id = "contactForm";
    contactForm.innerHTML = `
      <div class="contact-form-container">
        <h2 class="contact-title">Send Me a Message~</h2>
        <form class="contact-form">
          <div class="form-group">
            <label for="name">Your name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" class="submit-btn">SEND MESSAGE</button>
        </form>
      </div>
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      #contactForm {
        position: fixed;
        left: 15%;
        top: 50%;
        transform: translateY(-50%);
        width: 400px;
        opacity: 0;
        transition: opacity 0.8s ease-in;
        z-index: 1000;
      }

      .contact-form-container {
        background: rgba(0, 0, 0, 0.8);
        padding: 1.5rem;
        backdrop-filter: blur(10px);
      }

      .contact-title {
        color: #fff;
        font-size: 1.8rem;
        margin: 0 0 1.5rem 0;
        font-weight: 400;
        letter-spacing: 0.1em;
        white-space: nowrap;
        font-family: 'Courier New', monospace;
      }

      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        color: #fff;
        font-size: 0.9rem;
        font-weight: 400;
        font-family: 'Courier New', monospace;
      }

      .form-group input,
      .form-group textarea {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        padding: 0.8rem;
        color: #fff;
        font-size: 1rem;
        font-family: 'Courier New', monospace;
        transition: border-color 0.3s ease;
      }

      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.5);
      }

      .form-group input::placeholder,
      .form-group textarea::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .submit-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;
        padding: 0.8rem 1.5rem;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        font-family: 'Courier New', monospace;
        font-weight: 400;
        text-transform: uppercase;
        transition: all 0.3s ease;
        margin-top: 1rem;
        width: fit-content;
        align-self: center;
      }

      .submit-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        #contactForm {
          width: 90%;
          left: 5%;
          right: 5%;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(contactForm);

    // Fade in the form
    setTimeout(() => {
      contactForm.style.opacity = "1";
    }, 100);

    // Add form submission handler
    const form = contactForm.querySelector(".contact-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmission(form);
    });
  }

  handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    // Show loading state
    const submitBtn = form.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.style.background = "rgba(255, 165, 0, 0.2)";
    submitBtn.style.borderColor = "rgba(255, 165, 0, 0.5)";
    submitBtn.disabled = true;

    // Send email using EmailJS
    this.sendEmailWithEmailJS(data)
      .then(() => {
        // Success
        submitBtn.textContent = "Message Sent!";
        submitBtn.style.background = "rgba(0, 255, 0, 0.2)";
        submitBtn.style.borderColor = "rgba(0, 255, 0, 0.5)";

        // Reset form after 2 seconds
        setTimeout(() => {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = "rgba(255, 255, 255, 0.1)";
          submitBtn.style.borderColor = "rgba(255, 255, 255, 0.3)";
          submitBtn.disabled = false;
        }, 2000);
      })
      .catch((error) => {
        // Error
        console.error("Email sending failed:", error);
        submitBtn.textContent = "Failed to Send";
        submitBtn.style.background = "rgba(255, 0, 0, 0.2)";
        submitBtn.style.borderColor = "rgba(255, 0, 0, 0.5)";

        // Reset after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = "rgba(255, 255, 255, 0.1)";
          submitBtn.style.borderColor = "rgba(255, 255, 255, 0.3)";
          submitBtn.disabled = false;
        }, 3000);
      });

    console.log("Contact form submitted:", data);
  }

  async sendEmailWithEmailJS(data) {
    // EmailJS configuration
    const serviceID = "service_jcrf0oc"; // You'll need to create this in EmailJS
    const templateID = "template_sjphp2i"; // You'll need to create this in EmailJS
    const publicKey = "4QHnIABUS32tUrVBb"; // You'll need to get this from EmailJS

    // EmailJS template parameters
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      message: data.message,
      to_email: "jiangshy2001@outlook.com",
    };

    // Send email using EmailJS
    try {
      // Load EmailJS SDK if not already loaded
      if (typeof emailjs === "undefined") {
        await this.loadEmailJSSDK();
      }

      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );
      console.log("Email sent successfully:", response);
      return response;
    } catch (error) {
      console.error("EmailJS error:", error);
      throw error;
    }
  }

  loadEmailJSSDK() {
    return new Promise((resolve, reject) => {
      if (typeof emailjs !== "undefined") {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
      script.onload = () => {
        // Initialize EmailJS with your public key
        emailjs.init("4QHnIABUS32tUrVBb");
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
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
