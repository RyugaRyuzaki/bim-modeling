import * as THREE from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {N8AOPass} from "n8ao";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import {CustomEffectsPass} from "./src";
import {Camera} from "../Camera";

// source: https://discourse.threejs.org/t/how-to-render-full-outlines-as-a-post-process-tutorial/22674

export class PostProduction {
  excludedItems = new Set<THREE.Object3D>();

  private composer?: any;

  private _enabled = false;
  private _initialized = false;

  private _n8ao?: any;
  private _customEffects?: CustomEffectsPass;
  private _basePass?: RenderPass;
  private _gammaPass?: ShaderPass;
  private _depthTexture?: THREE.DepthTexture;

  private _renderTarget?: THREE.WebGLRenderTarget;

  get basePass() {
    if (!this._basePass) {
      throw new Error("Custom effects not initialized!");
    }
    return this._basePass;
  }

  get gammaPass() {
    if (!this._gammaPass) {
      throw new Error("Custom effects not initialized!");
    }
    return this._gammaPass;
  }

  get customEffects() {
    if (!this._customEffects) {
      throw new Error("Custom effects not initialized!");
    }
    return this._customEffects;
  }

  get n8ao() {
    if (!this._n8ao) {
      throw new Error("Custom effects not initialized!");
    }
    return this._n8ao;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(active) {
    if (!this._initialized) {
      this.initialize();
    }
    this._enabled = active;
  }

  constructor(
    private scene: THREE.Scene,
    private camera: Camera,
    private renderer: THREE.WebGLRenderer
  ) {
    this.initComposer();
  }

  dispose() {
    this._renderTarget?.dispose();
    this._depthTexture?.dispose();
    this._customEffects?.dispose();
    this._gammaPass?.dispose();
    this._n8ao?.dispose();
    this.excludedItems.clear();
    this.visible = false;
    this.enabled = false;
  }
  private initComposer() {
    const {width, height} = this.renderer.domElement.getBoundingClientRect();
    this._renderTarget = new THREE.WebGLRenderTarget(width, height);
    this._renderTarget.texture.colorSpace = "srgb-linear";
    this.composer = new EffectComposer(this.renderer, this._renderTarget);
    this.composer.setSize(width, height);
  }
  setSize() {
    if (this._initialized) {
      const {width, height} = this.renderer.domElement.getBoundingClientRect();
      this.composer?.setSize(width, height);
      this.basePass.setSize(width, height);
      this.n8ao.setSize(width, height);
      this.customEffects.setSize(width, height);
      this.gammaPass.setSize(width, height);
    }
  }

  update() {
    if (!this._enabled) return;
    this.composer?.render();
  }

  updateCamera() {
    // const camera = this.components.camera.get();
    if (this._n8ao) {
      this._n8ao.camera = this.camera.currentCamera;
    }
    if (this._customEffects) {
      this._customEffects.renderCamera = this.camera.currentCamera;
    }
    if (this._basePass) {
      this._basePass.camera = this.camera.currentCamera;
    }
  }

  initialize() {
    const {width, height} = this.renderer.domElement.getBoundingClientRect();
    const size = new THREE.Vector2(width, height);
    this.newBasePass();
    this.newSaoPass(size);
    this.newGammaPass();
    this.newCustomPass(size);
    this._initialized = true;
    this.updatePasses();
  }

  updateProjection() {
    this.composer?.passes.forEach((pass: any) => {
      pass.camera = this.camera.currentCamera;
    });
    this.update();
  }

  visible = false;

  updatePasses() {
    for (const pass of this.composer?.passes) {
      this.composer?.removePass(pass);
    }
    if (this._basePass) {
      this.composer?.addPass(this.basePass);
    }
    this.composer?.addPass(this.gammaPass);
    this.composer?.addPass(this.n8ao);
    this.composer?.addPass(this.customEffects);
  }

  newCustomPass(size: THREE.Vector2) {
    this._customEffects = new CustomEffectsPass(
      size,
      this.scene,
      this.camera.currentCamera
    );
  }

  newGammaPass() {
    this._gammaPass = new ShaderPass(GammaCorrectionShader);
    this._gammaPass.renderToScreen = true;
    // add this line
    this._gammaPass.material.transparent = true;
  }

  newSaoPass(size: THREE.Vector2) {
    this._n8ao = new N8AOPass(
      this.scene,
      this.camera.currentCamera,
      size.x,
      size.y
    );
    // this.composer.addPass(this.n8ao);
    const {configuration} = this._n8ao;
    configuration.aoSamples = 16;
    configuration.denoiseSamples = 1;
    configuration.denoiseRadius = 13;
    configuration.aoRadius = 1;
    configuration.distanceFalloff = 4;
    configuration.intensity = 4;
    configuration.halfRes = true;
    configuration.color = new THREE.Color().setHex(0xcccccc, "srgb-linear");
  }

  newBasePass() {
    this._basePass = new RenderPass(this.scene, this.camera.currentCamera);
  }
}
