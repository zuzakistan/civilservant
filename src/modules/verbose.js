module.exports = {
  events: {
    raw: function (bot, msg) {
      if (bot.config.get('irc.verbose')) {
        console.log(msg.rawCommand + ' (' + msg.command + ') ' + msg.args.join(' '))
      }
    }
  }
}
