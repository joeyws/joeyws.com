const axios = require("axios");
const fs = require("fs");
const xml2js = require("xml2js");

const PUBG_API_KEY = process.env.PUBG_API_KEY;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

async function updateData() {
  let weatherTempCelsius = null;
  let githubLastCommit = null;
  let steamStatus = null;
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
      "https://api.github.com/repos/joeyws/joeyws.com/commits",
      {headers: { "User-Agent": "joeyws-app" }}
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
  /* try {
    const steamXmlRes = await axios.get(
      "https://api.allorigins.win/get?url=" +
        encodeURIComponent("https://steamcommunity.com/id/joeyws2?xml=1")
    );
    const parser = new xml2js.Parser();
    const parsedSteam = await parser.parseStringPromise(steamXmlRes.data.contents);
    const rawStatus = parsedSteam.profile.onlineState[0];
    const onlineStates = ["online", "in-game", "away", "busy"];
    steamStatus = onlineStates.includes(rawStatus.toLowerCase()) ? "online" : "offline";
    console.log(`Steam: ok (${steamStatus})`);
  } catch (err) {
    console.error("Steam:", err.message);
  } */
  try {
    const res = await axios.get(
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
      {
        params: {
          key: STEAM_API_KEY,
          steamids: "76561199698498228"
        }
      }
    );
    const players = res.data?.response?.players;
    if (players && players.length) {
      const personaState = players[0].personastate;
      if (personaState >= 1 && personaState <= 6) {
        steamStatus = "online";
      } else {steamStatus = "offline";}
    }
    console.log(`Steam: ok (${steamStatus})`);
  } catch (err) {
    console.error("Steam:", err.message);
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
    /* function formatMatchStart(matchStartIso) {
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
    } */
    function formatMatchStart(matchStartIso) {
      const matchDate = new Date(matchStartIso);
      const now = new Date();
      const hours = matchDate.getHours().toString().padStart(2, "0");
      const minutes = matchDate.getMinutes().toString().padStart(2, "0");
      const isToday =
        matchDate.getFullYear() === now.getFullYear() &&
        matchDate.getMonth() === now.getMonth() &&
        matchDate.getDate() === now.getDate();
      if (isToday) return `today ${hours}:${minutes}`;
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday =
        matchDate.getFullYear() === yesterday.getFullYear() &&
        matchDate.getMonth() === yesterday.getMonth() &&
        matchDate.getDate() === yesterday.getDate();
      if (isYesterday) return `yesterday ${hours}:${minutes}`;
      const day = matchDate.getDate().toString().padStart(2, "0");
      const month = (matchDate.getMonth() + 1).toString().padStart(2, "0");
      return `${day}.${month}. ${hours}:${minutes}`;
    }
    // Data
    pubgData = {
      name: player.attributes.name,
      lastMatches: []
    };
    // Last Matches
    const lastMatchIds = player.relationships.matches.data.slice(0, 10).map((m) => m.id);
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
          // Team Mates
          const rosters = matchRes.data.included.filter(r => r.type === "roster");
          const myRoster = rosters.find(roster =>
            roster.relationships.participants.data.some(
              rel => rel.id === participant.id
            )
          );
          let teamMates = [];
          if (myRoster) {
            const teammateIds = myRoster.relationships.participants.data
              .map(p => p.id)
              .filter(id => id !== participant.id);
            teamMates = participants
              .filter(p => teammateIds.includes(p.id))
              .map(p => p.attributes.stats.name);
          }
          // Distance in km
          const distance = Math.round((participant.attributes.stats.walkDistance + participant.attributes.stats.rideDistance + participant.attributes.stats.swimDistance) / 100) / 10;
          // Survival Time
          const survivalSeconds = participant.attributes.stats.timeSurvived;
          const minutes = Math.floor(survivalSeconds / 60);
          const seconds = Math.floor(survivalSeconds % 60);
          const survivalTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
          // URL
          /*
          normal: https://bridge.pubg.com/de/2d-replay/match.bro.official.pc-2018-40.steam.squad-fpp.eu.2026.02.13.21.46773907-8dfd-48a6-99af-091b300189a1?index=71
          casual: https://bridge.pubg.com/de/2d-replay/match.bro.airoyale.pc-2018-40.steam.squad.eu.2026.02.15.12.d2830b8e-8ae2-496b-abf2-296fc270903b
          https://bridge.pubg.com/de/2d-replay/match.bro.official.pc-2018-40.steam.squad.eu.2026.02.12.20.f6cafe09-5008-4f00-953e-8eb072371eac?index=59
          https://bridge.pubg.com/de/2d-replay/match.bro.airoyale.pc-2018-40.steam.squad.eu.2026.02.16.21.91ef47a2-8882-440b-8b82-26244b13ca2d?index=6
          https://bridge.pubg.com/de/2d-replay/match.bro.airoyale.pc-2018-40.steam.squad.eu.2026.02.16.21.f6a0646c-3ee2-45fc-b50a-7527c339fbf2
          https://bridge.pubg.com/de/2d-replay/match.bro.official.pc-2018-40.steam.squad-fpp.eu.2026.02.13.21.26a4dd6e-46fc-4102-b67f-7d55124ec410
          https://bridge.pubg.com/de/2d-replay/match.bro.official.pc-2018-40.steam.squad-fpp.eu.2026.02.13.21.46773907-8dfd-48a6-99af-091b300189a1
          https://bridge.pubg.com/de/2d-replay/match.bro.airoyale.pc-2018-40.steam.squad.eu.2026.02.14.18.489f409b-69ca-48ff-90e6-2f9674bc80cb
          https://bridge.pubg.com/de/2d-replay/match.bro.airoyale.pc-2018-40.steam.squad.eu.2026.02.17.20.4472fa13-4bbd-48c0-aca3-bd740db55c8c?index=1
          
          */
          const mode = matchRes.data.data.attributes.matchType === "airoyale" ? "airoyale" : "official";
          const dateObj = new Date(matchStartIso);
          const year = dateObj.getUTCFullYear();
          const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
          const day = dateObj.getUTCDate().toString().padStart(2, "0");
          const hour = dateObj.getUTCHours().toString().padStart(2, "0");
          /* const matchParticipantsOrder = matchRes.data.data.relationships.participants.data;
          const index = matchParticipantsOrder.findIndex( (p) => p.id === participant.id ); */
          const url = `https://bridge.pubg.com/de/2d-replay/match.bro.${mode}.pc-2018-40.steam.${rawMatchType}.eu.${year}.${month}.${day}.${hour}.${matchId}`; // ?index=${index}
          // Push
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

  // Combine Data
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