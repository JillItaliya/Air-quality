const channelId = "2840003";
const apiKey = "MGNZSLNC7UYHDF8V";
const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`;

async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const latest = data.feeds[0];

    const sensors = {
      "eCO₂ (ppm)": latest.field1,
      "TVOC (ppb)": latest.field2,
      "H₂S (ppm)": latest.field3,
      "PM2.5 (µg/m³)": latest.field4,
      "PM10 (µg/m³)": latest.field5,
      "CO (ppm)": latest.field6,
      "NH3 (ppm)": latest.field7,
      "CH4 (ppm)": latest.field8,
    };

    const gaugesContainer = document.getElementById("gauges");
    gaugesContainer.innerHTML = "";
    for (let [label, value] of Object.entries(sensors)) {
      gaugesContainer.innerHTML += `
        <div class="card">
          <h2>${label}</h2>
          <p>${value ?? "N/A"}</p>
        </div>
      `;
    }

    document.getElementById("last-updated").innerText =
      "Last Updated: " + new Date(latest.created_at).toLocaleString();
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

fetchData();
setInterval(fetchData, 10000); // every 10 seconds
