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

    var categ = [Object.keys(data.twilight)];

    var td = data['twilight']
    var tw_stats = []
    var avgDepth_tw = []
    var count_tw = []
    
    for (let [key, value] of Object.entries(td)) {
        tw_stats.push(value);
    }
    
    
    for(var i=0;i<tw_stats.length;i++){
        avgDepth_tw.push(tw_stats[i].avg_depth)
    }
    
    for(var i=0;i<tw_stats.length;i++){
        count_tw.push(tw_stats[i].count)
    }
    
    var md = data['midnight']
    var md_stats = []
    var avgDepth_md = []
    var count_md = []
    
    for (let [key, value] of Object.entries(md)) {
        md_stats.push(value)
    }
    
    for(var i=0;i<md_stats.length;i++){
        avgDepth_md.push(md_stats[i].avg_depth)
    }
    
    for(var i=0;i<md_stats.length;i++){
        count_md.push(md_stats[i].count)
    }

    var ad = data['abyss']
    var ab_stats = []
    var avgDepth_ab = []
    var count_ab = []
    
    for (let [key, value] of Object.entries(ad)) {
        ab_stats.push(value)
    }
    
    for(var i=0;i<ab_stats.length;i++){
        avgDepth_ab.push(ab_stats[i].avg_depth)
    }
    
    for(var i=0;i<ab_stats.length;i++){
        count_ab.push(ab_stats[i].count)
    }
    var final_data = {'twilight': avgDepth_tw, 'twil_count': count_tw, 'midnight': avgDepth_md, 'mid_count': count_md, 'abyss':avgDepth_ab, 'ab_count': count_ab }
    // var final_data = {'twilight': tw_stats}
    var vern_cat =new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
    final_data['vern_cat'] = vern_cat;
    console.log(tw_stats);

    

    var xBandScale =d3.scaleLinear().domain([d3.min(tw_stats, d =>d.cat)*0.3, d3.max(tw_stats, d=>d.cat)*1.2]).range([0, chartWidth]);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(tw_stats, d=>d.avg_depth)*0.2,d3.max(tw_stats, d=>d.avg_depth)*1.2])
    .range([chartHeight, 0]);
// console.log(yLinearScale);


  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
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
    .data(tw_stats)
    .enter()
    .append("circle")
    .attr("cx", d => xBandScale(d.cat))
    .attr("cy",d => yLinearScale(d.avg_depth))
    .attr("r", d => d.count*0.001)
    .style('fill', "#69b3a2");

});