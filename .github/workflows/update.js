const axios = require("axios");
const fs = require("fs");

const API_KEY = process.env.PUBG_KEY;
const PLAYER_NAME = "joeyws2";

async function updateStats() {
  const res = await axios.get(
    `https://api.pubg.com/shards/steam/players?filter[playerNames]=${PLAYER_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/vnd.api+json"
      }
    }
  );

  fs.writeFileSync("stats.json", JSON.stringify(res.data, null, 2));
}

updateStats();