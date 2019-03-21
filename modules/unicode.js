var request = require('request-promise')
module.exports = {
  commands: {
    unicode: {
      usage: [ 'regex' ],
      aliases: [ 'char' ],
      help: 'Returns a unicode character whose name or codepoint matches a regular expression',
      command: async function (bot, msg) {
        try {
          const response = await request.get('https://unicode.org/Public/UNIDATA/Index.txt')
          const data = response.split('\n')
          const regex = new RegExp(msg.args.regex, 'i')
          const matches = data.filter(codepoint => codepoint.match(regex))
          if (matches.length) {
            const thisMatch = matches[Math.floor(Math.random() * matches.length)]
            return String.fromCodePoint('0x' + thisMatch.split('\t').slice(-1)) + '\t' + thisMatch
          } else {
            return 'No Unicode characters match /' + msg.args.regex + '/'
          }
        } catch (e) {
          return 'err: ' + e
        }
      }
    }
  }
}
