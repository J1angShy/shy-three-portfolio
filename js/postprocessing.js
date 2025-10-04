// Post-processing effects
import * as THREE from "three/webgpu";
import {
  abs,
  blendOverlay,
  color,
  float,
  Fn,
  instancedBufferAttribute,
  materialColor,
  max,
  normalWorldGeometry,
  pass,
  positionGeometry,
  positionLocal,
  pow2,
  reflector,
  screenUV,
  sin,
  sub,
  texture,
  time,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";
import { gaussianBlur } from "three/addons/tsl/display/GaussianBlurNode.js";

export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.postProcessing = null;
  }

  setup() {
    const scenePass = pass(this.scene, this.camera);
    const scenePassColor = scenePass.getTextureNode();
    const scenePassDepth = scenePass.getLinearDepthNode().remapClamp(0.3, 0.7);

    const scenePassColorBlurred = gaussianBlur(scenePassColor);
    scenePassColorBlurred.directionNode = scenePassDepth;

    const vignette = screenUV
      .distance(0.5)
      .mul(1.25)
      .clamp()
      .oneMinus()
      .sub(0.2);

    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputNode = blendOverlay(
      scenePassColorBlurred,
      vignette
    );

    // Ensure the post-processing includes all scene elements including reflections
    this.postProcessing.needsUpdate = true;
  }

  render() {
    if (this.postProcessing) {
      this.postProcessing.render();
    }
  }
}
