module.exports = {
  events: {
    raw: function (bot, msg) {
      if (bot.config.get('irc.verbose')) {
        bot.log('verbose', msg.rawCommand + ' (' + msg.command + ') ' + msg.args.join(' '))
      }
    }
  }
}
