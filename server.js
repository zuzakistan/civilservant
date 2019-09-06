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

modules.loadAllModules(bot, './plugins')
bot.reload()
