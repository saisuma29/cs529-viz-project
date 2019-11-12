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
const togglebuttons = new ToggleButtons();
const nodeRanking = new NodeRanking();
const play = new Play();
var layer0, layer1, layer2, layer3;

// Load CSV files
Promise.all([d3.csv(csv0), d3.csv(csv1), d3.csv(csv2), d3.csv(csv3)]).then(
  files => {
    // Save data layers
    layer0 = files[0];
    layer1 = files[1];
    layer2 = files[2];
    layer3 = files[3];

    // Run application
    run();
  }
);

function run() {
  // Remove loading message
  document.getElementById("loading").remove();

  // Create 3D mesh
  mesh3D.init(layer0, layer1, layer2, layer3);
  canvas3D.addToScene(mesh3D.plane0);
  canvas3D.addToScene(mesh3D.plane1);
  canvas3D.addToScene(mesh3D.plane2);
  canvas3D.addToScene(mesh3D.plane3);

  // Create 2D heatmap
  heatmap.init(layer0, layer1, layer2, layer3, canvas2D.divId);
  // canvas2D.addToScene(heatmap.mesh);

  nodeRanking.init(layer0, layer1, layer2, layer3);

  // Enable 3D / 2D toggle buttons
  togglebuttons.init(canvas3D, canvas2D);

  // Enable play button
  play.init([layer0, layer1, layer2, layer3], mesh3D, /* heatmap, */ nodeRanking);

  // Resize canvas on window resize
  window.onresize = () => {
    canvas3D.resize();
    // canvas2D.resize();
  };

  // Begin animation loop
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Re-render canvases
  canvas3D.renderer.render(canvas3D.scene, canvas3D.camera);
  // canvas2D.renderer.render(canvas2D.scene, canvas2D.camera);
}
