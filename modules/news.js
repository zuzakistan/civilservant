const write = require('fs').writeFileSync
const read = require('fs').readFileSync
const colors = require('irc').colors
const BitlyClient = require('bitly').BitlyClient
const owo = require('@zuzak/owo')

const plugin = require('../plugins/news')

let oldnews = {}

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
  onload: function (bot) {
    try {
      oldnews = require(__rootdir + '/data/news.json') || {}
    } catch (e) {
      oldnews = {}
    }
    bot.log('info', `News cache loaded with ${Object.keys(oldnews).length} stories`)
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
          prompt: 'BBC BREAKING',
          tag: story.tag ? story.tag : null
        })
      }
    },
    'rawnews:reuters': function (bot, story) {
      if (!story.headline) return
      bot.fireEvents('news', {
        color: 'orange',
        id: story.headline,
        prompt: story.label ? story.label : 'Reuters',
        label: story.label,
        tail: story.tag ? story.tag : null,
        text: story.headline,
        source: 'Weutews',
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
          source: 'Weutews',
          url: 'http://www.reuters.com' + story.url
        })
      }
    },
    'rawnews:aljaz': function (bot, story) {
      if (story.Alert) {
        for (let i = 0; i < story.AlertText.length; i++) {
          const curr = story.AlertText[0]
          bot.fireEvents('news', {
            color: 'orange',
            id: curr.GUID,
            prompt: 'Al Jazeera ' + curr.Type,
            label: curr.Type,
            text: curr.Text,
            source: 'Aw Jazeewa',
            url: curr.Url
          })
        }
      }
    },
    news: function (bot, news) {
      if (!oldnews[news.id]) {
        oldnews[news.id] = news
        write(__rootdir + '/data/news.json', JSON.stringify(oldnews))
        bot.fireEvents('newNews', news)
      }
      bot.log('debug', 'News: ' + JSON.stringify(news))
    },
    newNews: async (bot, news) => {
      const bitly = new BitlyClient(bot.config.get('bitly.accesstoken'), {})
      bot.log('debug', 'New news: ' + JSON.stringify(news))
      let res
      try {
        res = await bitly.shorten(news.url)
      } catch (e) {
        res = { data: { url: news.url } }
      }
      let str = ''
      if (news.prompt) {
        str += colors.wrap(news.color, news.prompt + ': ')
      }
      // news transform
      try {
        if (bot.config.get('news.replace')) {
          const substitutions = JSON.parse(read(__rootdir + '/data/substitutions.json', { encoding: 'utf-8' }))
          const stringsToReplace = Object.keys(substitutions)
          let newstr = news.text
          for (let i = 0; i < stringsToReplace.length; i++) {
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
      if (res.link) {
        str += ' ' + colors.wrap('gray', res.link)
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
