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

    var svg = d3.select("body").append("svg:svg")
        .attr("width", 1000)
        .attr("height", 1000)

    var colorScale = d3.scaleSequential(d3.interpolateWarm)
        .domain([0.0001, 0.03])

    var colorScale1 = d3.scaleSequential(d3.interpolateWarm)
        .domain([1.6, 1.8])

    var content0 = [];
    var content1 = [];
    var content2 = [];
    var content3 = [];
    // Store row 2, column 3
    timestamp = 3
    for (var row = 0; row < 400; row++) {
        // console.log(layer0[j][0])
        content0.push(layer0[row][timestamp]);
    }
    for (var row = 0; row < 400; row++) {
        content1.push(layer1[row][timestamp]);
    }
    for (var row = 0; row < 400; row++) {
        content2.push(layer2[row][timestamp]);
    }
    for (var row = 0; row < 400; row++) {
        content3.push(layer3[row][timestamp]);
    }

    // console.log(content2)

    for (var j = 0; j < 20; j++) {
        for (var i = 0; i < 20; i++) {
            svg.append("rect")
                .data(content0)
                .attr("x", i * 20)
                .attr("y", j * 20)
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", colorScale(content0[i + j * 20]))
        }
    }
    for (var j = 0; j < 20; j++) {
        for (var i = 0; i < 20; i++) {
            svg.append("rect")
                .data(content1)
                .attr("x", 420+(i * 20))
                .attr("y", (j * 20))
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", colorScale1(content1[i + j * 20]))
        }
    }
    for (var j = 0; j < 20; j++) {
        for (var i = 0; i < 20; i++) {
            svg.append("rect")
                .data(content2)
                .attr("x", (i * 20))
                .attr("y", 420+(j * 20))
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", colorScale(content2[i + j * 20]))
        }
    }
    for (var j = 0; j < 20; j++) {
        for (var i = 0; i < 20; i++) {
            svg.append("rect")
                .data(content3)
                .attr("x", 420+(i * 20))
                .attr("y", 420+(j * 20))
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", colorScale1(content3[i + j * 20]))
        }
    }
}

function ready(error, layer0, layer1, layer2, layer3) {
    init(layer0, layer1, layer2, layer3);
}