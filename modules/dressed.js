module.exports = {
  events: {
    /* TODO: fix dupe bot var */
    message: function (bot, nick, to, text) {
      var pc = text.match(/(not dressed)+/gi)
      if (pc && pc.length !== 0) {
        bot.shout(to, 'https://youtu.be/X6oUz1v17Uo?t=143')
        bot.shout(to, pc.join(' '))
      }
    }
  }
}
