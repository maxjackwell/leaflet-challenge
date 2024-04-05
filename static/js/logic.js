//Part 1: Create the Earthquake Visualization

// Data Retrieval
// M4.5+ Earthquakes - Past 30 Days - 
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

// Data Processing
d3.json(url).then(function (data) {
    createFeatures(data.features);
});

// Create Features
function createFeatures(eqData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h1> ${feature.properties.place}</h1><br><h2> ${feature.properties.mag}</h2><br><h3> ${new Date(feature.properties.time)}</h3>`)
    }

    let eq = L.geoJSON(eqData, {
        onEachFeature: onEachFeature
});
createMap(eq)
}
// Create Map
function createMap(eq)  {
    let topo = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});


let baseMaps = {"Topographic Map": topo};
let overlayMaps = {"Earthquakes Above M4.5": eq};
let myMap = L.map("map", {center: [35.6764, 139.6500], zoom: 2, layers:[topo, eq]})
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap)
}

