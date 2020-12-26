// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
const raleighLatLng = [35.7596, -79.0193]

var myMap = L.map("map", {
    center: raleighLatLng,
    zoom: 3
  });
  
var url = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
var attribution = "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>";

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer(url, {
attribution: attribution,  // where the data is coming from, acknowledgement
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(myMap);

earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// pull in the JSON data file, load data into variables, 
d3.json(earthquakes).then((data) => {
    // console.log(data);
    var featuresData = data.features;
    console.log(featuresData);
    
    featuresData.map(function(row) {
        var magnitude = row.properties.mag;
        var place = row.properties.place;
        var longitude= row.geometry.coordinates[0];
        var latitude  = row.geometry.coordinates[1];
        if (magnitude <= 1) {
            color = "Lime";
        } else if (magnitude <= 2) {
            color = "GreenYellow";
        }else if (magnitude <= 3) {
            color = "yellow";
        } else if (magnitude <= 4) {
            color = "Orange";
        } else if (magnitude <= 5) {
            color = "DarkOrange";
        } else {
            color = "IndianRed";
        }
        var earthquakeCircle = L.circle([latitude, longitude], {
            fillOpacity: 0.75,
            radius: magnitude*40000,
            color: color,
            //fillcolor:"purple"
        });
        earthquakeCircle.bindPopup(
            `<h3>${place}</h3><hr/>
            <h3>magnitude: ${row.properties.mag}</h3>
        `);
        earthquakeCircle.addTo(myMap);
    });
});

