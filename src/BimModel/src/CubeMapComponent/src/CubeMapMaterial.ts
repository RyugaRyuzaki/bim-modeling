import * as THREE from "three";

export class CubeMapMaterial {
  listMaterial: Map<
    string,
    THREE.MeshLambertMaterial | THREE.MeshBasicMaterial
  > = new Map();
  get normalCube() {
    return this.listMaterial.get("normalCube");
  }
  get hoverCube() {
    return this.listMaterial.get("hoverCube");
  }
  get textCube() {
    return this.listMaterial.get("textCube");
  }
  get ringCube() {
    return this.listMaterial.get("ringCube");
  }
  get textRing() {
    return this.listMaterial.get("textRing");
  }
  get outLineCube() {
    return this.listMaterial.get("outLineCube");
  }
  /**
   *
   */
  constructor() {
    this.init();
  }
  async dispose() {
    for (const [_, mat] of this.listMaterial) {
      mat.dispose();
    }
    this.listMaterial.clear();
  }
  private init() {
    const normalCube = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 1,
      color: new THREE.Color("rgb(204, 219, 219)"),
      depthTest: true,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
    const hoverCube = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 1,
      color: "green",
      depthTest: true,
    });
    const textCube = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.7,
      color: "blue",
      depthTest: true,
    });
    const ringCube = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.3,
      color: "blue",
      side: THREE.DoubleSide,
      depthWrite: true,
      depthTest: true,
    });
    const textRing = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 1,
      color: "red",
      side: THREE.DoubleSide,
      depthWrite: true,
      depthTest: true,
    });
    const outLineCube = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
      color: "black",
      side: THREE.DoubleSide,
      depthWrite: true,
      depthTest: true,
    });
    this.addMaterial("normalCube", normalCube);
    this.addMaterial("hoverCube", hoverCube);
    this.addMaterial("textCube", textCube);
    this.addMaterial("ringCube", ringCube);
    this.addMaterial("textRing", textRing);
    this.addMaterial("outLineCube", outLineCube);
  }
  private addMaterial(
    name: string,
    mat: THREE.MeshLambertMaterial | THREE.MeshBasicMaterial
  ) {
    if (this.listMaterial.has(name))
      throw new Error("Material's name is existed!");
    this.listMaterial.set(name, mat);
  }
}
