import * as d3 from 'd3';

export class NodeRanking {
  init(layers, lineChart, containerId) {
    this.containerDiv = document.getElementById(containerId);
    this.margin = { top: 15, right: 0, bottom: 15, left: 0 };
    this.width = this.containerDiv.clientWidth;
    this.height =
      this.containerDiv.clientHeight - this.margin.top - this.margin.bottom;

    this.currentLayer = 1;
    var values = [];
    var timestamp = 0;

    if (this.currentLayer == 1 || this.currentLayer == 3) {
      for (var row = 0; row < 100; row++) {
        values.push(Math.abs(1.8 - layers[this.currentLayer][row][timestamp]));
      }
    } else {
      for (var row = 0; row < 100; row++) {
        values.push(Math.abs(layers[this.currentLayer][row][timestamp]));
      }
    }

    var arr = values;
    var sorted = arr.slice().sort(function(a, b) {
      return b - a;
    });
    var ranks_id = arr.slice().map(function(v) {
      return sorted.indexOf(v);
    });
    var ranks = ranks_id.slice(0, 5);
    var value = sorted.slice(0, 5);

    this.color = 'violet';

    var colorScale = d3
      .scaleLinear()
      .domain([0, 0.3])
      .range([d3.rgb(this.color).brighter(), d3.rgb(this.color).darker()]);

    //create main svg element
    this.svgDoc = d3
      .select('#rank-list')
      .append('svg')
      .style('height', this.height + this.margin.top + this.margin.bottom)
      .style('width', this.width);

    var y = d3
      .scaleLinear()
      .domain([0, 0.25])
      .range([0, this.width - this.margin.left - this.margin.right]);

    var yoffset = (this.height + this.margin.top + this.margin.bottom) / 5;

    // Create bars
    this.svgDoc
      .append('g')
      .selectAll('rect')
      .data(value)
      .enter()
      .append('rect')
      .attr('class', 'rank-rect')
      .attr('width', function(d) {
        return y(d);
      })
      .attr('height', yoffset - 30)
      .attr('fill', function(d, i) {
        return colorScale(d);
      })
      .attr('fill-opacity', 0.8)
      .attr('stroke', function(d, i) {
        return colorScale(d);
      })
      .attr('x', 90)
      .attr('y', function(d, i) {
        return (yoffset - 20) * i + 50;
      })
      .on('click', function(d, i) {
        lineChart.nodeInput.value = ranks[i];
        lineChart.update(layers, ranks[i], 0);
      });

    // Create text
    this.svgDoc
      .append('g')
      .selectAll('text_bars')
      .data(ranks)
      .enter()
      .append('text')
      .attr('dx', 10)
      .attr('dy', function(d, i) {
        return (yoffset - 20) * i + 70;
      })
      .attr('id', 'texts')
      .text(function(d, i) {
        return `Node ${d}`;
      })
      .attr('fill', 'white')
      .attr('font-size', '15px');

    var x = d3
      .scaleLinear()
      .domain([0, 250])
      .range([90, this.width - this.margin.left - this.margin.right - 90]);
    var xx = this.height - 20;

    // Create x axis
    this.svgDoc
      .append('g')
      .attr('transform', 'translate(0,' + xx + ')')
      .call(d3.axisBottom(x).ticks(3));
    // .attr('font-size', '20px')

    var xx = this.height + 25;

    // Create x label
    this.svgDoc
      .append('text')
      .attr('transform', 'translate(' + this.width / 2 + ' ,' + xx + ')')
      .style('text-anchor', 'middle')
      .text('Voltage Drop (mV)')
      .attr('fill', 'white')
      .attr('font-size', '15px');

    this.svgDoc
      .append('text')
      .attr('transform', 'translate(' + this.width / 2 + ' , 22)')
      .style('text-anchor', 'middle')
      .text('Voltage Drop - Top 5')
      .attr('fill', 'white')
      .attr('font-size', '18px');
  }

  update(layers, timestamp, lineChart) {
    var values = [];

    if (this.currentLayer == 1 || this.currentLayer == 3) {
      this.color = 'violet';

      for (var row = 0; row < 100; row++) {
        values.push(Math.abs(1.8 - layers[this.currentLayer][row][timestamp]));
      }
    } else {
      for (var row = 0; row < 100; row++) {
        this.color = 'yellow';

        values.push(Math.abs(layers[this.currentLayer][row][timestamp]));
      }
    }
    var colorScale = d3
      .scaleLinear()
      .domain([0, 0.3])
      .range([d3.rgb(this.color).brighter(), d3.rgb(this.color).darker()]);

    var arr = values;
    var sorted = arr.slice().sort(function(a, b) {
      return b - a;
    });
    var ranks_id = arr.slice().map(function(v) {
      return sorted.indexOf(v);
    });
    var ranks = ranks_id.slice(0, 5);
    var value = sorted.slice(0, 5);

    //rejoin data
    var rect = this.svgDoc
      .select('g')
      .selectAll('rect')
      .data(value);
    rect.exit().remove(); //remove unneeded bars
    rect
      .enter()
      .append('rect')
      .attr('x', 90)
      .attr('height', 20);
    //update all bars to new positions
    rect
      .on('click', function(d, i) {
        lineChart.nodeInput.value = ranks[i];
        lineChart.update(layers, ranks[i], timestamp);
      })
      .attr('width', function(d, i) {
        return d * 1000;
        // return sorted[i]  * 2000
      })
      .attr('fill', function(d, i) {
        return colorScale(d);
      })
      .attr('fill-opacity', 0.8)
      .attr('stroke', function(d, i) {
        return colorScale(d);
      });
    var yoffset = (this.height + this.margin.top + this.margin.bottom) / 5;

    d3.selectAll('#texts').remove();
    this.svgDoc
      .append('g')
      .selectAll('text_bars')
      .data(ranks)
      .enter()
      .append('text')
      .attr('dx', 10)
      .attr('dy', function(d, i) {
        return (yoffset - 20) * i + 70;
      })
      .attr('id', 'texts')
      .text(function(d, i) {
        return `Node ${d}`;
      })
      .attr('fill', 'white')
      .attr('font-size', '15px');
  }
}
