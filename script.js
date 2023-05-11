// require('dotenv').config();
// console.log(process.env);
// for private API above
myChart = null;
raceData = null;
x=null;
selectedDemographics = null;
layer = null;
function initMap() {
  const theMap = L.map("map").setView([38.850033, -95.6500523], 4);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(theMap);
  return theMap;
};

// Plain chart that I came up with to display random data that can be used
function initChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["White", "Black or African-American", "American Indian and Alaska Native", "Asian", "Hispanic or Latino"],
      datasets: [
        {
          label: "",
          data: [],
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
};

function selectedDemographics(checkboxes){
  selectedDemographics = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const label = checkbox.parentNode.textContent.trim();
      selectedDemographics.push(label);
    }
  });
  return selectedDemographics;
};
const map = initMap();
async function mainEvent() {
  myChart = initChart();//Plain original chart that displays random data
  checkboxes = document.querySelectorAll('.checkDemographics');

// Below is where I Uncheck races in the checkbox to be able to display onto graph

// gathers selectedDemographics for the event listener below
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
      if (myChart)
      myChart.destroy();
      myChart = initChart();//Plain original chart that displays random data
      const selected = getselectedStateWDropdown();
      let ChosenState = filterState(theData, selected, myChart);
      if (layer != null){
        layer.remove();
       };
       layer = L.marker([x[0].latitude, x[0].longitude]).addTo(map).bindPopup('Smallest Minority: '+ selectedDemographics[raceData.indexOf(Math.min(...raceData))]) ;
      // update chart with new selected demographics
    });
  });
