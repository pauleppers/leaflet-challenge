# Visualizing Data with Leaflet

## Background

Welcome to the United States Geological Survey, or USGS for short! The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes. 

### Basic Visualization

Visualize an earthquake data set.

1. **Get your data set**

   The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Dat used is from [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and picked a data set to visualize. 

2. **Import & Visualize the Data**

   Created a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.

   * The data markers reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes appear larger and darker in color.

   * Popups provide additional information about the earthquake when a marker is clicked.

   * A legend that will provide next to the map data.

- - -

### More Data 

Plot a second data set on your map to illustrate the relationship between tectonic plates and seismic activity. Data pulled from a second data set and visualized it along side your original set of data. Data on tectonic plates can be found at <https://github.com/fraxen/tectonicplates>.

* Plot the second data set on the map.

* Added a number of base maps to choose from as well as separate out our two different data sets into overlays that can be turned on and off independently.

* Add layer controls to our map.
