const Bitly = require('bitly')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')

var LOG = {}

var LOGFILE = __rootdir + '/data/ofn.json'
try {
  LOG = require(LOGFILE)
} catch (e) {
  //
}

var getTitle = function (url) {
  return new Promise(
    (resolve, reject) => {
      const maxSize = 1024
      var size = 0
      var response = ''
      var req = request(url)
      // Check the size of the downloaded data regularly
      req.on('data', chunk => {
        size += chunk.length
        response += chunk.toString()
        // After maxSize bytes, abort
        if (size > maxSize) {
          req.abort()
        }
      }).on('error', () => {
        // If there was an error, don't bother trying to get the title
        // But still process the rest of the URLs
        resolve(null)
      }).on('end', () => {
        // After aborting (or finishing), parse title
        const $ = cheerio.load(response)
        const title = $('title').text() || null
        resolve(title)
      })
    })
}

var shorten = function (bot, url) {
  var bitly = new Bitly(bot.config.get('bitly.username'), bot.config.get('bitly.password'))
  return new Promise(
    (resolve, reject) => {
      bitly.shorten(url.href, function (err, res) {
        if (err || !res.data.url) {
          resolve(null) // fail silently (usually duplicate URL)
        }
        if (LOG[res.data.hash]) {
          LOG[res.data.hash]++
          if (LOG[res.data.hash] === 1) {
            resolve(res.data.url + ' (again)')
          } else {
            resolve(res.data.url + ' (again ×' + LOG[res.data.hash] + ')')
          }
        } else {
          LOG[res.data.hash] = 1
          if (res.data.url && res.data.url.length < url.href.length) {
            resolve(res.data.url)
          }
        }
        fs.writeFile(LOGFILE, JSON.stringify(LOG, null, 4))
      })
    })
}

module.exports = {
  events: {
    url: async function (bot, url, nick, to, text, msg) {
      bot.shout(to, (await Promise.all(
        [shorten(bot, url.href), getTitle(url.href)]))
        .filter(Boolean).join(' → '))
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
