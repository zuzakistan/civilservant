var classify = require('classify2')
module.exports = {
  commands: {
    dewey: {
      usage: [ 'isbn' ],
      help: 'Looks up the Dewey Decimal classmark of an ISBN',
      command: function (bot, msg) {
        return classify.get(msg.args.isbn, function (data) {
          bot.say(msg.to, msg.nick + ': ' + data.dewey)
        })
      }
    },
    locc: {
      usage: [ 'isbn' ],
      help: 'Looks up the Library of Congress Classification of an ISBN',
      command: function (bot, msg) {
        return classify.get(msg.args.isbn, function (data) {
          bot.say(msg.to, msg.nick + ': ' + data.congress)
        })
      }
    }
  }
}
