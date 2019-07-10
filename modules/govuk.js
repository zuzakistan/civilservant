const request = require('request-promise')
module.exports = {
  commands: {
    govuk: {
      help: 'Returns a random GOV.UK page',
      command: async function (bot, msg) {
        let res = await request({
          followRedirect: false,
          resolveWithFullResponse: true,
          simple: false,
          url: 'https://www.gov.uk/random'
        })
        bot.fireEvents('url', { href: res.headers.location }, msg.nick, msg.to, msg.text, msg.message)
        bot.fireEvents('url:' + res.headers.location, res.headers.location, msg.nick, msg.to, msg.text, msg.message)
      }
    }
  }
}
