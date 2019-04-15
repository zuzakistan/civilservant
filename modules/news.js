var write = require('fs').writeFile
var read = require('fs').readFileSync
var colors = require('irc').colors
var Bitly = require('bitly')
const owo = require('@zuzak/owo')

const plugin = require('../plugins/news')

var oldnews = {}

/**
 * JavaScript thinks that {a:1} doesn't equal {a:1},
 * so this function is a work-around to get that to work.
 */
function isEqualObj (a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

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
      command: function () {
        return 'http://www.bbc.co.uk/faqs/bbcnews_editorial'
      }
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
          id: 'BBC' + story.assetId,
          text: story.headline,
          url: 'https://bbc.co.uk' + story.assetUri,
          prompt: 'BBC BREAKING'
        })
      }
    },
    'rawnews:reuters': function (bot, story) {
      if (!story.headline) return
      bot.fireEvents('news', {
        color: 'orange',
        id: story.tag + story.headline,
        prompt: story.label ? story.label : 'Reuters',
        tail: story.tag ? story.tag : null,
        text: story.headline,
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
        url: item.link
      })
    },
    'rawnews:bloomberg': function (bot, stories) {
      for (var i = 0; i < stories.length; i++) {
        var story = stories[i]
        if (story) {
          bot.fireEvents('news', {
            color: 'purple',
            id: 'bbrg' + story.toString(),
            text: JSON.stringify(story),
            url: null,
            prompt: stories.editorialTitle,
            tail: 'Bloomberg (test)'
          })
        }
      }
    },
    'rawnews:reuwire': function (bot, stories) {
      for (let i = 0; i < stories.length; i++) {
        let story = stories[i]
        bot.fireEvents('news', {
          color: 'yellow',
          id: story.id,
          text: story.headline,
          prompt: 'Reuters',
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
            url: curr.Url
          })
        }
      }
    },
    news: function (bot, news) {
      console.log('NEWSNEWSNEWS', news)
      if (!oldnews[news.id] || !isEqualObj(oldnews[news.id], news)) {
        bot.fireEvents('newNews', news)
      }
    },
    newNews: (bot, news) => {
      var bitly = new Bitly(bot.config.get('bitly.username'), bot.config.get('bitly.password'))
      bitly.shorten(news.url, function (err, res) {
        if (err) res = { data: { url: news.url } }
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
        if (res.data.url) {
          str += ' ' + colors.wrap('gray', res.data.url)
        }
        if (news.tail) {
          str += ' ' + colors.wrap('magenta', '(' + news.tail + ')')
        }

        bot.broadcast(str)
      })
      oldnews[news.id] = news
      write(__rootdir + '/data/news.json', JSON.stringify(oldnews))
    }
  }
}
