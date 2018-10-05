module.exports = {
  commands: {
    fullwidth: {
      help: 'Ｃｒｅａｔｅｓ　ａｎ　ａｅｓｔｈｅｔｉｃ',
      usage: [ 'word' ],
      aliases: [ 'vw', 'fw' ],
      command: function (bot, msg) {
        let response = ''
        for (let i = 0; i < msg.args.word.length; i++) {
          let letter = msg.args.word.charCodeAt(i) - 33
          response += String.fromCharCode(letter + 0xFF01)
        }
        return response
      }
    }
  }
}
