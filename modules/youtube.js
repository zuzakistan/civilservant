/**
 * To use this module, add youtube.key to your config.json
 * You need the key for the Youtube Data API:
 * https://console.developers.google.com/apis/credentials
 */
const yt = require('youtube-search')
module.exports = {
  events: {
    'url:youtube.com': function (bot, url, nick, to) {
      let query = url.query
      if (typeof query === 'string') {
        // docs say it could already be an object
        const params = url.query.split('&')
        query = {}
        // this is dumb:
        for (let i = 0; i < params.length; i++) {
          const curr = params[i].split('=')
          curr.push(null) // to prevent ?foo breaking things
          query[curr[0]] = curr[1]
        }
      }
      if (query.v) {
        // TODO: remove this code duplication
        const opts = bot.config.get('youtube') || {}
        opts.maxResults = 1
        opts.type = 'video,channel'
        // this is particularly dumb:
        yt(query.v, opts, function (err, results) {
          if (err) {
            bot.log('warn', 'YouTube error', err, err.stack)
            return
          }
          if (results.length !== 0) {
            bot.log('silly', results[0])
            bot.say(to, results[0].title)
          }
        })
      }
    }
  },
  commands: {
    yt: {
      help: 'Searches YouTube for a query string',
      aliases: ['youtube'],
      command: function (bot, msg) {
        const opts = bot.config.get('youtube') || {}
        opts.maxResults = 1
        opts.type = 'video,channel'
        yt(msg.body, opts, function (err, results) {
          if (err) {
            bot.say(msg.to, msg.nick + ': ' + err)
          } else if (results.length < 1) {
            bot.say(msg.to, msg.nick + ': no results found')
          } else {
            const result = results[0]
            bot.say(msg.to, msg.nick + ': ' + result.link + ' ' + result.title)
          }
        })
      }
    }
  }
}
