const leaderboardDiv = document.getElementById("leaderboard");
const dataUrl = "https://raw.githubusercontent.com/ninioteam/LifeRPScammerList/refs/heads/main/ScammerData.json";

async function loadData() {
  try {
    const res = await fetch(dataUrl);
    const data = await res.json();
    // Sort by worth (highest first)
    data.sort((a, b) => b.AverageWorthInTime - a.AverageWorthInTime);
    renderLeaderboard(data);
    loopLeaderboard(data);
  } catch (err) {
    leaderboardDiv.innerHTML = "<p style='color:red;'>Failed to load data.</p>";
    console.error(err);
  }
}

function renderLeaderboard(data) {
  leaderboardDiv.innerHTML = ""; // clear old entries
  data.forEach((scammer, i) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div class="username">#${i + 1} — ${scammer.Usernames.join(", ")} ${scammer.ChangedUsername ? "(Changed Name)" : ""}</div>
      <div class="worth">💰 Worth: $${scammer.AverageWorthInTime.toLocaleString()}</div>
      <div class="stuff">🎒 Items: ${scammer.StuffScammed.join(", ")}</div>
      <div class="date">📅 Date: ${scammer.ScamDate}</div>
      <div class="steam">🔗 Steam64: ${scammer.Steam64ID}</div>
      <div class="evidence">📸 Evidence: ${scammer.Evidence.map(e => `<a href="${e}" target="_blank">[View]</a>`).join(" ")}</div>
    `;
    leaderboardDiv.appendChild(div);
  });
}

// optional: auto-loop every few seconds
function loopLeaderboard(data) {
  let index = 0;
  setInterval(() => {
    leaderboardDiv.innerHTML = "";
    const entry = data[index];
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div class="username">${entry.Usernames.join(", ")} ${entry.ChangedUsername ? "(Changed Name)" : ""}</div>
      <div class="worth">💰 Worth: $${entry.AverageWorthInTime.toLocaleString()}</div>
      <div class="stuff">🎒 ${entry.StuffScammed.join(", ")}</div>
      <div class="date">📅 ${entry.ScamDate}</div>
      <div class="steam">🔗 Steam64: ${entry.Steam64ID}</div>
      <div class="evidence">📸 ${entry.Evidence.map(e => `<a href="${e}" target="_blank">[View]</a>`).join(" ")}</div>
    `;
    leaderboardDiv.appendChild(div);

    index = (index + 1) % data.length;
  }, 5000);
}

loadData();

