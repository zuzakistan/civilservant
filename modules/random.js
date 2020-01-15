module.exports = {
  commands: {
    random: {
      aliases: ['choice'],
      help: 'Selects a random choice or number',
      command: function (bot, msg) {
        if (msg.args.length > 2) { // e.g. !random foo bar baz
          // Select a random choice from a list:
          msg.args.shift()
          return msg.args[Math.floor(Math.random() * msg.args.length)]
        } else if (msg.args.length === 2) { // e.g. !random 6
          // Select a random integer from a range:
          var res = Math.floor(Math.random() * Math.floor(msg.args[1]))
          if (!isNaN(res)) {
            return res.toString()
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
