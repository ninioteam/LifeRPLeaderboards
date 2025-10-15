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
        merged[id].Usernames = entry.Usernames; // latest username
        merged[id].TotalWorth += entry.AverageWorthInTime;
      }
    });

    // Sort descending by TotalWorth
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

    // Create box div
    const box = document.createElement("div");
    box.className = "entry-box";

    // Add spot, username, worth, and tooltip
    box.innerHTML = `
      <span class="spot">#${i + 1}</span>
      <span class="username">${latestUsername}</span>
      <span class="worth">$${scammer.TotalWorth.toLocaleString()}</span>
      <span class="tooltiptext">UUID: ${scammer.Steam64ID}</span>
    `;

    leaderboardDiv.appendChild(box);
  });
}

// Load on page load
loadData();
