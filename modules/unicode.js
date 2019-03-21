var request = require('request-promise')
module.exports = {
  commands: {
    unicode: {
      aliases: [ 'char' ],
      help: 'Returns a unicode character whose name or codepoint matches a regular expression',
      command: async function (bot, msg) {
        if (msg.args.length === 0) {
          // This will work when (if) #162 is merged
          msg.body = '.*'
        }
        try {
          const response = await request.get('https://unicode.org/Public/UNIDATA/UnicodeData.txt')
          const data = response.split('\n')
          const regex = new RegExp(msg.body, 'i')
          const matches = data.filter(codepoint => codepoint.match(regex))
          if (matches.length) {
            const thisMatch = matches[Math.floor(Math.random() * matches.length)].split(';')
            return String.fromCodePoint('0x' + thisMatch[0]) + ' ' + thisMatch[1] + ' ' + thisMatch[0]
          } else {
            return 'No Unicode characters match /' + msg.body + '/'
          }
        } catch (e) {
          return 'err: ' + e
        }
      }
    }
  }
}
