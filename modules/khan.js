var khan = require('khaan')
module.exports = {
  commands: {
    khan: {
      help: 'Elongates an arbitrary string dramatically',
      command: function (bot, msg) {
        msg.args.shift()
        if (typeof msg.args[0] === 'undefined') {
          msg.args = [ 'khan' ]
        }
        var limit = bot.maxLineLength - msg.args.length
        var length = Math.floor(Math.random() * limit) - 1
        var words = msg.args.map(function (word) {
          return khan.khan(word, length)
        })
        return words.join(' ')
      }
    }
  }
}
