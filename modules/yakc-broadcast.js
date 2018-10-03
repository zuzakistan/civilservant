var colors = require('irc').colors

module.exports = {
  events: {
    yakc: function (bot, msg) {
      var split = msg.split(' ')

      // white black dark_blue dark_green light_red
      // dark_red magenta orange yellow light_green
      // cyan light_cyan light_blue light_magenta
      // gray light_grey reset
      var actions = {
        'placebo': 'gray',
        'directly': 'white',
        'veto': 'dark_red',
        'decent': 'light_green',
        'bad': 'light_red',
        'shunted': 'dark_blue',
        'unshunted': 'light_blue',
        'demoted': 'magenta',
        'featured': 'orange',
        'held': 'yellow'
      }

      for (var i = split.length; i > 0; i--) { /* backwards */
        if (actions[split[i]]) {
          msg = colors.wrap(actions[split[i]], msg)
          break
        }
      }
      bot.notice(bot.config.get('yakc.channel'), msg)
    }
  }
}
