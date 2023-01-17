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
  const nextMapStartStringPST = () => {
    let PST = dayjs.unix(nextMapStart).utcOffset(-8);
    return PST.format("h:mm A");
  };

  const nextMapEndStringPST = () => {
    let PST = dayjs.unix(nextMapEnd).utcOffset(-8);
    return PST.format("h:mm A");
  };

  const nextMapStartStringEST = () => {
    let EST = dayjs.unix(nextMapStart).utcOffset(-5);
    return EST.format("h:mm A");
  };

  const nextMapEndStringEST = () => {
    let EST = dayjs.unix(nextMapEnd).utcOffset(-5);
    return EST.format("h:mm A");
  };

  return new Discord.MessageEmbed()
    .setColor(colour)
    .setImage(image)
    .setDescription(
      `${
        ranked ? `**CURRENT RANKED MAP**` : `**CURRENT MAP**`
      } : ${currentMap}\n > Time Remaining: ${remainingTimer} \n ${
        ranked ? `**NEXT RANKED MAP**` : `**NEXT MAP**`
      }: ${nextMap} \n **Time in (PST)**: ${nextMapStartStringPST()} - ${nextMapEndStringPST()}  \n **Time in (EST)**: ${nextMapStartStringEST()} - ${nextMapEndStringEST()} `
    );
};

module.exports = {
  generateEmbeddedMsg,
};
