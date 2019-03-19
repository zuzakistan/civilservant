module.exports = {
  commands: {
    commands: {
      help: 'Lists all commands for which the bot will react',
      command: function (bot) {
        var commands = Object.keys(bot.commands)
        commands.sort()
        let controlChar = bot.config.get('irc.controlChar')
        return 'Commands loaded: ' + controlChar + commands.join(' ' + controlChar)
      }
    },
    help: {
      usage: [ 'command' ],
      help: 'Returns summary of purpose of command',
      command: function (bot, msg) {
        if (!bot.commands[msg.args.command]) {
          return 'No command of that nature found.'
        }
        if (typeof bot.commands[msg.args.command] === 'object') {
          var cmd = bot.commands[msg.args.command]
          if (!cmd.help) {
            cmd.help = 'No help for ' + bot.config.get('irc.controlChar') + msg.args.command
          }
          var attr = []
          if (cmd.privileged) {
            attr.push('control channel only')
          }
          if (cmd.deprecated) {
            attr.push('deprecated')
          }
          if (attr.length !== 0) {
            attr = ' (' + attr.join(' · ') + ')'
          } else {
            attr = ''
          }
          return cmd.help + attr
        }
        return 'No help for ' + bot.config.get('irc.controlChar') + msg.args.command + ' found.'
      }
    }
  }
}
