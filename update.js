const axios = require("axios");
const fs = require("fs");

const PUBG_API_KEY = process.env.PUBG_API_KEY;

async function updateStats() {
  const res = await axios.get(
    `https://api.pubg.com/shards/steam/players?filter[playerNames]=joeyws2`,
    {
      headers: {
        Authorization: `Bearer ${PUBG_API_KEY}`,
        Accept: "application/vnd.api+json"
      }
    }
  );

  fs.writeFileSync("stats.json", JSON.stringify(res.data, null, 2));
}

updateStats();