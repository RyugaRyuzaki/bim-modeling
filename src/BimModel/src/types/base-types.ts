import * as THREE from "three";

/**
 * Whether this component has to be manually destroyed once you are done with
 * it to prevent
 * [memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 * This also ensures that the DOM events created by that component will be
 * cleaned up.
 */
export interface Disposable {
  /**
   * Destroys the object from memory to prevent a
   * [memory leak](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
   */
  dispose: () => Promise<void>;
}

/**
 * Whether the geometric representation of this component can be
 * hidden or shown in the
 * [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene).
 */
export interface Hideable {
  /**
   * Whether the geometric representation of this component is
   * currently visible or not in the
   * [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene).
   */
  visible: boolean;
}

/**
 * Whether this component can be resized. The meaning of this can vary depending
 * on the component: resizing a
 * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
 * component could mean changing its resolution, whereas resizing a
 * [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) would change its scale.
 */
export interface Resizeable {
  size: THREE.Vector2;
  /**
   * Sets size of this component (e.g. the resolution of a
   * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
   * component.
   */
  resize: (size?: THREE.Vector2) => void;

  /**
   * Gets the current size of this component (e.g. the resolution of a
   * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
   * component.
   */
  getSize: () => THREE.Vector2;
}

/** Whether this component should be updated each frame. */
export interface Updateable {
  /**
   * Function used to update the state of this component each frame. For
   * instance, a renderer component will make a render each frame.
   */
  update(delta?: number): void;
}

/** Basic type to describe the progress of any kind of process. */
export interface Progress {
  /** The amount of things that have been done already. */
  current: number;

  /** The total amount of things to be done by the process. */
  total: number;
}

/**
 * Whether this component supports create and destroy operations. This generally
 * applies for components that work with instances, such as clipping planes or
 * dimensions.
 */
export interface Createable {
  /** Creates a new instance of an element (e.g. a new Dimension). */
  create: (data: any) => void;

  /**
   * Finish the creation process of the component, successfully creating an
   * instance of whatever the component creates.
   */
  endCreation: (data: any) => void;

  /**
   * Cancels the creation process of the component, going back to the state
   * before starting to create.
   */
  cancelCreation: (data: any) => void;

  /** Deletes an existing instance of an element (e.g. a Dimension). */
  delete: (data: any) => void;
}

/**
 * Whether this component supports to be configured.
 */
export interface Configurable<T extends Record<string, any>> {
  /** Wether this components has been already configured. */
  isSetup: boolean;

  /** Use the provided configuration to setup the tool. */
  setup: (config?: Partial<T>) => Promise<void>;

  /** Object holding the tool configuration. Is not meant to be edited directly, if you need
   * to make changes to this object, use {@link Configurable.setup()} just after the tool is instantiated.
   */
  config: Required<T>;
}
export type FilteredKeys<T> = {
  [K in keyof T]: T[K] extends boolean | number | string ? K : never;
}[keyof T];

export type NonFunctionProps<T> = Pick<T, FilteredKeys<T>>;
