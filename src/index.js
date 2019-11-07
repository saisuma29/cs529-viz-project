// Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// D3
import * as d3 from 'd3';

import './css/style.css';

// Custom classes: Canvas, Square, Plane
import { Canvas } from './js/Canvas';
import { Cube } from './js/Cube';
import { Plane } from './js/Plane';
import { ToggleButtons } from './js/ToggleButtons';
import { Play } from './js/Play';

// CSV data
import csv from './data/data.csv';

const canvas3D = new Canvas('canvas3d', 'div3d', true, false);
const canvas2D = new Canvas('canvas2d', 'div2d', false, true);
const greenCube = new Cube();
const bluePlane = new Plane();
const togglebuttons = new ToggleButtons();
const play = new Play();
var data;

// Load CSV files
Promise.all([
  d3.csv(csv)
  // more files..
]).then(files => {
  // Assign to variable
  data = files[0];

  // Run application
  run();
});

function run() {
  // Remove loading message
  document.getElementById('loading').remove();

  // Create shapes now that data is loaded
  greenCube.create(1, 1, 1, 0x00ff00);
  canvas3D.addToScene(greenCube.mesh);

  bluePlane.create(2, 1, 0x0000ff);
  canvas2D.addToScene(bluePlane.mesh);

  // Enable 3D / 2D toggle buttons
  togglebuttons.init(canvas3D, canvas2D);

  // Enable play button
  play.init(greenCube, bluePlane);

  // Resize canvas on window resize
  window.onresize = () => {
    canvas3D.resize();
    canvas2D.resize();
  };

  // Begin animation loop
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Re-render canvases
  canvas3D.renderer.render(canvas3D.scene, canvas3D.camera);
  canvas2D.renderer.render(canvas2D.scene, canvas2D.camera);
}
