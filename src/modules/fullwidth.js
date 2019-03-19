function toFullwidth (str) {
  let codePoints = Array.prototype.map.call(str, (c) => c.codePointAt(0))
  codePoints = codePoints.map((c) => {
    if (c >= 33 && c <= 126) return c - 33 + 0xFF01
    const nonAscii = {
      32: 0x3000, // Space
      162: 0xFFE0, // ￠
      163: 0xFFE1, // ￡
      165: 0xFFE5, // ￥
      166: 0xFFE4, // ￤
      172: 0xFFE2, // ￢
      175: 0xFFE3, // ￣
      8361: 0xFFE6 // ￦
    }
    if (c in nonAscii) return nonAscii[c]
    return c
  })
  return String.fromCodePoint(...codePoints)
}

module.exports = {
  commands: {
    fullwidth: {
      help: 'Ｃｒｅａｔｅｓ　ａｎ　ａｅｓｔｈｅｔｉｃ',
      aliases: [ 'vw', 'fw' ],
      command: function (bot, msg) {
        return toFullwidth(msg.body)
      }
    }
  },
  events: {
    message: function (bot, nick, to, text) {
      if (text.match(/\b. . (. )+.?\b/)) {
        bot.shout(to, toFullwidth(text.match(/\b. . (. )+.?\b/)[0].replace(/(.) (.) ?/g, '$1$2')))
      }
    }
  }
}
