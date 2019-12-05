import * as d3 from 'd3';

export class Histogram {
  init(layers, divId, containerId) {
    this.divId = divId;
    this.containerDiv = document.getElementById(containerId);

    // get data of a specific time stamp
    let values = [];
    let timestamp = 0;
    for (let row = 0; row < 100; row++) {
      values.push(Math.abs(1.8 - layers[1][row][timestamp]) * 1000);
    }

    this.margin = { top: 50, right: 50, bottom: 50, left: 100 };
    this.width =
      this.containerDiv.clientWidth - this.margin.left - this.margin.right;
    this.height =
      this.containerDiv.clientHeight - this.margin.top - this.margin.bottom;

    let max = 220;
    let min = 0;
    this.color = 'violet';
    var colorScale = d3
      .scaleLinear()
      .domain([0, 50])
      .range([d3.rgb(this.color).brighter(), d3.rgb(this.color).darker()]);

    this.svgHist = d3
      .select(this.containerDiv)
      .append('svg')
      .attr('id', this.divId)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    var x = d3
      .scaleLinear()
      .domain([0, 220])
      .range([0, this.width]);

    this.svgHist
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x).ticks(5))
      // .attr('font-size', '15px');

    // set the parameters for the histogram
    var histogram = d3
      .histogram()
      .value(function(values) {
        return values;
      })
      .domain([0, 220])
      .thresholds(x.ticks(10));

    var bins = histogram(values);

    // Y axis: scale and draw:
    var y = d3
      .scaleLinear()
      .domain([0, 50])
      .range([this.height, 0]);

    this.svgHist
      .append('g')
      .call(d3.axisLeft(y).ticks(5))
      // .attr('font-size', '15px');

    var hist_height = this.height;

    this.svgHist
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', 1)
      .attr('transform', function(d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      })
      .attr('width', function(d) {
        return x(d.x1) - x(d.x0);
      })
      .attr('height', function(d) {
        return hist_height - y(d.length);
      })
      .attr('fill', function(d) {
        return colorScale(d.length);
      });

    var xx = this.height + 45;

    // Create x label
    this.svgHist
      .append('text')
      .attr('transform', 'translate(' + this.width / 2 + ' ,' + xx + ')')
      .style('text-anchor', 'middle')
      .text('Voltage Drop (mV)')
      .attr('fill', 'white')
      .attr('font-size', '15px');

    // Create y label
    this.svgHist
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', (-1 * this.height) / 2)
      .style('text-anchor', 'middle')
      .text('Frequency')
      .attr('fill', 'white')
      .attr('font-size', '15px');

    // Create title
    this.svgHist
      .append('text')
      .attr('transform', `translate(${this.width / 2} , ${-this.margin.top + 22})`)
      .style('text-anchor', 'middle')
      .text('Voltage Drop - Frequency')
      .attr('fill', 'white')
      .attr('font-size', '18px');
  }

  update(layers, currentLayer, timestamp) {

    let values = [];
    if (currentLayer == 1 || currentLayer == 3) {
      this.color = 'violet';
      for (let row = 0; row < 100; row++) {
        values.push(
          1000 * Math.abs(1.8 - layers[currentLayer][row][timestamp])
        );
      }
    } else {
      for (let row = 0; row < 100; row++) {
        this.color = 'yellow';
        values.push(1000 * layers[currentLayer][row][timestamp]);
      }
    }

    // get data of a specific time stamp
    var colorScale = d3
      .scaleLinear()
      .domain([0, 50])
      .range([d3.rgb(this.color).brighter(), d3.rgb(this.color).darker()]);

    var x = d3
      .scaleLinear()
      .domain([0, 220])
      .range([0, this.width]);

    // set the parameters for the histogram
    var histogram = d3
      .histogram()
      .value(function(values) {
        return values;
      })
      .domain([0, 220])
      .thresholds(x.ticks(10));

    var bins = histogram(values);

    // Y axis: scale and draw:
    var y = d3
      .scaleLinear()
      .domain([0, 50])
      .range([this.height, 0]);

    var hist_height = this.height;
    this.svgHist
      .selectAll('rect')
      .data(bins)
      .attr('height', function(d) {
        return hist_height - y(d.length);
      })
      .attr('x', 1)
      .attr('transform', function(d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      })
      .attr('fill', function(d) {
        return colorScale(d.length);
      });
  }

  resize() {
    this.width =
      this.containerDiv.clientWidth - this.margin.left - this.margin.right;
    this.height =
      this.containerDiv.clientHeight - this.margin.top - this.margin.bottom;

    d3.select(`#${this.divId}`)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.svgHist
      .select('.x-axis')
      .attr('transform', `translate(0, ${this.height})`);

    this.svgHist
      .select('.title-hist')
      .attr('transform', `translate(${this.width / 2}, ${this.height + 45})`);
  }
}
