const request = require('request')

const POLL_TIMEOUT = 30 * 1000

function APIs (loud) {
  return [
    {
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.mi5.gov.uk/UKThreatLevel/UKThreatLevel.xml',
      eventName: 'mi5'
    },
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
      disabled: !loud,
      customDecoder: (data) => data.headlines
    }
  ]
}

const requestApi = (bot, api) => {
  if (api.disabled) return
  request(api.url, (err, res, body) => {
    if (err) return console.log(`Error polling ${api.url}: ${err}`)
    let payload
    try {
      if (res.body.trim() === '') body = '{}' // reuters sends empty on no news
      payload = JSON.parse(body)
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw e
      return console.log(`Syntax error decoding ${api.url}: ${payload} ${body}`)
    }
    if (api.customDecoder) {
      payload = api.customDecoder(payload)
    }
    if (api.payload) {
      Object.assign(api.payload, payload)
    }
    bot.fireEvents(`rawnews:${api.eventName}`, payload)
  })
}

const pollApis = (bot, skip) => {
  APIs(bot.config.get('news.loud')).map(a => requestApi(bot, a))
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
      console.log('Automatic polling of news disabled')
    }
  }
}
