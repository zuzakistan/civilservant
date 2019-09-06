/**
 * Main logic for the other commands live here.
 */
const colors = require('irc').colors

const processOutput = (bot, msg, cmd, output, customFormatter) => {
  const outputFormatter = customFormatter || ((str) => msg.nick + ': ' + str)
  if (!output) return null
  if (typeof output === 'string') {
    let say = outputFormatter(output)
    if (cmd.fireMessageEvent) {
      bot.fireEvents('message', bot.nick, msg.to, say, null)
    }
    return bot.say(msg.to, say)
  } else if (output.constructor === Array) {
    output.forEach(line => processOutput(bot, msg, line, customFormatter))
  } else {
    if (output.message) return processOutput(bot, msg, cmd, output.message, customFormatter)
    bot.log('warn', 'output is strange type: ' + output)
  }
}
module.exports = {
  events: {
    message: function (bot, nick, to, text, message) {
      let controlChar = bot.config.get('irc.controlChar')
      if (text.substr(0, 1) === controlChar) {
        var msg = {
          body: text.substr(text.indexOf(' ') + 1),
          args: text.substr(1).split(' '),
          nick: nick,
          to: to,
          text: text,
          message: message
        }
        msg._cmd = controlChar + msg.args[0]
        if (bot.commands.hasOwnProperty(msg.args[0])) {
          try {
            var cmd = bot.commands[msg.args[0]]
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
                    return processOutput(bot, msg, cmd, 'I\'m sorry, ' + msg.nick + '. I\'m afraid I can\'t do that.')
                  }
                }
              }
              if (Array.isArray(cmd.usage)) {
                if (msg.args.length !== cmd.usage.length + 1) {
                  return processOutput(bot, msg, cmd, 'Usage: ' + msg._cmd + ' <' + cmd.usage.join('> <') + '>')
                }
                msg.args = msg.args.reduce(function (o, p, k) {
                  o[k] = p
                  return o
                }, {})
                for (var i = 0; i < cmd.usage.length; i++) {
                  msg.args[cmd.usage[i]] = msg.args[i + 1]
                }
              }
            }
            return Promise.resolve(cmd.command(bot, msg))
              .then(output => processOutput(bot, msg, cmd, output))
              .catch(e => {
                bot.log('error', e.message)
                bot.log('error', e.stack)
                return processOutput(bot, msg, cmd, e, (str) => colors.wrap('dark_red', 'Error: ') + str)
              })
          } catch (e) {
            bot.say(bot.config.get('irc.control'), 'Error processing `' + msg._cmd + '` in ' + msg.to + ': ' + e)
            bot.log('error', e.message)
            bot.log('error', e.stack)
          }
        } else {
          bot.log('info', 'Unknown command: ' + text)
        }
      }
    }
  }
}
