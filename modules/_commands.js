/**
 * Main logic for the other commands live here.
 */
const colors = require('irc').colors

const processOutput = (bot, msg, output, customFormatter) => {
  const outputFormatter = customFormatter || ((str) => msg.nick + ': ' + str)
  if (!output) return null
  if (typeof output === 'string') {
    return bot.say(msg.to, outputFormatter(output))
  } else if (output.constructor === Array) {
    output.forEach(line => processOutput(bot, msg, line, customFormatter))
  } else {
    if (output.message) return processOutput(bot, msg, output.message, customFormatter)
    console.error('output is strange type: ' + output)
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
                    return processOutput('I\'m sorry, ' + msg.nick + '. I\'m afraid I can\'t do that.')
                  }
                }
              }
              if (Array.isArray(cmd.usage)) {
                if (msg.args.length !== cmd.usage.length + 1) {
                  return processOutput('Usage: ' + msg._cmd + ' <' + cmd.usage.join('> <') + '>')
                }
                msg.args = msg.args.reduce(function (o, p, k) {
                  o[k] = p
                  return o
                }, {})
                for (var i = 0; i < cmd.usage.length; i++) {
                  msg.args[cmd.usage[i]] = msg.args[i + 1]
                }
              }
              cmd = cmd.command
            }
            if (typeof cmd === 'function') {
              return Promise.resolve(cmd(bot, msg))
                .then(output => processOutput(bot, msg, output))
                .catch(e => {
                  console.error(e.message)
                  console.error(e.stack)
                  return processOutput(bot, msg, e, (str) => colors.wrap('dark_red', 'Error: ') + str)
                })
            }
          } catch (e) {
            bot.say(bot.config.get('irc.control'), 'Error processing `' + msg._cmd + '` in ' + msg.to + ': ' + e)
            console.error(e.message)
            console.error(e.stack)
          }
        } else {
          console.log('Unknown command: ' + text)
        }
      }
    }
  }
}
