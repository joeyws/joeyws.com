const axios = require("axios");
const fs = require("fs");
const xml2js = require("xml2js");

const PUBG_API_KEY = process.env.PUBG_API_KEY;

async function updateData() {
  let pubgData = {};
  let weather = null;
  let githubLastModified = null;
  let steamStatus = "unknown";

  // weather
  try {
    const weatherRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=48.7823&longitude=9.177&current_weather=true"
    );
    weatherTempCelsius = Math.round(weatherRes.data.current_weather.temperature);
    console.log("Weather: ok");
  } catch (err) {
    console.error("Weather:", err.message);
  }

  // github last commit
  try {
    const githubRes = await axios.get(
      "https://api.github.com/repos/joeyws/joeyws.com/commits"
    );
    const rawDate = githubRes.data[0].commit.author.date;
    const date = new Date(rawDate);
    githubLastModified = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    console.log("GitHub: ok");
  } catch (err) {
    console.error("GitHub:", err.message);
  }

  // steam status
  try {
    const steamXmlRes = await axios.get(
      "https://api.allorigins.win/get?url=" +
        encodeURIComponent("https://steamcommunity.com/id/joeyws2?xml=1")
    );
    const parser = new xml2js.Parser();
    const parsedSteam = await parser.parseStringPromise(steamXmlRes.data.contents);
    const rawStatus = parsedSteam.profile.onlineState[0];
    const onlineStates = ["online", "in-game", "away", "busy"];
    steamStatus = onlineStates.includes(rawStatus.toLowerCase()) ? "online" : "offline";
    console.log("Steam: ok");
  } catch (err) {
    console.log("Steam:", err.message);
  }

  // pubg stats
  try {
    const pubgRes = await axios.get(
      `https://api.pubg.com/shards/steam/players?filter[playerNames]=joeyws2`,
      {
        headers: {
          Authorization: `Bearer ${PUBG_API_KEY}`,
          Accept: "application/vnd.api+json"
        }
      }
    );
    const player = pubgRes.data.data[0];
    // clan name
    let clanName = null;
    if (player.attributes.clanId) {
      try {
        const clanRes = await axios.get(
          `https://api.pubg.com/shards/steam/clans/${player.attributes.clanId}`,
          {
            headers: {
              Authorization: `Bearer ${PUBG_API_KEY}`,
              Accept: "application/vnd.api+json"
            }
          }
        );
        clanName = clanRes.data.data.attributes.name;
      } catch (err) {
        console.error("PUBG clan fetch error:", err.message);
      }
    }
    // match start time
    function formatMatchStart(matchStartIso) {
      const matchDate = new Date(matchStartIso);
      const now = new Date();
      const isToday =
        matchDate.getFullYear() === now.getFullYear() &&
        matchDate.getMonth() === now.getMonth() &&
        matchDate.getDate() === now.getDate();
      const hours = matchDate.getHours().toString().padStart(2, "0");
      const minutes = matchDate.getMinutes().toString().padStart(2, "0");
      if (isToday) {
        return `${hours}:${minutes}`;
      } else {
        const day = matchDate.getDate().toString().padStart(2, "0");
        const month = (matchDate.getMonth() + 1).toString().padStart(2, "0");
        return `${day}.${month}. ${hours}:${minutes}`;
      }
    }
    // Grunddaten vorbereiten
    pubgData = {
      name: player.attributes.name,
      clan: clanName,
      lastMatches: []
    };
    // last 5 matches
    const lastMatchIds = player.relationships.matches.data.slice(0, 5).map(m => m.id);
    for (const matchId of lastMatchIds) {
      try {
        const matchRes = await axios.get(
          `https://api.pubg.com/shards/steam/matches/${matchId}`,
          {
            headers: {
              Authorization: `Bearer ${PUBG_API_KEY}`,
              Accept: "application/vnd.api+json"
            }
          }
        );
        // match stats
        const participant = matchRes.data.included.find(
          p => p.type === "participant" && p.attributes.stats.name === player.attributes.name
        );
        if (participant) {
          const matchStartIso = matchRes.data.data.attributes.createdAt;
          const matchStart = formatMatchStart(matchStartIso);
          let matchType = matchRes.data.data.attributes.gameMode.replace(/-/g, " ");
          pubgData.lastMatches.push({
            matchStart: matchStart,
            matchType: matchType,
            placement: participant.attributes.stats.winPlace,
            kills: participant.attributes.stats.kills,
            damage: Math.round(participant.attributes.stats.damageDealt)
          });
        }
        console.error("PUBG match data: ok");
      } catch (err) {
        console.error("PUBG match data:", matchId, err.message);
      }
    }
    console.log("PUBG player: ok");
  } catch (err) {
    console.error("PUBG player:", err.message);
  }

  // combine data
  const combinedData = {
    timestamp: new Date().toISOString(),
    weather: weather,
    githubLastModified: githubLastModified,
    steamStatus: steamStatus,
    pubg: pubgData
  };

  fs.writeFileSync("data.json", JSON.stringify(combinedData, null, 2));
  console.log("data.json updated");
}

updateData().catch(err => console.error("Fatal error:", err));