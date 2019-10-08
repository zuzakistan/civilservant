const request = require('request-promise')
const colors = require('irc').colors
module.exports = {
  commands: {
    govuk: {
      help: 'Returns a random GOV.UK page',
      fireMessageEvent: true,
      command: async function () {
        const res = await request({
          followRedirect: false,
          resolveWithFullResponse: true,
          simple: false,
          url: 'https://www.gov.uk/random'
        })
        return res.headers.location
      }
    },
    govorg: {
      help: 'Returns a random UK Government organisation',
      command: async (bot) => {
        const data = await request({
          json: true,
          url: 'https://government-organisation.register.gov.uk/records.json?page-size=5000'
        })
        const orgs = []
        for (const prop in data) {
          if (data.hasOwnProperty(prop)) {
            orgs.push(data[prop])
          }
        }
        console.log(orgs)
        const rand = Math.floor(Math.random() * orgs.length)
        const org = orgs[rand].item[0]
        return `${colors.wrap('white', org.name)} ${colors.wrap('gray', org.website)}`
      }
    }
  }
}
