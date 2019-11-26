import * as d3 from 'd3';

export class LineChart {
  init(layers, divId, containerId) {
    this.divId = divId;
    this.containerDiv = document.getElementById(containerId);
    this.nodeInput = document.getElementById('node-input');
    this.nodeInput.setAttribute('max', layers[0].length);

    this.margin = { top: 20, right: 50, bottom: 50, left: 50 };
    this.width =
      this.containerDiv.clientWidth - this.margin.left - this.margin.right;
    this.height =
      this.containerDiv.clientHeight / 2 - this.margin.top - this.margin.bottom;

    this.svgP = d3
      .select(this.containerDiv)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.svgG = d3
      .select(this.containerDiv)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.update(layers, 0);
  }

  update(layers, node) {
    this.svgP
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
    let valuesP = Object.values(layers[3][node]);
    let valuesG = Object.values(layers[2][node]);

    // X scale
    let xScale = d3
      .scaleLinear()
      .domain([0, 1000]) // input
      .range([0, this.width]); // output

    let yDomainP = [1.5, 1.8];
    let colorP = 'violet';

    let yDomainG = [-0.1, 0.2];
    let colorG = 'yellow';

    // Y scale
    let yScaleP = d3
      .scaleLinear()
      .domain(yDomainP) // input
      .range([this.height, 0]); // output

    let yScaleG = d3
      .scaleLinear()
      .domain(yDomainG) // input
      .range([this.height, 0]); // output

    // Clear out SVG
    this.svgP.html(null);
    this.svgG.html(null);

    // Power
    // Call the x axis in a group tag
    this.svgP
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // Call the y axis in a group tag
    this.svgP
      .append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScaleP).ticks(4)); // Create an axis component with d3.axisLeft

    // Add line
    this.svgP
      .append('path')
      .datum(valuesP)
      .attr('fill', 'none')
      .attr('stroke', colorP)
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xScale(i);
          })
          .y(function(d, i) {
            return yScaleP(d);
          })
      );

    // Ground
    // Call the x axis in a group tag
    this.svgG
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // Call the y axis in a group tag
    this.svgG
      .append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScaleG).ticks(4)); // Create an axis component with d3.axisLeft

    // Add line
    this.svgG
      .append('path')
      .datum(valuesG)
      .attr('fill', 'none')
      .attr('stroke', colorG)
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xScale(i);
          })
          .y(function(d, i) {
            return yScaleG(d);
          })
      );
  }

  resize() {
    this.width =
      this.containerDiv.clientWidth - this.margin.left - this.margin.right;
    this.height =
      this.containerDiv.clientHeight / 2 - this.margin.top - this.margin.bottom;

    this.svgP
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.svgG
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
  }
}
