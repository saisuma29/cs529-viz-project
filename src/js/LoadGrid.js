import * as d3 from 'd3';

export class LoadGrid {
  init(loads) {
    this.load1Div = document.getElementById('load-div-1');
    this.load2Div = document.getElementById('load-div-2');
    // // get data of a specific time stamp
    var values0 = [];
    var values1 = [];

    var timestamp = 0;
    for (var row = 0; row < 100; row++) {
      values0.push(loads[0][row][timestamp]);
    }
    for (var row = 0; row < 100; row++) {
      values1.push(loads[1][row][timestamp]);
    }
    // setup margin and div size
    var margin = { top: 20, right: 20, bottom: 20, left: 20 };
    var width = this.load1Div.clientWidth - margin.left - margin.right - 1;
    var height = this.load1Div.clientHeight - margin.top - margin.bottom - 1;

    this.svg0 = d3
      .select('#load-div-2')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.svg1 = d3
      .select('#load-div-1')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3
      .scaleLinear()
      .domain([0, 9])
      .range([margin.left, width - margin.right]);

    var yScale = d3
      .scaleLinear()
      .domain([0, 9])
      .range([margin.bottom, height - margin.top]);

    var rScale = d3
      .scaleLinear()
      .domain([0, 5])
      .range([3, 10]);

    var dimensionSize = 10;

    this.svg0
      .append('g')
      .selectAll('circle0')
      .data(values0)
      .enter()
      .append('circle')
      .attr('cx', function(d, i) {
        return xScale(Math.floor(i % dimensionSize));
      })
      .attr('cy', function(d, i) {
        return yScale(Math.floor(i / dimensionSize));
      })
      .attr('r', function(d) {
        return rScale(d);
      })
      .attr('fill', 'yellow');

    this.svg1
      .append('g')
      .selectAll('circle1')
      .data(values1)
      .enter()
      .append('circle')
      .attr('cx', function(d, i) {
        return xScale(Math.floor(i % dimensionSize));
      })
      .attr('cy', function(d, i) {
        return yScale(Math.floor(i / dimensionSize));
      })
      .attr('r', function(d) {
        return rScale(d);
      })
      .attr('fill', 'violet');

    var row = this.svg0
      .selectAll('.row')
      .data(gridData(height, width, margin))
      .enter()
      .append('g')
      .attr('class', 'row');

    var column = row
      .selectAll('.square')
      .data(function(d) {
        return d;
      })
      .enter()
      .append('rect')
      .attr('class', 'square')
      .attr('x', function(d) {
        return d.x + margin.left;
      })
      .attr('y', function(d) {
        return d.y + margin.top;
      })
      .attr('width', function(d) {
        return (width - margin.right - margin.left) / 9;
      })
      .attr('height', function(d) {
        return (height - margin.top - margin.bottom) / 9;
      })
      .style('fill', '#fff')
      .style('stroke', '#222')
      .attr('opacity', 0.1);

    var row = this.svg1
      .selectAll('.row')
      .data(gridData(height, width, margin))
      .enter()
      .append('g')
      .attr('class', 'row');

    var column = row
      .selectAll('.square')
      .data(function(d) {
        return d;
      })
      .enter()
      .append('rect')
      .attr('class', 'square')
      .attr('x', function(d) {
        return d.x + margin.left;
      })
      .attr('y', function(d) {
        return d.y + margin.top;
      })
      .attr('width', function(d) {
        return (width - margin.right - margin.left) / 9;
      })
      .attr('height', function(d) {
        return (height - margin.top - margin.bottom) / 9;
      })
      .style('fill', '#fff')
      .style('stroke', '#222')
      .attr('opacity', 0.1);

    this.svg0
      .append('text')
      .attr('transform', 'translate(' + width / 2 + ' ,' + 0 + ')')
      .style('text-anchor', 'middle')
      .text('Layer0 (G)')
      .attr('fill', 'white')
      .attr('font-size', '20px');

    this.svg1
      .append('text')
      .attr('transform', 'translate(' + width / 2 + ' ,' + 0 + ')')
      .style('text-anchor', 'middle')
      .text('Layer1 (P)')
      .attr('fill', 'white')
      .attr('font-size', '20px');

    function gridData(height, width, margin) {
      var data = new Array();
      var xpos = 0; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
      var ypos = 0;
      var width = (width - margin.right - margin.left) / 9;
      var height = (height - margin.top - margin.bottom) / 9;
      // iterate for rows
      for (var row = 0; row < 9; row++) {
        data.push(new Array());
        // iterate for cells/columns inside rows
        for (var column = 0; column < 9; column++) {
          data[row].push({
            x: xpos,
            y: ypos,
            width: width,
            height: height
          });
          // increment the x position. I.e. move it over by 50 (width variable)
          xpos += width;
        }
        // reset the x position after a row is complete
        xpos = 0;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height;
      }
      return data;
    }
  }

  update(loads, timestamp) {
    // get data of a specific time stamp
    var values0 = [];
    var values1 = [];
    for (var row = 0; row < 100; row++) {
      values0.push(loads[0][row][timestamp]);
    }
    for (var row = 0; row < 100; row++) {
      values1.push(loads[1][row][timestamp]);
    }

    // setup margin and div size
    var margin = { top: 20, right: 20, bottom: 20, left: 20 };
    var width = this.load1Div.clientWidth - margin.left - margin.right;
    var height = this.load1Div.clientHeight - margin.top - margin.bottom;

    var xScale = d3
      .scaleLinear()
      .domain([0, 9])
      .range([margin.left, width - margin.right]);

    var yScale = d3
      .scaleLinear()
      .domain([0, 9])
      .range([margin.bottom, height - margin.top]);

    var rScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([3, 10]);

    var circle = this.svg0
      .select('g')
      .selectAll('circle')
      .data(values0);

    circle.exit().remove();
    circle
      .transition()
      .duration(100)

      .attr('r', function(d) {
        return rScale(d);
      });
    var circle = this.svg1
      .select('g')
      .selectAll('circle')
      .data(values1);
    circle.exit().remove();
    circle
      .transition()
      .duration(100)
      .attr('r', function(d) {
        return rScale(d);
      });
  }
}
