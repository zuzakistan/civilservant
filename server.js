var config = require('./config')
var githash = require('githash')
var path = require('path')
var modules = require('./modules')
var irc = require('irc')
const logger = require('./logger')

global.__rootdir = path.resolve(__dirname)
var bot = new irc.Client(config.get('irc.server'), config.get('irc.nick'), config.get('irc'))
bot.config = config

module.exports = bot

bot.log = logger
bot.reload = function () {
  return modules.loadAllModules(bot)
}

if (!bot.config.quiet) {
  bot.log('info', 'civilservant ' + githash())
}

bot.connect((welcomeMsg) => {
  if (welcomeMsg.user && welcomeMsg.host) {
    bot.log('info', `Connected to ${welcomeMsg.host} as ${welcomeMsg.user}`)
  } else {
    bot.log('info', 'Connected')
  }
  if (welcomeMsg.args && welcomeMsg.args.length > 1) {
    bot.log('verbose', welcomeMsg.args[1])
  }
  modules.loadAllModules(bot, './plugins')
  bot.reload()
})
