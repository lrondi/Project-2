var svgWidth = 1200;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 130
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var rect = svg.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "#131B67");

svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr('class', "plot-svg");

// Initial Params
var chosenYAxis = 'twilight';

function yScale(data, chosenYAxis){

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data[chosenYAxis], d => d.avg_depth),
      d3.max(data[chosenYAxis],d => d.avg_depth) *1.2])
      .range([0,height]);

  return yLinearScale;
}



// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis){
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}


// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, dat, newXScale, newYScale, chosenYAxis) {
  
  circlesGroup.data(dat[chosenYAxis])
    .transition()
    .duration(1000)
    .attr('cx', d => newXScale(d.cat_num))
    .attr('cy', d => newYScale(d.avg_depth))
    .attr('r',d => Math.log2(1+d.count*10));
    // d => d[chosenYAxis].count
  return circlesGroup;
}

function updateToolTip(chosenYAxis, circlesGroup) {

  var label = 'Number of species: '
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([60, -60])
    .html(function(d) {
      return (`${label}${d.count}`);
    });

  circlesGroup.call(toolTip);
  
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
    });

  return circlesGroup;
}

//   var label_text = 'Total number of species: '

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([60, -60])
//     .html(`${label_text} 4000`);

//   circlesGroup.call(toolTip);
  
//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data, this);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data, this);
//     });

//   return circlesGroup;
// }

// Retrieve data from the CSV file 
function init(){
d3.json('/vernacular').then((data)=>{

    var xLinearScale =d3.scaleLinear().domain([d3.min(data[chosenYAxis], d =>d.cat_num)*0.3, 
                      d3.max(data[chosenYAxis], d=>d.cat_num)]).range([0, width]);
    var yLinearScale = yScale(data, chosenYAxis);
    
    var dd = data['twilight']
    var tickLabels = []
    for (var i=0;i<dd.length;i++){
      var b = dd[i];
      tickLabels.push(b['category'])
    }

    var bottomAxis = d3.axisBottom(xLinearScale);
    bottomAxis.tickValues(new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17));
    bottomAxis.tickFormat(function(d,i){ return tickLabels[i] }); 
    
    var leftAxis = d3.axisLeft(yLinearScale);
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)
      .attr('class','xaxis')
      .selectAll("text")  
      .style("text-anchor", "end")
      .style('color','white')
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-35)" )
      .attr('class', 'x-text'); 
 

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed('y-axis', true)
    .call(leftAxis)
    .attr('class','yaxis');


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data[chosenYAxis])
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.cat_num))
    .attr("cy", d => yLinearScale(d.avg_depth))
    .attr("r", d => Math.log2(1+d.count*10))
    .style('fill', "#43E5D7"); 

  // Create group for  2 y- axis labels  
  var ylabelsGroup = chartGroup. append('g')
    .attr('transform', 'rotate(-90)')
    .attr('class', 'label')

    var twilightLabel = ylabelsGroup.append('text')
        .attr('x', 0 - (height/2))
        .attr('y', 0 - margin.left+60)
        .attr('value', 'twilight')
        .attr('dy', '1em')
        .classed('active', true)
        .text('Twilight zone (2-1000m)')
    
    var midnightLabel = ylabelsGroup.append('text')
        .attr('x', 0 - (height/2))
        .attr('y', 0 - margin.left + 40)
        .attr('value', 'midnight')
        .attr('dy', '1em')
        .classed('inactive', true)
        .text('Midnight zone (1000-4000m)')
    
    var abyssLabel = ylabelsGroup.append('text')
        .attr('x', 0 - (height/2))
        .attr('y', 0 - margin.left+20)
        .attr('value', 'abyss')
        .attr('dy', '1em')
        .classed('inactive', true)
        .text('The abyss zone (>4000m)')    
      
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  
  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      
      var value = d3.select(this).attr("value");
      console.log(value)
      if (value !== chosenYAxis){
        chosenYAxis = value;
        yAxis.attr('class', 'yaxis')
        // if (chosenYAxis ==='midnight'){chosenRadius = 'mid_count'}
        // else if (chosenYAxis === 'abyss'){chosenRadius = 'ab_count'}
        // else (chosenRadius = 'twil_count')

        yLinearScale = yScale(data, chosenYAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);
        
        circlesGroup = renderCircles(circlesGroup, data, xLinearScale, yLinearScale, chosenYAxis);
        // textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        circlesGroup = updateToolTip(data, chosenYAxis, circlesGroup);

        if (chosenYAxis === "twilight") {
          rect.attr('fill','#131B67')
          twilightLabel
            .classed("active", true)
            .classed("inactive", false);
          midnightLabel
            .classed("active", false)
            .classed("inactive", true);
          abyssLabel
            .classed('active', false)
            .classed('inactive', true);
        }
        else if (chosenYAxis ==='midnight'){
          rect.attr('fill','#0F1A6E');
          twilightLabel
            .classed("active", false)
            .classed("inactive", true);
          midnightLabel
            .classed("active", true)
            .classed("inactive", false);
          abyssLabel
            .classed('active', false)
            .classed('inactive', true);
        }
        else {
          rect.attr('fill','#050E43')
          twilightLabel
            .classed("active", false)
            .classed("inactive", true);
          midnightLabel
            .classed("active", false)
            .classed("inactive", true);
          abyssLabel
            .classed('active', true)
            .classed('inactive', false);
        }
      }
    });
});
};

init();
