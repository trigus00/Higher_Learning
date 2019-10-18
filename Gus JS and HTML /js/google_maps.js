let URL = "https://storage.googleapis.com/mapsdevsite/json/states.js"

function loadMapShapes() { 
    map.data.loadGeoJson(URL); 
}