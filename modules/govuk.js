const request = require('request-promise')
module.exports = {
  commands: {
    govuk: {
      help: 'Returns a random GOV.UK page',
      command: async function () {
        let res = await request({
          followRedirect: false,
          resolveWithFullResponse: true,
          simple: false,
          url: 'https://www.gov.uk/random'
        })
        return res.headers.location
      }
    }
  }
}
