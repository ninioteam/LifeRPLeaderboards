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
        merged[id].Usernames = entry.Usernames;
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

    const box = document.createElement("div");
    box.className = "entry-box";
    box.innerHTML = `
      <span class="spot">#${i + 1}</span>
      <span class="username">${latestUsername}</span>
      <span class="worth">$${scammer.TotalWorth.toLocaleString()}</span>
      <span class="tooltiptext">Steam64: ${scammer.Steam64ID}</span>
    `;

    // Click to copy UUID
    box.addEventListener("click", () => {
      navigator.clipboard.writeText(scammer.Steam64ID)
        .then(() => {
          // Optional: show temporary confirmation
          const tooltip = box.querySelector(".tooltiptext");
          const originalText = tooltip.textContent;
          tooltip.textContent = "Copied!";
          tooltip.style.visibility = "visible";
          tooltip.style.opacity = "1";
          setTimeout(() => {
            tooltip.textContent = originalText;
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
          }, 1000);
        })
        .catch(err => console.error("Failed to copy:", err));
    });

    leaderboardDiv.appendChild(box);
  });
}

loadData();
