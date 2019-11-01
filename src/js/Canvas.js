import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Canvas {
  constructor(divId, containerId, canRotate = true, isSubview = false) {
    this.divId = divId;
    this.containerId = containerId;
    this.canRotate = canRotate;
    this.isSubview = isSubview;

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

    // Create renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.canvas = document
      .getElementById(this.containerId)
      .appendChild(this.renderer.domElement);
    this.canvas.setAttribute('id', divId);

    // Create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = this.canRotate;
    this.controls.enabled = !this.isSubview;

    // 2D view
    if (!this.canRotate) {
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY
      };
      this.controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      this.camera.position.set(0, 0, 8);
      this.camera.lookAt(0, 0, 0);
      this.controls.screenSpacePanning = true;
      this.controls.panSpeed = 0.5;
    }
    // 3D view
    else {
      this.camera.position.set(0, 4, 8);
      this.camera.lookAt(0, 0, 0);
    }
  }

  addToScene(shape) {
    this.scene.add(shape);
  }

  resetCamera() {
    if (!this.canRotate) {
      this.camera.position.set(0, 0, 8);
      this.camera.lookAt(0, 0, 0);
    } else {
      this.camera.position.set(0, 4, 8);
      this.camera.lookAt(0, 0, 0);
    }
  }

  swapCanvasSize() {
    if (this.isSubview) {
      document
        .getElementById(this.containerId)
        .classList.replace('subview', 'mainview');
      this.isSubview = false;
    } else {
      document
        .getElementById(this.containerId)
        .classList.replace('mainview', 'subview');
      this.isSubview = true;
    }

    this.width = document.getElementById(this.containerId).clientWidth;
    this.height = document.getElementById(this.containerId).clientHeight;

    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);

    this.controls.enabled = !this.isSubview;

    this.resetCamera();
  }

  resize() {
    this.width = document.getElementById(this.containerId).clientWidth;
    this.height = document.getElementById(this.containerId).clientHeight;

    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
  }
}
