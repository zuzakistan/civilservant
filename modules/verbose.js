module.exports = {
  events: {
    raw: function (bot, msg) {
        bot.log('verbose', msg.rawCommand + ' (' + msg.command + ') ' + msg.args.join(' '))
    }
  }
}
