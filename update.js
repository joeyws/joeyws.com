const axios = require("axios");
const fs = require("fs");
const xml2js = require("xml2js");

const PUBG_API_KEY = process.env.PUBG_API_KEY;

async function updateData() {
  let weatherTempCelsius = null;
  let githubLastCommit = null;
  let steamStatus = "unknown";
  let pubgData = {};

  // Timestamp
  function getTimestamp() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  // Weather: Temp in degree celsius
  try {
    const weatherRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=48.7823&longitude=9.177&current_weather=true"
    );
    weatherTempCelsius = Math.round(weatherRes.data.current_weather.temperature);
    console.log("Weather:", weatherTempCelsius);
  } catch (err) {
    console.error("Weather:", err.message);
  }

  // GitHub: Last Commit
  try {
    const githubRes = await axios.get(
      "https://api.github.com/repos/joeyws/joeyws.com/commits"
    );
    const rawDate = githubRes.data[0].commit.author.date;
    const date = new Date(rawDate);
    githubLastCommit = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    console.log("GitHub: ok (" + githubLastCommit + ")");
  } catch (err) {
    console.error("GitHub:", err.message);
  }

  // Steam Status
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
    console.log("Steam: ok (" + steamStatus + ")");
  } catch (err) {
    console.log("Steam:", err.message);
  }

  // PUBG Stats
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

    // Clan name
    const clanId = player.attributes.clanId || null;
    let clanName = null;
    if (clanId && clanId !== "null") {
      try {
        const clanRes = await axios.get(
          `https://api.pubg.com/shards/steam/clans/${clanId}`,
          {
            headers: {
              Authorization: `Bearer ${PUBG_API_KEY}`,
              Accept: "application/vnd.api+json"
            }
          }
        );
        clanName = clanRes.data.data.attributes.name || null;
        console.log("PUBG clan name: ok (" + clanName + ")");
      } catch (err) {
        console.error("PUBG clan fetch error:", err.message);
      }
    }

    // Format match start time
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

    // Prepare data structure
    pubgData = {
      name: player.attributes.name,
      clan: clanName,
      lastMatches: []
    };

    // Last 5 matches
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

        // Player participant
        const participant = matchRes.data.included.find(
          p => p.type === "participant" && p.attributes.stats.name === player.attributes.name
        );

        if (participant) {
          const matchStartIso = matchRes.data.data.attributes.createdAt;
          const matchStart = formatMatchStart(matchStartIso);

          // Match type
          let rawMatchType = matchRes.data.data.attributes.gameMode;
          let [teamSize, perspective] = rawMatchType.split("-");
          if (!perspective || perspective === "") perspective = "TPP";
          teamSize = teamSize.charAt(0).toUpperCase() + teamSize.slice(1).toLowerCase();
          perspective = perspective.toUpperCase();

          // Survival time
          const stats = participant.attributes.stats;
          const survivalSeconds = stats.timeSurvived || 0;
          const survivalMinutes = Math.floor(survivalSeconds / 60)
            .toString()
            .padStart(2, "0");
          const survivalRemainSeconds = Math.floor(survivalSeconds % 60)
            .toString()
            .padStart(2, "0");
          const survivalTime = `${survivalMinutes}:${survivalRemainSeconds}`;

          // Distance in km
          const totalDistanceMeters =
            (stats.walkDistance || 0) +
            (stats.rideDistance || 0) +
            (stats.swimDistance || 0);
          const distanceKm = parseFloat((totalDistanceMeters / 1000).toFixed(2));

          // TeamMates
          const roster = matchRes.data.included.find(
            r =>
              r.type === "roster" &&
              r.relationships.participants.data.some(p => p.id === participant.id)
          );

          let teamMates = [];
          if (roster) {
            const teammateIds = roster.relationships.participants.data.map(p => p.id);
            teamMates = matchRes.data.included
              .filter(
                p =>
                  p.type === "participant" &&
                  teammateIds.includes(p.id) &&
                  p.id !== participant.id
              )
              .map(p => p.attributes.stats.name);
          }

          // Push match data
          pubgData.lastMatches.push({
            matchStart: matchStart,
            teamSize: teamSize,
            teamMates: teamMates,
            perspective: perspective,
            placement: stats.winPlace,
            survivalTime: survivalTime,
            distance: distanceKm,
            kills: stats.kills,
            assists: stats.assists,
            damage: Math.round(stats.damageDealt)
          });
        }

        console.log("PUBG match data ok");
      } catch (err) {
        console.error("PUBG match data error:", matchId, err.message);
      }
    }

    console.log("PUBG general ok");
  } catch (err) {
    console.error("PUBG general error:", err.message);
  }

  // combine data
  const combinedData = {
    timestamp: getTimestamp(),
    weatherTempCelsius: weatherTempCelsius,
    githubLastCommit: githubLastCommit,
    steamStatus: steamStatus,
    pubg: pubgData
  };
  fs.writeFileSync("data.json", JSON.stringify(combinedData, null, 2));
  console.log("data.json updated");
}

updateData().catch(err => console.error("Fatal error:", err));