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
    console.log("Weather: ok (" + weatherTempCelsius + ")");
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

    function formatMatchStart(matchStartIso) {
      const matchDate = new Date(matchStartIso);
      const now = new Date();
      const isToday =
        matchDate.getFullYear() === now.getFullYear() &&
        matchDate.getMonth() === now.getMonth() &&
        matchDate.getDate() === now.getDate();
      const hours = matchDate.getHours().toString().padStart(2, "0");
      const minutes = matchDate.getMinutes().toString().padStart(2, "0");
      if (isToday) return `${hours}:${minutes}`;
      const day = matchDate.getDate().toString().padStart(2, "0");
      const month = (matchDate.getMonth() + 1).toString().padStart(2, "0");
      return `${day}.${month}. ${hours}:${minutes}`;
    }

    pubgData = {
      name: player.attributes.name,
      lastMatches: []
    };

    const lastMatchIds = player.relationships.matches.data
      .slice(0, 10)
      .map((m) => m.id);

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

        const participants = matchRes.data.included.filter(
          (p) => p.type === "participant"
        );
        const participant = participants.find(
          (p) => p.attributes.stats.name === player.attributes.name
        );

        if (participant) {
          const matchStartIso = matchRes.data.data.attributes.createdAt;
          const matchStart = formatMatchStart(matchStartIso);

          let rawMatchType = matchRes.data.data.attributes.gameMode;
          let [teamSize, perspective] = rawMatchType.split("-");
          if (!perspective || perspective === "") perspective = "TPP";
          teamSize =
            teamSize.charAt(0).toUpperCase() + teamSize.slice(1).toLowerCase();
          perspective = perspective.toUpperCase();

          // teammates
          const teamMates = participants
            .filter(
              (p) =>
                p.attributes.stats.teamId === participant.attributes.stats.teamId &&
                p.attributes.stats.name !== player.attributes.name
            )
            .map((p) => p.attributes.stats.name);

          // distance in km
          const distanceKm =
            participant.attributes.stats.walkDistance +
            participant.attributes.stats.rideDistance +
            participant.attributes.stats.swimDistance;
          const distance = Math.round(distanceKm / 100) / 10;

          // survival time in minutes:seconds
          const survivalSeconds = participant.attributes.stats.timeSurvived;
          const minutes = Math.floor(survivalSeconds / 60);
          const seconds = Math.floor(survivalSeconds % 60);
          const survivalTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

          // replay link
          const participantIndexInIncluded = matchRes.data.included.findIndex(
            (p) => p.type === "participant" && p.attributes.stats.name === player.attributes.name
          );
          const replayIndex = participantIndexInIncluded + 1;
          const gameMode = rawMatchType;
          const region = "eu";
          const dateObj = new Date(matchStartIso);
          const year = dateObj.getFullYear();
          const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
          const day = dateObj.getDate().toString().padStart(2, "0");
          const hour = dateObj.getHours().toString().padStart(2, "0");
          const url = `https://bridge.pubg.com/de/2d-replay/match.bro.official.pc-2018-40.steam.${gameMode}.${region}.${year}.${month}.${day}.${hour}.${matchId}?index=${replayIndex}`;

          pubgData.lastMatches.push({
            matchStart,
            teamSize,
            teamMates,
            perspective,
            placement: participant.attributes.stats.winPlace,
            survivalTime,
            distance,
            kills: participant.attributes.stats.kills,
            assists: participant.attributes.stats.assists,
            damage: Math.round(participant.attributes.stats.damageDealt),
            url
          });
        }

        console.log("PUBG match data: ok");
      } catch (err) {
        console.error("PUBG match data:", matchId, err.message);
      }
    }
    console.log("PUBG general: ok");
  } catch (err) {
    console.error("PUBG general:", err.message);
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