import * as THREE from 'three';

export class Cube {
  create(width, height, depth, color) {
    this.geometry = new THREE.BoxGeometry(width, height, depth);
    this.material = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  update(t, max) {
    this.mesh.rotation.x = (Math.PI * t) / (100 - 1);
    this.mesh.rotation.y = (Math.PI * t) / (100 - 1);
  }
}
