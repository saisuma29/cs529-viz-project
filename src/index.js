// Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// D3
import * as d3 from 'd3';

import './css/style.css';

// Custom classes: Canvas, Square, Plane
import { Canvas } from './js/Canvas';
import { Square } from './js/Square';
import { Plane } from './js/Plane';
import { ToggleButton } from './js/ToggleButton';

// CSV data
import csv from './data/data.csv';

const data = {};
const canvas3D = new Canvas('canvas3d', 'div3d', true, false);
const canvas2D = new Canvas('canvas2d', 'div2d', false, true);
const greenSquare = new Square();
const bluePlane = new Plane();
const fps = 30;
const timeRange = document.getElementById('time-range');
var isPlaying = false;
var timer;
var t;

function animate() {
  requestAnimationFrame(animate);

  // Re-render canvases
  canvas3D.renderer.render(canvas3D.scene, canvas3D.camera);
  canvas2D.renderer.render(canvas2D.scene, canvas2D.camera);
}

function playTimelapse() {
  console.log('Start playing..');
  let max = parseInt(timeRange.getAttribute('max')) + 1;
  timer = setInterval(() => {
    t = (parseInt(timeRange.value) + 1) % max;
    timeRange.value = t;
    console.log(t);

    // Rotate green square
    greenSquare.mesh.rotation.x = (Math.PI * t) / (max - 1);
    greenSquare.mesh.rotation.y = (Math.PI * t) / (max - 1);

    // Rotate blue rectangle
    bluePlane.mesh.rotation.z = (Math.PI * t) / (max - 1);
  }, 1000 / fps);
}

function pauseTimelapse() {
  console.log('Pause playing..');
  clearInterval(timer);
}

function run() {
  // Remove loading message
  document.getElementById('loading').remove();

  // Create shapes now that data is loaded
  greenSquare.create(1, 1, 1, 0x00ff00);
  canvas3D.addToScene(greenSquare.mesh);

  bluePlane.create(2, 1, 0x0000ff);
  canvas2D.addToScene(bluePlane.mesh);

  // 3D / 2D Toggle buttons
  for (const element of document.getElementsByClassName('toggle-btn')) {
    // Show button
    element.classList.remove('d-none');

    // Set onclick listener
    element.addEventListener('click', () => {
      // If not already clicked on
      if (!element.classList.contains('active')) {
        canvas3D.swapCanvasSize();
        canvas2D.swapCanvasSize();
      }
    });
  }

  // Play button
  const playBtn = document.getElementById('play-button');
  let play = 'M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28';
  let pause = 'M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26';

  // Set onclick listener
  playBtn.addEventListener('click', e => {
    // Swap animation
    let animation = document.getElementById('animation');
    animation.setAttribute('from', isPlaying ? pause : play);
    animation.setAttribute('to', isPlaying ? play : pause);

    // Begin animation
    animation.beginElement();

    // Toggle isPlaying
    isPlaying = !isPlaying;

    // Play / pause timelapse
    isPlaying ? playTimelapse() : pauseTimelapse();
  });

  // Resize canvas on window resize
  window.onresize = () => {
    canvas3D.resize();
    canvas2D.resize();
  };

  // Begin animation loop
  animate();
}

// Load CSV
d3.csv(csv, row => {
  // Build data object
  data[row['time (s)']] = row;
}).then(() => {
  console.log(data);
  // Run application
  run();
});
