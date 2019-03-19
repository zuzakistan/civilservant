var fs = require('fs')
module.exports = {
  commands: {
    note: {
      help: 'Adds a note',
      command: function (bot, msg) {
        fs.appendFile(__rootdir + '/data/notes.txt', '\n' + msg.body)
        return 'Noted!'
      }
    }
  }
}
