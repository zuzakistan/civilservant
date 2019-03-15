/**
 * Main logic for the other commands live here.
 */
const applyCommands = function (bot, msg) {
  let controlChar = bot.config.get('irc.controlChar')
  msg._cmd = controlChar + msg.cmds[0]
  if (bot.commands.hasOwnProperty(msg.cmds[0])) {
    try {
      var cmd = bot.commands[msg.cmds[0]]
      if (cmd.command) {
        // stats hook
        if (bot.commandcount) {
          bot.commandcount++
        } else {
          bot.commandcount = 1
        }
        if (cmd.disabled) {
          return
        }
        if (cmd.privileged) {
          if (bot.config.get('irc.control') !== msg.to) {
            if (bot.config.get('irc.insecure') === true) {
              // pass
            } else {
              // http://www.imdb.com/title/tt0062622/quotes?item=qt0396921
              return bot.say(msg.to, 'I\'m sorry, ' + msg.nick + '. I\'m afraid I can\'t do that.')
            }
          }
        }
        if (Array.isArray(cmd.usage)) {
          if (msg.args.length !== cmd.usage.length + msg.cmds.length) {
            return bot.say(msg.to, msg.nick + ': Usage: ' + msg._cmd + ' <' + cmd.usage.join('> <') + '>')
          }
          msg.args = msg.args.reduce(function (o, p, k) {
            o[k] = p
            return o
          }, {})
          for (var i = 0; i < cmd.usage.length; i++) {
            msg.args[cmd.usage[i]] = msg.args[i + msg.cmds.length]
          }
        }
        cmd = cmd.command
      }
      if (typeof cmd === 'function') {
        var output = cmd(bot, msg)
        if (!output) {
          console.log('No return for ' + cmd)
        } else if (typeof output === 'string') {
          if (msg.cmds.length === 1) {
            return bot.say(msg.to, msg.nick + ': ' + output)
          } else {
            msg.cmds = msg.cmds.slice(1)
            try {
              msg.args = msg.args.slice(1)
            } catch (e) {
              if (e instanceof TypeError) {
                delete msg.args['0']
              }
            }
            msg.body = output
            return applyCommands(bot, msg)
          }
        } else if (output.constructor === Array) {
          for (var k = 0; k < output.length; k++) {
            if (typeof output[k] === 'string') {
              if (msg.cmds.length === 1) {
                return bot.say(msg.to, msg.nick + ': ' + output[k])
              } else {
                msg.cmds = msg.cmds.slice(1)
                msg.args = msg.args.slice(1)
                msg.body = output[k]
                return applyCommands(bot, msg)
              }
            }
          }
        }
      }
    } catch (e) {
      bot.say(bot.config.get('irc.control'), 'Error processing `' + msg._cmd + '` in ' + msg.to + ': ' + e)
      console.error(e.message)
      console.error(e.stack)
    }
  } else {
    console.log('Unknown command: ' + msg.text)
  }
}
module.exports = {
  events: {
    message: function (bot, nick, to, text, message) {
      let controlChar = bot.config.get('irc.controlChar')
      if (text.substr(0, 1) === controlChar) {
        var msg = {
          body: text.substr(text.search(/ [^!]/) + 1),
          args: text.substr(1).split(/ !?/),
          cmds: text.substr(1, text.search(/ [^!]/) - 1).split(' !').reverse(),
          nick: nick,
          to: to,
          text: text,
          message: message
        }
        if (msg.cmds[0].length === 0) {
          msg.cmds = msg.args
        }
        return applyCommands(bot, msg)
      }
    }
  }
}
