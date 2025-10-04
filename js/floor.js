// Floor and reflection setup
import * as THREE from "three/webgpu";
import { uv, texture, reflector, vec3, float } from "three/tsl";

export class Floor {
  constructor(scene) {
    this.scene = scene;
  }

  async setupFloor() {
    const textureLoader = new THREE.TextureLoader();

    const floorColor = await textureLoader.loadAsync(
      "textures/floors/FloorsCheckerboard_S_Diffuse.jpg"
    );
    floorColor.wrapS = THREE.RepeatWrapping;
    floorColor.wrapT = THREE.RepeatWrapping;
    floorColor.colorSpace = THREE.SRGBColorSpace;
    floorColor.repeat.set(15, 15);

    const floorNormal = await textureLoader.loadAsync(
      "textures/floors/FloorsCheckerboard_S_Normal.jpg"
    );
    floorNormal.wrapS = THREE.RepeatWrapping;
    floorNormal.wrapT = THREE.RepeatWrapping;
    floorNormal.repeat.set(15, 15);

    const reflection = this.setupReflection(floorNormal);
    this.createFloor(floorColor, floorNormal, reflection);

    return reflection;
  }

  setupReflection(floorNormal) {
    const floorUV = uv().mul(15);
    const floorNormalOffset = texture(floorNormal, floorUV)
      .xy.mul(2)
      .sub(1)
      .mul(0.02);

    const reflection = reflector({ resolution: 1.0 });
    reflection.target.rotateX(-Math.PI / 2);
    reflection.uvNode = reflection.uvNode.add(floorNormalOffset);

    // Position the reflection target at the floor level
    reflection.target.position.set(0, 0, 0);
    reflection.target.rotation.x = -Math.PI / 2;

    this.scene.add(reflection.target);

    return reflection;
  }

  createFloor(floorColor, floorNormal, reflection) {
    const floorMaterial = new THREE.MeshStandardNodeMaterial();
    const baseColor = vec3(0.1, 0.15, 0.2);
    floorMaterial.colorNode = baseColor;
    floorMaterial.metalnessNode = float(0.9);
    floorMaterial.roughnessNode = float(0.1);
    floorMaterial.normalMap = floorNormal;
    floorMaterial.normalScale.set(0.1, -0.1);

    // Add reflection to the floor material
    floorMaterial.emissiveNode = reflection.mul(1.8);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(50, 0.001, 50),
      floorMaterial
    );
    floor.receiveShadow = true;
    floor.position.y = 0;
    this.scene.add(floor);
  }
}
