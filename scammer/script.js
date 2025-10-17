const leaderboardDiv = document.getElementById("leaderboard");
const dataUrl = "https://raw.githubusercontent.com/ninioteam/LifeRPScammerList/refs/heads/main/scammer/ScammerData.json";

async function loadData() {
  try {
    const res = await fetch(dataUrl);
    const text = await res.text();

    // Parse manually to keep Steam64ID as string (avoid rounding)
    const data = JSON.parse(text, (key, value) => {
      if (key === "Steam64ID") return String(value);
      return value;
    });

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

    const tooltip = box.querySelector(".tooltiptext");

    // Click to copy ID
    box.addEventListener("click", () => {
      navigator.clipboard.writeText(scammer.Steam64ID)
        .then(() => {
          const originalText = `Steam64: ${scammer.Steam64ID}`;
          tooltip.textContent = "Copied!";
          tooltip.style.color = "#ffcc00";
          setTimeout(() => {
            tooltip.textContent = originalText;
            tooltip.style.color = "#00ff99";
          }, 1000);
        })
        .catch(err => console.error("Failed to copy:", err));
    });

    leaderboardDiv.appendChild(box);
  });
}

loadData();
