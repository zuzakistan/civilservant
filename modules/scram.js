const request = require('request-promise')

module.exports = {
  onload: (bot) => {
    bot.isNotDisabled = async () => {
      bot.log('debug', 'Checking GOV.ZK to see if we can tweet')
      const data = await request.get({
        url: `${bot.config.get('govzk.endpoint')}/civilservant/scram.json?key=${bot.config.get('govzk.key')}`,
        json: true,
        maxRedirects: 0
      })
      bot.log('debug', 'GOV.ZK Result: ' + JSON.stringify(data))
      if (data === 'ok') return true
      if (data.reason && data.user) {
        throw new Error(`Scram enabled by ${data.user}: ${data.reason}`)
      }
      throw new Error('Bot is blocked')
    }
  },
  commands: {
    scrammed: {
      help: 'Checks if we can tweet',
      command: async (bot) => (await bot.isNotDisabled()) ? 'not disabled' : 'disabled'
    },
    stop: {
      alias: ['scram'],
      help: 'Links to the emergency stop interface',
      command: () => 'https://zuzakistan.com/civilservant/scram'
    }
  }
}
