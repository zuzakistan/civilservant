module.exports = {
  commands: {
    usage: {
      help: 'Gets usage information about a command',
      usage: ['command'],
      command: function (bot, msg) {
        var cmd = bot.commands[msg.args.command]
        if (Array.isArray(cmd.usage)) {
          return 'Usage: ' +
              bot.config.get('irc.controlChar') +
              msg.args.command +
              ' <' + cmd.usage.join('> <') + '>'
        } else {
          return 'Usage: ' +
              bot.config.get('irc.controlChar') +
              msg.args.command +
              ' ' +
              cmd.usage
        }
      }
    }
  }
}
