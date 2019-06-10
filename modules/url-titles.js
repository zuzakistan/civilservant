const cheerio = require('cheerio')
const request = require('request-promise-cache')
var getTitle = async function (url) {
  const response = await request({
    url: url,
    cacheKey: url
  })
  const $ = cheerio.load(response)
  return $('title').text()
}
module.exports = {
  events: {
    urls: async function (bot, urls, nick, to, text, msg) {
      Promise.all(urls.map(getTitle)).then(titles => {
        titles = titles.filter(Boolean)
        if (titles.length) {
          bot.shout(to, nick + ': ' + titles.join(' • '))
        }
      })
    }
  }
}
