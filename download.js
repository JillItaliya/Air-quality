const channelId = "2840003";
const apiKey = "MGNZSLNC7UYHDF8V";

document.getElementById('downloadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const gasField = document.getElementById('gasField').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  const start = new Date(startDate).toISOString();
  const end = new Date(endDate).toISOString();

  const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&start=${start}&end=${end}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const feeds = data.feeds;

    if (feeds.length === 0) {
      alert("No data available for selected dates.");
      return;
    }

    let csvContent = "Timestamp,Value\n";
    for (const feed of feeds) {
      csvContent += `${feed.created_at},${feed[gasField] ?? "N/A"}\n`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${gasField}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Download error:', error);
    alert('Something went wrong while downloading data.');
  }
});
