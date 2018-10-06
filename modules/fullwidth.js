module.exports = {
  commands: {
    fullwidth: {
      help: 'Ｃｒｅａｔｅｓ　ａｎ　ａｅｓｔｈｅｔｉｃ',
      aliases: [ 'vw', 'fw' ],
      command: function (bot, msg) {
        let codePoints = Array.prototype.map.call(msg.body, (c) => c.codePointAt(0) - 33 + 0xFF01)
        return String.fromCodePoint(...codePoints)
      }
    }
  }
}
