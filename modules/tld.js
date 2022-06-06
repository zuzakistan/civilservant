const axios = require('axios')
module.exports = {
  commands: {
    tld: {
      usage: ['tld'],
      aliases: ['domain'],
      help: 'Checks whether a string is a top level domain',
      command: async function (bot, msg) {
        const ENDPOINT = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt'
        const { data } = await axios.get(ENDPOINT, { responseType: 'text' })
        if (data.split('\n').indexOf(msg.args.tld.toUpperCase()) !== -1) {
          bot.say(msg.to, msg.nick + ': ' + msg.args.tld + ' is a TLD')
        } else {
          bot.say(msg.to, msg.nick + ': ' + msg.args.tld + ' is not in IANA\'s list of TLDs')
        }
      }
    }
  }
}
