var writeInt = require('write-int')
module.exports = {
  commands: {
    num: {
      help: 'Asks the bot to greet the channel',
      usage: [ 'lang', 'number' ],
      command: function (bot, msg) {
        if (msg.args.lang === 'jbo') {
          msg.args.lang = 'jb'
        }
        var attempt = writeInt(msg.args.number, { lang: msg.args.lang })
        if (attempt) {
          return attempt
        }
        return 'can\'t do that'
      }
    }
  }
}
