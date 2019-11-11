import * as d3 from 'd3';

export class Heatmap {
  init(layer0, layer1, layer2, layer3, svgId) {
    
    this.colorScaleP = d3.scaleSequential(d3.interpolateWarm).domain([1.8, 1.6]);
    this.colorScaleG = d3.scaleSequential(d3.interpolateWarm).domain([0.3, 0]);

    this.svg = d3.select(`#${svgId}`);

    this.update(layer0, layer1, layer2, layer3, 0);
  }

  update(layer0, layer1, layer2, layer3, timestamp) {
    var content0 = [];
    var content1 = [];
    var content2 = [];
    var content3 = [];

    var x = 4;
    var y = 4;

    // Clear SVG
    this.svg.html(null);

    for (var j = 0; j < 20; j++) {
      for (var i = 0; i < 20; i++) {
        this.svg
          .append('rect')
          .attr('x', i * x)
          .attr('y', x * 60 + j * y)
          .attr('width', x)
          .attr('height', y)
          .attr('fill', this.colorScaleG(layer0[i + j * 20][timestamp]));
      }
    }
    for (var j = 0; j < 20; j++) {
      for (var i = 0; i < 20; i++) {
        this.svg
          .append('rect')
          .attr('x', i * x)
          .attr('y', x * 40 + j * y)
          .attr('width', x)
          .attr('height', y)
          .attr('fill', this.colorScaleP(layer1[i + j * 20][timestamp]));
      }
    }
    for (var j = 0; j < 20; j++) {
      for (var i = 0; i < 20; i++) {
        this.svg
          .append('rect')
          .attr('x', i * x)
          .attr('y', x * 20 + j * y)
          .attr('width', x)
          .attr('height', y)
          .attr('fill', this.colorScaleG(layer2[i + j * 20][timestamp]));
      }
    }
    for (var j = 0; j < 20; j++) {
      for (var i = 0; i < 20; i++) {
        this.svg
          .append('rect')
          .attr('x', i * x)
          .attr('y', j * y)
          .attr('width', x)
          .attr('height', y)
          .attr('fill', this.colorScaleP(layer3[i + j * 20][timestamp]));
      }
    }
  }
}
