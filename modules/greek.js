var convert = require('greek-utils')

module.exports = {
  events: {
    message: function (bot, nick, to, text) {
      if (text.match(/[α-ω]+/i)) {
        var roman = convert.toTransliteratedLatin(text)
        if (roman.trim()) {
          bot.shout(to, '\u000314' + roman)
        }
      }
    }
  }
}
