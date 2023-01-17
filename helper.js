const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
const Discord = require("discord.js");

const generateEmbeddedMsg = (
  colour,
  image,
  currentMap,
  remainingTimer,
  nextMap,
  nextMapStart,
  nextMapEnd,
  ranked
) => {
  const nextMapStartStringPST = dayjs(nextMapStart)
    .utc("z")
    .local()
    .tz("America/Vancouver")
    .format("h:mm A");

  const nextMapEndStringPST = dayjs(nextMapEnd)
    .utc("z")
    .local()
    .tz("America/Vancouver")
    .format("h:mm A");

  const nextMapStartStringEST = dayjs(nextMapStart)
    .utc("z")
    .local()
    .tz("America/Toronto")
    .format("h:mm A");

  const nextMapEndStringEST = dayjs(nextMapEnd)
    .utc("z")
    .local()
    .tz("America/Toronto")
    .format("h:mm A");

  return new Discord.MessageEmbed()
    .setColor(colour)
    .setImage(image)
    .setDescription(
      `${
        ranked ? `**CURRENT RANKED MAP**` : `**CURRENT MAP**`
      } : ${currentMap}\n > Time Remaining: ${remainingTimer} \n ${
        ranked ? `**NEXT RANKED MAP**` : `**NEXT MAP**`
      }: ${nextMap} \n **Time in (PST)**: ${nextMapStartStringPST} - ${nextMapEndStringPST}  \n **Time in (EST)**: ${nextMapStartStringEST} - ${nextMapEndStringEST} `
    );
};

module.exports = {
  generateEmbeddedMsg,
};
