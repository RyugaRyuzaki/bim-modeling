import fontJSON from "./droid_sans_bold.typeface.json";
import {
  BoxGeometry,
  EdgesGeometry,
  LineSegments,
  Mesh,
  RingGeometry,
  Scene,
} from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import {CubeMapMaterial} from "./CubeMapMaterial";
// this class create all item of box cube view
/**
 * @param {Object three JS} scene
 * @param {class or object} material => material manager
 */
export class BoxCube {
  private loader: FontLoader = new FontLoader();
  private font!: any;
  constructor(private scene: Scene, private materials: CubeMapMaterial) {
    // load font json
    this.font = this.loader.parse(fontJSON);
    // create 24 meshes
    this.initItem("left", 96, 96, 16, 0, 0, 56);
    this.initTextSide("L", -20, -24, 64);
    this.initItem("right", 96, 96, 16, 0, 0, -56);
    this.initTextSide("R", -30, -24, 64);

    this.initItem("top", 96, 16, 96, 0, 56, 0);
    this.initTextSide("T", -20, -24, 64);

    this.initItem("bottom", 96, 16, 96, 0, -56, 0);
    this.initTextSide("BO", -55, -24, 64);

    this.initItem("front", 16, 96, 96, 56, 0, 0);
    this.initTextSide("F", -30, -24, 64);
    this.initItem("back", 16, 96, 96, -56, 0, 0);
    this.initTextSide("B", -30, -24, 64);

    this.initTextRing("W", "left", -32, -62, 105);
    this.initTextRing("E", "right", -16, -62, -105);
    this.initTextRing("N", "back", -105, -62, 20);
    this.initTextRing("S", "front", 105, -62, 20);

    this.initItem("left_front", 16, 96, 16, 56, 0, 56);
    this.initItem("left_back", 16, 96, 16, -56, 0, 56);
    this.initItem("right_front", 16, 96, 16, 56, 0, -56);
    this.initItem("right_back", 16, 96, 16, -56, 0, -56);

    this.initItem("top_left", 96, 16, 16, 0, 56, 56);
    this.initItem("top_right", 96, 16, 16, 0, 56, -56);
    this.initItem("top_front", 16, 16, 96, 56, 56, 0);
    this.initItem("top_back", 16, 16, 96, -56, 56, 0);

    this.initItem("bottom_left", 96, 16, 16, 0, -56, 56);
    this.initItem("bottom_right", 96, 16, 16, 0, -56, -56);
    this.initItem("bottom_front", 16, 16, 96, 56, -56, 0);
    this.initItem("bottom_back", 16, 16, 96, -56, -56, 0);

    this.initItem("top_left_front", 16, 16, 16, 56, 56, 56);
    this.initItem("top_left_back", 16, 16, 16, -56, 56, 56);
    this.initItem("top_right_front", 16, 16, 16, 56, 56, -56);
    this.initItem("top_right_back", 16, 16, 16, -56, 56, -56);

    this.initItem("bottom_left_front", 16, 16, 16, 56, -56, 56);
    this.initItem("bottom_left_back", 16, 16, 16, -56, -56, 56);
    this.initItem("bottom_right_front", 16, 16, 16, 56, -56, -56);
    this.initItem("bottom_right_back", 16, 16, 16, -56, -56, -56);
    this.initRing();
    this.initOutLine();
  }
  /**
   * release memories
   */

  dispose() {
    this.scene.children.forEach((child: any) => {
      if (child.userData.dispose) BoxCube.disposeItem(child);
    });
  }
  //
  /**
   *
   * @param {*} item
   */
  static disposeItem(item: Mesh) {
    item.geometry.dispose();
    item.removeFromParent();
  }
  /**
   *
   * @param {*} name
   * @param {*} x0
   * @param {*} y0
   * @param {*} z0
   * @param {*} x1
   * @param {*} y1
   * @param {*} z1
   * @returns
   */
  initItem(
    name: string,
    x0: number,
    y0: number,
    z0: number,
    x1: number,
    y1: number,
    z1: number
  ) {
    const geometry = new BoxGeometry(x0, y0, z0);
    geometry.translate(x1, y1, z1);
    const mesh = new Mesh(geometry, this.materials.normalCube);
    mesh.userData.Element = true;
    mesh.userData.dispose = true;
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
  }
  /**
   *
   * @returns
   */
  initRing() {
    const geometry = new RingGeometry(100, 160, 30);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, -65, 0);
    const mesh = new Mesh(geometry, this.materials.ringCube);
    mesh.userData.dispose = true;
    this.scene.add(mesh);
    return mesh;
  }
  /**
   *
   * @returns
   */
  initOutLine() {
    const geometry = new BoxGeometry(128, 128, 128);
    const edges = new EdgesGeometry(geometry);
    const outLine = new LineSegments(edges, this.materials.outLineCube);
    outLine.userData.OutLine = true;
    outLine.userData.dispose = true;

    this.scene.add(outLine);
    return outLine;
  }
  /**
   *
   * @param {*} scene
   * @param {*} name
   * @param {*} x1
   * @param {*} y1
   * @param {*} z1
   * @returns
   */
  initTextSide(name: string, x1: number, y1: number, z1: number) {
    const parameters = {
      font: this.font,
      size: 60,
      depth: 2,
    };
    const textCube = new TextGeometry(name, parameters);
    textCube.translate(x1, y1, z1);
    this.rotateTextCube(name, textCube);
    const meshCube = new Mesh(textCube, this.materials.textCube);
    meshCube.userData.dispose = true;
    this.scene.add(meshCube);
    return meshCube;
  }
  /**
   *
   * @param {*} name
   * @param {*} textCube
   */
  rotateTextCube(name: string, textCube: TextGeometry) {
    switch (name) {
      case "L":
        break;
      case "R":
        textCube.rotateY(Math.PI);
        break;
      case "T":
        textCube.rotateY(Math.PI / 2);
        textCube.rotateZ(Math.PI / 2);
        break;
      case "BO":
        textCube.rotateX(Math.PI / 2);
        break;
      case "F":
        textCube.rotateY(Math.PI / 2);
        break;
      case "B":
        textCube.rotateY(-Math.PI / 2);
        break;
      default:
        break;
    }
  }
  /**
   *
   * @param {*} scene
   * @param {*} name
   * @param {*} nameText
   * @param {*} x1
   * @param {*} y1
   * @param {*} z1
   * @returns
   */
  initTextRing(
    name: string,
    nameText: string,
    x1: number,
    y1: number,
    z1: number
  ) {
    const parameters = {
      font: this.font,
      size: 40,
      depth: 2,
    };
    const textCube = new TextGeometry(name, parameters);
    this.rotateRing(name, textCube);
    textCube.translate(x1, y1, z1);
    const meshCube = new Mesh(textCube, this.materials.textRing);
    meshCube.name = nameText;
    meshCube.userData.dispose = true;
    meshCube.userData.Element = true;
    this.scene.add(meshCube);
    return meshCube;
  }
  /**
   *
   * @param {*} name
   * @param {*} textCube
   */
  rotateRing(name: string, textCube: TextGeometry) {
    switch (name) {
      case "W":
        textCube.rotateX(Math.PI / 2);
        break;
      case "E":
        textCube.rotateX(-Math.PI / 2);
        break;
      case "S":
        textCube.rotateY(Math.PI / 2);
        textCube.rotateZ(-Math.PI / 2);
        break;
      case "N":
        textCube.rotateY(Math.PI / 2);
        textCube.rotateZ(Math.PI / 2);
        break;
      default:
        break;
    }
  }
}
