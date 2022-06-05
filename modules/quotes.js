/**
 * Port of dbot/dbot's quotes feature
 */
const fs = require('fs')
let quotes = {}
try {
  quotes = require(__rootdir + '/data/quotes.json')
} catch (e) {
  //
}
module.exports = {
  commands: {
    qadd: {
      help: 'Add a quote',
      command: function (bot, msg) {
        let body = msg.body.split('=')
        const key = body.shift()
        body = body.join('=') // so clunky
        if (!body || !key) {
          return 'Usage: ' + bot.config.get('irc.controlChar') + 'qadd foo=bar'
        }
        if (!quotes[key]) {
          quotes[key] = [body]
        } else {
          quotes[key].push(body)
        }

        fs.writeFileSync(__rootdir + '/data/quotes.json', JSON.stringify(quotes, null, 4))
        return 'Added quote "' + body + '" to "' + key + '" (' + quotes[key].length + ').'
      }
    },
    quote: {
      help: 'Gets a quote',
      command: function (bot, msg) {
        try {
          const q = quotes[msg.body]
          return q[Math.floor(Math.random() * q.length)]
        } catch (e) {
          return e
        }
      }
    },
    quotes: {
      aliases: ['quotel'],
      help: 'Lists quote categories',
      command: function () {
        let str = ''
        const keys = Object.keys(quotes)
        for (let i = 0; i < keys.length; i++) {
          str += ' ' + keys[i] + ' (' + quotes[keys[i]].length + ') ·'
        }
        return str.substring(0, str.length - 1)
      }
    }
  }
}
