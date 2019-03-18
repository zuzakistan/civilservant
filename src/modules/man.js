var exec = require('child_process').exec
var esc = require('shell-escape')
module.exports = {
  commands: {
    man: {
      help: 'look up a man page',
      usage: [ 'page' ],
      command: function (bot, msg) {
        var args = [ msg.args.page ]
        var c = exec('man -f ' + esc(args))
        var stdout = ''
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
