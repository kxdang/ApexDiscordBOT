require('dotenv').config()
const Discord = require("discord.js")
const axios = require('axios');
const client = new Discord.Client()
const moment = require('moment')

client.on('debug', console.log)

client.on("ready", () => {
  console.log(`HelloWorld Logged in as ${client.user.tag}`)
})

client.on("message", msg => {

  if (msg.content.toLowerCase() === "!map") {
    axios.get(`https://api.mozambiquehe.re/maprotation?version=2&auth=${process.env.APEX_TOKEN}`).then((res) => {
        console.log(res.data)
        console.log(res.data.battle_royale.current.map)
        const {map: currentMap, remainingTimer} = res.data.battle_royale.current
        const {map: nextMap, readableDate_start: nextMapStart, readableDate_end: nextMapEnd} = res.data.battle_royale.next

        console.log(nextMapStart)
        

      const olympusMessage = new Discord.MessageEmbed()
      .setColor('#0c95d4')
      .setImage('https://i.imgur.com/L5McL2d.png')
      .setDescription(`**CURRENT MAP**: ${currentMap}\n > Time Remaining: ${remainingTimer} \n **NEXT MAP**: ${nextMap} \n Time: ${moment(nextMapStart).add(17, 'h').format("h:mm A")} - ${moment(nextMapEnd).add(17, 'h').format("h:mm A")} **(PST)** \n Time: ${moment(nextMapStart).add(20, 'h').format("h:mm A")} - ${moment(nextMapEnd).add(20, 'h').format("h:mm A")} **(EST)** `);

       const worldsEdgeMessage = new Discord.MessageEmbed()
      .setColor('#dd701d')
      .setImage('https://ik.imagekit.io/afkmedia/media/images/27408-3927578639f99991b0b2e9e8d337fe4d.jpeg')
      .setDescription(`**CURRENT MAP**: ${currentMap}\n > Time Remaining: ${remainingTimer} \n **NEXT MAP**: ${nextMap} \n Time: ${moment(nextMapStart).add(17, 'h').format("h:mm A")} - ${moment(nextMapEnd).add(17, 'h').format("h:mm A")} **(PST)** \n Time: ${moment(nextMapStart).add(20, 'h').format("h:mm A")} - ${moment(nextMapEnd).add(20, 'h').format("h:mm A")} **(EST)** `);

  
    if (currentMap === "World's Edge") {
      msg.reply(worldsEdgeMessage)
    }

    if (currentMap === 'Olympus') {
      msg.reply(olympusMessage)
    }

    })
  }

  if (msg.content.toLowerCase() === "home" || msg.content.toLowerCase() === "!o" || msg.content.toLowerCase().includes('apex') ) {
    axios.get(`https://api.mozambiquehe.re/maprotation?version=2&auth=${process.env.APEX_TOKEN}`).then((res) => {
        console.log(res.data)
        console.log(res.data.battle_royale.current.map)
        const {map: currentMap, remainingSecs} = res.data.battle_royale.current

    if (currentMap === 'Olympus') {
        msg.reply(`Yes - Olympus is on; time to go home! There's **${Math.round(remainingSecs/60)}** minutes left of Olympus`)
      } else {
        msg.reply(`Not Olympus, there's **${Math.round(remainingSecs/60)}** minutes left of World's Edge`)
      }
    })
  }
 
})

client.login(process.env.DISCORD_TOKEN)
