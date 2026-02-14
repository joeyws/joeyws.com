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
    steamStatus = parsedSteam.profile.onlineState[0];
    console.log("Steam: ok");
  } catch (err) {
    console.error("Steam:", err.message);
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
        console.error("PUBG clan:", clanName);
      } catch (err) {
        console.error("PUBG clan:", err.message);
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
        const participant = matchRes.data.included.find(
          p => p.type === "participant" && p.attributes.stats.name === player.attributes.name
        );
        if (participant) {
          let matchEndIso = "ongoing";
          if (matchRes.data.data.attributes.duration) {
            const matchStart = new Date(matchRes.data.data.attributes.createdAt);
            const matchDurationSec = matchRes.data.data.attributes.duration; // Sekunden
            const matchEnd = new Date(matchStart.getTime() + matchDurationSec * 1000);
            matchEndIso = matchEnd.toISOString();
          }
          pubgData.lastMatches.push({
            matchEnd: matchEndIso,
            matchType: matchRes.data.data.attributes.gameMode,
            placement: participant.attributes.stats.winPlace,
            kills: participant.attributes.stats.kills,
            damage: participant.attributes.stats.damageDealt
          });
        }
        console.error("PUBG match data: ok");
      } catch (err) {
        console.error("PUBG match data:", matchId, err.message);
      }
    }
    console.log("PUBG player data: ok");
  } catch (err) {
    console.error("PUBG player data:", err.message);
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