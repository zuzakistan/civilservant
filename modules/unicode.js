var request = require('request-promise-cache')
module.exports = {
  commands: {
    unicode: {
      aliases: [ 'char' ],
      help: 'Returns a unicode character whose name or codepoint matches a regular expression',
      command: async function (bot, msg) {
        // Output a random character if no arguments are given
        if (msg.args.length === 0) {
          // This will work when (if) #162 is merged
          msg.body = '.*'
        }
        try {
          // Get data from Unicode, cached for ~1 month
          const response = await request({
            url: 'https://unicode.org/Public/UNIDATA/UnicodeData.txt',
            cacheKey: 'https://unicode.org/Public/UNIDATA/UnicodeData.txt',
            cacheTTL: 3.0E9
          })
          const data = response.split('\n')
          // Find matching characters
          const regex = new RegExp(msg.body, 'i')
          const matches = data.filter(codepoint => codepoint.match(regex))
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
