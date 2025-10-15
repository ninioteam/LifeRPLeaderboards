const leaderboardDiv = document.getElementById("leaderboard");
const dataUrl = "https://raw.githubusercontent.com/ninioteam/LifeRPScammerList/refs/heads/main/ScammerData.json";

async function loadData() {
  try {
    const res = await fetch(dataUrl);
    const data = await res.json();

    // Merge scammers by Steam64ID
    const merged = {};
    data.forEach(entry => {
      const id = entry.Steam64ID;
      if (!merged[id]) {
        merged[id] = {
          Steam64ID: id,
          Usernames: entry.Usernames,
          TotalWorth: entry.AverageWorthInTime
        };
      } else {
        merged[id].Usernames = entry.Usernames; // use latest username
        merged[id].TotalWorth += entry.AverageWorthInTime;
      }
    });

    // Convert to array + sort descending
    const scammers = Object.values(merged).sort((a, b) => b.TotalWorth - a.TotalWorth);

    // Render leaderboard
    renderLeaderboard(scammers);

  } catch (err) {
    leaderboardDiv.innerHTML = "<p style='color:red;'>Failed to load data.</p>";
    console.error(err);
  }
}

function renderLeaderboard(data) {
  leaderboardDiv.innerHTML = "";
  data.forEach((scammer, i) => {
    const latestUsername = scammer.Usernames[scammer.Usernames.length - 1];

    // Create entry div
    let entryDiv = document.createElement("div");
    entryDiv.textContent = `#${i + 1} ${latestUsername} $${scammer.TotalWorth.toLocaleString()}`;

    // Tooltip span
    const tooltip = document.createElement("span");
    tooltip.className = "tooltiptext";
    tooltip.textContent = `UUID: ${scammer.Steam64ID}`;

    entryDiv.appendChild(tooltip);
    leaderboardDiv.appendChild(entryDiv);
  });
}

// Load leaderboard on page load
loadData();
