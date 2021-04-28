const mineflayer = require('mineflayer')

const randomName = ((Math.random() + 1) * 9999).toFixed(0)

const bot = mineflayer.createBot({
  host: '95.111.249.143',
  port: 10000,
  username: randomName,
  discord: {}
})

bot.loadPlugin(require('./modules/read_opts'))
bot.loadPlugin(require('./modules/start_discord'))

bot.once('spawn', () => {
  console.log(`Joined as ${bot.username}`)
})

bot.on('messagestr', (msg) => console.log(msg))
