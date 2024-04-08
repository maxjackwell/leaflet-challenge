// Part 1: Create the Earthquake Visualization

// Data Retrieval
// All Earthquakes - Past 30 Days -
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Data Processing
d3.json(url).then(function (data) {
    createFeatures(data.features);
});

// Create Features
function createFeatures(eqData) {
    // Function to create popup content for each earthquake feature
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h1>Magnitude: ${feature.properties.mag}</h1><hr>
            <h2>Depth:</h2><p>${feature.geometry.coordinates[2]} km</p><hr>
            <h3>Location:</h3><p>${feature.properties.place}</p><hr>
            <h4>Time:</h4><p>${new Date(feature.properties.time)}</p>`);
    }
    

    // Function to choose color based on earthquake depth
    function chooseColor(depth) {
        if (depth > -10 && depth < 10) {
            return "#0bda51"; // light green
        } else if (depth >= 10 && depth < 30) {
            return "#03c03c"; //  green
        } else if (depth >= 30 && depth < 50) {
            return "#ecb653"; // light orange
        } else if (depth >= 50 && depth < 70) {
            return "#ff8c00"; // orange
        } else if (depth >= 70 && depth < 90) {
            return "#c32c78"; // pink
        } else if (depth >= 90) {
            return "#841617"; // red
        }
    }

    // Create the earthquake layer
    let earthquakes = L.geoJSON(eqData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3, // Adjust the multiplier as needed
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "",
                weight: 1,
                opacity: 0.75,
                fillOpacity: 0.9
            });
        },
        onEachFeature: onEachFeature
    });

    // Create the map
    createMap(earthquakes);
}

// Create Map
function createMap(eq) {
    // Create the base tile layer
    let topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Define base and overlay maps
    let baseMaps = { "Topographic Map": topo };
    let overlayMaps = { "Earthquakes In the Last 30 Days": eq };

    // Create the map with layers and controls
    let myMap = L.map("map", {
        center: [34.0549, 118.2426],
        zoom: 3,
        layers: [topo, eq]
    });

    // Add legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        let div = L.DomUtil.create("div", "info legend");
        let depths = [-10, 10, 30, 50, 70, 90];
        let labels = [];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);
}
