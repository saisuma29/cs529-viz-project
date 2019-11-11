// import data using queue
d3.queue()
    .defer(d3.csv, "IBM_layer0_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer1_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer2_nodes_volt_js.csv")
    .defer(d3.csv, "IBM_layer3_nodes_volt_js.csv")
    .await(ready)

function init(layer0, layer1, layer2, layer3) {
        var content0 = [];

        var timestamp = 0

        for (var row = 0; row < 400; row++) {
            content0.push(1.8 - layer1[row][timestamp]);
        }

        values = content0;
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

        var label_nodes = []
        for (var i = 399; i > -1; i--) {
            label_nodes.push(indexes[i]);
        }
        // --------------------------------------------
        var arr = values
        var sorted = arr.slice().sort(function(a,b){return b-a})
        // var ranks_id = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });

        var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
        var dataIndex=1;
        var xBuffer=50;
        var yBuffer=150;
        var lineLength=400;
            
        // console.log(sorted)
        console.log(label_nodes)
        // console.log(ranks_id)
        //create main svg element
        var svgDoc = d3.select("body").append("svg")

        // svgDoc.append("text")
        //         .attr("x",xBuffer+(lineLength/2))
        //         .attr("y",50)
        //         .text("dataset"+dataIndex);
            
            svgDoc.append("g").selectAll("rect")
                .data(sorted)
                .enter()
                .append("rect")
                .attr("width",function(d,i){
                    return values[i]  * 1000
                    // return sorted[i]  * 2000

                })
                .attr("height",20)
                .attr("fill", function(d,i){
                    return colorArray[i%50]
                }
                )
                .attr("fill-opacity",0.8)
                .attr("stroke", function(d,i){
                    return colorArray[i%50]
                })
                .attr("x",50)
                .attr("y", function(d,i){       
                    // console.log(ranks_id[i]-1)   
                              
                   return yBuffer + 30 * i
                })
            svgDoc.append("g").selectAll("text_bars")
                .data(sorted)
                .enter()
                .append("text")
                .attr("dx", 80)
                .attr("dy", function(d,i){
                return yBuffer +15 + 30 * i
                })
                .attr("id","texts")
                .text(function(d,i){
                return i})

                // return label_nodes[i]})


            //button to swap over datasets
            d3.select("body").append("button")
                .text("change data")
                
                .on("click",function(){
                    
                    //select new data
                    if (dataIndex==1) {
                        dataIndex=2;
                    } else   {
                        dataIndex=1;

                    }
                    var content0 = [];

                    timestamp += 6 

                    console.log(timestamp)
                    for (var row = 0; row < 400; row++) {
                        content0.push(1.9-layer1[row][timestamp]);
                    }
            
                    values = content0;
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
            
                    var label_nodes = []
                    for (var i = 399; i > -1; i--) {
                        label_nodes.push(indexes[i]);
                    }
                    var arr = values
                    var sorted = arr.slice().sort(function(a,b){return b-a})
                    // var ranks_id = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });

                    // --------------------------------------------

                    //rejoin data
                    var rect = svgDoc.select("g").selectAll("rect")
                        .data(sorted);
                    rect.exit().remove();//remove unneeded circles
                    rect.enter().append("rect")
                        .attr("x",50)
                         .attr("height",20)
                    //update all circles to new positions
                    rect.transition()
                        .duration(250)
                        .attr("y", function(d,i){         
                            for (var j = 0; j < 400; j++) {
                                if ( i == parseInt(label_nodes[j])){
                                var id_found = j;
                                }

                            }              
                            return yBuffer + 30 * id_found//label_nodes[i]
                         })
                         .attr("width",function(d,i){
                            for (var j = 0; j < 400; j++) {
                                if ( i == parseInt(label_nodes[j])){
                                var id_found = j;
                                }

                            }    
                            return sorted[id_found]  * 1000
                        })


                    d3.selectAll("#texts").remove()
                    svgDoc.append("g").selectAll("text_bars")
                        .data(sorted)
                        .enter()
                        .append("text")
                        .attr("dx", 80)
                        .attr("dy", function(d,i){
                        return yBuffer +15 + 30 *i
                        })
                        .attr("id","texts")
                        .text(function(d,i){return label_nodes[i]})

                    d3.select("text").text("dataset"+dataIndex);

                });//end click function
}

function ready(error, layer0, layer1, layer2, layer3) {
    init(layer0, layer1, layer2, layer3);
}
