import * as THREE from 'three';

export class Plane {
  create(width, height, color) {
    this.geometry = new THREE.PlaneGeometry(width, height);
    this.material = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}
