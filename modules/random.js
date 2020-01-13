module.exports = {
  commands: {
    random: {
      help: 'Selects a random choice or number',
      command: function (bot, msg) {
        if (msg.args.length > 2) {
          msg.args.shift()
          randint = msg.args[Math.floor(Math.random() * msg.args.length)]
          return randint.toString()
        } else if (msg.args.length === 2) {
          randint = Math.floor(Math.random() * Math.floor(msg.args[1]))
          if (!isNaN(randint)) {
            return randint.toString()
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
