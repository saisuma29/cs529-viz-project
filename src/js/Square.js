import * as THREE from 'three';

export class Square {
  create(width, height, depth, color) {
    this.geometry = new THREE.BoxGeometry(width, height, depth);
    this.material = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}
