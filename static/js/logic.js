d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(createMap);

function getColor(depth){
    if(depth < 20)
        return 'green'
    else if(depth < 40)
        return 'chartreuse'
    else if(depth < 60)
        return 'yellow'
    else if(depth < 80)
        return 'orange'
    else
        return 'red'
}

function createMap(locations){
    let earthquake = [];

    console.log(locations)
    console.log(locations.features.length)

    for (let i = 0; i < locations.features.length; i++) {

        currentQuake = locations.features[i]

        console.log(currentQuake);
        LatandLon = currentQuake.geometry.coordinates.slice(0,2).reverse()
        depth = currentQuake.geometry.coordinates[2]
        magnitude = currentQuake.properties.mag

        earthquake.push(
        L.circleMarker(LatandLon, {
            stroke: false,
            fillOpacity: 0.75,
            color: getColor(depth),
            radius: magnitude * 5
        }).bindPopup("<h3>" + currentQuake.properties.title + "<h3></h3>Magnitude: " + magnitude + "</h3>")
        );

    }

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org/%22%3ESRTM</a> | Map style: &copy; <a href="https://opentopomap.org/%22%3EOpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/%22%3ECC-BY-SA</a>)'
    });

    let quakes = L.layerGroup(earthquake);

    let MapBase = {
        'Street Map': street,
        'Topographic Map': topo
    };

    let MapOverlays = {
        'Earthquakes': quakes,
    };

    let myMap = L.map('map', {
        center: [37.09, -95.71],
        zoom: 5,
        layer: [street, quakes]
    });

    L.control.layers(MapBase, MapOverlays, {
        collapsed: false
    }).addTo(myMap);

    let legend = L.control({position: "bottomleft"});

    legend.onAdd = function(myMap){
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Earthquake Depth</h4>";
        div.innerHTML += '<i style="background: green"></i><span> < 20</span><br>';
        div.innerHTML += '<i style="background: chartreuse"></i><span> 20 < 40</span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span>40 < 60</span><br>';
        div.innerHTML += '<i style="background: orange"></i><span>60 < 80</span><br>';
        div.innerHTML += '<i style="background: red"></i><span>80+</span><br>';

        return div;
    };

    legend.addTo(myMap);
}
