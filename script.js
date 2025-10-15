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
        merged[id].Usernames = entry.Usernames; // latest usernames
        merged[id].TotalWorth += entry.AverageWorthInTime;
      }
    });

    // Convert to array + sort by total worth descending
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
    const div = document.createElement("div");
    div.className = "entry tooltip"; // entire block has tooltip
    div.innerHTML = `
      <div class="spot">#${i + 1}</div>
      <div class="username">${latestUsername}</div>
      <div class="worth">$${scammer.TotalWorth.toLocaleString()}</div>
      <span class="tooltiptext">UUID: ${scammer.Steam64ID}</span>
    `;
    leaderboardDiv.appendChild(div);
  });
}

// Load the leaderboard on page load
loadData();
