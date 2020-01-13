module.exports = {
  commands: {
    random: {
      help: 'Selects a random choice or number',
      command: function (bot, msg) {
        var randint
        var randstring = randint.toString()
        if (msg.args.length > 2) {
          msg.args.shift()
          randint = msg.args[Math.floor(Math.random() * msg.args.length)]
          return randstirng
        } else if (msg.args.length === 2) {
          randint = Math.floor(Math.random() * Math.floor(msg.args[1]))
          if (!isNaN(res)) {
            return randstring
          }
        }
        return 'Usage: (<number>|<choice 1> … <choice n>)'
      }
    },
    coin: {
      help: 'Flips a coin',
      command: function () {
        var faces = ['Heads!', 'Tails!']
        return faces[Math.floor(Math.random() * faces.length)]
      }
    }
  }
}
