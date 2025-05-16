const channelId = "2840003";
const apiKey = "MGNZSLNC7UYHDF8V";
const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=8000`;

const sensorLabels = {
  field1: "eCO₂ (ppm)",
  field2: "TVOC (ppb)",
  field3: "H₂S (ppm)",
  field4: "PM2.5 (µg/m³)",
  field5: "PM10 (µg/m³)",
  field6: "CO (ppm)",
  field7: "NH3 (ppm)",
  field8: "CH4 (ppm)",
};

async function fetchAndPlot() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const feeds = data.feeds;
    const container = document.getElementById("charts-container");
    container.innerHTML = "";

    const timeLabels = feeds.map(feed =>
      new Date(feed.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    Object.entries(sensorLabels).forEach(([fieldKey, label], index) => {
      const values = feeds.map(feed => feed[fieldKey] !== null ? parseFloat(feed[fieldKey]) : null);
      const hasData = values.some(v => v !== null);

      if (!hasData) return; // Skip if this sensor has no data

      const canvasId = `chart-${fieldKey}`;
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${label}</h2>
        <canvas id="${canvasId}" width="400" height="200"></canvas>
      `;
      container.appendChild(card);

      const ctx = document.getElementById(canvasId).getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: timeLabels,
          datasets: [
            {
              label: label,
              data: values,
              borderColor: `hsl(${index * 40}, 70%, 50%)`,
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.25,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              title: {
                display: true,
                text: label,
              },
            },
          },
        },
      });
    });

    const last = feeds.length > 0 ? feeds[feeds.length - 1].created_at : "N/A";
    document.getElementById("last-updated").innerText =
      "Last Updated: " + new Date(last).toLocaleString();
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

fetchAndPlot();
setInterval(fetchAndPlot, 10 * 60 * 1000); // refresh every 10 minutes
