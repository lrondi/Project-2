// Initialize and add the map
function initMap() {
  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});

  var heat_coord = [{lat: -66.067, lng: 176.275},{lat: 7, lng: -177},{lat: 13.2167, lng: -129.8833}]
  
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heat_coord
  });
  heatmap.setMap(map);
}