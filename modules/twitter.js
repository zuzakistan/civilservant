const TwitterPin = require('twitter-pin')
const Tweeter = require('fast-tweet')
const owo = require('@zuzak/owo')
let twitterPin

module.exports = {
  onload: (bot) => {
    twitterPin = TwitterPin(bot.config.get('twitter.keys.consumerKey'), bot.config.get('twitter.keys.consumerSecret'))
    bot.tweet = (user, payload) => {
      let client = new Tweeter({
        consumer_key: bot.config.get('twitter.keys.consumerKey'),
        consumer_secret: bot.config.get('twitter.keys.consumerSecret'),
        access_token_key: bot.config.get(`twitter.users.${user}.key`),
        access_token_secret: bot.config.get(`twitter.users.${user}.secret`)
      })
      return client.tweet(payload)
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
        let response = await new Promise((resolve, reject) => {
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
        let user = bot.config.get('twitter.tweetUser')
        if (!user) return 'tweeting disabled'
        let tweet = await bot.tweet(user, { status: msg.body })
        return 'https://twitter.com/statuses/' + tweet.id_str
      }
    }
  },
  events: {
    newNews: (bot, news) => {
      if (!bot.config.has('twitter.newsUser')) return undefined
      let user = bot.config.get('twitter.newsUser')
      if (!user) return 'tweeting disabled'
      let url = news.url ? news.url : ''
      bot.tweet(user, { status: owo(news.text) + '\r\n' + url })
    }
  }
}
