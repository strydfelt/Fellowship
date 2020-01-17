function setupMap() {

    var center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
    var map = L.map('mapdiv', {
        // fullscreenControl: true,
        // OR
        // fullscreenControl: {
        //     pseudoFullscreen: false // if true, fullscreen to page width and height
        // }
    }).setView([center.x, center.y], 12);


    // var basemap = onemapTiles()
    // var basemap = osmTiles()
    // var basemap = mapboxTiles()

    map.setMaxBounds([[1.56073, 104.1147], [1.16, 103.502]]);
    // basemap.addTo(map);
    return map

}


function onemapTiles() {
    var basemap =
        L.tileLayer('https://maps-{s}.onemap.sg/v3/Original/{z}/{x}/{y}.png', {
            detectRetina: true,
            maxZoom: 18,
            minZoom: 11,
            //Do not remove this attribution
            attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
        });
    return basemap
}

function osmTiles() {
    var basemap =
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            detectRetina: true,
            maxZoom: 19,
            minZoom: 11,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });
    return basemap
}

function mapboxTiles() {
    var basemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        minZoom: 11,
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11'
    })
    return basemap
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    marker = new L.Marker([position.coords.latitude, position.coords.longitude], { bounceOnAdd: false }).addTo(map);
    var popup = L.popup()
        .setLatLng([position.coords.latitude, position.coords.longitude])
        .setContent('You are here!')
        .openOn(map);
}

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     accessToken: 'your.mapbox.access.token'
// }).addTo(mymap);
