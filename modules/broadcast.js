module.exports = {
  onload: (bot) => {
    bot.broadcast = function (string) {
      const chans = Object.keys(bot.chans)
      bot.log('silly', chans)
      for (let i = 0; i < chans.length; i++) {
        bot.notice(chans[i], string)
      }
    }
  }
}
