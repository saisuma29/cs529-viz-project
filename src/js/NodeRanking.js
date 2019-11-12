import * as d3 from "d3";

export class NodeRanking {
  init(layer0, layer1, layer2, layer3) {
    var content0 = [];

    var timestamp = 0;

    for (var row = 0; row < 400; row++) {
      content0.push(1.8 - layer1[row][timestamp]);
    }

    var values = content0;
    // --------------------------------------------
    var test = values;
    var test_with_index = [];
    for (var i in test) {
      test_with_index.push([test[i], i]);
    }
    test_with_index.sort(function(left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
    var indexes = [];
    test = [];

    for (var j in test_with_index) {
      test.push(test_with_index[j][0]);
      indexes.push(test_with_index[j][1]);
    }

    var label_nodes = [];
    for (var i = 399; i > -1; i--) {
      label_nodes.push(indexes[i]);
    }
    // --------------------------------------------
    var arr = values;
    var sorted = arr.slice().sort(function(a, b) {
      return b - a;
    });
    // var ranks_id = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });

    var dataIndex = 1;
    var xBuffer = 0;
    var lineLength = 400;

    var colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, 399]);

    // console.log(sorted)
    console.log(label_nodes);
    // console.log(ranks_id)
    //create main svg element
    this.svgDoc = d3
      .select("#rank-list")
      .append("svg")
      .style("height", "100%");

    // svgDoc.append("text")
    //         .attr("x",xBuffer+(lineLength/2))
    //         .attr("y",50)
    //         .text("dataset"+dataIndex);

    this.svgDoc
      .append("g")
      .selectAll("rect")
      .data(sorted)
      .enter()
      .append("rect")
      .attr("width", function(d, i) {
        return values[i] * 1000;
        // return sorted[i]  * 2000
      })
      .attr("height", 20)
      .attr("fill", function(d, i) {
        return colorScale(i);
      })
      .attr("fill-opacity", 0.8)
      .attr("stroke", function(d, i) {
        return colorScale(i);
      })
      .attr("x", 50)
      .attr("y", function(d, i) {
        // console.log(ranks_id[i]-1)

        return 30 * i;
      });
    this.svgDoc
      .append("g")
      .selectAll("text_bars")
      .data(sorted)
      .enter()
      .append("text")
      .attr("dx", 80)
      .attr("dy", function(d, i) {
        return 15 + 30 * i;
      })
      .attr("id", "texts")
      .text(function(d, i) {
        return i;
      })
      .attr("fill", "white");
  }

  update(layer0, layer1, layer2, layer3, timestamp) {
    var content0 = [];

    for (var row = 0; row < 400; row++) {
      content0.push(1.9 - layer1[row][timestamp]);
    }

    var values = content0;
    // --------------------------------------------
    var test = values;
    var test_with_index = [];
    for (var i in test) {
      test_with_index.push([test[i], i]);
    }
    test_with_index.sort(function(left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
    var indexes = [];
    test = [];

    for (var j in test_with_index) {
      test.push(test_with_index[j][0]);
      indexes.push(test_with_index[j][1]);
    }

    var label_nodes = [];
    for (var i = 399; i > -1; i--) {
      label_nodes.push(indexes[i]);
    }
    var arr = values;
    var sorted = arr.slice().sort(function(a, b) {
      return b - a;
    });
    // var ranks_id = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });

    // --------------------------------------------

    //rejoin data
    var rect = this.svgDoc
      .select("g")
      .selectAll("rect")
      .data(sorted);
    rect.exit().remove(); //remove unneeded circles
    rect
      .enter()
      .append("rect")
      .attr("x", 50)
      .attr("height", 20);
    //update all circles to new positions
    rect
      .transition()
      .duration(0)
      .attr("y", function(d, i) {
        for (var j = 0; j < 400; j++) {
          if (i == parseInt(label_nodes[j])) {
            var id_found = j;
          }
        }
        return 30 * id_found; //label_nodes[i]
      })
      .attr("width", function(d, i) {
        for (var j = 0; j < 400; j++) {
          if (i == parseInt(label_nodes[j])) {
            var id_found = j;
          }
        }
        return sorted[id_found] * 1000;
      });

    d3.selectAll("#texts").remove();
    this.svgDoc
      .append("g")
      .selectAll("text_bars")
      .data(sorted)
      .enter()
      .append("text")
      .attr("dx", 80)
      .attr("dy", function(d, i) {
        return 15 + 30 * i;
      })
      .attr("id", "texts")
      .text(function(d, i) {
        return label_nodes[i];
      });
  }
}
