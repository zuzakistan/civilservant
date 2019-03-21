var request = require('request')
module.exports = {
  commands: {
    unicode: {
      usage: [ 'regex' ],
      aliases: [ 'char' ],
      help: 'Returns a unicode character whose name or codepoint matches a regular expression',
      command: function (bot, msg) {
        request.get('https://unicode.org/Public/UNIDATA/Index.txt', function (e, r, b) {
          var data = b.split('\n')
          const regex = new RegExp(msg.args.regex, 'i')
          const matches = data.filter(codepoint => codepoint.match(regex))
          if (matches.length) {
            const thisMatch = matches[Math.floor(Math.random() * matches.length)]
            bot.say(msg.to, msg.nick + ': ' + String.fromCodePoint('0x' + thisMatch.split('\t').slice(-1)) + '\t' + thisMatch)
          } else {
            bot.say(msg.to, msg.nick + ': No Unicode characters match /' + msg.args.regex + '/')
          }
        })
      }
    }
  }
}
