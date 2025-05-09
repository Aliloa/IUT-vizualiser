import * as THREE from "three";
import audioController from "../../utils/AudioController";
import scene from "../Scene";

class Cat {
  constructor() {
    this.group = null;

    this.ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(10, 10, 10);
    scene.scene.add(this.directionalLight);

    scene.gltfLoader.load("/models/cat.glb", (gltf) => {
      this.group = gltf.scene;

      console.log(gltf.scene);

      this.group.traverse((object) => {
        if (object.type === "Mesh") {
          object.material = object.material; 
        }
      });

      this.group.rotation.x = Math.PI / 2;
    });
  }

  update() {
    if (this.group) {
      this.group.rotation.y += 0.001;
      this.group.rotation.z += 0.002;

      const remappedFrequency = audioController.fdata[0] / 255;
      const scale = 0.75 + remappedFrequency;
      this.group.scale.set(scale, scale, scale);
    }

  }
}

export default Cat;
