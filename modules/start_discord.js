const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = inject

function inject (bot, options) {
  options.discord = client
  options.discord.on('ready', () => {
    console.log('ready')
    bot.emit('DISCORD_READY')
  })
  options.discord.login('ENV_TOKEN')
}
