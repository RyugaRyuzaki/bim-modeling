import * as THREE from "three";
import {Disposable} from "../../types";
import {Components} from "../../Components";
import {Camera} from "./Camera";

/**
 * An infinite grid. Created by
 * [fyrestar](https://github.com/Fyrestar/THREE.InfiniteGridHelper)
 * and translated to typescript by
 * [dkaraush](https://github.com/dkaraush/THREE.InfiniteGridHelper/blob/master/InfiniteGridHelper.ts).
 */
export class Grid implements Disposable {
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

  get cameraControls() {
    return this.camera.cameraControls;
  }
  set setupEvents(active: boolean) {
    if (active) {
      this.cameraControls.addEventListener("update", this.updateZoom);
    } else {
      this.cameraControls.removeEventListener("update", this.updateZoom);
    }
  }
  get grid() {
    return this._grid;
  }
  constructor(
    private components: Components,
    private camera: Camera,
    color = new THREE.Color(0x666666),
    size1 = 1,
    size2 = 10,
    distance = 500
  ) {
    // Source: https://github.com/dkaraush/THREE.InfiniteGridHelper/blob/master/InfiniteGridHelper.ts
    // Author: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)

    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,

      uniforms: {
        uSize1: {
          value: size1,
        },
        uSize2: {
          value: size2,
        },
        uColor: {
          value: color,
        },
        uDistance: {
          value: distance,
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
    this.setupEvents = true;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this.setupEvents = false;
  }

  private updateZoom = () => {
    this.material.uniforms.uZoom.value = this.camera.currentCamera.zoom;
  };
}
