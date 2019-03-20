var khan = require('khaan')
module.exports = {
  commands: {
    khan: {
      help: 'Elongates an arbitrary string dramatically',
      command: function (bot, msg) {
        if (typeof msg.body === 'undefined') {
          msg.body = [ 'khan' ]
        }
        var limit = bot.maxLineLength - msg.body.length
        var length = Math.floor(Math.random() * limit) - 1
        var words = msg.body.split(' ').map(function (word) {
          return khan.khan(word, length)
        })
        return words.join(' ')
      }
    }
  }
}
