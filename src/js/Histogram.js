import * as d3 from "d3";

export class Histogram {
  init(layers, divId, containerId) {
    this.divId = divId;
    this.containerId = containerId;
    this.updateButton = document.getElementById("frequency-update");

    // color of bars
    var color = "steelblue";
    var ticks = 20;

    // get data of a specific time stamp
    var values = [];
    var timestamp = 10;
    for (var row = 0; row < 100; row++) {
      values.push(1.8 - layers[1][row][timestamp]);
    }

    var margin = { top: 20, right: 10, bottom: 20, left: 10 };
    var width =
      document.getElementById(containerId).clientWidth -
      margin.left -
      margin.right;
    var height = 200 - margin.top - margin.bottom;

    var max = d3.max(values);
    var min = d3.min(values);

    // A formatter for counts.
    var formatCount = d3.format(",.00f");

    var scaleBarWidth = d3
      .scaleLinear()
      .domain([min, max])
      .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.histogram().thresholds(scaleBarWidth.ticks(ticks))(values);

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

    var svg = d3
      .select(`#${containerId}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", divId);

    console.log(svg);

    var bar = svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", function(d) {
        return (
          "translate(" +
          scaleBarWidth(d.x0) +
          "," +
          scaleBarHeight(d.length) +
          ")"
        );
      });

    bar
      .append("rect")
      .attr("x", 0)
      .attr(
        "width",
        scaleBarWidth(data[0].x1 - data[0].x0) - scaleBarWidth(0) - 1
      )
      .attr("height", function(d) {
        return height - scaleBarHeight(d.length);
      })
      .attr("fill", function(d) {
        return colorScale(d.length);
      });

    bar
      .append("text")
      .attr("dy", ".75em")
      .attr("x", 5)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .text(function(d) {
        return formatCount(d.length);
      })
      .attr("fill", "white");

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  }

  update(layer, currentLayer, timestamp) {
    // color of bars
    var color = "steelblue";
    var ticks = 20;

    // get data of a specific time stamp
    var values = [];
    if (currentLayer == 1 || currentLayer == 3) {
      for (var row = 0; row < 100; row++) {
        values.push(Math.abs(1.8 - layer[row][timestamp]));
      }
    } else {
      for (var row = 0; row < 100; row++) {
        values.push(Math.abs(layer[row][timestamp]));
      }
    }

    var margin = { top: 20, right: 10, bottom: 20, left: 10 };
    var width =
      document.getElementById(this.containerId).clientWidth -
      margin.left -
      margin.right;
    var height = 200 - margin.top - margin.bottom;

    var max = d3.max(values);
    var min = d3.min(values);

    // A formatter for counts.
    var formatCount = d3.format(",.00f");

    var scaleBarWidth = d3
      .scaleLinear()
      .domain([min, max])
      .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.histogram().thresholds(scaleBarWidth.ticks(ticks))(values);

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

    var svg = d3.select(`#${this.divId}`);

    svg.html(null);

    var bar = svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", function(d) {
        return (
          "translate(" +
          scaleBarWidth(d.x0) +
          "," +
          scaleBarHeight(d.length) +
          ")"
        );
      });

    bar
      .append("rect")
      .attr("x", 0)
      .attr(
        "width",
        scaleBarWidth(data[0].x1 - data[0].x0) - scaleBarWidth(0) - 1
      )
      .attr("height", function(d) {
        return height - scaleBarHeight(d.length);
      })
      .attr("fill", function(d) {
        return colorScale(d.length);
      });

    bar
      .append("text")
      .attr("dy", ".75em")
      .attr("x", 5)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .text(function(d) {
        return formatCount(d.length);
      })
      .attr("fill", "white");

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  }
}
