// Bootstrap
import 'bootstrap';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

// D3
import * as d3 from 'd3';

import './css/style.css';

// Custom classes: Canvas, Square, Plane
import { Canvas3D } from './js/Canvas3D';
import { Canvas2D } from './js/Canvas2D';
import { Mesh3D } from './js/Mesh3D';
import { Heatmap } from './js/Heatmap';
import { LoadGrid } from './js/LoadGrid';
import { NodeRanking } from './js/NodeRanking';
import { Histogram } from './js/Histogram';
import { LineChart } from './js/LineChart';
import { ToggleButtons } from './js/ToggleButtons';
import { Legend } from './js/Legend';
import { Play } from './js/Play';

// CSV data
import csv0 from './data/IBM_layer0_nodes_volt_js.csv';
import csv1 from './data/IBM_layer1_nodes_volt_js.csv';
import csv2 from './data/IBM_layer2_nodes_volt_js.csv';
import csv3 from './data/IBM_layer3_nodes_volt_js.csv';
import csv4 from './data/load0.csv';
import csv5 from './data/load1.csv';
import csv6 from './data/power.csv';

const canvas3D = new Canvas3D('canvas3d', 'div3d', false);
const canvas2D = new Canvas2D('canvas2d', 'div2d', true);
const mesh3D = new Mesh3D();
const heatmap = new Heatmap();
const loadGrid = new LoadGrid();
const toggleButtons = new ToggleButtons();
const legend = new Legend();
const nodeRanking = new NodeRanking();
const histogram = new Histogram();
const lineChart = new LineChart();
const play = new Play();
var layers;
var loads;
var power;

// Load CSV files
Promise.all([
  d3.csv(csv0),
  d3.csv(csv1),
  d3.csv(csv2),
  d3.csv(csv3),
  d3.csv(csv4),
  d3.csv(csv5),
  d3.csv(csv6)
]).then(files => {
  // Save data layers
  layers = [files[0], files[1], files[2], files[3]];

  // Save load layers
  loads = [files[4], files[5]];
  
  // Save power data
  power = files[6];

  // Run application
  run();
});

function run() {
  // Remove loading message
  document.getElementById('loading').remove();
  
  // Show tutorial modal
  $('#tutorial-modal').modal('show');

  // Create 3D mesh
  mesh3D.init(layers);
  canvas3D.addToScene(mesh3D.plane0);
  canvas3D.addToScene(mesh3D.plane1);
  canvas3D.addToScene(mesh3D.plane2);
  canvas3D.addToScene(mesh3D.plane3);

  // Create 2D heatmap
  heatmap.init(layers, canvas2D.divId);

  // Create load grids
  loadGrid.init(loads);

  // Create node ranking table
  nodeRanking.init(layers, lineChart);

  // Create histogram
  histogram.init(layers, 'histogram', 'frequency-div');

  // Create line chart
  lineChart.init(layers, 'voltage-linechart', 'voltage-div');

  // Enable 3D / 2D toggle buttons
  toggleButtons.init(canvas3D, canvas2D);

  // Enable play button
  play.init(layers, mesh3D, heatmap, nodeRanking);

  // Resize canvas on window resize
  window.onresize = () => {
    canvas3D.resize();
    canvas2D.resize();
    heatmap.update(layers, play.slider.value);
    lineChart.resize();
    lineChart.update(layers, parseInt(lineChart.nodeInput.value));
    histogram.resize();
    histogram.update(layers, nodeRanking.currentLayer, play.slider.value);
  };

  // 3D / 2D toggle
  // Set onclick listener
  toggleButtons.button2d.addEventListener('click', swapViews);
  toggleButtons.button3d.addEventListener('click', swapViews);
  function swapViews() {
    // If not already clicked on
    if (!this.classList.contains('active')) {
      canvas3D.swapCanvasSize();
      canvas2D.swapCanvasSize();
      heatmap.update(layers, play.slider.value);
    }
  }

  // Layer toggles for rank list
  const layerToggles = document.getElementsByClassName('layer-rank-toggle');
  for (let button of layerToggles) {
    // Set on click listener for each toggle
    button.addEventListener('click', () => {
      // Set layer for node ranking table
      let currentLayer = parseInt(button.dataset.layer);
      nodeRanking.currentLayer = currentLayer;

      // Update to reflect change
      nodeRanking.update(layers, play.slider.value, lineChart);
      histogram.update(layers, currentLayer, play.slider.value);
    });
  }

  // Set play button onclick listener
  play.button.addEventListener('click', () => {
    // Pause timelapse
    if (play.isPlaying) {
      play.pauseTimelapse();
    }
    // Play timelapse
    else {
      play.playTimelapse();

      // Start up play timer
      play.timer = setInterval(() => {
        // Get time + 1
        let t = (parseInt(play.slider.value) + play.timestep) % play.timeLength;
        play.slider.value = t;
        play.timeInput.value = t;

        // Update shapes to new time
        mesh3D.update(layers, t);
        heatmap.update(layers, t);
        nodeRanking.update(layers, t, lineChart);
        histogram.update(layers, nodeRanking.currentLayer, t);
        loadGrid.update(loads, t);
      }, 1000 / play.fps);
    }
  });

  // Set slider input change listener
  play.slider.addEventListener('input', () => {
    // Pause timelapse
    play.pauseTimelapse();

    // Update shapes to current time
    let t = parseInt(play.slider.value) % play.timeLength;
    play.slider.value = t;
    play.timeInput.value = t;

    // Update shapes to new time
    mesh3D.update(layers, t);
    heatmap.update(layers, t);
    nodeRanking.update(layers, t, lineChart);
    histogram.update(layers, nodeRanking.currentLayer, t);
    loadGrid.update(loads, t);
  });

  // Time input
  play.timeInput.addEventListener('input', () => {
    // TODO will break app if invalid input
    play.pauseTimelapse();

    // Update shapes to current time (zero if null input)
    let t =
      play.timeInput.value != ''
        ? parseInt(play.timeInput.value) % play.timeLength
        : 0;

    play.slider.value = t;
    play.timeInput.value = t;

    // Update graphs
    mesh3D.update(layers, t);
    heatmap.update(layers, t);
    nodeRanking.update(layers, t, lineChart);
    histogram.update(layers, nodeRanking.currentLayer, t);
    loadGrid.update(loads, t);
  });

  // Node input change
  lineChart.nodeInput.addEventListener('input', () => {
    // Update shapes to current time (zero if null input)
    let node =
      lineChart.nodeInput.value != ''
        ? parseInt(lineChart.nodeInput.value) %
          lineChart.nodeInput.getAttribute('max')
        : 0;

    lineChart.nodeInput.value = node;
    lineChart.update(layers, node);
  });

  // Begin animation loop
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Re-render canvases
  canvas3D.renderer.render(canvas3D.scene, canvas3D.camera);
  // canvas2D.renderer.render(canvas2D.scene, canvas2D.camera);
}
