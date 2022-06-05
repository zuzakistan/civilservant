const request = require('request-promise-cache')
module.exports = {
  commands: {
    unicode: {
      aliases: ['char'],
      help: 'Returns a unicode character whose name or codepoint matches a regular expression',
      command: async function (bot, msg) {
        try {
          // Get data from Unicode, cached for ~1 month
          const response = await request({
            url: 'https://unicode.org/Public/UNIDATA/UnicodeData.txt',
            cacheKey: 'https://unicode.org/Public/UNIDATA/UnicodeData.txt',
            cacheTTL: 3.0E9
          })
          const data = response.split('\n')
          let matches
          // If more than one character is given, search for a matching
          // character name or codepoint
          if (Array.from(msg.body).length > 1) {
            // Find matching characters
            const regex = new RegExp(msg.body, 'i')
            matches = data.filter(character => character.match(regex))
          // If only one character is given, look up that character
          } else {
            const codepoint = msg.body.codePointAt(0).toString(16).toUpperCase()
            const paddedCodepoint = '0000'.slice(codepoint.length) + codepoint
            matches = data.filter(character => character.startsWith(paddedCodepoint + ';'))
          }
          if (matches.length) {
            // Choose a random match
            const thisMatch = matches[Math.floor(Math.random() * matches.length)].split(';')
            // Print it only if it is not a control character or a line/paragraph spacer (categories C, Zl, Zp)
            // Otherwise, only print its metadata
            let theChar = ''
            if (!thisMatch[2].match(/(C.|Z[lp])/)) {
              theChar = String.fromCodePoint('0x' + thisMatch[0]) + ' '
            }
            return theChar + thisMatch[1] + ' U+' + thisMatch[0]
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
