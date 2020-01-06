var request = require('request')

module.exports = {
  commands: {
    geo: {
      help: 'Returns a country code associated with a certain IP address',
      usage: ['ip'],
      command: function (bot, msg) {
        request('https://freegeoip.net/json/' + msg.args.ip, function (e, r, b) {
          if (e) {
            bot.say(msg.to, 'unable to reach GeoIP service')
          }
          var dat
          try {
            dat = JSON.parse(b)
          } catch (e) {
            if (e instanceof SyntaxError) {
              return bot.say(msg.to, 'Cannot decode JSON')
            } else {
              throw e
            }
          }

          if (dat.country_code) {
            bot.say(msg.to, dat.ip + ' → ' + dat.city + ' ' + dat.country_code)
          } else {
            bot.say(msg.to, dat.ip + ' → (no country code)')
          }
        })
      }
    }
  }
}
