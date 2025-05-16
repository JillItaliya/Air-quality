const channelId = "2840003";
const apiKey = "MGNZSLNC7UYHDF8V";
const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&minutes=60`;

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

async function fetchDataAndPlot() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const feeds = data.feeds;

    const timeLabels = feeds.map(feed => new Date(feed.created_at).toLocaleTimeString());

    const datasets = Object.entries(sensorLabels).map(([fieldKey, label], index) => {
      const sensorData = feeds.map(feed => parseFloat(feed[fieldKey]) || null);
      const color = `hsl(${index * 45}, 70%, 50%)`;

      return {
        label,
        data: sensorData,
        borderColor: color,
        fill: false,
        tension: 0.1,
      };
    });

    const ctx = document.getElementById("lineChart").getContext("2d");
    if (window.sensorChart) {
      window.sensorChart.data.labels = timeLabels;
      window.sensorChart.data.datasets = datasets;
      window.sensorChart.update();
    } else {
      window.sensorChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: timeLabels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Sensor Data (Last 1 Hour)",
            },
          },
          interaction: {
            mode: "index",
            intersect: false,
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
                text: "Value",
              },
            },
          },
        },
      });
    }

    const lastUpdated = feeds.length > 0 ? feeds[feeds.length - 1].created_at : "N/A";
    document.getElementById("last-updated").innerText = "Last Updated: " + new Date(lastUpdated).toLocaleString();
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

fetchDataAndPlot();
setInterval(fetchDataAndPlot, 60000); // refresh every 1 minute
