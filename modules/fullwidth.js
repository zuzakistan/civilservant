module.exports = {
  commands: {
    fullwidth: {
      help: 'Ｃｒｅａｔｅｓ　ａｎ　ａｅｓｔｈｅｔｉｃ',
      aliases: [ 'vw', 'fw' ],
      command: function (bot, msg) {
        let codePoints = Array.prototype.map.call(msg.body, (c) => c.codePointAt(0))
        codePoints = codePoints.map((c) => {
          if (c >= 33 && c <= 126) return c - 33 + 0xFF01
          return c
        })
        return String.fromCodePoint(...codePoints)
      }
    }
  }
}
