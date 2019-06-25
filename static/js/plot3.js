var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#plot")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.json('/vernacular').then((data)=>{    

    var xLinearScale =d3.scaleLinear().domain([d3.min(data['twilight'], d =>d.cat_num)*0.3,
                    d3.max(data['twilight'], d=>d.cat_num)*1.2]).range([0, chartWidth]);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data['twilight'], d=>d.avg_depth)*0.2,d3.max(data['twilight'], d=>d.avg_depth)*1.2])
    .range([chartHeight, 0]);
// console.log(yLinearScale);


  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll("dot")
    .data(data['twilight'])
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.cat_num))
    .attr("cy",d => yLinearScale(d.avg_depth))
    .attr("r", d => Math.log(1+d.count))
    .style('fill', "#69b3a2");

});