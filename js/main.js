function createPathLayer(locationData){
    var coords = [];
    locationData.forEach(location => {
      var loc = [location.latitude, location.longitude];
      coords.push(loc);
    });
    var polyline = L.polyline(coords)
    return polyline
}

function createAltitudeLayer(locationData){
    var coordsWithAltitude = []
    locationData.forEach(location => {
        var loc = [location.latitude, location.longitude, location.altitude];
        coordsWithAltitude.push(loc);
      });

    var altitudeOptions = {
        weight: 2,
        min: 20,
        max: 80,
        palette: {
          0.0: "#008800",
          0.5: "#ffff00",
          1.0: "#ff0000"
        }
      };
      var altitudeHotlineLayer = L.hotline(coordsWithAltitude, altitudeOptions)
      return altitudeHotlineLayer
}


function createSpeedLayer(locationData){
    var coordWithTime = [];
      locationData.forEach(location => {
        var loc = [
          location.latitude,
          location.longitude,
          location.recordedTime
        ];
        coordWithTime.push(loc);
      });

      var svy21 = new SVY21();
      var svyCoordWithTime = coordWithTime.map(coordT => {
        var northingEasting = svy21.computeSVY21(coordT[0], coordT[1]);
        var svy21X = northingEasting.E;
        var svy21Y = northingEasting.N;
        return [svy21Y, svy21X ,coordT[2]]
      });

      var speedsFromPointToNext = calcSpeedsSVY21(svyCoordWithTime);
      // console.log(speedsFromPointToNext)

      var min = speedsFromPointToNext.reduce( (prevValue, currentValue) => {
        if(currentValue < 0){
        //   console.log("WTF?")
          return prevValue
        }
        if(isNaN(currentValue))
          return prevValue
        return currentValue > prevValue ? prevValue : currentValue
      }, 9999999)

      var max = speedsFromPointToNext.reduce( (prevValue, currentValue) => {
        return currentValue > prevValue ? currentValue : prevValue
      }, -9999999)
      max = Math.ceil(max)

      var plot = [];     

      for (var i = 0; i < coordWithTime.length; i++) {
        var loc = coordWithTime[i];
        plot.push([loc[0], loc[1], speedsFromPointToNext[i]]);
      }

    //   console.log(speedsFromPointToNext);
    //   console.log(min);
    //   console.log(max);

      var speedOptions = {
        weight: 2,
        min: min,
        max: max,
        palette: {
          0.0: "#008800",
          0.5: "#ffff00",
          1.0: "#ff0000"
        }
      };
      var speedHotlineLayer = L.hotline(plot, speedOptions)
      return speedHotlineLayer

}