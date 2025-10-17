const leaderboardDiv = document.getElementById("leaderboard");
const dataUrl = "https://raw.githubusercontent.com/ninioteam/LifeRPScammerList/refs/heads/main/scammer/ScammerData.json";

async function loadData() {
  try {
    const res = await fetch(dataUrl);
    const text = await res.text();
    const data = JSON.parse(text);

    // Sort by Spot (optional)
    const sorted = data.sort((a, b) => a.Spot - b.Spot);

    renderLeaderboardList(sorted);

  } catch (err) {
    leaderboardDiv.innerHTML = "<p style='color:red;'>Failed to load data.</p>";
    console.error(err);
  }
}

function renderLeaderboardList(list) {
  leaderboardDiv.innerHTML = "";

  list.forEach(item => {
    const box = document.createElement("div");
    box.className = "entry-box";
    box.innerHTML = `
      <span class="leaderboard-name">${item.Name}</span>
    `;

    // ✅ Open the leaderboard link from JSON
    box.addEventListener("click", () => {
      if (item.Link) {
        window.open(item.Link, "_blank", "noopener");
      } else {
        console.warn("No link provided for:", item.Name);
      }
    });

    leaderboardDiv.appendChild(box);
  });
}

loadData();
