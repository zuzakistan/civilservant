var getUrls = require('get-urls')
var parseurl = require('url')
module.exports = {
  events: {
    message: function (bot, nick, to, text, msg) {
      var urls = getUrls(text)
      if (urls.size) {
        bot.fireEvents('urls', urls, nick, to, text, msg)
        for (let url of urls) {
          let curr = parseurl.parse(url)
          console.log(curr)
          bot.fireEvents('url', curr, nick, to, text, msg)
          bot.fireEvents('url:' + curr.hostname, curr, nick, to, text, msg)
        }
      }
    }
  }
}
