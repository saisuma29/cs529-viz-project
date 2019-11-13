import * as d3 from 'd3';

export class Heatmap {
  init(layers, svgId) {
    
    this.colorScaleP = d3.scaleSequential(d3.interpolateWarm).domain([1.8, 1.6]);
    this.colorScaleG = d3.scaleSequential(d3.interpolateWarm).domain([0.3, 0]);

    this.svg = d3.select(`#${svgId}`);

    this.update(layers, 0);
  }

  update(layers, timestamp) {
    var content0 = [];
    var content1 = [];
    var content2 = [];
    var content3 = [];

    var x = 8;
    var y = 8;

    // Clear SVG
    this.svg.html(null);

    for (var j = 0; j < 10; j++) {
      for (var i = 0; i < 10; i++) {
        this.svg
          .append('rect')
          .attr('x', i * x)
          .attr('y', x * 30 + j * y)
          .attr('width', x)
          .attr('height', y)
          .attr('fill', this.colorScaleG(layers[0][i + j * 10][timestamp]));
      }
    }
    for (var j = 0; j < 10; j++) {
      for (var i = 0; i < 10; i++) {
        this.svg
          .append('rect')
          .attr('x', i * x)
          .attr('y', x * 20 + j * y)
          .attr('width', x)
          .attr('height', y)
          .attr('fill', this.colorScaleP(layers[1][i + j * 10][timestamp]));
      }
    }
    for (var j = 0; j < 10; j++) {
      for (var i = 0; i < 10; i++) {
        this.svg
          .append('rect')
          .attr('x', i * x)
          .attr('y', x * 10 + j * y)
          .attr('width', x)
          .attr('height', y)
          .attr('fill', this.colorScaleG(layers[2][i + j * 10][timestamp]));
      }
    }
    for (var j = 0; j < 10; j++) {
      for (var i = 0; i < 10; i++) {
        this.svg
          .append('rect')
          .attr('x', i * x)
          .attr('y', j * y)
          .attr('width', x)
          .attr('height', y)
          .attr('fill', this.colorScaleP(layers[3][i + j * 10][timestamp]));
      }
    }
  }
}
