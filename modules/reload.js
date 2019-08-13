var exec = require('child_process').exec
var githash = require('githash')
module.exports = {
  commands: {
    reload: {
      privileged: true,
      help: 'Reloads all modules to pick up code changes',
      command: async function (bot, msg) {
        await bot.reload()
        return 'Reloaded'
      }
    },
    modules: {
      privileged: true,
      help: 'Lists currently loaded modules',
      command: function (bot) {
        return bot.modules.length + ' modules loaded (' + bot.modules.join(', ') + ')'
      }
    },
    pull: {
      privileged: true,
      help: 'Pull code from upstream',
      command: function (bot, msg) {
        bot.say(msg.to, msg.nick + ': pulling...')
        exec('git pull --rebase', function () {
          bot.say(msg.to, msg.nick + ':        ...reloading...')
          bot.reload()
          bot.say(msg.to, msg.nick + ':                    ...done.')
        })
      }
    },
    hash: {
      help: 'Get hash of the current codebase',
      aliases: [ 'version' ],
      command: function () {
        return 'https://github.com/zuzakistan/civilservant/commit/' + githash()
      }
    }
  },
  events: {
    version: function (bot, from) {
      bot.ctcp(from, 'NOTICE', 'VERSION https://github.com/zuzakistan/civilservant/tree/' + githash())
    },
    'github:push': async (bot, ghEvent) => {
      console.log('Event fired')
      if (bot.config.get('github.autoPull.enabled') !== false) {
        console.log('Autopull enabled')
        let config = bot.config.get('github.autoPull')
        if (ghEvent.payload.ref === 'refs/heads/' + config.branch) {
          console.log('Matching branch')
          bot.notice(bot.config.get('irc.control'), 'Fetching new changes from GitHub')
          exec(`git fetch ${config.remote} ${config.branch}`, null, (e, fetchStderr) => {
            bot.notice(bot.config.get('irc.control'), fetchStderr)
            if (e) throw e
            bot.notice(bot.config.get('irc.control'), `Resetting to match ${config.remote} ${config.branch}`)
            exec(`git reset --hard ${config.remote}/${config.branch}`, null, async (err, resetStderr) => {
              bot.notice(bot.config.get('irc.control'), resetStderr)
              if (err) throw err
              await bot.reload()
              bot.notice(bot.config.get('irc.control'), 'Reloaded.')
            })
          })
        }
      }
    }
  }
}
