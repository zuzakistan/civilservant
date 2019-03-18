var config = require('./config')
var path = require('path')
var modules = require('./modules')
var irc = require('irc')

global.__rootdir = path.resolve(__dirname)
var bot = new irc.Client(config.get('irc.server'), config.get('irc.nick'), config.get('irc'))
bot.config = config

module.exports = bot

bot.githash = function() {
  return require('child_process').execSync('git rev-parse HEAD')
}

bot.reload = function () {
  return modules.loadAllModules(bot)
}

if (!bot.config.quiet) {
  console.log('civilservant ' + bot.githash())
}

modules.loadAllModules(bot,  __rootdir + '/plugins')
bot.reload()
