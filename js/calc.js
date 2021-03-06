// https://www.geodatasource.com/developers/javascript
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}


//input is a array of coords and the time at that point
//returns an array of speeds
//i.e [ [x,y,t], [x1,y1,t1], [x2,y2,t2]]
function calcSpeedsWGS84(coords) {
    var speeds = []
    for (var i = 0; i < coords.length; i++) {
        var current = coords[i]

        var next = {};
        if (i < coords.length - 1) {
            next = coords[i + 1]
        }
        else {
            next = coords[i]
        }

        var distanceTravelledKm = distance(current[0], current[1], next[0], next[1], "K")
        var distanceTravelledM = distanceTravelledKm / 1000

        var timeGapInms = next[2] - current[2]
        var timeInSeconds = timeGapInms / 1000

        var speedMetresPerSecond = distanceTravelledM / timeInSeconds

        speeds.push(speedMetresPerSecond)

    }
    return speeds
}

function calcSpeedsSVY21(coords) {
    var speeds = []
    for (var i = 0; i < coords.length; i++) {
        var current = coords[i]

        var next = {};
        if (i < coords.length - 1) {
            next = coords[i + 1]
        }
        else {
            next = coords[i]
        }

        var distanceTravelledM = eucDistance([current[0], current[1]], [next[0], next[1]])

        if (distanceTravelledM < 0) {
            console.log("WTF")
        }

        var timeGapInms = next[2] - current[2]
        var timeInSeconds = timeGapInms / 1000
        var speedMetresPerSecond = 0

        if (timeInSeconds === 0) {
            speedMetresPerSecond = 0
        }
        else {
            speedMetresPerSecond = distanceTravelledM / timeInSeconds
        }


        if (isNaN(speedMetresPerSecond)) {
            console.log({
                spd: speedMetresPerSecond,
                dist: distanceTravelledM,
                time: timeInSeconds,
                current: current,
                next: next
            })
        }

        speeds.push(speedMetresPerSecond)

    }
    return speeds
}

// https://supunkavinda.blog/js-euclidean-distance
function eucDistance(a, b) {
    var euc = a
        .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
        .reduce((sum, now) => sum + now) // sum
        ** (1 / 2)
    if (isNaN(euc))
        console.log(euc)
    return euc
}