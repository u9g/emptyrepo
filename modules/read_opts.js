module.exports = inject

function inject (bot, { discord: client }) {
  bot.on('DISCORD_READY', () => {
    console.log(client)
  })

  bot.on('spawn', () => {
    console.log()
  })
}
