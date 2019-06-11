const cheerio = require('cheerio')
const request = require('request')
var getTitles = function (bot, to, nick, urls, titles) {
  const maxSize = 1024
  var size = 0
  var response = ''
  var req = request(urls[0])
  // Check the size of the downloaded data regularly
  req.on('data', chunk => {
    size += chunk.length
    response += chunk.toString()
    // After maxSize bytes, abort
    if (size > maxSize) {
      req.abort()
    }
  }).on('error', () => {
    // If there was an error, don't bother trying to get the title
    // But still process the rest of the URLs
    if (urls.length > 1) {
      getTitles(bot, to, nick, urls.slice(1), titles)
    // Then shout
    } else {
      titles = titles.filter(Boolean)
      if (titles.length) bot.shout(to, nick + ': ' + titles.join(' • '))
    }
  }).on('end', () => {
    // After aborting (or finishing), parse title
    const $ = cheerio.load(response)
    const title = $('title').text()
    titles.push(title)
    // Recursively call self until all titles are parsed
    if (urls.length > 1) {
      getTitles(bot, to, nick, urls.slice(1), titles)
    // Then shout
    } else {
      titles = titles.filter(Boolean)
      if (titles.length) bot.shout(to, nick + ': ' + titles.join(' • '))
    }
  })
}
module.exports = {
  events: {
    urls: function (bot, urls, nick, to, text, msg) {
      getTitles(bot, to, nick, [...urls], [])
    }
  }
}
