module.exports = {
  events: {
    udp: function (bot, msg, rinfo) {
      if (rinfo.address === bot.config.get('yakc.ip')) {
        bot.fireEvents('yakc', msg.toString(), rinfo)
      } else {
        bot.notice(bot.config.get('udp.channel'), msg.toString())

        // copy https://github.com/zuzak/twitter-irc-udp messages from verified users:
        if (msg.toString().includes('✓')) {
          bot.notice(bot.config.get('irc.control'), msg.toString())
        }
      }
    }
  }
}
