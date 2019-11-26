import * as d3 from 'd3';

export class NodeRanking {
  init(layers, lineChart) {
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
    // --------------------------------------------
    // var test = values;
    // var test_with_index = [];
    // for (var i in test) {
    //   test_with_index.push([test[i], i]);
    // }
    // test_with_index.sort(function(left, right) {
    //   return left[0] < right[0] ? -1 : 1;
    // });
    // var indexes = [];
    // test = [];

    // for (var j in test_with_index) {
    //   test.push(test_with_index[j][0]);
    //   indexes.push(test_with_index[j][1]);
    // }

    // var label_nodes = [];
    // for (var i = 99; i > -1; i--) {
    //   label_nodes.push(indexes[i]);
    // }
    // // --------------------------------------------
    // var arr = values;
    // var sorted = arr.slice().sort(function(a, b) {
    //   return b - a;
    // });
    var arr = values
    var sorted = arr.slice().sort(function(a,b){return b-a})
    var ranks_id = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });
    var ranks = ranks_id.slice(0,10)
    var value = sorted.slice(0,10)

    var colorScale = d3.scaleSequential(d3.interpolateReds)
    .domain([0, 0.2]);

    //create main svg element
    this.svgDoc = d3
      .select('#rank-list')
      .append('svg')
      .style('height', '100%');

    this.svgDoc
      .append('g')
      .selectAll('rect')
      .data(value)
      .enter()
      .append('rect')
      .attr('class', 'rank-rect')
      .attr('width', function(d, i) {
        return d * 1000;
        // return sorted[i]  * 2000
      })
      .attr('height', 20)
      .attr('fill', function(d, i) {
        return colorScale(d);
      })
      .attr('fill-opacity', 0.8)
      .attr('stroke', function(d, i) {
        return colorScale(d);
      })
      .attr('x', 90)
      .attr('y', function(d, i) {
        return 30 * i;
      })
      .on('click', function(d, i) {
        // console.log(d);
        // console.log(i);
        lineChart.nodeInput.value = ranks[i];
        lineChart.update(layers, ranks[i]);
      });
    this.svgDoc
      .append('g')
      .selectAll('text_bars')
      .data(ranks)
      .enter()
      .append('text')
      .attr('dx', 10)
      .attr('dy', function(d, i) {
        return 15 + 30 * i;
      })
      .attr('id', 'texts')
      .text(function(d, i) {
        return `Node ${d}`;
      })
      .attr('fill', 'white')
      // .attr('font-size', '18px')

  }

  update(layers, timestamp, lineChart) {
    var values = [];

    if (this.currentLayer == 1 || this.currentLayer == 3) {
      for (var row = 0; row < 100; row++) {
        values.push(Math.abs(1.8 - layers[this.currentLayer][row][timestamp]));
      }
    } else {
      for (var row = 0; row < 100; row++) {
        values.push(Math.abs(layers[this.currentLayer][row][timestamp]));
      }
    }
    var colorScale = d3.scaleSequential(d3.interpolateReds)
    .domain([0, 0.2]);
    // --------------------------------------------
    // var test = values;
    // var test_with_index = [];
    // for (var i in test) {
    //   test_with_index.push([test[i], i]);
    // }
    // test_with_index.sort(function(left, right) {
    //   return left[0] < right[0] ? -1 : 1;
    // });
    // var indexes = [];
    // test = [];

    // for (var j in test_with_index) {
    //   test.push(test_with_index[j][0]);
    //   indexes.push(test_with_index[j][1]);
    // }

    // var label_nodes = [];
    // for (var i = 99; i > -1; i--) {
    //   label_nodes.push(indexes[i]);
    // }
    // var arr = values;
    // var sorted = arr.slice().sort(function(a, b) {
    //   return b - a;
    // });
    // var ranks_id = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });

    // --------------------------------------------
    var arr = values
    var sorted = arr.slice().sort(function(a,b){return b-a})
    var ranks_id = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });
    var ranks = ranks_id.slice(0,10)
    var value = sorted.slice(0,10)
    // var ranks = ranks
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
      // console.log(d);
      // console.log(i);
      lineChart.nodeInput.value = ranks[i];
      lineChart.update(layers, ranks[i]);
    })
    .transition()
    .duration(100)
      // .attr('y', function(d, i) {
      //   for (var j = 0; j < 100; j++) {
      //     if (i == parseInt(label_nodes[j])) {
      //       var id_found = j;
      //     }
      //   }
      //   return 30 * id_found; //label_nodes[i]
      // })
      .attr("width", function(d, i) {
        return d * 1000;
        // return sorted[i]  * 2000
      })
      .attr('fill', function(d, i) {
        return colorScale(d);
      })
      .attr('fill-opacity', 0.8)
      .attr('stroke', function(d, i) {
        return colorScale(d);
      })
      // .on('click', function(d, i) {
      //   console.log(d);
      //   console.log(i);

      //   console.log("farid")
      //   lineChart.nodeInput.value = 20;
      //   lineChart.update(layers, 20);
      // });

      d3.selectAll("#texts").remove();
      this.svgDoc
        .append("g")
        .selectAll("text_bars")
        .data(ranks)
        .enter()
        .append("text")
        .attr("dx", 10)
        .attr("dy", function(d, i) {
          return 15 + 30 * i;
        })
        .attr("id", "texts")
        .text(function(d, i) {
          return `Node ${d}`;
        })
        .attr('fill', 'white');
  }
}
