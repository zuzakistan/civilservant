var urban = require('urban')
const colors = require('irc').colors

module.exports = {
  commands: {
    ud: {
      aliases: ['urban'],
      help: 'Looks up a headword in Urban Dictionary',
      command: function (bot, msg) {
        if (msg.args.length === 1) {
          return ': Usage: !urban <headword>'
        }
        var req = urban(msg.body)
        let promise = new Promise((resolve, reject) => {
          req.first(function (data) {
            if (typeof data === 'undefined') {
              reject(new Error('unable to find a definition for ' + msg.body))
            } else {
              data.definition = data.definition.replace(/\[/g, colors.codes.white)
              data.definition = data.definition.replace(/\]/g, colors.codes.reset)
              const ts = new Date(data.written_on).toLocaleDateString('en-GB', { year: 'numeric' })
              const headwordColor = msg.body.toLowerCase() === data.word.toLowerCase() ? 'orange' : 'yellow'
              resolve(`${colors.wrap(headwordColor, data.word)} (${ts}): ${data.definition} ${colors.wrap('gray', data.permalink)}`)
            }
          })
        })
        return promise
      }
    }
  }
}
