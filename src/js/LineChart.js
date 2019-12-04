import * as d3 from 'd3';

export class LineChart {
  init(layers, divId, containerId) {
    this.divId = divId;
    this.containerDiv = document.getElementById(containerId);
    this.nodeInput = document.getElementById('node-input');
    this.nodeInput.setAttribute('max', layers[0].length);

    this.margin = { top: 20, right: 50, bottom: 50, left: 100 };
    this.width = this.containerDiv.clientWidth / 2;
    this.height = this.containerDiv.clientHeight / 2;

    this.svg3 = d3
      .select(this.containerDiv)
      .append('svg')
      .attr('class', 'linechart-svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(0,-5)');

    this.svg2 = d3
      .select(this.containerDiv)
      .append('svg')
      .attr('class', 'linechart-svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(0,-5)');

    this.svg1 = d3
      .select(this.containerDiv)
      .append('svg')
      .attr('class', 'linechart-svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(0,-10)');

    this.svg0 = d3
      .select(this.containerDiv)
      .append('svg')
      .attr('class', 'linechart-svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(0,-10)');

    let values3 = Object.values(layers[3][0]);
    let values2 = Object.values(layers[2][0]);
    let values1 = Object.values(layers[1][0]);
    let values0 = Object.values(layers[0][0]);

    let yDomain3 = [1.6, 1.8];
    let yDomain2 = [0, 0.2];
    let yDomain1 = [1.6, 1.8];
    let yDomain0 = [0, 0.2];

    this.xScale = d3
      .scaleLinear()
      .domain([0, 1000])
      .range([
        this.margin.left,
        this.width - this.margin.left + this.margin.right
      ]);

    this.yScale3 = d3
      .scaleLinear()
      .domain(yDomain3)
      .range([this.height - this.margin.bottom, this.margin.top]);
    this.yScale2 = d3
      .scaleLinear()
      .domain(yDomain2)
      .range([this.height - this.margin.bottom, this.margin.top]);
    this.yScale1 = d3
      .scaleLinear()
      .domain(yDomain1)
      .range([this.height - this.margin.bottom, this.margin.top]);
    this.yScale0 = d3
      .scaleLinear()
      .domain(yDomain0)
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.svg3
      .append('g')
      .append('circle')
      .attr('class', 'point')
      .attr('fill', 'violet')
      .attr('cx', this.xScale(0))
      .attr('cy', this.yScale3(values3[0]))
      .attr('r', function(d) {
        return 7;
      });

    this.svg2
      .append('g')
      .append('circle')
      .attr('class', 'point')
      .attr('fill', 'yellow')
      .attr('cx', this.xScale(0))
      .attr('cy', this.yScale2(values2[0]))
      .attr('r', function(d) {
        return 7;
      });

    this.svg1
      .append('g')
      .append('circle')
      .attr('class', 'point')
      .attr('fill', 'violet')
      .attr('cx', this.xScale(0))
      .attr('cy', this.yScale1(values1[0]))
      .attr('r', function(d) {
        return 7;
      });

    this.svg0
      .append('g')
      .append('circle')
      .attr('class', 'point')
      .attr('fill', 'yellow')
      .attr('cx', this.xScale(0))
      .attr('cy', this.yScale0(values0[0]))
      .attr('r', function(d) {
        return 7;
      });

    var xfunc = this.xScale;
    var yfunc3 = this.yScale3;
    var yfunc2 = this.yScale2;
    var yfunc1 = this.yScale1;
    var yfunc0 = this.yScale0;

    // Add line
    this.svg3
      .append('path')
      .datum(values3)
      .attr('fill', 'none')
      .attr('stroke', 'violet')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xfunc(i);
          })
          .y(function(d, i) {
            return yfunc3(d);
          })
      );

    // Add line
    this.svg2
      .append('path')
      .datum(values2)
      .attr('fill', 'none')
      .attr('stroke', 'yellow')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xfunc(i);
          })
          .y(function(d, i) {
            return yfunc2(d);
          })
      );
    // Add line
    this.svg1
      .append('path')
      .datum(values1)
      .attr('fill', 'none')
      .attr('stroke', 'violet')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xfunc(i);
          })
          .y(function(d, i) {
            return yfunc1(d);
          })
      );

    // Add line
    this.svg0
      .append('path')
      .datum(values0)
      .attr('fill', 'none')
      .attr('stroke', 'yellow')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xfunc(i);
          })
          .y(function(d, i) {
            return yfunc0(d);
          })
      );

    // Call the x axis in a group tag
    var xaxis_offset = this.height - this.margin.bottom;
    this.svg3
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + xaxis_offset + ')')
      .call(d3.axisBottom(xfunc));
    // .attr('font-size', '20px');
    this.svg2
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + xaxis_offset + ')')
      .call(d3.axisBottom(xfunc));
    // .attr('font-size', '20px');
    this.svg1
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + xaxis_offset + ')')
      .call(d3.axisBottom(xfunc));
    // .attr('font-size', '20px');
    this.svg0
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + xaxis_offset + ')')
      .call(d3.axisBottom(xfunc));
    // .attr('font-size', '20px');

    this.svg3
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + this.margin.left + ',0)')
      .call(d3.axisLeft(yfunc3).ticks(4));
    // .attr('font-size', '20px');

    this.svg2
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + this.margin.left + ',0)')
      .call(d3.axisLeft(yfunc2).ticks(4));
    // .attr('font-size', '20px');

    this.svg1
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + this.margin.left + ',0)')
      .call(d3.axisLeft(yfunc3).ticks(4));
    // .attr('font-size', '20px');

    this.svg0
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + this.margin.left + ',0)')
      .call(d3.axisLeft(yfunc2).ticks(4));
    // .attr('font-size', '20px');

    // text label for the x axis
    var xlabel_offset = (this.width + this.margin.left) / 2;
    this.svg1
      .append('text')
      .attr(
        'transform',
        'translate(' + xlabel_offset + ' ,' + this.height + ')'
      )
      .style('text-anchor', 'middle')
      .text('Timestamp (6 ps/step)')
      .attr('fill', 'white')
      .attr('font-size', '15px');
    this.svg0
      .append('text')
      .attr(
        'transform',
        'translate(' + xlabel_offset + ' ,' + this.height + ')'
      )
      .style('text-anchor', 'middle')
      .text('Timestamp (6 ps/step)')
      .attr('fill', 'white')
      .attr('font-size', '15px');

    this.svg3
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', this.margin.left / 3)
      .attr('x', (-1 * this.height) / 2)
      .style('text-anchor', 'middle')
      .text('Voltage (V)')
      .attr('fill', 'white')
      .attr('font-size', '20px');
    this.svg2
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', this.margin.left / 3)
      .attr('x', (-1 * this.height) / 2)
      .style('text-anchor', 'middle')
      .text('Voltage (V)')
      .attr('fill', 'white')
      .attr('font-size', '20px');
    this.svg1
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', this.margin.left / 3)
      .attr('x', (-1 * this.height) / 2)
      .style('text-anchor', 'middle')
      .text('Voltage (V)')
      .attr('fill', 'white')
      .attr('font-size', '20px');

    this.svg0
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', this.margin.left / 3)
      .attr('x', (-1 * this.height) / 2)
      .style('text-anchor', 'middle')
      .text('Voltage (V)')
      .attr('fill', 'white')
      .attr('font-size', '20px');

    // this.update(layers, 0);
  }
  // // Call the y axis in a group tag

  update(layers, node, timestamp) {
    let values3 = Object.values(layers[3][node]);
    let values2 = Object.values(layers[2][node]);
    let values1 = Object.values(layers[1][node]);
    let values0 = Object.values(layers[0][node]);

    var xfunc = this.xScale;
    var yfun3 = this.yScale3;
    var yfun2 = this.yScale2;
    var yfun1 = this.yScale1;
    var yfun0 = this.yScale0;

    // Draw new line
    this.svg3
      .select('path')
      .datum(values3)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xfunc(i);
          })
          .y(function(d, i) {
            return yfun3(d);
          })
      );
    this.svg2
      .select('path')
      .datum(values2)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xfunc(i);
          })
          .y(function(d, i) {
            return yfun2(d);
          })
      );
    this.svg1
      .select('path')
      .datum(values1)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xfunc(i);
          })
          .y(function(d, i) {
            return yfun1(d);
          })
      );
    this.svg0
      .select('path')
      .datum(values0)
      .attr(
        'd',
        d3
          .line()
          .x(function(d, i) {
            return xfunc(i);
          })
          .y(function(d, i) {
            return yfun0(d);
          })
      );

    // Update point location
    this.svg3
      .select('.point')
      .attr('cx', xfunc(timestamp))
      .attr('cy', this.yScale3(values3[timestamp]));

    this.svg2
      .select('.point')
      .attr('cx', xfunc(timestamp))
      .attr('cy', this.yScale2(values2[timestamp]));

    this.svg1
      .select('.point')
      .attr('cx', this.xScale(timestamp))
      .attr('cy', this.yScale1(values1[timestamp]));

    this.svg0
      .select('.point')
      .attr('cx', this.xScale(timestamp))
      .attr('cy', this.yScale0(values0[timestamp]));
  }

  updatePoint(layers, node, timestamp) {
    let values3 = Object.values(layers[3][node]);
    let values2 = Object.values(layers[2][node]);
    let values1 = Object.values(layers[1][node]);
    let values0 = Object.values(layers[0][node]);

    this.svg3
      .select('.point')
      .attr('cx', this.xScale(timestamp))
      .attr('cy', this.yScale3(values3[timestamp]));

    this.svg2
      .select('.point')
      .attr('cx', this.xScale(timestamp))
      .attr('cy', this.yScale2(values2[timestamp]));

    this.svg1
      .select('.point')
      .attr('cx', this.xScale(timestamp))
      .attr('cy', this.yScale1(values1[timestamp]));

    this.svg0
      .select('.point')
      .attr('cx', this.xScale(timestamp))
      .attr('cy', this.yScale0(values0[timestamp]));
  }

  resize() {
    this.width = (this.containerDiv.clientWidth - 1) / 2;
    this.height = (this.containerDiv.clientHeight - 1) / 2;

    d3.selectAll('.linechart-svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }
}
