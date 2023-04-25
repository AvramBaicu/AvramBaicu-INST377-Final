function initMap(){
    const carto = L.map("map").setView([38.98, -76.93],10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(carto);
return carto;
 function initGraph() {
  const chart = new CanvasJS.Chart("chartContainer", {
  });

  chart.render();
}


  }    const carto = initMap();

  async function mainEvent(){
    console.log('start');
    initMap();
    initGraph();
  }
  document.addEventListener('DOMContentLoaded', async() => mainEvent())