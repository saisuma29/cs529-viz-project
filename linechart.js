// import data using queue
d3.queue()
    .defer(d3.csv, "IBM_layer0_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer1_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer2_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer3_nodes_volt_js.csv")
    .await(ready)
function init(layer0, layer1, layer2, layer3) {
    // console.log(layer1)
    // set the dimensions and margins of the graph
    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
        , width = 800 - margin.left - margin.right // Use the window's width 
        , height = 600 - margin.top - margin.bottom; // Use the window's height

    // var svg = d3.select("body").append("svg:svg")
    //     .attr("width", 1200)
    //     .attr("height", 1000)

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var content0 = [];
    var content1 = [];
    var content2 = [];
    var content3 = [];
    
    node = 200 // node id
    for (var timestamp = 0; timestamp < 6000; timestamp++) {
        content0.push(layer0[node][timestamp]);
    }
    for (var timestamp = 0; timestamp < 6000; timestamp++) {
        content1.push(layer1[node][timestamp]);
    }
    for (var timestamp = 0; timestamp < 6000; timestamp++) {
        content2.push(layer2[node][timestamp]);
    }
    for (var timestamp = 0; timestamp < 6000; timestamp++) {
        content3.push(layer3[node][timestamp]);
    }
    console.log(layer0[node][0])

    // X scale
    var xScale = d3.scaleLinear()
        .domain([0, 6000]) // input
        .range([0, width]); // output

    // Y scale
    var yScale = d3.scaleLinear()
        .domain([-0.01, 2.0]) // input 
        .range([height, 0]); // output 

    // // Y scale for layer1 & 3
    // var yScale1 = d3.scaleLinear()
    //     .domain([1.5, 2.0]) // input 
    //     .range([height, 0]); // output 

    // Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // Add line
    svg.append("path")
        .datum(content0)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.0)
        .attr("d", d3.line()
            .x(function (d, i) { return xScale(i) })
            .y(function (d, i) { return yScale(content0[i]) })
        )
    svg.append("path")
        .datum(content1)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.0)
        .attr("d", d3.line()
            .x(function (d, i) { return xScale(i) })
            .y(function (d, i) { return yScale(content1[i]) })
        )
        .curve(d3.curveMonotoneX) // apply smoothing to the line

}

function ready(error, layer0, layer1, layer2, layer3) {
    init(layer0, layer1, layer2, layer3);
}
