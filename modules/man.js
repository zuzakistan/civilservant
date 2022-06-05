const exec = require('child_process').exec
const esc = require('shell-escape')
module.exports = {
  commands: {
    man: {
      help: 'look up a man page',
      usage: ['page'],
      command: function (bot, msg) {
        const args = [msg.args.page]
        const c = exec('man -f ' + esc(args))
        let stdout = ''
        c.stderr.on('data', function (data) {
          stdout += data.toString()
        })
        c.on('close', function () {
          bot.say(msg.to, stdout)
        })
      }
    }
  }
}
