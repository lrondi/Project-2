var svgWidth = 800;
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
  .attr("fill", "#2C39DD");

svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr('class', "plot-svg");


var chosenYAxis = 'sunlight';

function yScale(data, chosenYAxis){

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data[chosenYAxis], d => d.avg_depth),
      d3.max(data[chosenYAxis],d => d.avg_depth) *1.2])
      .range([0,height]);

  return yLinearScale;
}

function renderYAxes(newYScale, yAxis){
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

function renderCircles(circlesGroup, dat, newXScale, newYScale, chosenYAxis) {
  
  circlesGroup.data(dat[chosenYAxis])
    .transition()
    .duration(1000)
    .attr('cx', d => newXScale(d.cat_num))
    .attr('cy', d => newYScale(d.avg_depth))
    .attr('r',d => Math.log2(1+d.count*10));
    
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


d3.json('/vernacular').then((data)=>{
  
  var paragraph = d3.select('#paragraph2') 
            paragraph.html('');
            paragraph.html(`<p>The Epipelagic zone is known as the surface layer or the sunlight zone of the ocean ranging
             from the surface to 200m. There is plenty of light and heat within this layer although both decrease
              as the depth increases. Pressure is also minimal and increases with depth. Most oceanic life and human
               activities like leisure, fishing, and sea transport occur in the Epipelagic zone. The coral reefs can
                be found in the layer and the photosynthesis process occurs here.</p>`); 

  
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

  var yAxis = chartGroup.append("g")
    .classed('y-axis', true)
    .call(leftAxis)
    .attr('class','yaxis');

  var circlesGroup = chartGroup.selectAll("circle")
    .data(data[chosenYAxis])
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.cat_num))
    .attr("cy", d => yLinearScale(d.avg_depth))
    .attr("r", d => Math.log2(1+d.count*10))
    .style('fill', "#43E5D7"); 

    
  var ylabelsGroup = chartGroup. append('g')
    .attr('transform', 'rotate(-90)')
    .attr('class', 'label')

    var sunlightLabel = ylabelsGroup.append('text')
      .attr('x', 0 - (height/2))
      .attr('y', 0 - margin.left+70)
      .attr('value', 'sunlight')
      .attr('dy', '1em')
      .classed('active', true)
      .text('Sunlight zone (0-200m)')

    var twilightLabel = ylabelsGroup.append('text')
        .attr('x', 0 - (height/2))
        .attr('y', 0 - margin.left+50)
        .attr('value', 'twilight')
        .attr('dy', '1em')
        .classed('inactive', true)
        .text('Twilight zone (200-1000m)')
    
    var midnightLabel = ylabelsGroup.append('text')
        .attr('x', 0 - (height/2))
        .attr('y', 0 - margin.left + 30)
        .attr('value', 'midnight')
        .attr('dy', '1em')
        .classed('inactive', true)
        .text('Midnight zone (1000-4000m)')
    
    var abyssLabel = ylabelsGroup.append('text')
        .attr('x', 0 - (height/2))
        .attr('y', 0 - margin.left+10)
        .attr('value', 'abyss')
        .attr('dy', '1em')
        .classed('inactive', true)
        .text('The abyss zone (>4000m)')    
      
 
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  ylabelsGroup.selectAll("text")
    .on("click", function() {
      
      var value = d3.select(this).attr("value");
      
      if (value !== chosenYAxis){
        chosenYAxis = value;
        console.log(chosenYAxis)
        yLinearScale = yScale(data, chosenYAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);
        
        circlesGroup = renderCircles(circlesGroup, data, xLinearScale, yLinearScale, chosenYAxis);

        if (chosenYAxis === 'sunlight'){
          rect.attr('fill','#2C39DD');
          sunlightLabel
            .classed("active", true)
            .classed("inactive", false);
          twilightLabel
            .classed("active", false)
            .classed("inactive", true);
          midnightLabel
            .classed("active", false)
            .classed("inactive", true);
          abyssLabel
            .classed('active', false)
            .classed('inactive', true);

          var paragraph = d3.select('#paragraph2') 
            paragraph.html('');
            paragraph.html(`<p>The Epipelagic zone is known as the surface layer or the sunlight zone of the ocean ranging
             from the surface to 200 m. There is plenty of light and heat within this layer although both decrease
              as the depth increases. Pressure is also minimal and increases with depth. Most oceanic life and human
               activities like leisure, fishing, and sea transport occur in the Epipelagic zone. The coral reefs can
                be found in the layer and the photosynthesis process occurs here.</p>`); 
        }       
        else if (chosenYAxis === "twilight") {
          rect.attr('fill','#161E78');
          sunlightLabel
            .classed("active", false)
            .classed("inactive", true);
          twilightLabel
            .classed("active", true)
            .classed("inactive", false);
          midnightLabel
            .classed("active", false)
            .classed("inactive", true);
          abyssLabel
            .classed('active', false)
            .classed('inactive', true);
            var paragraph = d3.select('#paragraph2') 
            paragraph.html('');
            paragraph.html(`<p>Above the Bathypelagic zone lies the Mesopelagic layer (Twilight or midwater zone). 
            The Mesopelagic zone lies between 200 m and 1000 m. The zone is home to some of the strangest sea animals 
            like the swordfish and the wolf eel. Faint sun rays penetrate the layer.</p>`);
        }
        else if (chosenYAxis ==='midnight'){
          rect.attr('fill','#0B1145');
          sunlightLabel
            .classed("active", false)
            .classed("inactive", true);
          twilightLabel
            .classed("active", false)
            .classed("inactive", true);
          midnightLabel
            .classed("active", true)
            .classed("inactive", false);
          abyssLabel
            .classed('active', false)
            .classed('inactive', true);
            var paragraph = d3.select('#paragraph2') 
            paragraph.html('');
            paragraph.html(`<p>The Bathypelagic layer is found between 1000 m and 4000 m, just above the Abyss. 
            This layer is also called the midnight zone. Although the Bathypelagic zone is dark, visible light 
            may be observed from sea creatures found here. The pressure in the zone reaches 5,858 lbs for every square inch,
             and a huge number of different sea species are found in the layer. Many animals in this layer are either black or
              red thanks to low sunlight penetration. Some whale species, like the sperm whale, spend some time at this level 
              in search of food.</p>`);
        }
        else {
          rect.attr('fill','#010413');
          sunlightLabel
            .classed("active", false)
            .classed("inactive", true);
          twilightLabel
            .classed("active", false)
            .classed("inactive", true);
          midnightLabel
            .classed("active", false)
            .classed("inactive", true);
          abyssLabel
            .classed('active', true)
            .classed('inactive', false);
            var paragraph = d3.select('#paragraph2') 
            paragraph.html('');
            paragraph.html(`<p>The Abyssopelagic zone, also known as the Abyss zone,
             lies just below the Bathypelagic layer. The layer’s name has origins in the Greek language and loosely translates to 
             “no bottom”. Temperatures are near freezing point, 
             and there is no penetration of natural light. Pressure is also high due to the weight 
             of the water above. Invertebrates like sea stars and squids can survive in this environment. 
             Over 75% of the ocean floor lies can be found within this zone with the continental rise starting here</p>`);
        }
        circlesGroup = updateToolTip(data, chosenYAxis, circlesGroup);
      };
    });
  });


