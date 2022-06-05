const request = require('request')
const axios = require('axios')

const POLL_TIMEOUT = 30 * 1000

const APIS = [
  {
    url: 'http://polling.bbc.co.uk/news/breaking-news/audience/domestic',
    eventName: 'bbc',
    payload: { tag: 'uk' },
    customDecoder: (data) => data.asset
  },
  {
    url: 'http://polling.bbc.co.uk/news/breaking-news/audience/asia',
    eventName: 'bbc',
    payload: { tag: 'asia' },
    customDecoder: (data) => data.asset
  },
  {
    url: 'http://polling.bbc.co.uk/news/breaking-news/audience/us',
    eventName: 'bbc',
    payload: { tag: 'us' },
    customDecoder: (data) => data.asset
  },
  {
    url: 'http://polling.bbc.co.uk/news/breaking-news/audience/international',
    eventName: 'bbc',
    payload: { tag: 'international' },
    customDecoder: (data) => data.asset
  },
  {
    url: 'http://uk.reuters.com/assets/breakingNews?view=json',
    eventName: 'reuters',
    disabled: true,
    payload: { tag: 'UK' }
  },
  {
    url: 'http://reuters.com/assets/breakingNews?view=json',
    eventName: 'reuters',
    payload: { tag: 'US?' }
  },
  { // this one is very loud
    url: 'http://uk.reuters.com/assets/jsonWireNews',
    eventName: 'reuwire',
    disabled: true, // discontinued?
    customDecoder: (data) => data.headlines
  }
]

const requestApi = (bot, api) => {
  if (api.disabled) return
  request(api.url, (err, res, body) => {
    if (err) return bot.log('warn', `Error polling ${api.url}: ${err}`)
    let payload
    try {
      if (res.body.trim() === '') body = '{}' // reuters sends empty on no news
      payload = JSON.parse(body)
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw e
      return bot.log('error', `Syntax error decoding ${api.url}`)// : ${payload} ${body}`)
    }
    if (api.customDecoder) {
      payload = api.customDecoder(payload)
    }
    if (api.payload) {
      payload = Object.assign(api.payload, payload)
    }
    bot.fireEvents(`rawnews:${api.eventName}`, payload)
  })
}

const pollApis = (bot, skip) => {
  APIS.map(a => requestApi(bot, a))
  if (!skip && bot.config.get('news.poll')) {
    setTimeout(pollApis, POLL_TIMEOUT, bot)
  }
}

module.exports = {
  pollApis: pollApis,
  onload: (bot) => {
    if (bot.config.get('news.poll')) {
      pollApis(bot)
    } else {
      bot.log('info', 'Automatic polling of news disabled')
    }
  }
}
