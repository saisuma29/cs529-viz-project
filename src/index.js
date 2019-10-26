// ThreeJS / D3
import * as d3 from 'd3';
import * as THREE from 'three';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

// CSV
import csv from './data/data.csv';

const data = {};

// Load CSV
d3.csv(csv, function(row) {
  // Build data object
  data[row['time (s)']] = row;
})
  // Then run applicarion
  .then(function() {
    console.log(data);

    // Remove loading text
    document.getElementById('loading').remove();

    // Get 3D view width + height
    const width = document.getElementById('app').clientWidth;
    const height = window.innerHeight;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    document.getElementById('app').appendChild(renderer.domElement);

    // Create shape
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    // Begin animation loop
    animate();
  });
