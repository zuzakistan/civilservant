var Bitly = require('bitly')
var fs = require('fs')
var LOG = {}

var LOGFILE = __rootdir + '/data/ofn.json'
try {
  LOG = require(LOGFILE)
} catch (e) {
  //
}
module.exports = {
  events: {
    url: function (bot, url, nick, to) {
      var bitly = new Bitly(bot.config.get('bitly.username'), bot.config.get('bitly.password'))
      bitly.shorten(url.href, function (err, res) {
        if (err || !res.data.url) {
          return // fail silently (usually duplicate URL)
        }
        if (LOG[res.data.hash]) {
          if (LOG[res.data.hash] === 1) {
            bot.shout(to, res.data.url + ' (again)')
          } else {
            bot.shout(to, res.data.url + ' (again ×' + LOG[res.data.hash] + ')')
          }
          LOG[res.data.hash]++
        } else {
          LOG[res.data.hash] = 1
          if (res.data.url && res.data.url.length < url.href.length) {
            bot.shout(to, res.data.url)
          }
        }
        fs.writeFile(LOGFILE, JSON.stringify(LOG, null, 4))
      })
    }
  },
  commands: {
    randurl: {
      help: 'Output a random URL from the channel history',
      command: function () {
        var keys = Object.keys(LOG)
        return 'https://bit.ly/' + keys[Math.floor(Math.random() * keys.length)]
      }
    },
    urlcount: {
      help: 'Count the number of URLs stored in channel history',
      command: function () {
        return Object.keys(LOG).length + ' URLs stored'
      }
    },
    shorten: {
      help: 'Shorten a URL',
      usage: [ 'url' ],
      command: function (bot, msg) {
        var bitly = new Bitly(bot.config.get('bitly.username'), bot.config.get('bitly.password'))
        bitly.shorten(msg.args.url, function (err, res) {
          if (err) {
            bot.say(msg.to, 'Unable to shorten that.')
          }
          if (res.data.url) {
            bot.say(msg.to, res.data.url)
          }
        })
      }
    }
  }
}
