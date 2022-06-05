const fs = require('fs')
module.exports = {
  commands: {
    note: {
      help: 'Adds a note',
      command: function (bot, msg) {
        return new Promise((resolve, reject) => {
          fs.appendFile(__rootdir + '/data/notes.txt', '\n' + msg.body, (e) => {
            if (e) reject(e)
            return resolve('Noted!')
          })
        })
      }
    }
  }
}
