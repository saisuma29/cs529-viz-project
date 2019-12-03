import * as d3 from 'd3';

export class Histogram {
  init(layers, divId, containerId) {
    this.divId = divId;
    this.containerDiv = document.getElementById(containerId);

    this.color = 'steelblue'; // color of bars
    this.ticks = 15; // number of bars = ticks -2
    this.padding = 5; //padding between bars

    // get data of a specific time stamp
    let values = [];
    let timestamp = 0;
    for (let row = 0; row < 100; row++) {
      values.push((1.8 - layers[1][row][timestamp]) * 1000);
    }

    this.margin = { top: 30, right: 15, bottom: 50, left: 15 };
    this.width =
      this.containerDiv.clientWidth - this.margin.left - this.margin.right;
    this.height =
      this.containerDiv.clientHeight - this.margin.top - this.margin.bottom;

    // range for x-axis
    let max = 250;
    let min = 0;

    // A formatter for counts.
    this.formatCount = d3.format(',.000f');

    this.scaleBarWidth = d3
      .scaleLinear()
      .domain([min, max])
      .range([0, this.width]);

    // Generate a histogram using #ticks-2 uniformly-spaced bins.
    let data = d3
      .histogram()
      .domain(this.scaleBarWidth.domain())
      .thresholds(this.scaleBarWidth.ticks(this.ticks))(values);

    let yMax = d3.max(data, d => {
      return d.length;
    });
    let yMin = d3.min(data, d => {
      return d.length;
    });

    this.colorScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([d3.rgb(this.color).brighter(), d3.rgb(this.color).darker()]);

    this.scaleBarHeight = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([this.height, 0]);

    let xAxis = d3.axisBottom().scale(this.scaleBarWidth);

    this.svgHist = d3
      .select(this.containerDiv)
      .append('svg')
      .attr('id', this.divId)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.svgHist
      .append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        return i * (this.width / (this.ticks - 2)) + this.padding / 2;
      })
      .attr('y', (d, i) => {
        return this.scaleBarHeight(d.length);
      })
      .attr('width', this.width / (this.ticks - 2) - this.padding)
      .attr('height', d => {
        return this.height - this.scaleBarHeight(d.length);
      })
      .attr('fill', d => {
        return this.colorScale(d.length);
      });

    this.svgHist
      .append('g')
      .selectAll('text_bars')
      .data(data)
      .enter()
      .append('text')
      .attr('dy', d => {
        return this.height - 15; //scaleBarHeight(d.length) - 5;
      })
      .attr('x', (d, i) => {
        return (
          this.width / (this.ticks * 2) +
          (i * this.width) / (this.ticks - 2) +
          3
        );
      })
      .attr('text-anchor', 'middle')
      .text((d, i) => {
        if (i == this.ticks - 2) {
          return '';
        } else {
          return this.formatCount(d.length);
        }
      })
      .attr('fill', 'yellow')
      .attr('font-size', '20px')
      .attr('id', 'texts-hist');

    this.svgHist
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xAxis)
      .attr('font-size', '20px');

    // text label for the x axis
    this.svgHist
      .append('text')
      .append('class', 'title-hist')
      .attr('transform', `translate(${this.width / 2}, ${this.height + 45})`)
      .style('text-anchor', 'middle')
      .text('Voltage drop (mV)')
      .attr('fill', 'white')
      .attr('font-size', '20px');
  }

  //----------------------------------------------------------------------
  // update the histogram
  update(layers, currentLayer, timestamp) {
    // get data of a specific time stamp
    let values = [];
    if (currentLayer == 1 || currentLayer == 3) {
      for (let row = 0; row < 100; row++) {
        values.push(
          1000 * Math.abs(1.8 - layers[currentLayer][row][timestamp])
        );
      }
    } else {
      for (let row = 0; row < 100; row++) {
        values.push(1000 * Math.abs(layers[currentLayer][row][timestamp]));
      }
    }

    let max = 250; //d3.max(values);
    let min = 0; //d3.min(values);

    this.scaleBarWidth.domain([min, max]).range([0, this.width]);

    let data = d3
      .histogram()
      .domain(this.scaleBarWidth.domain())
      .thresholds(this.scaleBarWidth.ticks(this.ticks))(values);

    let yMax = d3.max(data, d => {
      return d.length;
    });

    let yMin = d3.min(data, d => {
      return d.length;
    });

    this.colorScale
      .domain([yMin, yMax])
      .range([d3.rgb(this.color).brighter(), d3.rgb(this.color).darker()]);

    this.scaleBarHeight.domain([0, yMax]).range([this.height, 0]);

    let xAxis = d3.axisBottom().scale(this.scaleBarWidth);

    let rect = this.svgHist
      .select('g')
      .selectAll('rect')
      .data(data);

    rect.exit().remove(); //remove unneeded bars

    rect.enter().append('rect');
    rect
      .transition()
      .duration(100)
      .attr('y', (d, i) => {
        return this.scaleBarHeight(d.length);
      })
      .attr('height', d => {
        return this.height - this.scaleBarHeight(d.length);
      })
      .attr('fill', d => {
        return this.colorScale(d.length);
      });

    d3.selectAll('#texts-hist').remove();

    this.svgHist
      .append('g')
      .selectAll('text_bars')
      .data(data)
      .enter()
      .append('text')
      .attr('dx', (d, i) => {
        return (
          this.width / (this.ticks * 2) +
          (i * this.width) / (this.ticks - 2) +
          3
        );
      })
      .attr('dy', d => {
        return this.height - 15; //scaleBarHeight(d.length) - 5;
      })
      .attr('text-anchor', 'middle')
      .text((d, i) => {
        if (i == this.ticks - 2) {
          return '';
        } else {
          return this.formatCount(d.length);
        }
      })
      .attr('fill', 'yellow')
      .attr('font-size', '20px')
      .attr('id', 'texts-hist');
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
