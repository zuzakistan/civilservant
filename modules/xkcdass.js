const xkcd37 = require('xkcd-37')

module.exports = {
  events: {
    message: function (bot, nick, to, text) {
      const transposed = xkcd37(text)
      if (transposed !== text) {
        bot.shout(to, transposed)
      }
    }
  }
}
