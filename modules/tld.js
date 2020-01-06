var request = require('request')
module.exports = {
  commands: {
    tld: {
      usage: ['tld'],
      aliases: ['domain'],
      help: 'Checks whether a string is a top level domain',
      command: function (bot, msg) {
        request.get('https://data.iana.org/TLD/tlds-alpha-by-domain.txt', function (e, r, b) {
          var data = b.split('\n')
          if (data.indexOf(msg.args.tld.toUpperCase()) !== -1) {
            bot.say(msg.to, msg.nick + ': ' + msg.args.tld + ' is a TLD')
          } else {
            bot.say(msg.to, msg.nick + ': ' + msg.args.tld + ' is not in IANA\'s list of TLDs')
          }
        })
      }
    }
  }
}
