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
  }
]

const requestApi = async (bot, api) => {
  const { data } = await axios(api.url)
  let payload = data
  if (api.customDecoder) {
    payload = api.customDecoder(payload)
  }
  if (api.payload) {
    payload = Object.assign(api.payload, payload)
  }
  bot.fireEvents(`rawnews:${api.eventName}`, payload)
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
