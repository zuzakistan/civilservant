var getUrls = require('get-urls')
module.exports = {
  events: {
    message: function (bot, nick, to, text, msg) {
      var urls = getUrls(text)
      if (urls.size) {
        bot.fireEvents('urls', urls, nick, to, text, msg)
        for (const url of urls) {
          const curr = new URL(url)
          bot.fireEvents('url', curr, nick, to, text, msg)
          bot.fireEvents('url:' + curr.hostname, curr, nick, to, text, msg)
        }
      }
    }
  }
}
