const convert = require('cyrillic-to-latin')

module.exports = {
  events: {
    message: function (bot, nick, to, text) {
      if (bot.config.get('transliteration.cyrillic') === false) return
      if (text.match(/[а-я]+/i)) {
        const roman = convert(text)
        if (roman.trim()) {
          bot.shout(to, '\u000314' + roman)
        }
      }
    }
  }
}
