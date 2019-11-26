import * as d3 from 'd3';

export class Histogram {
  init(layers, divId, containerId) {
    this.divId = divId;
    this.containerId = containerId;

    var color = 'steelblue'; // color of bars
    var ticks = 15; // number of bars = ticks -2
    var padding = 5; //padding between bars

    // get data of a specific time stamp
    var values = [];
    var timestamp = 0;
    for (var row = 0; row < 100; row++) {
      values.push((1.8 - layers[1][row][timestamp]) * 1000);
    }

    var margin = { top: 30, right: 15, bottom: 50, left: 15 };
    var width =
      document.getElementById(this.containerId).clientWidth -
      margin.left -
      margin.right;
    var height =
      document.getElementById(this.containerId).clientHeight -
      margin.top -
      margin.bottom;

    // range for x-axis
    var max = 250;
    var min = 0;

    // A formatter for counts.
    var formatCount = d3.format(',.000f');

    var scaleBarWidth = d3
      .scaleLinear()
      .domain([min, max])
      .range([0, width]);

    // Generate a histogram using #ticks-2 uniformly-spaced bins.
    var data = d3
      .histogram()
      .domain(scaleBarWidth.domain())
      .thresholds(scaleBarWidth.ticks(ticks))(values);

    var yMax = d3.max(data, function(d) {
      return d.length;
    });
    var yMin = d3.min(data, function(d) {
      return d.length;
    });

    var colorScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var scaleBarHeight = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height, 0]);

    var xAxis = d3.axisBottom().scale(scaleBarWidth);

    this.svgHist = d3
      .select(`#${containerId}`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('id', divId);

    this.svgHist
      .append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function(d, i) {
        return i * (width / (ticks - 2)) + padding / 2;
      })
      .attr('y', function(d, i) {
        return scaleBarHeight(d.length);
      })
      .attr('width', width / (ticks - 2) - padding)
      .attr('height', function(d) {
        return height - scaleBarHeight(d.length);
      })
      .attr('fill', function(d) {
        return colorScale(d.length);
      });

    this.svgHist
      .append('g')
      .selectAll('text_bars')
      .data(data)
      .enter()
      .append('text')
      .attr('dy', function(d) {
        return height-15//scaleBarHeight(d.length) - 5;
      })
      .attr('x', function(d, i) {
        return width / (ticks * 2) + (i * width) / (ticks - 2) + 3;
      })
      // .attr("y",function(d) {
      //   return scaleBarHeight(d.length) -10;
      // })
      .attr('text-anchor', 'middle')
      .text(function(d, i) {
        if (i == ticks - 2) {
          return '';
        } else {
          return formatCount(d.length);
        }
      })
      .attr('fill', 'yellow')
      .attr('font-size', '20px')
      .attr('id', 'texts-hist');

    this.svgHist
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .attr('font-size', '20px')


          // text label for the x axis
    this.svgHist.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                        (height + 45) + ")")
    .style("text-anchor", "middle")
    .text("Voltage drop (mV)")
    .attr('fill',"white")
    .attr('font-size', '20px')
  }




  //----------------------------------------------------------------------
  // update the histogram
  update(layers, currentLayer, timestamp) {
    // color of bars
    var color = 'steelblue';
    var ticks = 15;
    var padding = 5;
    // get data of a specific time stamp
    var values = [];
    if (currentLayer == 1 || currentLayer == 3) {
      for (var row = 0; row < 100; row++) {
        values.push(
          1000 * Math.abs(1.8 - layers[currentLayer][row][timestamp])
        );
      }
    } else {
      for (var row = 0; row < 100; row++) {
        values.push(1000 * Math.abs(layers[currentLayer][row][timestamp]));
      }
    }

    var margin = { top: 30, right: 15, bottom: 50, left: 15 };
    var width =
      document.getElementById(this.containerId).clientWidth -
      margin.left -
      margin.right;
    var height = document.getElementById(this.containerId).clientHeight - margin.top - margin.bottom;

    var max = 250; //d3.max(values);
    var min = 0; //d3.min(values);

    // A formatter for counts.
    var formatCount = d3.format(',.00f');

    var scaleBarWidth = d3
      .scaleLinear()
      .domain([min, max])
      .range([0, width]);

    var data = d3
      .histogram()
      .domain(scaleBarWidth.domain())
      .thresholds(scaleBarWidth.ticks(ticks))(values);

    var yMax = d3.max(data, function(d) {
      return d.length;
    });

    var yMin = d3.min(data, function(d) {
      return d.length;
    });

    var colorScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var scaleBarHeight = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height, 0]);

    var xAxis = d3.axisBottom().scale(scaleBarWidth);

    var rect = this.svgHist
      .select('g')
      .selectAll('rect')
      .data(data);

    rect.exit().remove(); //remove unneeded bars

    rect.enter().append('rect');
    rect
      .transition()
      .duration(100)
      .attr('y', function(d, i) {
        return scaleBarHeight(d.length);
      })
      .attr('height', function(d) {
        return height - scaleBarHeight(d.length);
      })
      .attr('fill', function(d) {
        return colorScale(d.length);
      });

    d3.selectAll('#texts-hist').remove();


    this.svgHist
      .append('g')
      .selectAll('text_bars')
      .data(data)
      .enter()
      .append('text')
      .attr('dx', function(d, i) {
        return width / (ticks * 2) + (i * width) / (ticks - 2) + 3;
      })
      .attr('dy', function(d) {
        return height-15//scaleBarHeight(d.length) - 5;
      })
      .attr('text-anchor', 'middle')
      .text(function(d, i) {
        if (i == ticks - 2) {
          return '';
        } else {
          return formatCount(d.length);
        }
      })
      .attr('fill', 'yellow')
      .attr('font-size', '20px')
      .attr('id', 'texts-hist');
  }
}
