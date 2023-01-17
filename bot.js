require("dotenv").config();
const LOCAL_DATA = require("./constants.js");
const { generateEmbeddedMsg } = require("./helper.js");
const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client();
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

let globalResponseData;

client.on("ready", () => {
  console.log(`HelloWorld Logged in as ${client.user.tag}`);

  const fetchData = () => {
    try {
      axios
        .get(
          `https://api.mozambiquehe.re/maprotation?version=2&auth=${process.env.APEX_TOKEN}`
        )
        .then((res) => {
          globalResponseData = res;

          const { map: currentMap, remainingTimer } =
            globalResponseData?.data?.battle_royale?.current;
          client.user.setActivity(`${currentMap} (${remainingTimer})`);
        });
    } catch (e) {
      throw e;
    }
  };

  if (!!globalResponseData) {
    fetchData();
  }

  setInterval(() => fetchData(), 300000);
});

client.on("message", (msg) => {
  fetchUnrankedData = () => {
    try {
      axios
        .get(
          `https://api.mozambiquehe.re/maprotation?version=2&auth=${process.env.APEX_TOKEN}`
        )
        .then((res) => {
          globalResponseData = res;
          const { map: currentMap, remainingTimer } =
            res?.data?.battle_royale?.current;

          const {
            map: nextMap,
            start: nextMapStart,
            end: nextMapEnd,
          } = res?.data?.battle_royale?.next;

          client.user.setActivity(`${currentMap} (${remainingTimer})`);

          msg.reply(
            generateEmbeddedMsg(
              LOCAL_DATA.MAP_DATA[currentMap].colour,
              LOCAL_DATA.MAP_DATA[currentMap].imgUrl,
              currentMap,
              remainingTimer,
              nextMap,
              nextMapStart,
              nextMapEnd
            )
          );
        });
    } catch (e) {
      throw e;
    }
  };
  if (msg.content.toLowerCase() === "!ranked") {
    try {
      axios
        .get(
          `https://api.mozambiquehe.re/maprotation?version=2&auth=${process.env.APEX_TOKEN}`
        )
        .then((res) => {
          globalResponseData = res;
          const { map: currentMap, remainingTimer } =
            res?.data?.ranked?.current;

          const {
            map: nextMap,
            readableDate_start: nextMapStart,
            readableDate_end: nextMapEnd,
          } = res?.data?.ranked?.next;

          client.user.setActivity(`${currentMap} (${remainingTimer})`);
          msg.reply(
            generateEmbeddedMsg(
              LOCAL_DATA.MAP_DATA[currentMap].colour,
              LOCAL_DATA.MAP_DATA[currentMap].imgUrl,
              currentMap,
              remainingTimer,
              nextMap,
              nextMapStart,
              nextMapEnd,
              true
            )
          );
        });
    } catch (e) {
      throw e;
    }
  }

  if (msg.content.toLowerCase() === "!map") {
    if (globalResponseData) {
      let timeAPIwasCalled = dayjs(globalResponseData.headers.readableDate_end);
      let now = dayjs();
      let timeElapsedInMinutes = now.diff(timeAPIwasCalled, "minute");

      if (timeElapsedInMinutes > 20) {
        fetchUnrankedData();
      } else {
        const { map: currentMap, end: currentMapEndTime } =
          globalResponseData?.data?.battle_royale?.current;

        const {
          map: nextMap,
          start: nextMapStart,
          end: nextMapEnd,
        } = globalResponseData?.data?.battle_royale?.next;

        console.log(globalResponseData?.data?.battle_royale);

        let timeUntilMapChange = dayjs
          .unix(currentMapEndTime)
          .diff(now, "minute");

        let timeLeftUntilMapChange =
          timeUntilMapChange / 60 < 1
            ? `${timeUntilMapChange} minutes`
            : `${timeUntilMapChange}h `;

        msg.reply(
          generateEmbeddedMsg(
            LOCAL_DATA.MAP_DATA[currentMap].colour,
            LOCAL_DATA.MAP_DATA[currentMap].imgUrl,
            currentMap,
            timeLeftUntilMapChange,
            nextMap,
            nextMapStart,
            nextMapEnd,
            true
          )
        );
      }
    } else {
      fetchUnrankedData();
    }
  }

  if (
    msg.content.toLowerCase() === "home" ||
    msg.content.toLowerCase() === "!o" ||
    msg.content.toLowerCase().includes("!apex")
  ) {
    try {
      axios
        .get(
          `https://api.mozambiquehe.re/maprotation?version=2&auth=${process.env.APEX_TOKEN}`
        )
        .then((res) => {
          const {
            map: currentMap,
            remainingSecs,
            remainingTimer,
          } = res?.data?.battle_royale?.current;

          client.user.setActivity(`${currentMap} (${remainingTimer})`);

          if (currentMap === "Olympus") {
            msg.reply(
              `Yes - Olympus is on; time to go home! There's **${Math.round(
                remainingSecs / 60
              )}** minutes left of Olympus`
            );
          } else {
            msg.reply(
              `Not Olympus, there's **${Math.round(
                remainingSecs / 60
              )}** minutes left of ${currentMap}`
            );
          }
        });
    } catch (e) {
      throw e;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
