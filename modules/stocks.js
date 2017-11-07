var request = require('request')
var util = require('util')

var SYMBOL_API_FMT = 'https://query.yahooapis.com/v1/public/yql?q=select%%20*%%20from%%20yahoo.finance.quotes%%20where%%20symbol%%20in%%20(%%22%s%%22)&format=json&env=store%%3A%%2F%%2Fdatatables.org%%2Falltableswithkeys&callback='
var RESULT_FMT = '%s (%s): %s %s (%s)'

function get_sym (symbol, cb) {
  /* cb should accept e, r { value, delta, % delta } */
  var req = util.format(SYMBOL_API_FMT, symbol)

  request.get(req, function (e, r, b) {
    if (e) {
      cb(e, r, b)
      return 'problem fetching data'
    }
    if (r.statusCode !== 200) {
      cb('bad status code', r, b)
      return 'problem fetching data (' + r.statusCode + ')'
    }

    var data = JSON.parse(b)
    var symboldata = data.query.results.quote

    cb(e, symboldata)
  })
}

module.exports = {
  commands: {
    stock: {
      help: 'Displays information about a ticker symbol via yahoo',
      aliases: [ 'yhoo' ],
      usage: [ 'symbol' ],
      command: function (bot, msg) {
        get_sym(msg.args.symbol, function (e, r) {
          if (e) {
            bot.say(msg.to, 'Problem fetching symbol: ' + e)
          } else if (r.Currency) { // probably always exists
            bot.say(msg.to, util.format(RESULT_FMT, r.symbol, r.Name, r.Ask, r.Currency, r.Change_PercentChange))
          } else {
            bot.say(msg.to, 'Problem parsing symbol')
          }
        })
      }
    }
  }
}
