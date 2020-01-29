var write = require('fs').writeFileSync
var read = require('fs').readFileSync
var colors = require('irc').colors
var BitlyClient = require('bitly').BitlyClient
const owo = require('@zuzak/owo')

const plugin = require('../plugins/news')

var oldnews = {}

module.exports = {
  commands: {
    poll: {
      help: 'poll for news',
      privileged: true,
      command: function () {
        plugin.pollApis(true)
        return 'ok'
      }
    },
    clearnews: {
      help: 'Clears the news cache',
      command: function (bot) {
        oldnews = {}
        return 'News cache cleared. Take cover :)'
      }
    },
    corrections: {
      help: 'Sends link to BBC News corrections',
      command: () => 'https://www.bbc.co.uk/contact/questions/getting-in-touch/report-news-fault'
    }
  },
  onload: function () {
    try {
      oldnews = require(__rootdir + '/data/news.json') || {}
    } catch (e) {
      oldnews = {}
    }
  },
  events: {
    /**
     * The rawnews event is defined in plugins/news.js, and triggers on each poll
     * of the BBC News API. Here, we extract useable data from the rather idiosyncratic API
     * and send it to the news event.
     */
    'rawnews:bbc': function (bot, story) {
      if (story && story.headline) {
        bot.fireEvents('news', {
          color: 'dark_red',
          id: 'BBC' + story.headline + story.assetUri,
          text: story.headline,
          url: 'https://bbc.co.uk' + story.assetUri,
          source: 'BBC',
          prompt: 'BBC BREAKING'
        })
      }
    },
    'rawnews:reuters': function (bot, story) {
      if (!story.headline) return
      bot.fireEvents('news', {
        color: 'orange',
        id: story.headline,
        prompt: story.label ? story.label : 'Reuters',
        tail: story.tag ? story.tag : null,
        text: story.headline,
        source: 'Reuters',
        url: story.url ? story.url : null
      })
    },
    'rawnews:mi5': function (bot, feed) {
      const item = feed.items[0]
      bot.fireEvents('news', {
        color: 'light_cyan',
        id: item.guid,
        prompt: feed.feed.title,
        text: item.content,
        source: 'Security Service',
        url: item.link
      })
    },
    'rawnews:reuwire': function (bot, stories) {
      for (let i = 0; i < stories.length; i++) {
        const story = stories[i]
        bot.fireEvents('news', {
          color: 'yellow',
          id: story.id,
          text: story.headline,
          loud: true,
          prompt: 'Reuters',
          source: 'Reuters',
          url: 'http://www.reuters.com' + story.url
        })
      }
    },
    'rawnews:aljaz': function (bot, story) {
      if (story.Alert) {
        for (var i = 0; i < story.AlertText.length; i++) {
          var curr = story.AlertText[0]
          bot.fireEvents('news', {
            color: 'orange',
            id: curr.GUID,
            prompt: 'Al Jazeera ' + curr.Type,
            text: curr.Text,
            source: 'Al Jazeera',
            url: curr.Url
          })
        }
      }
    },
    news: function (bot, news) {
      if (!oldnews[news.id]) {
        oldnews[news.id] = news
        write(__rootdir + '/data/news.json', JSON.stringify(news))
        bot.fireEvents('newNews', news)
      }
    },
    newNews: async (bot, news) => {
      var bitly = new BitlyClient(bot.config.get('bitly.accesstoken'), {})
      let res
      try {
        res = await bitly.shorten(news.url)
      } catch (e) {
        res = { data: { url: news.url } }
      }
      var str = ''
      if (news.prompt) {
        str += colors.wrap(news.color, news.prompt + ': ')
      }
      // news transform
      try {
        if (bot.config.get('news.replace')) {
          var substitutions = JSON.parse(read(__rootdir + '/data/substitutions.json', { encoding: 'utf-8' }))
          var stringsToReplace = Object.keys(substitutions)
          var newstr = news.text
          for (var i = 0; i < stringsToReplace.length; i++) {
            newstr = newstr.replace(stringsToReplace[i], '\x1f' + substitutions[stringsToReplace[i]] + '\x0f')
          }
          str += newstr
        } else {
          str += news.text
        }
        if (Math.random() <= bot.config.get('news.owo')) {
          str = owo(str)
        }
      } catch (e) {
        str += news.text + '(err)'
      }
      if (res.url) {
        str += ' ' + colors.wrap('gray', res.url)
      }
      if (news.tail) {
        str += ' ' + colors.wrap('magenta', '(' + news.tail + ')')
      }

      if (!news.loud) {
        bot.broadcast(str)
      } else {
        bot.log('debug', 'Not broadcasting loud news')
      }
    }
  }
}
