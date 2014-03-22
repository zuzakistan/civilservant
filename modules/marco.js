var scrape = require('scrape');
var _ = require('underscore');
var bot = require('..')

bot.addListener('message', function (nick, to, text, message) {
  if(text == "!marco") {
    var marco = 'http://newmarco.co.uk/new_orderorder_takeaway_in_Cardiganshire_try_Pizzas_c_64751.htm';
    scrape.request(marco, function (err, $) {
      if (err) {
        return console.error(err)
      }
      $('img').each(function (pre) {
        var curr = pre.attribs.src
        if (curr.indexOf('current_time') != -1) {
          curr = curr.split('_')
          curr = [curr[3], curr[4].split('.png')[0]]
          bot.say(to, nick + ': Collection time is ' + curr[0] + ' minutes. Delivery time is ' + curr[1] + ' minutes.')
        }
      })
      $('span').each(function (span) {
        var curr = pre.attribs.class
        if (curr == 'online_msg') {
          bot.say(span.text)
    })
  }
})
