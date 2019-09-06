/**
 * Makes the bot respond to pre-defined messages
 * with other pre-defined messages.
 *
 * To edit the definitions, change the contents of data/triggers.json.
 * Entries should be key/values -- the former to trigger the message,
 * the latter to be the message.
 *
 * If the value isn't a string, the bot will parrot the match, preserving case.
 *
 */
var regexpesc = require('escape-string-regexp')
var triggers = {}
var COUNT = 0

// adjust this to change the bot's tolerance to botstorms
var MAX_COUNT = 5

module.exports = {
  onload: (bot) => {
    try {
      triggers = require(__rootdir + '/data/triggers.json')
    } catch (e) {
      bot.log('warn', 'Cannot load triggers!')
    }
  },
  commands: {
    'triggers': {
      'help': 'Lists call and response triggers',
      command: function () {
        return Object.keys(triggers).join(' · ')
      }
    }
  },
  events: {
    message: function (bot, nick, to, text) {
      var t = Object.keys(triggers)
      for (var i = 0; i < t.length; i++) {
        if (text.toLowerCase().indexOf(t[i]) !== -1) {
          if (typeof triggers[t[i]] === 'string' && COUNT < MAX_COUNT) {
            bot.shout(to, triggers[t[i]])
            COUNT += 2
          } else {
            var w = regexpesc(t[i])
            var r = new RegExp(w, 'gi')
            var m = text.match(r)
            if (m && m.length !== 0 && COUNT < MAX_COUNT) {
              bot.shout(to, m.join(' '))
              COUNT += 1
            }
          }
        }
      }
      if (COUNT > 0) {
        COUNT = COUNT - 1
      }
    }
  }
}