// gathers data from the opendatasoft API
  async function getData() {
    const link = "https://public.opendatasoft.com/api/records/1.0/search/";

    const query = {
      dataset: "us-cities-demographics",
      rows: 3000,
      "facet.city": "city",

      fields: "race,count,state,state_code,city,total_population",
    };
    const addToLink = Object.keys(query)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
      )
      .join("&");

    try {
      const response = await fetch(link + "?" + addToLink);
      if (response.ok) {
        const data = await response.json();
        return data.records;
      } else {
        console.error("Error retrieving data:", response.status);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  const storedData = await getData();
  localStorage.setItem('storedData',JSON.stringify(storedData));
  const parsedData = localStorage.getItem('storedData');
  let theData = JSON.parse(parsedData)

//filter 
  async function filterState(data, selectedStateWDropdown, myChart) {
    //original chart info
    let matchedStateWDropdown = [];
    data.forEach((element) => {
      if (element.fields.state_code === selectedStateWDropdown) {
        matchedStateWDropdown.push(element);
      }
    });

    if (myChart) {
      selectedDemographics = [];
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const label = checkbox.parentNode.textContent.trim();
          selectedDemographics.push(label);
        }
      });
      raceData = await filterRace(matchedStateWDropdown,selectedDemographics, myChart);
      myChart.data.labels = ["White", "Black or African-American", "American Indian and Alaska Native", "Asian", "Hispanic or Latino"];
      myChart.data.datasets[0].label = `Demographics of ${selectedStateWDropdown}`;
      myChart.data.datasets[0].data = raceData;
      for (let i = 0; i < raceData.length; i++) {
        if (raceData[i] === 0) {
          // Remove the data element at index i
          raceData.splice(i, 1);
          // Remove the corresponding label from the labels array
          myChart.data.labels.splice(i, 1);
          // Update the chart by calling update() method on the chart object
          myChart.update();
          // Decrement the loop counter to account for the removed element
          i--;
        }
      }
      myChart.update();
    }

    return matchedStateWDropdown;
  };

  //  Drop down menu + demographic API
  const dropdown = document.getElementById("state_dropdown");

  function getfullselectedStateWDropdown() {
    const selectedFullState = dropdown.options[dropdown.selectedIndex].text;
    return selectedFullState;
  };
  function getselectedStateWDropdown() {
    const selectedStateWDropdown = dropdown.options[dropdown.selectedIndex].value;
    return selectedStateWDropdown;
  };

  dropdown.addEventListener("change",  () => {
    const selected = getselectedStateWDropdown();
    const fullSelected = getfullselectedStateWDropdown();
    let ChosenState = filterState(theData, selected, myChart);
    console.log(ChosenState);
    
    let city = null
    for (var i = 0; i < theData.length; i++) {
        if (theData[i].fields.state == fullSelected) {
            city = theData[i].fields.city
        }
    }

    getCoordinates(city).then( result => {
       x=result;
       if (layer != null){
        layer.remove();
       };
       layer = L.marker([result[0].latitude, result[0].longitude]).addTo(map).bindPopup('Smallest Minority: '+ selectedDemographics[raceData.indexOf(Math.min(...raceData))])
       map.setView([result[0].latitude, result[0].longitude], 6) ;
    })

  });
  async function getCoordinates(city) {
    if(city === "Urban Honolulu"){
      city = 'Honolulu';
    }
    const response = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=US`, {
      method: "GET",
      headers: {
        'X-Api-Key': '7xOJR1t5VlUkJVxZnc/NTA==Iu1AB0JiBshtqMDe',
        //'X-Api-Key': process.env.API_KEY,
        "Content-Type": "application/json",
      }
    });
    const result = await response.json();
    return result;
  };


  const mapbtn = document.querySelector("#mapbtn");
  const graphbtn = document.querySelector("#graphbtn");
  const mapdisplay = document.querySelector("#map");
  const graphdisplay = document.querySelector("#chartContainer");

  // Buttons
  graphbtn.addEventListener("click", () => {
    mapdisplay.classList.add("hidden");
    graphdisplay.classList.add("visible");
    graphdisplay.classList.remove("hidden");
    mapdisplay.classList.add("hidden");
    console.log("graph changed");
  });

  mapbtn.addEventListener("click", () => {
    mapdisplay.classList.remove("hidden");
    graphdisplay.classList.remove("visible");
    graphdisplay.classList.add("hidden");
    mapdisplay.classList.remove("hidden");
    console.log("map changed");
  });

  //  filter demographics
  async function filterRace(data,selectedDemographics, myChart) {
    let totalWhite = 0;
    let totalBlackOrAfricanAmerican = 0;
    let totalAmericanIndian = 0;
    let totalAsian = 0;
    // let totalHawaiian = 0;
    let totalHispanic = 0;
    // let totalOther = 0;
    // let totalTwoOrMore = 0;
    chosenList= [0,0,0,0,0]
    data.forEach((element) => {
      if (element.fields.race === "White" && selectedDemographics.includes("White")) {
        totalWhite += element.fields.count;
        chosenList[0] += totalWhite;
        
      } else if (element.fields.race === "Black or African-American"  && selectedDemographics.includes("Black or African American")) {
        totalBlackOrAfricanAmerican += element.fields.count;
        chosenList[1] += totalBlackOrAfricanAmerican;
      } else if (element.fields.race === "American Indian and Alaska Native"  && selectedDemographics.includes("American Indian or Alaska Native")) {
        totalAmericanIndian += element.fields.count;
        chosenList[2] += totalAmericanIndian;
      } else if (element.fields.race === "Asian"  && selectedDemographics.includes("Asian")) {
        totalAsian += element.fields.count;
        chosenList[3] += totalAsian;
      } else if (element.fields.race === "Hispanic or Latino"  && selectedDemographics.includes("Hispanic or Latino")) {
        totalHispanic += element.fields.count;
        chosenList[4] += totalHispanic;
      }
    });
     allRacesSelected = chosenList;

    return allRacesSelected;
  };
  const refreshBtn = document.getElementById("refreshBtn");

  refreshBtn.addEventListener("click", async () => {
    localStorage.clear();
    const storedData = await getData();
    localStorage.setItem("storedData", JSON.stringify(storedData));
    const parsedData = localStorage.getItem("storedData");
    let theData = JSON.parse(parsedData);
  
    if (myChart) {
      myChart.destroy();
    }
    
    if (layer) {
      map.removeLayer(layer);
    }
  
    // Recreate only the chart instance
    myChart = initChart();
  
    dropdown.selectedIndex = 0;
  
    // Check if layer exists before trying to remove it
    if (layer) {
      map.removeLayer(layer);
    }
  
    map.setView([38.850033, -95.6500523], 4);
  });
  
}
document.addEventListener("DOMContentLoaded", async () => mainEvent());

