const axios = require("axios");
const fs = require("fs");
const xml2js = require("xml2js");

const PUBG_API_KEY = process.env.PUBG_API_KEY;

async function updateData() {
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

  // Wetter
  const weatherRes = await axios.get(
    "https://api.open-meteo.com/v1/forecast?latitude=48.7823&longitude=9.177&current_weather=true"
  );

  // GitHub letzte Änderung
  const githubRes = await axios.get(
    "https://api.github.com/repos/joeyws/joeyws.com/commits"
  );
  const lastCommitDate = githubRes.data[0].commit.committer.date;

  // Steam Status (via AllOrigins Proxy)
  const steamXmlRes = await axios.get(
    "https://api.allorigins.win/get?url=" + encodeURIComponent("https://steamcommunity.com/id/joeyws2?xml=1")
  );

  // XML parsen
  const parser = new xml2js.Parser();
  const parsedSteam = await parser.parseStringPromise(steamXmlRes.data.contents);

  const steamStatus = parsedSteam.profile.onlineState[0];
  const steamName = parsedSteam.profile.steamID[0];
  const steamAvatar = parsedSteam.profile.avatarFull[0];

  // Alles zusammenführen
  const combinedData = {
    pubg: pubgRes.data,
    weather: weatherRes.data,
    lastModified: lastCommitDate,
    steam: {
      status: steamStatus,
      name: steamName,
      avatar: steamAvatar,
      raw: parsedSteam.profile
    }
  };

  fs.writeFileSync("data.json", JSON.stringify(combinedData, null, 2));
  console.log("Daten aktualisiert!");
}

updateData().catch(console.error);