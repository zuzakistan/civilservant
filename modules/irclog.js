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

function logExec (forExec) {
  return new Promise((resolve, reject) => {
    var c = exec(esc(forExec))
    var stdout = ''
    c.stdout.on('data', (d) => { stdout += d.toString() })
    c.stderr.on('data', (d) => { stdout += d.toString() })
    c.on('close', () => resolve(stdout))
  })
}

module.exports = {
  events: {
    message: async function (bot, nick, to) {
      const speakRate = 250
      if (Math.random() < 1 / speakRate) {
        const res = await logExec([__rootdir + '/ircspeak.sh'])
        bot.shout(to, preventHilight(res.replace(/^.+?> +/, '')))
      }
    }
  },
  commands: {
    irclog: {
      help: 'get a random irc log for a given search term',
      privileged: true,
      aliases: ['ag'],
      command: async function (bot, msg) {
        if (msg.args.length === 1) {
          return 'Usage: !irclog <search phrase>'
        }
        const res = await logExec([__rootdir + '/irclog.sh', msg.body])
        bot.say(msg.to, processAg(res))
      }
    },
    irccount: {
      help: 'count the occurences of a string in the irc logs',
      privileged: true,
      aliases: [ 'agc', 'ircc', 'irclogc' ],
      command: async function (bot, msg) {
        if (msg.args.length === 1) {
          return 'Usage: !irclog <search phrase>'
        }
        if (!bot.config.has('irclogs')) return 'Error: No logfile specified'
        const res = await logExec(['ag', '-c', '--', msg.body, bot.config.get('irclogs')])
        bot.say(msg.to, processAg(res))
      }
    }
  }
}
