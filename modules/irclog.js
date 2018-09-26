var exec = require('child_process').exec
var esc = require('shell-escape')
const colors = require('irc').colors.codes
module.exports = {
  commands: {
    irclog: {
      help: 'get a random irc log for a given search term',
      aliases: ['ag'],
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
          stdout = stdout.replace(/\[30;43m/g, colors.yellow)
          stdout = stdout.replace(/\[K/g, colors.reset)
          bot.say(msg.to, stdout)
        })
      }
    },
    irccount: {
      help: 'count the occurences of a string in the irc logs',
      aliases: [ 'agc', 'ircc', 'irclogc' ],
      command: function (bot, msg) {
        if (msg.args.length === 1) {
          return 'Usage: !irclog <search phrase>'
        }
        var c = exec(esc(['ag', '-c', '--', msg.body, bot.config.logfile]))
        var stdout = ''
        c.stdout.on('data', function (data) {
          stdout += data.toString()
        })
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
