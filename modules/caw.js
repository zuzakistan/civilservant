const khan = require('khaan')
module.exports = {
  commands: {
    caw: {
      help: 'Caws',
      command: function (bot) {
        return khan.khan('caw', Math.floor(Math.random() * bot.maxLineLength - 4) - 1)
      }
    }
  },
  events: {
    message: function (bot, nick, to, text) {
      if (text.match(/^c+a+w+!?/i) !== null && Math.random() < 5 / 10) {
        bot.say(to, khan.khan('caw', Math.floor(Math.random() * bot.maxLineLength - 4) - 1))
      }
    }
  }
}
