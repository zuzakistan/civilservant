var exec = require('child_process').exec
var esc = require('shell-escape')
const colors = require('irc').colors.codes

function convertAgToIRC (str) {
  /* eslint-disable no-control-regex */
  return str
    .replace(/\x1b\[K/g, '')
    .replace(/\x1b\[30;43m/g, colors.yellow)
    .replace(/\x1b\[0m/g, colors.reset)
  /* eslint-enable no-control-regex */
}

function preventHilight (str) {
  return str
    .replace(/([ <+%@&~][a-zA-Z0-9_])([a-zA-Z0-9_]+)/g, '$1\u200b$2')
}

function processAg (str) {
  return convertAgToIRC(preventHilight(str))
}

function randomMessage () {
  return new Promise((resolve, reject) => {
    var c = exec(esc([__rootdir + '/ircspeak.sh']))
    var stdout = ''
    c.stdout.on('data', function (data) {
      stdout += data.toString()
    })
    c.stderr.on('data', function (data) {
      stdout += data.toString()
    })
    c.on('close', function () {
      stdout = stdout.replace(/^.+?> +/, '')
      resolve(stdout)
    })
  })
}

module.exports = {
  events: {
    message: async function (bot, nick, to) {
      const speakRate = 250
      if (Math.random() < 1 / speakRate) {
        const botOpinion = await randomMessage()
        bot.shout(to, preventHilight(botOpinion))
      }
    }
  },
  commands: {
    irclog: {
      help: 'get a random irc log for a given search term',
      aliases: ['ag'],
      command: function (bot, msg) {
        if (msg.args.length === 1) {
          return 'Usage: !irclog <search phrase>'
        }
        var c = exec(esc([__rootdir + '/irclog.sh', msg.body]))
        var stdout = ''
        c.stdout.on('data', function (data) {
          stdout += data.toString()
        })
        c.stderr.on('data', function (data) {
          stdout += data.toString()
        })
        c.on('close', function () {
          bot.say(msg.to, processAg(stdout))
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
