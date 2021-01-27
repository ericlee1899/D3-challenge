// declaring variables
var svgx = 1000;
var svgy = 500;
var margin = {top:20, right:40, bottom: 60, left: 100};
var x = svgx - margin.left - margin.right;
var y = svgy - margin.top - margin.bottom;

// declaring wrapper
var wrapper = d3
    .select(".scatter")
    .append("wrapper")
    .attr("x",svgx)
    .attr("y",svgy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var scatter = wrapper.append("g");

d3.select(".scatter").append("div").attr("class","tooltip").style("opacity",0);

d3.csv('data.csv',function(error, dataset) {

    if (error) throw error;

    dataset.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

    
    var yscale = d3.scaleLinear().range([y,0]);
    var xscale = d3.scaleLinear().range([0,x]);

    var xaxis = d3.axisBottom(xscale);
    var yaxis = d3.axisLeft(yscale);

    // declaring scale

    xscale.domain([7,d3.max(dataset, function(data) {
            return +data.poverty;
        }),
    ]);
    yscale.domain([0, d3.max(dataset, function(data) {
        return +data.smokes;
        }),
    ]);

    // declaring tooltip
    var tooltip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(data){
            var statename = data.state;
            var pov = +data.poverty;
            var smoke = +data.smokes;
            return(statename + "<br> Poverty(%): " + pov + "<br> Smoker Age (Median) " + smoke
            );
        });
    scatter.call(tooltip);

    scatter
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx",function(data, i){
            return xscale(data.poverty);
        })
        .attr("cy",function(data, i){
            return yscale(data.smokes);
        })
        .attr("r", "20")
        .attr("stroke", "black")
        .attr("opacity", 0.8)
        .attr("fill", "salmon")
        .on("mouseover", function(data ) {
            tooltip.show(data,t);
        })
        .on("mouseout", function(data, i) {
            tooltip.hide(data,t);
        });
    
    scatter
        .append("g")
        .attr('transform', `translate(0, ${y})`)
        .call(xaxis);

    scatter.append("g").call(yaxis);

    wrapper.selectAll(".dot")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(data){return data.abbr;})
    .attr("x", function(data){
        return xscale(data.poverty);
    })
    .attr("y", function(data) {
        return yscale(data.smokes);
    })
    .attr("font-size","10px")
    .attr("fill","blue")
    .style("text-anchor","middle");
    
    scatter
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - y / 2)
        .attr("dy","1em")
        .attr("class", "axisText")
        .text("Median Age of Smokers");

    scatter
        .append("text")
        .attr("transform","translate(" + x / 2 + " , " + (y + margin.top + 30) + ")",)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});
