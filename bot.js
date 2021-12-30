require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client();
const moment = require("moment");

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

          console.log(nextMapStart);
          client.user.setActivity(`${currentMap} (${remainingTimer})`);

          const olympusMessage = new Discord.MessageEmbed()
            .setColor("#0c95d4")
            .setImage("https://i.imgur.com/L5McL2d.png")
            .setDescription(
              `**CURRENT MAP**: ${currentMap}\n > Time Remaining: ${remainingTimer} \n **NEXT MAP**: ${nextMap} \n Time: ${moment(
                nextMapStart
              )
                .add(17, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(17, "h")
                .format("h:mm A")} **(PST)** \n Time: ${moment(nextMapStart)
                .add(20, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(20, "h")
                .format("h:mm A")} **(EST)** `
            );

          const worldsEdgeMessage = new Discord.MessageEmbed()
            .setColor("#dd701d")
            .setImage(
              "https://ik.imagekit.io/afkmedia/media/images/27408-3927578639f99991b0b2e9e8d337fe4d.jpeg"
            )
            .setDescription(
              `**CURRENT MAP**: ${currentMap}\n > Time Remaining: ${remainingTimer} \n **NEXT MAP**: ${nextMap} \n Time: ${moment(
                nextMapStart
              )
                .add(17, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(17, "h")
                .format("h:mm A")} **(PST)** \n Time: ${moment(nextMapStart)
                .add(20, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(20, "h")
                .format("h:mm A")} **(EST)** `
            );

          const kingsCanyonMessage = new Discord.MessageEmbed()
            .setColor("#FFEE58")
            .setImage(
              "https://cdn1.dotesports.com/wp-content/uploads/2019/10/08161402/ApexLegends.jpg"
            )
            .setDescription(
              `**CURRENT MAP**: ${currentMap}\n > Time Remaining: ${remainingTimer} \n **NEXT MAP**: ${nextMap} \n Time: ${moment(
                nextMapStart
              )
                .add(17, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(17, "h")
                .format("h:mm A")} **(PST)** \n Time: ${moment(nextMapStart)
                .add(20, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(20, "h")
                .format("h:mm A")} **(EST)** `
            );

          const stormPointMsg = new Discord.MessageEmbed()
            .setColor("#50718C")
            .setImage(
              "https://media.contentapi.ea.com/content/dam/apex-legends/common/articles/storm-point/map-blog-thumbnail.png.adapt.1920w.png"
            )
            .setDescription(
              `**CURRENT MAP**: ${currentMap}\n > Time Remaining: ${remainingTimer} \n **NEXT MAP**: ${nextMap} \n Time: ${moment(
                nextMapStart
              )
                .add(17, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(17, "h")
                .format("h:mm A")} **(PST)** \n Time: ${moment(nextMapStart)
                .add(20, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(20, "h")
                .format("h:mm A")} **(EST)** `
            );

          const defaultMsg = new Discord.MessageEmbed()
            .setColor("#E99094")
            .setImage(
              "https://preview.redd.it/jpxsjxwycf541.jpg?width=960&crop=smart&auto=webp&s=5a16d60576ca9abec9d3074ed5acf74b0d9c5019"
            )
            .setDescription(
              `**CURRENT MAP**: ${currentMap}\n > Time Remaining: ${remainingTimer} \n **NEXT MAP**: ${nextMap} \n Time: ${moment(
                nextMapStart
              )
                .add(17, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(17, "h")
                .format("h:mm A")} **(PST)** \n Time: ${moment(nextMapStart)
                .add(20, "h")
                .format("h:mm A")} - ${moment(nextMapEnd)
                .add(20, "h")
                .format(
                  "h:mm A"
                )} **(EST)** \n **KIEN FIX IMAGE - APEX UPDATED !!!!**`
            );

          switch (currentMap) {
            case "World's Edge":
              msg.reply(worldsEdgeMessage);
              break;
            case "Olympus":
              msg.reply(olympusMessage);
              break;
            case "Kings Canyon":
              msg.reply(kingsCanyonMessage);
              break;
            case "Storm Point":
              msg.reply(stormPointMsg);
              break;
            default:
              msg.reply(defaultMsg);
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
