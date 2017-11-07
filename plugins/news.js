var BBC_NEWS_URL = 'http://polling.bbc.co.uk/news/latest_breaking_news?audience=Domestic'
var BBC2_NEWS_URL = 'https://polling.bbc.co.uk/news/latest_breaking_news_waf'
var GDN_NEWS_URL = 'https://api.nextgen.guardianapps.co.uk/news-alert/alerts'
var REU_UK_NEWS_URL = 'http://uk.reuters.com/assets/breakingNews?view=json'
var REU_NEWS_URL = 'http://uk.reuters.com/assets/breakingNews?view=json'
var IND_NEWS_URL = 'https://www.independent.co.uk/layout_component/api-mmm'
var I100_NEWS_URL = 'https://www.independent.co.uk/layout_component/api-i100'
var TGRAPH_NEWS_URL = 'http://s3.eip.telegraph.co.uk/assets/_data/All.json'
var REUWIRE_URL = 'http://uk.reuters.com/assets/jsonWireNews'
var ALJAZ_ALERT = 'http://www.aljazeera.com/addons/alert.ashx'
var request = require('request')
var BLOOMBERG_ALERTS = [
  'https://www.bloomberg.com/api/modules/id/europe_breaking_news',
  'https://www.bloomberg.com/api/modules/id/us_breaking_news',
  'https://www.bloomberg.com/api/modules/id/canada_breaking_news',
  'https://www.bloomberg.com/api/modules/id/breaking_news',
  'https://www.bloomberg.com/api/modules/id/africa_breaking_news'
]

var bot = require('..')

var poll = function () {
  request(BBC_NEWS_URL, function (err, res, body) {
    if (!err) {
      var data
      try {
        data = JSON.parse(body)
      } catch (e) {
        if (e instanceof SyntaxError) {
          bot.shout(bot.config.irc.control, 'bbc news feed playing up')
          console.log(body, res)
          return
        }
        throw e
      }
      if (data.html !== '') {
        bot.fireEvents('rawnews:bbc', data.html)
      }
      setTimeout(poll, data.pollPeriod ? data.pollPeriod : 30000)
    } else {
      setTimeout(poll, 30000)
    }
  })
  request(ALJAZ_ALERT, function (err, res, body) {
    if (!err) {
      var data
      try {
        data = JSON.parse(body)
      } catch (e) {
        if (e instanceof SyntaxError) {
          bot.shout(bot.config.irc.control, 'AJ feed playing up')
          return
        } else {
          bot.shout(bot.config.irc.control, 'AJ really playing up')
          // throw e;
        }
      }
      bot.fireEvents('rawnews:aljaz', data)
    }
  })
  for (var i = 0; i < BLOOMBERG_ALERTS.length; i++) {
    request(BLOOMBERG_ALERTS[i], function (err, res, body) {
      if (!err) {
        var data
        try {
          data = JSON.parse(body)
        } catch (e) {
          if (e instanceof SyntaxError) {
            bot.shout(bot.config.irc.control, 'bloomberg feed playing up')
            return
          } else {
            bot.shout(bot.config.irc.control, 'bloomberg really playing up')
            // throw e;
          }
        }
        bot.fireEvents('rawnews:bloomberg', data)
      }
    })
  }
  request(BBC2_NEWS_URL, function (err, res, body) {
    if (!err) {
      var data
      try {
        data = JSON.parse(body)
      } catch (e) {
        if (e instanceof SyntaxError) {
          bot.shout(bot.config.irc.control, 'bbc2 feed playing up')
          return
        } else {
          bot.shout(bot.config.irc.control, 'bbc2 really playing up')
          // throw e;
        }
      }
      bot.fireEvents('rawnews:bbc2', data.asset)
    }
  })
  request(GDN_NEWS_URL, function (err, res, body) {
    if (!err) {
      var data
      try {
        data = JSON.parse(body)
      } catch (e) {
        if (e instanceof SyntaxError) {
          bot.shout(bot.config.irc.control, 'guardian feed playing up')
          return
        } else {
          bot.shout(bot.config.irc.control, 'guardian feed really playing up')
          // throw e;
        }
      }
      bot.fireEvents('rawnews:gdn', data.collections)
    }
  })
  request(REU_UK_NEWS_URL, function (err, res, body) {
    if (!err) {
      var data
      try {
        data = JSON.parse(body)
      } catch (e) {
        // reuters send "" not "{}" on no-news
        if (e instanceof SyntaxError) {
          return false
        }
        throw e
      }
      data.tag = 'UK'
      bot.fireEvents('rawnews:reuters', data)
    }
  })
  request(REU_NEWS_URL, function (err, res, body) {
    if (!err) {
      var data
      try {
        data = JSON.parse(body)
      } catch (e) {
        // reuters send "" not "{}" on no-news
        if (e instanceof SyntaxError) {
          return false
        }
        throw e
      }
      data.tag = 'US'
      bot.fireEvents('rawnews:reuters', data)
    }
  })
  request(REUWIRE_URL, function (err, res, body) {
    if (!err) {
      var data
      try {
        data = JSON.parse(body)
      } catch (e) {
        // reuters send "" not "{}" on no-news
        if (e instanceof SyntaxError) {
          return false
        }
        throw e
      }
      bot.fireEvents('rawnews:reuwire', data.headlines)
    }
  })
  request(TGRAPH_NEWS_URL, function (err, res, body) {
    if (!err) {
      var data
      try {
        data = JSON.parse(body)
      } catch (e) {
        if (e instanceof SyntaxError) {
          bot.shout(bot.config.irc.control, 'telegraph feed playing up')
          return
        } else {
          bot.shout(bot.config.irc.control, 'telegraph feed really playing up')
          // throw e;
        }
      }
      bot.fireEvents('rawnews:telegraph', data)
    }
  })
}

poll()
