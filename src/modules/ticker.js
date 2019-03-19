module.exports = {
  commands: {
    news: {
      help: 'Returns a random ticker message from Sim City 3000',
      command: function (bot, msg) {
        var items = require('../data/ticker.json')
        var item = items[Math.floor(Math.random() * items.length)]
        item = item.replace(/\$city/g, msg.to)
        item = item.replace(/\$mayor/g, msg.nick)
        item = '\u000313LATEST:\u00036 ' + item
        bot.notice(msg.to, item)
      }
    }
  }
}
