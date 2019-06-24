// function buildMetadata(sample) {
//   var URL =  '/metadata/'+sample;
  
//   d3.json(URL).then(function(data){
//     var panel = d3.select('#sample-metadata');  
//     panel.html('');
//     Object.entries(data).forEach(([key,value]) => {
//       var par = panel.append('p');
//       par.text(`${key}: ${value}`);
//     });
//   });

//     // BONUS: Build the Gauge Chart
//     // buildGauge(data.WFREQ)    
// };

// function buildGauge(sample){
//   var URL = '/wfreq/'+sample;
//   d3.json(URL).then(function(data){
//     console.log(data);
//     var level = data.WFREQ[0];
//     if (level <1){
//       var level2 = 10;
//     } else if (level <2){
//       var level2 = 30;
//     } else if (level<3){
//       var level2 = 50;
//     } else if (level<4){
//       var level2 = 70;
//     } else if (level<5){
//       var level2 = 90;
//     } else if (level<6){
//       var level2 = 110;
//     } else if (level<7){
//       var level2 = 130;
//     } else if (level<8){
//       var level2 = 150;
//     } else if (level<9){
//       var level2 = 170;
//     } else{
//       var level2 = 180;
//     };
//     // Trig to calc meter point
//     var degrees = 180 - level2,
//         radius = .5;
//     var radians = degrees * Math.PI / 180;
//     var x = radius * Math.cos(radians);
//     var y = radius * Math.sin(radians);

//     // Path: may have to change to create a better triangle
//     var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//         pathX = String(x),
//         space = ' ',
//         pathY = String(y),
//         pathEnd = ' Z';
//     var path = mainPath.concat(pathX,space,pathY,pathEnd);

//     var data = [
//       {type: 'scatter',
//       x: [0], y:[0],
//       marker: {size: 28, color:'850000'},
//       showlegend: false,
//       name: 'scrubs',
//       text: level,
//       hoverinfo: 'text+name'},
//       {values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
//       rotation: 90,
//       text: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1',''],
//       textinfo: 'text',
//       textposition:'inside',
//       marker: {colors:['rgba(4,93,29,0.8)','rgba(27,112,43 ,0.8)','rgba(51,132,57,0.8)',
//                             'rgba(75,152,71,0.8)', 'rgba(99,172,85,0.8)',
//                             'rgba(122,191,99,0.8)', 'rgba(146,211,113,0.8)',
//                             'rgba(170,231,127,0.8)', 'rgba(194,251,142,0.8)',
//                             'rgba(255, 255, 255, 0)']},
//       labels: ['8-9', '7-8', '6-7','5-6','4-5', '3-4', '2-3', '1-2', '0-1',''],
//       hoverinfo: 'label',
//       hole: .5,
//       type: 'pie',
//       showlegend: false
//     }];
        
//     var layout = {
//       shapes:[{
//           type: 'path',
//           path: path,
//           fillcolor: '850000',
//           line: {
//             color: '850000'
//           }
//         }],
//       title: '<b>Scrub-ometer!</b>',
//       height: 500,
//       width: 500,
//       xaxis: {zeroline:false, showticklabels:false,
//                 showgrid: false, range: [-1, 1]},
//       yaxis: {zeroline:false, showticklabels:false,
//                 showgrid: false, range: [-1, 1]}
//     };

//   Plotly.newPlot('gauge', data, layout);
//   });
// };

// function buildCharts(sample) {

//   var URL =  '/samples/'+sample;
//   d3.json(URL).then(function(data) {
//     var data = [data];
//     var sample_data = data[0].sample_values.slice(0);
//     var sortedData = sample_data.sort((first, second) => second - first);
//     var slicedData = sortedData.slice(0,10);
    
//     var index_arr = [];
//     for (var i=0; i<slicedData.length; i++){
//       index_arr.push(data[0].sample_values.indexOf(slicedData[i]));
//     };

//     var sortedIds = [];
//     for (var i=0; i<slicedData.length; i++){
//       sortedIds.push(data[0].otu_ids[index_arr[i]]);
//     };

//     var sortedLabels = [];
//     for (var i=0; i<slicedData.length; i++){
//       sortedLabels.push(data[0].otu_labels[index_arr[i]]);
//     };    

//     var trace = [{
//       type: "pie",
//       labels: sortedIds,
//       values: slicedData,
//       hovertext: sortedLabels
//     }];
//     Plotly.newPlot("pie", trace);

//     var trace2 = [{
//       x: sortedIds,
//       y: slicedData,
//       mode: 'markers',
//       text: sortedLabels,
//       marker:{
//         size: slicedData,
//         color: sortedIds
//       }
//     }];

//     var layout ={
//       xaxis:{title:{text:'Otu_id'}}
//     };
  
//     Plotly.newPlot('bubble',trace2, layout);
//   });

// }

