// import data using queue
d3.queue()
    .defer(d3.csv, "IBM_layer0_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer1_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer2_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer3_nodes_volt_js.csv")
    .await(ready)

function init(layer0, layer1, layer2, layer3) {

    // color of bars
    var color = "steelblue";
    
    // get data of a specific time stamp
    var content0 = [];
    var timestamp = 100
    for (var row = 0; row < 100; row++) {
        content0.push(1.8 - layer1[row][timestamp]);
    }
    var values = content0;
    console.log(values)

    // A formatter for counts.
    var formatCount = d3.format(",.00f");
    
    var margin = {top: 40, right: 60, bottom: 60, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    

    var max = d3.max(values);
    var min = d3.min(values);

    var ScaleWidth = d3.scaleLinear()
          .domain([min, max])
          .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.histogram()
        .thresholds(ScaleWidth.ticks(20))
        (values);

    var yMax = d3.max(data, function(d){
        return d.length
    });

    var yMin = d3.min(data, function(d){
        return d.length
    });

    var colorScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
    
    var ScaleHeight = d3.scaleLinear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(ScaleWidth)
    
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + ScaleWidth(d.x0) + "," + ScaleHeight(d.length) + ")"; });
    
    bar.append("rect")
        .attr("x", 1)
        .attr("width", (ScaleWidth(data[0].x1 - data[0].x0) -ScaleWidth(0) - 1 ))
        .attr("height", function(d) { 
            return height - ScaleHeight(d.length); 
        })
        .attr("fill", function(d) { return colorScale(d.length) });
    
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", 30)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    /*
    * Adding refresh method to reload new data
    */
    function refresh(values){
      // var values = d3.range(1000).map(d3.random.normal(20, 5));
      var data = d3.histogram()
        .thresholds(x.ticks(20))
        (values);
    
      // Reset y domain using new data
      var yMax = d3.max(data, function(d){
          return d.length
        });
      var yMin = d3.min(data, function(d){
          return d.length
        });
      y.domain([0, yMax]);
      var colorScale = d3.scale.linear()
                  .domain([yMin, yMax])
                  .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
    
      var bar = svg.selectAll(".bar").data(data);
    
      // Remove object with data
      bar.exit().remove();
    
      bar.transition()
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + ScaleHeight(d.length) + ")"; });
    
      bar.select("rect")
          .transition()
          .duration(1000)
          .attr("height", function(d) { return height - ScaleHeight(d.length); })
          .attr("fill", function(d) { return colorScale(d.length) });
    
      bar.select("text")
          .transition()
          .duration(1000)
          .text(function(d) { return formatCount(d.length); });
    
    }
}

function ready(error, layer0, layer1, layer2, layer3) {
    init(layer0, layer1, layer2, layer3);
}
