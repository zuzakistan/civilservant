var bot = require('..')

/*
 * Same as .say but for unprompted messages.
 * Checks a config variable to make sure it only does this in channels that want it.
 */
bot.shout = function (target, message) {
  if (!bot.config.get('irc.quiet')) {
    bot.say(target, message)
  }
}
