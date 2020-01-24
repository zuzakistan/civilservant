const TwitterPin = require('twitter-pin')
const Tweeter = require('fast-tweet')
const owo = require('@zuzak/owo')
const colors = require('irc').colors

let twitterPin

module.exports = {
  onload: (bot) => {
    twitterPin = TwitterPin(bot.config.get('twitter.keys.consumerKey'), bot.config.get('twitter.keys.consumerSecret'))
    bot.tweet = async (user, payload) => {
      const client = new Tweeter({
        consumer_key: bot.config.get('twitter.keys.consumerKey'),
        consumer_secret: bot.config.get('twitter.keys.consumerSecret'),
        access_token_key: bot.config.get(`twitter.users.${user}.key`),
        access_token_secret: bot.config.get(`twitter.users.${user}.secret`)
      })
      const response = await client.tweet(payload)
      if (bot.config.has('twitter.reportingChannel')) {
        bot.notice(bot.config.get('twitter.reportingChannel'), [
          colors.wrap('light_cyan', '@' + user),
          ' ',
          colors.wrap('cyan', response.text),
          ' ',
          colors.wrap('light_blue', 'https://twitter.com/' + user + '/statuses/' + response.id_str)
        ].join(''))
      }
      return response
    }
  },
  commands: {
    twitterauth: {
      help: 'Get twitter authentication URL',
      command: () => {
        return new Promise((resolve, reject) => {
          twitterPin.getUrl(function (err, url) {
            if (err) return reject(err)
            resolve(url)
          })
        })
      }
    },
    pin: {
      help: 'Authenticate with a Twitter PIN',
      usage: ['pin'],
      command: async (bot, msg) => {
        const response = await new Promise((resolve, reject) => {
          twitterPin.authorize(msg.args.pin, (err, result) => {
            if (err) return reject(err)
            resolve(result)
          })
        })
        bot.config.set(`twitter.users.${response.screen_name}.key`, response.token)
        bot.config.set(`twitter.users.${response.screen_name}.secret`, response.secret)
        bot.say(msg.nick, JSON.stringify(response))
        return 'authorized as ' + response.screen_name
      }
    },
    tweet: {
      privileged: true,
      help: 'Tweets a tweet',
      command: async (bot, msg) => {
        const user = bot.config.get('twitter.tweetUser')
        if (!user) return 'tweeting disabled'
        const tweet = await bot.tweet(user, { status: msg.body })
        return 'https://twitter.com/statuses/' + tweet.id_str
      }
    }
  },
  events: {
    newNews: (bot, news) => {
      if (!bot.config.has('twitter.newsUser')) return undefined
      let user = bot.config.get('twitter.newsUser')
      if (news.loud) {
        user = bot.config.get('twitter.loudNewsUser')
        bot.log('debug', 'Tweeting with loud news user')
      }
      if (!user) return new Error('tweeting disabled')
      const url = news.url ? news.url : ''
      bot.tweet(user, { status: owo(news.text) + '\r\n' + url })
    }
  }
}
