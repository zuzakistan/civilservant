var scrape = require('scrape')
module.exports = {
  commands: {
    cheese: {
      help: 'Returns the Cheese of the Day',
      command: function (bot, msg) {
        scrape.request('http://www.cheese.com', function (err, $) {
          if (err) {
            return
          }
          $('#cheese-of-day').each(function (div) {
            var a = div.find('a').first()
            var h4 = div.find('h4').first()
            bot.say(msg.to, msg.nick + ': the cheese of the day is ' + h4.text + ' https://www.cheese.com' + a.attribs.href)
          })
        })
      }
    }
  }
}
