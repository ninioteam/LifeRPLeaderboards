const leaderboardDiv = document.getElementById("leaderboard");
const dataUrl = "https://raw.githubusercontent.com/ninioteam/LifeRPScammerList/refs/heads/main/ScammerData.json";

async function loadData() {
  try {
    const res = await fetch(dataUrl);
    const data = await res.json();

    // Combine scammers by Steam64ID
    const merged = {};
    data.forEach(entry => {
      const id = entry.Steam64ID;
      if (!merged[id]) {
        merged[id] = {
          Steam64ID: id,
          Usernames: new Set(entry.Usernames),
          ChangedUsername: entry.ChangedUsername,
          StuffScammed: new Set(entry.StuffScammed),
          TotalWorth: entry.AverageWorthInTime,
          Evidence: [...entry.Evidence],
          LastScamDate: entry.ScamDate
        };
      } else {
        entry.Usernames.forEach(u => merged[id].Usernames.add(u));
        entry.StuffScammed.forEach(i => merged[id].StuffScammed.add(i));
        merged[id].TotalWorth += entry.AverageWorthInTime;
        merged[id].Evidence.push(...entry.Evidence);
        merged[id].LastScamDate = entry.ScamDate; // latest entry date
      }
    });

    // Convert merged object to array
    const scammers = Object.values(merged);

    // Sort by total worth (highest first)
    scammers.sort((a, b) => b.TotalWorth - a.TotalWorth);

    renderLeaderboard(scammers);
    loopLeaderboard(scammers);

  } catch (err) {
    leaderboardDiv.innerHTML = "<p style='color:red;'>Failed to load data.</p>";
    console.error(err);
  }
}

function renderLeaderboard(data) {
  leaderboardDiv.innerHTML = "";
  data.forEach((scammer, i) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div class="username">#${i + 1} — ${Array.from(scammer.Usernames).join(", ")} ${scammer.ChangedUsername ? "(Changed Name)" : ""}</div>
      <div class="worth">💰 Total Worth: $${scammer.TotalWorth.toLocaleString()}</div>
      <div class="stuff">🎒 Items: ${Array.from(scammer.StuffScammed).join(", ")}</div>
      <div class="date">📅 Last Scam Date: ${scammer.LastScamDate}</div>
      <div class="steam">🔗 Steam64: ${scammer.Steam64ID}</div>
      <div class="evidence">📸 Evidence: ${scammer.Evidence.map(e => `<a href="${e}" target="_blank">[View]</a>`).join(" ")}</div>
    `;
    leaderboardDiv.appendChild(div);
  });
}

// 🔁 Loop through scammers every few seconds
function loopLeaderboard(data) {
  let index = 0;
  setInterval(() => {
    const scammer = data[index];
    leaderboardDiv.innerHTML = "";

    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div class="username">${Array.from(scammer.Usernames).join(", ")} ${scammer.ChangedUsername ? "(Changed Name)" : ""}</div>
      <div class="worth">💰 Total Worth: $${scammer.TotalWorth.toLocaleString()}</div>
      <div class="stuff">🎒 ${Array.from(scammer.StuffScammed).join(", ")}</div>
      <div class="date">📅 Last Scam Date: ${scammer.LastScamDate}</div>
      <div class="steam">🔗 Steam64: ${scammer.Steam64ID}</div>
      <div class="evidence">📸 ${scammer.Evidence.map(e => `<a href="${e}" target="_blank">[View]</a>`).join(" ")}</div>
    `;

    leaderboardDiv.appendChild(div);
    index = (index + 1) % data.length;
  }, 5000); // change every 5 seconds
}

loadData();
