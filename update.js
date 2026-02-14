const axios = require("axios");
const fs = require("fs");
const xml2js = require("xml2js");

const PUBG_API_KEY = process.env.PUBG_API_KEY;

async function updateData() {
  let pubgData = {};
  let weatherData = {};
  let lastCommitDate = null;
  let steamStatus = "unknown";

  try {
    // PUBG Stats
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
    // Spielername und Plattform
    const pubgData = {
      name: player.attributes.name,
      shard: player.attributes.shardId,
      lastMatches: [] // wird mit Details gefüllt
    };
    // IDs der letzten 5 Matches
    const lastMatchIds = player.relationships.matches.data
      .slice(0, 5)
      .map(m => m.id);
    // Details der letzten 5 Matches abrufen
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
        // Nur relevante Infos extrahieren (Beispiel: Kills, Platzierung, Schaden)
        const participant = matchRes.data.included.find(
          p => p.type === "participant" && p.attributes.stats.name === player.attributes.name
        );
        if (participant) {
          pubgData.lastMatches.push({
            matchId: matchId,
            kills: participant.attributes.stats.kills,
            placement: participant.attributes.stats.winPlace,
            damage: participant.attributes.stats.damageDealt,
            matchType: matchRes.data.data.attributes.gameMode
          });
        }
      } catch (err) {
        console.error("Error fetching match", matchId, err.message);
      }
    }
    console.log("PUBG Data fetched");
  } catch (err) {
    console.error("Error fetching PUBG player data:", err.message);
  }

  try {
    // Wetter
    const weatherRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=48.7823&longitude=9.177&current_weather=true"
    );
    weatherData = weatherRes.data;
    console.log("Weather Data fetched");
  } catch (err) {
    console.error("Error fetching weather data:", err.message);
  }

  try {
    // GitHub letzte Änderung
    const githubRes = await axios.get(
      "https://api.github.com/repos/joeyws/joeyws.com/commits"
    );
    githubLastModified = githubRes.data[0].commit.committer.date;
    console.log("GitHub last commit fetched");
  } catch (err) {
    console.error("Error fetching GitHub commits:", err.message);
  }

  try {
    // Steam Status
    const steamXmlRes = await axios.get(
      "https://api.allorigins.win/get?url=" +
        encodeURIComponent("https://steamcommunity.com/id/joeyws2?xml=1")
    );
    const parser = new xml2js.Parser();
    const parsedSteam = await parser.parseStringPromise(steamXmlRes.data.contents);
    var steamStatus = parsedSteam.profile.onlineState[0];
    console.log("Steam Status fetched:", steamStatus);
  } catch (err) {
    console.error("Error fetching Steam status:", err.message);
    var steamStatus = "unknown";
  }

  // Alles zusammenführen
  const combinedData = {
    pubg: pubgData,
    weather: weatherData,
    lastModified: lastCommitDate,
    steam: {
      status: steamStatus
    }
  };

  fs.writeFileSync("data.json", JSON.stringify(combinedData, null, 2));
  console.log("data.json updated successfully!");
}

updateData().catch(err => console.error("Fatal error:", err));