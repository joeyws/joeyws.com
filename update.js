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
        console.error("PUBG match data", matchId, err.message);
      }
    }
    console.log("PUBG: ok");
  } catch (err) {
    console.error("PUBG: ", err.message);
  }

  // weather temperatur
  try {
    const weatherRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=48.7823&longitude=9.177&current_weather=true"
    );
    var weather = Math.round(weatherRes.data.current_weather.temperature);
    console.log("Weather: ok");
  } catch (err) {
    console.error("Weather: ", err.message);
    var weather = null;
  }

  try {
    // github last commit
    const githubRes = await axios.get(
      "https://api.github.com/repos/joeyws/joeyws.com/commits"
    );
    githubLastModified = githubRes.data[0].commit.committer.date;
    console.log("GitHub: ok");
  } catch (err) {
    console.error("GitHub: ", err.message);
  }

  try {
    // steam status
    const steamXmlRes = await axios.get(
      "https://api.allorigins.win/get?url=" +
        encodeURIComponent("https://steamcommunity.com/id/joeyws2?xml=1")
    );
    const parser = new xml2js.Parser();
    const parsedSteam = await parser.parseStringPromise(steamXmlRes.data.contents);
    var steamStatus = parsedSteam.profile.onlineState[0];
    console.log("Steam Status fetched:", steamStatus);
  } catch (err) {
    console.error("Steam: ", err.message);
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