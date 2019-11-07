import * as THREE from 'three';

export class Plane {
  create(width, height, color) {
    this.geometry = new THREE.PlaneGeometry(width, height);
    this.material = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  update(t) {
    this.mesh.rotation.z = (Math.PI * t) / (100 - 1);
  }
}
