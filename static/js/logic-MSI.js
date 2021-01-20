// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
const raleighLatLng = [35.7596, -79.0193]

// Create map object

var url = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
var attribution = "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>";

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
var streetMap = L.tileLayer(url, {
    attribution: attribution,  // where the data is coming from, acknowledgement
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,

    //  https://docs.mapbox.com/help/glossary/style-url/
    //  https://docs.mapbox.com/api/maps/styles/
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

var lightMap = L.tileLayer(url, {
    attribution: attribution,  // where the data is coming from, acknowledgement
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    });
    
var outdoorMap = L.tileLayer(url, {
    attribution: attribution,  // where the data is coming from, acknowledgement
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
    });

var satelliteMap = L.tileLayer(url, {
    attribution: attribution,  // where the data is coming from, acknowledgement
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
    });
   
earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// pull in the JSON data file Objects, load data into variables, 
d3.json(earthquakes).then((data) => {
    // console.log(data);
    
    var featuresData = data.features;   /// list of objects
    console.log(featuresData);
    
    var earthquakeMarkers = [];
    
    for (var i = 0; i < featuresData.length; i++) {
        var magnitude = featuresData[i].properties.mag;
        var place = featuresData[i].properties.place;
        var longitude= featuresData[i].geometry.coordinates[0];
        var latitude  = featuresData[i].geometry.coordinates[1];
        if (magnitude <= 1) {
            color = "Lime";
        } else if (magnitude <= 2) {
            color = "GreenYellow";
        }else if (magnitude <= 3) {
            color = "yellow";
        } else if (magnitude <= 4) {
            color = "Orange";
        } else if (magnitude <= 5) {
            color = "Coral";
        } else {
            color = "FireBrick";
        }
        
        var earthquakeCircle = L.circle([latitude, longitude], {
            fillOpacity: 0.75,
            radius: magnitude*40000,
            color: color,
        });
        // add popup option
        earthquakeCircle.bindPopup(
            `<h3>${place}</h3><hr/>
            <h3>magnitude: ${magnitude}</h3>
        `);

        //this adds the circles to the markers
        earthquakeMarkers.push(L.circle([latitude, longitude], {
            fillOpacity: 0.75,
            opacity: 0.75,
            radius: magnitude*40000,
            color: color,
            weight: .02
            }).bindPopup(
            `<h3>${place}</h3><hr/>
            <h3>magnitude: ${magnitude}</h3>`)
        );
    }
    
    //create earthquake layer group
    var quakes = L.layerGroup(earthquakeMarkers);

    //toggle map layers
    var baseMaps = {Street: streetMap, 
        Satellite: satelliteMap,
        Outdoors: outdoorMap,
        Grey: lightMap};

// Add the fault lines from file, need to use 'python -m http.server' to open
    var faults = "../../PB2002_boundaries.json";

    d3.json(faults).then((data) => {
        var geoJsonLayer1 = L.geoJSON(data, {color:'orange'});
        var featuresData = data.features;   /// list of objects
        
        geoJsonLayer1.addTo(myMap);
    });        


        // layer for earthquakes and falt lines
    var overlayMaps = {
        Quakes: quakes
    };

    var myMap = L.map("map", {
        center: raleighLatLng,
        zoom: 3,
        //id: "mapbox/streets-v10",
        layers: [outdoorMap, quakes]  
    });
    
    // layer control to allow toggling 
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
    
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ['0-1','1-2','2-3','3-4','5+'];
        var colors = ["Lime","GreenYellow","yellow","Orange","Coral"];


        // Add min & max
        var legendInfo = "<div style='background: white'>Magnitude</div>"
        
        for (var i =0; i < limits.length; i++) {
            legendInfo += 
            "<div id='legend' style='background: " +
            colors[i] + "'> " +
            limits[i] + "</div>"
        }
        div.innerHTML = legendInfo;
        return div
        // "<div class=\"labels\">" +
        //     "<div class=\"min\">" + limits[0] + "</div>" +
        //     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        // "</div>";

        

        // limits.forEach(function(limit, index) {
        // labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        // });

        // div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        // return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);


});
