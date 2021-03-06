// Creating our initial map center, set the longitude, latitude, 
const raleighLatLng = [35.7596, -79.0193]

// URL and acknowledgement for mapbox
var url = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
var attribution = "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>";

// Adding a tile layer (the background map image) to our map
var streetMap = L.tileLayer(url, {
    attribution: attribution,  // where the data is coming from, acknowledgement
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

var lightMap = L.tileLayer(url, {
    attribution: attribution, 
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    });
    
var outdoorMap = L.tileLayer(url, {
    attribution: attribution, 
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
    });

var satelliteMap = L.tileLayer(url, {
    attribution: attribution,  
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
    });


// function call and wait from the JSON data file Objects at USGS, load data into variables, 
earthquakes = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
d3.json(earthquakes).then((data) => { 
    var featuresData = data.features;   // list of objects
    var earthquakeMarkers = [];
    
    // loop through the JSON features 'data' and create circles for map
    for (var i = 0; i < featuresData.length; i++) {
        var magnitude = featuresData[i].properties.mag;
        var place = featuresData[i].properties.place;
        var longitude= featuresData[i].geometry.coordinates[0];
        var latitude  = featuresData[i].geometry.coordinates[1];
      
        // assigning colors to circles
        if (magnitude <= 1) {    
            color = "Lime";
        } else if (magnitude <= 2) {
            color = "GreenYellow";
        }else if (magnitude <= 3) {
            color = "yellow";
        } else if (magnitude <= 4) {
            color = "PeachPuff";
        } else if (magnitude <= 5) {
            color = "Orange";
        } else {
            color = "IndianRed";
        }
        
        // create the circle marker array, setting attributes, and bind it to PopUp
        earthquakeMarkers.push(L.circle([latitude, longitude], {
            fillOpacity: 0.75,
            radius: magnitude*35000,
            weight: .5,
            fillColor: color,
            color: 'black'}).bindPopup(
            `<h3>${place}</h3><hr/>
            <h3>magnitude: ${magnitude}</h3>`)
        );
    } // end of for loop
    
    // Add the fault lines from Github
    var faults_URL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
    var faults = L.layerGroup();

    // fault line function call and wait from the JSON data file Objects aGitgub fault line boundaries
    d3.json(faults_URL).then((data) => {
        var geoJsonLayer1 = L.geoJSON(data, {color:'orange', weight: 2});
        geoJsonLayer1.addTo(faults);
    });        

    //create earthquake layer group
    var quakes = L.layerGroup(earthquakeMarkers);

    //toggle map layers
    var baseMaps = {Street: streetMap, 
        Satellite: satelliteMap,
        Outdoors: outdoorMap,
        Grey: lightMap};
    
    // layer for earthquakes and falt lines
    var overlayMaps = {
        Earthquakes: quakes,
        'Fault Lines': faults
    };
    var myMap = L.map("map", {
        center: raleighLatLng,
        zoom: 3,
        layers: [outdoorMap, quakes]  
    });
    
    // layer controls to allow toggling 
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
    
    // create the legend at bottom right corner
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ['0-1','1-2','2-3','3-4','4-5','5+'];
        var colors = ["Lime","GreenYellow","yellow","PeachPuff","Orange", "IndianRed"];

        // Create and add html for legend
        var legendInfo = "<div style='background: white'>Magnitude</div>"
        
        for (var i =0; i < limits.length; i++) {
            legendInfo += 
            "<div id='legend' style='background: " +
            colors[i] + "'> " +
            limits[i] + "</div>"
        }
        div.innerHTML = legendInfo;
        return div
    };

    // Adding legend to the map
    legend.addTo(myMap);
});