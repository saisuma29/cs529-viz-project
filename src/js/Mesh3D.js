import * as d3 from 'd3';
import * as THREE from 'three';

export class Mesh3D {
  init(layers) {
    // initialize objects
    this.planeMaterial = this.getMaterial('basic', 'rgb(255, 255, 255)');

    this.plane0 = this.getPlane(this.planeMaterial, 10, 0);
    this.plane1 = this.getPlane(this.planeMaterial, 10, 2);
    this.plane2 = this.getPlane(this.planeMaterial, 10, 4);
    this.plane3 = this.getPlane(this.planeMaterial, 10, 6);

    this.plane0.name = 'plane-0';
    this.plane1.name = 'plane-1';
    this.plane2.name = 'plane-2';
    this.plane3.name = 'plane-3';

    // Set initial geometry from timestamp 0
    this.update(layers, 0);
  }

  getPlane(material, size, Z) {
    // var geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    var geometry = new THREE.Geometry();

    var scale_grid = 20;
    for (var j = 0; j < size; j++) {
      for (var i = 0; i < size; i++) {
        geometry.vertices.push(
          new THREE.Vector3(i * scale_grid, Z, j * scale_grid)
        );
      }
    }

    for (var i = 0; i < size - 1; i++) {
      for (var j = 0; j < size - 1; j++) {
        geometry.faces.push(
          new THREE.Face3(i + j * size, i + 1 + j * size, i + size + j * size)
        );
        geometry.faces.push(
          new THREE.Face3(
            i + 1 + j * size,
            i + 1 + size + j * size,
            i + size + j * size
          )
        );
      }
    }

    // Center geometry
    geometry.center();

    material.side = THREE.DoubleSide;

    var plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.castShadow = true;
    return plane;
  }

  getMaterial(type, color) {
    var selectedMaterial;
    var materialOptions = {
      color: color === undefined ? 'rgb(255, 255, 255)' : color,
      wireframe: true
    };
    switch (type) {
      case 'basic':
        // selectedMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors } );
        selectedMaterial = new THREE.MeshBasicMaterial({
          vertexColors: THREE.VertexColors
        });

        break;
      case 'lambert':
        selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
        break;
      case 'phong':
        selectedMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          vertexColors: THREE.FaceColors
        });

        //selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
        break;
      case 'standard':
        selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
        break;
      default:
        selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
        break;
    }
    return selectedMaterial;
  }

  update(layers, timestamp) {
    // console.log(timestamp);
    // ------------------------------------------
    var planeGeo0 = this.plane0.geometry;
    var planeGeo1 = this.plane1.geometry;
    var planeGeo2 = this.plane2.geometry;
    var planeGeo3 = this.plane3.geometry;
    // ------------------------------------------
    var colorScaleP = d3.scaleSequential(d3.interpolateWarm).domain([1.8, 1.6]);
    var colorScaleG = d3.scaleSequential(d3.interpolateWarm).domain([0.3, 0]);

    // Update the geometry of the mesh
    for (var i = 0; i < 100; i++) {
      // Ordered top to bottom based on view location
      planeGeo3.vertices[i].y = layers[3][i][timestamp] * 50 - 20;   // P
      planeGeo2.vertices[i].y = layers[2][i][timestamp] * 50 + 25;   // G
      planeGeo1.vertices[i].y = layers[1][i][timestamp] * 50 - 95;   // P
      planeGeo0.vertices[i].y = layers[0][i][timestamp] * 50 - 50;   // G
    }

    // Update the color of faces to average of face edges
    // Layer 3
    for (var i = 0; i < planeGeo3.faces.length; i++) {
      var a = parseFloat(layers[3][planeGeo3.faces[i].a][timestamp]);
      var b = parseFloat(layers[3][planeGeo3.faces[i].b][timestamp]);
      var c = parseFloat(layers[3][planeGeo3.faces[i].c][timestamp]);
      var ave = (a + b + c) / 3;
      var color = colorScaleP(ave);
      planeGeo3.faces[i].color.set(color);
    }
    // Layer 2
    for (var i = 0; i < planeGeo2.faces.length; i++) {
      var a = parseFloat(layers[2][planeGeo2.faces[i].a][timestamp]);
      var b = parseFloat(layers[2][planeGeo2.faces[i].b][timestamp]);
      var c = parseFloat(layers[2][planeGeo2.faces[i].c][timestamp]);
      var ave = (a + b + c) / 3;
      var color = colorScaleG(ave);
      planeGeo2.faces[i].color.set(color);
    }
    // Layer 1
    for (var i = 0; i < planeGeo1.faces.length; i++) {
      var a = parseFloat(layers[1][planeGeo1.faces[i].a][timestamp]);
      var b = parseFloat(layers[1][planeGeo1.faces[i].b][timestamp]);
      var c = parseFloat(layers[1][planeGeo1.faces[i].c][timestamp]);
      var ave = (a + b + c) / 3;
      var color = colorScaleP(ave);
      planeGeo1.faces[i].color.set(color);
    }
    // Layer 0
    for (var i = 0; i < planeGeo0.faces.length; i++) {
      var a = parseFloat(layers[0][planeGeo0.faces[i].a][timestamp]);
      var b = parseFloat(layers[0][planeGeo0.faces[i].b][timestamp]);
      var c = parseFloat(layers[0][planeGeo0.faces[i].c][timestamp]);
      var ave = (a + b + c) / 3;
      var color = colorScaleG(ave);
      planeGeo0.faces[i].color.set(color);
    }
    // }
    // console.log(planeGeo)
    planeGeo0.colorsNeedUpdate = true;
    planeGeo1.colorsNeedUpdate = true;
    planeGeo2.colorsNeedUpdate = true;
    planeGeo3.colorsNeedUpdate = true;

    // console.log(planeGeo.colorsNeedUpdate)

    planeGeo0.verticesNeedUpdate = true;
    planeGeo1.verticesNeedUpdate = true;
    planeGeo2.verticesNeedUpdate = true;
    planeGeo3.verticesNeedUpdate = true;
  }
}
