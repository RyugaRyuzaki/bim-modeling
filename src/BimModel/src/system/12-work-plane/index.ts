/**
 * @module WorkPlaneSystem
 */

import * as THREE from "three";
import {Components} from "@BimModel/src/Components";
import {ToolComponent} from "@BimModel/src/Tool";
import {Component, Disposable} from "@BimModel/src/types";
import {systemGUID} from "../constants";
import {Camera, RendererComponent} from "@BimModel/src/RendererComponent";
export class WorkPlaneSystem extends Component<string> implements Disposable {
  static readonly uuid = systemGUID.workPlane;
  static readonly size1 = 1;
  static readonly size2 = 10;
  static readonly distance = 500;
  static readonly color = new THREE.Color(0x666666);
  enabled = false;
  /** The material of the grid. */
  get material() {
    return this._grid.material as THREE.ShaderMaterial;
  }

  /**
   * Whether the grid should fade away with distance. Recommended to be true for
   * perspective cameras and false for orthographic cameras.
   */
  get fade() {
    return this._fade === 3;
  }

  /**
   * Whether the grid should fade away with distance. Recommended to be true for
   * perspective cameras and false for orthographic cameras.
   */
  set fade(active: boolean) {
    this._fade = active ? 3 : 0;
    this.material.uniforms.uFade.value = this._fade;
  }

  private readonly _grid: THREE.Mesh;
  private _fade = 3;
  set visible(visible: boolean) {
    this._grid.visible = visible;
  }
  get visible() {
    return this._grid.visible;
  }

  get camera() {
    return this.components.tools.get(RendererComponent)!.camera;
  }
  get cameraControls() {
    return this.camera.cameraControls;
  }

  get grid() {
    return this._grid;
  }
  /**
   *
   */
  constructor(components: Components) {
    super(components);
    this.components.tools.add(WorkPlaneSystem.uuid, this);

    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,

      uniforms: {
        uSize1: {
          value: WorkPlaneSystem.size1,
        },
        uSize2: {
          value: WorkPlaneSystem.size2,
        },
        uColor: {
          value: WorkPlaneSystem.color,
        },
        uDistance: {
          value: WorkPlaneSystem.distance,
        },
        uFade: {
          value: this._fade,
        },
        uZoom: {
          value: 1,
        },
      },
      transparent: true,
      vertexShader: `
            
            varying vec3 worldPosition;
            
            uniform float uDistance;
            
            void main() {
            
                    vec3 pos = position.xzy * uDistance;
                    pos.xz += cameraPosition.xz;
                    
                    worldPosition = pos;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            
            }
            `,

      fragmentShader: `
            
            varying vec3 worldPosition;
            
            uniform float uZoom;
            uniform float uFade;
            uniform float uSize1;
            uniform float uSize2;
            uniform vec3 uColor;
            uniform float uDistance;
                
                
                
                float getGrid(float size) {
                
                    vec2 r = worldPosition.xz / size;
                    
                    
                    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                    float line = min(grid.x, grid.y);
                    
                
                    return 1.0 - min(line, 1.0);
                }
                
            void main() {
            
                    
                    float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
                    
                    float g1 = getGrid(uSize1);
                    float g2 = getGrid(uSize2);
                    
                    // Ortho camera fades the grid away when zooming out
                    float minZoom = step(0.2, uZoom);
                    float zoomFactor = pow(min(uZoom, 1.), 2.) * minZoom;
                    
                    gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, uFade));
                    gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2) * zoomFactor;
                    
                    if ( gl_FragColor.a <= 0.0 ) discard;
                    
            
            }
            
            `,

      extensions: {
        derivatives: true,
      },
    });

    this._grid = new THREE.Mesh(geometry, material);
    this._grid.frustumCulled = false;
    this.components.scene.add(this._grid);
  }
  async dispose() {
    this.enabled = false;
    (this._grid.material as THREE.ShaderMaterial).dispose();
    (this._grid.material as any) = null;
    this._grid.geometry.dispose();
  }

  get() {
    return WorkPlaneSystem.uuid;
  }
}
ToolComponent.libraryUUIDs.add(WorkPlaneSystem.uuid);
