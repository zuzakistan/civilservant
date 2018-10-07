const bot = require('..')
const request = require('request')

const POLL_TIMEOUT = 30 * 1000

const APIS = [
  {
    url: 'http://www.aljazeera.com/addons/alert.ashx',
    eventName: 'aljaz'
  },
  /* { // Bloomberg seems blocked by CAPTCHAs
    url: 'https://www.bloomberg.com/api/modules/id/africa_breaking_news',
    eventName: 'bloomberg',
    payload: {tag: 'Africa'}
  },
  {
    url: 'https://www.bloomberg.com/api/modules/id/canada_breaking_news',
    eventName: 'bloomberg',
    payload: {tag: 'Canada'}
  },
  {
    url: 'https://www.bloomberg.com/api/modules/id/europe_breaking_news',
    eventName: 'bloomberg',
    payload: {tag: 'Europe'}
  },
  {
    url: 'https://www.bloomberg.com/api/modules/id/us_breaking_news',
    eventname: 'bloomberg',
    payload: {tag: 'us'}
  },
  {
    url: 'https://www.bloomberg.com/api/modules/id/breaking_news',
    eventname: 'bloomberg'
  }, */
  {
    url: 'http://polling.bbc.co.uk/news/latest_breaking_news_waf?audience=Domestic',
    eventName: 'bbc',
    payload: { tag: 'domestic' },
    customDecoder: (data) => data.asset
  },
  {
    url: 'http://polling.bbc.co.uk/news/latest_breaking_news_waf?audience=US',
    eventName: 'bbc2',
    payload: { tag: 'US & Canada' },
    customDecoder: (data) => data.asset
  },
  {
    url: 'http://uk.reuters.com/assets/breakingNews?view=json',
    eventName: 'reuters',
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
    customDecoder: (data) => data.headlines
  }
]

const requestApi = (api) => {
  request(api.url, (err, res, body) => {
    if (err) throw err
    let payload
    try {
      if (res.body.trim() === '') res.body = '{}' // reuters sends empty on no news
      payload = JSON.parse(res.body)
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw e
      return console.log(`Syntax error decoding ${api.url}: ${payload} ${res.body}`)
    }
    if (api.customDecoder) {
      payload = api.customDecoder(payload)
    }
    if (api.payload) {
      Object.assign(api.payload, payload)
    }
    bot.fireEvents(`rawnews:${api.eventName}`, payload)
  })
  setTimeout(poll, pollPeriod)
}

const pollApis = (skip) => {
  APIS.map(requestApi)
  if (!skip && bot.config.get('news.poll')) {
    setTimeout(pollApis, POLL_TIMEOUT)
  }
}

module.exports = { pollApis }

if (bot.config.get('news.poll')) {
  pollApis()
} else {
  console.log('Automatic polling of news disabled')
}
