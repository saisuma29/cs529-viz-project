import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class Canvas3D {
  constructor(divId, containerId, isSubview = false) {
    this.divId = divId;
    this.containerId = containerId;
    this.isSubview = isSubview;
    this.canRotate = true;

    this.width = document.getElementById(this.containerId).clientWidth;
    this.height = document.getElementById(this.containerId).clientHeight;

    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(200, 100, 200);
    this.camera.lookAt(0, 0, 0);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;

    this.canvas = document
      .getElementById(this.containerId)
      .appendChild(this.renderer.domElement);
    this.canvas.setAttribute("id", this.divId);

    // Create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = this.canRotate;
    this.controls.enabled = !this.isSubview;
    this.controls.screenSpacePanning = true;
  }

  addToScene(shape) {
    this.scene.add(shape);
  }

  resetCamera() {
    this.camera.position.set(200, 100, 200);
    this.camera.lookAt(0, 0, 0);
  }

  swapCanvasSize() {
    if (this.isSubview) {
      document
        .getElementById(this.containerId)
        .classList.replace("subview", "mainview");

      this.isSubview = false;
    } else {
      document
        .getElementById(this.containerId)
        .classList.replace("mainview", "subview");

      this.isSubview = true;
    }

    this.controls.enabled = !this.isSubview;

    this.resize();

    this.resetCamera();
  }

  resize() {
    if (this.isSubview) {
      this.width = document.getElementById(this.containerId).clientWidth;
      this.height = document.getElementById(this.containerId).clientWidth;

      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
    } else {
      this.width = document.getElementById(this.containerId).clientWidth;
      this.height = document.getElementById(this.containerId).clientHeight;

      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
    }
  }
}
