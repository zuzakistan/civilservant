module.exports = {
  onload: (bot) => {
    process.on('SIGINT', function () {
      bot.log('warn', 'Caught SIGINT...')
      bot.disconnect('Caught ^C', function () {
        bot.log('info', '...disconnected.')
        process.exit()
      })
    })
  }
}
