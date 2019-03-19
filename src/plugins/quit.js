module.exports = {
  onload: (bot) => {
    process.on('SIGINT', function () {
      console.log('Caught SIGINT...')
      bot.disconnect('Caught ^C', function () {
        console.log('...disconnected.')
        process.exit()
      })
    })
  }
}
