let msgcount = 0
module.exports = {
  events: {
    message: function () {
      msgcount++
    }
  },
  commands: {
    stats: {
      help: 'Basic stats',
      command: function (bot) {
        return msgcount + ' messages; ' + bot.commandcount + ' commands'
      }
    }
  }
}
