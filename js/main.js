function loadLocationData(dataVar) {
    var datasetToUse = dataVar;
    //backward compatibility due to change in data format
    if (datasetToUse[0].location) {
        locationData = datasetToUse.map(item => {
            return item.location;
        });
    } else {
        locationData = datasetToUse;
    }

    locationData.sort((p1, p2) => {
        return p1.recordedTime > p2.recordedTime;
    });

    return locationData
}

function trimDuplicates(locationData){
    var uniques = []
    locationData.forEach(loc => {
        if(!uniques.includes(loc)){
            uniques.push(loc)
        }        
    })
    return uniques
}

function getCoordsLatLng(locationData) {
    var coords = [];
    locationData.forEach(location => {
        var loc = [location.latitude, location.longitude];
        coords.push(loc);
    });
    return coords
}

function createLayersForData(dataVar) {

    var locationData = loadLocationData(dataVar)
    var pathLayer = createPathLayer(locationData);
    // var animatedPathLayer = createAnimatedPathLayer(locationData);
    var speedLayer = createSpeedLayer(locationData);
    var altitudeLayer = createAltitudeLayer(locationData);

    var overlayMaps = {
        Path:  L.layerGroup([pathLayer], {zIndex: 1 }),
        // AnimatedPath:  L.layerGroup([animatedPathLayer], {zIndex: 2 }),
        Speed: L.layerGroup([speedLayer], {zIndex: 3 }),
        Altitude: L.layerGroup([altitudeLayer], {zIndex: 4 })
    };
    return overlayMaps
}


function createControls(){
    var atlasMapSettings = L.Control.extend({
        options: {
          position: 'topleft' 
        },
        onAdd: function (map) {
          var control = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom atlas-settings-control closed');
          var icon    = L.DomUtil.create('div', 'fa fa-gear closed', control);
          var content = L.DomUtil.create('div', 'control-content empty', control);
      
        //   $(icon).attr('title', 'Map settings');
        }
    })
    return atlasMapSettings

}