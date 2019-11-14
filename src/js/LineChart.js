import * as d3 from 'd3';

export class LineChart {
  init(layers, divId, containerId) {
    this.divId = divId;
    this.containerId = containerId;
    this.nodeInput = document.getElementById('node-input');
    this.nodeInput.setAttribute('max', layers[0].length);

    this.margin = { top: 20, right: 50, bottom: 50, left: 50 };
    this.width =
      document.getElementById(containerId).clientWidth -
      this.margin.left -
      this.margin.right;
    this.height =
      document.getElementById(containerId).clientHeight -
      this.margin.top -
      this.margin.bottom;

    this.svg = d3
      .select(`#${containerId}`)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.update(layers, 1, 56);
  }

  update(layers, currentLayer, node) {
    var values = Object.values(layers[currentLayer][node]);

    // X scale
    var xScale = d3
      .scaleLinear()
      .domain([0, 1000]) // input
      .range([0, this.width]); // output

    // Y domain depending on layer
    if (currentLayer == 1 || currentLayer == 3) {
      var yDomain = [1.5, 1.8];
      var color = 'lightgreen';
    } else {
      var yDomain = [-0.1, 0.2];
      var color = 'yellow';
    }

    // Y scale
    var yScale = d3
      .scaleLinear()
      .domain(yDomain) // input
      .range([this.height, 0]); // output

    // Clear out SVG
    this.svg.html(null);

    // Call the x axis in a group tag
    this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // Call the y axis in a group tag
    this.svg
      .append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale).ticks(5)); // Create an axis component with d3.axisLeft

    // Add line
    this.svg
      .append('path')
      .datum(values)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xScale(i);
          })
          .y(function(d, i) {
            return yScale(values[i]);
          })
      );
  }
}
