function initMap() {
  const carto = L.map("map").setView([41.850033, -97.6500523], 4);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(carto);
  return carto;
}
// function initGraph() {
//   const chart = new CanvasJS.Chart("chartContainer", {});

//   chart.render();
// }

async function mainEvent() {
  console.log("start");
  const mapbtn = document.querySelector("#mapbtn");
  const graphbtn = document.querySelector("#graphbtn");
  const mapdisplay = document.querySelector("#map");
  const graphdisplay = document.querySelector("#chartContainer");

  graphbtn.addEventListener("click", () => {
    graphdisplay.classList.toggle("hidden");
    mapdisplay.classList.toggle("hidden");
    console.log("graph changed");
  });

  mapbtn.addEventListener("click", () => {
    mapdisplay.classList.toggle("hidden");
    graphdisplay.classList.toggle("hidden");
    console.log("map changed");
  });
   
  // initGraph();
  const ctx = document.getElementById("chart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    
  });
  // const instance = M.Tabs.init(document.querySelector(".tabs"));

const map = initMap();

}
document.addEventListener("DOMContentLoaded", async () => mainEvent());
