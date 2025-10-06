# Shy's 3D Portfolio

A stunning 3D web portfolio built with Three.js WebGPU, featuring an interactive tree-like structure with dynamic lighting, reflections, and smooth animations.

Inspired by [Three.js WebGPU Reflection Example](https://threejs.org/examples/webgpu_reflection.html) and based on Recursive Tree Cubes by oosmoxiecode.

![Portfolio Preview](https://img.shields.io/badge/Three.js-WebGPU-FF6B6B?style=for-the-badge&logo=three.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)


## 🚀 Getting Started

### Prerequisites

- Modern browser with WebGPU support (Chrome 113+, Firefox 110+, Safari 16.4+)
- Local web server (Python, Node.js, or any static file server)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/shy-three-portfolio.git
   cd shy-three-portfolio
   ```

2. **Start a local server**

   **Live Server (VS Code extension):**

   - Install "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

3. **Open in browser**
   ```
   http://localhost:5500
   ```

## 🏗️ Project Structure

```
shy-three-portfolio/
├── index.html              # Main HTML file
├── main.css               # Styles and animations
├── app.js                 # Main application entry point
├── js/
│   ├── core.js           # Three.js setup and initialization
│   ├── lighting.js       # Dynamic lighting system
│   ├── floor.js          # Reflective floor implementation
│   ├── tree.js           # 3D tree generation and animation
│   ├── camera.js         # Camera controls and animations
│   ├── effects.js        # Visual effects and transitions
│   ├── postprocessing.js # Post-processing effects
│   └── ui.js             # User interface interactions
├── assets/               # Static assets (favicon, etc.)
└── LICENSE               # MIT License
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the amazing 3D library
- **WebGPU Working Group**: For the next-generation graphics API
- **oosmoxiecode**: Original Recursive Tree Cubes inspiration
- **Three.js Examples**: [WebGPU Reflection Example](https://threejs.org/examples/webgpu_reflection.html)

## 📧 Contact

**Shy** - [jiangshy.me@gmail.com](mailto:jiangshy.me@gmail.com)

Project Link: [Portfolio](https://shy-three-portfolio.vercel.app/)

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ and Three.js WebGPU