function createMap (species_name, taxa_level){
  d3.json('/species/'+ species_name).then((data) =>{
   
    var long_list = [];
    var lat_list = [];
    var depth_list = [];
    var locality_list = [];
    var name = data.species;
    var vernacular = data.vernac;
    
    if (vernacular=='demosponge'){
      src='https://farm8.staticflickr.com/7674/17034754110_e76829a945_m.jpg'
    }
    else if (vernacular=='black coral'){
      src='https://farm66.staticflickr.com/65535/46874735015_a5cc7006a6_m.jpg'
    }
    else if (vernacular=='calcareous sponge'){
      src='https://farm6.staticflickr.com/5026/5671039331_ba0acf249e_m.jpg'
    }
    else if (vernacular=='glass sponge'){
      src='https://farm2.staticflickr.com/1880/29282222687_b52f4050a7_m.jpg'
    }
    else if (vernacular=='gorgonian coral'){
      src='https://farm8.staticflickr.com/7825/46189557124_86b0542a5e_m.jpg'
    }
    else if (vernacular=='lace coral'){
      src='https://farm5.staticflickr.com/4327/35900300222_52386ae020_m.jpg'
    }
    else if (vernacular=='lithotelestid coral'){
      src='https://upload.wikimedia.org/wikipedia/commons/f/fb/Nanipora_kamurai%2C_Okinawa.jpg'
    }
    else if (vernacular=='other coral-like hydrozoan'){
      src='https://upload.wikimedia.org/wikipedia/commons/9/9c/Millepora_alcicornis_%28Branching_Fire_Coral%29.jpg'
    }
    else if (vernacular=='scleromorph sponge'){
      src='https://upload.wikimedia.org/wikipedia/commons/5/50/Oscarella_lobularis_%28Schmidt%2C_1862%29.jpg'
    }
    else if (vernacular=='sea pen'){
      src='https://farm5.staticflickr.com/4263/34542873263_a8c676a628_m.jpg'
    }
    else if (vernacular=='soft coral'){
      src='https://farm66.staticflickr.com/65535/47761953101_63747997dd_m.jpg'
    }
    else if (vernacular=='sponge (unspecified)'){
      src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Aplysina_archeri_%28Stove-pipe_Sponge-pink_variation%29.jpg/179px-Aplysina_archeri_%28Stove-pipe_Sponge-pink_variation%29.jpg'
    }
    else if (vernacular=='stoloniferan coral'){
      src='https://upload.wikimedia.org/wikipedia/commons/3/3e/Palm_Coral_%28Clavularia_sp.%29_%286135839821%29.jpg'
    }
    else if (vernacular=='stony coral (branching)'){
      src='https://farm6.staticflickr.com/5564/14142944160_eb04d9dc41_m.jpg'
    }
    else if (vernacular=='stony coral (cup coral)'){
      src='https://farm8.staticflickr.com/7865/33666913708_5c967358da_m.jpg'
    }
    else{
      src='https://farm5.staticflickr.com/4809/47001948301_531151e296_m.jpg'
    }


    
    for (var i =0; i<data.longitude.length;i++){
      long_list.push(data.longitude[i])
    };

    for (var i =0; i<data.latitude.length;i++){
      lat_list.push(data.latitude[i])
    };

    for (var i =0; i<data.depth.length;i++){
      depth_list.push(data.depth[i])
    };

    for (var i =0; i<data.locality.length;i++){
      locality_list.push(data.locality[i])
    };
   
    var coord = {};
    for (var i = 0; i< long_list.length;i++){
      coord[i] = {lat: lat_list[i], lng: long_list[i]}
    };
    
    var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 3, center: coord[0], mapTypeId: 'satellite'});

    for (var i =0; i< long_list.length; i++){
      var sContent =
       "<div style='float:left'>"+
      "<img src="+src+" width=120px height=150px></div>"+
      "<div style='float:right; padding: 10px;'>"+
      "<b>Species: </b>"+name+"</br>"+
      "<b>Latitude, longitude: </b>"+coord[i].lat+", "+coord[i].lng+"</br>"+
      "<b>Depth: </b>"+depth_list[i]+"m</br>"+
      "<b>Locality: </b>"+locality_list[i]+"</br>"+
      "<b>Vernacular category (image): </b>"+vernacular+"</div>";

      var infoWindow = new google.maps.InfoWindow({
              content: sContent
            });

      var marker = new google.maps.Marker({animation: google.maps.Animation.DROP,position: coord[i], map: map, info: sContent});
      marker.addListener('click', function() {
        infoWindow.setContent( this.info );
        infoWindow.open( map, this );
            });
    };

    d3.json('/'+ taxa_level+'/'+species_name).then((data) =>{
      
      var heat_coord =[]
      for (var i=0;i<data.latitude.length;i++){
        var v = data.latitude[i]
        var b = data.longitude[i]
        heat_coord.push(new google.maps.LatLng(v,b))
      }

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heat_coord
      });
      heatmap.setMap(map);

      var paragraph = d3.select('#paragraph');  
      paragraph.html('');
      paragraph.html(
        `<h4>The marker shows all the locations of <em>${species_name}</em>, and the heatmap shows all the locations of species that share
         the same ${taxa_level}, in this case, ${data.taxa_value}</h4>`); 
    });
  });
  
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/species").then((spNames) => {
    spNames.forEach((sp) => {
      selector
        .append("option")
        .text(sp)
        .property("value", sp);
    });

  var selector2 = d3.select('#selTaxa');
  taxaNames = ['Genus', 'Family','Order', 'Subclass','Class', 'Phylum','Kingdom'];
  taxaNames.forEach((taxa) => {
    selector2
      .append('option')
      .text(taxa)
      .property('value', taxa);
  });

    // Use the first sample from the list to build the initial plots
    var firstSample = spNames[0];
    var chosen_taxa = 'Genus';
    createMap(firstSample, chosen_taxa)    
  });
}


function optionChanged(newSample) {
  var t = d3.select('#selTaxa').node().value;
  createMap(newSample,t)
}
function optionChanged2(newTaxa){
  var s = d3.select('#selDataset').node().value;
  createMap(s, newTaxa)
}

// Initialize the dashboard
init();
