var exec = require('child_process').exec
var esc = require('shell-escape')
const colors = require('irc').colors.codes;
module.exports = {
  commands: {
    irclog: {
      help: 'get a random irc log for a given search term',
      command: function (bot, msg) {
        if (msg.args.length === 1) {
          return 'Usage: !irclog <search phrase>'
        }
        var c = exec(esc(['/home/zuzak/git/civilservant/irclog.sh', msg.body]))
        var stdout = ''
        c.stdout.on('data', function (data) {
          stdout += data.toString()
        })
        c.stderr.on('data', function (data) {
          stdout += data.toString()
        })
        c.on('close', function () {
          stdout = stdout.replace('[30;43m', colors.yellow)
          stdout = stdout.replace('[K', colors.reset)
          bot.say(msg.to, stdout)
        })
      }
    }
  }
}
