// Bootstrap
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// D3
import * as d3 from "d3";

import "./css/style.css";

// Custom classes: Canvas, Square, Plane
import { Canvas3D } from "./js/Canvas3D";
import { Canvas2D } from "./js/Canvas2D";
import { Mesh3D } from "./js/Mesh3D";
import { Heatmap } from "./js/Heatmap";
import { NodeRanking } from "./js/NodeRanking";
import { Histogram } from "./js/Histogram";
import { ToggleButtons } from "./js/ToggleButtons";
import { Play } from "./js/Play";

// CSV data
import csv0 from "./data/IBM_layer0_nodes_volt_js.csv";
import csv1 from "./data/IBM_layer1_nodes_volt_js.csv";
import csv2 from "./data/IBM_layer2_nodes_volt_js.csv";
import csv3 from "./data/IBM_layer3_nodes_volt_js.csv";

const canvas3D = new Canvas3D("canvas3d", "div3d", false);
const canvas2D = new Canvas2D("canvas2d", "div2d", true);
const mesh3D = new Mesh3D();
const heatmap = new Heatmap();
const toggleButtons = new ToggleButtons();
const nodeRanking = new NodeRanking();
const histogram = new Histogram();
const play = new Play();
var layers;

// Load CSV files
Promise.all([d3.csv(csv0), d3.csv(csv1), d3.csv(csv2), d3.csv(csv3)]).then(
  files => {
    // Save data layers
    layers = files;

    // Run application
    run();
  }
);

function run() {
  // Remove loading message
  document.getElementById("loading").remove();

  // Create 3D mesh
  mesh3D.init(layers);
  canvas3D.addToScene(mesh3D.plane0);
  canvas3D.addToScene(mesh3D.plane1);
  canvas3D.addToScene(mesh3D.plane2);
  canvas3D.addToScene(mesh3D.plane3);

  // Create 2D heatmap
  heatmap.init(layers, canvas2D.divId);

  // Create node ranking table
  nodeRanking.init(layers);

  // Create voltage histogram
  histogram.init(layers, "histogram", "frequency-div");

  // Enable 3D / 2D toggle buttons
  toggleButtons.init(canvas3D, canvas2D);

  // Enable play button
  play.init(layers, mesh3D, heatmap, nodeRanking);

  // Resize canvas on window resize
  window.onresize = () => {
    canvas3D.resize();
    canvas2D.resize();
  };

  // Layer toggles for rank list
  const layerRankButtons = document.getElementsByClassName("layer-rank-toggle");
  for (let button of layerRankButtons) {
    // Set on click listener for each toggle
    button.addEventListener("click", () => {
      // Set layer for node ranking table
      let index = parseInt(button.dataset.layer);
      nodeRanking.currentLayer = index;

      // Update to reflect change
      nodeRanking.update(layers, play.slider.value);
    });
  }

  // Time input
  play.timeInput.addEventListener("input", () => {
    // TODO will break app if invalid input
    play.pauseTimelapse();

    // Update shapes to current time
    let t = parseInt(play.timeInput.value) % play.timeLength;
    play.slider.value = t;
    play.timeInput.value = t;

    for (let shape of [mesh3D, heatmap, nodeRanking]) {
      shape.update(layers, t);
    }
  });

  histogram.updateButton.addEventListener("click", () => {
    let currentLayer = nodeRanking.currentLayer;
    let t = play.slider.value;
    histogram.update(layers[currentLayer], currentLayer, t);
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
