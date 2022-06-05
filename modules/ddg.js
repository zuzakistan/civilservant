const DDG = require('node-ddg-api').DDG
const ddg = new DDG('civilservant')
module.exports = {
  commands: {
    ddg: {
      help: 'Look things up via the Duck Duck Go API.',
      command: function (bot, msg) {
        ddg.instantAnswer(
          msg.body,
          { skip_disambig: '1', no_html: '1' },
          function (e, r) {
            if (e) {
              bot.say(msg.to, 'E: ' + e)
            } else if (r.AbstractURL === '') {
              bot.say(msg.to, 'No results found')
            } else {
              bot.say(msg.to, r.Abstract)
              bot.say(msg.to, r.AbstractURL)
            }
          }
        )
      }
    }
  }
}
