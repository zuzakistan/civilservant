const writeInt = require('write-int')
module.exports = {
  commands: {
    num: {
      help: 'Outputs a number in a given language',
      usage: ['lang', 'number'],
      command: function (bot, msg) {
        if (msg.args.lang === 'jbo') {
          msg.args.lang = 'jb'
        }
        const attempt = writeInt(msg.args.number, { lang: msg.args.lang })
        if (attempt) {
          return attempt
        }
        return 'can\'t do that'
      }
    }
  }
}
