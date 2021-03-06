require("dotenv").config();
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
  if (msg.content.toLowerCase() === "!map") {
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
            readableDate_start: nextMapStart,
            readableDate_end: nextMapEnd,
          } = res?.data?.battle_royale?.next;

          const mapsData = {
            worldsEdge: {
              colour: "#dd701d",
              imgUrl:
                "https://ik.imagekit.io/afkmedia/media/images/27408-3927578639f99991b0b2e9e8d337fe4d.jpeg",
            },
            olympus: {
              colour: "#0c95d4",
              imgUrl: "https://i.imgur.com/L5McL2d.png",
            },
            kingsCanyon: {
              colour: "#FFEE58",
              imgUrl:
                "https://cdn1.dotesports.com/wp-content/uploads/2019/10/08161402/ApexLegends.jpg",
            },
            stormPoint: {
              colour: "#50718C",
              imgUrl:
                "https://media.contentapi.ea.com/content/dam/apex-legends/common/articles/storm-point/map-blog-thumbnail.png.adapt.1920w.png",
            },
            default: {
              colour: "#E99094",
              imgUrl:
                "https://preview.redd.it/jpxsjxwycf541.jpg?width=960&crop=smart&auto=webp&s=5a16d60576ca9abec9d3074ed5acf74b0d9c5019",
            },
          };

          const generateEmbeddedMsg = (colour, image) =>
            new Discord.MessageEmbed()
              .setColor(colour)
              .setImage(image)
              .setDescription(
                `**CURRENT MAP**: ${currentMap}\n > Time Remaining: ${remainingTimer} \n **NEXT MAP**: ${nextMap} \n Time: ${dayjs(
                  nextMapStart
                )
                  .utcOffset(13)
                  .format("h:mm A")} - ${dayjs(nextMapEnd)
                  .utcOffset(13)
                  .format("h:mm A")} **(PST)** \n Time: ${dayjs(nextMapStart)
                  .utcOffset(16)
                  .format("h:mm A")} - ${dayjs(nextMapEnd)
                  .utcOffset(16)
                  .format("h:mm A")} **(EST)** `
              );

          client.user.setActivity(`${currentMap} (${remainingTimer})`);

          switch (currentMap) {
            case "World's Edge":
              msg.reply(
                generateEmbeddedMsg(
                  mapsData.worldsEdge.colour,
                  mapsData.worldsEdge.imgUrl
                )
              );
              break;
            case "Olympus":
              msg.reply(
                generateEmbeddedMsg(
                  mapsData.olympus.colour,
                  mapsData.olympus.imgUrl
                )
              );
              break;
            case "Kings Canyon":
              msg.reply(
                generateEmbeddedMsg(
                  mapsData.kingsCanyon.colour,
                  mapsData.kingsCanyon.imgUrl
                )
              );
              break;
            case "Storm Point":
              msg.reply(
                generateEmbeddedMsg(
                  mapsData.stormPoint.colour,
                  mapsData.stormPoint.imgUrl
                )
              );
              break;
            default:
              msg.reply(
                generateEmbeddedMsg(
                  mapsData.default.colour,
                  mapsData.default.imgUrl
                )
              );
          }
        });
    } catch (e) {
      throw e;
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
