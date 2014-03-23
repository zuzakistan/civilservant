var scrape = require('scrape');
var _ = require('underscore');
var bot = require('..')

bot.addListener('message', function (nick, to, text, message) {
  var marco = 'http://newmarco.co.uk/new_orderorder_takeaway_in_Cardiganshire_try_Pizzas_c_64751.htm';
  if(text == "!marco") {
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
        var curr = span.attribs.class
        if (curr == 'online_msg') {
          bot.say(to, span.text)
        }
      })
    })
  } else if (text == "!pizza") {
    scrape.request(marco, function (err, $) {
      if (err) {
        return console.error(err)
      }
      var pizzas = [];
      $('div').each(function (div) {
        if (div.attribs.class == "subcat_name") {
          pizzas.push(div.text)
        }
      })
      bot.say(to, nick + ": " + pizzas[Math.floor(Math.random()*pizzas.length)])
    })
  }
})
