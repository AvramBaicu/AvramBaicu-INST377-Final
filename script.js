function initMap(){
    const carto = L.map("map").setView([38.98, -76.93],13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(carto);
return carto;

  }    const carto = initMap();
