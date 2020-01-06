const BitlyClient = require('bitly').BitlyClient
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
        resolve(null)
      }).on('response', (response) => {
        if (response.statusCode !== 200) {
          resolve(null)
        }
      }).on('end', () => {
        // After aborting (or finishing), parse title
        const $ = cheerio.load(response)
        const title = $('title').text().trim().replace(/\s+/g, ' ').substring(0, 400) || null
        resolve(title)
      })
    })
}

const ofn = (number) => {
  if (number === 2) return ' (again)'
  if (number > 2) return ' (again ×' + (number - 1) + ')'
  return ''
}

var shorten = async function (bot, url) {
  try {
    const bitly = new BitlyClient(bot.config.get('bitly.accesstoken'), {})
    const result = await bitly.shorten(url)
    if (LOG[result.hash]) {
      LOG[result.hash]++
    } else {
      LOG[result.hash] = 1
    }

    fs.writeFileSync(LOGFILE, JSON.stringify(LOG, null, 4))

    return result.url + ofn(LOG[result.hash])
  } catch (e) {
    if (e.statusCode === 500) {
      if (e.message.includes('ALREADY_A_BITLY_LINK')) {
        // Don't bother shortening an already short URL
        return ofn(LOG[url.split('/').pop()])
      }
    }
    throw e
  }
}

module.exports = {
  events: {
    url: async function (bot, url, nick, to, text, msg) {
      if (process.env.NODE_ENV === 'kgz') {
        // dirty fix for bizarro IRC server github.com/kragniz/anon-ircd
        // which converts any mention of "You" to "You", but with cyrillc homoglyph
        //
        // url.href is already punycode normalised so being clever is complicated
        // so let's just hardcode to YouTube for now:
        url.href = url.href.replace('xn--yutube-wqf.com', 'youtube.com')
      }
      // let shortenedUrl = await shorten(bot, url.href)
      // let urlTitle = await getTitle(url.href)

      // bot.shout(to, [shortenedUrl, urlTitle].filter(Boolean).join(' → '))
      //
      bot.shout(to,
        (await Promise.all([shorten(bot, url.href), getTitle(url.href)]))
          .filter(Boolean)
          .join(' → ')
      )
    }
  },
  commands: {
    randurl: {
      fireMessageEvent: true,
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
      usage: ['url'],
      command: async function (bot, msg) {
        const bitly = new BitlyClient(bot.config.get('bitly.accesstoken'))
        const res = await bitly.shorten(msg.args.url)
        if (res.url) {
          return res.url
        }
      }
    }
  }
}
